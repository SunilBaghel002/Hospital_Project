const express = require('express');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

/**
 * POST /api/admin/login
 * Admin login with credentials from .env
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required.'
            });
        }

        let userRole = 'admin';
        let doctorData = null;

        // 1. Check Admin Credentials (from .env)
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (username === adminUsername && password === adminPassword) {
            // Admin Login Success
            userRole = 'admin';
        } else {
            // 2. Check Doctor Credentials (from DB)
            const Doctor = require('../models/Doctor');
            // We need to verify password using our utils
            const { verifyPassword } = require('../utils/auth');

            // Find doctor with password selected
            const doctor = await Doctor.findOne({ email: username.toLowerCase() }).select('+password +salt');

            if (doctor && doctor.password && doctor.salt) {
                const isValid = verifyPassword(password, doctor.password, doctor.salt);
                if (isValid) {
                    if (!doctor.isActive) {
                        return res.status(401).json({
                            success: false,
                            message: 'Your account is disabled. Contact admin.'
                        });
                    }
                    userRole = 'doctor';
                    doctorData = doctor;
                } else {
                    // Invalid password for existing doctor email
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials.'
                    });
                }
            } else {
                // Not found as admin or doctor
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials.'
                });
            }
        }

        // Generate JWT token
        const payload = {
            username: userRole === 'admin' ? adminUsername : doctorData.name,
            isAdmin: userRole === 'admin',
            role: userRole,
            id: userRole === 'doctor' ? doctorData._id : null,
            loginTime: new Date().toISOString()
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                username: payload.username,
                role: userRole,
                expiresIn: '24h'
            }
        });
    } catch (error) {
        console.error('Login error:', error);
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
