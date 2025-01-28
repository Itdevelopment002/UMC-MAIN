const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/hyperlink-policy", (req, res) => {
  const { description } = req.body;

  const sql = "INSERT INTO hyperlinkpolicy (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res
        .status(500)
        .json({ error: "Failed to add hyperlink policy" });
    }
    res.status(201).json({ id: result.insertId, description });
  });
});

router.get("/hyperlink-policy", (req, res) => {
  const sql = "SELECT * FROM hyperlinkpolicy";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch hyperlink policy" });
    }
    res.json(results);
  });
});

router.delete("/hyperlink-policy/:id", (req, res) => {
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

router.put("/hyperlink-policy/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const sql = "UPDATE hyperlinkpolicy SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res
        .status(500)
        .json({ error: "Failed to update hyperlink policy" });
    }
    res.json({ message: "Hyperlink Policy updated successfully" });
  });
});

module.exports = router;
