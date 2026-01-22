const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    referenceId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    doctor: {
        type: String,
        required: [true, 'Doctor selection is required']
    },
    date: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    time: {
        type: String,
        required: [true, 'Appointment time is required']
    },
    amount: {
        type: Number,
        required: true,
        default: 150.00
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
        default: 'pending'
    },
    emailSentToDoctor: {
        type: Boolean,
        default: false
    },
    emailSentToPatient: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Generate reference ID before saving
appointmentSchema.pre('save', function(next) {
    if (!this.referenceId) {
        this.referenceId = `VEC-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    next();
});

// Index for faster queries
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ email: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

// Static method to check slot availability
appointmentSchema.statics.isSlotAvailable = async function(date, time, doctor) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await this.findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
        time: time,
        doctor: doctor,
        status: { $nin: ['cancelled'] }
    });
    
    return !existing;
};

// Instance method for email data
appointmentSchema.methods.toEmailData = function() {
    return {
        referenceId: this.referenceId,
        name: this.name,
        email: this.email,
        phone: this.phone,
        doctor: this.doctor,
        date: this.date,
        time: this.time,
        amount: this.amount
    };
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;