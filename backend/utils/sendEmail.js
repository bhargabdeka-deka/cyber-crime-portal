const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (subject, text) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",  // Resend default sender (works instantly)
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      text: text,
    });

    console.log("📧 Email sent successfully via Resend");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

module.exports = sendEmail;
