const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");

const upload = multer(getMulterConfig());


router.get("/hod-details", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM depthod WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM depthod";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.get("/hod-details/:id", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  let query;
  let params = [];

  if (id) {
    query = "SELECT * FROM depthod WHERE id = ?";
    params.push(id);
  } else if (lang) {
    query = "SELECT * FROM depthod WHERE language_code = ?";
    params.push(lang);
  } else {
    query = "SELECT * FROM depthod";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (id && results.length === 0) {
      return res.status(404).json({ message: "HOD detail not found" });
    }

    const responseData = results.map((hod) => ({
      id: hod.id,
      name: hod.name,
      file_path: hod.file_path,
      uploaded_at: hod.uploaded_at,
    }));

    res.status(200).json(id ? responseData[0] : responseData);
  });
});


router.post("/hod-details", verifyToken, upload.single("hodImage"), handleMulterError, (req, res) => {
  if (!req.file) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const { department, hodName, designation, education, address, number, email, language_code } = req.body;

  if (!department || !hodName || !designation || !education || !address || !number || !email || !language_code) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "Department, Hod name, designation, education, address, number and email are required" });
  }

  const sql = "INSERT INTO depthod (department, name, designation, education, address, number, email, language_code, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [department, hodName, designation, education, address, number, email, language_code, filePath], (err, result) => {
    if (err) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Department, Name, designation, education, address, number, email and image uploaded successfully",
      hodImageUrl: filePath,
    });
  });
});


router.post("/edit-hod-details/:id", verifyToken, upload.single("hodImage"), handleMulterError, (req, res) => {
  const { id } = req.params;
  const { department, name, designation, education, address, number, email, language_code } = req.body;

  let updateSql = "UPDATE depthod SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }

  if (department) {
    updateSql +=
      updateParams.length > 0 ? ", department = ?" : " department = ?";
    updateParams.push(department);
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

  if (language_code) {
    updateSql +=
      updateParams.length > 0 ? ", language_code = ?" : " language_code = ?";
    updateParams.push(language_code);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql += updateParams.length > 0 ? ", file_path = ?" : " file_path = ?";
    updateParams.push(imagePath);
  }

  if (updateParams.length === 0) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT file_path FROM depthod WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(404).json({ message: "Hod Detail not found" });
    }

    const oldFilePath = result[0].file_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        if (req.file) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldFilePath) {
        fs.unlink(path.join(
          __dirname,
          "..",
          oldFilePath.replace(/^\//, "")
        ), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old file:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Hod detail updated successfully" });
    });
  });
});


router.post("/delete-hod-details/:id", verifyToken, (req, res) => {
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


module.exports = router;
