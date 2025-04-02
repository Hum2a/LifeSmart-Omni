import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';
import Login from './auth/Login';
import Register from './auth/Register';
import '../styles/HomeScreen.css';
import Modal from '../common/Modal';

const HomeScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Check for existing authentication and redirect if found
  useEffect(() => {
    if (currentUser) {
      setModalConfig({
        title: 'Welcome Back!',
        message: 'You have been automatically logged in.',
        type: 'success'
      });
      setModalOpen(true);
      setTimeout(() => {
        navigate('/select');
      }, 2000);
    }
  }, [currentUser, navigate]);

  const showSignInForm = () => {
    setIsSignInMode(true);
    setShowForm(true);
  };

  const showRegisterForm = () => {
    setIsSignInMode(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div className="homescreen-modern-auth-screen">
      <div className="homescreen-animated-background">
        <div className="homescreen-shape homescreen-shape1"></div>
        <div className="homescreen-shape homescreen-shape2"></div>
        <div className="homescreen-shape homescreen-shape3"></div>
      </div>
      
      <div className="homescreen-content-container">
        {/* Header */}
        <header className="homescreen-modern-header">
          <h1 className="homescreen-modern-title">
            <span className="homescreen-title-life">Life</span>
            <span className="homescreen-title-smart">Smart</span>
          </h1>
          <p className="homescreen-tagline">Your journey to financial wisdom begins here</p>
        </header>

        {/* Main Content */}
        <main className="homescreen-modern-main">
          {!showForm ? (
            <div className="homescreen-modern-buttons">
              <button onClick={showSignInForm} className="homescreen-modern-button homescreen-sign-in-button">
                <span className="homescreen-button-text">Sign In</span>
                <span className="homescreen-button-icon">→</span>
              </button>
              <button onClick={showRegisterForm} className="homescreen-modern-button homescreen-register-button">
                <span className="homescreen-button-text">Register</span>
                <span className="homescreen-button-icon">+</span>
              </button>
            </div>
          ) : (
            isSignInMode ? (
              <Login onClose={closeForm} />
            ) : (
              <Register onClose={closeForm} />
            )
          )}
        </main>

        {/* Footer */}
        <footer className="homescreen-modern-footer">
          <p className="homescreen-copyright">© 2024 Life Smart. All rights reserved.</p>
        </footer>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default HomeScreen; 