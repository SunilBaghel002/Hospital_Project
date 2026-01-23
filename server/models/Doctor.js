const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Specialization/Role is required'],
        trim: true
    },
    qualification: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    specialty: {
        type: String,
        trim: true
    },
    languages: [{
        type: String
    }],
    availableDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    consultationFee: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster lookups
doctorSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
