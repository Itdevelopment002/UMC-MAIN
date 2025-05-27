// routes/sliderRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");
const sanitizeInput = require('../middleware/sanitizeInput.js');

// Create upload middleware using global config
const upload = multer(getMulterConfig());

// Routes
router.get("/sliders", (req, res) => {
  const sql = "SELECT * FROM slider";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
});

router.get("/sliders/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM slider WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Slider not found" });
    res.status(200).json(result[0]);
  });
});

router.post("/sliders", verifyToken, upload.single("image"), sanitizeInput, handleMulterError, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { sliderName } = req.body;

  if (!sliderName || !req.file) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({
      message: !sliderName ? "Slider Name is required" : "Image file is required"
    });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const sql = "INSERT INTO slider (name, image_path) VALUES (?, ?)";

  db.query(sql, [sliderName, imagePath], (err, result) => {
    if (err) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({
      message: "Slider added successfully",
      sliderId: result.insertId,
    });
  });
});

router.post("/edit-sliders/:id", verifyToken, upload.single("image"), sanitizeInput,  handleMulterError, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;
  const { name } = req.body;

  if (!name && !req.file) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "No fields to update" });
  }

  let updateSql = "UPDATE slider SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }

  if (req.file) {
    updateSql += updateParams.length > 0 ? ", image_path = ?" : " image_path = ?";
    updateParams.push(`/uploads/${req.file.filename}`);
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM slider WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err || result.length === 0) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(err ? 500 : 404).json({
        message: err ? "Database error" : "Slider not found",
        error: err
      });
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
        fs.unlink(path.join(__dirname, "..", oldImagePath.replace(/^\//, "")), (fsErr) => {
          if (fsErr) console.error("Error deleting old image:", fsErr);
        });
      }

      res.status(200).json({ message: "Slider updated successfully" });
    });
  });
});

router.post("/delete-sliders/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM slider WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Slider not found" });

    const imagePath = result[0].image_path;
    const deleteSql = "DELETE FROM slider WHERE id = ?";

    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      if (imagePath) {
        fs.unlink(path.join(__dirname, "..", imagePath), (fsErr) => {
          if (fsErr) console.error("Error deleting image:", fsErr);
        });
      }

      res.status(200).json({ message: "Slider deleted successfully" });
    });
  });
});

module.exports = router;