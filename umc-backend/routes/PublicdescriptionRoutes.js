const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/public_disclosure", (req, res) => {
  const { department_name } = req.body;

  if (!department_name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  const sql = "INSERT INTO public_disclosure (department_name) VALUES (?)";
  db.query(sql, [department_name], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({
        message: "Department added successfully",
        departmentId: result.insertId,
      });
  });
});

router.get("/public_disclosure", (req, res) => {
  const sql = "SELECT * FROM public_disclosure";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/public_disclosure/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM public_disclosure WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/public_disclosure/:id", (req, res) => {
  const { id } = req.params;
  const { department_name } = req.body;

  if (!department_name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  const sql = "UPDATE public_disclosure SET department_name = ? WHERE id = ?";
  db.query(sql, [department_name, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department updated successfully" });
  });
});

router.delete("/public_disclosure/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM public_disclosure WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  });
});

module.exports = router;
