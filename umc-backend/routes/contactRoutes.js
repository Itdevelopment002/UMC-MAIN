const express = require('express');
const router = express.Router();
const db = require('../config/db.js');

router.post('/contact-us', (req, res) => {
    const { name, mobile, subject, email, feedback } = req.body;
    if (!name || !mobile || !subject || !email || !feedback) {
        return res.status(400).json({ message: 'Contact are required' });
    }
    const sql = 'INSERT INTO contact (name, mobile, subject, email, feedback) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, mobile, subject, email, feedback], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'Contact added successfully', contactId: result.insertId });
    });
});

router.get('/contact-us', (req, res) => {
    const sql = 'SELECT * FROM contact';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json(results);
    });
});

router.get('/contact-us/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM contact WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(result[0]);
    });
});

router.delete('/contact-us/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contact WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    });
});

module.exports = router;
