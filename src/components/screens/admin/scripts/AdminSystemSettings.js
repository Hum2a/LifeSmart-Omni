import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { 
  FaCog, 
  FaArrowLeft,
  FaSchool,
  FaUserGraduate,
  FaLock,
  FaBell,
  FaChartLine,
  FaSave
} from 'react-icons/fa';
import '../styles/AdminSystemSettings.css';

const AdminSystemSettings = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    academic: {
      maxClassSize: 35,
      allowNewRegistrations: true,
      requireSchoolCode: true,
      defaultSchoolCode: 'LIFESMART2024',
      academicYear: '2023-2024',
      terms: ['Autumn', 'Spring', 'Summer'],
      currentTerm: 'Spring'
    },
    security: {
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60, // minutes
      passwordMinLength: 8,
      requireStrongPassword: true,
      twoFactorEnabled: false
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: false,
      notifyOnNewRegistration: true,
      notifyOnUserDelete: true,
      notifyOnFailedLogin: true,
      dailyReportTime: '06:00'
    },
    analytics: {
      trackUserBehavior: true,
      trackErrors: true,
      trackPerformance: true,
      retentionPeriod: 90, // days
      anonymizeData: true
    }
  });

  useEffect(() => {
    trackFeatureView('admin_system_settings');
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsRef = doc(db, 'SystemSettings', 'config');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...settingsSnap.data()
        }));
      } else {
        // If no settings exist, create them with defaults
        await setDoc(settingsRef, settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      trackError('LOAD_SETTINGS_ERROR', error.message, 'AdminSystemSettings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const settingsRef = doc(db, 'SystemSettings', 'config');
      await setDoc(settingsRef, settings);
      
      trackAdminAction('update_system_settings', {
        categories: Object.keys(settings)
      });
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      trackError('SAVE_SETTINGS_ERROR', error.message, 'AdminSystemSettings');
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="adminsettings-loading">
        <div className="adminsettings-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="adminsettings-container">
      <header className="adminsettings-header">
        <button 
          onClick={() => navigate('/admin')} 
          className="adminsettings-back-button"
        >
          <FaArrowLeft size={20} />
          <span>Back to Admin Panel</span>
        </button>
        <div className="adminsettings-header-content">
          <h1 className="adminsettings-title">
            <FaCog className="adminsettings-title-icon" />
            System Settings
          </h1>
          <p className="adminsettings-subtitle">Configure system-wide settings and preferences</p>
        </div>
      </header>

      <main className="adminsettings-main">
        <div className="adminsettings-section">
          <h2><FaSchool /> Academic Settings</h2>
          <div className="adminsettings-grid">
            <div className="adminsettings-field">
              <label>Maximum Class Size</label>
              <input
                type="number"
                value={settings.academic.maxClassSize}
                onChange={(e) => handleChange('academic', 'maxClassSize', parseInt(e.target.value))}
              />
            </div>
            <div className="adminsettings-field">
              <label>Academic Year</label>
              <input
                type="text"
                value={settings.academic.academicYear}
                onChange={(e) => handleChange('academic', 'academicYear', e.target.value)}
              />
            </div>
            <div className="adminsettings-field">
              <label>Current Term</label>
              <select
                value={settings.academic.currentTerm}
                onChange={(e) => handleChange('academic', 'currentTerm', e.target.value)}
              >
                {settings.academic.terms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.academic.allowNewRegistrations}
                  onChange={(e) => handleChange('academic', 'allowNewRegistrations', e.target.checked)}
                />
                Allow New Registrations
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.academic.requireSchoolCode}
                  onChange={(e) => handleChange('academic', 'requireSchoolCode', e.target.checked)}
                />
                Require School Code
              </label>
            </div>
            <div className="adminsettings-field">
              <label>Default School Code</label>
              <input
                type="text"
                value={settings.academic.defaultSchoolCode}
                onChange={(e) => handleChange('academic', 'defaultSchoolCode', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="adminsettings-section">
          <h2><FaLock /> Security Settings</h2>
          <div className="adminsettings-grid">
            <div className="adminsettings-field">
              <label>Maximum Login Attempts</label>
              <input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              />
            </div>
            <div className="adminsettings-field">
              <label>Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
              />
            </div>
            <div className="adminsettings-field">
              <label>Minimum Password Length</label>
              <input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
              />
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.security.requireEmailVerification}
                  onChange={(e) => handleChange('security', 'requireEmailVerification', e.target.checked)}
                />
                Require Email Verification
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.security.requireStrongPassword}
                  onChange={(e) => handleChange('security', 'requireStrongPassword', e.target.checked)}
                />
                Require Strong Password
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorEnabled}
                  onChange={(e) => handleChange('security', 'twoFactorEnabled', e.target.checked)}
                />
                Enable Two-Factor Authentication
              </label>
            </div>
          </div>
        </div>

        <div className="adminsettings-section">
          <h2><FaBell /> Notification Settings</h2>
          <div className="adminsettings-grid">
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.enableEmailNotifications}
                  onChange={(e) => handleChange('notifications', 'enableEmailNotifications', e.target.checked)}
                />
                Enable Email Notifications
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.enablePushNotifications}
                  onChange={(e) => handleChange('notifications', 'enablePushNotifications', e.target.checked)}
                />
                Enable Push Notifications
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.notifyOnNewRegistration}
                  onChange={(e) => handleChange('notifications', 'notifyOnNewRegistration', e.target.checked)}
                />
                Notify on New Registration
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.notifyOnUserDelete}
                  onChange={(e) => handleChange('notifications', 'notifyOnUserDelete', e.target.checked)}
                />
                Notify on User Deletion
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.notifications.notifyOnFailedLogin}
                  onChange={(e) => handleChange('notifications', 'notifyOnFailedLogin', e.target.checked)}
                />
                Notify on Failed Login Attempts
              </label>
            </div>
            <div className="adminsettings-field">
              <label>Daily Report Time</label>
              <input
                type="time"
                value={settings.notifications.dailyReportTime}
                onChange={(e) => handleChange('notifications', 'dailyReportTime', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="adminsettings-section">
          <h2><FaChartLine /> Analytics Settings</h2>
          <div className="adminsettings-grid">
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.analytics.trackUserBehavior}
                  onChange={(e) => handleChange('analytics', 'trackUserBehavior', e.target.checked)}
                />
                Track User Behavior
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.analytics.trackErrors}
                  onChange={(e) => handleChange('analytics', 'trackErrors', e.target.checked)}
                />
                Track Errors
              </label>
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.analytics.trackPerformance}
                  onChange={(e) => handleChange('analytics', 'trackPerformance', e.target.checked)}
                />
                Track Performance
              </label>
            </div>
            <div className="adminsettings-field">
              <label>Data Retention Period (days)</label>
              <input
                type="number"
                value={settings.analytics.retentionPeriod}
                onChange={(e) => handleChange('analytics', 'retentionPeriod', parseInt(e.target.value))}
              />
            </div>
            <div className="adminsettings-field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.analytics.anonymizeData}
                  onChange={(e) => handleChange('analytics', 'anonymizeData', e.target.checked)}
                />
                Anonymize Analytics Data
              </label>
            </div>
          </div>
        </div>

        <div className="adminsettings-actions">
          <button 
            className="adminsettings-save-button" 
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminSystemSettings; 