const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/department-pdfs", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM deptpdf WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM deptpdf";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/department-pdfs", (req, res) => {
  const { department, heading, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = "INSERT INTO deptpdf (department, heading, link, issue_date, language_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [department, heading, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, department, heading, link, language_code });
  });
});


router.put("/department-pdfs/:id", (req, res) => {
  const { department, heading, link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = "UPDATE deptpdf SET department = ?, heading = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [department, heading, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/department-pdfs/:id", (req, res) => {
  const sql = "DELETE FROM deptpdf WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
