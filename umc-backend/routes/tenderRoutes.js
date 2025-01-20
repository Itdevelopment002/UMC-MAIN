const fs = require("fs");
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/tenders", (req, res) => {
  db.query("SELECT * FROM `tenders`", (err, results) => {
    if (err) {
      console.error("Error fetching tenders:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

router.post("/tenders", upload.single("pdf"), (req, res) => {
  const { description, status } = req.body;
  const pdfPath = req.file ? req.file.path : null;

  const finalStatus = status || "-";

  if (!description || !pdfPath) {
    return res
      .status(400)
      .json({ message: "Description and PDF file are required." });
  }

  const newCharter = { description, status: finalStatus, pdf: pdfPath };

  db.query(
    "INSERT INTO `tenders` (description, status, pdf) VALUES (?, ?, ?)",
    [description, finalStatus, pdfPath],
    (err, result) => {
      if (err) {
        console.error("Error adding tender:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ id: result.insertId, ...newCharter });
    }
  );
});

router.put("/tenders/:id", upload.single("pdf"), (req, res) => {
  const { id } = req.params;
  const { description, status, retainPdf } = req.body;
  const newPdfPath = req.file ? req.file.path : null;

  db.query("SELECT pdf FROM `tenders` WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching tender:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const currentPdfPath = results[0]?.pdf;

    const updatedTender = {
      description,
      status,
      pdf: newPdfPath || (retainPdf ? currentPdfPath : null),
    };

    db.query(
      "UPDATE `tenders` SET description = ?, status = ?, pdf = ? WHERE id = ?",
      [description, status, updatedTender.pdf, id],
      (err) => {
        if (err) {
          console.error("Error updating tender:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (newPdfPath && currentPdfPath) {
          fs.unlink(currentPdfPath, (err) => {
            if (err) {
              console.error("Error deleting old PDF:", err);
            }
          });
        }

        res.json({ id, ...updatedTender });
      }
    );
  });
});

router.delete("/tenders/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT pdf FROM `tenders` WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching tender:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const pdfPath = results[0]?.pdf;

    db.query("DELETE FROM `tenders` WHERE id = ?", [id], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting tender:", deleteErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (pdfPath) {
        fs.unlink(pdfPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting PDF:", unlinkErr);
          }
        });
      }

      res.json({ message: "Tender and associated PDF deleted successfully" });
    });
  });
});

router.use("/uploads", express.static("uploads"));

module.exports = router;
