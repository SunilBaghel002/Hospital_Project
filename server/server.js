const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🏥 Visionary Eye Care - CMS Server              ║
║                                                    ║
║   Server: http://localhost:${PORT}                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                    ║
║   Admin Panel: /admin                              ║
║                                                    ║
╚════════════════════════════════════════════════════╝
    `);
});