const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const {verifyToken} = require('../middleware/jwtMiddleware.js');

router.get("/hyperlink-policy", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM hyperlinkpolicy WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM hyperlinkpolicy";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/hyperlink-policy", verifyToken, (req, res) => {
  const { description, language_code } = req.body;

  const sql = "INSERT INTO hyperlinkpolicy (description, language_code) VALUES (?, ?)";
  db.query(sql, [description, language_code], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res
        .status(500)
        .json({ error: "Failed to add hyperlink policy" });
    }
    res.status(201).json({ id: result.insertId, description, language_code });
  });
});


router.put("/hyperlink-policy/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { description, language_code } = req.body;
  const sql = "UPDATE hyperlinkpolicy SET description = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, language_code, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res
        .status(500)
        .json({ error: "Failed to update hyperlink policy" });
    }
    res.json({ message: "Hyperlink Policy updated successfully" });
  });
});


router.delete("/hyperlink-policy/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM hyperlinkpolicy WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete hyperlink policy" });
    }
    res.json({ message: "Hyperlink Policy deleted successfully" });
  });
});


module.exports = router;
