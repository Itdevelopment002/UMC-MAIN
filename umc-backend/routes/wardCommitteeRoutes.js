const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateWardCommittee } = require("../middleware/validationinputfield.js");

router.get("/ward-committee", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM wardcommittee WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM wardcommittee";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/ward-committee", verifyToken, sanitizeInput, validateWardCommittee, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { ward, heading, language_code } = req.body;
  const sql = "INSERT INTO wardcommittee (ward, heading, language_code) VALUES (?, ?, ?)";
  db.query(sql, [ward, heading, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, ward, heading, language_code });
  });
});


router.post("/edit-ward-committee/:id", verifyToken, sanitizeInput, validateWardCommittee, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { ward, heading, language_code } = req.body;
  const sql = "UPDATE wardcommittee SET ward = ?, heading = ?, language_code = ? WHERE id = ?";
  db.query(sql, [ward, heading, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-ward-committee/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const sql = "DELETE FROM wardcommittee WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
