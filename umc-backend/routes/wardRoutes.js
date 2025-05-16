const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');


router.get("/ward-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM wardinfo WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM wardinfo";
  }

  db.query(query, params, (err, results) => {
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


router.post("/ward-info", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { office, address, phone, email, language_code } = req.body;
  if (!office || !address || !phone || !email || !language_code) {
    return res.status(400).json({ message: "Office, Address, Phone and email are required" });
  }
  const sql = "INSERT INTO wardinfo (office, address, phone, email, language_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [office, address, phone, email, language_code], (err, result) => {
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


router.post("/edit-ward-info/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;
  const { office, address, phone, email, language_code } = req.body;
  if (!office || !address || !phone || !email || !language_code) {
    return res.status(400).json({ message: "Office, Address, Phone and email are required" });
  }
  const sql = "UPDATE wardinfo SET office = ?, address = ?, phone = ?, email = ?, language_code = ? WHERE id = ?";
  db.query(sql, [office, address, phone, email, language_code, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ward information not found" });
    }
    res.status(200).json({ message: "Ward information updated successfully" });
  });
});


router.post("/delete-ward-info/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
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
