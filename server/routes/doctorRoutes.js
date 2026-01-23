const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const adminAuth = require('../middleware/adminAuth');

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
        const doctors = await Doctor.find().sort({ order: 1, createdAt: -1 });
        res.json(doctors);
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
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: 'Validation error', error: error.message });
    }
});

// UPDATE doctor (admin)
router.put('/:id', adminAuth, async (req, res) => {
    try {
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
