import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import InvestingCourseContent from './InvestingCourseContent';
import InvestingCourseExam from './InvestingCourseExam';
import './styles/InvestingCourse.css';

const InvestingCourse = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [examEnabled, setExamEnabled] = useState(false);
  const [passed, setPassed] = useState(false);
  const [contentCompleted, setContentCompleted] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  useEffect(() => {
    checkExamEligibility();
  }, []);

  const startCourse = () => {
    setShowContent(true);
    setShowExam(false);
  };

  const startExam = () => {
    setShowExam(true);
    setShowContent(false);
  };

  const checkExamEligibility = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const courseRef = doc(db, user.uid, 'Financial Literacy Courses', 'Basics of Investing', 'Course Content');
      const courseDoc = await getDoc(courseRef);
      if (courseDoc.exists()) {
        setContentCompleted(courseDoc.data().Completed || false);
      }

      const examRef = doc(db, user.uid, 'Financial Literacy Courses', 'Basics of Investing', 'Exam Results');
      const examDoc = await getDoc(examRef);
      if (examDoc.exists()) {
        setPassed(examDoc.data().Passed || false);
      }

      const completeRef = doc(db, user.uid, 'Completed Courses');
      const completeDoc = await getDoc(completeRef);
      if (completeDoc.exists()) {
        setCourseCompleted(completeDoc.data()['Basics of Investing'] || false);
      }

      if (courseCompleted) {
        navigate('/investing-course');
      } else {
        setExamEnabled(contentCompleted && !passed);
      }
    }
  };

  const completeCourse = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const fundsRef = doc(db, user.uid, 'Total Funds');
      const userDoc = await getDoc(fundsRef);

      const ccRef = doc(db, user.uid, 'Completed Courses');
      await setDoc(ccRef, {
        'Basics of Investing': true
      });

      if (userDoc.exists()) {
        const totalFunds = userDoc.data().totalFunds || 0;
        await updateDoc(fundsRef, {
          totalFunds: totalFunds + 100
        });

        navigate('/stock-trading-select');
      }
    }
  };

  const handleComplete = () => {
    checkExamEligibility();
    setShowContent(false);
    setShowExam(false);
  };

  const goBack = () => {
    setShowContent(false);
    setShowExam(false);
  };

  return (
    <div className="investing-course-container">
      <header className="investing-course-header">
        <img src={require('../../../../assets/icons/LifeSmartLogo.png')} alt="LifeSmart Logo" className="investing-course-logo" />
        <nav className="investing-course-header-links">
          <button onClick={() => navigate('/financial-literacy')} className="investing-course-nav-link">
            Back to Home
          </button>
        </nav>
      </header>

      <main className="investing-course-main">
        <div className={`investing-course-fade-transition ${showContent || showExam ? 'investing-course-slide-fade-enter' : ''}`}>
          {!showContent && !showExam && (
            <div className="investing-course-intro-content">
              <div className="investing-course-animate-text">
                <h1>Master the Art of Investing</h1>
                <p>
                  Embark on a journey to financial literacy with our comprehensive investing course. 
                  Learn the fundamentals, develop your strategy, and gain the confidence to make informed investment decisions.
                </p>
              </div>
              <div className="investing-course-buttons">
                <button onClick={startCourse} className="investing-course-animate-button">
                  Start Learning
                </button>
                <button 
                  className={`investing-course-animate-button ${!examEnabled || passed ? 'investing-course-disabled' : ''}`}
                  disabled={!examEnabled || passed}
                  onClick={startExam}
                >
                  Take Exam
                </button>
                {contentCompleted && passed && (
                  <button onClick={completeCourse} className="investing-course-animate-button">
                    Complete Course
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {(showContent || showExam) && (
          <div className="investing-course-slide-fade-enter">
            <button onClick={goBack} className="investing-course-back-button">
              ← Back to Course Overview
            </button>
          </div>
        )}

        {showContent && (
          <div className="investing-course-slide-fade-enter">
            <InvestingCourseContent onComplete={handleComplete} />
          </div>
        )}

        {showExam && (
          <div className="investing-course-slide-fade-enter">
            <InvestingCourseExam onBackToCourse={handleComplete} />
          </div>
        )}
      </main>
    </div>
  );
};

export default InvestingCourse; 