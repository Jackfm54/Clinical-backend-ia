import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const DoctorDashboard = ({ user }) => {
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (!user || user.role !== "doctor") return;

		const fetchNotifications = async () => {
			try {
				const response = await api.get(`/api/notifications/${user.id}`);
				setNotifications(response.data);
			} catch (error) {
				console.error("Erreur lors de la récupération des notifications :", error);
			}
		};

		fetchNotifications();

		// 📡 Escuchar notificaciones en tiempo real
		socket.on("riskAlert", (notification) => {
			setNotifications((prev) => [notification, ...prev]);
		});

		return () => {
			socket.off("riskAlert");
		};
	}, [user]);

	return (
		<div className="doctor-dashboard">
			<h2>Notifications</h2>
			{notifications.length > 0 ? (
				<ul>
					{notifications.map((notif, index) => (
						<li key={index} className="notification">
							{notif.message}
						</li>
					))}
				</ul>
			) : (
				<p>Aucune alerte pour l'instant.</p>
			)}
		</div>
	);
};

export default DoctorDashboard;
