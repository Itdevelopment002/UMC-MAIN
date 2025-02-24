const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/sub-rti", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM subrti WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM subrti";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/sub-rti", (req, res) => {
  const { description, link, language_code } = req.body;
  const sql = "INSERT INTO subrti (description, link, language_code) VALUES (?, ?, ?)";
  db.query(sql, [description, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link, language_code });
  });
});


router.put("/sub-rti/:id", (req, res) => {
  const { description, link, language_code } = req.body;
  const sql = "UPDATE subrti SET description = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/sub-rti/:id", (req, res) => {
  const sql = "DELETE FROM subrti WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
