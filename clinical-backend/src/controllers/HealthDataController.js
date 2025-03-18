const HealthData = require("../models/healthData");
const User = require("../models/User");
const { sendNotification } = require("../services/socketService");
const { sendRiskAlert } = require("../services/emailService");
const Notification = require("../models/notification");

const { getIO } = require("../services/socketService");

const saveHealthData = async (req, res) => {
  try {
    const { userId, heartRate, bloodPressure, oxygenLevel } = req.body;

    const patient = await User.findById(userId);
    if (!patient) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!/^\d+\/\d+$/.test(bloodPressure)) {
      return res.status(400).json({ message: "Format de pression artérielle invalide" });
    }

    const healthData = new HealthData({
      userId,
      heartRate,
      bloodPressure,
      oxygenLevel,
    });

    await healthData.save();

    const [systolic, diastolic] = bloodPressure.split("/").map((num) => parseInt(num.trim(), 10));
    let riskLevel = "🟢 Faible";

    if (heartRate > 120 || systolic >= 140 || diastolic >= 100) {
      riskLevel = "🔴 Élevé";

      console.log(`🚨 ALERTE ! Envoi d'email au médecin de ${patient.name} (${patient.doctorId})`);

      if (patient.doctorId) {
        // 📌 Guardar Notificación en la Base de Datos
        await Notification.create({
          doctorId: patient.doctorId,
          patientId: patient._id,
          message: `🚨 Risque élevé détecté pour ${patient.name}`,
        });

        // 📩 Enviar email al médico
        await sendRiskAlert({
          name: patient.name,
          doctorEmail: patient.doctorEmail,
          heartRate,
          bloodPressure,
          oxygenLevel,
        });

        console.log(`✅ Alerte email envoyée au médecin de ${patient.name}`);
      }
    } else if (heartRate > 90 || oxygenLevel < 92) {
      riskLevel = "🟠 Modéré";
    }

    // 📌 Actualizar el registro con el nivel de riesgo
    healthData.riskLevel = riskLevel;
    await healthData.save();

    res.status(201).json({
      message: "Données de santé enregistrées avec succès",
      healthData,
      riskLevel,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement des données de santé :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

const getHealthDataByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const healthData = await HealthData.find({ userId });

    if (!healthData.length) {
      return res.status(404).json({ message: "Aucune donnée trouvée pour cet utilisateur" });
    }

    res.status(200).json(healthData);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

const getRiskNotifications = async (req, res) => {
  try {
    const { doctorEmail } = req.params;

    if (!doctorEmail) {
      return res.status(400).json({ message: "L'email du médecin est requis" });
    }

    const patients = await User.find({ doctorEmail }).select("_id name email");

    if (patients.length === 0) {
      return res.status(404).json({ message: "Aucun patient trouvé pour ce médecin" });
    }

    const patientIds = patients.map((patient) => patient._id);

    const riskData = await HealthData.find({
      userId: { $in: patientIds },
      riskLevel: "🔴 Élevé",
    }).populate("userId", "name email");

    if (riskData.length === 0) {
      return res.status(200).json({ message: "Aucune alerte de risque élevé" });
    }

    res.status(200).json(riskData);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = { saveHealthData, getHealthDataByUser };
