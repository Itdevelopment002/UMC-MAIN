const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require('../utils/uploadValidation');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateCitizenServices } = require("../middleware/validationinputfield.js");


// Create upload middleware using global config
const upload = multer(getMulterConfig({
  fields: [{ name: "mainIcon", maxCount: 1 }]
}));

const deleteFileIfExists = async (filePath) => {
  try {
    if (filePath) {
      const fullPath = path.join(__dirname, "../", filePath);
      await fs.unlink(fullPath);
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
};

router.get("/citizen-services", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM citizen_services WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM citizen_services";
  }
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/citizen-services/:id", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  let query;
  let params = [];

  if (id) {
    query = "SELECT * FROM citizen_services WHERE id = ?";
    params.push(id);
  } else if (lang) {
    query = "SELECT * FROM citizen_services WHERE language_code = ?";
    params.push(lang);
  } else {
    query = "SELECT * FROM citizen_services";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (id && results.length === 0) {
      return res.status(404).json({ message: "Citizen Service not found" });
    }
    res.status(200).json(id ? results[0] : results);
  });
});

router.post(
  "/citizen-services",
  verifyToken,
  upload.fields([{ name: "mainIcon", maxCount: 1 }]),
  sanitizeInput,
  handleMulterError,
  validateCitizenServices,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { serviceHeading, serviceLink, language_code } = req.body;

    if (!serviceHeading || !serviceLink || !language_code) {
      if (req.files?.mainIcon) {
        await deleteFileIfExists(req.files.mainIcon[0].path);
      }
      return res.status(400).json({
        message: "Service heading, link and language code are required"
      });
    }

    if (!req.files?.mainIcon) {
      return res.status(400).json({ message: "Main icon is required" });
    }

    const mainIconPath = path.join("uploads", req.files.mainIcon[0].filename);

    const insertSql = `
      INSERT INTO citizen_services 
      (service_heading, service_link, language_code, main_icon_path) 
      VALUES (?, ?, ?, ?)
    `;
    const insertParams = [serviceHeading, serviceLink, language_code, mainIconPath];

    db.query(insertSql, insertParams, async (err, result) => {
      if (err) {
        await deleteFileIfExists(mainIconPath);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({
        message: "Citizen Service added successfully",
        serviceId: result.insertId,
      });
    });
  }
);

router.post(
  "/edit-citizen-services/:id",
  verifyToken,
  upload.fields([{ name: "mainIcon", maxCount: 1 }]),
  sanitizeInput,
  handleMulterError,
  validateCitizenServices,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;
    const { serviceHeading, serviceLink, language_code } = req.body;

    if (!serviceHeading && !serviceLink && !language_code && !req.files?.mainIcon) {
      if (req.files?.mainIcon) {
        await deleteFileIfExists(req.files.mainIcon[0].path);
      }
      return res.status(400).json({ message: "No fields to update" });
    }

    let updateSql = "UPDATE citizen_services SET";
    const updateParams = [];
    const updates = [];

    if (serviceHeading) {
      updates.push("service_heading = ?");
      updateParams.push(serviceHeading);
    }

    if (serviceLink) {
      updates.push("service_link = ?");
      updateParams.push(serviceLink);
    }

    if (language_code) {
      updates.push("language_code = ?");
      updateParams.push(language_code);
    }

    let newMainIconPath;
    if (req.files?.mainIcon) {
      newMainIconPath = path.join("uploads", req.files.mainIcon[0].filename);
      updates.push("main_icon_path = ?");
      updateParams.push(newMainIconPath);
    }

    updateSql += " " + updates.join(", ") + " WHERE id = ?";
    updateParams.push(id);

    const selectSql = "SELECT main_icon_path FROM citizen_services WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err || result.length === 0) {
        if (req.files?.mainIcon) {
          await deleteFileIfExists(newMainIconPath);
        }
        return res.status(err ? 500 : 404).json({
          message: err ? "Database error" : "Citizen Service not found",
          error: err
        });
      }

      const oldMainIconPath = result[0].main_icon_path;

      db.query(updateSql, updateParams, async (err) => {
        if (err) {
          if (req.files?.mainIcon) {
            await deleteFileIfExists(newMainIconPath);
          }
          return res.status(500).json({ message: "Database error", error: err });
        }

        if (req.files?.mainIcon && oldMainIconPath) {
          await deleteFileIfExists(oldMainIconPath);
        }

        res.status(200).json({ message: "Citizen Service updated successfully" });
      });
    });
  }
);

router.post(
  "/delete-citizen-services/:id",
  verifyToken,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;

    const selectSql = "SELECT main_icon_path FROM citizen_services WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Citizen Service not found" });
      }

      const mainIconPath = result[0].main_icon_path;
      const deleteSql = "DELETE FROM citizen_services WHERE id = ?";

      db.query(deleteSql, [id], async (err) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }

        await deleteFileIfExists(mainIconPath);

        res.status(200).json({ message: "Citizen Service deleted successfully" });
      });
    });
  }
);

module.exports = router;