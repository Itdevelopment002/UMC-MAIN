const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../config/db.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post('/gallerys', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`; 
    const photoName = req.body.photoName; 

    if (!photoName) {
        return res.status(400).json({ message: 'photo name is required' });
    }

    const sql = 'INSERT INTO gallery (photo_name, file_path) VALUES (?, ?)'; 
    db.query(sql, [photoName, filePath], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({
            message: 'Image and photo name uploaded successfully',
            imageUrl: filePath,
        });
    });
});

router.get('/gallerys', (req, res) => {
    const sql = 'SELECT * FROM gallery'; 
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        const formattedResults = results.map((row, index) => {
            const date = new Date(row.uploaded_at);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);

            const formattedId = `IN/${String(index + 1).padStart(4, '0')}/${day}-${month}-${year}`;

            return {
                id: row.id,
                photo_name: row.photo_name,  
                file_path: row.file_path, 
                uploaded_at: row.uploaded_at,
                formattedId: formattedId,
            };
        });

        res.status(200).json(formattedResults);
    });
});

router.get('/gallerys/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM gallery WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        const gallery = result[0];
        res.status(200).json({
            id: gallery.id,
            photo_name: gallery.photo_name,
            file_path: gallery.file_path,
            uploaded_at: gallery.uploaded_at
        });
    });
});

router.delete('/gallerys/:id', (req, res) => {
    const { id } = req.params;

    const selectSql = 'SELECT file_path FROM gallery WHERE id = ?';
    db.query(selectSql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        const filePath = result[0].file_path;

        const deleteSql = 'DELETE FROM gallery WHERE id = ?';
        db.query(deleteSql, [id], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }

            fs.unlink(path.join(__dirname, '..', filePath), (fsErr) => {
                if (fsErr) {
                    console.error('Error deleting file:', fsErr);
                }
            });

            res.status(200).json({ message: 'Gallery deleted successfully' });
        });
    });
});

router.put('/gallerys/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { photo_name } = req.body; 

    let updateSql = 'UPDATE gallery SET';
    const updateParams = [];

    if (photo_name) {
        updateSql += ' photo_name = ?';
        updateParams.push(photo_name);
    }

    if (req.file) {
        const newFilePath = `/uploads/${req.file.filename}`;
        updateSql += updateParams.length > 0 ? ', file_path = ?' : ' file_path = ?'; 
        updateParams.push(newFilePath);
    }

    if (updateParams.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    updateSql += ' WHERE id = ?';
    updateParams.push(id);

    const selectSql = 'SELECT file_path FROM gallery WHERE id = ?';
    db.query(selectSql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        const oldFilePath = result[0].file_path;

        db.query(updateSql, updateParams, (err, updateResult) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }

            if (req.file) {
                fs.unlink(path.join(__dirname, '..', oldFilePath), (fsErr) => {
                    if (fsErr) {
                        console.error('Error deleting old file:', fsErr);
                    }
                });
            }

            res.status(200).json({ message: 'gallery updated successfully' });
        });
    });
});


module.exports = router;
