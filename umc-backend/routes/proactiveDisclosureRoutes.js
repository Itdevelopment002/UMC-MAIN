const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/proactive-disclosure", (req, res) => {
  db.query("SELECT * FROM proactive_disclosure", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/proactive-disclosure", (req, res) => {
  const { description, link } = req.body;
  const sql = "INSERT INTO proactive_disclosure (description, link) VALUES (?, ?)";
  db.query(sql, [description, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link });
  });
});

router.put("/proactive-disclosure/:id", (req, res) => {
  const { description, link } = req.body;
  const sql = "UPDATE proactive_disclosure SET description = ?, link = ? WHERE id = ?";
  db.query(sql, [description, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/proactive-disclosure/:id", (req, res) => {
  const sql = "DELETE FROM proactive_disclosure WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
