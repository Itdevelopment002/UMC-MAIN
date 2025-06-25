const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require("../middleware/sanitizeInput.js");
const { validatePhotoGallery, validateUpdatePhotoGallery, validateVideoGallery, validateUpdateVideoGallery } = require("../middleware/validationinputfield.js");


router.get("/video-categories", (req, res) => {
    const language = req.query.lang;
    let query;
    let params = [];
    if (language) {
        query = `SELECT * FROM videocategories WHERE language_code = ?`;
        params.push(language);
    } else {
        query = "SELECT * FROM videocategories";
    }
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


router.post("/video-categories", verifyToken, sanitizeInput, validatePhotoGallery, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { categoryName, language_code } = req.body;
    if (!categoryName || !language_code) return res.status(400).json({ error: "Category name and language code are required" });

    db.query("INSERT INTO videocategories (name, language_code) VALUES (?, ?)", [categoryName, language_code], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category added successfully", id: result.insertId });
    });
});


router.post("/edit-video-categories/:id", verifyToken, sanitizeInput, validateUpdatePhotoGallery, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;
    const { name, language_code } = req.body;

    if (!name || !language_code) return res.status(400).json({ error: "Category name and language code are required" });

    db.query("UPDATE videocategories SET name = ?, language_code = ? WHERE id = ?", [name, language_code, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });

        res.json({ message: "Category updated successfully" });
    });
});


router.post("/delete-video-categories/:id", verifyToken, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;

    db.query("DELETE FROM videocategories WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category deleted successfully" });
    });
});


router.get("/category-videos/:category_id", (req, res) => {
    const { category_id } = req.params;

    db.query("SELECT * FROM category_videos WHERE category_id = ?", [category_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


router.post("/category-videos", verifyToken, sanitizeInput, validateVideoGallery, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { category_id, link } = req.body;

    if (!link) {
        return res.status(400).json({ error: "Link is required" });
    }

    db.query("INSERT INTO category_videos (category_id, video_url) VALUES (?, ?)", [category_id, link], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Video uploaded successfully", id: result.insertId, link });
    });
});


router.post("/edit-category-videos/:id", verifyToken, sanitizeInput, validateUpdateVideoGallery, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { video_url } = req.body;
    const sql = "UPDATE category_videos SET video_url = ? WHERE id = ?";
    db.query(sql, [video_url, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});


router.post("/delete-category-videos/:id", verifyToken, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;

    db.query("DELETE FROM category_videos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category Video deleted successfully" });
    });
});


module.exports = router;