const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateEnews } = require("../middleware/validationinputfield.js");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/enews_data", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM e_news WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM e_news";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/enews_data", verifyToken, sanitizeInput, validateEnews, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { info, issue_date, pdf_link, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = `
    INSERT INTO e_news 
    (info, issue_date, pdf_link,language_code) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [info, formattedDate, pdf_link, language_code], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add e-news." });
    }
    res.json({
      id: result.insertId,
      info,
      issue_date,
      pdf_link,
      language_code
    });
  });
});


router.post("/edit-enews_data/:id", verifyToken, sanitizeInput, validateEnews, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { info, issue_date, pdf_link, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = `
    UPDATE e_news 
    SET info = ?, issue_date = ?, pdf_link = ?,
    language_code = ?
    WHERE id = ?
  `;
  db.query(sql, [info, formattedDate, pdf_link, language_code, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update e-news." });
    }
    res.json({ success: true });
  });
});


router.post("/delete-enews_data/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const sql = "DELETE FROM e_news WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete e-news." });
    }
    res.json({ success: true });
  });
});


module.exports = router;
