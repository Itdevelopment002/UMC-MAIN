const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Fetch all users
router.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Error fetching users" });
    }
    // Convert permission string to array
    const users = results.map((user) => ({
      ...user,
      permission: user.permission ? user.permission.split(",") : [],
    }));
    res.json(users);
  });
});

// Fetch a single user by ID
router.get("/users/:id", (req, res) => {
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
    // Convert permission string to array
    const user = {
      ...results[0],
      permission: results[0].permission ? results[0].permission.split(",") : [],
    };
    res.json(user);
  });
});

// Add a new user
router.post("/users", upload.single("userImage"), (req, res) => {
  const { username, fullname, role, email, password, permission } = req.body;
  const defaultImage = "uploads/image.jpg";
  const userImage = req.file ? `uploads/${req.file.filename}` : defaultImage;

  // Convert permission array to comma-separated string
  const permissionString = Array.isArray(permission) ? permission.join(",") : permission;

  const query = `
    INSERT INTO users (username, fullname, role, email, password, permission, userImage) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [username, fullname, role, email, password, permissionString, userImage],
    (err, results) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ message: "Error adding user" });
      }
      res.status(201).json({
        id: results.insertId,
        username,
        fullname,
        role,
        email,
        permission: permissionString.split(","),
        userImage,
      });
    }
  );
});

// Update a user
router.put("/users/:id", upload.single("userImage"), async (req, res) => {
  const { id } = req.params;
  const { fullname, email, role, permission, status, password } = req.body;
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  try {
    db.query("SELECT * FROM users WHERE id = ?", [id], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Error fetching user" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      let user = results[0];

      const updatedFullname = fullname || user.fullname;
      const updatedEmail = email || user.email;
      const updatedRole = role || user.role;
      const updatedPermission = permission ? (Array.isArray(permission) ? permission.join(",") : permission) : user.permission;
      const updatedStatus = status || user.status;
      const updatedPassword = password || user.password;
      const updatedImage = imagePath || user.userImage;

      const query =
        "UPDATE users SET fullname = ?, email = ?, role = ?, permission = ?, status = ?, password = ?, userImage = ? WHERE id = ?";
      const values = [
        updatedFullname,
        updatedEmail,
        updatedRole,
        updatedPermission,
        updatedStatus,
        updatedPassword,
        updatedImage,
        id,
      ];

      db.query(query, values, (err, results) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).json({ message: "Error updating user" });
        }

        if (imagePath && user.userImage) {
          fs.unlink(user.userImage, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }

        res.json({
          message: "User updated successfully",
          fullname: updatedFullname,
          email: updatedEmail,
          role: updatedRole,
          permission: updatedPermission.split(","),
          status: updatedStatus,
          userImage: updatedImage,
        });
      });
    });
  } catch (error) {
    console.error("Error in updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user
router.delete("/users/:id", (req, res) => {
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