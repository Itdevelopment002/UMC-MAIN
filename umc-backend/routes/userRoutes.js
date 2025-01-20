const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/users", (req, res) => {
  const { username, password, department } = req.body;

  const query =
    "INSERT INTO users (username, password, department) VALUES (?, ?, ?)";
  db.query(query, [username, password, department], (err, results) => {
    if (err) {
      console.error("Error adding user:", err);
      return res.status(500).json({ message: "Error adding user" });
    }
    res.status(201).json({ id: results.insertId, username, department });
  });
});

router.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Error fetching users" });
    }
    res.json(results);
  });
});

router.get("/users:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Error fetching user" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(results[0]);
  });
});

router.put("/users:id", (req, res) => {
  const { id } = req.params;
  const { username, password, department } = req.body;

  const query =
    "UPDATE users SET username = ?, password = ?, department = ? WHERE id = ?";
  db.query(query, [username, password, department, id], (err, results) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Error updating user" });
    }
    res.json({ message: "User updated successfully", username, department });
  });
});

router.delete("/users:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Error deleting user" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;
