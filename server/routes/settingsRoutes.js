const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

/**
 * GET /api/settings
 * Get site settings (public route for frontend)
 */
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings.'
        });
    }
});

/**
 * PUT /api/settings
 * Update site settings (admin only)
 */
router.put('/', adminAuth, async (req, res) => {
    try {
        const updates = req.body;
        
        let settings = await SiteSettings.findOne();
        
        if (!settings) {
            settings = await SiteSettings.create(updates);
        } else {
            // Deep merge for nested objects
            Object.keys(updates).forEach(key => {
                if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && settings[key]) {
                    settings[key] = { ...settings[key].toObject(), ...updates[key] };
                } else {
                    settings[key] = updates[key];
                }
            });
            await settings.save();
        }
        
        res.json({
            success: true,
            message: 'Settings updated successfully.',
            data: settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings.'
        });
    }
});

module.exports = router;
