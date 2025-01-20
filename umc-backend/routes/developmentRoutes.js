const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/development-plan-desc", (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required." });
  }

  const sql = "INSERT INTO development_plan (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database insertion failed", error: err });
    }
    res
      .status(201)
      .json({ message: "Development Plan added successfully", data: result });
  });
});

router.get("/development-plan-desc", (req, res) => {
  const sql = "SELECT * FROM development_plan";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.put("/development-plan-desc/:id", (req, res) => {
  const { description } = req.body;
  const sql = "UPDATE development_plan SET description = ? WHERE id = ?";
  db.query(sql, [description, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update development plan data",
        error: err,
      });
    }
    res.json({ success: true });
  });
});

router.delete("/development-plan-desc/:id", (req, res) => {
  const sql = "DELETE FROM development_plan WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete development plan data",
        error: err,
      });
    }
    res.json({ success: true });
  });
});

module.exports = router;
