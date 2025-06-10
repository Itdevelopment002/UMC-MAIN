const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require('../utils/uploadValidation');

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

const validateAssistantCommissionerData = (data) => {
  const requiredFields = [
    'coName', 'designation', 'qualification',
    'address', 'number', 'email',
    'description', 'language_code'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      isValid: false,
      message: 'Invalid email format'
    };
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(data.number)) {
    return {
      isValid: false,
      message: 'Invalid phone number format (10-15 digits required)'
    };
  }

  return { isValid: true };
};

router.get("/asst-commissioner-data", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM asst_commissioner_details WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM asst_commissioner_details";
  }
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/asst-commissioner-data/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM asst_commissioner_details WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Assistant Commissioner not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.post(
  "/asst-commissioner-data",
  verifyToken,
  upload.single("coImage"),
  handleMulterError,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const {
      coName,
      designation,
      qualification,
      address,
      number,
      email,
      description,
      language_code
    } = req.body;

    // Validate input data
    const validation = validateAssistantCommissionerData(req.body);
    if (!validation.isValid) {
      if (req.file) {
        await deleteFileIfExists(`/uploads/${req.file.filename}`);
      }
      return res.status(400).json({ message: validation.message });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO asst_commissioner_details 
      (coName, designation, qualification, address, number, email, description, language_code, image_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      coName,
      designation,
      qualification,
      address,
      number,
      email,
      description,
      language_code,
      imagePath
    ], async (err, result) => {
      if (err) {
        if (req.file) {
          await deleteFileIfExists(imagePath);
        }
        return res.status(500).json({
          message: "Database error",
          error: err
        });
      }
      res.status(201).json({
        message: "Assistant Commissioner added successfully",
        id: result.insertId
      });
    });
  }
);

router.post(
  "/edit-asst-commissioner-data/:id",
  verifyToken,
  upload.single("coImage"),
  handleMulterError,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;
    const {
      coName,
      designation,
      qualification,
      address,
      number,
      email,
      description,
      language_code
    } = req.body;

    if (!coName && !designation && !qualification && !address &&
      !number && !email && !description && !language_code && !req.file) {
      return res.status(400).json({ message: "No fields to update" });
    }

    let updateSql = "UPDATE asst_commissioner_details SET";
    const updateParams = [];
    const updates = [];

    if (coName) {
      updates.push("coName = ?");
      updateParams.push(coName);
    }
    if (designation) {
      updates.push("designation = ?");
      updateParams.push(designation);
    }
    if (qualification) {
      updates.push("qualification = ?");
      updateParams.push(qualification);
    }
    if (address) {
      updates.push("address = ?");
      updateParams.push(address);
    }
    if (number) {
      updates.push("number = ?");
      updateParams.push(number);
    }
    if (email) {
      updates.push("email = ?");
      updateParams.push(email);
    }
    if (description) {
      updates.push("description = ?");
      updateParams.push(description);
    }
    if (language_code) {
      updates.push("language_code = ?");
      updateParams.push(language_code);
    }

    let newImagePath;
    if (req.file) {
      newImagePath = `/uploads/${req.file.filename}`;
      updates.push("image_path = ?");
      updateParams.push(newImagePath);
    }

    updateSql += ' ' + updates.join(', ') + ' WHERE id = ?';
    updateParams.push(id);

    const selectSql = "SELECT image_path FROM asst_commissioner_details WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err || result.length === 0) {
        if (req.file) {
          await deleteFileIfExists(newImagePath);
        }
        return res.status(err ? 500 : 404).json({
          message: err ? 'Database error' : 'Assistant Commissioner not found',
          error: err
        });
      }

      const oldImagePath = result[0].image_path;

      db.query(updateSql, updateParams, async (err, updateResult) => {
        if (err) {
          if (req.file) {
            await deleteFileIfExists(newImagePath);
          }
          return res.status(500).json({
            message: "Database error",
            error: err
          });
        }

        if (req.file && oldImagePath) {
          await deleteFileIfExists(oldImagePath);
        }

        res.status(200).json({
          message: "Assistant Commissioner updated successfully"
        });
      });
    });
  }
);

router.post(
  "/delete-asst-commissioner-data/:id",
  verifyToken,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;

    const selectSql = "SELECT image_path FROM asst_commissioner_details WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err
        });
      }
      if (result.length === 0) {
        return res.status(404).json({
          message: "Assistant Commissioner not found"
        });
      }

      const imagePath = result[0].image_path;
      const deleteSql = "DELETE FROM asst_commissioner_details WHERE id = ?";

      db.query(deleteSql, [id], async (err, deleteResult) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
            error: err
          });
        }

        if (imagePath) {
          await deleteFileIfExists(imagePath);
        }

        res.status(200).json({
          message: "Assistant Commissioner deleted successfully"
        });
      });
    });
  }
);

module.exports = router;