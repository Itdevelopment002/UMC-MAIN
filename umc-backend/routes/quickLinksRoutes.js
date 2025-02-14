const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/quick-link", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM quick_links WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM quick_links";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/quick-link", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO quick_links (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/quick-link/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE quick_links SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/quick-link/:id", (req, res) => {
  const sql = "DELETE FROM quick_links WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
