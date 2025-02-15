import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await api.post("/users/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Réponse du serveur :", response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <label>Email :</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Mot de passe :</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit" disabled={loading}>{loading ? "Connexion en cours..." : "Se connecter"}</button>
      </form>

      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Login;
