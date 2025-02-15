import React, { useEffect, useState } from "react";
import { fetchUsers, fetchHealthDataByUser } from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await fetchUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Échec de la récupération des utilisateurs :", error);
      }
    };
    loadUsers();
  }, []);

  const handleUserSelect = async (userId) => {
    try {
      const data = await fetchHealthDataByUser(userId);
      setHealthData(data);
      const user = users.find((u) => u._id === userId);
      setSelectedUser(user);
    } catch (error) {
      console.error("Échec de la récupération des données de santé pour l'utilisateur :", error);
    }
  };

  return (
    <div>
      <h1>Tableau de bord administrateur</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h2>Utilisateurs</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <button onClick={() => handleUserSelect(user._id)}>
                  {user.name} ({user.email})
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selectedUser && (
          <div>
            <h2>Données de santé pour {selectedUser.name}</h2>
            {healthData.length > 0 ? (
              <ul>
                {healthData.map((data) => (
                  <li key={data._id}>
                    <p><strong>Fréquence cardiaque :</strong> {data.heartRate} bpm</p>
                    <p><strong>Pression artérielle :</strong> {data.bloodPressure}</p>
                    <p><strong>Niveau d'oxygène :</strong> {data.oxygenLevel}%</p>
                    <p><strong>Date :</strong> {new Date(data.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune donnée de santé disponible.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
