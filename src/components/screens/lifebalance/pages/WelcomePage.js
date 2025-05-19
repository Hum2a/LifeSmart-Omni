import React from 'react';
import '../styles/WelcomePage.css';

const WelcomePage = ({ onNext }) => {
  return (
    <div className="welcome-page">
      <h1 className="welcome-title">Welcome to LifeBalance™</h1>
      
      <div className="welcome-content">
        <p className="welcome-description">
          In the next few minutes, you'll map the key areas of your life and see how money and time influence each one.
        </p>

        <div className="welcome-section">
          <h2>Why it matters:</h2>
          <p>Clearer priorities mean smarter financial decisions.</p>
        </div>

        <div className="welcome-section">
          <h2>What you'll get:</h2>
          <p>A personal LifeBalance snapshot you can use as the starting point for your financial-literacy journey.</p>
        </div>

        <button 
          className="welcome-button"
          onClick={onNext}
        >
          Begin
        </button>
      </div>
    </div>
  );
};

export default WelcomePage; 