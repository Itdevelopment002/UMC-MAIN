const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const db = require("../config/db.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/rts_table", upload.single("userfile"), (req, res) => {
  const { description } = req.body;
  const filePath = req.file ? req.file.path : null;

  if (!description || !filePath) {
    return res
      .status(400)
      .json({ message: "PDF description and PDF file are required." });
  }

  const sql = "INSERT INTO rts_table (description, pdf_path) VALUES (?, ?)";
  db.query(sql, [description, filePath], (err, result) => {
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

router.get("/rts_table", (req, res) => {
  const sql = "SELECT * FROM rts_table";
  db.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database retrieval failed", error: err });
    }
    res.json(results);
  });
});

router.put("/rts_table/:id", upload.single("userfile"), (req, res) => {
  const { description } = req.body;
  const filePath = req.file ? req.file.path : null;

  if (!description) {
    return res.status(400).json({ message: "PDF description is required." });
  }

  let sql, params;
  if (filePath) {
    sql = "UPDATE rts_table SET description = ?, pdf_path = ? WHERE id = ?";
    params = [description, filePath, req.params.id];
  } else {
    sql = "UPDATE rts_table SET description = ? WHERE id = ?";
    params = [description, req.params.id];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database update failed", error: err });
    }
    res.json({ success: true });
  });
});

router.delete("/rts_table/:id", (req, res) => {
  const sql = "DELETE FROM rts_table WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database deletion failed", error: err });
    }
    res.json({ success: true });
  });
});

module.exports = router;
