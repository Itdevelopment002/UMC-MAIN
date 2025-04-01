const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/emp-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM emp_info WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM emp_info";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/emp-info", (req, res) => {
  const { description, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = "INSERT INTO emp_info (description, link, issue_date, language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [description, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link, language_code });
  });
});


router.put("/emp-info/:id", (req, res) => {
  const { description, link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = "UPDATE emp_info SET description = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/emp-info/:id", (req, res) => {
  const sql = "DELETE FROM emp_info WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
