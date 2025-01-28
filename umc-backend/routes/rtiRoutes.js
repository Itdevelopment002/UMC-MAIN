const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/rti-info", (req, res) => {
  db.query("SELECT * FROM rti", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/rti-info", (req, res) => {
  const { description, link } = req.body;
  const sql = "INSERT INTO rti (description, link) VALUES (?, ?)";
  db.query(sql, [description, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link });
  });
});

router.put("/rti-info/:id", (req, res) => {
  const { description, link } = req.body;
  const sql = "UPDATE rti SET description = ?, link = ? WHERE id = ?";
  db.query(sql, [description, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/rti-info/:id", (req, res) => {
  const sql = "DELETE FROM rti WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
