const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/annual-finance", (req, res) => {
  db.query("SELECT * FROM annualfinance", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/annual-finance", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO annualfinance (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});


router.put("/annual-finance/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE annualfinance SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/annual-finance/:id", (req, res) => {
  const sql = "DELETE FROM annualfinance WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
