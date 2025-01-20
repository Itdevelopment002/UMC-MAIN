const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); 

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const upload = multer({ storage });

router.get('/citizen-charter', (req, res) => {
    db.query('SELECT * FROM `citizen-charter`', (err, results) => {
        if (err) {
            console.error('Error fetching citizen charters:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

router.post('/citizen-charter', upload.single('pdf'), (req, res) => {
    const { name } = req.body;
    const pdfPath = req.file ? req.file.path : null; 

    if (!name || !pdfPath) {
        return res.status(400).json({ message: 'Name and PDF file are required.' });
    }

    const newCharter = { name, pdf: pdfPath };

    db.query('INSERT INTO `citizen-charter` (name, pdf) VALUES (?, ?)', [name, pdfPath], (err, result) => {
        if (err) {
            console.error('Error adding citizen charter:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ id: result.insertId, ...newCharter });
    });
});

router.put('/citizen-charter/:id', upload.single('pdf'), (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const pdfPath = req.file ? req.file.path : null;

    let query = 'UPDATE `citizen-charter` SET name = ?';
    const params = [name];

    if (pdfPath) {
        query += ', pdf = ?';
        params.push(pdfPath);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.query(query, params, (err) => {
        if (err) {
            console.error('Error updating citizen charter:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const response = { id, name, ...(pdfPath ? { pdf: pdfPath } : {}) };
        res.json(response);
    });
});

router.delete('/citizen-charter/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM `citizen-charter` WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting citizen charter:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Citizen charter deleted' });
    });
});

router.use('/uploads', express.static('uploads'));

module.exports = router;
