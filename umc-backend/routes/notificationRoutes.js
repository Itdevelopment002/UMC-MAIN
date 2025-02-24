const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/notification", (req, res) => {
  const sql = "SELECT * FROM notification";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


router.get("/notification/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM notification WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
});


router.post("/notification", (req, res) => {
  const { heading, description, role, readed } = req.body;

  if (!heading || !description || !role) {
    return res
      .status(400)
      .json({ error: "Heading and description are required." });
  }

  const sql =
    "INSERT INTO notification (heading, description, role, readed) VALUES (?, ?, ?, ?)";

  db.query(sql, [heading, description, role, readed || 0], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log the error
      return res.status(500).json({ error: err.message });
    }

    res.json({ id: result.insertId, heading, description, role, readed });
  });
});


router.put("/update/:id", (req, res) => {
  const notificationId = req.params.id;
  const { readed } = req.body;

  const query = `UPDATE notification SET readed = ? WHERE id = ?`;

  db.query(query, [readed, notificationId], (err, result) => {
    if (err) {
      console.error("Error updating notification status:", err);
      return res
        .status(500)
        .json({ message: "Failed to update notification status" });
    }
    res
      .status(200)
      .json({ message: "Notification status updated successfully" });
  });
});


router.delete("/notification/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM notification WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Notification deleted successfully", id });
  });
});


module.exports = router;
