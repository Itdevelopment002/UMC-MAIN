const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateTableHeading } = require("../middleware/validationinputfield.js");

router.get("/table-heading", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM table_heading WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM table_heading";
  }
  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/table-heading", verifyToken, sanitizeInput, validateTableHeading, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { tablename, heading, language_code } = req.body;
  const sql = "INSERT INTO table_heading (tablename, heading, language_code) VALUES (?, ?, ?)";
  db.query(sql, [tablename, heading, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, tablename, heading, language_code });
  });
});


router.post("/edit-table-heading/:id", verifyToken, sanitizeInput, validateTableHeading, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { tablename, heading, language_code } = req.body;
  const sql = "UPDATE table_heading SET tablename = ?, heading = ?, language_code = ? WHERE id = ?";
  db.query(sql, [tablename, heading, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-table-heading/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const sql = "DELETE FROM table_heading WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
