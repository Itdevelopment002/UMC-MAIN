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

router.get("/portal-services", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM portalservices WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM portalservices";
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/portal-services/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM portalservices WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Portal Service not found" });
    }

    res.status(200).json(result[0]);
  });
});

router.put(
  "/portal-services/:id",
  upload.fields([{ name: "portalImage" }]),
  async (req, res) => {
    const { id } = req.params;
    const { heading, description, link } = req.body;

    let updateSql = "UPDATE portalservices SET";
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

    if (req.files["portalImage"]) {
      const newMainIconPath = path.join(
        "uploads",
        req.files["portalImage"][0].filename
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
      "SELECT main_icon_path FROM portalservices WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        console.error("Database Selection Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Portal Service not found" });
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

        res.status(200).json({ message: "Portal Service updated successfully" });
      });
    });
  }
);

router.post(
  "/portal-services",
  upload.fields([{ name: "portalImage" }]),
  async (req, res) => {
    const { heading, description, link } = req.body;
    if (!heading || !description || !link) {
      return res
        .status(400)
        .json({ message: "Portal Service heading, description and link are required" });
    }

    let mainIconPath = null;

    if (req.files["portalImage"]) {
      mainIconPath = path.join("uploads", req.files["portalImage"][0].filename);
    }

    const insertSql =
      "INSERT INTO portalservices (heading, description, link, main_icon_path) VALUES (?, ?, ?, ?)";
    const insertParams = [
      heading,
      description,
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
          message: "Portal Service added successfully",
          portalId: result.insertId,
        });
    });
  }
);

router.delete("/portal-services/:id", async (req, res) => {
  const { id } = req.params;

  const selectSql =
    "SELECT main_icon_path FROM portalservices WHERE id = ?";
  db.query(selectSql, [id], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Portal Service not found" });
    }

    const { main_icon_path: mainIconPath } =
      result[0];

    const deleteSql = "DELETE FROM portalservices WHERE id = ?";
    db.query(deleteSql, [id], async (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      await deleteFileIfExists(path.join(__dirname, "../", mainIconPath));

      res.status(200).json({ message: "Portal Service deleted successfully" });
    });
  });
});

module.exports = router;
