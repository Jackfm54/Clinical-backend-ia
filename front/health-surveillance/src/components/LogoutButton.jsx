import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/LogoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <button className="logout-button" onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
      Déconnexion
    </button>
  );
};

export default LogoutButton;
