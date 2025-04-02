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
    dailyActiveUsers: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Track page view
        trackFeatureView('admin_analytics');
        
        // In a real implementation, you would fetch this data from Firebase Analytics
        // For now, we'll use mock data
        setAnalyticsData({
          userEngagement: [65, 75, 70, 80, 85, 90, 95],
          featureUsage: {
            'Budget Tool': 45,
            'Financial Quiz': 30,
            'Asset Market': 25,
            'Stock Simulator': 35,
            'Learning Resources': 20
          },
          errorRates: [5, 4, 6, 3, 2, 4, 3],
          dailyActiveUsers: [120, 132, 145, 162, 158, 175, 180]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        trackError('ANALYTICS_ERROR', error.message, 'AdminAnalytics');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [trackFeatureView, trackError]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  const userEngagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'User Engagement',
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
        label: 'Feature Usage',
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
        label: 'Error Rates',
        data: analyticsData.errorRates,
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        tension: 0.4
      }
    ]
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
              <h3>Total Users</h3>
              <p className="adminanalytics-card-value">{analyticsData.dailyActiveUsers[6]}</p>
              <span className="adminanalytics-card-trend positive">+12% this week</span>
            </div>
          </div>
          <div className="adminanalytics-card">
            <FaClock className="adminanalytics-card-icon" />
            <div className="adminanalytics-card-content">
              <h3>Avg. Session Time</h3>
              <p className="adminanalytics-card-value">12m 30s</p>
              <span className="adminanalytics-card-trend positive">+5% this week</span>
            </div>
          </div>
          <div className="adminanalytics-card">
            <FaExclamationTriangle className="adminanalytics-card-icon" />
            <div className="adminanalytics-card-content">
              <h3>Error Rate</h3>
              <p className="adminanalytics-card-value">{analyticsData.errorRates[6]}%</p>
              <span className="adminanalytics-card-trend negative">+1% this week</span>
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