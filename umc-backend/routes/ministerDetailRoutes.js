const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

router.post("/minister-details", upload.single("image"), (req, res) => {
  const { name, designation, bgcolor } = req.body;

  if (!name || !designation || !bgcolor) {
    return res
      .status(400)
      .json({ message: "Name, designation and background color are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO minister (name, designation, bgcolor, image_path) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, designation, bgcolor, imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({
      message: "Minister added successfully",
      ministerId: result.insertId,
    });
  });
});

router.get("/minister-details", (req, res) => {
  const sql = "SELECT * FROM minister";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/minister-details/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM minister WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Minister not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/minister-details/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, designation, bgcolor } = req.body;

  let updateSql = "UPDATE minister SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }

  if (designation) {
    updateSql += updateParams.length > 0 ? ", designation = ?" : " designation = ?";
    updateParams.push(designation);
  }

  if (bgcolor) {
    updateSql += updateParams.length > 0 ? ", bgcolor = ?" : " bgcolor = ?";
    updateParams.push(bgcolor);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql +=
      updateParams.length > 0 ? ", image_path = ?" : " image_path = ?";
    updateParams.push(imagePath);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM minister WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Minister not found" });
    }

    const oldImagePath = result[0].image_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldImagePath) {
        const fullPath = path.join(
          __dirname,
          "..",
          oldImagePath.replace(/^\//, "")
        );
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Minister updated successfully" });
    });
  });
});

router.delete("/minister-details/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM minister WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Minister not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM minister WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (imagePath) {
        fs.unlink(path.join(__dirname, "..", imagePath), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Minister deleted successfully" });
    });
  });
});

module.exports = router;
