import React from 'react';
import '../styles/Header.css';
import logo from '../assets/images/logo.jpeg';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Surveillance de Santé</h1>
      </div>
      <nav>
        <a href="/">Accueil</a>
        <a href="/dashboard">Tableau de bord</a>
        <a href="/register">S'inscrire</a>
        <a href="/login">Se connecter</a>
      </nav>
    </header>
  );
};

export default Header;
