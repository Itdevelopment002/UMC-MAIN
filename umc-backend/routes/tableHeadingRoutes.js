const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/table-heading", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM table_heading WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM table_heading";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/table-heading", (req, res) => {
  const { tablename, heading, language_code } = req.body;
  const sql = "INSERT INTO table_heading (tablename, heading, language_code) VALUES (?, ?, ?)";
  db.query(sql, [tablename, heading, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, tablename, heading, language_code });
  });
});


router.put("/table-heading/:id", (req, res) => {
  const { tablename, heading, language_code } = req.body;
  const sql = "UPDATE table_heading SET tablename = ?, heading = ?, language_code = ? WHERE id = ?";
  db.query(sql, [tablename, heading, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/table-heading/:id", (req, res) => {
  const sql = "DELETE FROM table_heading WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
