const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/generaladminaddyear", upload.single("pdf"), (req, res) => {
  const { department_id, department_heading, year, meetingtype, pdfheading } =
    req.body;
  const pdfPath = req.file ? req.file.path : null;
  if (
    !department_id ||
    !department_heading ||
    !year ||
    !meetingtype ||
    !pdfheading ||
    !pdfPath
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO generaladminaddyear (department_id, department_heading, year, meetingtype, pdfheading, pdf) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [department_id, department_heading, year, meetingtype, pdfheading, pdfPath],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(200)
        .json({
          message: "Entry added successfully",
          entryId: result.insertId,
        });
    }
  );
});

router.get("/generaladminaddyear", (req, res) => {
  const sql = "SELECT * FROM generaladminaddyear";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/generaladminaddyear/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM generaladminaddyear WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/generaladminaddyear/:id", upload.single("pdf"), (req, res) => {
  const { id } = req.params;
  const { year, meetingtype, pdfheading } = req.body;
  const pdfPath = req.file ? req.file.path : null;

  if (!year || !meetingtype || !pdfheading) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let sql =
    "UPDATE generaladminaddyear SET year = ?, meetingtype = ?, pdfheading = ?";
  const params = [year, meetingtype, pdfheading];

  if (pdfPath) {
    sql += ", pdf = ?";
    params.push(pdfPath);
  }
  sql += " WHERE id = ?";
  params.push(id);

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry updated successfully" });
  });
});

router.delete("/generaladminaddyear/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM generaladminaddyear WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully" });
  });
});

module.exports = router;
