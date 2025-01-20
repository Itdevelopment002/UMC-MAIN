const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/terms-and-conditions", (req, res) => {
  const { heading, description } = req.body;

  const sql = "INSERT INTO conditions (heading, description) VALUES (?, ?)";
  db.query(sql, [heading, description], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res
        .status(500)
        .json({ error: "Failed to add terms and conditions" });
    }
    res.status(201).json({ id: result.insertId, heading, description });
  });
});

router.get("/terms-and-conditions", (req, res) => {
  const sql = "SELECT * FROM conditions";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch terms and conditions" });
    }
    res.json(results);
  });
});

router.delete("/terms-and-conditions/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM conditions WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete terms and conditions" });
    }
    res.json({ message: "Terms and conditions deleted successfully" });
  });
});

router.put("/terms-and-conditions/:id", (req, res) => {
  const { id } = req.params;
  const { heading, description } = req.body;
  const sql = "UPDATE conditions SET heading = ?, description = ? WHERE id = ?";
  db.query(sql, [heading, description, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res
        .status(500)
        .json({ error: "Failed to update terms and conditions" });
    }
    res.json({ message: "Terms and conditions updated successfully" });
  });
});

module.exports = router;
