import React from 'react';
import { useNavigate } from 'react-router-dom';
import lifesmartlogo from '../../assets/icons/LifeSmartLogo.png';
import './styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <header className="not-found-header">
        <img src={lifesmartlogo} alt="LifeSmart Logo" className="not-found-logo" />
      </header>
      
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="not-found-button"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound; 