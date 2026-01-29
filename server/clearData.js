const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');
const User = require('./models/User'); // Only if we needed to clear users, but kept for reference

dotenv.config();

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear Doctors
        const docResult = await Doctor.deleteMany({});
        console.log(`🗑️  Cleared Doctors: ${docResult.deletedCount}`);

        // Clear Appointments
        const apptResult = await Appointment.deleteMany({});
        console.log(`🗑️  Cleared Appointments: ${apptResult.deletedCount}`);

        // Clear Prescriptions
        const prescResult = await Prescription.deleteMany({});
        console.log(`🗑️  Cleared Prescriptions: ${prescResult.deletedCount}`);

        // Ensure Users are NOT deleted unless asked. 
        // User requested: "clear all patient, prescriptions and doctor data"
        // "Patient" data usually implies Users with role 'patient'.
        // However, wiping all users might lock the ADMIN out if they are testing.
        // A safer approach for "all patient data" is to delete Users where role = 'patient'.

        const patientResult = await User.deleteMany({ role: 'patient' });
        console.log(`🗑️  Cleared Patients (Users with role='patient'): ${patientResult.deletedCount}`);

        console.log('✅ selected Database Cleared Successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
};

clearData();
