const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");
const sanitizeInput = require("../middleware/sanitizeInput.js");

const upload = multer(getMulterConfig());


router.get("/department-banner", (req, res) => {
  const sql = "SELECT * FROM deptbanner";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json(results);
  });
});


router.get("/department-banner/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM deptbanner WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Department banner not found" });
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


router.post("/department-banner", verifyToken, upload.single("bannerImage"), sanitizeInput, handleMulterError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const departmentName = req.body.departmentName;

  if (!departmentName) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "Department name is required" });
  }

  if (req.user?.role !== "Superadmin") {
    const allowedDepartments = req.user?.permission?.split(",") || [];
    const trimmedDepartments = allowedDepartments.map((d) => d.trim());

    if (!trimmedDepartments.includes(departmentName)) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      return res.status(403).json({
        message: `Access denied: You don't have permission to upload for '${departmentName}'`,
      });
    }
  }

  const sql = "INSERT INTO deptbanner (name, file_path) VALUES (?, ?)";
  db.query(sql, [departmentName, filePath], (err, result) => {
    if (err) {
      if (req.file) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Image and department name uploaded successfully",
      imageUrl: filePath,
    });
  });
});


router.post("/edit-department-banner/:id", verifyToken, upload.single("bannerImage"), sanitizeInput, handleMulterError, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  let updateSql = "UPDATE deptbanner SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }

  if (req.file) {
    const newFilePath = `/uploads/${req.file.filename}`;
    updateSql += updateParams.length > 0 ? ", file_path = ?" : " file_path = ?";
    updateParams.push(newFilePath);
  }

  if (updateParams.length === 0) {
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
    }
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

 const selectSql = "SELECT name, file_path FROM deptbanner WHERE id = ?";
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
      return res.status(404).json({ message: "Banner not found" });
    }

    const oldFilePath = result[0].file_path;
    const currentDeptName = result[0].name;

    if (req.user?.role !== "Superadmin") {
      const allowedDepartments = req.user?.permission?.split(",").map(d => d.trim()) || [];

      if (!allowedDepartments.includes(currentDeptName)) {
        if (req.file) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename), () => { });
        }
        return res.status(403).json({
          message: `Access denied: You don't have permission to edit '${currentDeptName}' banner.`,
        });
      }
    }

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

      res.status(200).json({ message: "Banner updated successfully" });
    });
  });
});


router.post("/delete-department-banner/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT name, file_path FROM deptbanner WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Department banner not found" });
    }

    const filePath = result[0].file_path;
    const departmentName = result[0].name;

    if (req.user?.role !== "Superadmin") {
      const allowedDepartments = req.user?.permission?.split(",").map(p => p.trim()) || [];

      if (!allowedDepartments.includes(departmentName)) {
        return res.status(403).json({
          message: `Access denied: You don't have permission to delete '${departmentName}' banner.`,
        });
      }
    }

    const deleteSql = "DELETE FROM deptbanner WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      fs.unlink(path.join(__dirname, "..", filePath), (fsErr) => {
        if (fsErr) {
          console.error("Error deleting file:", fsErr);
        }
      });

      res.status(200).json({ message: "Department banner deleted successfully" });
    });
  });
});


module.exports = router;
