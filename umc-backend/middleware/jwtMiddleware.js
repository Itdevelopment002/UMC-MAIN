const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require("../config/db.js");

const JWT_SECRET = process.env.JWT_SECRET;

// Utility to wrap db.query in a promise
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// === Auth Middleware ===
const verifyToken = async (req, res, next) => {
  // Clean expired tokens on every request
  await queryAsync('DELETE FROM blacklisted_tokens WHERE expires_at < NOW()');

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  // Check if token is blacklisted
  const rows = await queryAsync(
    'SELECT id FROM blacklisted_tokens WHERE token = ?',
    [token]
  );
  if (rows.length > 0) {
    return res.status(401).json({ message: 'Token is blacklisted' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


// === Logout Function ===
const logout = async (token) => {
  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000); // convert to JS Date
  await queryAsync(
    'INSERT INTO blacklisted_tokens (token, expires_at) VALUES (?, ?)',
    [token, expiresAt]
  );
};

 
module.exports = { verifyToken, logout,};
