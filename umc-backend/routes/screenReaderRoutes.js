const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');

router.get("/screen-reader", (req, res) => {
    const language = req.query.lang;
    let query;
    let params = [];
    if (language) {
        query = `SELECT * FROM screen_reader WHERE language_code = ?`;
        params.push(language);
    } else {
        query = "SELECT * FROM screen_reader";
    }

    db.query(query, params, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


router.post("/screen-reader", verifyToken, sanitizeInput, (req, res) => {
    const { name, website, available, language_code } = req.body;

    const sql = "INSERT INTO screen_reader (name, website, available, language_code) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, website, available, language_code], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Failed to add screen reader access" });
        }
        res.status(201).json({ id: result.insertId, name, website, available, language_code });
    });
});


router.post("/edit-screen-reader/:id", verifyToken, sanitizeInput, (req, res) => {
    const { id } = req.params;
    const { name, website, available, language_code } = req.body;
    const sql = "UPDATE screen_reader SET name = ?, website = ?, available = ?, language_code = ? WHERE id = ?";
    db.query(sql, [name, website, available, language_code, id], (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json({ error: "Failed to update screen reader access" });
        }
        res.json({ message: "Screen Reader Access updated successfully" });
    });
});


router.post("/delete-screen-reader/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM screen_reader WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            return res.status(500).json({ error: "Failed to delete screen reader access" });
        }
        res.json({ message: "Screen Reader Access deleted successfully" });
    });
});


module.exports = router;
