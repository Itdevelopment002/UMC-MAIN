const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');


router.get("/history_desc", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM history_desc WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM history_desc";
  }
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching descriptions" });
    }
    res.json(results);
  });
});


router.post("/history_desc", verifyToken, (req, res) => {
  const { description, language_code } = req.body;
  const query = "INSERT INTO history_desc (description, language_code) VALUES (?, ?)";
  db.query(query, [description, language_code], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Error adding description" });
    }

    res.status(201).json({ id: result.insertId, description });
  });
});


router.post("/edit-history_desc/:id", verifyToken, (req, res) => {
  const { description, language_code } = req.body;
  const sql = "UPDATE history_desc SET description = ?, language_code= ? WHERE id = ?";
  db.query(sql, [description, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.post("/delete-history_desc/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM history_desc WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting description:", err);
      return res.status(500).json({ message: "Error deleting description" });
    }

    res.status(204).send();
  });
});


module.exports = router;
