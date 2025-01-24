const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Insert location info with dynamic type
router.post("/location-info", (req, res) => {
  const { heading, description, type } = req.body;  // Now expecting dynamic 'type' from request body

  if (!type || !heading || !description) {
    return res.status(400).json({ error: "Heading, description, and type are required." });
  }

  const sql = "INSERT INTO location_info (type, heading, description) VALUES (?, ?, ?)";
  db.query(sql, [type, heading, description], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to add location info" });
    }
    res.status(201).json({ id: result.insertId, heading, description, type });
  });
});

// Fetch location info with dynamic type filtering (optional if needed)
router.get("/location-info", (req, res) => {
  const { type } = req.query; // Optional query parameter for filtering by type

  let sql = "SELECT * FROM location_info";
  const queryParams = [];

  if (type) {
    sql += " WHERE type = ?";
    queryParams.push(type);
  }

  db.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch location info" });
    }
    res.json(results);
  });
});

// Delete location info by ID
router.delete("/location-info/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM location_info WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ error: "Failed to delete location info" });
    }
    res.json({ message: "Location Info deleted successfully" });
  });
});

// Update location info by ID, with dynamic type handling
router.put("/location-info/:id", (req, res) => {
  const { id } = req.params;
  const { heading, description } = req.body;
  const sql = "UPDATE location_info SET heading = ?, description = ? WHERE id = ?";
  db.query(sql, [heading, description, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Failed to update location Data" });
    }
    res.json({ message: "Location Data updated successfully" });
  });
});

module.exports = router;
