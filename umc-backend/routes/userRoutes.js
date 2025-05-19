const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');

const commonPasswords = [
  'password', '123456', '12345678', '1234', 'qwerty', '12345',
  'dragon', 'baseball', 'football', 'letmein', 'monkey'
];

router.get("/users", verifyToken, (req, res) => {
  // Only allow if user is Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
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


router.get("/users/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  // Only allow if user is self or Superadmin
  if (parseInt(id) !== req.user.userId && req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
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


router.post("/users", verifyToken, sanitizeInput, async (req, res) => {
  // Only allow if user is Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { username, fullname, role, email, password, permission } = req.body;

  if (!username || !fullname || !role || !email || !password || !permission) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const usernameCheck = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.length > 0);
        }
      );
    });

    if (usernameCheck) {
      return res.status(400).json({
        message: "Username already exists. Please choose a different one.",
        field: "username"
      });
    }

    const emailCheck = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.length > 0);
        }
      );
    });

    if (emailCheck) {
      return res.status(400).json({
        message: "Email address already exists. Please use a different email.",
        field: "email"
      });
    }
  } catch (err) {
    console.error("Error checking user existence:", err);
    return res.status(500).json({ message: "Error checking user data" });
  }

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  const isNotCommon = !commonPasswords.includes(password.toLowerCase());
  const emailPrefix = email ? email.split('@')[0].toLowerCase() : '';
  const isNotContextual = fullname && email
    ? !password.toLowerCase().includes(fullname.toLowerCase()) &&
    !password.toLowerCase().includes(emailPrefix)
    : true;

  if (!hasMinLength || !hasUpper || !hasLower || !hasNumber ||
    !hasSpecial || !isNotCommon || !isNotContextual) {
    return res.status(400).json({
      message: "Weak password - doesn't meet all requirements",
      requirements: {
        minLength: hasMinLength,
        hasUpper: hasUpper,
        hasLower: hasLower,
        hasNumber: hasNumber,
        hasSpecial: hasSpecial,
        notCommon: isNotCommon,
        notContextual: isNotContextual
      }
    });
  }

  const permissionString = Array.isArray(permission) ? permission.join(",") : permission;
  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = `
    INSERT INTO users (username, fullname, role, email, password, permission) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [username, fullname, role, email, hashedPassword, permissionString],
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
      });
    }
  );
});


router.post("/edit-users/:id", verifyToken, sanitizeInput, async (req, res) => {
  const { id } = req.params;
  // Only allow if user is Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { fullname, email, role, permission, status, password } = req.body;

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

      const query =
        "UPDATE users SET fullname = ?, email = ?, role = ?, permission = ?, status = ?, password = ? WHERE id = ?";
      const values = [
        updatedFullname,
        updatedEmail,
        updatedRole,
        updatedPermission,
        updatedStatus,
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
        });
      });
    });
  } catch (error) {
    console.error("Error in updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/edit-users/:id/update-password", verifyToken, sanitizeInput, async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  // Only allow if user is Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  const isNotCommon = !commonPasswords.includes(newPassword.toLowerCase());

  if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial || !isNotCommon) {
    return res.status(400).json({
      message: "Weak password - doesn't meet all requirements",
      requirements: {
        minLength: hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        notCommon: isNotCommon,
      },
    });
  }

  const selectQuery = "SELECT password FROM users WHERE id = ?";
  db.query(selectQuery, [id], async (err, results) => {
    if (err) return res.status(500).json({ message: "Error verifying password" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const storedHashedPassword = results[0].password;
    const isSameAsOld = await bcrypt.compare(newPassword, storedHashedPassword);

    if (isSameAsOld) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
    db.query(updateQuery, [hashedPassword, id], (err, results) => {
      if (err) return res.status(500).json({ message: "Error updating password" });

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Password updated successfully" });
    });
  });
});


router.post("/users/:id/verify-password", verifyToken, sanitizeInput, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  // Only allow if user is self
  if (parseInt(id) !== req.user.userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

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
      res.status(400).json({ valid: false, message: "Invalid password" });
    }
  });
});


router.post("/delete-users/:id", verifyToken, (req, res) => {
  // Only allow if user is self or Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
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