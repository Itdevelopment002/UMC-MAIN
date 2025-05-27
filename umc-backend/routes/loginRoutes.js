const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
require("dotenv").config();
const { verifyToken, logout } = require('../middleware/jwtMiddleware.js');
const { CustomDecryption } = require("../utils/CustomDecryption.js");

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

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

const generateUniqueId = (req, res, next) => {
  req.uniqueId = uuidv4();
  next();
};

router.post('/login', loginLimiter, generateUniqueId, (req, res) => {
  try {
    const { username, password, captchaId, userInput } = req.body;

    if (!username || !password || !captchaId || !userInput) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const storedCode = captchaStore.get(captchaId);
    if (!storedCode) {
      return res.status(400).json({ message: "CAPTCHA expired or invalid" });
    }
    if (storedCode !== userInput.trim()) {
      return res.status(400).json({ message: "Invalid CAPTCHA" });
    }

    captchaStore.delete(captchaId);

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users[0];

      db.query(
        'SELECT * FROM nonces WHERE username = ? ORDER BY created_at DESC LIMIT 1',
        [username],
        async (nonceErr, nonces) => {
          if (nonceErr) {
            console.error('Nonce query error:', nonceErr);
            return res.status(500).json({ message: 'Database error' });
          }

          if (nonces.length === 0 || new Date(nonces[0].expires_at) < new Date()) {
            return res.status(400).json({ error: 'Nonce expired or missing' });
          }
          /* password decoded here */
          const nonceRow = nonces[0];
          const decodedPassword = CustomDecryption(password, nonceRow.nonce);

          const passwordMatch = await bcrypt.compare(decodedPassword, user.password);

          if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
          if (passwordMatch) {
            db.query('DELETE FROM nonces WHERE id = ?', [nonceRow.id], (deleteErr) => {
              if (deleteErr) {
                console.error('Failed to delete nonce:', deleteErr);
              }
            });

            delete user.password;

            const token = jwt.sign(
              {
                userId: user.id,
                username: user.username,
                role: user.role,
                permission: user.permission,
              },
              JWT_SECRET,
              { expiresIn: JWT_EXPIRATION }
            );

            return res.status(200).json({ message: "Login successful", token });
          }

          return res.status(400).json({ error: 'Invalid login attempt' });
        }
      );
    });
  } catch (error) {
    console.error("Login process error:");
    res.status(500).json({ message: "Server error during authentication" });
  }
});

router.post("/logout", verifyToken, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });

  await logout(token);
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logged out successfully" });
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
  captchaStore.set(captchaId, captcha.text);
  setTimeout(() => captchaStore.delete(captchaId), 5 * 60 * 1000);
  res.json({ captchaId, svg: captcha.data });
});


module.exports = router;
