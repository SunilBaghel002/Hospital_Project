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



// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images to be loaded from same origin if needed, or adjust as per Cloudinary

// Performance Middleware
app.use(compression()); // Gzip compression

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
// Apply rate limiting to all requests
app.use('/api', limiter);

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // Check if env var is not set, maybe allow localhost for dev?
            // For production-ready, strictly adhere to allowedOrigins.
            if(process.env.NODE_ENV === 'development') {
                 return callback(null, true); 
            }
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

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
app.use('/api/blogs', blogRoutes);

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
        message: 'Visionary Eye Care - CMS API',
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
║   🏥 Visionary Eye Care - CMS Server              ║
║                                                    ║
║   Port: ${PORT}                                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                    ║
║   Admin Panel: /admin                              ║
║                                                    ║
╚════════════════════════════════════════════════════╝
    `);
});