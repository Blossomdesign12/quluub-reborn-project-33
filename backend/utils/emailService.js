
const nodemailer = require('nodemailer');

// Configure nodemailer with your hosting details
const transporter = nodemailer.createTransporter({
  host: 'mail.quluub.com', // Replace with your actual mail server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'admin@quluub.com',
    pass: process.env.EMAIL_PASSWORD || 'your-email-password' // Set this in your .env file
  }
});

const sendValidationEmail = async (email, validationToken) => {
  const validationUrl = `${process.env.FRONTEND_URL}/validate-email?token=${validationToken}`;
  
  const mailOptions = {
    from: 'admin@quluub.com',
    to: email,
    subject: 'Validate Your Email - Quluub',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Welcome to Quluub!</h2>
        <p style="color: #666; line-height: 1.6;">
          Thank you for joining our community. Please click the button below to validate your email address:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${validationUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Validate Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link in your browser:<br>
          <a href="${validationUrl}">${validationUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Validation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending validation email:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: 'admin@quluub.com',
    to: email,
    subject: 'Reset Your Password - Quluub',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="color: #666; line-height: 1.6;">
          You requested to reset your password. Click the button below to set a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link in your browser:<br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  sendValidationEmail,
  sendPasswordResetEmail
};
