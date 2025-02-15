const express = require("express");
const { classifyHealthRisk } = require("../controllers/aiController");
const { regression, classifyRisk } = require("../services/aiServices");

const router = express.Router();

router.post("/classify", classifyHealthRisk);

router.post("/predict", (req, res) => {
	const { healthData } = req.body;

	if (!healthData || !Array.isArray(healthData) || healthData.length === 0) {
		return res.status(400).json({ error: "Données de santé invalides ou manquantes." });
	}

	const regressionResults = regression(healthData);
	const riskLevel = classifyRisk(healthData[healthData.length - 1]);

	res.json({
		regression: regressionResults,
		classification: riskLevel,
	});
});

module.exports = router;
