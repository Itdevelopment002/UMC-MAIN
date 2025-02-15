const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/current-update", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM currentupdate WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM currentupdate";
  }
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/current-update/:id?", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  let query;
  let params = [];

  if (id) {
    query = "SELECT * FROM currentupdate WHERE id = ?";
    params.push(id);
  } else if (lang) {
    query = "SELECT * FROM currentupdate WHERE language_code = ?";
    params.push(lang);
  } else {
    query = "SELECT * FROM currentupdate";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (id && results.length === 0) {
      return res.status(404).json({ message: "Current update not found" });
    }
    res.status(200).json(id ? results[0] : results);
  });
});


router.post("/current-update", (req, res) => {
  const { description, language_code } = req.body;

  if (!description || !language_code) {
    return res.status(400).json({ message: "Description and Language are required" });
  }

  const sql = "INSERT INTO currentupdate (description, language_code) VALUES (?, ?)";
  db.query(sql, [description, language_code], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Debugging log
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({
      message: "Current update added successfully",
      updatesId: result.insertId,
    });
  });
});


router.put("/current-update/:id", (req, res) => {
  const { description, language_code } = req.body;
  const sql = "UPDATE currentupdate SET description = ?, language_code= ? WHERE id = ?";
  db.query(sql, [description, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: "Current update updated successfully" });
  });
});


router.delete("/current-update/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM currentupdate WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Current update not found" });
    }
    res.status(200).json({ message: "Current update deleted successfully" });
  });
});


module.exports = router;
