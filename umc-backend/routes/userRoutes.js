const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const {CustomDecryption} = require("../utils/CustomDecryption.js");
const { validateUserDetails, validateUpdateUserDetails } = require("../middleware/validationinputfield.js");

const commonPasswords = [
  'password', '123456', '12345678', '1234', 'qwerty', '12345',
  'dragon', 'baseball', 'football', 'letmein', 'monkey'
];

const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const nonceDecodedPassword = async (password, userId) => {
  try {
    const nonces = await queryAsync(
      'SELECT * FROM nonces WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    const nonceRow = nonces[0];
    if (!nonceRow) {
      throw new Error('Nonce missing');
    }

    if (new Date(nonceRow.expires_at) < new Date()) {
      throw new Error('Nonce expired');
    }

    return CustomDecryption(password, nonceRow.nonce);
  } catch (error) {
    console.error('Nonce decoding error:', error);
    throw error;
  }
};

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


router.post("/users", verifyToken, sanitizeInput, validateUserDetails, async (req, res) => {
  // Only allow if user is Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { username, fullname, role, email, permission } = req.body;
  // decode password
  const id = req.user.userId;
  password = await nonceDecodedPassword(req.body.password, id);

  if (!username || !fullname || !role || !email || !password || !permission) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (/\s/.test(username)) {
    return res.status(400).json({
      message: "Username cannot contain spaces",
      field: "username"
    });
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


router.post("/edit-users/:id", verifyToken, sanitizeInput, validateUpdateUserDetails, async (req, res) => {
  const { id } = req.params;

  const { fullname, email, role, permission, status } = req.body;
  // Only allow if user is Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

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

      const query =
        "UPDATE users SET fullname = ?, email = ?, role = ?, permission = ?, status = ? WHERE id = ?";
      const values = [
        updatedFullname,
        updatedEmail,
        updatedRole,
        updatedPermission,
        updatedStatus,
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
  const { finalNewPassword } = req.body;
  // Only allow if user is Superadmin
  if (req.user.role !== 'Superadmin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const newPassword = await nonceDecodedPassword(finalNewPassword, id);
 
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

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
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


router.post('/users/:id/verify-update-password', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { finalOldPassword, finalNewPassword } = req.body;
  // Only allow if user is self
  if (parseInt(id) !== req.user.userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  //password decode
  const oldPassword = await nonceDecodedPassword(finalOldPassword, id);
  const newPassword = await nonceDecodedPassword(finalNewPassword, id);

    const selectQuery = "SELECT password FROM users WHERE id = ?";
    db.query(selectQuery, [id], async (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching user data" });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      const storedHashedPassword = results[0].password;

      const isOldPasswordCorrect = await bcrypt.compare(oldPassword, storedHashedPassword);
      if (!isOldPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect old password" });
      }

      const isSameAsOld = await bcrypt.compare(newPassword, storedHashedPassword);
      if (isSameAsOld) {
        return res.status(400).json({ message: "New password must be different from the old password" });
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


      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
      db.query(updateQuery, [hashedPassword, id], (err, results) => {
        if (err) return res.status(500).json({ message: "Error updating password" });

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User not found during update" });
        }

        res.json({ message: "Password updated successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
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