const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const ASSETS_DIR = path.join(__dirname, '../../frontend/src/assets');
const FOLDER_NAME = 'visionary-eye-care';

// List of specific files to upload
const RELEVANT_FILES = [
    'Offer-1.jpeg',
    'Offer-2.jpeg',
    'Offer-3.jpeg'
];

async function seedMedia() {
    console.log('🚀 Starting Media Library seed...');
    console.log(`📂 Source: ${ASSETS_DIR}`);

    if (!fs.existsSync(ASSETS_DIR)) {
        console.error('❌ Assets directory not found!');
        return;
    }

    let uploadedCount = 0;

    for (const filename of RELEVANT_FILES) {
        const filePath = path.join(ASSETS_DIR, filename);

        if (fs.existsSync(filePath)) {
            try {
                console.log(`📤 Uploading ${filename}...`);
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: FOLDER_NAME,
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true
                });
                console.log(`✅ Uploaded: ${result.secure_url}`);
                uploadedCount++;
            } catch (error) {
                console.error(`❌ Failed to upload ${filename}:`, error);
            }
        } else {
            console.warn(`⚠️ File not found: ${filename}`);
        }
    }

    console.log(`\n✨ Seed completed! Uploaded ${uploadedCount} files.`);
}

seedMedia();
