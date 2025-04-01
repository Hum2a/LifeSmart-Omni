import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth, db } from '../../../../firebase/initFirebase';
import { doc, getDoc, getDocs, collection, query, orderBy, setDoc, deleteDoc, where } from 'firebase/firestore';
import { format, differenceInDays } from 'date-fns';
import { FaArrowLeft, FaChartLine, FaChartPie, FaChartBar, FaSync, FaInfoCircle } from 'react-icons/fa';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import '../styles/PortfolioDisplay.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Portfolio Value Over Time'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '£' + value.toLocaleString();
        }
      }
    }
  }
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
};

const companies = [
  { name: 'Amazon', symbol: 'AMZN', allocation: 0, initialStockPrice: 0 },
  { name: 'Apple', symbol: 'AAPL', allocation: 0, initialStockPrice: 0 },
  { name: 'Boeing', symbol: 'BA', allocation: 0, initialStockPrice: 0 },
  { name: 'Coca-Cola', symbol: 'KO', allocation: 0, initialStockPrice: 0 },
  { name: 'Disney', symbol: 'DIS', allocation: 0, initialStockPrice: 0 },
  { name: 'Google', symbol: 'GOOGL', allocation: 0, initialStockPrice: 0 },
  { name: 'Microsoft', symbol: 'MSFT', allocation: 0, initialStockPrice: 0 },
  { name: 'Nike', symbol: 'NKE', allocation: 0, initialStockPrice: 0 },
  { name: 'NVIDIA', symbol: 'NVDA', allocation: 0, initialStockPrice: 0 },
  { name: 'PayPal', symbol: 'PYPL', allocation: 0, initialStockPrice: 0 },
  { name: 'Pfizer', symbol: 'PFE', allocation: 0, initialStockPrice: 0 },
  { name: 'Roblox', symbol: 'RBLX', allocation: 0, initialStockPrice: 0 },
  { name: 'Shell', symbol: 'SHEL', allocation: 0, initialStockPrice: 0 },
  { name: 'Spotify', symbol: 'SPOT', allocation: 0, initialStockPrice: 0 },
  { name: 'Tesla', symbol: 'TSLA', allocation: 0, initialStockPrice: 0 },
  { name: 'Visa', symbol: 'V', allocation: 0, initialStockPrice: 0 },
  { name: 'Walmart', symbol: 'WMT', allocation: 0, initialStockPrice: 0 }
];

