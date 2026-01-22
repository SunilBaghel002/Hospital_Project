const express = require('express');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

/**
 * POST /api/admin/login
 * Admin login with credentials from .env
 */
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required.'
            });
        }

        // Check credentials against .env
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (username !== adminUsername || password !== adminPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            });
        }

        // Generate JWT token (valid for 24 hours)
        const token = jwt.sign(
            { 
                username: adminUsername,
                isAdmin: true,
                loginTime: new Date().toISOString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                username: adminUsername,
                expiresIn: '24h'
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

/**
 * GET /api/admin/verify
 * Verify if token is still valid
 */
router.get('/verify', adminAuth, (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid.',
        data: {
            username: req.admin.username,
            loginTime: req.admin.loginTime
        }
    });
});

/**
 * POST /api/admin/logout
 * Logout (client-side token removal, just acknowledge)
 */
router.post('/logout', adminAuth, (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully.'
    });
});

module.exports = router;
