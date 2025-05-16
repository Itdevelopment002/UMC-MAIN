const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');

router.get("/online-services-home", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM onlineservice WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM onlineservice";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/online-services-home", verifyToken, sanitizeInput, (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "INSERT INTO onlineservice (heading, link, language_code) VALUES (?, ?, ?)";
  db.query(sql, [heading, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link, language_code });
  });
});


router.post("/edit-online-services-home/:id", verifyToken, sanitizeInput, (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "UPDATE onlineservice SET heading = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-online-services-home/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM onlineservice WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
