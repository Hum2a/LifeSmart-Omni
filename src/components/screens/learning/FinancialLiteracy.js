import React from 'react';
import { Link } from 'react-router-dom';
import './styles/FinancialLiteracy.css';

const FinancialLiteracy = () => {
  const courses = [
    {
      id: 'investing',
      title: 'Investing Course',
      description: 'Master the art of investing in the stock market. Learn about stocks, market analysis, and portfolio management to build your wealth.',
      duration: '2 hours',
      reward: '£500',
      image: '/images/investing-course.jpg',
      path: '/learning/investing-course',
      category: 'Investment',
      level: 'Beginner',
      lessons: '11 lessons'
    },
    // Add more courses here as they become available
  ];

  return (
    <div className="financial-literacy">
      <div className="financial-literacy-hero">
        <div className="financial-literacy-hero-content">
          <h1>Financial Literacy Learning Platform</h1>
          <p>Transform your financial future with expert-led courses and earn rewards while you learn</p>
          <div className="financial-literacy-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Learners</span>
            </div>
            <div className="stat">
              <span className="stat-number">£1000+</span>
              <span className="stat-label">Rewards Earned</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="financial-literacy-courses">
        <div className="financial-literacy-courses-header">
          <h2>Available Courses</h2>
          <p>Choose a course to start your financial education journey</p>
        </div>
        <div className="financial-literacy-courses-grid">
          {courses.map(course => (
            <Link 
              key={course.id} 
              to={course.path} 
              className="financial-literacy-course-card"
            >
              <div className="financial-literacy-course-image">
                <img src={course.image} alt={course.title} />
                <div className="financial-literacy-course-overlay">
                  <span className="course-category">{course.category}</span>
                  <span className="course-level">{course.level}</span>
                </div>
              </div>
              <div className="financial-literacy-course-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="financial-literacy-course-meta">
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{course.duration}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-book"></i>
                    <span>{course.lessons}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-gift"></i>
                    <span>{course.reward}</span>
                  </div>
                </div>
                <button className="financial-literacy-course-button">
                  Start Learning
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="financial-literacy-info">
        <div className="financial-literacy-info-content">
          <h2>Why Learn Financial Literacy?</h2>
          <div className="financial-literacy-benefits">
            <div className="financial-literacy-benefit">
              <div className="benefit-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Build Wealth</h3>
              <p>Learn how to make informed investment decisions and grow your wealth over time.</p>
            </div>
            <div className="financial-literacy-benefit">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Manage Risk</h3>
              <p>Understand how to protect your investments and manage financial risks effectively.</p>
            </div>
            <div className="financial-literacy-benefit">
              <div className="benefit-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Earn Rewards</h3>
              <p>Complete courses to earn rewards and demonstrate your financial knowledge.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="financial-literacy-cta">
        <div className="cta-content">
          <h2>Ready to Start Your Financial Journey?</h2>
          <p>Join thousands of learners who are already transforming their financial future</p>
          <Link to="/learning/investing-course" className="cta-button">
            Get Started Now
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinancialLiteracy;
