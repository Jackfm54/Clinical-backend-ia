import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const doctor = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!doctor) return;

    fetchNotifications();

    socket.emit("join", doctor.id);
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [doctor]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/api/notifications/${doctor.id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications :", error);
    }
  };

  return (
    <div className="notifications-container">
      <h2>🔔 Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index} className="notification">
              <p>{notif.message}</p>
              <small>{new Date(notif.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>🚨 Aucune alerte de risque élevé pour l’instant.</p>
      )}
    </div>
  );
};

export default DoctorNotifications;
