import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedDoctor = localStorage.getItem("user");
      if (!storedDoctor) return;

      const doctor = JSON.parse(storedDoctor);

      try {
        const response = await api.get(`/notifications/${doctor.id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
      }
    };

    fetchNotifications();
  }, []);

  // 📌 Fonction pour supprimer une notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter((notif) => notif._id !== notificationId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification :", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Tableau de bord du Médecin</h1>

      {/* 🔔 Notifications */}
      <div className="notifications">
        <h2>🔔 Notifications</h2>
        {notifications.length === 0 ? (
          <p>Aucune notification disponible.</p>
        ) : (
          <ul>
            {notifications.map((notif) => (
              <li key={notif._id}>
                {notif.message} - <small>{new Date(notif.createdAt).toLocaleString()}</small>
                
                {/* 📧 Bouton pour envoyer un email au patient */}
                {notif.patientId?.email && (
                  <a 
                    href={`mailto:${notif.patientId.email}?subject=Suivi médical&body=Bonjour ${notif.patientId.name},\n\nJe vous contacte concernant votre état de santé.`}
                    className="email-link"
                  >
                    📧 Envoyer un Email
                  </a>
                )}

                {/* 🗑️ Bouton pour supprimer la notification */}
                <button 
                  onClick={() => handleDeleteNotification(notif._id)}
                  className="delete-button"
                >
                  🗑️ Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
