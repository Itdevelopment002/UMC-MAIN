const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");

const upload = multer(getMulterConfig());


router.get("/project-category", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM project_images WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM project_images";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.get("/project-category/heading/:heading", (req, res) => {
  const { heading } = req.params;

  const sql = "SELECT * FROM project_images WHERE heading = ?";
  db.query(sql, [heading], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = result[0];
    res.status(200).json({
      id: project.id,
      heading: project.heading,
      images: JSON.parse(project.images),
    });
  });
});


router.post("/project-category", verifyToken, upload.array("images"), handleMulterError, (req, res) => {
  const { heading, language_code } = req.body;

  if (!heading || !language_code) {
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(path.join(__dirname, "..", "uploads", file.filename), () => { });
      });
    }
    return res.status(400).json({ message: "Heading and language code are required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  const query = "INSERT INTO project_images (heading, language_code, images) VALUES (?, ?, ?)";
  db.query(query, [heading, language_code, JSON.stringify(imagePaths)], (err, result) => {
    if (err) {
      req.files.forEach(file => {
        fs.unlink(path.join(__dirname, "..", "uploads", file.filename), () => { });
      });
      return res.status(500).json({ message: "Error adding project", error: err });
    }
    res.status(201).json({
      message: "Project added successfully",
      projectId: result.insertId,
      images: imagePaths,
    });
  });
});


router.post("/edit-project-category/:id", verifyToken, upload.array("images"), handleMulterError, (req, res) => {
  const { id } = req.params;
  const { heading, language_code } = req.body;

  let updateSql = "UPDATE project_images SET";
  const updateParams = [];
  const updateFields = [];

  if (heading) {
    updateFields.push(" heading = ?");
    updateParams.push(heading);
  }

  if (language_code) {
    updateFields.push(" language_code = ?");
    updateParams.push(language_code);
  }

  let newImagePaths;
  if (req.files && req.files.length > 0) {
    newImagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    updateFields.push(" images = ?");
    updateParams.push(JSON.stringify(newImagePaths));
  }

  if (updateFields.length === 0) {
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(path.join(__dirname, "..", "uploads", file.filename), () => { });
      });
    }
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += updateFields.join(",") + " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT images FROM project_images WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(path.join(__dirname, "..", "uploads", file.filename), () => { });
        });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(path.join(__dirname, "..", "uploads", file.filename), () => { });
        });
      }
      return res.status(404).json({ message: "Project not found" });
    }

    const oldImages = JSON.parse(result[0].images || "[]");

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        if (req.files) {
          req.files.forEach(file => {
            fs.unlink(path.join(__dirname, "..", "uploads", file.filename), () => { });
          });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Delete old images from disk
      if (req.files && oldImages.length > 0) {
        oldImages.forEach(imgPath => {
          const fullPath = path.join(__dirname, "..", imgPath.replace(/^\//, ""));
          fs.unlink(fullPath, (fsErr) => {
            if (fsErr) {
              console.error("Error deleting old image:", fsErr);
            }
          });
        });
      }

      res.status(200).json({ message: "Project updated successfully" });
    });
  });
});


router.post("/delete-project-category/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT images FROM project_images WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const images = JSON.parse(result[0].images);

    const deleteSql = "DELETE FROM project_images WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      images.forEach((image) => {
        const filePath = path.join(__dirname, "..", image);
        fs.unlink(filePath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting image:", fsErr);
          }
        });
      });

      res.status(200).json({ message: "Project deleted successfully" });
    });
  });
});


module.exports = router;