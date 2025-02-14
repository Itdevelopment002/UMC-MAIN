const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/commissioner-desc", (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  const sql = "INSERT INTO commissioner_desc (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(201)
      .json({
        message: "Commissioner Description added successfully",
        historyId: result.insertId,
      });
  });
});

router.get("/commissioner-desc", (req, res) => {
  const language = req.query.lang || "en"; // Default to English
  const sql = "SELECT * FROM commissioner_desc WHERE language_code = ?;";
  db.query(sql,[language], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM commissioner_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Commissioner Description not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  const sql = "UPDATE commissioner_desc SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commissioner Description not found" });
    }
    res.status(200).json({ message: "Commissioner Description updated successfully" });
  });
});

router.delete("/commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM commissioner_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commissioner Description not found" });
    }
    res.status(200).json({ message: "Commissioner Description deleted successfully" });
  });
});

module.exports = router;
