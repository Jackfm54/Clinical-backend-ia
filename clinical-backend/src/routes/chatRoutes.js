const express = require("express");
const { getMedicalChatResponse } = require("../controllers/chatControllers");
const router = express.Router();

router.post("/", getMedicalChatResponse);

module.exports = router;
