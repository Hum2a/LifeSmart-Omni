import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
  FaChartLine
} from 'react-icons/fa';
import { firebaseAuth, db } from '../../../../firebase/initFirebase';
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import '../styles/PortfolioCreation.css';

const companies = [
  { name: 'Amazon', symbol: 'AMZN', allocation: 0, invested: false },
  { name: 'Apple', symbol: 'AAPL', allocation: 0, invested: false },
  { name: 'Boeing', symbol: 'BA', allocation: 0, invested: false },
  { name: 'Coca-Cola', symbol: 'KO', allocation: 0, invested: false },
  { name: 'Disney', symbol: 'DIS', allocation: 0, invested: false },
  { name: 'Microsoft', symbol: 'MSFT', allocation: 0, invested: false },
  { name: 'Nike', symbol: 'NKE', allocation: 0, invested: false },
  { name: 'NVIDIA', symbol: 'NVDA', allocation: 0, invested: false },
  { name: 'PayPal', symbol: 'PYPL', allocation: 0, invested: false },
  { name: 'Pfizer', symbol: 'PFE', allocation: 0, invested: false },
  { name: 'Roblox', symbol: 'RBLX', allocation: 0, invested: false },
  { name: 'Shell', symbol: 'SHEL', allocation: 0, invested: false },
  { name: 'Spotify', symbol: 'SPOT', allocation: 0, invested: false },
  { name: 'Tesla', symbol: 'TSLA', allocation: 0, invested: false },
  { name: 'Visa', symbol: 'V', allocation: 0, invested: false },
  { name: 'Walmart', symbol: 'WMT', allocation: 0, invested: false }
];

const PortfolioCreation = () => {
  const navigate = useNavigate();
  const [totalFunds, setTotalFunds] = useState(0);
  const [companiesList, setCompaniesList] = useState(companies);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchUserFunds();
  }, []);

  const fetchUserFunds = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const docRef = doc(db, user.uid, 'Total Funds');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTotalFunds(docSnap.data().totalFunds);
      }
    }
  };

  const getCompanyLogo = (companyName) => {
    return require(`../../../../assets/StocksLogos/${companyName}.png`);
  };

  const updateTotal = () => {
    setCompaniesList([...companiesList]);
  };

  const checkAllocation = (company) => {
    if (company.allocation === '' || company.allocation === null || isNaN(company.allocation)) {
      company.allocation = 0;
      setCompaniesList([...companiesList]);
    }
  };

  const calculateTotalAllocation = () => {
    return companiesList.reduce((total, company) => total + company.allocation, 0);
  };

  const calculateRemainingFunds = () => {
    return totalFunds - calculateTotalAllocation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAllocation = calculateTotalAllocation();

    if (totalAllocation <= totalFunds) {
      const user = firebaseAuth.currentUser;
      if (user) {
        try {
          const portfolioDocRef = doc(db, user.uid, 'Stock Trading Platform', 'Portfolio', 'Initial Portfolio');
          const platformDocRef = doc(db, user.uid, 'Stock Trading Platform');

          const portfolioDocSnap = await getDoc(portfolioDocRef);
          const platformDocSnap = await getDoc(platformDocRef);

          let updatedCompanies = companiesList.map(company => ({
            name: company.name,
            symbol: company.symbol,
            allocation: company.allocation,
            invested: company.allocation > 0
          }));

          if (portfolioDocSnap.exists()) {
            const existingPortfolio = portfolioDocSnap.data();
            updatedCompanies = existingPortfolio.companies.map(existingCompany => {
              const newCompany = companiesList.find(company => company.name === existingCompany.name);
              if (newCompany) {
                return { ...existingCompany, allocation: existingCompany.allocation + newCompany.allocation, invested: true };
              }
              return existingCompany;
            });
          }

          await setDoc(portfolioDocRef, {
            userId: user.uid,
            companies: updatedCompanies,
            totalAllocation: totalAllocation,
            date: serverTimestamp(),
          });

          if (!platformDocSnap.exists()) {
            await setDoc(platformDocRef, { exists: true });
          }

          await setDoc(doc(db, user.uid, 'Total Funds'), {
            totalFunds: totalFunds - totalAllocation,
          }, { merge: true });

          navigate('/portfolio-display');
        } catch (error) {
          console.error('Error saving portfolio:', error);
          setModalTitle('Error');
          setModalMessage('Error submitting portfolio. Please try again.');
          setIsModalVisible(true);
        }
      } else {
        setModalTitle('Error');
        setModalMessage('You need to be logged in to submit a portfolio.');
        setIsModalVisible(true);
      }
    } else {
      setModalTitle('Error');
      setModalMessage('Total allocation exceeds available funds!');
      setIsModalVisible(true);
    }
  };

  return (
    <div className="portfolio-creation">
      <header className="portfolio-creation-header">
        <img src={require('../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="portfolio-creation-logo" />
        <nav className="portfolio-creation-header-links">
          <button onClick={() => navigate('/stock-market-simulator')} className="portfolio-creation-nav-link">
            Stock Market Tool
          </button>
        </nav>
      </header>
      <main className="portfolio-creation-main-content">
        {totalFunds === 0 ? (
          <h2>You have no funds available to allocate.</h2>
        ) : (
          <>
            <h1>Create Your Portfolio</h1>
            <form onSubmit={handleSubmit} className="portfolio-creation-form">
              <div className="portfolio-creation-total-funds-display">
                <p>Total Funds: £{calculateRemainingFunds()}</p>
              </div>
              <div className="portfolio-creation-companies-container">
                {companiesList.map((company) => (
                  <div key={company.name} className="portfolio-creation-company">
                    <label htmlFor={company.name} className="portfolio-creation-company-label">
                      <img src={getCompanyLogo(company.name)} alt={company.name} className="portfolio-creation-company-logo" />
                    </label>
                    <input
                      type="text"
                      id={company.name}
                      value={company.allocation || ''}
                      max={totalFunds}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          company.allocation = value === '' ? 0 : Number(value);
                          updateTotal();
                        }
                      }}
                      onBlur={() => checkAllocation(company)}
                      className="portfolio-creation-company-value-input"
                    />
                  </div>
                ))}
              </div>
              <div className="portfolio-creation-total-allocation">
                <strong>Total Allocation: £{calculateTotalAllocation()}</strong>
              </div>
              <div className="portfolio-creation-form-buttons">
                <button 
                  type="submit" 
                  disabled={calculateTotalAllocation() > totalFunds || calculateTotalAllocation() === 0}
                >
                  Submit and View Portfolio
                </button>
              </div>
            </form>
          </>
        )}
      </main>
      {isModalVisible && (
        <div className="portfolio-creation-modal-overlay">
          <div className="portfolio-creation-modal">
            <h3>{modalTitle}</h3>
            <p>{modalMessage}</p>
            <button onClick={() => setIsModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioCreation; 