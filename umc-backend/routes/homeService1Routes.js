const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const deleteFileIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
};


router.get("/home-services1", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM home_services1 WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM home_services1";
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/home-services1/:id?", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  let query;
  let params = [];

  if (id) {
    query = "SELECT * FROM home_services1 WHERE id = ?";
    params.push(id);
  } else if (lang) {
    query = "SELECT * FROM home_services1 WHERE language_code = ?";
    params.push(lang);
  } else {
    query = "SELECT * FROM home_services1";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (id && results.length === 0) {
      return res.status(404).json({ message: "Home Service not found" });
    }
    res.status(200).json(id ? results[0] : results);
  });
});


router.post(
  "/home-services1", verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  async (req, res) => {
    const { heading, link, language_code } = req.body;
    if (!heading || !link || !language_code) {
      return res
        .status(400)
        .json({ message: "Home Service heading, language code and link are required" });
    }

    let mainIconPath = null;

    if (req.files["mainIcon"]) {
      mainIconPath = path.join("uploads", req.files["mainIcon"][0].filename);
    }

    const insertSql =
      "INSERT INTO home_services1 (heading, link, language_code, main_icon_path) VALUES (?, ?, ?, ?)";
    const insertParams = [
      heading,
      link,
      language_code,
      mainIconPath,
    ];

    db.query(insertSql, insertParams, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(201)
        .json({
          message: "Home Service added successfully",
          initiativeId: result.insertId,
        });
    });
  }
);


router.put(
  "/home-services1/:id", verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  async (req, res) => {
    const { id } = req.params;
    const { heading, link, language_code } = req.body;

    let updateSql = "UPDATE home_services1 SET";
    const updateParams = [];

    if (heading) {
      updateSql += " heading = ?";
      updateParams.push(heading);
    }

    if (link) {
      updateSql +=
        updateParams.length > 0 ? ", link = ?" : " link = ?";
      updateParams.push(link);
    }

    if (language_code) {
      updateSql +=
        updateParams.length > 0 ? ", language_code = ?" : " language_code = ?";
      updateParams.push(language_code);
    }

    if (req.files["mainIcon"]) {
      const newMainIconPath = path.join(
        "uploads",
        req.files["mainIcon"][0].filename
      );
      updateSql +=
        updateParams.length > 0
          ? ", main_icon_path = ?"
          : " main_icon_path = ?";
      updateParams.push(newMainIconPath);
    }

    if (updateParams.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    updateSql += " WHERE id = ?";
    updateParams.push(id);

    const selectSql =
      "SELECT main_icon_path FROM home_services1 WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        console.error("Database Selection Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Home Service not found" });
      }

      const {
        main_icon_path: oldMainIconPath,
      } = result[0];

      db.query(updateSql, updateParams, async (err) => {
        if (err) {
          console.error("Database Update Error:", err);
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (req.files["mainIcon"]) {
          await deleteFileIfExists(
            path.join(__dirname, "../", oldMainIconPath)
          );
        }

        res.status(200).json({ message: "Home Service updated successfully" });
      });
    });
  }
);


router.delete("/home-services1/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const selectSql =
    "SELECT main_icon_path FROM home_services1 WHERE id = ?";
  db.query(selectSql, [id], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Home Service not found" });
    }

    const { main_icon_path: mainIconPath } =
      result[0];

    const deleteSql = "DELETE FROM home_services1 WHERE id = ?";
    db.query(deleteSql, [id], async (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      await deleteFileIfExists(path.join(__dirname, "../", mainIconPath));

      res.status(200).json({ message: "Home Service deleted successfully" });
    });
  });
});


module.exports = router;
