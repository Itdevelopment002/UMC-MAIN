const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/property_holder", (req, res) => {
  db.query("SELECT * FROM property_holder", (err, results) => {
    if (err) {
      console.error("Error fetching property holders:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    res.json(results);
  });
});

router.post("/property_holder", (req, res) => {
  const { heading, description, property } = req.body;
  if (!heading || !description || !property) {
    return res
      .status(400)
      .json({ error: "Heading, description, and property are required" });
  }

  const sql =
    "INSERT INTO property_holder (heading, description, property) VALUES (?, ?, ?)";
  db.query(sql, [heading, description, property], (err, result) => {
    if (err) {
      console.error("Error adding property holder:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    res
      .status(201)
      .json({ id: result.insertId, heading, description, property });
  });
});

router.put("/property_holder/:id", (req, res) => {
  const { id } = req.params;
  const { heading, description, property } = req.body;

  const sql =
    "UPDATE property_holder SET heading = ?, description = ?, property = ? WHERE id = ?";
  db.query(sql, [heading, description, property, id], (err, result) => {
    if (err) {
      console.error("Error updating property holder:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Property holder not found" });
    }
    res.json({ message: "Property holder updated successfully" });
  });
});

router.delete("/property_holder/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM property_holder WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting property holder:", err);
      return res.status(500).json({ error: "Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Property holder not found" });
    }
    res.status(204).send();
  });
});

module.exports = router;
