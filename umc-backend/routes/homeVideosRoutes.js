const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require('../middleware/jwtMiddleware.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


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


router.post("/edit-home-video/:id", verifyToken, (req, res) => {
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
