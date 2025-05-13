const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/emp-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  
  if (language) {
    query = `SELECT * FROM empInfo WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM empInfo";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ 
        error: true,
        message: "Database error occurred",
        details: err.message 
      });
    }
    res.json(results);
  });
});


router.post("/emp-info", verifyToken, (req, res) => {
  const { description, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = "INSERT INTO empInfo (description, link, issue_date, language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [description, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link, language_code });
  });
});


router.post("/edit-emp-info/:id", verifyToken, (req, res) => {
  const { description, link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = "UPDATE empInfo SET description = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-emp-info/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM empInfo WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
