const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require('../utils/uploadValidation');
const sanitizeInput = require('../middleware/sanitizeInput.js');

// Create upload middleware using global config
const upload = multer(getMulterConfig());

const deleteFileIfExists = async (filePath) => {
  try {
    if (filePath) {
      const fullPath = path.join(__dirname, '..', filePath);
      await fs.unlink(fullPath);
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
};

router.get("/bottom-sliders", (req, res) => {
  const sql = "SELECT * FROM bottom_slider";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/bottom-sliders/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM bottom_slider WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Slider link not found" });
    }

    const link = result[0];
    res.status(200).json({
      id: link.id,
      websitelink: link.websitelink,
      websitelogo: link.websitelogo,
    });
  });
});

router.post(
  "/bottom-sliders",
  verifyToken,
  upload.single("websitelogo"),
  sanitizeInput,
  handleMulterError,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { websitelink } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!websitelink) {
      await deleteFileIfExists(`/uploads/${req.file.filename}`);
      return res.status(400).json({ message: "Slider link is required" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    const sql = "INSERT INTO bottom_slider (websitelink, websitelogo) VALUES (?, ?)";

    db.query(sql, [websitelink, filePath], async (err) => {
      if (err) {
        await deleteFileIfExists(filePath);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(201).json({
        message: "Slider link and logo uploaded successfully",
        logoUrl: filePath,
      });
    });
  }
);

router.post(
  "/edit-bottom-sliders/:id",
  verifyToken,
  upload.single("websitelogo"),
  sanitizeInput,
  handleMulterError,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;
    const { websitelink } = req.body;

    if (!websitelink && !req.file) {
      return res.status(400).json({ message: "No fields to update" });
    }

    let updateSql = "UPDATE bottom_slider SET";
    const updateParams = [];
    const updates = [];

    if (websitelink) {
      updates.push("websitelink = ?");
      updateParams.push(websitelink);
    }

    let newFilePath = null;
    if (req.file) {
      newFilePath = `/uploads/${req.file.filename}`;
      updates.push("websitelogo = ?");
      updateParams.push(newFilePath);
    }

    updateSql += ' ' + updates.join(', ') + ' WHERE id = ?';
    updateParams.push(id);

    const selectSql = "SELECT websitelogo FROM bottom_slider WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err || result.length === 0) {
        if (req.file) {
          await deleteFileIfExists(newFilePath);
        }
        return res.status(err ? 500 : 404).json({
          message: err ? 'Database error' : 'Slider link not found',
          error: err
        });
      }

      const oldFilePath = result[0].websitelogo;

      db.query(updateSql, updateParams, async (err) => {
        if (err) {
          if (req.file) {
            await deleteFileIfExists(newFilePath);
          }
          return res.status(500).json({ message: "Database error", error: err });
        }

        if (req.file && oldFilePath) {
          await deleteFileIfExists(oldFilePath);
        }

        res.status(200).json({ message: "Slider link updated successfully" });
      });
    });
  }
);

router.post(
  "/delete-bottom-sliders/:id",
  verifyToken,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;

    const selectSql = "SELECT websitelogo FROM bottom_slider WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Slider link not found" });
      }

      const filePath = result[0].websitelogo;
      const deleteSql = "DELETE FROM bottom_slider WHERE id = ?";

      db.query(deleteSql, [id], async (err) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }

        await deleteFileIfExists(filePath);

        res.status(200).json({ message: "Slider link deleted successfully" });
      });
    });
  }
);

module.exports = router;