const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/privacy-policy", (req, res) => {
  const { heading, description } = req.body;

  const sql = "INSERT INTO policy (heading, description) VALUES (?, ?)";
  db.query(sql, [heading, description], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to add privacy policy" });
    }
    res.status(201).json({ id: result.insertId, heading, description });
  });
});

router.get("/privacy-policy", (req, res) => {
  const sql = "SELECT * FROM policy";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch privacy policy" });
    }
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
  const { heading, description } = req.body;
  const sql = "UPDATE policy SET heading = ?, description = ? WHERE id = ?";
  db.query(sql, [heading, description, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Failed to update privacy policy" });
    }
    res.json({ message: "Privacy Policy updated successfully" });
  });
});

module.exports = router;
