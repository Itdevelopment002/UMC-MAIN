const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require('../utils/uploadValidation');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateTourism } = require("../middleware/validationinputfield.js");

// Create upload middleware using global config
const upload = multer(getMulterConfig());
const uploadFields = upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

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

const deleteMultipleFiles = async (filePaths) => {
  if (!filePaths || !Array.isArray(filePaths)) return;

  await Promise.all(filePaths.map(filePath => deleteFileIfExists(filePath)));
};

router.get("/tourism", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM ad_tourism WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM ad_tourism";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

router.get("/tourism/name/:name", (req, res) => {
  const { name } = req.params;

  const sql = "SELECT * FROM ad_tourism WHERE name = ?";
  db.query(sql, [name], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Tourism site not found" });
    }

    const tourism = result[0];
    res.status(200).json({
      id: tourism.id,
      name: tourism.name,
      address: tourism.address,
      hours: tourism.hours,
      description: tourism.description,
      main_image: tourism.main_image,
      location_link: tourism.location_link,
      language_code: tourism.language_code,
      gallery: JSON.parse(tourism.gallery || '[]'),
    });
  });
});

router.post(
  "/tourism",
  verifyToken,
  uploadFields,
  sanitizeInput,
  handleMulterError,
  validateTourism,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { name, address, hours, description, locationLink, language_code } = req.body;

    if (!name || !address || !hours || !description || !locationLink || !language_code || !req.files?.main_image) {
      // Clean up any uploaded files if validation fails
      if (req.files?.main_image) {
        await deleteFileIfExists(`/uploads/${req.files.main_image[0].filename}`);
      }
      if (req.files?.gallery) {
        await deleteMultipleFiles(req.files.gallery.map(file => `/uploads/${file.filename}`));
      }
      return res.status(400).json({ message: "All fields are required" });
    }

    const mainImagePath = `/uploads/${req.files.main_image[0].filename}`;
    const imagePaths = req.files.gallery
      ? req.files.gallery.map((file) => `/uploads/${file.filename}`)
      : [];

    const query = `
      INSERT INTO ad_tourism (name, address, hours, description, main_image, location_link, language_code, gallery)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [name, address, hours, description, mainImagePath, locationLink, language_code, JSON.stringify(imagePaths)],
      async (err, result) => {
        if (err) {
          // Clean up files if database operation fails
          await deleteFileIfExists(mainImagePath);
          await deleteMultipleFiles(imagePaths);
          return res.status(500).json({ message: "Error adding tourism site", error: err });
        }

        res.status(201).json({
          message: "Tourism site added successfully",
          tourismId: result.insertId,
          main_image: mainImagePath,
          gallery: imagePaths,
        });
      }
    );
  }
);

router.post(
  "/edit-tourism/:id",
  verifyToken,
  uploadFields,
  sanitizeInput,
  handleMulterError,
  validateTourism,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;
    const { name, address, hours, description, locationLink, language_code } = req.body;

    if (!name && !address && !hours && !description && !locationLink && !language_code && !req.files?.main_image && !req.files?.gallery) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // First get the current images from database
    const selectSql = "SELECT main_image, gallery FROM ad_tourism WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err || result.length === 0) {
        return res.status(err ? 500 : 404).json({
          message: err ? "Database error" : "Tourism site not found",
          error: err
        });
      }

      const currentData = result[0];
      const oldMainImage = currentData.main_image;
      const oldGallery = JSON.parse(currentData.gallery || '[]');

      let newMainImage = oldMainImage;
      let newGallery = oldGallery;
      let filesToDelete = [];

      // Process main image update if provided
      if (req.files?.main_image) {
        newMainImage = `/uploads/${req.files.main_image[0].filename}`;
        filesToDelete.push(oldMainImage);
      }

      // Process gallery update if provided
      if (req.files?.gallery) {
        newGallery = req.files.gallery.map(file => `/uploads/${file.filename}`);
        filesToDelete = [...filesToDelete, ...oldGallery];
      }

      // Build the update query
      let updateSql = "UPDATE ad_tourism SET";
      const updateParams = [];
      const updates = [];

      if (name) {
        updates.push("name = ?");
        updateParams.push(name);
      }
      if (address) {
        updates.push("address = ?");
        updateParams.push(address);
      }
      if (hours) {
        updates.push("hours = ?");
        updateParams.push(hours);
      }
      if (description) {
        updates.push("description = ?");
        updateParams.push(description);
      }
      if (locationLink) {
        updates.push("location_link = ?");
        updateParams.push(locationLink);
      }
      if (language_code) {
        updates.push("language_code = ?");
        updateParams.push(language_code);
      }
      if (req.files?.main_image) {
        updates.push("main_image = ?");
        updateParams.push(newMainImage);
      }
      if (req.files?.gallery) {
        updates.push("gallery = ?");
        updateParams.push(JSON.stringify(newGallery));
      }

      updateSql += ' ' + updates.join(', ') + ' WHERE id = ?';
      updateParams.push(id);

      // Execute the update
      db.query(updateSql, updateParams, async (err) => {
        if (err) {
          // Clean up newly uploaded files if update fails
          if (req.files?.main_image) {
            await deleteFileIfExists(newMainImage);
          }
          if (req.files?.gallery) {
            await deleteMultipleFiles(newGallery);
          }
          return res.status(500).json({ message: "Database error", error: err });
        }

        // Delete old files if update was successful
        await deleteMultipleFiles(filesToDelete);

        res.status(200).json({ message: "Tourism site updated successfully" });
      });
    });
  }
);

router.post(
  "/delete-tourism/:id",
  verifyToken,
  async (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;

    const selectSql = "SELECT gallery, main_image FROM ad_tourism WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Tourism site not found" });
      }

      const { gallery, main_image } = result[0];
      const imagesToDelete = [...JSON.parse(gallery || '[]'), main_image];

      const deleteSql = "DELETE FROM ad_tourism WHERE id = ?";
      db.query(deleteSql, [id], async (err) => {
        if (err) {
          return res.status(500).json({ message: "Database error", error: err });
        }

        await deleteMultipleFiles(imagesToDelete);

        res.status(200).json({ message: "Tourism site deleted successfully" });
      });
    });
  }
);

module.exports = router;