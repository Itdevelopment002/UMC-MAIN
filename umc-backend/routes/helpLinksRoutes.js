const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/helps", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM help WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM help";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/helps", (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "INSERT INTO help (heading, link, language_code) VALUES (?, ?, ?)";
  db.query(sql, [heading, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link, language_code });
  });
});

router.put("/helps/:id", (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "UPDATE help SET heading = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/helps/:id", (req, res) => {
  const sql = "DELETE FROM help WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
