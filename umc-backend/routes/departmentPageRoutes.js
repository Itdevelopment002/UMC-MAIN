const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
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

router.put(
  "/department-info/:id",
  upload.fields([{ name: "mainIcon" }]),
  async (req, res) => {
    const { id } = req.params;
    const { heading, link } = req.body;

    let updateSql = "UPDATE departmentinfo SET";
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
      "SELECT main_icon_path FROM departmentinfo WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        console.error("Database Selection Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Department not found" });
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

        res.status(200).json({ message: "Department updated successfully" });
      });
    });
  }
);

router.get("/department-info", (req, res) => {
  const sql = "SELECT * FROM departmentinfo";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/department-info/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM departmentinfo WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Initiatives not found" });
    }

    res.status(200).json(result[0]);
  });
});

router.post(
  "/department-info",
  upload.fields([{ name: "mainIcon" }]),
  async (req, res) => {
    const { heading, link } = req.body;
    if (!heading || !link) {
      return res
        .status(400)
        .json({ message: "Department heading and link are required" });
    }

    let mainIconPath = null;

    if (req.files["mainIcon"]) {
      mainIconPath = path.join("uploads", req.files["mainIcon"][0].filename);
    }

    const insertSql =
      "INSERT INTO departmentinfo (heading, link, main_icon_path) VALUES (?, ?, ?)";
    const insertParams = [
      heading,
      link,
      mainIconPath,
    ];

    db.query(insertSql, insertParams, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(201)
        .json({
          message: "Department added successfully",
          initiativeId: result.insertId,
        });
    });
  }
);

router.delete("/department-info/:id", async (req, res) => {
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
