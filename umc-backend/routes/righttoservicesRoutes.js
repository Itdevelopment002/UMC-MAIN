const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/righttoservices", (req, res) => {
  const { heading, description } = req.body;

  if (!heading || !description) {
    return res
      .status(400)
      .json({ message: "Heading and Description are required." });
  }

  const sql =
    "INSERT INTO righttoservices (heading, description) VALUES (?, ?)";
  db.query(sql, [heading, description], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database insertion failed", error: err });
    }
    res
      .status(201)
      .json({ message: "Right to Service added successfully", data: result });
  });
});

router.get("/righttoservices", (req, res) => {
  const sql = "SELECT * FROM righttoservices";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.put("/righttoservices/:id", (req, res) => {
  const { heading, description } = req.body;
  const sql =
    "UPDATE righttoservices SET heading = ?, description = ? WHERE id = ?";
  db.query(sql, [heading, description, req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to update RTS", error: err });
    }
    res.json({ success: true });
  });
});

router.delete("/righttoservices/:id", (req, res) => {
  const sql = "DELETE FROM righttoservices WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete RTS", error: err });
    }
    res.json({ success: true });
  });
});

module.exports = router;
