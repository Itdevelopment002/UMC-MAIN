const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require("../utils/uploadValidation");

const upload = multer(getMulterConfig());


const deleteFileIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
};


router.get("/department-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM departmentinfo WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM departmentinfo";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.get("/department-info/:id", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  let query;
  let params = [];

  if (id) {
    query = "SELECT * FROM departmentinfo WHERE id = ?";
    params.push(id);
  } else if (lang) {
    query = "SELECT * FROM departmentinfo WHERE language_code = ?";
    params.push(lang);
  } else {
    query = "SELECT * FROM departmentinfo";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (id && results.length === 0) {
      return res.status(404).json({ message: "Department Info not found" });
    }
    res.status(200).json(id ? results[0] : results);
  });
});


router.post(
  "/department-info",
  verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  handleMulterError,
  (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { heading, link, language_code } = req.body;

    if (!heading || !link || !language_code) {
      if (req.files && req.files["mainIcon"]) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.files["mainIcon"][0].filename), () => { });
      }
      return res.status(400).json({
        message: "Department heading, language code and link are required"
      });
    }

    const mainIconPath = req.files["mainIcon"]
      ? path.join("uploads", req.files["mainIcon"][0].filename)
      : null;

    const insertSql = "INSERT INTO departmentinfo (heading, link, language_code, main_icon_path) VALUES (?, ?, ?, ?)";
    const insertParams = [heading, link, language_code, mainIconPath];

    db.query(insertSql, insertParams, (err, result) => {
      if (err) {
        if (req.files && req.files["mainIcon"]) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.files["mainIcon"][0].filename), () => { });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({
        message: "Department added successfully",
        departmentPageId: result.insertId,
      });
    });
  }
);


router.post(
  "/edit-department-info/:id",
  verifyToken,
  upload.fields([{ name: "mainIcon" }]),
  handleMulterError,
  (req, res) => {
    if (req.user?.role === "Admin") {
      return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
    }
    const { id } = req.params;
    const { heading, link, language_code } = req.body;

    let updateSql = "UPDATE departmentinfo SET";
    const updateParams = [];

    if (heading) {
      updateSql += " heading = ?";
      updateParams.push(heading);
    }

    if (link) {
      updateSql += updateParams.length > 0 ? ", link = ?" : " link = ?";
      updateParams.push(link);
    }

    if (language_code) {
      updateSql += updateParams.length > 0 ? ", language_code = ?" : " language_code = ?";
      updateParams.push(language_code);
    }

    let newMainIconPath = null;
    if (req.files && req.files["mainIcon"]) {
      newMainIconPath = path.join("uploads", req.files["mainIcon"][0].filename);
      updateSql += updateParams.length > 0 ? ", main_icon_path = ?" : " main_icon_path = ?";
      updateParams.push(newMainIconPath);
    }

    if (updateParams.length === 0) {
      if (req.files && req.files["mainIcon"]) {
        fs.unlink(path.join(__dirname, "..", "uploads", req.files["mainIcon"][0].filename), () => { });
      }
      return res.status(400).json({ message: "No fields to update" });
    }

    updateSql += " WHERE id = ?";
    updateParams.push(id);

    const selectSql = "SELECT main_icon_path FROM departmentinfo WHERE id = ?";
    db.query(selectSql, [id], (err, result) => {
      if (err) {
        if (req.files && req.files["mainIcon"]) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.files["mainIcon"][0].filename), () => { });
        }
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        if (req.files && req.files["mainIcon"]) {
          fs.unlink(path.join(__dirname, "..", "uploads", req.files["mainIcon"][0].filename), () => { });
        }
        return res.status(404).json({ message: "Department not found" });
      }

      const oldMainIconPath = result[0].main_icon_path;

      db.query(updateSql, updateParams, (err) => {
        if (err) {
          if (req.files && req.files["mainIcon"]) {
            fs.unlink(path.join(__dirname, "..", "uploads", req.files["mainIcon"][0].filename), () => { });
          }
          return res.status(500).json({ message: "Database error", error: err });
        }

        if (newMainIconPath && oldMainIconPath) {
          const oldPath = path.join(
            __dirname,
            "..",
            oldMainIconPath.replace(/^\//, ""));
          fs.unlink(oldPath, (fsErr) => {
            if (fsErr) {
              console.error("Error deleting old main icon:", fsErr);
            }
          });
        }

        res.status(200).json({ message: "Department updated successfully" });
      });
    });
  }
);


router.post("/delete-department-info/:id", verifyToken, async (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;

  const selectSql =
    "SELECT main_icon_path FROM departmentinfo WHERE id = ?";
  db.query(selectSql, [id], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    const { main_icon_path: mainIconPath } =
      result[0];

    const deleteSql = "DELETE FROM departmentinfo WHERE id = ?";
    db.query(deleteSql, [id], async (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      await deleteFileIfExists(path.join(__dirname, "../", mainIconPath));

      res.status(200).json({ message: "Department deleted successfully" });
    });
  });
});


module.exports = router;
