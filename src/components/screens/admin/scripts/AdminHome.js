import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/initFirebase';
import { 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaDatabase,
  FaUserShield,
  FaArrowLeft,
  FaKey
} from 'react-icons/fa';
import '../styles/AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (authLoading) return;

        if (!currentUser) {
          trackError('AUTH_ERROR', 'No user found', 'AdminHome');
          navigate('/', { replace: true });
          return;
        }

        const userDoc = await getDoc(doc(db, currentUser.uid, "Profile"));
        if (!userDoc.exists() || !userDoc.data().admin) {
          trackError('AUTH_ERROR', 'Unauthorized access attempt', 'AdminHome');
          console.log("Unauthorized access attempt to admin panel");
          navigate('/', { replace: true });
          return;
        }

        setIsAdmin(true);
        setLoading(false);
        trackFeatureView('admin_panel');
      } catch (error) {
        console.error("Error checking admin status:", error);
        trackError('ADMIN_ERROR', error.message, 'AdminHome');
        navigate('/', { replace: true });
      }
    };

    checkAdminStatus();
  }, [currentUser, authLoading, navigate, trackFeatureView, trackError]);

  const handleFeatureClick = (feature) => {
    trackAdminAction('navigate', { destination: feature.path });
    navigate(feature.path);
  };

  const handleBackClick = () => {
    trackAdminAction('exit_admin_panel');
    navigate('/select');
  };

  const adminFeatures = [
    {
      title: 'User Management',
      icon: <FaUsers size={24} />,
      path: '/admin/users',
      description: 'Manage user accounts and permissions',
      inDevelopment: false
    },
    {
      title: 'Analytics',
      icon: <FaChartLine size={24} />,
      path: '/admin/analytics',
      description: 'View platform usage statistics and metrics',
      inDevelopment: true
    },
    {
      title: 'System Settings',
      icon: <FaCog size={24} />,
      path: '/admin/system-settings',
      description: 'Configure system-wide settings and parameters',
      inDevelopment: true
    },
    {
      title: 'Database Management',
      icon: <FaDatabase size={24} />,
      path: '/admin/database',
      description: 'Manage database operations and backups',
      inDevelopment: true
    },
    {
      title: 'Login Codes',
      icon: <FaKey size={24} />,
      path: '/admin/login-codes',
      description: 'Generate and manage login codes for users',
      inDevelopment: false
    },
  ];

  if (loading || authLoading) {
    return (
      <div className="adminhome-loading">
        <div className="adminhome-loading-spinner"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="adminhome-container">
      <header className="adminhome-header">
        <button 
          onClick={handleBackClick}
          className="adminhome-back-button"
        >
          <FaArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <div className="adminhome-header-content">
          <h1 className="adminhome-title">
            <FaUserShield className="adminhome-title-icon" />
            Admin Control Panel
          </h1>
          <p className="adminhome-subtitle">Manage and monitor your platform</p>
        </div>
      </header>

      <main className="adminhome-main">
        <div className="adminhome-features-grid">
          {adminFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => !feature.inDevelopment && handleFeatureClick(feature)}
              className={`adminhome-feature-card ${feature.inDevelopment ? 'in-development' : ''}`}
            >
              {feature.inDevelopment && (
                <div className="adminhome-development-banner">
                  In Development
                </div>
              )}
              <div className="adminhome-feature-icon">
                {feature.icon}
              </div>
              <h2 className="adminhome-feature-title">{feature.title}</h2>
              <p className="adminhome-feature-description">{feature.description}</p>
            </button>
          ))}
        </div>
      </main>

      <footer className="adminhome-footer">
        <p>Admin Panel v1.0 • {new Date().getFullYear()} Life Smart</p>
      </footer>
    </div>
  );
};

export default AdminHome; 