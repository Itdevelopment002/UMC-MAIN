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

router.post("/fire-stations", upload.single("image"), (req, res) => {
  const { heading, address, phoneNo } = req.body;

  if (!heading || !address || !phoneNo) {
    return res
      .status(400)
      .json({ message: "Heading, address, and phone number are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO fire_station (heading, address, phoneNo, image_path) VALUES (?, ?, ?, ?)";
  db.query(sql, [heading, address, phoneNo, imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({
      message: "Fire station added successfully",
      fireStationId: result.insertId,
    });
  });
});

router.get("/fire-stations", (req, res) => {
  const sql = "SELECT * FROM fire_station";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/fire-stations/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM fire_station WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Fire station not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/fire-stations/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { heading, address, phoneNo } = req.body;

  let updateSql = "UPDATE fire_station SET";
  const updateParams = [];

  if (heading) {
    updateSql += " heading = ?";
    updateParams.push(heading);
  }
  if (address) {
    updateSql += updateParams.length > 0 ? ", address = ?" : " address = ?";
    updateParams.push(address);
  }
  if (phoneNo) {
    updateSql += updateParams.length > 0 ? ", phoneNo = ?" : " phoneNo = ?";
    updateParams.push(phoneNo);
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

  const selectSql = "SELECT image_path FROM fire_station WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Fire station not found" });
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

      res.status(200).json({ message: "Fire station updated successfully" });
    });
  });
});

router.delete("/fire-stations/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM fire_station WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Fire station not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM fire_station WHERE id = ?";
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

      res.status(200).json({ message: "Fire station deleted successfully" });
    });
  });
});

module.exports = router;
