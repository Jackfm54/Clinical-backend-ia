const { inferRisk } = require("../services/aiServices");
const HealthData = require("../models/healthData");

const getMedicalChatResponse = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Une question est requise." });
    }

    const analysis = await inferRisk({ prompt: question });
    console.log("Analyse de l'IA :", analysis);

    const recommendations = `Sur la base de l'analyse :
      - ${analysis}`;

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Erreur dans le chat médical :", error.message);
    res
      .status(500)
      .json({ message: "Impossible d'obtenir des recommandations pour le moment." });
  }
};

module.exports = { getMedicalChatResponse };
