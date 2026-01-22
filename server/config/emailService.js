const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send notification email to doctor
const sendDoctorNotification = async (appointmentData) => {
    const transporter = createTransporter();

    const {
        referenceId,
        name,
        email,
        phone,
        doctor,
        date,
        time,
        amount
    } = appointmentData;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const mailOptions = {
        from: `"${process.env.CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
        to: process.env.DOCTOR_EMAIL,
        subject: `📅 New Appointment - ${name} | ${formattedDate}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f4f8; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 40px 30px; border-radius: 20px 20px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .badge { display: inline-block; background: #DBEAFE; color: #1E40AF; padding: 8px 16px; border-radius: 50px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .info-card { background: #F8FAFC; border-radius: 16px; padding: 24px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #E2E8F0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748B; font-size: 14px; }
        .info-value { color: #1E293B; font-weight: 600; font-size: 14px; }
        .highlight-box { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 20px; border-radius: 16px; text-align: center; margin: 20px 0; }
        .highlight-box h2 { margin: 0 0 5px 0; font-size: 28px; }
        .highlight-box p { margin: 0; opacity: 0.9; font-size: 14px; }
        .footer { text-align: center; padding: 30px; color: #64748B; font-size: 12px; }
        .footer a { color: #3B82F6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 New Appointment Request</h1>
            <p>A patient has booked an appointment with you</p>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 20px;">
                <span class="badge">Reference: ${referenceId}</span>
            </div>
            
            <div class="highlight-box">
                <h2>${formattedDate}</h2>
                <p>🕐 ${time}</p>
            </div>
            
            <div class="info-card">
                <h3 style="margin: 0 0 15px 0; color: #1E293B; font-size: 16px;">👤 Patient Information</h3>
                <div class="info-row">
                    <span class="info-label">Full Name</span>
                    <span class="info-value">${name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email</span>
                    <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${phone}</span>
                </div>
            </div>
            
            <div class="info-card">
                <h3 style="margin: 0 0 15px 0; color: #1E293B; font-size: 16px;">📋 Appointment Details</h3>
                <div class="info-row">
                    <span class="info-label">Assigned Doctor</span>
                    <span class="info-value">${doctor}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Amount Paid</span>
                    <span class="info-value" style="color: #10B981;">$${amount.toFixed(2)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status</span>
                    <span class="info-value" style="color: #F59E0B;">⏳ Pending Confirmation</span>
                </div>
            </div>
            
            <p style="text-align: center; color: #64748B; font-size: 14px; margin-top: 20px;">
                Please confirm this appointment at your earliest convenience.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>${process.env.CLINIC_NAME}</strong></p>
            <p>${process.env.CLINIC_ADDRESS}</p>
            <p>${process.env.CLINIC_PHONE}</p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Doctor notification sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending doctor notification:', error);
        throw error;
    }
};

// Send confirmation email to patient
const sendPatientConfirmation = async (appointmentData) => {
    const transporter = createTransporter();

    const {
        referenceId,
        name,
        email,
        doctor,
        date,
        time,
        amount
    } = appointmentData;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const mailOptions = {
        from: `"${process.env.CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✅ Appointment Confirmed - ${process.env.CLINIC_NAME}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f4f8; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 50px 30px; border-radius: 20px 20px 0 0; text-align: center; }
        .header-icon { font-size: 60px; margin-bottom: 15px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .reference-box { background: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 16px; padding: 20px; text-align: center; margin: 20px 0; }
        .reference-box label { display: block; color: #64748B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .reference-box h2 { margin: 0; font-family: 'Courier New', monospace; font-size: 28px; color: #1E293B; letter-spacing: 3px; }
        .appointment-card { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; border-radius: 16px; padding: 25px; margin: 20px 0; position: relative; overflow: hidden; }
        .appointment-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); }
        .appointment-card h3 { margin: 0 0 20px 0; font-size: 18px; font-weight: 600; }
        .appointment-detail { display: flex; align-items: center; margin: 12px 0; }
        .appointment-detail span:first-child { margin-right: 12px; font-size: 20px; }
        .appointment-detail span:last-child { font-size: 16px; }
        .info-section { margin: 25px 0; }
        .info-section h4 { color: #1E293B; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px; }
        .info-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0; }
        .info-item:last-child { border-bottom: none; }
        .info-item .label { color: #64748B; }
        .info-item .value { color: #1E293B; font-weight: 600; }
        .notice { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px 20px; border-radius: 0 12px 12px 0; margin: 25px 0; }
        .notice h4 { color: #92400E; margin: 0 0 5px 0; font-size: 14px; }
        .notice p { color: #A16207; margin: 0; font-size: 13px; line-height: 1.5; }
        .cta-button { display: block; background: #1E293B; color: white; text-align: center; padding: 16px 30px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 25px 0; }
        .footer { text-align: center; padding: 30px; color: #64748B; font-size: 12px; }
        .social-links { margin: 15px 0; }
        .social-links a { display: inline-block; margin: 0 8px; color: #64748B; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-icon">✅</div>
            <h1>Appointment Confirmed!</h1>
            <p>Thank you for choosing ${process.env.CLINIC_NAME}</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 25px;">
                Dear <strong>${name}</strong>,<br><br>
                Your appointment has been successfully booked. Please save this email for your records.
            </p>
            
            <div class="reference-box">
                <label>Booking Reference</label>
                <h2>${referenceId}</h2>
            </div>
            
            <div class="appointment-card">
                <h3>📅 Your Appointment</h3>
                <div class="appointment-detail">
                    <span>📆</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="appointment-detail">
                    <span>🕐</span>
                    <span>${time}</span>
                </div>
                <div class="appointment-detail">
                    <span>👨‍⚕️</span>
                    <span>${doctor}</span>
                </div>
            </div>
            
            <div class="info-section">
                <h4>Payment Summary</h4>
                <div class="info-item">
                    <span class="label">Consultation Fee</span>
                    <span class="value">$${amount.toFixed(2)}</span>
                </div>
                <div class="info-item">
                    <span class="label">Payment Status</span>
                    <span class="value" style="color: #10B981;">✓ Paid</span>
                </div>
            </div>
            
            <div class="notice">
                <h4>📋 Important Reminders</h4>
                <p>
                    • Please arrive 15 minutes before your scheduled time<br>
                    • Bring a valid ID and any previous medical records<br>
                    • If you need to reschedule, please call us at least 24 hours in advance
                </p>
            </div>
            
            <div class="info-section">
                <h4>📍 Clinic Location</h4>
                <p style="color: #475569; line-height: 1.6;">
                    <strong>${process.env.CLINIC_NAME}</strong><br>
                    ${process.env.CLINIC_ADDRESS}<br>
                    📞 ${process.env.CLINIC_PHONE}
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>Need help? Contact us at ${process.env.CLINIC_PHONE}</p>
            <p style="margin-top: 15px; opacity: 0.7;">
                This is an automated email. Please do not reply directly.
            </p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Patient confirmation sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending patient confirmation:', error);
        throw error;
    }
};

// Verify email configuration
const verifyEmailConfig = async () => {
    const transporter = createTransporter();
    try {
        await transporter.verify();
        console.log('✅ Email configuration verified');
        return true;
    } catch (error) {
        console.error('❌ Email configuration error:', error.message);
        return false;
    }
};

module.exports = {
    sendDoctorNotification,
    sendPatientConfirmation,
    verifyEmailConfig
};