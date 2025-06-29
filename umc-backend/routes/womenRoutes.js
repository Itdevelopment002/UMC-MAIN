const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateCommittee } = require("../middleware/validationinputfield.js");

router.get("/women-committee", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM womencommittee WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM womencommittee";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/women-committee", verifyToken, sanitizeInput, validateCommittee, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { heading, language_code } = req.body;
  const sql = "INSERT INTO womencommittee (heading, language_code) VALUES (?, ?)";
  db.query(sql, [heading, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, language_code });
  });
});


router.post("/edit-women-committee/:id", verifyToken, sanitizeInput, validateCommittee, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { heading, language_code } = req.body;
  const sql = "UPDATE womencommittee SET heading = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-women-committee/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const sql = "DELETE FROM womencommittee WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
