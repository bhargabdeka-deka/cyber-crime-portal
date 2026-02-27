const axios = require("axios");

const sendEmail = async (subject, text) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Cyber Crime Portal",
          email: process.env.ADMIN_EMAIL
        },
        to: [
          {
            email: process.env.ADMIN_EMAIL
          }
        ],
        subject: subject,
        textContent: text
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📧 Email sent successfully via Brevo API");
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.response?.data || error.message
    );
  }
};

module.exports = sendEmail;
