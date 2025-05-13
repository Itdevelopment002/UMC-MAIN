const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const { verifyToken } = require('../middleware/jwtMiddleware.js');

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


router.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Error fetching users" });
    }

    const users = results.map(({ password, ...user }) => ({
      ...user,
      permission: user.permission ? user.permission.split(",") : [],
    }));

    res.json(users);
  });
});


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
    const user = {
      ...results[0],
      permission: results[0].permission ? results[0].permission.split(",") : [],
    };
    delete user.password;
    res.json(user);
  });
});


router.post("/users", verifyToken, upload.single("userImage"), async (req, res) => {
  const { username, fullname, role, email, password, permission } = req.body;
  const defaultImage = "uploads/image.jpg";
  const userImage = req.file ? `uploads/${req.file.filename}` : defaultImage;

  const permissionString = Array.isArray(permission) ? permission.join(",") : permission;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = `
    INSERT INTO users (username, fullname, role, email, password, permission, userImage) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [username, fullname, role, email, hashedPassword, permissionString, userImage],
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


router.post("/edit-users/:id", verifyToken, upload.single("userImage"), async (req, res) => {
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
      const updatedImage = imagePath || user.userImage;
      const updatedPassword = password || user.password;

      const query =
        "UPDATE users SET fullname = ?, email = ?, role = ?, permission = ?, status = ?, userImage = ?, password = ? WHERE id = ?";
      const values = [
        updatedFullname,
        updatedEmail,
        updatedRole,
        updatedPermission,
        updatedStatus,
        updatedImage,
        updatedPassword,
        id,
      ];

      db.query(query, values, (err, results) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).json({ message: "Error updating user" });
        }

        res.json({
          message: "User updated successfully",
          fullname: updatedFullname,
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


router.post("/edit-users/:id/update-password", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  const query = "UPDATE users SET password = ? WHERE id = ?";
  db.query(query, [hashedPassword, id], (err, results) => {
    if (err) {
      console.error("Error updating password:", err);
      return res.status(500).json({ message: "Error updating password" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Password updated successfully" });
  });
});


router.post("/users/:id/verify-password", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const query = "SELECT password FROM users WHERE id = ?";
  db.query(query, [id], async (err, results) => {
    if (err) {
      console.error("Error fetching user password:", err);
      return res.status(500).json({ message: "Error verifying password" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedHashedPassword = results[0].password;

    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (isMatch) {
      res.json({ valid: true, message: "Password is correct" });
    } else {
      res.status(401).json({ valid: false, message: "Invalid password" });
    }
  });
});


router.post("/delete-users/:id", verifyToken, (req, res) => {
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