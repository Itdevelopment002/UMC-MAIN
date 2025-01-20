const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/schools", (req, res) => {
  const sql = "SELECT * FROM schools";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/schools/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM schools WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.post("/schools", (req, res) => {
  const { heading, schoolName, address, medium } = req.body;

  if (!schoolName || !address || !medium) {
    return res
      .status(400)
      .json({ message: "School Name, Address, and Medium are required" });
  }

  const sql =
    "INSERT INTO schools (heading, schoolName, address, medium) VALUES (?, ?, ?, ?)";
  db.query(sql, [heading, schoolName, address, medium], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(201)
      .json({
        message: "School added successfully",
        schoolId: result.insertId,
      });
  });
});

router.put("/schools/:id", (req, res) => {
  const { id } = req.params;
  const { heading, schoolName, address, medium } = req.body;

  let updateSql = "UPDATE schools SET";
  const updateParams = [];

  if (heading) {
    updateSql += " heading = ?";
    updateParams.push(heading);
  }
  if (schoolName) {
    updateSql +=
      updateParams.length > 0 ? ", schoolName = ?" : " schoolName = ?";
    updateParams.push(schoolName);
  }
  if (address) {
    updateSql += updateParams.length > 0 ? ", address = ?" : " address = ?";
    updateParams.push(address);
  }
  if (medium) {
    updateSql += updateParams.length > 0 ? ", medium = ?" : " medium = ?";
    updateParams.push(medium);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  db.query(updateSql, updateParams, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "School updated successfully" });
  });
});

router.delete("/schools/:id", (req, res) => {
  const { id } = req.params;

  const deleteSql = "DELETE FROM schools WHERE id = ?";
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "School deleted successfully" });
  });
});

module.exports = router;
