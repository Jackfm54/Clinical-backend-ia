import React, { useState } from "react";
import { registerUser } from "../services/api";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
  
    try {
      const response = await registerUser(formDataToSend);
      console.log("Réponse du serveur :", response.data);
      setSuccessMessage("Utilisateur enregistré avec succès.");
      setErrorMessage("");
      setFormData({ name: "", email: "", password: "" }); // Réinitialiser les champs du formulaire
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur :", error.response?.data || error.message);
      setErrorMessage("Erreur lors de l'enregistrement de l'utilisateur.");
    }
  };

  return (
    <div className="register">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom :</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email :</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Mot de passe :</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">S'inscrire</button>
      </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Register;
