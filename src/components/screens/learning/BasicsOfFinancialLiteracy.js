import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth, db } from '../../../../firebase/initFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/BasicsOfFinancialLiteracy.css';

const BasicsOfFinancialLiteracy = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const sections = [
    {
      title: "Introduction to Investing",
      content: "Investing is the act of allocating resources, usually money, with the expectation of generating an income or profit over time. This can be done through various means such as stocks, bonds, real estate, or mutual funds.",
      quiz: {
        question: "What is investing?",
        options: [
          "Saving money in a bank account",
          "Allocating resources with the expectation of generating profit",
          "Spending money on goods and services",
          "Borrowing money from a bank"
        ],
        correctAnswer: 1
      }
    },
    {
      title: "Understanding Risk and Return",
      content: "Risk and return are fundamental concepts in investing. Generally, higher potential returns come with higher risks. It's important to understand your risk tolerance before making investment decisions.",
      quiz: {
        question: "What is the relationship between risk and return?",
        options: [
          "Higher risk always means lower returns",
          "Higher potential returns come with higher risks",
          "Risk and return are unrelated",
          "Lower risk always means higher returns"
        ],
        correctAnswer: 1
      }
    },
    {
      title: "Diversification",
      content: "Diversification is a risk management strategy that involves spreading your investments across different assets to reduce the impact of any single investment's performance on your overall portfolio.",
      quiz: {
        question: "What is diversification?",
        options: [
          "Putting all your money in one investment",
          "Spreading investments across different assets",
          "Investing only in stocks",
          "Avoiding all risks"
        ],
        correctAnswer: 1
      }
    },
    {
      title: "Long-term vs Short-term Investing",
      content: "Long-term investing typically involves holding investments for several years, while short-term investing may involve buying and selling within a shorter timeframe. Long-term investing often reduces the impact of market volatility.",
      quiz: {
        question: "What is the main advantage of long-term investing?",
        options: [
          "Higher returns in all cases",
          "Reduced impact of market volatility",
          "No risk involved",
          "Immediate profits"
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
      if (completedSnap.exists() && completedSnap.data()['Basics of Investing']) {
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
            'Basics of Investing': true
          }, { merge: true });

          // Update total funds
          const fundsRef = doc(db, user.uid, 'Total Funds');
          const fundsSnap = await getDoc(fundsRef);
          if (fundsSnap.exists()) {
            const currentFunds = fundsSnap.data().totalFunds;
            await setDoc(fundsRef, {
              totalFunds: currentFunds + 100
            });
          }
        }
        setModalMessage("Congratulations! You've completed the course and earned £100!");
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
      navigate('/portfolio-display');
    }
  };

  return (
    <div className="basics-of-financial-literacy">
      <header className="basics-of-financial-literacy-header">
        <img src={require('../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="basics-of-financial-literacy-logo" />
        <nav className="basics-of-financial-literacy-nav">
          <button onClick={() => navigate('/portfolio-display')} className="basics-of-financial-literacy-nav-link">
            Back to Portfolio
          </button>
        </nav>
      </header>

      <main className="basics-of-financial-literacy-main">
        <div className="basics-of-financial-literacy-progress">
          <div 
            className="basics-of-financial-literacy-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="basics-of-financial-literacy-content">
          <h1 className="basics-of-financial-literacy-title">
            {sections[currentSection].title}
          </h1>
          
          <div className="basics-of-financial-literacy-text">
            {sections[currentSection].content}
          </div>

          <div className="basics-of-financial-literacy-quiz">
            <h2>Quiz</h2>
            <p>{sections[currentSection].quiz.question}</p>
            <div className="basics-of-financial-literacy-options">
              {sections[currentSection].quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="basics-of-financial-literacy-option"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="basics-of-financial-literacy-modal">
          <div className="basics-of-financial-literacy-modal-content">
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicsOfFinancialLiteracy; 