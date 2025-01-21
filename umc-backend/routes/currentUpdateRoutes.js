const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/current-update", (req, res) => {

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  const sql = "INSERT INTO currentupdate (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
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


router.get("/current-update", (req, res) => {
  const sql = "SELECT * FROM currentupdate";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/current-update/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM currentupdate WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Current update not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/current-update/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  const sql = "UPDATE currentupdate SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Current update not found" });
    }
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
