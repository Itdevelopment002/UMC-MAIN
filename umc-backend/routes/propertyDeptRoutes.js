const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/property-dept", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM property_dept WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM property_dept";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/property-dept", (req, res) => {
  const { description, link, language_code } = req.body;
  const sql = "INSERT INTO property_dept (description, link, language_code) VALUES (?, ?, ?)";
  db.query(sql, [description, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link, language_code });
  });
});

router.put("/property-dept/:id", (req, res) => {
  const { description, link, language_code } = req.body;
  const sql = "UPDATE property_dept SET description = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/property-dept/:id", (req, res) => {
  const sql = "DELETE FROM property_dept WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
