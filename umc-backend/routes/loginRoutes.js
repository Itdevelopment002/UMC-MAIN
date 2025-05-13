const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
require("dotenv").config();

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

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

const generateUniqueId = (req, res, next) => {
  req.uniqueId = uuidv4();
  next();
};

router.post("/login", loginLimiter, generateUniqueId, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
      errorType: "missing_fields"
    });
  }

  try {
    const query = `
      SELECT id, username, email, password, role, permission, status
      FROM users
      WHERE username = ? OR email = ?
    `;

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
        return res.status(403).json({
          message: "Account disabled. Please contact support."
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          permission: user.permission,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
        domain: process.env.COOKIE_DOMAIN || undefined
      });

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
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
  res.status(200).json({ message: "Logout successful" });
});


// cAPTCHA CODE

const captchaStore = new Map();

router.get("/generate-captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    noise: 4,
    color: false,
    size: 6,
    ignoreChars: '0o1ilI'
  });

  const captchaId = uuidv4();
  captchaStore.set(captchaId, captcha.text.toLowerCase());

  setTimeout(() => captchaStore.delete(captchaId), 5 * 60 * 1000);

  res.json({ captchaId, svg: captcha.data });
});

router.post("/verify-captcha", (req, res) => {
  const { captchaId, userInput } = req.body;

  if (!captchaId || !userInput) {
    return res.status(400).json({ success: false, message: "Missing captchaId or user input" });
  }

  const storedCode = captchaStore.get(captchaId);

  if (!storedCode) {
    return res.status(400).json({ success: false, message: "CAPTCHA expired or invalid" });
  }

  if (storedCode !== userInput.trim().toLowerCase()) {
    return res.status(400).json({ success: false, message: "Invalid CAPTCHA" });
  }

  captchaStore.delete(captchaId);

  return res.status(200).json({ success: true, message: "CAPTCHA verified" });
});


module.exports = router;