import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth, db } from '../../../../firebase/initFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/InvestingCourse.css';

const InvestingCourse = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const sections = [
    {
      title: "Understanding Stock Markets",
      content: "Stock markets are platforms where shares of publicly traded companies are issued, bought, and sold. They provide companies with access to capital and investors with opportunities to own a portion of these companies.",
      quiz: {
        question: "What is a stock market?",
        options: [
          "A place to buy groceries",
          "A platform for trading company shares",
          "A bank for storing money",
          "A government office"
        ],
        correctAnswer: 1
      }
    },
    {
      title: "Types of Stocks",
      content: "Common stocks represent ownership in a company and typically come with voting rights. Preferred stocks often have a fixed dividend and priority over common stocks in case of liquidation.",
      quiz: {
        question: "What is the main difference between common and preferred stocks?",
        options: [
          "Preferred stocks are cheaper",
          "Common stocks have voting rights",
          "Common stocks are more valuable",
          "Preferred stocks are newer"
        ],
        correctAnswer: 1
      }
    },
    {
      title: "Market Analysis",
      content: "Fundamental analysis involves evaluating a company's financial statements and business model, while technical analysis focuses on price patterns and market trends.",
      quiz: {
        question: "What is fundamental analysis?",
        options: [
          "Studying price patterns",
          "Evaluating company financials",
          "Following market trends",
          "Predicting weather"
        ],
        correctAnswer: 1
      }
    },
    {
      title: "Investment Strategies",
      content: "Different investment strategies include value investing (buying undervalued stocks), growth investing (buying stocks with high growth potential), and dividend investing (focusing on stocks that pay regular dividends).",
      quiz: {
        question: "What is value investing?",
        options: [
          "Buying expensive stocks",
          "Buying undervalued stocks",
          "Selling all stocks",
          "Ignoring stock prices"
        ],
        correctAnswer: 1
      }
    }
  ];

  useEffect(() => {
    checkCompletionStatus();
  }, []);

  const checkCompletionStatus = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const completedRef = doc(db, user.uid, 'Completed Courses');
      const completedSnap = await getDoc(completedRef);
      if (completedSnap.exists() && completedSnap.data()['Investing Course']) {
        setCompleted(true);
      }
    }
  };

  const handleAnswer = async (selectedAnswer) => {
    const currentQuiz = sections[currentSection].quiz;
    if (selectedAnswer === currentQuiz.correctAnswer) {
      const newProgress = ((currentSection + 1) / sections.length) * 100;
      setProgress(newProgress);
      
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        setCompleted(true);
        const user = firebaseAuth.currentUser;
        if (user) {
          const completedRef = doc(db, user.uid, 'Completed Courses');
          await setDoc(completedRef, {
            'Investing Course': true
          }, { merge: true });

          // Update total funds
          const fundsRef = doc(db, user.uid, 'Total Funds');
          const fundsSnap = await getDoc(fundsRef);
          if (fundsSnap.exists()) {
            const currentFunds = fundsSnap.data().totalFunds;
            await setDoc(fundsRef, {
              totalFunds: currentFunds + 200
            });
          }
        }
        setModalMessage("Congratulations! You've completed the Investing Course and earned £200!");
        setShowModal(true);
      }
    } else {
      setModalMessage("Incorrect answer. Please try again.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (completed) {
      navigate('/investing-course-exam');
    }
  };

  return (
    <div className="investing-course">
      <header className="investing-course-header">
        <img src={require('../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="investing-course-logo" />
        <nav className="investing-course-nav">
          <button onClick={() => navigate('/portfolio-display')} className="investing-course-nav-link">
            Back to Portfolio
          </button>
        </nav>
      </header>

      <main className="investing-course-main">
        <div className="investing-course-progress">
          <div 
            className="investing-course-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="investing-course-content">
          <h1 className="investing-course-title">
            {sections[currentSection].title}
          </h1>
          
          <div className="investing-course-text">
            {sections[currentSection].content}
          </div>

          <div className="investing-course-quiz">
            <h2>Quiz</h2>
            <p>{sections[currentSection].quiz.question}</p>
            <div className="investing-course-options">
              {sections[currentSection].quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="investing-course-option"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="investing-course-modal">
          <div className="investing-course-modal-content">
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestingCourse; 