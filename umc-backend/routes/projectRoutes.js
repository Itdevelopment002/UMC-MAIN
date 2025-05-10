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


router.get("/projects", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM projects WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM projects";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM projects WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(result[0]);
  });
});


router.post(
  "/projects", verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  async (req, res) => {
    const { heading, description, link, language_code } = req.body;
    if (!heading || !description || !link || !language_code) {
      return res
        .status(400)
        .json({ message: "Project heading, Language code, description and link are required" });
    }

    let mainIconPath = null;

    if (req.files["mainIcon"]) {
      mainIconPath = path.join("uploads", req.files["mainIcon"][0].filename);
    }

    const insertSql =
      "INSERT INTO projects (heading, description, link, language_code, main_icon_path) VALUES (?, ?, ?, ?, ?)";
    const insertParams = [
      heading,
      description,
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
          message: "Project added successfully",
          projectId: result.insertId,
        });
    });
  }
);


router.put(
  "/projects/:id", verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  async (req, res) => {
    const { id } = req.params;
    const { heading, description, link, language_code } = req.body;

    let updateSql = "UPDATE projects SET";
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
      "SELECT main_icon_path FROM projects WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        console.error("Database Selection Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Project not found" });
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

        res.status(200).json({ message: "Project updated successfully" });
      });
    });
  }
);


router.delete("/projects/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const selectSql =
    "SELECT main_icon_path FROM projects WHERE id = ?";
  db.query(selectSql, [id], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { main_icon_path: mainIconPath } =
      result[0];

    const deleteSql = "DELETE FROM projects WHERE id = ?";
    db.query(deleteSql, [id], async (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      await deleteFileIfExists(path.join(__dirname, "../", mainIconPath));

      res.status(200).json({ message: "Project deleted successfully" });
    });
  });
});


module.exports = router;
