const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');


router.get("/structure-tab1", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM structuretab1 WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM structuretab1";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/structure-tab1", verifyToken, (req, res) => {
  const { heading1, heading2, language_code } = req.body;
  const sql = "INSERT INTO structuretab1 (heading1, heading2, language_code) VALUES (?, ?, ?)";
  db.query(sql, [heading1, heading2, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading1, heading2, language_code });
  });
});


router.post("/edit-structure-tab1/:id", verifyToken, (req, res) => {
  const { heading1, heading2, language_code } = req.body;
  const sql = "UPDATE structuretab1 SET heading1 = ?, heading2 = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading1, heading2, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-structure-tab1/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM structuretab1 WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
