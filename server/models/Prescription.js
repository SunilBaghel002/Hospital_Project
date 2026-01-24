const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    doctor: {
        name: String,
        email: String,
        id: mongoose.Schema.Types.ObjectId
    },
    patient: {
        name: String,
        email: String
    },
    diagnosis: {
        type: String,
        required: true
    },
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    notes: String,
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

// Index for fast lookup by token
prescriptionSchema.index({ token: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
