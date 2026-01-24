const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const crypto = require('crypto');
const adminAuth = require('../middleware/adminAuth');
const emailService = require('../config/emailService');

/**
 * Generate a secure 32-char token
 */
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// CREATE Prescription (Doctor only)
router.post('/create', adminAuth, async (req, res) => {
    try {
        // Double check it's a doctor
        if (req.admin.role !== 'doctor') {
            return res.status(403).json({ message: 'Only doctors can prescribe' });
        }

        const { appointmentId, patientName, patientEmail, diagnosis, medications, notes } = req.body;

        const token = generateToken();

        const prescription = new Prescription({
            appointmentId,
            doctor: {
                name: req.admin.username,
                email: req.admin.username, // In our auth logic username IS email for doctors
                id: req.admin.id
            },
            patient: {
                name: patientName,
                email: patientEmail
            },
            diagnosis,
            medications,
            notes,
            token
        });

        await prescription.save();

        // Mark Appointment as Completed
        const Appointment = require('../models/Appointment');
        if (appointmentId) {
            const updatedAppointment = await Appointment.findByIdAndUpdate(
                appointmentId,
                { status: 'completed' },
                { new: true }
            );
            if (updatedAppointment) {
                console.log('✅ Appointment marked as completed:', appointmentId);
            } else {
                console.warn('⚠️ Appointment not found for ID:', appointmentId);
            }
        } else {
            console.warn('⚠️ No appointmentId provided, cannot mark as completed');
        }

        // Send Email
        const link = `${process.env.FRONTEND_URL}/prescription/view/${token}`;
        await emailService.sendPrescriptionLink({
            email: patientEmail,
            name: patientName,
            doctorName: req.admin.username,
            link
        });

        res.status(201).json({ success: true, message: 'Prescription sent', prescriptionId: prescription._id });

    } catch (error) {
        console.error('Prescription create error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET Prescription by Token (Public View)
router.get('/view/:token', async (req, res) => {
    try {
        const prescription = await Prescription.findOne({ token: req.params.token });
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found or expired' });
        }
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET History (Doctor only) - with pagination
router.get('/history', adminAuth, async (req, res) => {
    try {
        if (req.admin.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        // Build search filter
        let filter = { 'doctor.id': req.admin.id };
        if (search) {
            filter.$or = [
                { 'patient.name': { $regex: search, $options: 'i' } },
                { 'patient.phone': { $regex: search, $options: 'i' } },
                { diagnosis: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await Prescription.countDocuments(filter);

        // Get paginated results
        const prescriptions = await Prescription.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .select('patient diagnosis medications date token'); // Only select needed fields

        res.json({
            prescriptions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
