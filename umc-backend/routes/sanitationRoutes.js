const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/sanitation_inspectors", (req, res) => {
  const query = "SELECT * FROM sanitation_inspectors";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching inspectors:", err);
      return res.status(500).json({ message: "Error fetching inspectors" });
    }
    res.status(200).json(results);
  });
});

router.post("/sanitation_inspectors", (req, res) => {
  const { zone_no, names, mob_no, ward_no } = req.body;

  if (!zone_no || !names || !mob_no || !ward_no) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO sanitation_inspectors (zone_no, names, mob_no, ward_no) VALUES (?, ?, ?, ?)";
  db.query(query, [zone_no, names, mob_no, ward_no], (err, result) => {
    if (err) {
      console.error("Error inserting inspector:", err);
      return res.status(500).json({ message: "Error adding inspector" });
    }
    res
      .status(201)
      .json({ id: result.insertId, zone_no, names, mob_no, ward_no });
  });
});

router.put("/sanitation_inspectors/:id", (req, res) => {
  const { id } = req.params;
  const { zone_no, names, mob_no, ward_no } = req.body;

  if (!zone_no || !names || !mob_no || !ward_no) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "UPDATE sanitation_inspectors SET zone_no = ?, names = ?, mob_no = ?, ward_no = ? WHERE id = ?";
  db.query(query, [zone_no, names, mob_no, ward_no, id], (err, result) => {
    if (err) {
      console.error("Error updating inspector:", err);
      return res.status(500).json({ message: "Error updating inspector" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Inspector not found" });
    }

    res.status(200).json({ id, zone_no, names, mob_no, ward_no });
  });
});

router.delete("/sanitation_inspectors/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM sanitation_inspectors WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting inspector:", err);
      return res.status(500).json({ message: "Error deleting inspector" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Inspector not found" });
    }

    res.status(204).send();
  });
});

module.exports = router;
