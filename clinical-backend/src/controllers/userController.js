const axios = require("axios");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const FormData = require("form-data");

const PYTHON_SERVICE_URL = "http://127.0.0.1:5002";

const createUser = async (req, res) => {
  try {
    console.log("📩 Données reçues dans createUser :", req.body);

    const { name, email, password, doctorId, role } = req.body; // 📌 Recibir doctorId
    const faceData = req.files?.["faceImage"] ? req.files["faceImage"][0].buffer : null;
    const voiceData = req.files?.["voiceData"] ? req.files["voiceData"][0].buffer : null;

    if (!password) {
      return res.status(400).json({ message: "🔴 Le mot de passe est requis" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "doctor" ? "doctor" : "user";

    // 📌 Si es un paciente, verificar que el doctor exista
    if (userRole === "user" && doctorId) {
      const doctorExists = await User.findById(doctorId);
      if (!doctorExists || doctorExists.role !== "doctor") {
        return res.status(400).json({ message: "🔴 Doctor introuvable ou invalide" });
      }
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      doctorId: userRole === "user" ? doctorId : null, // 📌 Asignar doctorId solo si es paciente
      faceEncoding: faceData || null,
      voiceText: voiceData || null,
    });

    console.log("✅ Utilisateur enregistré avec succès :", user);
    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, doctorId: user.doctorId },
    });

  } catch (error) {
    console.error("❌ Erreur dans createUser :", error);
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
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error("Erreur dans loginUser :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, { password: 0 }); // Excluir contraseña

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur dans getUserById :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const getUsersByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.query;  // Asegurar que obtenemos el doctorId
    if (!doctorId) {
      return res.status(400).json({ message: "DoctorId requis" });
    }

    const patients = await User.find({ doctorId: doctorId }); // Buscar pacientes con doctorId
    res.status(200).json(patients);
  } catch (error) {
    console.error("❌ Erreur dans getUsersByDoctor :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};


module.exports = { createUser, getUsers, loginUser, getUserById, getUsersByDoctor };
