import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../firebase/auth';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/initFirebase';
import Modal from '../../common/Modal';
import '../../styles/HomeScreen.css';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  const [modalOpen, setModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();

  const updateLoginStreak = async (userId) => {
    try {
      const streakRef = doc(db, userId, "Login Streak");
      const streakDoc = await getDoc(streakRef);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day
      
      const currentDate = today.toISOString().split('T')[0];
      
      if (streakDoc.exists()) {
        const { lastLogin, streak } = streakDoc.data();
        const lastLoginDate = new Date(lastLogin);
        lastLoginDate.setHours(0, 0, 0, 0);
        
        const timeDiff = today.getTime() - lastLoginDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        let newStreak;
        
        // Only increment streak if last login was exactly yesterday
        if (daysDiff === 1) {
          newStreak = streak + 1;
        } else {
          // Reset streak for same-day logins or gaps larger than 1 day
          newStreak = 1;
        }
        
        // Always update lastLogin to current date
        await setDoc(streakRef, {
          lastLogin: currentDate,  // This will be updated every login
          streak: newStreak
        });
      } else {
        // First time login, start streak at 1
        await setDoc(streakRef, {
          lastLogin: currentDate,
          streak: 1
        });
      }
    } catch (error) {
      console.error("Error updating login streak:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signIn(email, password);
      console.log("Signed in user:", user);
      
      // Update login streak
      await updateLoginStreak(user.uid);
      
      setModalConfig({
        title: 'Welcome Back!',
        message: 'You have successfully signed in.',
        type: 'success'
      });
      setModalOpen(true);
      setTimeout(() => {
        navigate('/select');
      }, 2000);
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
      
      // Update login streak for social sign-in
      await updateLoginStreak(user.uid);
      
      console.log(`${provider} signed in user:`, user);
      setModalConfig({
        title: 'Welcome!',
        message: `You have successfully signed in with ${provider}.`,
        type: 'success'
      });
      setModalOpen(true);
      setTimeout(() => {
        navigate('/select');
      }, 2000);
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
    <>
      <div className="homescreen-form-container">
        <form onSubmit={handleSubmit} className="homescreen-modern-form">
          <h2 className="homescreen-form-title">Welcome Back</h2>
          
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
          <div className="homescreen-form-actions">
            <button type="submit" className="homescreen-modern-button homescreen-submit-button">
              Sign In
            </button>
            <button type="button" onClick={onClose} className="homescreen-modern-button homescreen-cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </>
  );
};

export default Login;
