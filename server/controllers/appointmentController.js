const Appointment = require('../models/Appointment');
const { sendDoctorNotification, sendPatientConfirmation } = require('../config/emailService');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = async (req, res) => {
    try {
        const { name, email, phone, doctor, date, time, amount = 150.00 } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !doctor || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
                required: ['name', 'email', 'phone', 'doctor', 'date', 'time']
            });
        }

        // Check if slot is available
        const isAvailable = await Appointment.isSlotAvailable(date, time, doctor);
        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: 'This time slot is already booked. Please choose another time.'
            });
        }

        // Generate reference ID
        const referenceId = `VEC-${Math.floor(1000 + Math.random() * 9000)}`;

        // Create appointment
        const appointment = await Appointment.create({
            referenceId,
            name,
            email,
            phone,
            doctor,
            date: new Date(date),
            time,
            amount
        });

        // Get email data
        const emailData = appointment.toEmailData();

        // Send emails asynchronously (don't block response)
        const sendEmails = async () => {
            try {
                // Send to doctor
                await sendDoctorNotification(emailData);
                appointment.emailSentToDoctor = true;

                // Send to patient
                await sendPatientConfirmation(emailData);
                appointment.emailSentToPatient = true;

                await appointment.save();
                console.log('✅ All emails sent for appointment:', referenceId);
            } catch (emailError) {
                console.error('❌ Email error:', emailError.message);
            }
        };

        // Fire and forget
        sendEmails();

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully!',
            data: {
                referenceId: appointment.referenceId,
                name: appointment.name,
                email: appointment.email,
                doctor: appointment.doctor,
                date: appointment.date,
                time: appointment.time,
                amount: appointment.amount,
                status: appointment.status
            }
        });

    } catch (error) {
        console.error('Create appointment error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to book appointment. Please try again.'
        });
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (should add auth)
exports.getAppointments = async (req, res) => {
    try {
        const { status, doctor, date, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (doctor) query.doctor = doctor;
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const appointments = await Appointment.find(query)
            .sort({ date: 1, time: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Appointment.countDocuments(query);

        res.json({
            success: true,
            count: appointments.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: appointments
        });

    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments'
        });
    }
};

// @desc    Get available time slots for a date and doctor
// @route   GET /api/appointments/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res) => {
    try {
        const { date, doctor } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required'
            });
        }

        const allSlots = [
            '09:00 AM',
            '10:00 AM',
            '11:00 AM',
            '02:00 PM',
            '04:00 PM'
        ];

        // Find booked slots for the date
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const query = {
            date: { $gte: startDate, $lte: endDate },
            status: { $nin: ['cancelled'] }
        };

        if (doctor) {
            query.doctor = doctor;
        }

        const bookedAppointments = await Appointment.find(query).select('time doctor');
        
        const bookedSlots = bookedAppointments.map(apt => ({
            time: apt.time,
            doctor: apt.doctor
        }));

        // If doctor is specified, filter available slots for that doctor
        let availableSlots;
        if (doctor) {
            const bookedTimes = bookedSlots
                .filter(s => s.doctor === doctor)
                .map(s => s.time);
            availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
        } else {
            // Return all slots with booking info
            availableSlots = allSlots;
        }

        res.json({
            success: true,
            date,
            doctor: doctor || 'all',
            availableSlots,
            bookedSlots: bookedSlots.map(s => s.time),
            totalSlots: allSlots.length
        });

    } catch (error) {
        console.error('Get available slots error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get available slots'
        });
    }
};

// @desc    Get single appointment by ID or reference
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find by MongoDB ID or reference ID
        let appointment = await Appointment.findById(id);
        if (!appointment) {
            appointment = await Appointment.findOne({ referenceId: id });
        }

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment'
        });
    }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
                validStatuses
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: `Appointment ${status}`,
            data: appointment
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment'
        });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment deleted'
        });

    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete appointment'
        });
    }
};