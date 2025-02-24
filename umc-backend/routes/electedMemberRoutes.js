const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/elected_data", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM elected_member WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM elected_member";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/elected_data", (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "INSERT INTO elected_member (heading, link,language_code) VALUES (?, ?,?)";
  db.query(sql, [heading, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link, language_code });
  });
});


router.put("/elected_data/:id", (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "UPDATE elected_member SET heading = ?, link = ? ,language_code = ? WHERE id = ?";
  db.query(sql, [heading, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/elected_data/:id", (req, res) => {
  const sql = "DELETE FROM elected_member WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
