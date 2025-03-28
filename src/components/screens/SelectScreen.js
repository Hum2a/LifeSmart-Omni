import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SelectScreen.css';

// Configuration object for tool availability
const TOOL_CONFIG = {
  budgetTool: {
    enabled: true,
    path: '/budget-tool',
    icon: '💰',
    text: 'Budget Tool'
  },
  financialQuiz: {
    enabled: true,
    path: '/quiz',
    icon: '📝',
    text: 'Financial Quiz'
  },
  simulation: {
    enabled: true,
    path: '/simulation',
    icon: '🎮',
    text: 'Simulation'
  },
  investmentCalculator: {
    enabled: false,
    path: '/calculator',
    icon: '🧮',
    text: 'Investment Calculator'
  }
};

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
            {Object.entries(TOOL_CONFIG).map(([key, config]) => (
              config.enabled ? (
                <button 
                  key={key}
                  onClick={() => handleNavigation(config.path)} 
                  className="selectscreen-tool-button"
                >
                  <span className="selectscreen-tool-icon">{config.icon}</span>
                  <span className="selectscreen-tool-text">{config.text}</span>
                </button>
              ) : (
                <div key={key} className="selectscreen-tool-button selectscreen-disabled">
                  <div className="selectscreen-coming-soon">Coming Soon</div>
                  <span className="selectscreen-tool-icon">{config.icon}</span>
                  <span className="selectscreen-tool-text">{config.text}</span>
                </div>
              )
            ))}
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