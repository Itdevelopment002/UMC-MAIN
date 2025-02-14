const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/budgets_data", (req, res) => {
  db.query("SELECT * FROM budgets", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/budgets_data", (req, res) => {
  const { year, heading, link } = req.body;
  const sql = "INSERT INTO budgets (year, heading, link) VALUES (?, ?, ?)";
  db.query(sql, [year, heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, year, heading, link });
  });
});


router.put("/budgets_data/:id", (req, res) => {
  const { year, heading, link } = req.body;
  const sql = "UPDATE budgets SET year = ?, heading = ?, link = ? WHERE id = ?";
  db.query(sql, [year, heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/budgets_data/:id", (req, res) => {
  const sql = "DELETE FROM budgets WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
