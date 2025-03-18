import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import LogoutButton from "../components/LogoutButton";
import HealthChart from "../components/HealthChart";
import "../styles/Dashboard.css";
// import io from "socket.io-client";
import MedicalChat from "../components/MedicalChat";

// Socket io
// const socket = io("http://localhost:5001");

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [newHealthData, setNewHealthData] = useState({
    heartRate: "",
    bloodPressure: "",
    oxygenLevel: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = healthData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(healthData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const averages = {
    averageHeartRate: 80,
    averageBloodPressure: "120/80",
    averageOxygenLevel: 98,
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchHealthData(userData.id);
    }
  }, [navigate]);

  useEffect(() => {
    if (predictions?.classification === "Risque Élevé") {
      alert("⚠️ Alerte ! Votre état de santé est préoccupant. Contactez votre médecin immédiatement.");
    }
  }, [predictions]);

  const fetchHealthData = async (userId) => {
    try {
      const response = await api.get(`/health-data/${userId}`);
      setHealthData(response.data);

      const predictionResponse = await api.post("/ai/predict", {
        healthData: response.data,
      });
      setPredictions(predictionResponse.data);
    } catch (error) {
      console.error("Échec de la récupération des données de santé :", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHealthData({ ...newHealthData, [name]: value });
  };

  const handleSubmitHealthData = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/health-data", {
        ...newHealthData,
        userId: user.id,
      });
      setHealthData((prev) => [...prev, response.data.healthData]);
      setNewHealthData({ heartRate: "", bloodPressure: "", oxygenLevel: "" });
      alert("Données de santé enregistrées avec succès !");
    } catch (error) {
      console.error("Échec de l'enregistrement des données de santé :", error);
      alert("Échec de l'enregistrement des données de santé. Veuillez réessayer.");
    }
  };

  return (
    <div className="dashboard-container">
      {user ? (
        <>
          <h2>Bienvenue, <b>{user.name}!</b></h2>
          <p>Votre e-mail : <b>{user.email}</b></p>
          <LogoutButton />

          {user.role === "doctor" && (
            <div className="admin-buttons">
              <button onClick={() => navigate("/admin-dashboard")}>Admin Dashboard</button>
              <br />
              <br />
              <button onClick={() => navigate("/health-data")}>Gestion des Patients</button>
            </div>
          )}

          <h3>Enregistrer vos données de santé</h3>
          <form onSubmit={handleSubmitHealthData} className="health-data-form">
            <label>
              Fréquence cardiaque (bpm) :
              <input
                type="number"
                name="heartRate"
                value={newHealthData.heartRate}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Pression artérielle (ex. : 120/80) :
              <input
                type="text"
                name="bloodPressure"
                value={newHealthData.bloodPressure}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Niveau d'oxygène (%) :
              <input
                type="number"
                name="oxygenLevel"
                value={newHealthData.oxygenLevel}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit">Enregistrer les données</button>
          </form>

          {/* Afficher l'historique des données de santé */}
          <h3>Historique de vos données de santé</h3>
          {healthData.length > 0 ? (
            <>
              <ul className="health-data-list">
                {healthData
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((data) => (
                    <li key={data._id}>
                      <p>
                        <strong>Fréquence cardiaque :</strong> {data.heartRate} bpm
                      </p>
                      <p>
                        <strong>Pression artérielle :</strong> {data.bloodPressure}
                      </p>
                      <p>
                        <strong>Niveau d'oxygène :</strong> {data.oxygenLevel}%
                      </p>
                      <p>
                        <strong>Date :</strong> {new Date(data.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
              </ul>

              {/* Pagination */}
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                  Précédent
                </button>
                <span>
                  Page {currentPage} sur {Math.ceil(healthData.length / itemsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(healthData.length / itemsPerPage)}
                >
                  Suivant
                </button>
              </div>
            </>
          ) : (
            <p>Aucune donnée de santé disponible</p>
          )}

          {/* Afficher les prédictions */}
          <h3>Prédictions</h3>
          {predictions ? (
            <div className={`predictions ${predictions.classification === "Risque Élevé" ? "high-risk" : ""}`}>
              <p>
                <strong>Prochaine fréquence cardiaque :</strong> {predictions.regression.nextHeartRate} bpm
              </p>
              <p>
                <strong>Prochain niveau d'oxygène :</strong> {predictions.regression.nextOxygenLevel}%
              </p>
              <p>
                <strong>Niveau de risque :</strong> <span className="risk-level">{predictions.classification}</span>
              </p>

              {/* 📢 Si le risque est élevé et que le patient a un médecin assigné */}
              {predictions.classification === "Risque Élevé" && user.doctorEmail && (
                <div className="alert-container">
                  <p className="alert-message">
                    ⚠️ <strong>Alerte :</strong> Votre état de santé est préoccupant. Nous vous recommandons de contacter votre médecin immédiatement.
                  </p>

                  {/* 📩 Bouton pour contacter le médecin */}
                  <a href={`mailto:${user.doctorEmail}?subject=Urgence Médicale - Risque Élevé`}
                    className="contact-doctor-button">
                    📩 Contacter mon médecin
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p>Chargement des prédictions...</p>
          )}

          {/* Intégrer le graphique médical */}
          {healthData.length > 0 ? (
            <HealthChart healthData={healthData} averages={averages} />
          ) : (
            <p>Chargement des données de santé...</p>
          )}

          {/* Intégrer le Chat Médical */}
          <h3>Chat Médical</h3>
          <MedicalChat />
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Dashboard;
