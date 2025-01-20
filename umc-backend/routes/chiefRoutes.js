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

router.post("/chief-officers", upload.single("officerImage"), (req, res) => {
  const { officerName, startDate, endDate } = req.body;

  // Convert start date
  const formattedStartDate = convertToMySQLDate(startDate);
  
  // If endDate is not provided, set it to null
  const formattedEndDate = endDate ? convertToMySQLDate(endDate) : null;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO previous_chief_officer (officer_name, start_date, end_date, image_path) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [officerName, formattedStartDate, formattedEndDate, imagePath],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(200)
        .json({
          message: "Chief officer added successfully",
          officerId: result.insertId,
        });
    }
  );
});

router.get("/chief-officers", (req, res) => {
  const sql = "SELECT * FROM previous_chief_officer";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/chief-officers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM previous_chief_officer WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Chief officer not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/chief-officers/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  let { officer_name, start_date, end_date } = req.body;

  if (start_date) {
    start_date = convertToMySQLDate(start_date);
  }
  if (end_date) {
    end_date = convertToMySQLDate(end_date);
  } else {
    end_date = null; // If no end date is provided, set it to null
  }

  let updateSql = "UPDATE previous_chief_officer SET";
  const updateParams = [];

  if (officer_name) {
    updateSql += " officer_name = ?";
    updateParams.push(officer_name);
  }
  if (start_date) {
    updateSql += ", start_date = ?";
    updateParams.push(start_date);
  }
  if (end_date) {
    updateSql += ", end_date = ?";
    updateParams.push(end_date);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql += ", image_path = ?";
    updateParams.push(imagePath);
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql =
    "SELECT image_path FROM previous_chief_officer WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Officer not found" });
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

      res.status(200).json({ message: "Chief officer updated successfully" });
    });
  });
});

router.delete("/chief-officers/:id", (req, res) => {
  const { id } = req.params;

  const selectSql =
    "SELECT image_path FROM previous_chief_officer WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Chief officer not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM previous_chief_officer WHERE id = ?";
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

      res.status(200).json({ message: "Chief officer deleted successfully" });
    });
  });
});

module.exports = router;

