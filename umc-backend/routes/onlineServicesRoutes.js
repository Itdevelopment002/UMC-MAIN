const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

router.get("/online_service", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM online_services WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM online_services";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/online_service", verifyToken, (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "INSERT INTO online_services (heading, link, language_code) VALUES (?, ?, ?)";
  db.query(sql, [heading, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link, language_code });
  });
});


router.put("/online_service/:id", verifyToken, (req, res) => {
  const { heading, link, language_code } = req.body;
  const sql = "UPDATE online_services SET heading = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/online_service/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM online_services WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;