const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/elected_data", (req, res) => {
  db.query("SELECT * FROM elected_member", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/elected_data", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO elected_member (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/elected_data/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE elected_member SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/elected_data/:id", (req, res) => {
  const sql = "DELETE FROM elected_member WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
