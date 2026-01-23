const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'visionary-eye-care',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * POST /api/upload
 * Upload a single image/video to Cloudinary
 */
router.post('/', adminAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded.'
            });
        }

        res.json({
            success: true,
            message: 'File uploaded successfully.',
            data: {
                url: req.file.path,
                publicId: req.file.filename,
                originalName: req.file.originalname,
                format: req.file.format || req.file.path.split('.').pop()
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
 * Upload multiple files to Cloudinary
 */
router.post('/multiple', adminAuth, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded.'
            });
        }

        const files = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            originalName: file.originalname
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
 * List recent uploads from Cloudinary
 */
router.get('/list', adminAuth, async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'visionary-eye-care',
            max_results: 50
        });

        const files = result.resources.map(resource => ({
            url: resource.secure_url,
            publicId: resource.public_id,
            format: resource.format,
            size: resource.bytes,
            createdAt: resource.created_at,
            width: resource.width,
            height: resource.height
        }));

        res.json({
            success: true,
            data: files
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
 * DELETE /api/upload/:publicId
 * Delete a file from Cloudinary
 */
router.delete('/:publicId', adminAuth, async (req, res) => {
    try {
        const publicId = decodeURIComponent(req.params.publicId);
        
        await cloudinary.uploader.destroy(publicId);

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

module.exports = router;
