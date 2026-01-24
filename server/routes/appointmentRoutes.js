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

const { body } = require('express-validator');

// Public routes
router.post('/', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required').isMobilePhone().withMessage('Invalid phone number'),
    body('date').notEmpty().withMessage('Date is required').isISO8601().toDate().withMessage('Invalid date format'),
    body('time').notEmpty().withMessage('Time is required'),
    body('service').trim().notEmpty().withMessage('Service is required')
], createAppointment);
router.get('/available-slots', getAvailableSlots);

// Admin routes (add authentication middleware in production)
router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteAppointment);

module.exports = router;