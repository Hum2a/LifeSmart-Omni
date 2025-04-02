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
  FaEyeSlash,
  FaSchool,
  FaUserTag,
  FaPoundSign,
  FaFire
} from 'react-icons/fa';
import { firebaseAuth, db } from '../../../firebase/initFirebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import '../../styles/ProfileScreen.css';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    class: '',
    school: '',
    groupCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    totalFunds: 0,
    loginStreak: 0
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
        const userDoc = await getDoc(doc(db, user.userUID || user.uid, "Profile"));
        const fundsDoc = await getDoc(doc(db, user.userUID || user.uid, "Total Funds"));
        const streakDoc = await getDoc(doc(db, user.userUID || user.uid, "Login Streak"));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            class: userData.class || userData.Y12 || '',
            school: userData.school || userData.WCGS || '',
            groupCode: userData.groupCode || userData.DEVELOPER || '',
          }));
        }

        if (fundsDoc.exists()) {
          setFormData(prev => ({
            ...prev,
            totalFunds: fundsDoc.data().totalFunds || 0
          }));
        }

        if (streakDoc.exists()) {
          setFormData(prev => ({
            ...prev,
            loginStreak: streakDoc.data().streak || 0
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      await updateDoc(doc(db, user.userUID || user.uid, "Profile"), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        class: formData.class,
        school: formData.school,
        groupCode: formData.groupCode,
        email: formData.email,
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
            onClick={() => navigate('/select')}
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
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="profilescreen-input"
                />
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaUserCircle className="profilescreen-icon" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
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
                  <FaSchool className="profilescreen-icon" />
                  School
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="profilescreen-input"
                />
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaUserTag className="profilescreen-icon" />
                  Class
                </label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="profilescreen-input"
                />
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaUserTag className="profilescreen-icon" />
                  Group Code
                </label>
                <input
                  type="text"
                  name="groupCode"
                  value={formData.groupCode}
                  onChange={handleInputChange}
                  className="profilescreen-input"
                />
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaPoundSign className="profilescreen-icon" />
                  Total Funds
                </label>
                <input
                  type="text"
                  value={`£${formData.totalFunds.toLocaleString()}`}
                  disabled
                  className="profilescreen-input profilescreen-input-disabled"
                />
              </div>

              <div className="profilescreen-form-group">
                <label>
                  <FaFire className="profilescreen-icon" />
                  Login Streak
                </label>
                <input
                  type="text"
                  value={`${formData.loginStreak} days`}
                  disabled
                  className="profilescreen-input profilescreen-input-disabled"
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
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
