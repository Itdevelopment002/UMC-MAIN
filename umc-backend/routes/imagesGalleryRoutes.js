const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");

const upload = multer(getMulterConfig());


router.get("/categories", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM categories WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM categories";
  }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.post("/categories", verifyToken, (req, res) => {
  const { categoryName, language_code } = req.body;
  if (!categoryName || !language_code) return res.status(400).json({ error: "Category name is required" });

  db.query("INSERT INTO categories (name, language_code) VALUES (?, ?)", [categoryName, language_code], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category added successfully", id: result.insertId });
  });
});


router.post("/edit-categories/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, language_code } = req.body;

  if (!name || !language_code) return res.status(400).json({ error: "Category name and language code are required" });

  db.query("UPDATE categories SET name = ?, language_code = ? WHERE id = ?", [name, language_code, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category updated successfully" });
  });
});


router.post("/delete-categories/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category deleted successfully" });
  });
});


router.get("/category-images/:category_id", (req, res) => {
  const { category_id } = req.params;

  db.query("SELECT * FROM category_images WHERE category_id = ?", [category_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.post("/category-images", verifyToken, upload.single("image"), handleMulterError, (req, res) => {
  const { category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!image_url) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ error: "Image upload failed" });
  }

  db.query("INSERT INTO category_images (category_id, image_url) VALUES (?, ?)", [category_id, image_url], (err, result) => {
    if (err) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Image uploaded successfully", id: result.insertId, image_url });
  });
});

router.post("/edit-category-images/:id", verifyToken, upload.single("image"), handleMulterError, (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ error: "Image upload required" });
  }

  const newImageUrl = `/uploads/${req.file.filename}`;
  db.query("SELECT image_url FROM category_images WHERE id = ?", [id], (err, results) => {
    if (err) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(404).json({ error: "Image not found" });
    }

    const oldImagePath = results[0].image_url;

    db.query("UPDATE category_images SET image_url = ? WHERE id = ?", [newImageUrl, id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldImagePath) {
        fs.unlink(path.join(
          __dirname,
          "..",
          oldImagePath.replace(/^\//, "")
        ), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old file:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Images updated successfully" });
    });
  });
});


router.post("/delete-category-images/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  db.query("SELECT image_url FROM category_images WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imagePath = `.${results[0].image_url}`;

    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) console.error("Failed to delete file:", unlinkErr);

      db.query("DELETE FROM category_images WHERE id = ?", [id], (deleteErr) => {
        if (deleteErr) return res.status(500).json({ error: deleteErr.message });
        res.json({ message: "Image deleted successfully" });
      });
    });
  });
});


module.exports = router;