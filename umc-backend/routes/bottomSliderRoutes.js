const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


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


router.post("/bottom-sliders", verifyToken, upload.single("websitelogo"), (req, res) => {
  const { websitelink } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  if (!websitelink) {
    return res.status(400).json({ message: "slider link is required" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const sql =
    "INSERT INTO bottom_slider (websitelink, websitelogo) VALUES (?, ?)";

  db.query(sql, [websitelink, filePath], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Slider link and logo uploaded successfully",
      logoUrl: filePath,
    });
  });
});


router.post("/edit-bottom-sliders/:id", verifyToken, upload.single("websitelogo"), (req, res) => {
  const { id } = req.params;
  const { websitelink } = req.body;

  let updateSql = "UPDATE bottom_slider SET";
  const updateParams = [];

  if (websitelink) {
    updateSql += " websitelink = ?";
    updateParams.push(websitelink);
  }

  let newFilePath = null;
  if (req.file) {
    newFilePath = `/uploads/${req.file.filename}`;
    updateSql +=
      updateParams.length > 0 ? ", websitelogo = ?" : " websitelogo = ?";
    updateParams.push(newFilePath);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT websitelogo FROM bottom_slider WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Slider link not found" });
    }

    const oldFilePath = result[0].websitelogo;

    db.query(updateSql, updateParams, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (newFilePath) {
        fs.unlink(path.join(__dirname, "..", oldFilePath), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old file:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Slider link updated successfully" });
    });
  });
});


router.post("/delete-bottom-sliders/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT websitelogo FROM bottom_slider WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Slider link not found" });
    }

    const filePath = result[0].websitelogo;

    const deleteSql = "DELETE FROM bottom_slider WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      fs.unlink(path.join(__dirname, "..", filePath), (fsErr) => {
        if (fsErr) {
          console.error("Error deleting file:", fsErr);
        }
      });

      res.status(200).json({ message: "Slider link deleted successfully" });
    });
  });
});


module.exports = router;
