import React from 'react';
import '../styles/Home.css';
import homeImage from '../assets/images/home-img.jpg';

const Home = () => {
  return (
    <div className="home">
      <h2>Bienvenue sur Surveillance de Santé</h2>
      <p>Surveillez votre santé à tout moment, où que vous soyez.</p>
      <img src={homeImage} alt="Health monitoring" />
    </div>
  );
};

export default Home;
