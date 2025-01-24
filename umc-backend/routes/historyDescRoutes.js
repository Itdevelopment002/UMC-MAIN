const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/history_desc", (req, res) => {
  db.query("SELECT * FROM history_desc", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching descriptions" });
    }
    res.json(results);
  });
});

router.post("/history_desc", (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  const query = "INSERT INTO history_desc (description) VALUES (?)";
  db.query(query, [description], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Error adding description" });
    }

    res.status(201).json({ id: result.insertId, description });
  });
});

router.delete("/history_desc/:id", (req, res) => {
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

router.put("/history_desc/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  const query = "UPDATE history_desc SET description = ? WHERE id = ?";
  db.query(query, [description, id], (err, result) => {
    if (err) {
      console.error("Error updating description:", err);
      return res.status(500).json({ message: "Error updating description" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Description not found" });
    }

    res.status(200).json({ id, description });
  });
});

module.exports = router;
