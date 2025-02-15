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

router.post("/contact-info", upload.single("contactIcon"), (req, res) => {
  const { heading, description } = req.body;

  if (!heading || !description) {
    return res
      .status(400)
      .json({ message: "Heading and description are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO contactinfo (heading, description, image_path) VALUES (?, ?, ?)";
  db.query(sql, [heading, description, imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Contact added successfully", contactId: result.insertId });
  });
});

router.get("/contact-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM contactinfo WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM contactinfo";
  }
  db.query(query, params,(err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/contact-info/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM contactinfo WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/contact-info/:id", upload.single("contactIcon"), (req, res) => {
  const { id } = req.params;
  const { heading, description } = req.body;

  let updateSql = "UPDATE contactinfo SET";
  const updateParams = [];

  if (heading) {
    updateSql += " heading = ?";
    updateParams.push(heading);
  }

  if (description) {
    updateSql +=
      updateParams.length > 0 ? ", description = ?" : " description = ?";
    updateParams.push(description);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql +=
      updateParams.length > 0 ? ", image_path = ?" : " image_path = ?";
    updateParams.push(imagePath);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM contactinfo WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const oldImagePath = result[0].image_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldImagePath) {
        const fullPath = path.join(
          __dirname,
          "..",
          oldImagePath.replace(/^\//, "")
        );
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Contact updated successfully" });
    });
  });
});

router.delete("/contact-info/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM contactinfo WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM contactinfo WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (imagePath) {
        fs.unlink(path.join(__dirname, "..", imagePath), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Contact deleted successfully" });
    });
  });
});

module.exports = router;
