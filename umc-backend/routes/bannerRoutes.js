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

router.get("/banner", (req, res) => {
  const sql = "SELECT * FROM banner";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const formattedResults = results.map((row, index) => {
      const date = new Date(row.uploaded_at);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);

      const formattedId = `IN/${String(index + 1).padStart(
        4,
        "0"
      )}/${day}-${month}-${year}`;

      return {
        id: row.id,
        banner_name: row.banner_name,
        file_path: row.file_path,
        uploaded_at: row.uploaded_at,
        formattedId: formattedId,
      };
    });

    res.status(200).json(formattedResults);
  });
});


router.get("/banner/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM banner WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const banner = result[0];
    res.status(200).json({
      id: banner.id,
      banner_name: banner.banner_name,
      file_path: banner.file_path,
      uploaded_at: banner.uploaded_at,
    });
  });
});


router.post("/banner", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const bannerName = req.body.bannerName;

  if (!bannerName) {
    return res.status(400).json({ message: "Banner name is required" });
  }

  const sql = "INSERT INTO banner (banner_name, file_path) VALUES (?, ?)";
  db.query(sql, [bannerName, filePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Image and banner name uploaded successfully",
      imageUrl: filePath,
    });
  });
});


router.put("/banner/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { banner_name } = req.body;

  let updateSql = "UPDATE banner SET";
  const updateParams = [];

  if (banner_name) {
    updateSql += " banner_name = ?";
    updateParams.push(banner_name);
  }

  if (req.file) {
    const newFilePath = `/uploads/${req.file.filename}`;
    updateSql += updateParams.length > 0 ? ", file_path = ?" : " file_path = ?";
    updateParams.push(newFilePath);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT file_path FROM banner WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const oldFilePath = result[0].file_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file) {
        fs.unlink(path.join(__dirname, "..", oldFilePath), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old file:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "banner updated successfully" });
    });
  });
});


router.delete("/banner/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT file_path FROM banner WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const filePath = result[0].file_path;

    const deleteSql = "DELETE FROM banner WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      fs.unlink(path.join(__dirname, "..", filePath), (fsErr) => {
        if (fsErr) {
          console.error("Error deleting file:", fsErr);
        }
      });

      res.status(200).json({ message: "Banner deleted successfully" });
    });
  });
});


module.exports = router;
