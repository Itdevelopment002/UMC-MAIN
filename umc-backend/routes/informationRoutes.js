const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/information", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM information WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM information";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/information", (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "INSERT INTO information (heading, link, language_code) VALUES (?, ?, ?)";
  db.query(sql, [heading, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});


router.put("/information/:id", (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "UPDATE information SET heading = ?, link = ?, language_code= ? WHERE id = ?";
  db.query(sql, [heading, link,language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/information/:id", (req, res) => {
  const sql = "DELETE FROM information WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
