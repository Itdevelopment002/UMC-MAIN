const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/litigations", (req, res) => {
  db.query("SELECT * FROM litigations", (err, results) => {
    if (err) {
      console.error("Error fetching litigations:", err);
      return res.status(500).json({ message: "Error fetching litigations" });
    }
    res.json(results);
  });
});

router.post("/litigations", (req, res) => {
  const { ward_no, name_lawsuit, mob_no } = req.body;

  if (!ward_no || !name_lawsuit || !mob_no) {
    return res
      .status(400)
      .json({
        message: "All fields (ward_no, name_lawsuit, mob_no) are required",
      });
  }

  const query =
    "INSERT INTO litigations (ward_no, name_lawsuit, mob_no) VALUES (?, ?, ?)";
  db.query(query, [ward_no, name_lawsuit, mob_no], (err, result) => {
    if (err) {
      console.error("Error inserting litigation:", err);
      return res.status(500).json({ message: "Error adding litigation" });
    }

    res
      .status(201)
      .json({ id: result.insertId, ward_no, name_lawsuit, mob_no });
  });
});

router.delete("/litigations/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM litigations WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting litigation:", err);
      return res.status(500).json({ message: "Error deleting litigation" });
    }

    res.status(204).send();
  });
});

router.put("/litigations/:id", (req, res) => {
  const { id } = req.params;
  const { ward_no, name_lawsuit, mob_no } = req.body;

  if (!ward_no || !name_lawsuit || !mob_no) {
    return res
      .status(400)
      .json({
        message: "All fields (ward_no, name_lawsuit, mob_no) are required",
      });
  }

  const query =
    "UPDATE litigations SET ward_no = ?, name_lawsuit = ?, mob_no = ? WHERE id = ?";
  db.query(query, [ward_no, name_lawsuit, mob_no, id], (err, result) => {
    if (err) {
      console.error("Error updating litigation:", err);
      return res.status(500).json({ message: "Error updating litigation" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Litigation not found" });
    }

    res.status(200).json({ id, ward_no, name_lawsuit, mob_no });
  });
});

module.exports = router;
