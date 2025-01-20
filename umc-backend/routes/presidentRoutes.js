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
  if (!dateString) return null; // Return null if the date string is not provided
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

router.post("/presidents", upload.single("presidentImage"), (req, res) => {
  const { presidentName, startDate, endDate } = req.body;

  const formattedStartDate = convertToMySQLDate(startDate);
  const formattedEndDate = convertToMySQLDate(endDate);

  if (!presidentName || !startDate) {
    return res.status(400).json({
      message: "President name and start date are required",
    });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO presidents (president_name, start_date, end_date, image_path) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [presidentName, formattedStartDate, formattedEndDate, imagePath],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json({
        message: "President added successfully",
        presidentId: result.insertId,
      });
    }
  );
});

router.get("/presidents", (req, res) => {
  const sql = "SELECT * FROM presidents";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/presidents/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM presidents WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "President not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/presidents/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  let { president_name, start_date, end_date } = req.body;

  start_date = convertToMySQLDate(start_date);
  end_date = convertToMySQLDate(end_date);

  let updateSql = "UPDATE presidents SET";
  const updateParams = [];

  if (president_name) {
    updateSql += " president_name = ?";
    updateParams.push(president_name);
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

  const selectSql = "SELECT image_path FROM presidents WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "President not found" });
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

      res.status(200).json({ message: "President updated successfully" });
    });
  });
});

router.delete("/presidents/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM presidents WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "President not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM presidents WHERE id = ?";
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

      res.status(200).json({ message: "President deleted successfully" });
    });
  });
});

module.exports = router;
