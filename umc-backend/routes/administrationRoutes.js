const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/administration", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM administration WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM administration";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/administration", (req, res) => {
  const { name, designation, phone,language_code } = req.body;
  const sql = "INSERT INTO administration (name, designation,phone,language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, designation, phone,language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, designation, phone,language_code });
  });
});


router.put("/administration/:id", (req, res) => {
  const { name, designation, phone, language_code } = req.body;
  const sql = "UPDATE administration SET name = ?, designation = ?, phone = ?, language_code = ? WHERE id = ?";
  db.query(sql, [name, designation, phone,language_code, req.params.id], (err, result) => {
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
