const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    getAppointment,
    getAvailableSlots,
    updateStatus,
    deleteAppointment
} = require('../controllers/appointmentController');

// Public routes
router.post('/', createAppointment);
router.get('/available-slots', getAvailableSlots);

// Admin routes (add authentication middleware in production)
router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteAppointment);

module.exports = router;