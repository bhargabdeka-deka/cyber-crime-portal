const nodemailer = require("nodemailer");

const sendEmail = async (subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // important
      auth: {
        user: process.env.EMAIL_USER,   // Brevo login
        pass: process.env.EMAIL_PASS    // Brevo SMTP key
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject,
      text
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

module.exports = sendEmail;
