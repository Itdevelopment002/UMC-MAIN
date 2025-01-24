const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/administration", (req, res) => {
  db.query("SELECT * FROM administration", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/administration", (req, res) => {
  const { name,designation, phone } = req.body;
  const sql = "INSERT INTO administration (name, designation,phone) VALUES (?, ?,?)";
  db.query(sql, [name, designation,phone], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, designation,phone });
  });
});

router.put("/administration/:id", (req, res) => {
  const { name, designation,phone } = req.body;
  const sql = "UPDATE administration SET name = ?, designation = ?, phone = ? WHERE id = ?";
  db.query(sql, [name, designation,phone, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/administration/:id", (req, res) => {
  const sql = "DELETE FROM administration WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
