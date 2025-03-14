import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';
import '../styles/HomeScreen.css';

const HomeScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();
  const { signIn, register } = useAuth();

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
        // Handle Sign-In
        const user = await signIn(email, password);
        console.log("Signed in user:", user);
        alert("Sign-In successful!");
        navigate('/quiz-landing');
      } else {
        // Handle Register
        const user = await register(email, password);
        console.log("Registered user:", user);
        alert("Registration successful!");
        navigate('/quiz-landing');
      }
      closeForm();
    } catch (error) {
      console.error("Authentication error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="modern-auth-screen">
      <div className="animated-background">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
      
      <div className="content-container">
        {/* Header */}
        <header className="modern-header">
          <h1 className="modern-title">
            <span className="title-life">Life</span>
            <span className="title-smart">Smart</span>
          </h1>
          <p className="tagline">Your journey to financial wisdom begins here</p>
        </header>

        {/* Main Content */}
        <main className="modern-main">
          {!showForm ? (
            <div className="modern-buttons">
              <button onClick={showSignInForm} className="modern-button sign-in-button">
                <span className="button-text">Sign In</span>
                <span className="button-icon">→</span>
              </button>
              <button onClick={showRegisterForm} className="modern-button register-button">
                <span className="button-text">Register</span>
                <span className="button-icon">+</span>
              </button>
            </div>
          ) : (
            <div className="form-container">
              <form onSubmit={handleFormSubmit} className="modern-form">
                <h2 className="form-title">{isSignInMode ? 'Welcome Back' : 'Join Us'}</h2>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="modern-input"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="modern-input"
                  />
                </div>
                {!isSignInMode && (
                  <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="modern-input"
                    />
                  </div>
                )}
                <div className="form-actions">
                  <button type="submit" className="modern-button submit-button">
                    {isSignInMode ? 'Sign In' : 'Create Account'}
                  </button>
                  <button type="button" onClick={closeForm} className="modern-button cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="modern-footer">
          <p className="copyright">© 2024 Life Smart. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomeScreen; 