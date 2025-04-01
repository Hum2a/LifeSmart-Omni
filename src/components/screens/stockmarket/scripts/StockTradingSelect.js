import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaChartLine, 
  FaArrowLeft,
  FaPlus,
  FaList,
  FaChartBar
} from 'react-icons/fa';
import { firebaseAuth, db } from '../../../../firebase/initFirebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import '../styles/StockTradingSelect.css';
import StockMarketDisplay from './StockMarketDisplay';

const StockTradingSelect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolios, setPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [userFunds, setUserFunds] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const profileRef = doc(db, user.uid, 'Profile');
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }

        // Fetch user funds
        const fundsRef = doc(db, user.uid, 'Total Funds');
        const fundsSnap = await getDoc(fundsRef);
        if (fundsSnap.exists()) {
          setUserFunds(fundsSnap.data().totalFunds);
        }

        // Fetch portfolio
        const portfolioRef = doc(db, user.uid, 'Stock Trading Platform', 'Portfolio', 'Initial Portfolio');
        const portfolioSnap = await getDoc(portfolioRef);
        
        if (portfolioSnap.exists()) {
          const portfolioData = portfolioSnap.data();
          setPortfolios([{
            id: 'Initial Portfolio',
            name: 'Initial Portfolio',
            createdAt: portfolioData.date,
            stocks: portfolioData.companies.filter(c => c.invested),
            totalValue: portfolioData.totalAllocation
          }]);
          setFilteredPortfolios([{
            id: 'Initial Portfolio',
            name: 'Initial Portfolio',
            createdAt: portfolioData.date,
            stocks: portfolioData.companies.filter(c => c.invested),
            totalValue: portfolioData.totalAllocation
          }]);
        } else {
          setPortfolios([]);
          setFilteredPortfolios([]);
        }
      } catch (err) {
        setError('Error loading data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 600);
  };

  useEffect(() => {
    const filtered = portfolios.filter(portfolio =>
      portfolio.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPortfolios(filtered);
  }, [searchQuery, portfolios]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreatePortfolio = () => {
    navigate(isMobile ? '/portfolio-creation-m' : '/portfolio-creation');
  };

  const handleViewPortfolio = (portfolioId) => {
    navigate(isMobile ? '/portfolio-display-M' : '/portfolio-display');
  };

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="stocktrading-select-container">
        <div className="stocktrading-select-content">
          <div className="stocktrading-select-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-trading-select">
      <header className="stock-trading-select-header">
        <img src={require('../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="stock-trading-select-logo" />
        <nav className="stock-trading-select-header-links">
          <button onClick={() => navigate('/sticky-note-creator')} className="stock-trading-select-nav-link">
            Create Sticky Note
          </button>
          <button onClick={() => navigate('/')} className="stock-trading-select-nav-link">
            Home
          </button>
        </nav>
      </header>
      <div className="stocktrading-select-container">
        <div className="stocktrading-select-content">
          <main className="stocktrading-select-main-content">
            <h1 className="stocktrading-select-title">Stock Trading</h1>
            {profile && (
              <div className="stocktrading-select-welcome-message">
                Welcome back, {profile.firstName}!
              </div>
            )}

            <div className="stocktrading-select-actions">
              <button 
                onClick={handleCreatePortfolio}
                className="stocktrading-select-create-button"
              >
                <FaPlus /> Create Your Portfolio
              </button>
            </div>

            <div className="stocktrading-select-portfolios">
              {filteredPortfolios.length === 0 ? (
                <div className="stocktrading-select-empty">
                  <p>No portfolios found. Create your first portfolio to get started!</p>
                </div>
              ) : (
                filteredPortfolios.map(portfolio => (
                  <div 
                    key={portfolio.id} 
                    className="stocktrading-select-portfolio-card"
                    onClick={() => handleViewPortfolio(portfolio.id)}
                  >
                    <div className="stocktrading-select-portfolio-header">
                      <h3>{portfolio.name}</h3>
                      <span className="stocktrading-select-portfolio-date">
                        Created: {new Date(portfolio.createdAt?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="stocktrading-select-portfolio-stats">
                      <div className="stocktrading-select-portfolio-stat">
                        <FaList className="stocktrading-select-stat-icon" />
                        <span>{portfolio.stocks?.length || 0} Stocks</span>
                      </div>
                      <div className="stocktrading-select-portfolio-stat">
                        <FaChartBar className="stocktrading-select-stat-icon" />
                        <span>Value: £{portfolio.totalValue?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {userFunds !== null && (
              <div className="stocktrading-select-total-funds">
                <p>Total Funds: £{userFunds}</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <StockMarketDisplay />
    </div>
  );
};

export default StockTradingSelect; 