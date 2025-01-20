const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/awards", (req, res) => {
  db.query("SELECT * FROM awards", (err, results) => {
    if (err) {
      console.error("Error fetching awards:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    res.json(results);
  });
});

router.post("/awards", (req, res) => {
  const { heading, description } = req.body;
  if (!heading || !description) {
    return res
      .status(400)
      .json({ error: "Heading and description are required" });
  }

  const sql = "INSERT INTO awards (heading, description) VALUES (?, ?)";
  db.query(sql, [heading, description], (err, result) => {
    if (err) {
      console.error("Error adding awards:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    res.status(201).json({ id: result.insertId, heading, description });
  });
});

router.put("/awards/:id", (req, res) => {
  const { id } = req.params;
  const { heading, description } = req.body;

  const sql = "UPDATE awards SET heading = ?, description = ? WHERE id = ?";
  db.query(sql, [heading, description, id], (err, result) => {
    if (err) {
      console.error("Error updating awards:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Awards not found" });
    }
    res.json({ message: "Awards updated successfully" });
  });
});

router.delete("/awards/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM awards WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting award:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Awards not found" });
    }
    res.status(204).send();
  });
});

module.exports = router;
