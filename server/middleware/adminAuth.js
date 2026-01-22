const jwt = require('jsonwebtoken');

/**
 * Admin Authentication Middleware
 * Validates JWT token for protected admin routes
 */
const adminAuth = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's an admin token
        if (!decoded.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // Attach admin info to request
        req.admin = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

module.exports = adminAuth;
