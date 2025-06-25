const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validatestructuretab2 } = require("../middleware/validationinputfield.js");

router.get("/structure-tab3", (req, res) => {
    const language = req.query.lang;
    let query;
    let params = [];
    if (language) {
        query = `SELECT * FROM structuretab3 WHERE language_code = ?`;
        params.push(language);
    } else {
        query = "SELECT * FROM structuretab3";
    }
    db.query(query, params, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


router.post("/structure-tab3", verifyToken, sanitizeInput, validatestructuretab2, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { heading1, heading2, heading3, heading4, language_code } = req.body;
    if (!heading1 || !heading2 || !heading3 || !heading4 || !language_code) {
        return res.status(400).json({ message: "All fields are required." });
    }
    const sql = "INSERT INTO structuretab3 (heading1, heading2, heading3, heading4, language_code) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [heading1.trim(), heading2.trim(), heading3.trim(), heading4.trim(), language_code], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, heading1, heading2, heading3, heading4, language_code });
    });
});


router.post("/edit-structure-tab3/:id", verifyToken, sanitizeInput, validatestructuretab2, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { heading1, heading2, heading3, heading4, language_code } = req.body;
    const sql = "UPDATE structuretab3 SET heading1 = ?, heading2 = ?, heading3 = ?, heading4 = ?, language_code = ? WHERE id = ?";
    db.query(sql, [heading1.trim(), heading2.trim(), heading3.trim(), heading4.trim(), language_code, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});


router.post("/delete-structure-tab3/:id", verifyToken, (req, res) => {
    if (req.user?.role === "Admin") {
        return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const sql = "DELETE FROM structuretab3 WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});


module.exports = router;