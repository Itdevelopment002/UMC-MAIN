const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/rti-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM rti WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM rti";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/rti-info", (req, res) => {
  const { description, link, language_code } = req.body;
  const sql = "INSERT INTO rti (description, link, language_code) VALUES (?, ?, ?)";
  db.query(sql, [description, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link, language_code });
  });
});

router.put("/rti-info/:id", (req, res) => {
  const { description, link, language_code } = req.body;
  const sql = "UPDATE rti SET description = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, link, language_code, req.params.id], (err, result) => {
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
