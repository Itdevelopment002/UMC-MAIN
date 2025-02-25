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

const upload = multer({ storage: storage });


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


router.post("/project-category", upload.array("images"), (req, res) => {
  const { heading, language_code } = req.body;

  if (!heading || !language_code) {
    return res.status(400).json({ message: "Heading and language code are required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  const query = "INSERT INTO project_images (heading, language_code, images) VALUES (?, ?, ?)";
  db.query(query, [heading, language_code, JSON.stringify(imagePaths)], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding project", error: err });
    }
    res.status(201).json({
      message: "Project added successfully",
      projectId: result.insertId,
      images: imagePaths,
    });
  });
});


router.put("/project-category/:id", upload.array("images"), (req, res) => {
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

  if (req.files && req.files.length > 0) {
    const newImagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    updateFields.push(" images = ?");
    updateParams.push(JSON.stringify(newImagePaths));
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += updateFields.join(",") + " WHERE id = ?";
  updateParams.push(id);

  db.query(updateSql, updateParams, (err, updateResult) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Project updated successfully" });
  });
});


router.delete("/project-category/:id", (req, res) => {
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