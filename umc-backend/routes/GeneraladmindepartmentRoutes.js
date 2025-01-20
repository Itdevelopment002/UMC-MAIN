const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/generaladmindepartment", (req, res) => {
  const { departments_heading, heading_link } = req.body;

  if (!departments_heading || !heading_link) {
    return res
      .status(400)
      .json({ message: "Department heading or heading link is required" });
  }

  const sql =
    "INSERT INTO generaladmindepartment (departments_heading, heading_link) VALUES (?,?)";
  db.query(sql, [departments_heading, heading_link], (err, result) => {
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

router.get("/generaladmindepartment", (req, res) => {
  const sql = "SELECT * FROM generaladmindepartment";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/generaladmindepartment/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM generaladmindepartment WHERE id = ?";
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

router.put("/generaladmindepartment/:id", (req, res) => {
  const { id } = req.params;
  const { departments_heading, heading_link } = req.body;

  if (!departments_heading) {
    return res.status(400).json({ message: "Department heading is required" });
  }

  if (!heading_link) {
    return res.status(400).json({ message: "Heading link is required" });
  }

  const sql =
    "UPDATE generaladmindepartment SET departments_heading = ?, heading_link = ? WHERE id = ?";
  db.query(sql, [departments_heading, heading_link, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department updated successfully" });
  });
});

router.delete("/generaladmindepartment/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM generaladmindepartment WHERE id = ?";
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
