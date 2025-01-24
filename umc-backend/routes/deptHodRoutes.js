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

const upload = multer({ storage,
 limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/hod-details", upload.single("hodImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const { hodName, designation, education, address, number, email } = req.body;

  if (!hodName || !designation || !education || !address || !number || !email) {
    return res.status(400).json({ message: "Hod name, designation, education, address, number and email are required" });
  }

  const sql = "INSERT INTO depthod (name, designation, education, address, number, email, file_path) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [hodName, designation, education, address, number, email, filePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Name, designation, education, address, number, email and image uploaded successfully",
      hodImageUrl: filePath,
    });
  });
});

router.get("/hod-details", (req, res) => {
  const sql = "SELECT * FROM depthod";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json(results); 
  });
});


router.get("/hod-details/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM depthod WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Hod detail not found" });
    }

    const slider = result[0];
    res.status(200).json({
      id: slider.id,
      name: slider.name,
      file_path: slider.file_path,
      uploaded_at: slider.uploaded_at,
    });
  });
});

router.delete("/hod-details/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT file_path FROM depthod WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Hod detail not found" });
    }

    const filePath = result[0].file_path;

    const deleteSql = "DELETE FROM depthod WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      fs.unlink(path.join(__dirname, "..", filePath), (fsErr) => {
        if (fsErr) {
          console.error("Error deleting file:", fsErr);
        }
      });

      res.status(200).json({ message: "Hod detail deleted successfully" });
    });
  });
});

router.put("/hod-details/:id", upload.single("hodImage"), (req, res) => {
  const { id } = req.params;
  const { name, designation, education, address, number, email } = req.body;

  let updateSql = "UPDATE depthod SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }

  if (designation) {
    updateSql +=
      updateParams.length > 0 ? ", designation = ?" : " designation = ?";
    updateParams.push(designation);
  }

  if (education) {
    updateSql +=
      updateParams.length > 0 ? ", education = ?" : " education = ?";
    updateParams.push(education);
  }

  if (address) {
    updateSql +=
      updateParams.length > 0 ? ", address = ?" : " address = ?";
    updateParams.push(address);
  }

  if (number) {
    updateSql +=
      updateParams.length > 0 ? ", number = ?" : " number = ?";
    updateParams.push(number);
  }

  if (email) {
    updateSql +=
      updateParams.length > 0 ? ", email = ?" : " email = ?";
    updateParams.push(email);
  }

  if (req.file) {
    const newFilePath = `/uploads/${req.file.filename}`;
    updateSql += updateParams.length > 0 ? ", file_path = ?" : " file_path = ?";
    updateParams.push(newFilePath);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT file_path FROM depthod WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Hod Detail not found" });
    }

    const oldFilePath = result[0].file_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file) {
        fs.unlink(path.join(__dirname, "..", oldFilePath), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old file:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Hod detail updated successfully" });
    });
  });
});

module.exports = router;
