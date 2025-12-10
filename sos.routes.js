const router = require("express").Router();
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/isAuthenticated");
const nodemailer = require("nodemailer"); // Importa Nodemailer para el envío de correos electrónicos

// Solo inicializa Twilio si las credenciales están presentes
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log("[✓] Twilio client initialized.");
} else {
  console.warn("[ADVERTENCIA] Twilio credentials not found. SMS sending will be disabled.");
}

// Inicializa Nodemailer si las credenciales están presentes
let transporter;
if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // Ej: 'Gmail', 'Outlook365', o configuración SMTP personalizada
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("[✓] Nodemailer transporter initialized for email sending.");
} else {
  console.warn("[ADVERTENCIA] Email credentials (EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS) not found. Email sending will be disabled.");
}

// Esta es la ruta que el frontend llama cuando se activa el SOS
router.post("/sos", isAuthenticated, async (req, res) => {
  if (!twilioClient && !transporter) {
    console.error("[ERROR] SOS activated, but neither Twilio nor Email are configured. Cannot send any notifications.");
    return res.status(500).json({ message: "SOS recorded, but no notification methods configured. Please check server configuration." });
  }

  try {
    // 1. Obtener el usuario y sus contactos de emergencia
    const user = await User.findById(req.user.id).populate('emergencyContacts');
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      console.log(`[INFO] SOS for ${user.fullName}, but no contacts to notify.`);
      return res.status(200).json({ message: "SOS recorded, no emergency contacts configured for this user." });
    }

    // 2. Crear el mensaje de alerta
    const sosMessage = `EMERGENCY: ${user.fullName} has activated an SOS alert from AllergySafety. Please contact them immediately.`;

    const sosEmailSubject = `URGENT: SOS Alert from ${user.fullName} via AllergySafety`;
    const sosEmailBody = `
      <p>Dear Emergency Contact,</p>
      <p>This is an urgent notification from AllergySafety.</p>
      <p>Your contact, <strong>${user.fullName}</strong>, has activated an SOS alert.</p>
      <p>Please try to contact them immediately.</p>
      <p>This is an automated message. Do not reply.</p>
      <br>
      <p>AllergySafety Team</p>
    `;

    const notificationPromises = [];

    // Preparar promesas para SMS (si Twilio está configurado)
    if (twilioClient) {
      user.emergencyContacts.forEach(contact => {
        if (contact.phone) {
          notificationPromises.push(
            twilioClient.messages.create({
              body: sosMessage,
              from: process.env.TWILIO_PHONE_NUMBER, // Tu número de Twilio
              to: contact.phone // El número del contacto (debe tener formato internacional, ej: +1234567890)
            })
            .then(message => ({ type: 'sms', status: 'fulfilled', contact: contact.name, target: contact.phone, sid: message.sid }))
            .catch(error => ({ type: 'sms', status: 'rejected', contact: contact.name, target: contact.phone, error: error.message }))
          );
        } else {
          notificationPromises.push(Promise.resolve({ type: 'sms', status: 'skipped', contact: contact.name, reason: 'No phone number' }));
        }
      });
    } else {
      console.warn("[ADVERTENCIA] Twilio not configured, skipping SMS notifications.");
    }

    // Preparar promesas para Email (si Nodemailer está configurado)
    if (transporter) {
      user.emergencyContacts.forEach(contact => {
        if (contact.email) {
          notificationPromises.push(
            transporter.sendMail({
              from: process.env.FROM_EMAIL || process.env.EMAIL_USER, // Remitente del correo
              to: contact.email,
              subject: sosEmailSubject,
              html: sosEmailBody,
            })
            .then(info => ({ type: 'email', status: 'fulfilled', contact: contact.name, target: contact.email, messageId: info.messageId }))
            .catch(error => ({ type: 'email', status: 'rejected', contact: contact.name, target: contact.email, error: error.message }))
          );
        } else {
          notificationPromises.push(Promise.resolve({ type: 'email', status: 'skipped', contact: contact.name, reason: 'No email address' }));
        }
      });
    } else {
      console.warn("[ADVERTENCIA] Nodemailer not configured, skipping email notifications.");
    }

    // Si no se agregaron promesas de notificación (ej. no hay contactos con teléfono/correo, o servicios no configurados)
    if (notificationPromises.length === 0) {
        console.log(`[INFO] No notification promises generated for user ${user.fullName}.`);
        return res.status(200).json({ message: "SOS recorded, but no valid notification targets found or services configured." });
    }

    // Esperar a que todas las notificaciones intenten enviarse
    const results = await Promise.allSettled(notificationPromises);

    let smsSentCount = 0;
    let smsFailedCount = 0;
    let smsSkippedCount = 0;
    let emailSentCount = 0;
    let emailFailedCount = 0;
    let emailSkippedCount = 0;

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const notification = result.value;
        if (notification.type === 'sms') {
          if (notification.status === 'fulfilled') { smsSentCount++; console.log(`[SUCCESS] SMS sent to ${notification.contact} (${notification.target})`); }
          else if (notification.status === 'skipped') { smsSkippedCount++; console.log(`[INFO] SMS skipped for ${notification.contact} (${notification.reason})`); }
        } else if (notification.type === 'email') {
          if (notification.status === 'fulfilled') { emailSentCount++; console.log(`[SUCCESS] Email sent to ${notification.contact} (${notification.target})`); }
          else if (notification.status === 'skipped') { emailSkippedCount++; console.log(`[INFO] Email skipped for ${notification.contact} (${notification.reason})`); }
        }
      } else { // result.status === 'rejected'
        const notification = result.reason;
        if (notification.type === 'sms') { smsFailedCount++; console.error(`[ERROR] Failed to send SMS to ${notification.contact} (${notification.target}): ${notification.error}`); }
        else if (notification.type === 'email') { emailFailedCount++; console.error(`[ERROR] Failed to send email to ${notification.contact} (${notification.target}): ${notification.error}`); }
        else { console.error(`[ERROR] Unknown notification failure:`, notification); }
      }
    });

    let responseMessage = "SOS alert processing complete.";
    if (smsSentCount > 0) responseMessage += ` ${smsSentCount} SMS sent.`;
    if (emailSentCount > 0) responseMessage += ` ${emailSentCount} emails sent.`;
    if (smsFailedCount > 0 || emailFailedCount > 0) {
      responseMessage += ` Failed: ${smsFailedCount} SMS, ${emailFailedCount} emails.`;
    }
    if (smsSkippedCount > 0 || emailSkippedCount > 0) {
      responseMessage += ` Skipped: ${smsSkippedCount} SMS, ${emailSkippedCount} emails (missing contact info).`;
    }

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("[ERROR] Error processing SOS alert:", error);
    res.status(500).json({ message: "Failed to process SOS alert due to an internal server error." });
  }
});

module.exports = router;