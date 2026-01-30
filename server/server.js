const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

console.log('Environment Debug:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Exists' : 'Missing');

// Routes
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const sectionsRoutes = require('./routes/sectionsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');



// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images to be loaded from same origin if needed, or adjust as per Cloudinary

// Performance Middleware
app.use(compression()); // Gzip compression

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined if env var is missing

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is allowed or if it's a Vercel deployment (local or preview)
        if (allowedOrigins.indexOf(origin) !== -1 ||
            process.env.NODE_ENV === 'development' ||
            origin.endsWith('.vercel.app')) { // Allow all Vercel domains for now to fix CORS on preview/prod
            return callback(null, true);
        } else {
            console.log('Blocked Origin:', origin); // Debugging
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Rate Limiting - configurable based on environment
const limiter = rateLimit({
    windowMs: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 1 * 60 * 1000, // 15 min prod, 1 min dev
    max: process.env.NODE_ENV === 'production' ? 500 : 1000, // Higher limits
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for localhost in development
        if (process.env.NODE_ENV !== 'production') {
            const ip = req.ip || req.connection.remoteAddress;
            if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
                return true;
            }
        }
        return false;
    },
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    }
});
// Apply rate limiting to all API requests
app.use('/api', limiter);

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// Public routes for frontend (no auth required)
const publicRoutes = require('./routes/publicRoutes');
app.use('/api/public', publicRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Romashka Health Care - CMS API',
        version: '2.0.0',
        endpoints: {
            appointments: '/api/appointments',
            admin: '/api/admin',
            pages: '/api/pages',
            sections: '/api/sections',
            settings: '/api/settings',
            upload: '/api/upload'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🏥 Romashka Health Care - CMS Server             ║
║                                                    ║
║   Port: ${PORT}                                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                         ║
║                                                    ║
║   Admin Panel: /admin                              ║
║                                                    ║
╚════════════════════════════════════════════════════╝
    `);
});