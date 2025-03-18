const express = require("express");
const { saveHealthData, getHealthDataByUser } = require("../controllers/HealthDataController");
const { sendRiskAlert } = require("../services/emailService");

const router = express.Router();

router.post("/", saveHealthData);

router.get("/:userId", getHealthDataByUser);

module.exports = router;
