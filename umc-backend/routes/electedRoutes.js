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

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

router.post("/elected-wings", upload.single("image"), (req, res) => {
  const { correspondentName, wardNo, startDate, endDate, mobileNo } = req.body;

  const formattedStartDate = convertToMySQLDate(startDate);
  const formattedEndDate = convertToMySQLDate(endDate);

  if (!correspondentName || !wardNo || !startDate || !endDate || !mobileNo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO elected_wings (correspondentName, wardNo, startDate, endDate, mobileNo, image_path) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      correspondentName,
      wardNo,
      formattedStartDate,
      formattedEndDate,
      mobileNo,
      imagePath,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(200)
        .json({
          message: "Correspondent added successfully",
          correspondentId: result.insertId,
        });
    }
  );
});

router.get("/elected-wings", (req, res) => {
  const sql = "SELECT * FROM elected_wings";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/elected-wings/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM elected_wings WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Correspondent not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/elected-wings/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  let { correspondentName, wardNo, startDate, endDate, mobileNo } = req.body;

  // Convert dates to MySQL format if they exist
  if (startDate) {
    startDate = convertToMySQLDate(startDate);
  }
  if (endDate) {
    endDate = convertToMySQLDate(endDate);
  }

  let updateSql = "UPDATE elected_wings SET";
  const updateParams = [];

  if (correspondentName) {
    updateSql += " correspondentName = ?";
    updateParams.push(correspondentName);
  }
  if (wardNo) {
    updateSql += ", wardNo = ?";
    updateParams.push(wardNo);
  }
  if (startDate) {
    updateSql += ", startDate = ?";
    updateParams.push(startDate);
  }
  if (endDate) {
    updateSql += ", endDate = ?";
    updateParams.push(endDate);
  }
  if (mobileNo) {
    updateSql += ", mobileNo = ?";
    updateParams.push(mobileNo);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql += ", image_path = ?";
    updateParams.push(imagePath);
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM elected_wings WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Correspondent not found" });
    }

    const oldImagePath = result[0].image_path;

    db.query(updateSql, updateParams, (err) => {
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

      res.status(200).json({ message: "Correspondent updated successfully" });
    });
  });
});

router.delete("/elected-wings/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM elected_wings WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Correspondent not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM elected_wings WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
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

      res.status(200).json({ message: "Correspondent deleted successfully" });
    });
  });
});

module.exports = router;
