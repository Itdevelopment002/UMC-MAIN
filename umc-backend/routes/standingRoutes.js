const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateCommittee } = require("../middleware/validationinputfield.js");


router.get("/standing-committee", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM standingcommittee WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM standingcommittee";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/standing-committee", verifyToken, sanitizeInput, validateCommittee, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { heading, language_code } = req.body;
  const sql = "INSERT INTO standingcommittee (heading, language_code) VALUES (?, ?)";
  db.query(sql, [heading, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading });
  });
});


router.post("/edit-standing-committee/:id", verifyToken, sanitizeInput, validateCommittee, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { heading, language_code } = req.body;
  const sql = "UPDATE standingcommittee SET heading = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-standing-committee/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const sql = "DELETE FROM standingcommittee WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
