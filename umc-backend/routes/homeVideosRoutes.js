const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateHomeVideo, validateUpdateHomeVideo } = require("../middleware/validationinputfield.js");

router.get("/home-video", (req, res) => {
  const sql = "SELECT * FROM home_video";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});


router.get("/home-video/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM home_video WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(result[0]);
  });
});


router.post("/home-video", verifyToken, sanitizeInput, validateHomeVideo, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({
      message: "Permission denied: Admins are not allowed to perform this action.",
    });
  }

  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ message: "Video url is required." });
  }

  const countSql = "SELECT COUNT(*) AS count FROM home_video";

  db.query(countSql, (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({ message: "Database error while checking total videos count", error: countErr });
    }

    const totalVideos = countResult[0].count;
    if (totalVideos >= 2) {
      return res.status(400).json({
        errors: [{ message: "You can add only 2 videos in total" }],
      });
    }

    const updateSql = "INSERT INTO home_video (video_url) VALUES (?)";
    const updateParams = [videoUrl];

    db.query(updateSql, updateParams, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json({ message: "Video added successfully" });
    });
  });
});


router.post("/edit-home-video/:id", verifyToken, sanitizeInput, validateUpdateHomeVideo, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;
  const { video_url } = req.body;

  let updateSql = "UPDATE home_video SET";
  const updateParams = [];

  if (video_url) {
    updateSql += " video_url = ?";
    updateParams.push(video_url);
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  db.query(updateSql, updateParams, (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Video updated successfully" });
  });
});


router.post("/delete-home-video/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { id } = req.params;

  const deleteSql = "DELETE FROM home_video WHERE id = ?";
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  });
});


module.exports = router;
