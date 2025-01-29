const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/rts", (req, res) => {
  db.query("SELECT * FROM rts", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/rts", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO rts (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/rts/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE rts SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/rts/:id", (req, res) => {
  const sql = "DELETE FROM rts WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
