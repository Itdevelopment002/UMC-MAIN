const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/women-committee", (req, res) => {
  db.query("SELECT * FROM womencommittee", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/women-committee", (req, res) => {
  const { heading } = req.body;
  const sql = "INSERT INTO womencommittee (heading) VALUES (?)";
  db.query(sql, [heading], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading });
  });
});

router.put("/women-committee/:id", (req, res) => {
  const { heading } = req.body;
  const sql = "UPDATE womencommittee SET heading = ? WHERE id = ?";
  db.query(sql, [heading, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/women-committee/:id", (req, res) => {
  const sql = "DELETE FROM womencommittee WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
