const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const adminAuth = require('../middleware/adminAuth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Check if Cloudinary is Configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

let upload;

if (isCloudinaryConfigured) {
    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'visionary-eye-care',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm'],
            transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
        }
    });

    upload = multer({ 
        storage,
        limits: { fileSize: 10 * 1024 * 1024 } 
    });
} else {
    // Fallback to Local Storage
    console.log('⚠️ Cloudinary not configured. Using local storage.');
    
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    upload = multer({ 
        storage,
        limits: { fileSize: 10 * 1024 * 1024 }
    });
}

/**
 * POST /api/upload
 * Upload a single image/video
 */
router.post('/', adminAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded.'
            });
        }

        // Determine URL based on storage method
        let fileUrl;
        if (isCloudinaryConfigured) {
            fileUrl = req.file.path; // Cloudinary returns URL in path
        } else {
            // Local storage URL construction
            const protocol = req.protocol;
            const host = req.get('host');
            fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        res.json({
            success: true,
            message: 'File uploaded successfully.',
            data: {
                url: fileUrl,
                publicId: req.file.filename,
                originalName: req.file.originalname,
                format: req.file.mimetype ? req.file.mimetype.split('/')[1] : null
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file. ' + error.message
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
