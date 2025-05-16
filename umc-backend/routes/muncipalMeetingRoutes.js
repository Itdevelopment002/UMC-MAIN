const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/muncipal_meetings", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM muncipal_meeting WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM muncipal_meeting";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/muncipal_meetings", verifyToken, sanitizeInput, (req, res) => {
  const { name, year, pdf_link1, pdf_link2, pdf_link3, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql =
    "INSERT INTO muncipal_meeting (name, year, pdf_link1, pdf_link2, pdf_link3, issue_date, language_code) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, year, pdf_link1, pdf_link2, pdf_link3, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({
      id: result.insertId,
      name,
      year,
      pdf_link1,
      pdf_link2,
      pdf_link3,
      language_code
    });
  });
});


router.post("/edit-muncipal_meetings/:id", verifyToken, sanitizeInput, (req, res) => {
  const { name, year, pdf_link1, pdf_link2, pdf_link3, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql =
    "UPDATE muncipal_meeting SET name = ?, year = ?, pdf_link1 = ?, pdf_link2 = ?, pdf_link3 = ? , issue_date = ?, language_code = ? WHERE id = ?";
  db.query(
    sql,
    [name, year, pdf_link1, pdf_link2, pdf_link3, formattedDate, language_code, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});


router.post("/delete-muncipal_meetings/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM muncipal_meeting WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
