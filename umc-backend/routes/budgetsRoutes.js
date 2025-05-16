const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


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


router.post("/budgets_data", verifyToken, sanitizeInput, (req, res) => {
  const { year, heading, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = "INSERT INTO budgets (year, heading, link, issue_date, language_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [year, heading, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, year, heading, link, formattedDate, language_code });
  });
});


router.post("/edit-budgets_data/:id", verifyToken, sanitizeInput, (req, res) => {
  const { year, heading, link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = "UPDATE budgets SET year = ?, heading = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [year, heading, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-budgets_data/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM budgets WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
