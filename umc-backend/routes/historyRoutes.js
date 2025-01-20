const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/history", (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  const sql = "INSERT INTO history (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(201)
      .json({
        message: "History added successfully",
        historyId: result.insertId,
      });
  });
});

router.get("/history", (req, res) => {
  const sql = "SELECT * FROM history";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/history/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM history WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "History not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/history/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  const sql = "UPDATE history SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "History not found" });
    }
    res.status(200).json({ message: "History updated successfully" });
  });
});

router.delete("/history/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM history WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "History not found" });
    }
    res.status(200).json({ message: "History deleted successfully" });
  });
});

module.exports = router;
