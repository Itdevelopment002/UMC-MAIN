const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');


router.get("/structure-tab4", (req, res) => {
    const language = req.query.lang;
    let query = "SELECT * FROM structuretab4";
    let params = [];

    if (language) {
        query += " WHERE language_code = ?";
        params.push(language);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results);
    });
});


router.post("/structure-tab4", verifyToken, sanitizeInput, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { ward, officer, language_code } = req.body;

    if (!ward || !officer || !language_code) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sql = "INSERT INTO structuretab4 (ward, officer, language_code) VALUES (?, ?, ?)";
    db.query(sql, [ward.trim(), officer.trim(), language_code], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Failed to insert data." });
        }
        res.json({ id: result.insertId, message: "Data added successfully" });
    });
});


router.post("/edit-structure-tab4/:id", verifyToken, sanitizeInput, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { ward, officer, language_code } = req.body;
    const id = req.params.id;

    if (!ward || !officer || !language_code) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sql = "UPDATE structuretab4 SET ward = ?, officer = ?, language_code = ? WHERE id = ?";
    db.query(sql, [ward.trim(), officer.trim(), language_code, id], (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json({ message: "Failed to update data." });
        }
        res.json({ success: true, message: "Data updated successfully" });
    });
});


router.post("/delete-structure-tab4/:id", verifyToken, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const sql = "DELETE FROM structuretab4 WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            return res.status(500).json({ message: "Failed to delete data." });
        }
        res.json({ success: true, message: "Data deleted successfully" });
    });
});


module.exports = router;
