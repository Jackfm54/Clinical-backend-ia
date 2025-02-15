import React, { useState } from "react";
import { api } from "../services/api";
import "../styles/ChatMedical.css";

const ChatMedical = () => {
  const [healthData, setHealthData] = useState({
    heartRate: "",
    bloodPressure: "",
    oxygenLevel: "",
  });
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHealthData({ ...healthData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   try {
    console.log("Envoi des données de santé :", healthData);
    const response = await api.post("/chat", { healthData });
    console.log("Recommandations reçues :", response.data);
    setRecommendations(response.data.recommendations);
  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations :", error.response?.data || error.message);
    setRecommendations("Impossible d'obtenir des recommandations pour le moment.");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="chat-medical">
      <h3>Chat Médical</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Fréquence cardiaque :
          <input
            type="number"
            name="heartRate"
            value={healthData.heartRate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Pression artérielle :
          <input
            type="text"
            name="bloodPressure"
            value={healthData.bloodPressure}
            onChange={handleInputChange}
            placeholder="ex. : 120/80"
            required
          />
        </label>
        <label>
          Niveau d'oxygène :
          <input
            type="number"
            name="oxygenLevel"
            value={healthData.oxygenLevel}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Obtenir des recommandations"}
        </button>
      </form>
      {recommendations && (
        <div className="recommendations">
          <h4>Recommandations :</h4>
          <p>{recommendations}</p>
        </div>
      )}
    </div>
  );
};

export default ChatMedical;
