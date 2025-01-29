const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Get all budget records
router.get("/budgets_data", (req, res) => {
  db.query("SELECT * FROM budgets", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new budget record
router.post("/budgets_data", (req, res) => {
  const { year, heading, link } = req.body;
  const sql = "INSERT INTO budgets (year, heading, link) VALUES (?, ?, ?)";
  db.query(sql, [year, heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, year, heading, link });
  });
});

// Update a budget record
router.put("/budgets_data/:id", (req, res) => {
  const { year, heading, link } = req.body;
  const sql = "UPDATE budgets SET year = ?, heading = ?, link = ? WHERE id = ?";
  db.query(sql, [year, heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

// Delete a budget record
router.delete("/budgets_data/:id", (req, res) => {
  const sql = "DELETE FROM budgets WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
