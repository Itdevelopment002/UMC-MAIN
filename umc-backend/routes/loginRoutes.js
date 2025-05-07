// const express = require("express");
// const router = express.Router();
// const db = require("../config/db.js");
// const { v4: uuidv4 } = require("uuid");
// const bcrypt = require("bcryptjs");
// const CryptoJS = require("crypto-js");
// const rateLimit = require("express-rate-limit");

// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "secure-umc-key-123";

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: "Too many login attempts, please try again later",
//   skipSuccessfulRequests: true,
//   handler: (req, res) => {
//     res.status(429).json({
//       message: "Too many login attempts. Please wait 15 minutes before trying again."
//     });
//   }
// });

// const generateUniqueId = (req, res, next) => {
//   req.uniqueId = uuidv4();
//   next();
// };

// const decryptData = (req, res, next) => {
//   try {
//     if (!req.body.data) {
//       return res.status(400).json({ message: "Encrypted data required" });
//     }

//     const bytes = CryptoJS.AES.decrypt(req.body.data, ENCRYPTION_KEY);
//     const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
//     if (!decryptedData.username || !decryptedData.password) {
//       return res.status(400).json({ message: "Invalid request format" });
//     }
    
//     req.decryptedBody = {
//       username: decryptedData.username.trim(),
//       password: decryptedData.password
//     };
    
//     next();
//   } catch (error) {
//     console.error("Decryption error:", error);
//     return res.status(400).json({ message: "Invalid encrypted data" });
//   }
// };

// router.post("/login", loginLimiter, generateUniqueId, decryptData, async (req, res) => {
//   const { username, password } = req.decryptedBody;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Username and password are required" });
//   }

//   try {
//     const query = "SELECT id, username, email, password, role, permission, status FROM users WHERE username = ? OR email = ?";
    
//     db.query(query, [username, username], async (err, result) => {
//       if (err) {
//         console.error("Database query error:", err);
//         return res.status(500).json({ message: "Server error" });
//       }

//       if (result.length === 0) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       const user = result[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);
      
//       if (!passwordMatch) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       if (user.status !== "Active") {
//         return res.status(403).json({ 
//           message: "Account disabled. Please contact support." 
//         });
//       }

//       // Set secure HTTP-only cookie with the uniqueId
//       res.cookie("authToken", req.uniqueId, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 24 * 60 * 60 * 1000, // 1 day
//         path: "/",
//         domain: process.env.COOKIE_DOMAIN || undefined
//       });

//       // Return response without the uniqueId
//       res.json({
//         message: "Login successful",
//         user: {
//           id: user.id,
//           role: user.role,
//           permission: user.permission,
//         }
//         // uniqueId is now only in cookies, not in response body
//       });
//     });
//   } catch (error) {
//     console.error("Login process error:", error);
//     res.status(500).json({ message: "Server error during authentication" });
//   }
// });

// router.post("/logout", (req, res) => {
//   res.clearCookie("authToken");
//   res.json({ message: "Logout successful" });
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const db = require("../config/db.js");
// const { v4: uuidv4 } = require("uuid");
// const bcrypt = require("bcryptjs");
// const rateLimit = require("express-rate-limit");

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: "Too many login attempts, please try again later",
//   skipSuccessfulRequests: true,
//   handler: (req, res) => {
//     res.status(429).json({
//       message: "Too many login attempts. Please wait 15 minutes before trying again."
//     });
//   }
// });

// const generateUniqueId = (req, res, next) => {
//   req.uniqueId = uuidv4();
//   next();
// };

// router.post("/login", loginLimiter, generateUniqueId, async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Username and password are required" });
//   }

//   try {
//     const query = "SELECT id, username, email, password, role, permission, status FROM users WHERE username = ? OR email = ?";
//     db.query(query, [username, username], async (err, result) => {
//       if (err) {
//         console.error("Database query error:", err);
//         return res.status(500).json({ message: "Server error" });
//       }

//       if (result.length === 0) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       const user = result[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (!passwordMatch) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       if (user.status !== "Active") {
//         return res.status(403).json({ message: "Account disabled. Please contact support." });
//       }

//       res.cookie("authToken", req.uniqueId, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 24 * 60 * 60 * 1000, // 1 day
//         path: "/",
//         domain: process.env.COOKIE_DOMAIN || undefined
//       });

//       res.json({
//         message: "Login successful",
//         user: {
//           id: user.id,
//           role: user.role,
//           permission: user.permission,
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Login process error:", error);
//     res.status(500).json({ message: "Server error during authentication" });
//   }
// });

// router.post("/logout", (req, res) => {
//   res.clearCookie("authToken");
//   res.json({ message: "Logout successful" });
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const CryptoJS = require("crypto-js");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later",
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many login attempts. Please wait 15 minutes before trying again."
    });
  }
});

const generateUniqueId = (req, res, next) => {
  req.uniqueId = uuidv4();
  next();
};

const decryptData = (encryptedData) => {
  try {
    const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key';
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

router.post("/login", loginLimiter, generateUniqueId, async (req, res) => {
  const { encryptedData } = req.body;

  if (!encryptedData) {
    return res.status(400).json({ message: "Encrypted data is required" });
  }

  const decryptedData = decryptData(encryptedData);
  if (!decryptedData) {
    return res.status(400).json({ message: "Invalid encrypted data" });
  }

  const { username, password } = decryptedData;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const query = "SELECT id, username, email, password, role, permission, status FROM users WHERE username = ? OR email = ?";
    db.query(query, [username, username], async (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.status !== "Active") {
        return res.status(403).json({ message: "Account disabled. Please contact support." });
      }

      res.cookie("authToken", req.uniqueId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: "/",
        domain: process.env.COOKIE_DOMAIN || undefined
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          role: user.role,
          permission: user.permission,
        }
      });
    });
  } catch (error) {
    console.error("Login process error:", error);
    res.status(500).json({ message: "Server error during authentication" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout successful" });
});

module.exports = router;