import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaLock, 
  FaEnvelope, 
  FaPhone, 
  FaBell,
  FaArrowLeft,
  FaSave,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { firebaseAuth, db } from '../../firebase/initFirebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import '../styles/ProfileScreen.css';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        // Initialize default data from Firebase Auth
        const defaultData = {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          notifications: {
            email: true,
            push: true,
            sms: false
          }
        };

        // If Firestore document exists, merge with Firebase Auth data
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          setFormData(prev => ({
            ...prev,
            ...defaultData,
            ...firestoreData,
            notifications: {
              ...defaultData.notifications,
              ...(firestoreData.notifications || {})
            }
          }));
        } else {
          // If no Firestore document exists, create one with default data
          await updateDoc(doc(db, 'users', user.uid), defaultData);
          setFormData(prev => ({
            ...prev,
            ...defaultData
          }));
        }
      } catch (err) {
        setError('Error loading profile data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      // Update user profile in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        phone: formData.phone,
        notifications: formData.notifications
      });

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Error updating profile');
      console.error('Error updating profile:', err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      // Reauthenticate user before password change
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, formData.newPassword);

      setSuccess('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError('Error changing password. Please check your current password.');
      console.error('Error changing password:', err);
    }
  };

  if (loading) {
    return (
      <div className="profilescreen-container">
        <div className="profilescreen-content">
          <div className="profilescreen-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profilescreen-container">
      <div className="profilescreen-content">
        <header className="profilescreen-header">
          <button 
            className="profilescreen-back-button"
            onClick={() => navigate('/')}
          >
            <FaArrowLeft /> Back to Home
          </button>
          <h1 className="profilescreen-title">Profile Settings</h1>
          <div className="profilescreen-avatar">
            <FaUserCircle size={80} />
          </div>
        </header>

        {error && (
          <div className="profilescreen-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profilescreen-success">
            {success}
          </div>
        )}

        <div className="profilescreen-sections">
          {/* Personal Information Section */}
          <section className="profilescreen-section">
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit} className="profilescreen-form">
              <div className="profilescreen-form-group">
                <label>
                  <FaUserCircle className="profilescreen-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="profilescreen-input"
                />
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaEnvelope className="profilescreen-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="profilescreen-input profilescreen-input-disabled"
                />
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaPhone className="profilescreen-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="profilescreen-input"
                />
              </div>

              <button type="submit" className="profilescreen-save-button">
                <FaSave /> Save Changes
              </button>
            </form>
          </section>

          {/* Password Change Section */}
          <section className="profilescreen-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange} className="profilescreen-form">
              <div className="profilescreen-form-group">
                <label>
                  <FaLock className="profilescreen-icon" />
                  Current Password
                </label>
                <div className="profilescreen-password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="profilescreen-input"
                  />
                  <button
                    type="button"
                    className="profilescreen-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaLock className="profilescreen-icon" />
                  New Password
                </label>
                <div className="profilescreen-password-input">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="profilescreen-input"
                  />
                  <button
                    type="button"
                    className="profilescreen-password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaLock className="profilescreen-icon" />
                  Confirm New Password
                </label>
                <div className="profilescreen-password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="profilescreen-input"
                  />
                  <button
                    type="button"
                    className="profilescreen-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="profilescreen-save-button">
                <FaLock /> Change Password
              </button>
            </form>
          </section>

          {/* Notification Preferences Section */}
          <section className="profilescreen-section">
            <h2>Notification Preferences</h2>
            <div className="profilescreen-notifications">
              <div className="profilescreen-notification-item">
                <label className="profilescreen-checkbox-label">
                  <input
                    type="checkbox"
                    name="email"
                    checked={formData.notifications.email}
                    onChange={handleInputChange}
                    className="profilescreen-checkbox"
                  />
                  <span>Email Notifications</span>
                </label>
              </div>

              <div className="profilescreen-notification-item">
                <label className="profilescreen-checkbox-label">
                  <input
                    type="checkbox"
                    name="push"
                    checked={formData.notifications.push}
                    onChange={handleInputChange}
                    className="profilescreen-checkbox"
                  />
                  <span>Push Notifications</span>
                </label>
              </div>

              <div className="profilescreen-notification-item">
                <label className="profilescreen-checkbox-label">
                  <input
                    type="checkbox"
                    name="sms"
                    checked={formData.notifications.sms}
                    onChange={handleInputChange}
                    className="profilescreen-checkbox"
                  />
                  <span>SMS Notifications</span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
