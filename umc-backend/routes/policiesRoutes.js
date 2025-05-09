const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/policies_data", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM policies WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM policies";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/policies_data", verifyToken, (req, res) => {
  const { heading, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = "INSERT INTO policies (heading,  link, issue_date, language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [heading, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});


router.put("/policies_data/:id", verifyToken, (req, res) => {
  const { heading, link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = "UPDATE policies SET heading = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/policies_data/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM policies WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
