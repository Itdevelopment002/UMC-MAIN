const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/swms", (req, res) => {
  db.query("SELECT * FROM swms", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/swms", (req, res) => {
  const { description, link } = req.body;
  const sql = "INSERT INTO swms (description, link) VALUES (?, ?)";
  db.query(sql, [description, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link });
  });
});

router.put("/swms/:id", (req, res) => {
  const { description, link } = req.body;
  const sql = "UPDATE swms SET description = ?, link = ? WHERE id = ?";
  db.query(sql, [description, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/swms/:id", (req, res) => {
  const sql = "DELETE FROM swms WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
