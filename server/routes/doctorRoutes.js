const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const adminAuth = require('../middleware/adminAuth');
const emailService = require('../config/emailService');
const { generateRandomPassword, generateSalt, hashPassword } = require('../utils/auth');

// Middleware to check Doctor Auth (using same adminAuth logic but checking returning role)
// For simplicity we will assume `adminAuth` middleware attaches `req.admin` which contains `{ role: 'doctor', id: ... }`
// We might need to split this middleware later, but for now we'll handle it here.

// GET all doctors (public)
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET all doctors (admin - includes inactive)
router.get('/admin', adminAuth, async (req, res) => {
    try {
        // Only actual admins can see this
        if (!req.admin.isAdmin) return res.status(403).json({ message: 'Access denied' });

        const doctors = await Doctor.find().sort({ order: 1, createdAt: -1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET Doctor Dashboard Data (Appointments)
router.get('/dashboard/appointments', adminAuth, async (req, res) => {
    try {
        // Ensure it's a doctor
        const doctorId = req.admin.id;
        const doctorName = req.admin.username; // adminAuth sets username to doctor's name if doctor

        if (!doctorId) {
            return res.status(403).json({ message: 'Not authorized as a doctor' });
        }

        // Find doctor to get exact name if needed, but we rely on name stored in Appointment
        // Actually Appointment stores doctor Name string. This is a bit fragile if names change.
        // Let's match by Doctor Name.
        // Ideally we should have stored Doctor ID in Appointment.

        // Fetch the doctor to get their current name
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

        // Find appointments for this doctor
        const appointments = await Appointment.find({ doctor: doctor.name })
            .sort({ date: 1, time: 1 });

        res.json({
            doctor: doctor,
            appointments: appointments
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// UPDATE Appointment Status (Accept/Reject)
router.put('/appointments/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body; // 'confirmed' (Accept) or 'cancelled' (Reject)
        const appointmentId = req.params.id;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Update status
        appointment.status = status;
        await appointment.save();

        // Send email based on status
        if (status === 'confirmed') {
            await emailService.sendAppointmentConfirmed(appointment.toEmailData());
        }

        res.json({ success: true, message: `Appointment ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET single doctor
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// CREATE doctor (admin)
router.post('/', adminAuth, async (req, res) => {
    try {
        if (!req.admin.isAdmin) return res.status(403).json({ message: 'Access denied' });

        // Generate Credentials
        const password = generateRandomPassword();
        const salt = generateSalt();
        const hashedPassword = hashPassword(password, salt);

        const doctorData = {
            ...req.body,
            password: hashedPassword,
            salt: salt
        };

        const doctor = new Doctor(doctorData);
        await doctor.save();

        // Send credentials email
        await emailService.sendDoctorCredentials({
            name: doctor.name,
            email: doctor.email,
            password: password
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: 'Validation error', error: error.message });
    }
});

// REISSUE Password (admin)
router.post('/reissue-password/:id', adminAuth, async (req, res) => {
    try {
        if (!req.admin.isAdmin) return res.status(403).json({ message: 'Access denied' });

        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        // Generate NEW Credentials
        const password = generateRandomPassword();
        const salt = generateSalt();
        const hashedPassword = hashPassword(password, salt);

        doctor.password = hashedPassword;
        doctor.salt = salt;
        await doctor.save();

        // Send credentials email
        await emailService.sendDoctorCredentials({
            name: doctor.name,
            email: doctor.email,
            password: password
        });

        res.json({ success: true, message: 'New credentials sent to doctor.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// UPDATE doctor (admin)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        if (!req.admin.isAdmin) return res.status(403).json({ message: 'Access denied' });

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(400).json({ message: 'Validation error', error: error.message });
    }
});

// DELETE doctor (admin)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        if (!req.admin.isAdmin) return res.status(403).json({ message: 'Access denied' });

        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// REORDER doctors (admin)
router.post('/reorder', adminAuth, async (req, res) => {
    try {
        if (!req.admin.isAdmin) return res.status(403).json({ message: 'Access denied' });

        const { orderUpdates } = req.body; // [{ id, order }, ...]
        const bulkOps = orderUpdates.map(({ id, order }) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order } }
            }
        }));
        await Doctor.bulkWrite(bulkOps);
        res.json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
