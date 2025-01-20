const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/treatment_facility", (req, res) => {
  const query = "SELECT * FROM treatment_facility";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching inspectors:", err);
      return res.status(500).json({ message: "Error fetching treatment" });
    }
    res.status(200).json(results);
  });
});

router.post("/treatment_facility", (req, res) => {
  const { name, loc, capacity, intake, output } = req.body;

  if (!name || !loc || !capacity || !intake || !output) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO treatment_facility (name, loc, capacity, intake, output) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, loc, capacity, intake, output], (err, result) => {
    if (err) {
      console.error("Error inserting treatment:", err);
      return res.status(500).json({ message: "Error adding treatment" });
    }
    res
      .status(201)
      .json({ id: result.insertId, name, loc, capacity, intake, output });
  });
});

router.put("/treatment_facility/:id", (req, res) => {
  const { id } = req.params;
  const { name, loc, capacity, intake, output } = req.body;

  if (!name || !loc || !capacity || !intake || !output) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE treatment_facility SET name = ?, loc = ?, capacity = ?, intake = ?, output = ? WHERE id = ?";
  db.query(query, [name, loc, capacity, intake, output, id], (err, result) => {
    if (err) {
      console.error("Error updating treatment:", err);
      return res.status(500).json({ message: "Error updating treatment" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    res.status(200).json({ id, name, loc, capacity, intake, output });
  });
});

router.delete("/treatment_facility/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM treatment_facility WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting treatment:", err);
      return res.status(500).json({ message: "Error deleting treatment" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    res.status(204).send();
  });
});

module.exports = router;
