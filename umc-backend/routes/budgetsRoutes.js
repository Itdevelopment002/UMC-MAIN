const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/budgets_data", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM budgets WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM budgets";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/budgets_data", (req, res) => {
  const { year, heading, link ,language_code} = req.body;
  const sql = "INSERT INTO budgets (year, heading, link,language_code) VALUES (?, ?, ?,?)";
  db.query(sql, [year, heading, link,language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, year, heading, link ,language_code});
  });
});


router.put("/budgets_data/:id", (req, res) => {
  const { year, heading, link,language_code } = req.body;
  const sql = "UPDATE budgets SET year = ?, heading = ?, link = ?,language_code = ? WHERE id = ?";
  db.query(sql, [year, heading, link,language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/budgets_data/:id", (req, res) => {
  const sql = "DELETE FROM budgets WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
