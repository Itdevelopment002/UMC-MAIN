const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const crypto = require('crypto');

router.get('/nonce/:username', (req, res) => {
  try {
    const { username } = req.params;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const nonce = crypto.randomBytes(16).toString('hex');
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

      db.query(
        'INSERT INTO nonces (username, nonce, expires_at) VALUES (?, ?, ?)',
        [username, nonce, expiresAt],
        (insertErr) => {
          if (insertErr) {
            console.error('Error inserting nonce:', insertErr);
            return res.status(500).json({ message: 'Database error while inserting nonce' });
          }

          res.status(200).json({ nonce });
        }
      );
    });
  } catch(error) {
    console.error("Nonce process error:",error);
    res.status(500).json({ message: "Server error during nonce fetch" });
  }
});

module.exports = router;