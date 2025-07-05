import React, { useState, useEffect } from 'react';
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
  FaSignOutAlt,
  FaFire,
  FaGraduationCap,
  FaBalanceScale,
  FaAndroid,
  FaMoneyBillWave
} from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/initFirebase';
import '../styles/SelectScreen.css';
import Modal from '../widgets/modals/Modal';

// Configuration object for tool availability
const TOOL_CONFIG = {
  budgetTool: {
    enabled: true,
    in_development: false,
    path: '/budget-tool',
    icon: <FaWallet size={40} color="#4CAF50" />,
    text: 'Budget Tool'
  },
  adultQuiz: {
    enabled: true,
    in_development: false,
    path: '/adult-quiz',
    icon: <FaGraduationCap size={40} color="#673AB7" />,
    text: 'Adult Quiz'
  },
  lifeBalance: {
    enabled: true,
    in_development: true,
    path: '/life-balance',
    icon: <FaBalanceScale size={40} color="#FF5722" />,
    text: 'Life Balance'
  },
  financeQuest: {
    enabled: true,
    in_development: false,
    path: '/finance-quest',
    icon: <FaMoneyBillWave size={40} color="#000000" />,
    text: 'Finance Quest'
  },
  financialQuiz: {
    enabled: false,
    in_development: false,
    path: '/quiz',
    icon: <FaClipboardList size={40} color="#2196F3" />,
    text: 'School Simulation'
  },
  assetMarketSimulation: {
    enabled: false,
    in_development: false,
    path: '/simulation',
    icon: <FaChartLine size={40} color="#FF9800" />,
    text: 'Asset Market Simulation'
  },
  stockMarketSimulator: {
    enabled: false,
    in_development: true,
    path: '/stock-market-simulator',
    icon: <FaStackExchange size={40} color="#E91E63" />,
    text: 'Stock Market Simulator'
  },
  learningResources: {
    enabled: false,
    in_development: false,
    path: '/financial-literacy',
    icon: <FaBook size={40} color="#9C27B0" />,
    text: 'Learning Resources'
  },
  investmentCalculator: {
    enabled: false,
    in_development: false,
    path: '/investment-calculator',
    icon: <FaCalculator size={40} color="#9C27B0" />,
    text: 'Investment Calculator'
  }
};

const SelectScreen = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth state:", { currentUser, authLoading });
        
        // Don't do anything while auth is loading
        if (authLoading) {
          return;
        }

        // If auth is done loading and no user, redirect
        if (!currentUser) {
          console.log("No authenticated user found after auth initialized, redirecting to home");
          navigate('/', { replace: true });
          return;
        }
        
        // Check if user is admin
        const userDoc = await getDoc(doc(db, currentUser.uid, "Profile"));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().admin === true);
        }
        
        // Only fetch streak if we have a user
        console.log("Fetching streak data for user:", currentUser.uid);
        const streakDoc = await getDoc(doc(db, currentUser.uid, "Login Streak"));
        if (streakDoc.exists()) {
          setStreak(streakDoc.data().streak || 0);
        }
      } catch (error) {
        console.error("Error in auth check:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [currentUser, authLoading, navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      setShowLogoutModal(true);
      await logout();
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading spinner while either auth is initializing or we're loading data
  if (authLoading || loading) {
    return (
      <div className="selectscreen-loading">
        <div className="selectscreen-loading-spinner"></div>
      </div>
    );
  }

  // Only render the main content if we have a user and auth is done loading
  if (!currentUser && !authLoading) {
    return null;
  }

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
            <div className="selectscreen-streak-display">
              <FaFire className="selectscreen-streak-icon" />
              <span className="selectscreen-streak-count">{streak} Day{streak !== 1 ? 's' : ''}</span>
            </div>
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
                    {config.in_development && (
                      <div className="selectscreen-in-development">In Development</div>
                    )}
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
              {isAdmin && (
                <button 
                  onClick={() => handleNavigation('/admin')} 
                  className="selectscreen-user-button selectscreen-admin-button"
                >
                  <FaCog size={24} />
                  <span>Admin Controls</span>
                </button>
              )}
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