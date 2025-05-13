const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');

router.get("/privacy-policy", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM policy WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM policy";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/privacy-policy", verifyToken, (req, res) => {
  const { heading, description, language_code } = req.body;

  const sql = "INSERT INTO policy (heading, description, language_code) VALUES (?, ?, ?)";
  db.query(sql, [heading, description, language_code], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to add privacy policy" });
    }
    res.status(201).json({ id: result.insertId, heading, description, language_code });
  });
});


router.post("/edit-privacy-policy/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { heading, description, language_code } = req.body;
  const sql = "UPDATE policy SET heading = ?, description = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, description, language_code, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Failed to update privacy policy" });
    }
    res.json({ message: "Privacy Policy updated successfully" });
  });
});


router.post("/delete-privacy-policy/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM policy WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ error: "Failed to delete privacy policy" });
    }
    res.json({ message: "Privacy Policy deleted successfully" });
  });
});


module.exports = router;
