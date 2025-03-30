import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth, db } from '../../../../../firebase/initFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/InvestingCourseExam.css';

const InvestingCourseExam = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [examCompleted, setExamCompleted] = useState(false);

  const examQuestions = [
    {
      question: "What is the primary purpose of a stock market?",
      options: [
        "To provide companies with access to capital",
        "To sell groceries",
        "To store money",
        "To provide loans"
      ],
      correctAnswer: 0
    },
    {
      question: "Which type of stock typically has voting rights?",
      options: [
        "Preferred stock",
        "Common stock",
        "Both types",
        "Neither type"
      ],
      correctAnswer: 1
    },
    {
      question: "What is fundamental analysis?",
      options: [
        "Studying price patterns",
        "Evaluating company financials",
        "Following market trends",
        "Predicting weather"
      ],
      correctAnswer: 1
    },
    {
      question: "What is value investing?",
      options: [
        "Buying expensive stocks",
        "Buying undervalued stocks",
        "Selling all stocks",
        "Ignoring stock prices"
      ],
      correctAnswer: 1
    },
    {
      question: "What is diversification?",
      options: [
        "Putting all money in one investment",
        "Spreading investments across different assets",
        "Investing only in stocks",
        "Avoiding all risks"
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswer = async (selectedAnswer) => {
    const currentExamQuestion = examQuestions[currentQuestion];
    if (selectedAnswer === currentExamQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setExamCompleted(true);
      const user = firebaseAuth.currentUser;
      if (user) {
        const examResultsRef = doc(db, user.uid, 'Exam Results');
        await setDoc(examResultsRef, {
          'Investing Course Exam': {
            score: score + (selectedAnswer === currentExamQuestion.correctAnswer ? 1 : 0),
            totalQuestions: examQuestions.length,
            date: new Date().toISOString()
          }
        }, { merge: true });

        if (score + (selectedAnswer === currentExamQuestion.correctAnswer ? 1 : 0) >= 4) {
          setModalMessage("Congratulations! You've passed the exam!");
        } else {
          setModalMessage("You didn't pass the exam. You need at least 4 correct answers to pass.");
        }
      }
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/investing-course-results');
  };

  return (
    <div className="investing-course-exam">
      <header className="investing-course-exam-header">
        <img src={require('../../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="investing-course-exam-logo" />
        <nav className="investing-course-exam-nav">
          <button onClick={() => navigate('/portfolio-display')} className="investing-course-exam-nav-link">
            Back to Portfolio
          </button>
        </nav>
      </header>

      <main className="investing-course-exam-main">
        <div className="investing-course-exam-progress">
          <div 
            className="investing-course-exam-progress-bar"
            style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}
          ></div>
        </div>

        <div className="investing-course-exam-content">
          <h1 className="investing-course-exam-title">
            Final Exam
          </h1>
          
          <div className="investing-course-exam-question">
            <h2>Question {currentQuestion + 1} of {examQuestions.length}</h2>
            <p>{examQuestions[currentQuestion].question}</p>
            <div className="investing-course-exam-options">
              {examQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="investing-course-exam-option"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="investing-course-exam-modal">
          <div className="investing-course-exam-modal-content">
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal}>View Results</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestingCourseExam; 