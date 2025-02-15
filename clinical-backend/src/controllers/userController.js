const axios = require("axios");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const FormData = require("form-data");

const PYTHON_SERVICE_URL = "http://127.0.0.1:5002";

const createUser = async (req, res) => {
  try {
    console.log("Données reçues dans createUser :", req.body);
    console.log("Fichiers reçus :", req.files);

    const { name, email, password } = req.body;
    const faceData = req.files?.["faceImage"] ? req.files["faceImage"][0].buffer : null;
    const voiceData = req.files?.["voiceData"] ? req.files["voiceData"][0].buffer : null;

    if (!password) {
      return res.status(400).json({ message: "Le mot de passe est requis" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      faceEncoding: faceData || null,
      voiceText: voiceData || null,
    });

    console.log("Utilisateur enregistré avec succès :", user);
    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("Erreur dans createUser :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur dans getUsers :", error);
    res.status(500).json({ message: "Échec de la récupération des utilisateurs" });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Données reçues dans login :", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Email ou mot de passe non fournis");
      return res.status(400).json({ message: "Email et mot de passe sont obligatoires" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log("Utilisateur trouvé :", user);

    if (!user.password) {
      console.log("L'utilisateur n'a pas de mot de passe enregistré");
      return res.status(500).json({ message: "Erreur serveur : le mot de passe n'est pas stocké" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Mot de passe incorrect");
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    res.status(200).json({
      message: "Connexion réussie",
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("Erreur dans loginUser :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = { createUser, getUsers, loginUser };
