const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/tenders-quotations", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM tenders_quotations WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM tenders_quotations";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/tenders-quotations", (req, res) => {
  const { heading, department, link, language_code } = req.body;
  const sql = "INSERT INTO tenders_quotations (heading, department, link, language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [heading, department, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, department, link, language_code });
  });
});

router.put("/tenders-quotations/:id", (req, res) => {
  const { heading, department, link, language_code } = req.body;
  const sql = "UPDATE tenders_quotations SET heading = ?, department = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, department, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/tenders-quotations/:id", (req, res) => {
  const sql = "DELETE FROM tenders_quotations WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
