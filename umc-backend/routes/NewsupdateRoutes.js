const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/newsupdate", (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  const sql = "INSERT INTO newsupdate (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({
        message: "News update added successfully",
        newsId: result.insertId,
      });
  });
});

router.get("/newsupdate", (req, res) => {
  const sql = "SELECT * FROM newsupdate";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/newsupdate/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM newsupdate WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "News update not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/newsupdate/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  const sql = "UPDATE newsupdate SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News update not found" });
    }
    res.status(200).json({ message: "News update updated successfully" });
  });
});

router.delete("/newsupdate/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM newsupdate WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News update not found" });
    }
    res.status(200).json({ message: "News update deleted successfully" });
  });
});

module.exports = router;
