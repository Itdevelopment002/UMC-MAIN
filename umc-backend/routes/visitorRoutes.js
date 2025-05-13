const express = require('express');
const router = express.Router();
const db = require('../config/db.js');
const { verifyToken } = require('../middleware/jwtMiddleware.js');


router.get('/visitor-count', (req, res) => {
    db.query('SELECT count FROM visitor_count', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching visitor count' });
        } else {
            res.json({ count: results[0].count });
        }
    });
});


router.post('/increment-visitor-count', verifyToken, (req, res) => {
    db.query('UPDATE visitor_count SET count = count + 1', (err) => {
        if (err) {
            res.status(500).json({ error: 'Error incrementing visitor count' });
        } else {
            res.sendStatus(200);
        }
    });
});


module.exports = router;
