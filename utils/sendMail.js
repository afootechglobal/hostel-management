const transporter = require('../config/mail/mailConfig');

async function sendTestMail(userName, userEmail, otp) {
    try {
        const info = await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            bcc: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: `Dear ${userName}, This is a test email from Node.js. Your otp code is: ${otp}`
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error:', error.message);
    }
}


async function resetPasswordOtp(userName, userEmail, otp) {
    try {
        const info = await transporter.sendMail({
            from: `"Hostel System" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'OTP Verification',
            html: `Dear  ${userName}, <h2>Your OTP Code</h2>
                    <p><b>${otp}</b></p>
                    <p>This code expires in 10 minutes.</p>`
        });
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error:', error.message);
    }
}





module.exports = { sendTestMail, resetPasswordOtp }