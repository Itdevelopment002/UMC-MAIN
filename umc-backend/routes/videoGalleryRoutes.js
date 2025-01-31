const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/video-categories", (req, res) => {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ error: "Category name is required" });

    db.query("INSERT INTO videocategories (name) VALUES (?)", [categoryName], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category added successfully", id: result.insertId });
    });
});

router.put("/video-categories/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Category name is required" });

    db.query("UPDATE videocategories SET name = ? WHERE id = ?", [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });

        res.json({ message: "Category updated successfully" });
    });
});

router.post("/category-videos", (req, res) => {
    const { category_id, link } = req.body;

    if (!link) {
        return res.status(400).json({ error: "Link is required" });
    }

    db.query("SELECT COUNT(*) AS count FROM category_videos WHERE category_id = ?", [category_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results[0].count >= 8) {
            return res.status(400).json({ error: "Maximum 8 images allowed per category" });
        }

        db.query("INSERT INTO category_videos (category_id, video_url) VALUES (?, ?)", [category_id, link], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Video uploaded successfully", id: result.insertId, link });
        });
    });
});

router.put("/video-categories/:id", (req, res) => {
    const { video_url } = req.body;
    const sql = "UPDATE category_videos SET video_url = ? WHERE id = ?";
    db.query(sql, [video_url, req.params.id], (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });


router.get("/video-categories", (req, res) => {
    db.query("SELECT * FROM videocategories", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get("/category-videos/:category_id", (req, res) => {
    const { category_id } = req.params;

    db.query("SELECT * FROM category_videos WHERE category_id = ?", [category_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.delete("/video-categories/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM videocategories WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category deleted successfully" });
    });
});

router.delete("/categories-videos/:id", (req, res) => {
    const sql = "DELETE FROM category_videos WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });

module.exports = router;
