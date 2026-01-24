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
        to: appointmentData.doctorEmail || process.env.DOCTOR_EMAIL,
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

// Send booking received email to patient (while pending doctor approval)
const sendBookingReceived = async (appointmentData) => {
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
        subject: `📋 Booking Received - Awaiting Confirmation | ${process.env.CLINIC_NAME}`,
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
            <div class="header-icon">📋</div>
            <h1>Booking Received!</h1>
            <p>Your request is awaiting doctor confirmation</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 25px;">
                Dear <strong>${name}</strong>,<br><br>
                Your appointment request has been received and is pending approval from the doctor. You will receive a confirmation email once approved.
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
        console.log('✅ Booking received email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending booking received email:', error);
        throw error;
    }
};

// Send welcome email to new doctor
const sendDoctorWelcome = async (doctorData) => {
    const transporter = createTransporter();
    const { name, email, role } = doctorData;

    const mailOptions = {
        from: `"${process.env.CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `👋 Welcome to ${process.env.CLINIC_NAME} Team!`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f4f8; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 40px 30px; border-radius: 20px 20px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .footer { text-align: center; padding: 30px; color: #64748B; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome Aboard!</h1>
            <p>We are thrilled to have you join us, Dr. ${name}</p>
        </div>
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Welcome to the <strong>${process.env.CLINIC_NAME}</strong> team as our new <strong>${role}</strong>.</p>
            <p>We look forward to working with you to provide the best care for our patients.</p>
            <br>
            <p>Best regards,<br>The Administration Team</p>
        </div>
        <div class="footer">
            <p>${process.env.CLINIC_NAME}</p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Doctor welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending doctor welcome email:', error);
        return { success: false, error: error.message };
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

// Send credentials to doctor
const sendDoctorCredentials = async (data) => {
    const transporter = createTransporter();
    const { name, email, password } = data;

    const mailOptions = {
        from: `"${process.env.CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🔑 Your Login Credentials - ${process.env.CLINIC_NAME}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f4f8; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 40px 30px; border-radius: 20px 20px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .credentials-box { background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 12px; padding: 20px; margin: 25px 0; font-family: monospace; }
        .footer { text-align: center; padding: 30px; color: #64748B; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Access Key</h1>
            <p>Your portal credentials are ready</p>
        </div>
        <div class="content">
            <p>Dear <strong>Dr. ${name}</strong>,</p>
            <p>You can now access your doctor dashboard to view and manage appointments.</p>
            
            <div class="credentials-box">
                <p style="margin: 5px 0;"><strong>Username:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Password:</strong> <span style="background: white; padding: 2px 5px; border-radius: 4px;">${password}</span></p>
            </div>

            <p>Login URL: <a href="${process.env.FRONTEND_URL}/admin">${process.env.FRONTEND_URL}/admin</a></p>
            <p><em>(Use Ctrl + Shift + F to access the login page)</em></p>
        </div>
        <div class="footer">
            <p>${process.env.CLINIC_NAME}</p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Doctor credentials sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending credentials:', error);
        return { success: false, error: error.message };
    }
};

// Send prescription link to patient
const sendPrescriptionLink = async (data) => {
    const transporter = createTransporter();
    const { email, name, doctorName, link } = data;

    const mailOptions = {
        from: `"${process.env.CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `💊 Digital Prescription - ${process.env.CLINIC_NAME}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f4f8; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 40px 30px; border-radius: 20px 20px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 30px; color: #64748B; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Digital Prescription</h1>
            <p>From Dr. ${doctorName}</p>
        </div>
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your consultation with Dr. ${doctorName} has been completed. Please find your digital prescription below.</p>
            
            <div style="text-align: center;">
                <a href="${link}" class="btn">View Prescription</a>
            </div>

            <p style="font-size: 13px; color: #64748B;">
                <strong>Note:</strong> This is a secure link. For privacy reasons, screenshotting or downloading might be restricted by the viewer.
            </p>
        </div>
        <div class="footer">
            <p>${process.env.CLINIC_NAME}</p>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Prescription email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending prescription email:', error);
        return { success: false, error: error.message };
    }
};

// Send appointment confirmed email with visiting card (when doctor accepts)
const sendAppointmentConfirmed = async (appointmentData) => {
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

    const shortDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const mailOptions = {
        from: `"${process.env.CLINIC_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✅ Appointment Confirmed! Your Visiting Card - ${process.env.CLINIC_NAME}`,
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
        
        /* Visiting Card Styles */
        .visiting-card { 
            background: linear-gradient(135deg, #1E293B 0%, #334155 100%); 
            border-radius: 16px; 
            padding: 30px; 
            margin: 25px 0;
            color: white;
            position: relative;
            overflow: hidden;
        }
        .visiting-card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -30%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
        }
        .card-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            margin-bottom: 20px;
            position: relative;
        }
        .clinic-name { 
            font-size: 18px; 
            font-weight: 700; 
            color: #10B981;
            margin: 0;
        }
        .card-badge { 
            background: #10B981; 
            color: white; 
            padding: 6px 12px; 
            border-radius: 20px; 
            font-size: 11px; 
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .patient-name { 
            font-size: 24px; 
            font-weight: 700; 
            margin: 0 0 20px 0;
            color: white;
        }
        .card-details { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .detail-item label { 
            display: block; 
            font-size: 10px; 
            color: rgba(255,255,255,0.6); 
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .detail-item span { 
            font-size: 14px; 
            font-weight: 600;
            color: white;
        }
        .reference-strip {
            background: rgba(16, 185, 129, 0.2);
            padding: 12px 20px;
            border-radius: 8px;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .reference-strip label {
            font-size: 10px;
            color: rgba(255,255,255,0.6);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .reference-strip span {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            font-weight: 700;
            color: #10B981;
            letter-spacing: 2px;
        }
        
        .notice { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px 20px; border-radius: 0 12px 12px 0; margin: 25px 0; }
        .notice h4 { color: #92400E; margin: 0 0 5px 0; font-size: 14px; }
        .notice p { color: #A16207; margin: 0; font-size: 13px; line-height: 1.5; }
        .footer { text-align: center; padding: 30px; color: #64748B; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-icon">✅</div>
            <h1>Appointment Confirmed!</h1>
            <p>Your doctor has approved your appointment</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 25px;">
                Dear <strong>${name}</strong>,<br><br>
                Great news! Your appointment has been confirmed by the doctor. Please save your visiting card below.
            </p>
            
            <!-- VISITING CARD -->
            <div class="visiting-card">
                <div class="card-header">
                    <p class="clinic-name">🏥 ${process.env.CLINIC_NAME}</p>
                    <span class="card-badge">Confirmed</span>
                </div>
                <h2 class="patient-name">${name}</h2>
                <div class="card-details">
                    <div class="detail-item">
                        <label>Date</label>
                        <span>📅 ${shortDate}</span>
                    </div>
                    <div class="detail-item">
                        <label>Time</label>
                        <span>🕐 ${time}</span>
                    </div>
                    <div class="detail-item">
                        <label>Doctor</label>
                        <span>👨‍⚕️ ${doctor}</span>
                    </div>
                    <div class="detail-item">
                        <label>Amount Paid</label>
                        <span>💰 $${amount.toFixed(2)}</span>
                    </div>
                </div>
                <div class="reference-strip">
                    <label>Reference ID</label>
                    <span>${referenceId}</span>
                </div>
            </div>
            
            <div class="notice">
                <h4>📋 Important Reminders</h4>
                <p>
                    • Please arrive 15 minutes before your scheduled time<br>
                    • Bring a valid ID and this email as proof of booking<br>
                    • If you need to reschedule, please call us at least 24 hours in advance
                </p>
            </div>
            
            <div style="margin-top: 25px;">
                <h4 style="color: #1E293B; font-size: 14px; margin: 0 0 15px 0;">📍 Clinic Location</h4>
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
        console.log('✅ Appointment confirmed email with visiting card sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending appointment confirmed email:', error);
        throw error;
    }
};

module.exports = {
    sendDoctorNotification,
    sendBookingReceived,
    sendAppointmentConfirmed,
    sendDoctorWelcome,
    sendDoctorCredentials,
    sendPrescriptionLink,
    verifyEmailConfig
};