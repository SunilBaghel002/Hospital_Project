const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SiteSettings = require('../models/SiteSettings');

const path = require('path');

// Load env vars from server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const updateSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find the settings document (usually there's only one)
        let settings = await SiteSettings.findOne();

        if (settings) {
            console.log('Found existing settings. Updating...');
            settings.siteName = 'Romashka Health Care';

            if (settings.navbar) {
                settings.navbar.siteName = 'Romashka Health Care';
                settings.navbar.logoInitial = 'R';
            }

            if (settings.footer) {
                settings.footer.copyright = '© 2024 Romashka Health Care. All rights reserved.';
            }

            await settings.save();
            console.log('✅ Site Settings updated to Romashka Health Care');
        } else {
            console.log('No settings found to update.');
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error updating settings:', error);
        process.exit(1);
    }
};

updateSettings();
