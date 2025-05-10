const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

router.get("/cutting", (req, res) => {
    const query = "SELECT * FROM cutting";

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


router.get("/cutting/:id", (req, res) => {
    const cuttingId = req.params.id;
    const query = "SELECT * FROM cutting WHERE id = ?";

    db.query(query, [cuttingId], (err, results) => {
        if (err) throw err;
        res.json(results.length ? results[0] : { message: "Ribbon Cutting not found" });
    });
});


router.put("/cutting/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = "UPDATE cutting SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            return res
                .status(500)
                .json({ error: "Failed to update celebration" });
        }
        res.json({ message: "Ribbon Cutting updated successfully" });
    });
});

module.exports = router;
