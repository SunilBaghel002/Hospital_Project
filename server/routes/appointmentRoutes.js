const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    getAppointment,
    getAvailableSlots,
    updateStatus,
    deleteAppointment,
    getMyAppointments,
    requestReschedule,
    handleRescheduleAction
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Public routes
router.get('/available-slots', getAvailableSlots);

// Protected routes
router.post('/', protect, [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required').isMobilePhone().withMessage('Invalid phone number'),
    body('date').notEmpty().withMessage('Date is required').isISO8601().toDate().withMessage('Invalid date format'),
    body('time').notEmpty().withMessage('Time is required'),
    body('service').trim().notEmpty().withMessage('Service is required')
], createAppointment);

router.get('/my', protect, getMyAppointments);
router.post('/:id/reschedule', protect, requestReschedule);

// Admin/Doctor routes (add admin middleware in production)
router.get('/', protect, getAppointments); // Assuming admin
router.get('/:id', protect, getAppointment);
router.patch('/:id/status', protect, updateStatus);
router.patch('/:id/reschedule-action', protect, handleRescheduleAction);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;