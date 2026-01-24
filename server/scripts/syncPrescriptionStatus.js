/**
 * Sync Prescriptions with Appointments
 * This script marks appointments as 'completed' for all existing prescriptions
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
        console.log('✅ Connected to MongoDB');

        // Get all prescriptions
        const prescriptions = await Prescription.find({});
        console.log(`📋 Found ${prescriptions.length} prescriptions`);

        let updated = 0;
        let notFound = 0;
        let alreadyCompleted = 0;

        for (const prescription of prescriptions) {
            const appointmentId = prescription.appointmentId;

            if (!appointmentId) {
                console.log(`⚠️ Prescription ${prescription._id} has no appointmentId`);
                notFound++;
                continue;
            }

            // Find the appointment
            const appointment = await Appointment.findById(appointmentId);

            if (!appointment) {
                console.log(`⚠️ Appointment ${appointmentId} not found for prescription ${prescription._id}`);
                notFound++;
                continue;
            }

            if (appointment.status === 'completed') {
                console.log(`✓ Appointment ${appointmentId} already completed`);
                alreadyCompleted++;
                continue;
            }

            // Update to completed
            appointment.status = 'completed';
            await appointment.save();
            console.log(`✅ Updated appointment ${appointmentId} to completed (Patient: ${appointment.name})`);
            updated++;
        }

        console.log('\n========== SYNC COMPLETE ==========');
        console.log(`Total Prescriptions: ${prescriptions.length}`);
        console.log(`Updated to Completed: ${updated}`);
        console.log(`Already Completed: ${alreadyCompleted}`);
        console.log(`Not Found/No ID: ${notFound}`);
        console.log('====================================\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

syncPrescriptionStatus();
