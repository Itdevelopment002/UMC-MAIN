const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/home-services2", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM home_services2 WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM home_services2";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/home-services2", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO home_services2 (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/home-services2/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE home_services2 SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/home-services2/:id", (req, res) => {
  const sql = "DELETE FROM home_services2 WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
