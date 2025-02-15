import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Surveillance de Santé</h1>
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
