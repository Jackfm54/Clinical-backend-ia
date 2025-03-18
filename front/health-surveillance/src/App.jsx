import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HealthData from "./pages/HealthData";
import AdminDashboard from "./pages/AdminDashboard";
import Message from "./pages/Message";
import { fetchUsers } from "./services/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    // Obtener usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUser(userData);
      if (!userData.role || userData.role !== "doctor") {
        fetchDoctor(userData);
      }
    }
  }, []);

  // Buscar doctor para este usuario (si es paciente)
  const fetchDoctor = async (user) => {
    try {
      const users = await fetchUsers();
      const doctor = users.find((u) => u.email === user.doctorEmail);
      setSelectedDoctor(doctor || null);
    } catch (error) {
      console.error("Erreur lors de la récupération du médecin :", error);
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404: Page Not Found</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "doctor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-data"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <HealthData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message"
          element={
            <ProtectedRoute allowedRoles={["user", "doctor"]}>
              {currentUser && selectedDoctor ? (
                <Message user={currentUser} doctor={selectedDoctor} />
              ) : (
                <div>Chargement des données du chat...</div>
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
