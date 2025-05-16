const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require('../utils/uploadValidation');

// Create upload middleware using global config
const upload = multer(getMulterConfig());

const deleteFileIfExists = async (filePath) => {
  try {
    if (filePath) {
      const fullPath = path.join(__dirname, '..', filePath);
      await fs.unlink(fullPath);
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
};

router.get("/portal-services", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM portalservices WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM portalservices";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/portal-services/:id", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  let query;
  let params = [];

  if (id) {
    query = "SELECT * FROM portalservices WHERE id = ?";
    params.push(id);
  } else if (lang) {
    query = "SELECT * FROM portalservices WHERE language_code = ?";
    params.push(lang);
  } else {
    query = "SELECT * FROM portalservices";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (id && results.length === 0) {
      return res.status(404).json({ message: "Portal Service not found" });
    }
    res.status(200).json(id ? results[0] : results);
  });
});

router.post(
  "/portal-services",
  verifyToken,
  upload.fields([{ name: "portalImage", maxCount: 1 }]),
  handleMulterError,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { heading, description, link, language_code } = req.body;
    if (!heading || !description || !link || !language_code) {
      // Clean up uploaded files if validation fails
      if (req.files?.portalImage) {
        await deleteFileIfExists(`/uploads/${req.files.portalImage[0].filename}`);
      }
      return res.status(400).json({
        message: "Portal Service heading, description, language code and link are required"
      });
    }

    let mainIconPath = null;
    if (req.files?.portalImage) {
      mainIconPath = `/uploads/${req.files.portalImage[0].filename}`;
    }

    const insertSql =
      "INSERT INTO portalservices (heading, description, link, language_code, main_icon_path) VALUES (?, ?, ?, ?, ?)";
    const insertParams = [
      heading,
      description,
      link,
      language_code,
      mainIconPath,
    ];

    db.query(insertSql, insertParams, async (err, result) => {
      if (err) {
        if (mainIconPath) {
          await deleteFileIfExists(mainIconPath);
        }
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(201).json({
        message: "Portal Service added successfully",
        portalId: result.insertId,
      });
    });
  }
);

router.post(
  "/edit-portal-services/:id",
  verifyToken,
  upload.fields([{ name: "portalImage", maxCount: 1 }]),
  handleMulterError,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;
    const { heading, description, link, language_code } = req.body;

    if (!heading && !description && !link && !language_code && !req.files?.portalImage) {
      return res.status(400).json({ message: "No fields to update" });
    }

    let updateSql = "UPDATE portalservices SET";
    const updateParams = [];
    const updates = [];

    if (heading) {
      updates.push("heading = ?");
      updateParams.push(heading);
    }

    if (description) {
      updates.push("description = ?");
      updateParams.push(description);
    }

    if (link) {
      updates.push("link = ?");
      updateParams.push(link);
    }

    if (language_code) {
      updates.push("language_code = ?");
      updateParams.push(language_code);
    }

    let newMainIconPath;
    if (req.files?.portalImage) {
      newMainIconPath = `/uploads/${req.files.portalImage[0].filename}`;
      updates.push("main_icon_path = ?");
      updateParams.push(newMainIconPath);
    }

    updateSql += ' ' + updates.join(', ') + ' WHERE id = ?';
    updateParams.push(id);

    const selectSql = "SELECT main_icon_path FROM portalservices WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err || result.length === 0) {
        if (req.files?.portalImage) {
          await deleteFileIfExists(newMainIconPath);
        }
        return res.status(err ? 500 : 404).json({
          message: err ? 'Database error' : 'Portal Service not found',
          error: err
        });
      }

      const oldMainIconPath = result[0].main_icon_path;

      db.query(updateSql, updateParams, async (err, updateResult) => {
        if (err) {
          if (req.files?.portalImage) {
            await deleteFileIfExists(newMainIconPath);
          }
          return res.status(500).json({ message: "Database error", error: err });
        }

        if (req.files?.portalImage && oldMainIconPath) {
          await deleteFileIfExists(oldMainIconPath);
        }

        res.status(200).json({ message: "Portal Service updated successfully" });
      });
    });
  }
);

router.post("/delete-portal-services/:id", verifyToken, async (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;

  const selectSql = "SELECT main_icon_path FROM portalservices WHERE id = ?";
  db.query(selectSql, [id], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Portal Service not found" });
    }

    const mainIconPath = result[0].main_icon_path;
    const deleteSql = "DELETE FROM portalservices WHERE id = ?";

    db.query(deleteSql, [id], async (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      await deleteFileIfExists(mainIconPath);

      res.status(200).json({ message: "Portal Service deleted successfully" });
    });
  });
});

module.exports = router;