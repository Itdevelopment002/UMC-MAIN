const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const db = require('../config/db.js');
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const { getMulterConfig, handleMulterError } = require('../utils/uploadValidation');

// Create upload middleware using global config
const upload = multer(getMulterConfig());

const deleteFileIfExists = async (filePath) => {
    try {
        if (filePath) {
            const fullPath = path.join(__dirname, '..', filePath);
            await fs.unlink(fullPath);
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error(`Error deleting file ${filePath}:`, err);
        }
    }
};

router.get('/home-gallerys', (req, res) => {
    const sql = 'SELECT * FROM home_gallery';
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

router.get('/home-gallerys/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM home_gallery WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Home gallery not found' });
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

router.post('/home-gallerys',
    verifyToken,
    upload.single('image'),
    handleMulterError,
    async (req, res) => {
        if (req.user?.role === "Admin") {
            return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = `/uploads/${req.file.filename}`;
        const photoName = req.body.photoName;

        if (!photoName) {
            await deleteFileIfExists(filePath);
            return res.status(400).json({ message: 'Photo name is required' });
        }

        const sql = 'INSERT INTO home_gallery (photo_name, file_path) VALUES (?, ?)';
        db.query(sql, [photoName, filePath], async (err, result) => {
            if (err) {
                await deleteFileIfExists(filePath);
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(201).json({
                message: 'Image and photo name uploaded successfully',
                imageUrl: filePath,
            });
        });
    }
);

router.post('/edit-home-gallerys/:id',
    verifyToken,
    upload.single('image'),
    handleMulterError,
    async (req, res) => {
        if (req.user?.role === "Admin") {
            return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
        }
        const { id } = req.params;
        const { photo_name } = req.body;

        if (!photo_name && !req.file) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        let updateSql = 'UPDATE home_gallery SET';
        const updateParams = [];
        const updates = [];

        if (photo_name) {
            updates.push('photo_name = ?');
            updateParams.push(photo_name);
        }

        let newFilePath;
        if (req.file) {
            newFilePath = `/uploads/${req.file.filename}`;
            updates.push('file_path = ?');
            updateParams.push(newFilePath);
        }

        updateSql += ' ' + updates.join(', ') + ' WHERE id = ?';
        updateParams.push(id);

        const selectSql = 'SELECT file_path FROM home_gallery WHERE id = ?';
        db.query(selectSql, [id], async (err, result) => {
            if (err || result.length === 0) {
                if (req.file) {
                    await deleteFileIfExists(newFilePath);
                }
                return res.status(err ? 500 : 404).json({
                    message: err ? 'Database error' : 'Gallery not found',
                    error: err
                });
            }

            const oldFilePath = result[0].file_path;

            db.query(updateSql, updateParams, async (err, updateResult) => {
                if (err) {
                    if (req.file) {
                        await deleteFileIfExists(newFilePath);
                    }
                    return res.status(500).json({ message: 'Database error', error: err });
                }

                if (req.file && oldFilePath) {
                    await deleteFileIfExists(oldFilePath);
                }

                res.status(200).json({ message: 'Home gallery updated successfully' });
            });
        });
    }
);

router.post('/delete-home-gallerys/:id',
    verifyToken,
    async (req, res) => {
        if (req.user?.role === "Admin") {
            return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
        }
        const { id } = req.params;

        const selectSql = 'SELECT file_path FROM home_gallery WHERE id = ?';
        db.query(selectSql, [id], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Gallery not found' });
            }

            const filePath = result[0].file_path;
            const deleteSql = 'DELETE FROM home_gallery WHERE id = ?';

            db.query(deleteSql, [id], async (err, deleteResult) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err });
                }

                await deleteFileIfExists(filePath);

                res.status(200).json({ message: 'Home gallery deleted successfully' });
            });
        });
    }
);

module.exports = router;