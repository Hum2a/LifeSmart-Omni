import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { analytics } from '../../../../firebase/initFirebase';
import { 
  FaChartLine, 
  FaUsers, 
  FaExclamationTriangle,
  FaClock,
  FaArrowLeft
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties
} from 'firebase/analytics';
import '../styles/AdminAnalytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { trackFeatureView, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    userEngagement: [],
    featureUsage: {},
    errorRates: [],
    dailyActiveUsers: [],
    sessionTimes: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        trackFeatureView('admin_analytics');
        
        // Get Analytics instance
        const analyticsInstance = getAnalytics();
        
        // Enable analytics collection
        await setAnalyticsCollectionEnabled(analyticsInstance, true);
        
        // Set admin user properties
        if (currentUser) {
          setUserId(analyticsInstance, currentUser.uid);
          setUserProperties(analyticsInstance, {
            user_role: 'admin',
            admin_section: 'analytics'
          });
        }
        
        // Log admin analytics view
        logEvent(analyticsInstance, 'admin_analytics_view', {
          timestamp: new Date().toISOString(),
          admin_id: currentUser?.uid
        });
        
        // For now, we'll use mock data since we can't directly query analytics data
        // In a real implementation, this would come from your backend API
        const mockData = {
          userEngagement: [120, 150, 180, 160, 200, 170, 190],
          featureUsage: {
            'Dashboard': 450,
            'Profile': 320,
            'Settings': 280,
            'Reports': 210,
            'Tools': 180
          },
          errorRates: [5, 3, 4, 2, 3, 4, 3],
          dailyActiveUsers: [150, 180, 200, 170, 220, 190, 210],
          sessionTimes: 25 // Average session time in minutes
        };
        
        setAnalyticsData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        trackError('ANALYTICS_ERROR', error.message, 'AdminAnalytics');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [trackFeatureView, trackError, currentUser]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const userEngagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'User Interactions',
        data: analyticsData.userEngagement,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        tension: 0.4
      }
    ]
  };

  const featureUsageData = {
    labels: Object.keys(analyticsData.featureUsage),
    datasets: [
      {
        label: 'Feature Views',
        data: Object.values(analyticsData.featureUsage),
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(233, 30, 99, 0.7)',
          'rgba(156, 39, 176, 0.7)'
        ]
      }
    ]
  };

  const errorRatesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Errors',
        data: analyticsData.errorRates,
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        tension: 0.4
      }
    ]
  };

  const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    return ((last - first) / first) * 100;
  };

  if (loading) {
    return (
      <div className="adminanalytics-loading">
        <div className="adminanalytics-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="adminanalytics-container">
      <header className="adminanalytics-header">
        <button 
          onClick={() => navigate('/admin')} 
          className="adminanalytics-back-button"
        >
          <FaArrowLeft size={20} />
          <span>Back to Admin Panel</span>
        </button>
        <div className="adminanalytics-header-content">
          <h1 className="adminanalytics-title">
            <FaChartLine className="adminanalytics-title-icon" />
            Analytics Dashboard
          </h1>
          <p className="adminanalytics-subtitle">Monitor platform performance and user engagement</p>
        </div>
      </header>

      <main className="adminanalytics-main">
        {/* Summary Cards */}
        <div className="adminanalytics-summary">
          <div className="adminanalytics-card">
            <FaUsers className="adminanalytics-card-icon" />
            <div className="adminanalytics-card-content">
              <h3>Daily Active Users</h3>
              <p className="adminanalytics-card-value">{analyticsData.dailyActiveUsers[6]}</p>
              <span className={`adminanalytics-card-trend ${calculateTrend(analyticsData.dailyActiveUsers) >= 0 ? 'positive' : 'negative'}`}>
                {calculateTrend(analyticsData.dailyActiveUsers) >= 0 ? '+' : ''}{calculateTrend(analyticsData.dailyActiveUsers).toFixed(1)}% this week
              </span>
            </div>
          </div>
          <div className="adminanalytics-card">
            <FaClock className="adminanalytics-card-icon" />
            <div className="adminanalytics-card-content">
              <h3>Avg. Session Time</h3>
              <p className="adminanalytics-card-value">{analyticsData.sessionTimes}m</p>
              <span className="adminanalytics-card-trend positive">Last 7 days</span>
            </div>
          </div>
          <div className="adminanalytics-card">
            <FaExclamationTriangle className="adminanalytics-card-icon" />
            <div className="adminanalytics-card-content">
              <h3>Error Rate</h3>
              <p className="adminanalytics-card-value">{analyticsData.errorRates[6]}</p>
              <span className={`adminanalytics-card-trend ${calculateTrend(analyticsData.errorRates) <= 0 ? 'positive' : 'negative'}`}>
                {calculateTrend(analyticsData.errorRates) >= 0 ? '+' : ''}{calculateTrend(analyticsData.errorRates).toFixed(1)}% this week
              </span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="adminanalytics-charts">
          <div className="adminanalytics-chart-container">
            <h2>User Engagement</h2>
            <div className="adminanalytics-chart">
              <Line options={chartOptions} data={userEngagementData} />
            </div>
          </div>
          
          <div className="adminanalytics-chart-container">
            <h2>Feature Usage</h2>
            <div className="adminanalytics-chart">
              <Doughnut options={chartOptions} data={featureUsageData} />
            </div>
          </div>
          
          <div className="adminanalytics-chart-container">
            <h2>Error Rates</h2>
            <div className="adminanalytics-chart">
              <Line options={chartOptions} data={errorRatesData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics; 