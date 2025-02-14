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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/commissioner-details", upload.single("coImage"), (req, res) => {
  const { coName, designation, qualification, address, number, email } = req.body;

  if (!coName || !designation || !qualification || !address || !number || !email) {
    return res
      .status(400)
      .json({ message: "All fields are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO commissioner_details 
    (coName, designation, qualification, address, number, email, image_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [coName, designation, qualification, address, number, email, imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Commissioner added successfully", id: result.insertId });
  });
});

router.get("/commissioner-details", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM commissioner_details WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM commissioner_details";
  }
  db.query(query,params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/commissioner-details/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM commissioner_details WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Commissioner not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/commissioner-details/:id", upload.single("coImage"), (req, res) => {
  const { id } = req.params;
  const { coName, designation, qualification, address, number, email } = req.body;

  let updateSql = "UPDATE commissioner_details SET";
  const updateParams = [];

  if (coName) {
    updateSql += " coName = ?";
    updateParams.push(coName);
  }
  if (designation) {
    updateSql += updateParams.length > 0 ? ", designation = ?" : " designation = ?";
    updateParams.push(designation);
  }
  if (qualification) {
    updateSql += updateParams.length > 0 ? ", qualification = ?" : " qualification = ?";
    updateParams.push(qualification);
  }
  if (address) {
    updateSql += updateParams.length > 0 ? ", address = ?" : " address = ?";
    updateParams.push(address);
  }
  if (number) {
    updateSql += updateParams.length > 0 ? ", number = ?" : " number = ?";
    updateParams.push(number);
  }
  if (email) {
    updateSql += updateParams.length > 0 ? ", email = ?" : " email = ?";
    updateParams.push(email);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql += updateParams.length > 0 ? ", image_path = ?" : " image_path = ?";
    updateParams.push(imagePath);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM commissioner_details WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Commissioner not found" });
    }

    const oldImagePath = result[0].image_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldImagePath) {
        const fullPath = path.join(__dirname, "..", oldImagePath.replace(/^\//, ""));
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Commissioner updated successfully" });
    });
  });
});

router.delete("/commissioner-details/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM commissioner_details WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Commissioner not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM commissioner_details WHERE id = ?";
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

      res.status(200).json({ message: "Commissioner deleted successfully" });
    });
  });
});

module.exports = router;
