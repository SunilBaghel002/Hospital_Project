const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg).'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * POST /api/upload
 * Upload a single image
 */
router.post('/', adminAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded.'
            });
        }
        
        // Construct the URL for the uploaded file
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            message: 'File uploaded successfully.',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: fileUrl
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file.'
        });
    }
});

/**
 * POST /api/upload/multiple
 * Upload multiple images
 */
router.post('/multiple', adminAuth, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded.'
            });
        }
        
        const files = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            url: `/uploads/${file.filename}`
        }));
        
        res.json({
            success: true,
            message: `${files.length} file(s) uploaded successfully.`,
            data: files
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload files.'
        });
    }
});

/**
 * GET /api/upload/list
 * List all uploaded files
 */
router.get('/list', adminAuth, (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir);
        
        const fileList = files.map(filename => {
            const filepath = path.join(uploadsDir, filename);
            const stats = fs.statSync(filepath);
            
            return {
                filename,
                url: `/uploads/${filename}`,
                size: stats.size,
                uploadedAt: stats.mtime
            };
        });
        
        // Sort by upload date (newest first)
        fileList.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        res.json({
            success: true,
            data: fileList
        });
    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list files.'
        });
    }
});

/**
 * DELETE /api/upload/:filename
 * Delete an uploaded file
 */
router.delete('/:filename', adminAuth, (req, res) => {
    try {
        const filepath = path.join(uploadsDir, req.params.filename);
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found.'
            });
        }
        
        fs.unlinkSync(filepath);
        
        res.json({
            success: true,
            message: 'File deleted successfully.'
        });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file.'
        });
    }
});

// Error handler for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next();
});

module.exports = router;
