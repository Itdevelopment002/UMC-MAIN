const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/press-note", (req, res) => {
  db.query("SELECT * FROM pressnotes", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/press-note", (req, res) => {
  const { description, link } = req.body;
  const sql = "INSERT INTO pressnotes (description, link) VALUES (?, ?)";
  db.query(sql, [description, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link });
  });
});

router.put("/press-note/:id", (req, res) => {
  const { description, link } = req.body;
  const sql = "UPDATE pressnotes SET description = ?, link = ? WHERE id = ?";
  db.query(sql, [description, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/press-note/:id", (req, res) => {
  const sql = "DELETE FROM pressnotes WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
