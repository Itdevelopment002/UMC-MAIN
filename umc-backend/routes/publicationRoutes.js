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

const upload = multer({ storage });

router.post(
  "/publications",
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  (req, res) => {
    const image = req.files["image"] ? req.files["image"][0].filename : null;
    const pdf = req.files["pdf"] ? req.files["pdf"][0].filename : null;
    const publicationName = req.body.publicationName;

    if (!publicationName || !image || !pdf) {
      return res
        .status(400)
        .json({ message: "Publication name, image, and PDF are required" });
    }

    const imagePath = `/uploads/${image}`;
    const pdfPath = `/uploads/${pdf}`;

    const sql =
      "INSERT INTO publications (publication_name, file_path, pdf_path) VALUES (?, ?, ?)";
    db.query(sql, [publicationName, imagePath, pdfPath], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(201)
        .json({
          message: "Files uploaded successfully",
          imageUrl: imagePath,
          pdfUrl: pdfPath,
        });
    });
  }
);

router.get("/publications", (req, res) => {
  const sql = "SELECT * FROM publications";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch publications" });
    }
    res.status(200).json(results);
  });
});

router.delete("/publications/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT file_path, pdf_path FROM publications WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const { file_path, pdf_path } = result[0];

    const deleteSql = "DELETE FROM publications WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      [file_path, pdf_path].forEach((file) => {
        fs.unlink(path.join(__dirname, "..", file), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting file:", fsErr);
          }
        });
      });

      res.status(200).json({ message: "Publication deleted successfully" });
    });
  });
});

router.put(
  "/publications/:id",
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  (req, res) => {
    const { id } = req.params;
    const { publication_name } = req.body;

    let updateSql = "UPDATE publications SET";
    const updateParams = [];

    if (publication_name) {
      updateSql += " publication_name = ?";
      updateParams.push(publication_name);
    }

    if (req.files && req.files.image) {
      const newImagePath = `/uploads/${req.files.image[0].filename}`;
      updateSql +=
        updateParams.length > 0 ? ", file_path = ?" : " file_path = ?";
      updateParams.push(newImagePath);
    }

    if (req.files && req.files.pdf) {
      const newPdfPath = `/uploads/${req.files.pdf[0].filename}`;
      updateSql += updateParams.length > 0 ? ", pdf_path = ?" : " pdf_path = ?";
      updateParams.push(newPdfPath);
    }

    if (updateParams.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    updateSql += " WHERE id = ?";
    updateParams.push(id);

    const selectSql =
      "SELECT file_path, pdf_path FROM publications WHERE id = ?";
    db.query(selectSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Publication not found" });
      }

      const { file_path: oldFilePath, pdf_path: oldPdfPath } = result[0];

      db.query(updateSql, updateParams, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (req.files && req.files.image) {
          fs.unlink(path.join(__dirname, "..", oldFilePath), (fsErr) => {
            if (fsErr) {
              console.error("Error deleting old image file:", fsErr);
            }
          });
        }

        if (req.files && req.files.pdf) {
          fs.unlink(path.join(__dirname, "..", oldPdfPath), (fsErr) => {
            if (fsErr) {
              console.error("Error deleting old PDF file:", fsErr);
            }
          });
        }

        res.status(200).json({ message: "Publication updated successfully" });
      });
    });
  }
);

module.exports = router;
