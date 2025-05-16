const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");

const upload = multer(getMulterConfig());


router.get("/contacts-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM contact_info WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM contact_info";
  }
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/contacts-info/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM contact_info WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Contact Info not found" });
    }
    res.status(200).json(result[0]);
  });
});


router.post("/contacts-info", verifyToken, upload.single("image"), handleMulterError, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { name, designation, language_code } = req.body;

  if (!name || !designation || !language_code) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res
      .status(400)
      .json({ message: "Name, language code and designation are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO contact_info (heading, description, language_code, image_path) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, designation, language_code, imagePath], (err, result) => {
    if (err) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({
      message: "Contact Info added successfully",
      contactInfoId: result.insertId,
    });
  });
});


router.post("/edit-contacts-info/:id", verifyToken, upload.single("image"), handleMulterError, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;
  const { heading, description, language_code } = req.body;

  let updateSql = "UPDATE contact_info SET";
  const updateParams = [];

  if (heading) {
    updateSql += " heading = ?";
    updateParams.push(heading);
  }

  if (description) {
    updateSql += updateParams.length > 0 ? ", description = ?" : " description = ?";
    updateParams.push(description);
  }

  if (language_code) {
    updateSql += updateParams.length > 0 ? ", language_code = ?" : " language_code = ?";
    updateParams.push(language_code);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql += updateParams.length > 0 ? ", image_path = ?" : " image_path = ?";
    updateParams.push(imagePath);
  }

  if (updateParams.length === 0) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM contact_info WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(404).json({ message: "Contact Info not found" });
    }

    const oldImagePath = result[0].image_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        if (req.file) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldImagePath) {
        const fullPath = path.join(
          __dirname,
          "..",
          oldImagePath.replace(/^\//, "")
        );
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Contact Info updated successfully" });
    });
  });
});


router.post("/delete-contacts-info/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM contact_info WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Contact Info not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM contact_info WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (imagePath) {
        fs.unlink(path.join(__dirname, "..", imagePath), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Contact Info deleted successfully" });
    });
  });
});


module.exports = router;
