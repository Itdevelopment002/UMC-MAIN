const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/commissioner-desc", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM commissioner_desc WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM commissioner_desc";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get("/commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM commissioner_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Commissioner Description not found" });
    }
    res.status(200).json(result[0]);
  });
});


router.post("/commissioner-desc", (req, res) => {
  const { description, language_code } = req.body;
  if (!description || !language_code) {
    return res.status(400).json({ message: "Description is required" });
  }
  const sql = "INSERT INTO commissioner_desc (description, language_code) VALUES (?, ?)";
  db.query(sql, [description, language_code], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(201)
      .json({
        message: "Commissioner Description added successfully",
        historyId: result.insertId,
      });
  });
});


router.put("/commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const { description, language_code } = req.body;
  const sql = "UPDATE commissioner_desc SET description = ?, language_code = ? WHERE id = ?";
  db.query(sql, [description, language_code, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commissioner Description not found" });
    }
    res.status(200).json({ message: "Commissioner Description updated successfully" });
  });
});


router.delete("/commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM commissioner_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commissioner Description not found" });
    }
    res.status(200).json({ message: "Commissioner Description deleted successfully" });
  });
});


module.exports = router;
