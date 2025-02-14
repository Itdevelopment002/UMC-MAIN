const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/umc-news", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM umcnews WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM umcnews";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/umc-news", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO umcnews (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/umc-news/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE umcnews SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/umc-news/:id", (req, res) => {
  const sql = "DELETE FROM umcnews WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
