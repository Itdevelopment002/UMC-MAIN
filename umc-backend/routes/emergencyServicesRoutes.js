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

router.get("/emergency-services", (req, res) => {
  const sql = "SELECT * FROM emergencyservices";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/emergency-services/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM emergencyservices WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Emergency Service not found" });
    }

    res.status(200).json(result[0]);
  });
});

router.put(
  "/emergency-services/:id",
  upload.fields([{ name: "emergencyImage" }]),
  async (req, res) => {
    const { id } = req.params;
    const { heading, number } = req.body;

    let updateSql = "UPDATE emergencyservices SET";
    const updateParams = [];

    if (heading) {
      updateSql += " heading = ?";
      updateParams.push(heading);
    }

    if (number) {
      updateSql +=
        updateParams.length > 0 ? ", number = ?" : " number = ?";
      updateParams.push(number);
    }

    if (req.files["emergencyImage"]) {
      const newMainIconPath = path.join(
        "uploads",
        req.files["emergencyImage"][0].filename
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
      "SELECT main_icon_path FROM emergencyservices WHERE id = ?";
    db.query(selectSql, [id], async (err, result) => {
      if (err) {
        console.error("Database Selection Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Emergency Service not found" });
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

        if (req.files["emergencyImage"]) {
          await deleteFileIfExists(
            path.join(__dirname, "../", oldMainIconPath)
          );
        }

        res.status(200).json({ message: "Emergency Service updated successfully" });
      });
    });
  }
);

router.post(
  "/emergency-services",
  upload.fields([{ name: "emergencyImage" }]),
  async (req, res) => {
    const { heading, number } = req.body;
    if (!heading || !number) {
      return res
        .status(400)
        .json({ message: "Emergency Service heading and number are required" });
    }

    let mainIconPath = null;

    if (req.files["emergencyImage"]) {
      mainIconPath = path.join("uploads", req.files["emergencyImage"][0].filename);
    }

    const insertSql =
      "INSERT INTO emergencyservices (heading, number, main_icon_path) VALUES (?, ?, ?)";
    const insertParams = [
      heading,
      number,
      mainIconPath,
    ];

    db.query(insertSql, insertParams, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(201)
        .json({
          message: "Emergency Service added successfully",
          emergencyId: result.insertId,
        });
    });
  }
);

router.delete("/emergency-services/:id", async (req, res) => {
  const { id } = req.params;

  const selectSql =
    "SELECT main_icon_path FROM emergencyservices WHERE id = ?";
  db.query(selectSql, [id], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Emergency Service not found" });
    }

    const { main_icon_path: mainIconPath } =
      result[0];

    const deleteSql = "DELETE FROM emergencyservices WHERE id = ?";
    db.query(deleteSql, [id], async (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      await deleteFileIfExists(path.join(__dirname, "../", mainIconPath));

      res.status(200).json({ message: "Emergency Service deleted successfully" });
    });
  });
});

module.exports = router;