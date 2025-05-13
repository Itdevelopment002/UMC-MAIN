const express = require("express");
const router = express.Router();
const db = require("../config/db");
require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const bcrypt = require("bcryptjs");
const rateLimit = require('express-rate-limit');
const { verifyToken } = require('../middleware/jwtMiddleware.js');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER1,
    pass: process.env.PASS,
  },
});

const otpRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: 'Too many OTP requests from this email, please try again after 30 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (!req.body.email) {
      throw new Error('Email is required for rate limiting');
    }
    return req.body.email.toLowerCase();
  },
  handler: (req, res, next, options) => {
    res.status(429).json({
      error: options.message,
      retryAfter: options.windowMs / 1000
    });
  }
});


router.post('/reset-password', otpRateLimiter, async (req, res) => {
  const { email } = req.body;
  const userQuery = "SELECT * FROM users WHERE email = ?";
  db.query(userQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Error fetching user" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email, Please write a valid email." });
    }
    const user = results[0];
    const otp = Math.floor(1000 + Math.random() * 9000);
    const insertQuery = `INSERT INTO reset_pass (email, userId, code, created_at) 
  VALUES (?, ?, ?, NOW())`;
    db.query(insertQuery, [email, user.id, otp], (err, results) => {
      if (err) {
        console.error("Error storing OTP:", err);
        return res.status(500).json({ message: "Error storing OTP" });
      }
      const mailOptions = {
        from: `no reply <${process.env.USER1}>`,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Error sending OTP" });
        }

        res.json({ message: "OTP sent successfully" });
      });
    });
  });
});

cron.schedule("*/5 * * * *", () => {
  const query = "DELETE FROM reset_pass WHERE created_at < NOW() - INTERVAL 5 MINUTE";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error deleting old OTPs:", err);
    }
  });
});


// Verify OTP

const CryptoJS = require('crypto-js');
const SECRET_KEY = process.env.ENCRYPTION_KEY || "your-secret-key-here";

router.post("/verify-otp", async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Encrypted data is required" });
    }

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { otp, email } = decryptedData;

    if (!otp || !email) {
      return res.status(400).json({ message: "OTP and email are required" });
    }

    const query = "SELECT * FROM reset_pass WHERE code = ? AND email = ?";
    db.query(query, [otp, email], (err, results) => {
      if (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json({ message: "Error verifying OTP" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      const { userId } = results[0];
      res.json({ message: "OTP verified successfully", userId });
    });
  } catch (error) {
    console.error("Decryption error:", error);
    res.status(400).json({ message: "Invalid data format" });
  }
});


router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  const userQuery = "SELECT * FROM users WHERE email = ?";
  db.query(userQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Error fetching user" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email, Please write a valid email." });
    }

    const user = results[0];

    const checkQuery = "SELECT * FROM reset_pass WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.error("Error checking existing OTP:", err);
        return res.status(500).json({ message: "Error checking existing OTP" });
      }

      if (results.length > 0) {
        const deleteQuery = "DELETE FROM reset_pass WHERE email = ?";
        db.query(deleteQuery, [email], (err, results) => {
          if (err) {
            console.error("Error deleting existing OTP:", err);
            return res.status(500).json({ message: "Error deleting existing OTP" });
          }

          generateAndStoreOTP(email, user.id, res);
        });
      } else {
        generateAndStoreOTP(email, user.id, res);
      }
    });
  });
});

const generateAndStoreOTP = (email, userId, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const insertQuery = `
    INSERT INTO reset_pass (email, userId, code, created_at) 
    VALUES (?, ?, ?, NOW())
  `;
  db.query(insertQuery, [email, userId, otp], (err, results) => {
    if (err) {
      console.error("Error storing OTP:", err);
      return res.status(500).json({ message: "Error storing OTP" });
    }
    const mailOptions = {
      from: `no reply <${process.env.USER1}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending OTP" });
      }

      res.json({ message: "OTP sent successfully" });
    });
  });
};


router.post("/change-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "User ID and password are required" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const query = "UPDATE users SET password = ? WHERE id = ?";
    db.query(query, [hashedPassword, userId], (err, results) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Error updating password" });
      }

      res.json({ message: "Password updated successfully" });
    });

  } catch (error) {
    console.error("Bcrypt hashing error:", error);
    res.status(500).json({ message: "Error hashing password" });
  }
});

router.post("/delete-otp", (req, res) => {
  const { email } = req.body; // Get email from the request body

  const deleteQuery = "DELETE FROM reset_pass WHERE email = ?";
  db.query(deleteQuery, [email], (err, results) => {
    if (err) {
      console.error("Error deleting OTP data:", err);
      return res.status(500).json({ message: "Error deleting OTP data" });
    }

    res.json({ message: "OTP data deleted successfully" });
  });
});

module.exports = router;