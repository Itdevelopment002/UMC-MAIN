const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


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


router.post("/property-dept", verifyToken, (req, res) => {
  const { description, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = "INSERT INTO property_dept (description, link, issue_date, language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [description, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link, language_code });
  });
});


router.post("/edit-property-dept/:id", verifyToken, (req, res) => {
  const { description, link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = "UPDATE property_dept SET description = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-property-dept/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM property_dept WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
