/**
 * Sync Prescriptions with Appointments
 * Marks appointments as 'completed' for all existing prescriptions
 * Run with: node scripts/syncPrescriptionStatus.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

async function syncPrescriptionStatus() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Get all prescriptions
        const prescriptions = await Prescription.find({});
        console.log(`Found ${prescriptions.length} prescriptions\n`);

        let updated = 0;
        let notFound = 0;
        let alreadyCompleted = 0;

        for (const prescription of prescriptions) {
            let appointment = null;

            // Try by appointmentId first
            if (prescription.appointmentId) {
                appointment = await Appointment.findById(prescription.appointmentId);
            }

            // If not found, try matching by patient email
            if (!appointment && prescription.patient?.email) {
                appointment = await Appointment.findOne({
                    email: prescription.patient.email,
                    status: { $ne: 'completed' }
                }).sort({ date: -1 }); // Get most recent
            }

            // If still not found, try matching by patient name
            if (!appointment && prescription.patient?.name) {
                appointment = await Appointment.findOne({
                    name: prescription.patient.name,
                    status: { $ne: 'completed' }
                }).sort({ date: -1 });
            }

            if (!appointment) {
                console.log(`Could not find appointment for prescription (Patient: ${prescription.patient?.name || 'Unknown'})`);
                notFound++;
                continue;
            }

            if (appointment.status === 'completed') {
                console.log(`Appointment already completed (Patient: ${appointment.name})`);
                alreadyCompleted++;
                continue;
            }

            // Update to completed
            appointment.status = 'completed';
            await appointment.save();

            // Also update the prescription with the correct appointmentId if it was missing
            if (!prescription.appointmentId) {
                prescription.appointmentId = appointment._id;
                await prescription.save();
            }

            console.log(`Updated: ${appointment.name} -> completed`);
            updated++;
        }

        console.log('\n===== SYNC COMPLETE =====');
        console.log(`Total Prescriptions: ${prescriptions.length}`);
        console.log(`Updated to Completed: ${updated}`);
        console.log(`Already Completed: ${alreadyCompleted}`);
        console.log(`Not Found: ${notFound}`);
        console.log('=========================\n');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected');
        process.exit(0);
    }
}

syncPrescriptionStatus();
