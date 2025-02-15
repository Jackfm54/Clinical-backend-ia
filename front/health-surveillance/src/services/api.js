import axios from "axios";


// Ollama working, but backend working in terminal
const API_BASE_URL = "http://127.0.0.1:5001/api";


// const API_BASE_URL = "https://clinical-backend-ia.onrender.com/api";
// const API_BASE_URL = "https://clinical-backend.onrender.com/api";


// Ollama NO Working
// const API_BASE_URL = "https://clinical-backend-ia-3t0k.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", error.response?.data || error.message);
    throw error;
  }
};

export const saveHealthData = async (healthData) => {
  try {
    const response = await api.post("/health-data", healthData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données de santé :", error.response?.data || error.message);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error.response?.data || error.message);
    throw error;
  }
};

export const fetchHealthDataByUser = async (userId) => {
  try {
    const response = await api.get(`/health-data/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données de santé :", error.response?.data || error.message);
    throw error;
  }
};
