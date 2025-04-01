import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';
import { 
  FaWallet, 
  FaClipboardList, 
  FaChartLine, 
  FaCalculator,
  FaUserCircle,
  FaCog,
  FaStar,
  FaStackExchange,
  FaBook,
  FaSignOutAlt
} from 'react-icons/fa';
import '../styles/SelectScreen.css';
import Modal from '../common/Modal';

// Configuration object for tool availability
const TOOL_CONFIG = {
  budgetTool: {
    enabled: true,
    path: '/budget-tool',
    icon: <FaWallet size={40} color="#4CAF50" />,
    text: 'Budget Tool'
  },
  financialQuiz: {
    enabled: true,
    path: '/quiz',
    icon: <FaClipboardList size={40} color="#2196F3" />,
    text: 'Financial Quiz'
  },
  assetMarketSimulation: {
    enabled: true,
    path: '/simulation',
    icon: <FaChartLine size={40} color="#FF9800" />,
    text: 'Asset Market Simulation'
  },
  stockMarketSimulator: {
    enabled: true,
    path: '/stock-market-simulator',
    icon: <FaStackExchange size={40} color="#E91E63" />,
    text: 'Stock Market Simulator'
  },
  learningResources: {
    enabled: true,
    path: '/financial-literacy',
    icon: <FaBook size={40} color="#9C27B0" />,
    text: 'Learning Resources'
  },
  investmentCalculator: {
    enabled: true,
    path: '/investment-calculator',
    icon: <FaCalculator size={40} color="#9C27B0" />,
    text: 'Investment Calculator'
  }
};

const SelectScreen = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      setShowLogoutModal(true);
      await logout();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
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

            <div className="selectscreen-user-actions">
              <button 
                onClick={() => handleNavigation('/profile')} 
                className="selectscreen-user-button selectscreen-profile-button"
              >
                <FaUserCircle size={24} />
                <span>Profile</span>
              </button>
              <button 
                onClick={() => handleNavigation('/settings')} 
                className="selectscreen-user-button selectscreen-settings-button"
              >
                <FaCog size={24} />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleLogout} 
                className="selectscreen-user-button selectscreen-logout-button"
              >
                <FaSignOutAlt size={24} />
                <span>Logout</span>
              </button>
            </div>
          </main>

          <footer className="selectscreen-select-footer">
            <p className="selectscreen-copyright">© 2024 Life Smart. All rights reserved.</p>
          </footer>
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Successfully Logged Out"
        message="Thank you for using LifeSmart. You have been successfully logged out."
        type="success"
      />
    </>
  );
};

export default SelectScreen; 