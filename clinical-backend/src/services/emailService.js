const nodemailer = require("nodemailer");

/**
 * 📌 Configuración de Ethereal Email (Gratis y sin credenciales externas)
 */
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "sarai.halvorson@ethereal.email",
    pass: "z2KwM44twgGFPSyhbb",
  },
});

/**
 * 📌 Envía una alerta médica al doctor cuando un paciente tiene riesgo alto
 * @param {Object} patient - Datos del paciente.
 */
const sendRiskAlert = async (patient) => {
  if (!patient.doctorEmail) {
    console.warn(`⚠ Aucun email de médecin trouvé pour ${patient.name}`);
    return;
  }

  const mailOptions = {
    from: '"Alerte Médicale" <noreply@healthsystem.com>',
    to: patient.doctorEmail,
    subject: `🚨 Alerte Médicale : Risque Élevé pour ${patient.name}`,
    text: `
      Bonjour Docteur,

      Le patient **${patient.name}** a été classé en **risque élevé**.

      📌 **Données de santé** :
      - **Fréquence cardiaque** : ${patient.heartRate} bpm
      - **Pression artérielle** : ${patient.bloodPressure}
      - **Niveau d'oxygène** : ${patient.oxygenLevel}%

      Merci de vérifier son dossier et d'agir immédiatement.

      **Système de Surveillance Médicale**
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé ! 📩 Vérifiez ici : ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
  }
};

module.exports = { sendRiskAlert };
