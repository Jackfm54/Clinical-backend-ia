const { exec } = require("child_process");

const inferRisk = async ({ prompt, model = "ALIENTELLIGENCE/medicaldiagnostictools" }) => {
  return new Promise((resolve, reject) => {
    console.log("Exécution du modèle :", model);
    console.log("Prompt envoyé :", prompt);

    const command = `echo "${prompt}" | ollama run ${model}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Erreur d'exécution :", stderr || error.message);
        return reject(new Error("Échec de l'exécution du modèle IA."));
      }

      console.log("Réponse du modèle :", stdout.trim());
      resolve(stdout.trim());
    });
  });
};

const regression = (healthData) => {
  const heartRates = healthData.map((d) => d.heartRate);
  const avgHeartRate = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;

  const oxygenLevels = healthData.map((d) => d.oxygenLevel);
  const avgOxygenLevel = oxygenLevels.reduce((a, b) => a + b, 0) / oxygenLevels.length;

  return {
    nextHeartRate: avgHeartRate,
    nextOxygenLevel: avgOxygenLevel,
  };
};

const classifyRisk = (data) => {
  if (data.heartRate > 120 || data.bloodPressure.includes("140/100")) {
    return "Risque Élevé";
  } else if (data.heartRate > 90 || data.oxygenLevel < 92) {
    return "Risque Modéré";
  } else {
    return "Risque Faible";
  }
};

module.exports = { inferRisk, regression, classifyRisk };
