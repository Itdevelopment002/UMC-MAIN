const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


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


router.post("/tenders-quotations", verifyToken, sanitizeInput, (req, res) => {
  const { heading, department, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = "INSERT INTO tenders_quotations (heading, department, link, issue_date, language_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [heading, department, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, department, link, language_code });
  });
});


router.post("/edit-tenders-quotations/:id", verifyToken, sanitizeInput, (req, res) => {
  const { heading, department, link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = "UPDATE tenders_quotations SET heading = ?, department = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, department, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-tenders-quotations/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM tenders_quotations WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
