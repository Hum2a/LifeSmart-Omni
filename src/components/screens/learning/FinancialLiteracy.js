import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaShieldAlt, 
  FaGraduationCap, 
  FaClock, 
  FaBook, 
  FaGift, 
  FaArrowRight,
  FaLightbulb,
  FaUsers,
  FaTrophy,
  FaRocket,
  FaHandHoldingUsd,
  FaChartBar,
  FaCertificate,
  FaHourglassHalf
} from 'react-icons/fa';
import './styles/FinancialLiteracy.css';
import LifeSmartLogo from '../../../assets/icons/LifeSmartLogo.png';

const HomePage = () => {
  const courses = [
    {
      id: 'investing',
      title: 'Smart Investing Fundamentals',
      description: 'Master the art of investing with expert-led courses on stocks, market analysis, and portfolio management.',
      duration: '2 hours',
      reward: '£500',
      image: '/images/investing-course.jpg',
      path: '/investing-course',
      category: 'Investment',
      level: 'Beginner',
      lessons: '11 lessons',
      icon: FaChartLine,
      available: true
    },
    {
      id: 'savings',
      title: 'Smart Savings Strategies',
      description: 'Learn proven techniques to maximize your savings and build a strong financial foundation.',
      duration: '1.5 hours',
      reward: '£300',
      image: '/images/savings-course.jpg',
      path: '/savings-course',
      category: 'Savings',
      level: 'Beginner',
      lessons: '8 lessons',
      icon: FaHandHoldingUsd,
      available: false
    },
    {
      id: 'trading',
      title: 'Advanced Trading Mastery',
      description: 'Advanced strategies for experienced traders looking to enhance their portfolio performance.',
      duration: '3 hours',
      reward: '£800',
      image: '/images/trading-course.jpg',
      path: '/trading-course',
      category: 'Trading',
      level: 'Advanced',
      lessons: '15 lessons',
      icon: FaChartBar,
      available: false
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="financial-literacy">
      {/* Hero Section */}
      <motion.div 
        className="financial-literacy-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="financial-literacy-hero-content">
          <div className="hero-logo">
            <Link to="/select" className="logo-link">
              <img src={LifeSmartLogo} alt="LifeSmart Logo" className="lifesmart-logo" />
            </Link>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Transform Your Financial Future
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Learn from experts, earn rewards, and build lasting wealth
          </motion.p>
          <motion.div 
            className="financial-literacy-stats"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div className="stat" variants={fadeIn}>
              <FaUsers className="stat-icon" />
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Learners</span>
            </motion.div>
            <motion.div className="stat" variants={fadeIn}>
              <FaTrophy className="stat-icon" />
              <span className="stat-number">£1000+</span>
              <span className="stat-label">Rewards Earned</span>
            </motion.div>
            <motion.div className="stat" variants={fadeIn}>
              <FaCertificate className="stat-icon" />
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Courses Section */}
      <motion.div 
        className="financial-literacy-courses"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="financial-literacy-courses-header">
          <h2>Featured Courses</h2>
          <p>Start your journey to financial freedom today</p>
        </div>
        <motion.div 
          className="financial-literacy-courses-grid"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              className={`financial-literacy-course-card ${!course.available ? 'coming-soon' : ''}`}
            >
              {!course.available && (
                <div className="coming-soon-banner">
                  <FaHourglassHalf className="coming-soon-icon" />
                  <span>Coming Soon</span>
                </div>
              )}
              <div className="financial-literacy-course-image">
                <img src={course.image} alt={course.title} />
                <div className="financial-literacy-course-overlay">
                  <span className="course-category">{course.category}</span>
                  <span className="course-level">{course.level}</span>
                </div>
              </div>
              <div className="financial-literacy-course-content">
                <div className="course-icon">
                  <course.icon />
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="financial-literacy-course-meta">
                  <div className="meta-item">
                    <FaClock />
                    <span>{course.duration}</span>
                  </div>
                  <div className="meta-item">
                    <FaBook />
                    <span>{course.lessons}</span>
                  </div>
                  <div className="meta-item">
                    <FaGift />
                    <span>{course.reward}</span>
                  </div>
                </div>
                {course.available ? (
                  <Link to={course.path} className="financial-literacy-course-button">
                    Start Learning
                    <FaArrowRight />
                  </Link>
                ) : (
                  <button className="financial-literacy-course-button coming-soon-button" disabled>
                    Coming Soon
                    <FaHourglassHalf />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div 
        className="financial-literacy-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="financial-literacy-info-content">
          <h2>Why Choose Our Platform?</h2>
          <div className="financial-literacy-benefits">
            <motion.div 
              className="financial-literacy-benefit"
              whileHover={{ scale: 1.05 }}
              variants={fadeIn}
            >
              <div className="benefit-icon">
                <FaChartLine />
              </div>
              <h3>Expert-Led Learning</h3>
              <p>Learn from industry professionals with proven track records.</p>
            </motion.div>
            <motion.div 
              className="financial-literacy-benefit"
              whileHover={{ scale: 1.05 }}
              variants={fadeIn}
            >
              <div className="benefit-icon">
                <FaShieldAlt />
              </div>
              <h3>Risk Management</h3>
              <p>Master strategies to protect and grow your investments safely.</p>
            </motion.div>
            <motion.div 
              className="financial-literacy-benefit"
              whileHover={{ scale: 1.05 }}
              variants={fadeIn}
            >
              <div className="benefit-icon">
                <FaGraduationCap />
              </div>
              <h3>Certified Learning</h3>
              <p>Earn recognized certificates and rewards as you progress.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="financial-literacy-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="cta-content">
          <h2>Ready to Start Your Financial Journey?</h2>
          <p>Join thousands of successful learners who have transformed their financial future</p>
          <Link to="/investing-course" className="cta-button">
            Get Started Now
            <FaArrowRight />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
