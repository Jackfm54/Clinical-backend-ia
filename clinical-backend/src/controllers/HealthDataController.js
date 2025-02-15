const HealthData = require("../models/healthData");
const { inferRisk } = require("../services/aiServices");
const { sendNotification } = require("../services/socketService");

const saveHealthDataWithAlert = async (data) => {
  const healthData = await saveHealthDataWithAnalysis(data);

  if (healthData.analysis.riskLevel === "Élevé") {
    sendNotification({
      message: "Risque élevé pour la santé détecté",
      userId: healthData.userId,
      data: healthData,
    });
  }

  return healthData;
};

const saveHealthDataWithAnalysis = async (data) => {
  const healthData = new HealthData(data);
  const riskAnalysis = await inferRisk(data);
  healthData.analysis = riskAnalysis;
  return await healthData.save();
};

const saveHealthData = async (req, res) => {
  try {
    const { userId, heartRate, bloodPressure, oxygenLevel } = req.body;

    const healthData = new HealthData({
      userId,
      heartRate,
      bloodPressure,
      oxygenLevel,
    });

    await healthData.save();
    res
      .status(201)
      .json({ message: "Données de santé enregistrées avec succès", healthData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Échec de l'enregistrement des données de santé", error: error.message });
  }
};

const getHealthDataByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const healthData = await HealthData.find({ userId });

    if (!healthData.length) {
      return res
        .status(404)
        .json({ message: "Aucune donnée de santé trouvée pour cet utilisateur" });
    }

    res.status(200).json(healthData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Échec de la récupération des données de santé", error: error.message });
  }
};

module.exports = { saveHealthData, getHealthDataByUser };
