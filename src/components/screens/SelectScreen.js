import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SelectScreen.css';

const SelectScreen = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="selectscreen-select-screen">
      <div className="selectscreen-animated-background">
        <div className="selectscreen-shape selectscreen-shape1"></div>
        <div className="selectscreen-shape selectscreen-shape2"></div>
        <div className="selectscreen-shape selectscreen-shape3"></div>
      </div>
      
      <div className="selectscreen-content-container">
        <header className="selectscreen-select-header">
          <h1 className="selectscreen-select-title">
            <span className="selectscreen-title-life">Life</span>
            <span className="selectscreen-title-smart">Smart</span>
          </h1>
          <p className="selectscreen-tagline">Choose your financial journey</p>
        </header>

        <main className="selectscreen-select-main">
          <div className="selectscreen-tools-grid">
            <button 
              onClick={() => handleNavigation('/budget-tool')} 
              className="selectscreen-tool-button selectscreen-budget-tool"
            >
              <span className="selectscreen-tool-icon">💰</span>
              <span className="selectscreen-tool-text">Budget Tool</span>
            </button>

            <button 
              onClick={() => handleNavigation('/quiz')} 
              className="selectscreen-tool-button selectscreen-quiz"
            >
              <span className="selectscreen-tool-icon">📝</span>
              <span className="selectscreen-tool-text">Financial Quiz</span>
            </button>

            <button 
              onClick={() => handleNavigation('/simulation')} 
              className="selectscreen-tool-button selectscreen-simulation"
            >
              <span className="selectscreen-tool-icon">🎮</span>
              <span className="selectscreen-tool-text">Simulation</span>
            </button>

            <button 
              onClick={() => handleNavigation('/calculator')} 
              className="selectscreen-tool-button selectscreen-calculator"
            >
              <span className="selectscreen-tool-icon">🧮</span>
              <span className="selectscreen-tool-text">Investment Calculator</span>
            </button>
          </div>
        </main>

        <footer className="selectscreen-select-footer">
          <p className="selectscreen-copyright">© 2024 Life Smart. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default SelectScreen; 