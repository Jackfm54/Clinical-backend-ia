const { inferRisk } = require("../services/aiServices");

const classifyHealthRisk = async (req, res) => {
  try {
    const { heartRate, bloodPressure, oxygenLevel } = req.body;

    const riskAnalysis = await inferRisk({
      heartRate,
      bloodPressure,
      oxygenLevel,
    });

    res.json({ success: true, risk: riskAnalysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { classifyHealthRisk };