const PortfolioDisplay = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [portfolioChartData, setPortfolioChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [expandedStock, setExpandedStock] = useState(null);
  const [officialChartData, setOfficialChartData] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [totalFunds, setTotalFunds] = useState(null);
  const [loginStreak, setLoginStreak] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFinancialCoursesCard, setShowFinancialCoursesCard] = useState(true);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        await fetchDeveloperStatus(user);
        await fetchAdminStatus(user);
        await fetchPortfolio();
        if (portfolio) {
          await initializeData();
          await fillMissingDates();
          await fetchAllPortfolioDocs();
          preparePortfolioChartData();
          preparePieChartData();
          updatePortfolioValues();
        }
        await updateStockPrices();
        await fetchStickyNotes();
        await fetchTotalFunds();
        await checkCompletedCourses(user);
        await fetchLoginStreak();
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [navigate]);

  const incrementRequestCount = () => {
    setRequestCount(prev => prev + 1);
  };

  const fetchExchangeRate = async () => {
    const docRef = doc(db, 'Exchange Rates', 'GBP');
    incrementRequestCount();
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().rate : 1;
  };

  const fetchStockData = async (symbol) => {
    const docRef = doc(db, 'Stock Market Data', symbol);
    incrementRequestCount();
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const fetchRealTimeStockData = async (symbol) => {
    const docRef = doc(db, 'Real Time Stock Market Data', symbol);
    incrementRequestCount();
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const initializeData = async () => {
    if (portfolio && portfolio.companies) {
      const stockDataPromises = portfolio.companies.map(company => {
        const companyInfo = companies.find(c => c.name === company.name);
        if (company.invested) {
          return fetchStockData(companyInfo.symbol);
        }
        return null;
      });

      const stockDataArray = await Promise.all(stockDataPromises);
      const exchangeRate = await fetchExchangeRate();

      const updatedCompanies = await Promise.all(portfolio.companies.map(async (company, index) => {
        const stockData = stockDataArray[index];
        let initialStockPrice = 0;
        if (stockData && stockData.data['Time Series (Daily)']) {
          const buyDate = new Date(portfolio.date.seconds * 1000);
          let formattedBuyDate = format(buyDate, 'yyyy-MM-dd');
          let buyDailyData = stockData.data['Time Series (Daily)'][formattedBuyDate];

          while (!buyDailyData && buyDate <= new Date(stockData.data['Meta Data']['3. Last Refreshed'])) {
            buyDate.setDate(buyDate.getDate() - 1);
            formattedBuyDate = format(buyDate, 'yyyy-MM-dd');
            buyDailyData = stockData.data['Time Series (Daily)'][formattedBuyDate];
          }

          if (buyDailyData) {
            initialStockPrice = parseFloat(buyDailyData['4. close']) * exchangeRate;
          }
        }

        if (initialStockPrice === 0) {
          const realTimeData = await fetchRealTimeStockData(company.symbol);
          if (realTimeData && realTimeData.days) {
            const mostRecentDay = Object.keys(realTimeData.days).sort().pop();
            const mostRecentTime = Object.keys(realTimeData.days[mostRecentDay]).sort().pop();
            if (mostRecentDay) {
              initialStockPrice = realTimeData.days[mostRecentDay][mostRecentTime].currentPrice * exchangeRate;
            }
          }
        }

        company.initialStockPrice = initialStockPrice;
        return company;
      }));

      setPortfolio(prev => ({
        ...prev,
        companies: updatedCompanies
      }));
    }
  };

  const fillMissingDates = async () => {
    if (!portfolio) return;

    const initialDate = new Date(portfolio.date.seconds * 1000);
    const today = new Date();
    let currentDate = new Date(initialDate);
    const totalDays = (today - initialDate) / (1000 * 60 * 60 * 24);
    let processedDays = 0;

    const user = firebaseAuth.currentUser;
    if (!user) return;

    let previousDayValues = portfolio.companies.map(company => company.allocation);

    while (currentDate <= today) {
      let formattedDate = format(currentDate, 'yyyy-MM-dd');
      const docRef = doc(db, user.uid, 'Stock Trading Platform', 'Portfolio', `${formattedDate} Portfolio`);
      incrementRequestCount();
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const stockDataPromises = portfolio.companies.map(async company => {
          if (company.invested) {
            const companyInfo = companies.find(c => c.name === company.name);
            const stockData = await fetchStockData(companyInfo.symbol);
            const realTimeData = await fetchRealTimeStockData(companyInfo.symbol);
            return { stockData, realTimeData };
          }
          return null;
        });

        const stockDataArray = await Promise.all(stockDataPromises);
        const exchangeRate = await fetchExchangeRate();

        const updatedCompanies = portfolio.companies.map((company, index) => {
          if (!company.invested) return company;
          const data = stockDataArray[index];
          if (!data) return company;
          const { stockData, realTimeData } = data;
          let currentValue = previousDayValues[index];

          let previousDate = new Date(currentDate);
          previousDate.setDate(previousDate.getDate() - 1);
          let formattedPreviousDate = format(previousDate, 'yyyy-MM-dd');
          let previousClosePrice = null;

          while (!previousClosePrice && previousDate >= initialDate) {
            previousClosePrice = stockData?.data['Time Series (Daily)']?.[formattedPreviousDate]?.['4. close'];
            if (!previousClosePrice) {
              previousDate.setDate(previousDate.getDate() - 1);
              formattedPreviousDate = format(previousDate, 'yyyy-MM-dd');
            }
          }

          let effectiveFormattedDate = formattedDate;
          let closePrice = stockData?.data['Time Series (Daily)']?.[formattedDate]?.['4. close'];

          if (!closePrice && realTimeData && realTimeData.days) {
            const mostRecentDay = Object.keys(realTimeData.days).sort().pop();
            const mostRecentTime = Object.keys(realTimeData.days[mostRecentDay]).sort().pop();
            if (mostRecentDay === formattedDate) {
              closePrice = realTimeData.days[mostRecentDay][mostRecentTime].currentPrice;
            }
          }

          if (!closePrice) {
            let closestPreviousDate = new Date(currentDate);
            while (!closePrice && closestPreviousDate >= initialDate) {
              closestPreviousDate.setDate(closestPreviousDate.getDate() - 1);
              effectiveFormattedDate = format(closestPreviousDate, 'yyyy-MM-dd');
              closePrice = stockData?.data['Time Series (Daily)']?.[effectiveFormattedDate]?.['4. close'];
            }
          }

          if (previousClosePrice && closePrice) {
            const percentageChange = (parseFloat(closePrice) - parseFloat(previousClosePrice)) / parseFloat(previousClosePrice);
            currentValue = previousDayValues[index] * (1 + percentageChange);
          }

          return {
            ...company,
            currentValue: isNaN(currentValue) ? 0 : currentValue,
            currentStockPrice: (stockData?.data['Time Series (Daily)']?.[effectiveFormattedDate]?.['1. open'] || previousClosePrice) * exchangeRate
          };
        });

        previousDayValues = updatedCompanies.map(company => company.currentValue);

        const updatedPortfolio = {
          ...portfolio,
          date: currentDate,
          companies: updatedCompanies,
          totalAllocation: updatedCompanies.filter(c => c.invested).reduce((sum, company) => sum + company.currentValue, 0),
        };

        await setDoc(docRef, updatedPortfolio);
      }

      processedDays++;
      setLoadingProgress(Math.round((processedDays / totalDays) * 100));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const fetchAllPortfolioDocs = async () => {
    const user = firebaseAuth.currentUser;
    if (!user) return;

    const portfolioCollection = collection(db, user.uid, 'Stock Trading Platform', 'Portfolio');
    const portfolioQuery = query(portfolioCollection, orderBy('date', 'asc'));
    incrementRequestCount();
    const querySnapshot = await getDocs(portfolioQuery);

    const history = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== 'Initial Portfolio') {
        history.push(doc.data());
      }
    });

    setPortfolioHistory(history);
  };

  const preparePortfolioChartData = () => {
    if (!portfolioHistory) return;

    const dates = [];
    const values = [];

    portfolioHistory.forEach(portfolio => {
      const formattedDate = format(new Date(portfolio.date.seconds * 1000), 'yyyy-MM-dd');
      dates.push(formattedDate);
      values.push(parseFloat(portfolio.companies.filter(c => c.invested).reduce((sum, company) => sum + company.currentValue, 0)).toFixed(2));
    });

    setPortfolioChartData({
      labels: dates,
      datasets: [
        {
          label: 'Total Portfolio Value',
          data: values,
          fill: true,
          borderColor: '#3e95cd',
          backgroundColor: 'rgba(62, 149, 205, 0.2)',
          tension: 0.1
        }
      ]
    });
  };

  const preparePieChartData = () => {
    if (!portfolio) return;

    const labels = portfolio.companies.filter(c => c.invested).map(company => company.name);
    const data = portfolio.companies.filter(c => c.invested).map(company => parseFloat(company.currentValue || company.allocation).toFixed(2));

    setPieChartData({
      labels,
      datasets: [
        {
          label: 'Stock Distribution',
          data,
          backgroundColor: getRandomColors(labels.length),
        },
      ],
    });
  };

  const updatePortfolioValues = () => {
    if (!portfolioHistory.length) return;
    const latestPortfolio = portfolioHistory[portfolioHistory.length - 1];
    setPortfolio(prev => ({
      ...prev,
      companies: latestPortfolio.companies
    }));
  };

  const updateStockPrices = async () => {
    const exchangeRate = await fetchExchangeRate();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (portfolio) {
      const stockDataPromises = portfolio.companies.map(async company => {
        if (company.invested) {
          const companyInfo = companies.find(c => c.name === company.name);
          const stockData = await fetchStockData(companyInfo.symbol);
          const realTimeData = await fetchRealTimeStockData(companyInfo.symbol);
          return { stockData, realTimeData };
        }
        return null;
      });

      const stockDataArray = await Promise.all(stockDataPromises);

      const updatedCompanies = portfolio.companies.map((company, index) => {
        const data = stockDataArray[index];
        if (!data) return company;
        const { stockData, realTimeData } = data;
        let currentStockPrice = null;

        if (stockData && stockData.data['Time Series (Daily)']) {
          const dailyData = stockData.data['Time Series (Daily)'][today];
          if (dailyData) {
            currentStockPrice = parseFloat(dailyData['4. close']) * exchangeRate;
          }
        }

        if (!currentStockPrice && realTimeData && realTimeData.days) {
          const mostRecentDay = Object.keys(realTimeData.days).sort().pop();
          const mostRecentTime = Object.keys(realTimeData.days[mostRecentDay]).sort().pop();
          if (mostRecentDay === today) {
            currentStockPrice = realTimeData.days[mostRecentDay][mostRecentTime].currentPrice;
          }
        }

        if (!currentStockPrice) {
          currentStockPrice = (company.currentValue / company.allocation) * exchangeRate;
        }

        return {
          ...company,
          currentStockPrice
        };
      });

      setPortfolio(prev => ({
        ...prev,
        companies: updatedCompanies
      }));
    }
  };

  const prepareOfficialStockChartData = async (symbol) => {
    const stockData = await fetchStockData(symbol);
    const realTimeData = await fetchRealTimeStockData(symbol);
    const initialDate = format(new Date(portfolio.date.seconds * 1000), 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    const exchangeRate = await fetchExchangeRate();

    if (stockData && stockData.data['Time Series (Daily)']) {
      const dates = [];
      const values = [];

      let currentDate = new Date(initialDate);
      while (currentDate < new Date(today)) {
        let formattedDate = format(currentDate, 'yyyy-MM-dd');
        let dailyData = stockData.data['Time Series (Daily)'][formattedDate];

        while (!dailyData && new Date(formattedDate) >= new Date(stockData.data['Meta Data']['3. Last Refreshed'])) {
          let date = new Date(formattedDate);
          date.setDate(date.getDate() - 1);
          formattedDate = format(date, 'yyyy-MM-dd');
          dailyData = stockData.data['Time Series (Daily)'][formattedDate];
        }

        if (dailyData && dailyData['1. open']) {
          dates.push(formattedDate);
          values.push((parseFloat(dailyData['1. open']) * exchangeRate).toFixed(2));
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (realTimeData && realTimeData.days) {
        const mostRecentDay = Object.keys(realTimeData.days).sort().pop();
        const mostRecentTime = Object.keys(realTimeData.days[mostRecentDay]).sort().pop();
        if (mostRecentDay === today) {
          const openPrice = realTimeData.days[mostRecentDay][mostRecentTime].openPrice;
          if (openPrice) {
            dates.push(today);
            values.push((openPrice * exchangeRate).toFixed(2));
          }
        }
      }

      const uniqueDates = [];
      const uniqueValues = [];
      dates.forEach((date, index) => {
        if (!uniqueDates.includes(date)) {
          uniqueDates.push(date);
          uniqueValues.push(values[index]);
        }
      });

      return {
        labels: uniqueDates,
        datasets: [
          {
            label: 'Official Stock Value',
            data: uniqueValues,
            fill: true,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1
          }
        ]
      };
    }
    return null;
  };

  const getRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors;
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await initializeData();
      await fillMissingDates();
      await fetchAllPortfolioDocs();
      await preparePortfolioChartData();
      await preparePieChartData();
      await updateStockPrices();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (company) => {
    setExpandedStock(company.symbol);
    prepareOfficialStockChartData(company.symbol);
  };

  const fetchDeveloperStatus = async (user) => {
    const profileRef = doc(db, user.uid, 'Profile');
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      setIsDeveloper(profileSnap.data().developer || false);
    }
  };

  const fetchAdminStatus = async (user) => {
    const profileRef = doc(db, user.uid, 'Profile');
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      setIsAdmin(profileSnap.data().admin || false);
    }
  };

  const fetchPortfolio = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const docRef = doc(db, user.uid, 'Stock Trading Platform', 'Portfolio', 'Initial Portfolio');
      incrementRequestCount();
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPortfolio(docSnap.data());
      } else {
        setError('No portfolio found');
        setLoading(false);
      }
    }
  };

  const fetchStickyNotes = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const notesCollection = collection(db, 'Sticky Notes');
      incrementRequestCount();
      const notesSnapshot = await getDocs(notesCollection);

      const notes = notesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          date: data.date || null,
          links: data.links || null,
          linkName: data.linkName || null,
          showForAllUsers: data.showForAllUsers,
          selectedUsers: data.selectedUsers || [],
          selectedStocks: data.selectedStocks || [],
          portfolioValueThreshold: data.portfolioValueThreshold || null,
        };
      }).filter(note => shouldShowNote(note));

      setStickyNotes(notes);
    }
  };

  const fetchTotalFunds = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const docRef = doc(db, user.uid, 'Total Funds');
      incrementRequestCount();
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTotalFunds(docSnap.data().totalFunds);
      }
    }
  };

  const checkCompletedCourses = async (user) => {
    const coursesRef = doc(db, user.uid, 'Completed Courses');
    const coursesDoc = await getDoc(coursesRef);
    if (coursesDoc.exists() && coursesDoc.data()['Basics of Investing']) {
      setShowFinancialCoursesCard(false);
    } else {
      setShowFinancialCoursesCard(true);
    }
  };

  const fetchLoginStreak = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const streakRef = doc(db, 'Login Streak', user.uid);
      const streakSnap = await getDoc(streakRef);
      if (streakSnap.exists()) {
        const streakData = streakSnap.data();
        setLoginStreak(streakData.streak || 0);
      } else {
        setLoginStreak(0);
      }
    }
  };

  const shouldShowNote = (note) => {
    if (note.showForAllUsers) {
      return true;
    }
    if (note.portfolioValueThreshold && currentValue > note.portfolioValueThreshold) {
      return true;
    }
    if (note.selectedStocks && note.selectedStocks.length) {
      const userStocks = portfolio ? portfolio.companies.filter(c => c.invested).map(company => company.symbol) : [];
      const hasMatchingStock = note.selectedStocks.some(stock => userStocks.includes(stock));
      if (hasMatchingStock) {
        return true;
      }
    }
    return false;
  };

  const roundedValue = (value) => {
    return isNaN(value) ? '0.00' : parseFloat(value).toFixed(2);
  };

  const originalValue = portfolio ? portfolio.companies.filter(c => c.invested).reduce((sum, company) => sum + company.allocation, 0) : 0;
  const currentValue = portfolioHistory.length ? portfolioHistory[portfolioHistory.length - 1].companies.filter(c => c.invested).reduce((sum, company) => sum + (company.currentValue || 0), 0) : 0;
  const percentageGainLoss = portfolio ? ((currentValue - originalValue) / originalValue * 100).toFixed(2) : 0;
  const bestPerformingStock = portfolio ? portfolio.companies.filter(c => c.invested).reduce((best, company) => {
    const allocation = company.allocation || 1;
    const change = ((company.currentValue || 0) - allocation) / allocation * 100;
    return change > best.percentageChange ? { name: company.name, percentageChange: change.toFixed(2) } : best;
  }, { name: 'N/A', percentageChange: -Infinity }) : { name: 'N/A', percentageChange: 0 };
  const worstPerformingStock = portfolio ? portfolio.companies.filter(c => c.invested).reduce((worst, company) => {
    if (company.allocation === 0) return worst;
    const allocation = company.allocation || 1;
    const change = ((company.currentValue || 0) - allocation) / allocation * 100;
    return change < worst.percentageChange ? { name: company.name, percentageChange: change.toFixed(2) } : worst;
  }, { name: 'N/A', percentageChange: Infinity }) : { name: 'N/A', percentageChange: 0 };
  const filteredCompanies = portfolio ? portfolio.companies.filter(company => company.allocation > 0 && company.invested) : [];
  const timeInvested = portfolio && portfolioHistory.length ? differenceInDays(new Date(portfolioHistory[portfolioHistory.length - 1].date.seconds * 1000), new Date(portfolio.date.seconds * 1000)) : 0;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return format(date, 'MMM dd, yyyy');
  };

  const handleDeletePortfolio = async () => {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) return;

      // Delete the initial portfolio
      const portfolioRef = doc(db, user.uid, 'Stock Trading Platform', 'Portfolio', 'Initial Portfolio');
      await deleteDoc(portfolioRef);

      // Delete all daily portfolio records
      const portfolioCollection = collection(db, user.uid, 'Stock Trading Platform', 'Portfolio');
      const portfolioQuery = query(portfolioCollection, where('date', '>=', new Date(0)));
      const querySnapshot = await getDocs(portfolioQuery);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Navigate back to stock trading select
      navigate('/stock-market-simulator');
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      setError('Failed to delete portfolio. Please try again.');
    }
  };

  return (
    <div className="portfolio-display">
      <header className="portfolio-display-header">
        <img src={require('../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="portfolio-display-logo" />
        <nav className="portfolio-display-header-links">
          {(isAdmin || isDeveloper) && (
            <button onClick={() => navigate('/stock-market-simulator')} className="portfolio-display-nav-link">
              Stock Trading Tool
            </button>
          )}
          <button onClick={handleRefresh} className="portfolio-display-refresh-button">
            <FaSync /> Refresh Data
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className="portfolio-display-delete-button"
          >
            Delete Portfolio
          </button>
        </nav>
      </header>
      <main className="portfolio-display-main-content">
        <div className="portfolio-display-top-cards">
          {totalFunds !== null && (
            <div className="portfolio-display-wallet-card">
              <div className="portfolio-display-wallet-header">
                Wallet <br /> £{totalFunds}
                <span className="portfolio-display-info-icon" onClick={() => setShowModal(true)}>i</span>
              </div>
              {totalFunds > 0 && (
                <button onClick={() => navigate('/portfolio-append')} className="portfolio-display-button-link">
                  Invest
                </button>
              )}
            </div>
          )}
        </div>

        {showModal && (
          <div className="portfolio-display-modal">
            <div className="portfolio-display-modal-content">
              <h3>Information</h3>
              <p>Log-in 5 days in a row to get an extra £100 to invest. 
              Complete a course available below to get an extra £100 to invest</p>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        {isDeveloper && (
          <div className="portfolio-display-request-counter-card">
            Firestore Requests: {requestCount}
          </div>
        )}

        {loading ? (
          <div className="portfolio-display-loading">
            <p>Loading...</p>
            <progress value={loadingProgress} max="100"></progress>
          </div>
        ) : !portfolio ? (
          <div className="portfolio-display-error">No portfolio found.</div>
        ) : (
          <div className="portfolio-display-content">
            <div className="portfolio-display-summary">
              <div className="portfolio-display-summary-leaderboard">
                <div className="portfolio-display-summary-card">
                  <h2>Portfolio Summary</h2>
                  <p><strong>Amount Invested:</strong> <span>£{roundedValue(originalValue)}</span></p>
                  <p><strong>Current Value:</strong> <span>£{roundedValue(currentValue)}</span></p>
                  <p><strong>Percentage Gain/Loss:</strong> <span>{roundedValue(percentageGainLoss)}%</span></p>
                  <p><strong>Best Performing Stock:</strong> <span>{bestPerformingStock.name} (<span className="portfolio-display-highlight">{roundedValue(bestPerformingStock.percentageChange)}%</span>)</span></p>
                  <p><strong>Worst Performing Stock:</strong> <span>{worstPerformingStock.name} (<span className="portfolio-display-highlight">{roundedValue(worstPerformingStock.percentageChange)}%</span>)</span></p>
                  <p><strong>Time Invested:</strong> <span>{timeInvested} days</span></p>
                </div>
              </div>
              <div className="portfolio-display-graph-card">
                <h2>Portfolio Value Over Time</h2>
                {portfolioChartData && (
                  <Line data={portfolioChartData} options={lineChartOptions} />
                )}
              </div>
            </div>

            <div className="portfolio-display-details">
              <div className="portfolio-display-pie-card">
                <h2>Portfolio Distribution</h2>
                {pieChartData && (
                  <Pie data={pieChartData} options={pieChartOptions} className="portfolio-display-pie-chart" />
                )}
              </div>
              <div className="portfolio-display-table-card">
                <h2>Portfolio Details</h2>
                <table className="portfolio-display-table">
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Original Value</th>
                      <th>Initial Stock Price</th>
                      <th>Current Value</th>
                      <th>Current Stock Price (Real Time)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <React.Fragment key={company.name}>
                        <tr onClick={() => handleStockClick(company)}>
                          <td>{company.name}</td>
                          <td>£{roundedValue(company.allocation)}</td>
                          <td>$"{company.initialStockPrice}</td>
                          <td>£{roundedValue(company.currentValue || 0)}</td>
                          <td>$"{roundedValue(company.currentStockPrice)}</td>
                        </tr>
                        {expandedStock === company.symbol && (
                          <tr className="portfolio-display-expanded-row">
                            <td colSpan="5">
                              {officialChartData && (
                                <Line data={officialChartData} options={lineChartOptions} />
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="portfolio-display-additional-info">
              <div className="portfolio-display-notice-board-card">
                <h2>Notice Board</h2>
                <div className="portfolio-display-sticky-notes">
                  {stickyNotes.map((note) => (
                    <div key={note.id} className="portfolio-display-sticky-note">
                      <h3>{note.title}</h3>
                      <p>{note.content}</p>
                      {note.date && <p>Date: {formatDate(note.date)}</p>}
                      {note.links && (
                        <a href={note.links} target="_blank" rel="noopener noreferrer">
                          {note.linkName || note.links}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {showFinancialCoursesCard && (
                <button onClick={() => navigate('/basics-of-investing')} className="portfolio-display-financial-courses-card">
                  <div className="portfolio-display-card-content">
                    <h3>Basics of Investing</h3>
                    <p>25 minutes</p>
                    <p>Gain £100</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {showDeleteConfirm && (
        <div className="portfolio-display-modal">
          <div className="portfolio-display-modal-content">
            <h3>Delete Portfolio</h3>
            <p>Are you sure you want to delete your portfolio? This action cannot be undone.</p>
            <div className="portfolio-display-modal-buttons">
              <button 
                onClick={handleDeletePortfolio}
                className="portfolio-display-modal-delete-button"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="portfolio-display-modal-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioDisplay; 