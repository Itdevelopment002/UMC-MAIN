const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require('../utils/uploadValidation');
const sanitizeInput = require("../middleware/sanitizeInput.js");
const { validateCommissionerData, validateaddCommissionerDesc } = require("../middleware/validationinputfield.js");

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


router.get("/dept-commissioner-details", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM dept_commissioner_details WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM dept_commissioner_details";
  }
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/dept-commissioner-details/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM dept_commissioner_details WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Deputy Commissioner not found" });
    }
    res.status(200).json(result[0]);
  });
});


router.get("/dept-commissioner-desc", (req, res) => {
  const { lang, commissioner } = req.query;
  let query = "SELECT * FROM dept_commissioner_desc";
  let params = [];

  if (lang && commissioner) {
    query += " WHERE language_code = ? AND commissioner_name = ?";
    params.push(lang, commissioner);
  } else if (lang) {
    query += " WHERE language_code = ?";
    params.push(lang);
  } else if (commissioner) {
    query += " WHERE commissioner_name = ?";
    params.push(commissioner);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/dept-commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM dept_commissioner_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Deputy Commissioner description not found" });
    }
    res.status(200).json(result[0]);
  });
});


router.post(
  "/dept-commissioner-details",
  verifyToken,
  upload.single("coImage"),
  sanitizeInput,
  handleMulterError,
  validateCommissionerData,
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
      language_code
    } = req.body;


    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO dept_commissioner_details 
      (coName, designation, qualification, address, number, email, language_code, image_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      coName,
      designation,
      qualification,
      address,
      number,
      email,
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
        message: "Deputy Commissioner added successfully",
        id: result.insertId
      });
    });
  }
);


router.post("/dept-commissioner-desc", verifyToken, sanitizeInput, validateaddCommissionerDesc,  (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { description, language_code, commissioner_name } = req.body;

  if (!description || !language_code || !commissioner_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO dept_commissioner_desc 
    (commissioner_name, description, language_code) 
    VALUES (?, ?, ?)
  `;

  db.query(sql, [commissioner_name, description, language_code], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Deputy Commissioner description added successfully",
      id: result.insertId
    });
  });
});


router.post(
  "/edit-dept-commissioner-details/:id",
  verifyToken,
  upload.single("coImage"),
  sanitizeInput,
  handleMulterError,
  validateCommissionerData,
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
      language_code
    } = req.body;

    if (!coName && !designation && !qualification && !address &&
      !number && !email && !language_code && !req.file) {
      return res.status(400).json({ message: "No fields to update" });
    }

    let updateSql = "UPDATE dept_commissioner_details SET";
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

    const selectSql = "SELECT image_path FROM dept_commissioner_details WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err || result.length === 0) {
        if (req.file) {
          await deleteFileIfExists(newImagePath);
        }
        return res.status(err ? 500 : 404).json({
          message: err ? 'Database error' : 'Deputy Commissioner not found',
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
          message: "Deputy Commissioner updated successfully"
        });
      });
    });
  }
);


router.post("/edit-dept-commissioner-desc/:id", verifyToken, sanitizeInput, validateaddCommissionerDesc, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;
  const { description, language_code, commissioner_name } = req.body;

  const sql = `
    UPDATE dept_commissioner_desc 
    SET commissioner_name = ?, description = ?, language_code = ?
    WHERE id = ?
  `;

  db.query(sql, [commissioner_name, description, language_code, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Deputy Commissioner description not found" });
    }
    res.status(200).json({ message: "Deputy Commissioner description updated successfully" });
  });
});


router.post(
  "/delete-dept-commissioner-details/:id",
  verifyToken,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;

    const selectSql = "SELECT image_path FROM dept_commissioner_details WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err
        });
      }
      if (result.length === 0) {
        return res.status(404).json({
          message: "Deputy Commissioner not found"
        });
      }

      const imagePath = result[0].image_path;
      const deleteSql = "DELETE FROM dept_commissioner_details WHERE id = ?";

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
          message: "Deputy Commissioner deleted successfully"
        });
      });
    });
  }
);


router.post("/delete-dept-commissioner-desc/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;
  const sql = "DELETE FROM dept_commissioner_desc WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Deputy Commissioner description not found" });
    }
    res.status(200).json({ message: "Deputy Commissioner description deleted successfully" });
  });
});

module.exports = router;