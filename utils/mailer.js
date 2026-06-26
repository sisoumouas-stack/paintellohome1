// utils/mailer.js
const nodemailer = require('nodemailer');

// ✅ Create transporter with explicit SMTP settings, IPv4 and timeouts
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,                // secure port for SSL
  secure: true,             // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // ✅ Force IPv4 and increase timeouts
  family: 4,                // important: force IPv4
  connectionTimeout: 30000, // 30 seconds
  socketTimeout: 30000,
});

/**
 * Send order confirmation email to admin
 */
async function sendAdminOrderEmail({ name, numero, total, address }) {
  try {
    await transporter.sendMail({
      from: `"Paintello Commande" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🧾 Nouvelle commande confirmée`,
      text: `Une commande vient d'être envoyée sur WhatsApp :

👤 Client : ${name}
📞 Numéro : ${numero}
💰 Total : ${total} DA
📍 Adresse : ${address}

paintello.uk`
    });
    console.log("📧 Email de commande envoyé à l'admin");
  } catch (err) {
    console.error("❌ Erreur email commande:", err.message);
  }
}

/**
 * Send client reply email to admin
 */
async function sendClientReplyEmail({ name, numero, response }) {
  try {
    await transporter.sendMail({
      from: `"Paintello Réponse" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📨 Réponse du client`,
      text: `Un client a répondu au message WhatsApp :

👤 Nom : ${name}
📞 Numéro : ${numero}
💬 Réponse : ${response}

paintello.uk`
    });
    console.log("📧 Email de réponse client envoyé à l'admin");
  } catch (err) {
    console.error("❌ Erreur email réponse:", err.message);
  }
}

/**
 * Send return confirmation email (unchanged but uses new transporter)
 */
async function sendReturnConfirmationEmail({ orderId, returnId }) {
  try {
    await transporter.sendMail({
      from: `"Paintello Returns" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Your Return Request Has Been Received',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Return Request Confirmation</h2>
          <p>We've received your return request for Order #${orderId}.</p>
          <p>Return ID: <strong>${returnId}</strong></p>
          <p>We'll process your request within 3-5 business days.</p>
          <p>You can check the status of your return at any time by visiting your order tracking page.</p>
          <p>Thank you for shopping with Paintello!</p>
        </div>
      `
    });
    console.log("📧 Return confirmation email sent");
  } catch (err) {
    console.error('Error sending return confirmation email:', err);
  }
}

module.exports = {
  sendAdminOrderEmail,
  sendClientReplyEmail,
  sendReturnConfirmationEmail
};
