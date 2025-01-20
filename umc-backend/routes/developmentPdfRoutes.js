const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const db = require("../config/db.js");
const fs = require("fs");

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
  "/development-plan-pdf",
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  (req, res) => {
    const { name } = req.body;
    const imagePath = req.files?.image ? req.files.image[0].path : null;
    const pdfPath = req.files?.pdf ? req.files.pdf[0].path : null;

    if (!name || !imagePath || !pdfPath) {
      return res
        .status(400)
        .json({ message: "Name, image, and PDF files are required." });
    }

    const sql =
      "INSERT INTO development_plan_pdf (name, image_path, pdf_path) VALUES (?, ?, ?)";
    db.query(sql, [name, imagePath, pdfPath], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database insertion failed", error: err });
      }
      res
        .status(201)
        .json({ message: "Record added successfully", data: result });
    });
  }
);

router.get("/development-plan-pdf", (req, res) => {
  const sql = "SELECT * FROM development_plan_pdf";
  db.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database retrieval failed", error: err });
    }
    res.json(results);
  });
});

router.put(
  "/development-plan-pdf/:id",
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    let updateSql = "UPDATE development_plan_pdf SET";
    const updateParams = [];

    if (name) {
      updateSql += " name = ?";
      updateParams.push(name);
    }

    if (req.files && req.files.image) {
      const newImagePath = `uploads/${req.files.image[0].filename}`;
      updateSql +=
        updateParams.length > 0 ? ", image_path = ?" : " image_path = ?";
      updateParams.push(newImagePath);
    }

    if (req.files && req.files.pdf) {
      const newPdfPath = `uploads/${req.files.pdf[0].filename}`;
      updateSql += updateParams.length > 0 ? ", pdf_path = ?" : " pdf_path = ?";
      updateParams.push(newPdfPath);
    }

    if (updateParams.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    updateSql += " WHERE id = ?";
    updateParams.push(id);

    const selectSql =
      "SELECT image_path, pdf_path FROM development_plan_pdf WHERE id = ?";
    db.query(selectSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Development Plan not found" });
      }

      const { image_path: oldFilePath, pdf_path: oldPdfPath } = result[0];

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

        res
          .status(200)
          .json({ message: "Development Plan updated successfully" });
      });
    });
  }
);

router.delete("/development-plan-pdf/:id", (req, res) => {
  const sql = "DELETE FROM development_plan_pdf WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database deletion failed", error: err });
    }
    res.json({ success: true });
  });
});

module.exports = router;
