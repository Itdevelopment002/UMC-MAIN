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

router.post("/categories", (req, res) => {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ error: "Category name is required" });

    db.query("INSERT INTO categories (name) VALUES (?)", [categoryName], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category added successfully", id: result.insertId });
    });
});

router.put("/categories/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Category name is required" });

    db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });

        res.json({ message: "Category updated successfully" });
    });
});

router.post("/category-images", upload.single("image"), (req, res) => {
    const { category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image_url) {
        return res.status(400).json({ error: "Image upload failed" });
    }

    db.query("SELECT COUNT(*) AS count FROM category_images WHERE category_id = ?", [category_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results[0].count >= 8) {
            return res.status(400).json({ error: "Maximum 8 images allowed per category" });
        }

        db.query("INSERT INTO category_images (category_id, image_url) VALUES (?, ?)", [category_id, image_url], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Image uploaded successfully", id: result.insertId, image_url });
        });
    });
});

router.put("/category-images/:id", upload.single("image"), (req, res) => {
    const { id } = req.params;

    if (!req.file) return res.status(400).json({ error: "Image upload required" });

    const newImageUrl = `/uploads/${req.file.filename}`;
    db.query("SELECT image_url FROM category_images WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        const oldImagePath = `.${results[0].image_url}`;

        // Update the database with the new image
        db.query("UPDATE category_images SET image_url = ? WHERE id = ?", [newImageUrl, id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });

            // Delete the old image file from storage
            fs.unlink(oldImagePath, (unlinkErr) => {
                if (unlinkErr) console.error("Failed to delete old image:", unlinkErr);
                res.json({ message: "Image updated successfully", image_url: newImageUrl });
            });
        });
    });
});


router.get("/categories", (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get("/category-images/:category_id", (req, res) => {
    const { category_id } = req.params;

    db.query("SELECT * FROM category_images WHERE category_id = ?", [category_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.delete("/categories/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category deleted successfully" });
    });
});

router.delete("/category-images/:id", (req, res) => {
    const { id } = req.params;

    // Get image path before deleting
    db.query("SELECT image_url FROM category_images WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: "Image not found" });
        }

        const imagePath = `.${results[0].image_url}`;

        // Delete image file from uploads directory
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
