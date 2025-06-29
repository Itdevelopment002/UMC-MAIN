const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateMinisterDetails } = require("../middleware/validationinputfield.js");

// Create upload middleware with the shared configuration
const upload = multer(getMulterConfig());

router.get("/minister-details", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = []
  if (language) {
    query = `SELECT * FROM minister WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM minister";
  }
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/minister-details/:id", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  let query;
  let params = [];

  if (id) {
    query = "SELECT * FROM minister WHERE id = ?";
    params.push(id);
  } else if (lang) {
    query = "SELECT * FROM minister WHERE language_code = ?";
    params.push(lang);
  } else {
    query = "SELECT * FROM minister";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (id && results.length === 0) {
      return res.status(404).json({ message: "Minister not found" });
    }
    res.status(200).json(id ? results[0] : results);
  });
});


router.post(
  "/minister-details",
  verifyToken,
  upload.single("image"),
  sanitizeInput,
  handleMulterError,
  validateMinisterDetails,
  (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({
        message: "Permission denied: Admins are not allowed to perform this action.",
      });
    }

    const { name, designation, language_code } = req.body;

    if (!name || !designation || !language_code) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      // return res.status(400).json({ message: "Name, designation and language code are required" });
      return res.status(400).json({
        errors: [{ message: "Name, designation and language code are required" }],
      });

    }

    // 🔍 Check total count of ministers (not per language)
    const countSql = "SELECT COUNT(*) AS count FROM minister";
    db.query(countSql, (countErr, countResult) => {
      if (countErr) {
        if (req.file) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
        }
        return res.status(500).json({ message: "Database error while checking total minister count", error: countErr });
      }

      const totalMinisters = countResult[0].count;
      if (totalMinisters >= 8) {
        if (req.file) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
        }
        return res.status(400).json({
          errors: [{ message: "You can add only 8 ministers in total" }],
        });
      }

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const insertSql = "INSERT INTO minister (name, designation, language_code, image_path) VALUES (?, ?, ?, ?)";
      db.query(insertSql, [name, designation, language_code, imagePath], (err, result) => {
        if (err) {
          if (req.file) {
            fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
          }
          return res.status(500).json({ message: "Database error", error: err });
        }

        res.status(200).json({
          message: "Minister added successfully",
          ministerId: result.insertId,
        });
      });
    });
  }
);


router.post("/edit-minister-details/:id", verifyToken, upload.single("image"), sanitizeInput, handleMulterError, validateMinisterDetails, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;
  const { name, designation, language_code } = req.body;

  let updateSql = "UPDATE minister SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }

  if (designation) {
    updateSql += updateParams.length > 0 ? ", designation = ?" : " designation = ?";
    updateParams.push(designation);
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
    // Clean up uploaded file if no fields to update
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM minister WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      // Clean up uploaded file if DB operation fails
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      // Clean up uploaded file if minister not found
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(404).json({ message: "Minister not found" });
    }

    const oldImagePath = result[0].image_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        // Clean up uploaded file if DB operation fails
        if (req.file) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldImagePath) {
        const fullPath = path.join(__dirname, "..", oldImagePath.replace(/^\//, ""));
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Minister updated successfully" });
    });
  });
});

router.post("/delete-minister-details/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM minister WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Minister not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM minister WHERE id = ?";
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

      res.status(200).json({ message: "Minister deleted successfully" });
    });
  });
});

module.exports = router;