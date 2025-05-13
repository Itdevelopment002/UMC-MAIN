const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');


router.get("/location-info", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM location_info WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM location_info";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/location-info", verifyToken, (req, res) => {
  const { heading, description, type, language_code } = req.body;

  if (!type || !heading || !description || !language_code) {
    return res.status(400).json({ error: "Heading, description, language code and type are required." });
  }

  const sql = "INSERT INTO location_info (type, heading, description, language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [type, heading, description, language_code], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to add location info" });
    }
    res.status(201).json({ id: result.insertId, heading, description, type });
  });
});


router.post("/edit-location-info/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { heading, description, language_code } = req.body;
  const sql = "UPDATE location_info SET heading = ?, description = ?, language_code = ? WHERE id = ?";
  db.query(sql, [heading, description, language_code, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Failed to update location Data" });
    }
    res.json({ message: "Location Data updated successfully" });
  });
});


router.post("/delete-location-info/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM location_info WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ error: "Failed to delete location info" });
    }
    res.json({ message: "Location Info deleted successfully" });
  });
});


module.exports = router;
