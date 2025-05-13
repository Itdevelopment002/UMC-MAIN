const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');


router.get("/celebration", (req, res) => {
    const query = "SELECT * FROM celebration";

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


router.get("/celebration/:id", (req, res) => {
    const celebrationId = req.params.id;
    const query = "SELECT * FROM celebration WHERE id = ?";

    db.query(query, [celebrationId], (err, results) => {
        if (err) throw err;
        res.json(results.length ? results[0] : { message: "Celebration not found" });
    });
});


router.post("/edit-celebration/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = "UPDATE celebration SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            return res
                .status(500)
                .json({ error: "Failed to update celebration" });
        }
        res.json({ message: "Celebration updated successfully" });
    });
});


module.exports = router;
