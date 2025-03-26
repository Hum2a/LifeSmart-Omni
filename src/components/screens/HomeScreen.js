import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';
import { FaGoogle, FaApple } from 'react-icons/fa';
import '../styles/HomeScreen.css';
import Modal from '../common/Modal';

const HomeScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  
  const navigate = useNavigate();
  const { signIn, register, signInWithGoogle, signInWithApple } = useAuth();

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
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignInMode && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      if (isSignInMode) {
        const user = await signIn(email, password);
        console.log("Signed in user:", user);
        setModalConfig({
          title: 'Welcome Back!',
          message: 'You have successfully signed in.',
          type: 'success'
        });
        setModalOpen(true);
        setTimeout(() => {
          navigate('/select');
        }, 1500);
      } else {
        const user = await register(email, password);
        console.log("Registered user:", user);
        setModalConfig({
          title: 'Welcome to LifeSmart!',
          message: 'Your account has been successfully created.',
          type: 'success'
        });
        setModalOpen(true);
        setTimeout(() => {
          navigate('/select');
        }, 1500);
      }
      closeForm();
    } catch (error) {
      console.error("Authentication error:", error.message);
      setModalConfig({
        title: 'Authentication Error',
        message: error.message,
        type: 'error'
      });
      setModalOpen(true);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      let user;
      if (provider === 'google') {
        user = await signInWithGoogle();
      } else if (provider === 'apple') {
        user = await signInWithApple();
      }
      
      console.log(`${provider} signed in user:`, user);
      setModalConfig({
        title: 'Welcome!',
        message: `You have successfully signed in with ${provider}.`,
        type: 'success'
      });
      setModalOpen(true);
      setTimeout(() => {
        navigate('/select');
      }, 1500);
    } catch (error) {
      console.error(`${provider} sign-in error:`, error.message);
      setModalConfig({
        title: 'Authentication Error',
        message: error.message,
        type: 'error'
      });
      setModalOpen(true);
    }
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
              
              <div className="homescreen-social-buttons">
                <button 
                  onClick={() => handleSocialSignIn('google')} 
                  className="homescreen-social-button homescreen-google-button"
                >
                  <FaGoogle className="homescreen-social-icon" />
                  <span>Continue with Google</span>
                </button>
                
                <button 
                  onClick={() => handleSocialSignIn('apple')} 
                  className="homescreen-social-button homescreen-apple-button"
                >
                  <FaApple className="homescreen-social-icon" />
                  <span>Continue with Apple</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="homescreen-form-container">
              <form onSubmit={handleFormSubmit} className="homescreen-modern-form">
                <h2 className="homescreen-form-title">{isSignInMode ? 'Welcome Back' : 'Join Us'}</h2>
                
                <div className="homescreen-social-buttons">
                  <button 
                    type="button"
                    onClick={() => handleSocialSignIn('google')} 
                    className="homescreen-social-button homescreen-google-button"
                  >
                    <FaGoogle className="homescreen-social-icon" />
                    <span>Continue with Google</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => handleSocialSignIn('apple')} 
                    className="homescreen-social-button homescreen-apple-button"
                  >
                    <FaApple className="homescreen-social-icon" />
                    <span>Continue with Apple</span>
                  </button>
                </div>

                <div className="homescreen-divider">
                  <span>or</span>
                </div>

                <div className="homescreen-input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="homescreen-modern-input"
                  />
                </div>
                <div className="homescreen-input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="homescreen-modern-input"
                  />
                </div>
                {!isSignInMode && (
                  <div className="homescreen-input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="homescreen-modern-input"
                    />
                  </div>
                )}
                <div className="homescreen-form-actions">
                  <button type="submit" className="homescreen-modern-button homescreen-submit-button">
                    {isSignInMode ? 'Sign In' : 'Create Account'}
                  </button>
                  <button type="button" onClick={closeForm} className="homescreen-modern-button homescreen-cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
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