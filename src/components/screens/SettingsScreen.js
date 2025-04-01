import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSave,
  FaPalette,
  FaGlobe,
  FaBell,
  FaDownload,
  FaToggleOn,
  FaToggleOff,
  FaCog
} from 'react-icons/fa';
import { firebaseAuth, db } from '../../firebase/initFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/SettingsScreen.css';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    currency: 'GBP',
    autoSave: true,
    downloadFormat: 'xlsx',
    budgetReminders: true,
    savingsAlerts: true,
    monthlyReports: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const settingsDoc = await getDoc(doc(db, user.uid, 'Settings'));
        
        if (settingsDoc.exists()) {
          setSettings(prev => ({
            ...prev,
            ...settingsDoc.data()
          }));
        } else {
          // If no settings exist, create default settings
          await setDoc(doc(db, user.uid, 'Settings'), settings);
        }
      } catch (err) {
        setError('Error loading settings');
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleChange = (name, value) => {
    setSettings(prev => ({
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

      await setDoc(doc(db, user.uid, 'Settings'), settings);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Error updating settings');
      console.error('Error updating settings:', err);
    }
  };

  if (loading) {
    return (
      <div className="settingsscreen-container">
        <div className="settingsscreen-content">
          <div className="settingsscreen-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settingsscreen-container">
      <div className="settingsscreen-content">
        <header className="settingsscreen-header">
          <button 
            className="settingsscreen-back-button"
            onClick={() => navigate('/select')}
          >
            <FaArrowLeft /> Back to Home
          </button>
          <h1 className="settingsscreen-title">Settings</h1>
          <div className="settingsscreen-icon">
            <FaCog size={80} />
          </div>
        </header>

        {error && (
          <div className="settingsscreen-error">
            {error}
          </div>
        )}

        {success && (
          <div className="settingsscreen-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="settingsscreen-form">
          <section className="settingsscreen-section">
            <h2><FaPalette /> Appearance</h2>
            <div className="settingsscreen-option">
              <label>Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="settingsscreen-select"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </section>

          <section className="settingsscreen-section">
            <h2><FaGlobe /> Regional</h2>
            <div className="settingsscreen-option">
              <label>Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="settingsscreen-select"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="settingsscreen-option">
              <label>Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="settingsscreen-select"
              >
                <option value="GBP">British Pound (£)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </section>

          <section className="settingsscreen-section">
            <h2><FaDownload /> Export Settings</h2>
            <div className="settingsscreen-option">
              <label>Auto-Save</label>
              <button
                type="button"
                className="settingsscreen-toggle"
                onClick={() => handleChange('autoSave', !settings.autoSave)}
              >
                {settings.autoSave ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
            </div>

            <div className="settingsscreen-option">
              <label>Download Format</label>
              <select
                value={settings.downloadFormat}
                onChange={(e) => handleChange('downloadFormat', e.target.value)}
                className="settingsscreen-select"
              >
                <option value="xlsx">Excel (XLSX)</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </section>

          <section className="settingsscreen-section">
            <h2><FaBell /> Notifications</h2>
            <div className="settingsscreen-option">
              <label>Budget Reminders</label>
              <button
                type="button"
                className="settingsscreen-toggle"
                onClick={() => handleChange('budgetReminders', !settings.budgetReminders)}
              >
                {settings.budgetReminders ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
            </div>

            <div className="settingsscreen-option">
              <label>Savings Alerts</label>
              <button
                type="button"
                className="settingsscreen-toggle"
                onClick={() => handleChange('savingsAlerts', !settings.savingsAlerts)}
              >
                {settings.savingsAlerts ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
            </div>

            <div className="settingsscreen-option">
              <label>Monthly Reports</label>
              <button
                type="button"
                className="settingsscreen-toggle"
                onClick={() => handleChange('monthlyReports', !settings.monthlyReports)}
              >
                {settings.monthlyReports ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
            </div>
          </section>

          <button type="submit" className="settingsscreen-save-button">
            <FaSave /> Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsScreen;
