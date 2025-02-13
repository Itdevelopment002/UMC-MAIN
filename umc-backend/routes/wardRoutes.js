const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/ward-info", (req, res) => {
  const { office, address, phone, email } = req.body;
  if (!office || !address || !phone || !email) {
    return res.status(400).json({ message: "Office, Address, Phone and email are required" });
  }
  const sql = "INSERT INTO wardinfo (office, address, phone, email) VALUES (?, ?, ?, ?)";
  db.query(sql, [office, address, phone, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(201)
      .json({
        message: "Ward Information added successfully",
        wardId: result.insertId,
      });
  });
});

router.get("/ward-info", (req, res) => {
  const sql = "SELECT * FROM wardinfo";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/ward-info/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM wardinfo WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Ward information not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/ward-info/:id", (req, res) => {
  const { id } = req.params;
  const { office, address, phone, email } = req.body;
  if (!office || !address || !phone || !email) {
    return res.status(400).json({ message: "Office, Address, Phone and email are required" });
  }
  const sql = "UPDATE wardinfo SET office = ?, address = ?, phone = ?, email = ? WHERE id = ?";
  db.query(sql, [office, address, phone, email, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ward information not found" });
    }
    res.status(200).json({ message: "Ward information updated successfully" });
  });
});

router.delete("/ward-info/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM wardinfo WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ward information not found" });
    }
    res.status(200).json({ message: "Ward information deleted successfully" });
  });
});

module.exports = router;
