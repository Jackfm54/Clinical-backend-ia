const { inferRisk } = require("./aiServices");

(async () => {
  try {
    const response = await inferRisk({
      prompt: "Quels sont les symptômes de l'hypertension ?",
      model: "ALIENTELLIGENCE/medicaldiagnostictools",
    });

    console.log("Réponse de l'IA :", response);
  } catch (error) {
    console.error("Erreur lors du test du modèle IA :", error.message);
  }
})();
