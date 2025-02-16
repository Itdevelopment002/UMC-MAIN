const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/privacy-policy", (req, res) => {
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

router.delete("/privacy-policy/:id", (req, res) => {
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

router.put("/privacy-policy/:id", (req, res) => {
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

module.exports = router;
