const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");

const upload = multer(getMulterConfig());

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
};


router.get("/projects", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM projects WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM projects";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM projects WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(result[0]);
  });
});


router.post(
  "/projects",
  verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  handleMulterError,
  async (req, res) => {
    try {
      const { heading, description, link, language_code } = req.body;

      if (!heading || !description || !link || !language_code) {
        if (req.files?.mainIcon?.[0]) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.files.mainIcon[0].filename));
        }
        return res.status(400).json({
          message: "Project heading, description, link and language code are required"
        });
      }

      const mainIconPath = req.files?.mainIcon?.[0]
        ? `/uploads/${req.files.mainIcon[0].filename}`
        : null;

      const sql = `
        INSERT INTO projects 
        (heading, description, link, language_code, main_icon_path) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const params = [heading, description, link, language_code, mainIconPath];

      db.query(sql, params, (err, result) => {
        if (err) {
          if (req.files?.mainIcon?.[0]) {
            fs.unlink(path.join(__dirname, "..", "uploads", req.files.mainIcon[0].filename));
          }
          console.error("Database error:", err);
          return res.status(500).json({
            message: "Failed to create project",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
          });
        }

        res.status(201).json({
          success: true,
          message: "Project created successfully",
          projectId: result.insertId
        });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
);

router.post(
  "/edit-projects/:id",
  verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  handleMulterError,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { heading, description, link, language_code } = req.body;

      if (!id || !Number.isInteger(Number(id))) {
        if (req.files?.mainIcon?.[0]) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.files.mainIcon[0].filename));
        }
        return res.status(400).json({
          success: false,
          message: "Invalid project ID"
        });
      }

      if (!heading && !description && !link && !language_code && !req.files?.mainIcon?.[0]) {
        return res.status(400).json({
          success: false,
          message: "No fields provided for update"
        });
      }

      const updates = [];
      const params = [];

      if (heading) {
        updates.push("heading = ?");
        params.push(heading);
      }
      if (description) {
        updates.push("description = ?");
        params.push(description);
      }
      if (link) {
        updates.push("link = ?");
        params.push(link);
      }
      if (language_code) {
        updates.push("language_code = ?");
        params.push(language_code);
      }

      let newMainIconPath = null;
      if (req.files?.mainIcon?.[0]) {
        newMainIconPath = `/uploads/${req.files.mainIcon[0].filename}`;
        updates.push("main_icon_path = ?");
        params.push(newMainIconPath);
      }

      params.push(id);

      db.query(
        "SELECT main_icon_path FROM projects WHERE id = ?",
        [id],
        (err, results) => {
          if (err) {
            if (req.files?.mainIcon?.[0]) {
              fs.unlink(path.join(__dirname, "..", "uploads", req.files.mainIcon[0].filename));
            }
            console.error("Database error:", err);
            return res.status(500).json({
              success: false,
              message: "Failed to fetch project",
              error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
          }

          if (results.length === 0) {
            if (req.files?.mainIcon?.[0]) {
              fs.unlink(path.join(__dirname, "..", "uploads", req.files.mainIcon[0].filename));
            }
            return res.status(404).json({
              success: false,
              message: "Project not found"
            });
          }

          const oldMainIconPath = results[0].main_icon_path;

          const updateSql = `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`;

          db.query(updateSql, params, async (err) => {
            if (err) {
              if (req.files?.mainIcon?.[0]) {
                fs.unlink(path.join(__dirname, "..", "uploads", req.files.mainIcon[0].filename));
              }
              console.error("Database error:", err);
              return res.status(500).json({
                success: false,
                message: "Failed to update project",
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
              });
            }
            if (req.files?.mainIcon?.[0] && oldMainIconPath) {
              try {
                await fs.unlink(path.join(__dirname, "..", oldMainIconPath));
              } catch (fsErr) {
                console.error("Error deleting old image:", fsErr);
              }
            }

            res.status(200).json({
              success: true,
              message: "Project updated successfully"
            });
          });
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
);


router.post("/delete-projects/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const selectSql =
    "SELECT main_icon_path FROM projects WHERE id = ?";
  db.query(selectSql, [id], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { main_icon_path: mainIconPath } =
      result[0];

    const deleteSql = "DELETE FROM projects WHERE id = ?";
    db.query(deleteSql, [id], async (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      await deleteFileIfExists(path.join(__dirname, "../", mainIconPath));

      res.status(200).json({ message: "Project deleted successfully" });
    });
  });
});


module.exports = router;
