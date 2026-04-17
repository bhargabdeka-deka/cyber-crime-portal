const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// Send to admin
const sendEmail = async (subject, text) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL,
      subject,
      text,
    });
    console.log("📧 Admin email sent:", subject);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};

// Send to any recipient
const sendEmailTo = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};

module.exports = { sendEmail, sendEmailTo };
