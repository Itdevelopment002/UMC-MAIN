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

const upload = multer({ storage,
 limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/sliders", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const sliderName = req.body.sliderName;

  if (!sliderName) {
    return res.status(400).json({ message: "Slider name is required" });
  }

  const sql = "INSERT INTO slider (slider_name, file_path) VALUES (?, ?)";
  db.query(sql, [sliderName, filePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Image and slider name uploaded successfully",
      imageUrl: filePath,
    });
  });
});

router.get("/sliders", (req, res) => {
  const sql = "SELECT * FROM slider";
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
        slider_name: row.slider_name,
        file_path: row.file_path,
        uploaded_at: row.uploaded_at,
        formattedId: formattedId,
      };
    });

    res.status(200).json(formattedResults);
  });
});

router.get("/sliders/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM slider WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Slider not found" });
    }

    const slider = result[0];
    res.status(200).json({
      id: slider.id,
      slider_name: slider.slider_name,
      file_path: slider.file_path,
      uploaded_at: slider.uploaded_at,
    });
  });
});

router.delete("/sliders/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT file_path FROM slider WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Slider not found" });
    }

    const filePath = result[0].file_path;

    const deleteSql = "DELETE FROM slider WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      fs.unlink(path.join(__dirname, "..", filePath), (fsErr) => {
        if (fsErr) {
          console.error("Error deleting file:", fsErr);
        }
      });

      res.status(200).json({ message: "Slider deleted successfully" });
    });
  });
});

router.put("/sliders/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { slider_name } = req.body;

  let updateSql = "UPDATE slider SET";
  const updateParams = [];

  if (slider_name) {
    updateSql += " slider_name = ?";
    updateParams.push(slider_name);
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

  const selectSql = "SELECT file_path FROM slider WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Slider not found" });
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

      res.status(200).json({ message: "Slider updated successfully" });
    });
  });
});

module.exports = router;
