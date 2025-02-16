const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/women-committee", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM womencommittee WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM womencommittee";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/women-committee", (req, res) => {
  const { heading, language_code } = req.body;
  const sql = "INSERT INTO womencommittee (heading, language_code) VALUES (?, ?)";
  db.query(sql, [heading, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, language_code });
  });
});

router.put("/women-committee/:id", (req, res) => {
  const { heading, language_code } = req.body;
  const sql = "UPDATE womencommittee SET heading = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, language_code, req.params.id], (err, result) => {
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
