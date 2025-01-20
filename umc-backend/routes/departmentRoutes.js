const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");

router.get("/departments", (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/departments", (req, res) => {
  const { name, hod } = req.body;
  const sql = "INSERT INTO departments (name, hod) VALUES (?, ?)";
  db.query(sql, [name, hod], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, hod });
  });
});

router.put("/departments/:id", (req, res) => {
  const { name, hod } = req.body;
  const sql = "UPDATE departments SET name = ?, hod = ? WHERE id = ?";
  db.query(sql, [name, hod, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/departments/:id", (req, res) => {
  const sql = "DELETE FROM departments WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
