import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth, db } from '../../../../../firebase/initFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/InvestingCourseExamResults.css';

const InvestingCourseExamResults = () => {
  const navigate = useNavigate();
  const [examResults, setExamResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExamResults();
  }, []);

  const fetchExamResults = async () => {
    try {
      const user = firebaseAuth.currentUser;
      if (user) {
        const examResultsRef = doc(db, user.uid, 'Exam Results');
        const examResultsSnap = await getDoc(examResultsRef);
        
        if (examResultsSnap.exists() && examResultsSnap.data()['Investing Course Exam']) {
          setExamResults(examResultsSnap.data()['Investing Course Exam']);
          
          // If passed the exam, update total funds
          if (examResultsSnap.data()['Investing Course Exam'].score >= 4) {
            const fundsRef = doc(db, user.uid, 'Total Funds');
            const fundsSnap = await getDoc(fundsRef);
            if (fundsSnap.exists()) {
              const currentFunds = fundsSnap.data().totalFunds;
              await setDoc(fundsRef, {
                totalFunds: currentFunds + 300
              });
            }
          }
        } else {
          setError('No exam results found');
        }
      }
    } catch (err) {
      setError('Error fetching exam results');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPortfolio = () => {
    navigate('/portfolio-display');
  };

  if (loading) {
    return (
      <div className="investing-course-exam-results">
        <div className="investing-course-exam-results-loading">
          Loading results...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="investing-course-exam-results">
        <div className="investing-course-exam-results-error">
          {error}
        </div>
      </div>
    );
  }

  const percentage = (examResults.score / examResults.totalQuestions) * 100;
  const passed = examResults.score >= 4;

  return (
    <div className="investing-course-exam-results">
      <header className="investing-course-exam-results-header">
        <img src={require('../../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="investing-course-exam-results-logo" />
        <nav className="investing-course-exam-results-nav">
          <button onClick={handleBackToPortfolio} className="investing-course-exam-results-nav-link">
            Back to Portfolio
          </button>
        </nav>
      </header>

      <main className="investing-course-exam-results-main">
        <div className="investing-course-exam-results-content">
          <h1 className="investing-course-exam-results-title">
            Exam Results
          </h1>

          <div className="investing-course-exam-results-card">
            <div className="investing-course-exam-results-score">
              <div className="investing-course-exam-results-percentage">
                {percentage}%
              </div>
              <div className="investing-course-exam-results-details">
                <p>Score: {examResults.score} out of {examResults.totalQuestions}</p>
                <p>Date: {new Date(examResults.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="investing-course-exam-results-status">
              {passed ? (
                <>
                  <h2>Congratulations!</h2>
                  <p>You've passed the exam and earned £300!</p>
                </>
              ) : (
                <>
                  <h2>Not Quite There</h2>
                  <p>You need at least 4 correct answers to pass. Keep practicing!</p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestingCourseExamResults; 