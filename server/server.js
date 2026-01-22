const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Load env vars
dotenv.config();

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

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/appointments', appointmentRoutes);

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
        message: 'Visionary Eye Care - Appointment API',
        version: '1.0.0',
        endpoints: {
            createAppointment: 'POST /api/appointments',
            getAppointments: 'GET /api/appointments',
            getAvailableSlots: 'GET /api/appointments/available-slots?date=YYYY-MM-DD'
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
║   🏥 Visionary Eye Care - Appointment Server       ║
║                                                    ║
║   Server: http://localhost:${PORT}                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                    ║
╚════════════════════════════════════════════════════╝
    `);
});