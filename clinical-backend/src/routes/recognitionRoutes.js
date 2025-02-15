const express = require("express");
const axios = require("axios");
const multer = require("multer");

const router = express.Router();
const upload = multer();

const PYTHON_SERVICE_URL = "http://127.0.0.1:5002";

router.post(
  "/register",
  upload.fields([{ name: "faceImage" }, { name: "voiceData" }]),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const faceData = req.files["faceImage"] ? req.files["faceImage"][0].buffer : null;
      const voiceData = req.files["voiceData"] ? req.files["voiceData"][0].buffer : null;

      if (!faceData && !voiceData) {
        return res.status(400).json({ message: "Données faciales ou vocales requises." });
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (faceData) formData.append("faceImage", faceData, "faceImage.jpg");
      if (voiceData) formData.append("voiceData", voiceData, "voiceData.wav");

      const response = await axios.post(`${PYTHON_SERVICE_URL}/register`, formData, {
        headers: formData.getHeaders(),
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Erreur de connexion au service Python :", error.message);
      res.status(500).json({ message: "Échec de l'enregistrement avec reconnaissance.", error: error.message });
    }
  }
);

module.exports = router;
