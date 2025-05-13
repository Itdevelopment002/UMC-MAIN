const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);


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
    if (err) throw err;
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
      gallery: JSON.parse(tourism.gallery),
    });
  });
});


router.post("/tourism", verifyToken, uploadFields, (req, res) => {
  const { name, address, hours, description, locationLink, language_code } = req.body;

  if (!name || !address || !hours || !description || !locationLink || !language_code || !req.files.main_image) {
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
    (err, result) => {
      if (err) {
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
});


router.post("/edit-tourism/:id", verifyToken, uploadFields, (req, res) => {
  const { id } = req.params;
  const { name, address, hours, description, locationLink, language_code } = req.body;

  let updateSql = "UPDATE ad_tourism SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }

  if (address) {
    updateSql += updateParams.length > 0 ? ", address = ?" : " address = ?";
    updateParams.push(address);
  }

  if (hours) {
    updateSql += updateParams.length > 0 ? ", hours = ?" : " hours = ?";
    updateParams.push(hours);
  }

  if (description) {
    updateSql += updateParams.length > 0 ? ", description = ?" : " description = ?";
    updateParams.push(description);
  }

  if (locationLink) {
    updateSql += updateParams.length > 0 ? ", location_link = ?" : " location_link = ?";
    updateParams.push(locationLink);
  }

  if (language_code) {
    updateSql += updateParams.length > 0 ? ", language_code = ?" : " language_code = ?";
    updateParams.push(language_code);
  }

  if (req.files.main_image) {
    const mainImagePath = `/uploads/${req.files.main_image[0].filename}`;
    updateSql += updateParams.length > 0 ? ", main_image = ?" : " main_image = ?";
    updateParams.push(mainImagePath);
  }

  if (req.files.gallery) {
    const newImagePaths = req.files.gallery.map((file) => `/uploads/${file.filename}`);
    updateSql += updateParams.length > 0 ? ", gallery = ?" : " gallery = ?";
    updateParams.push(JSON.stringify(newImagePaths));
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  db.query(updateSql, updateParams, (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Tourism site updated successfully" });
  });
});


router.post("/delete-tourism/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT gallery, main_image FROM ad_tourism WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Tourism site not found" });
    }

    const { gallery, main_image } = result[0];

    const images = JSON.parse(gallery);
    const allImages = [...images, main_image];

    const deleteSql = "DELETE FROM ad_tourism WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      allImages.forEach((image) => {
        const filePath = path.join(__dirname, "..", image);
        fs.unlink(filePath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting image:", fsErr);
          }
        });
      });

      res.status(200).json({ message: "Tourism site deleted successfully" });
    });
  });
});


module.exports = router;
