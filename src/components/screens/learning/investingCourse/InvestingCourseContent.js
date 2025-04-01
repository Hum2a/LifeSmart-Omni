import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './styles/InvestingCourseContent.css';

// Import course pages
import CoursePage1 from './course_content/Page1';
import CoursePage2 from './course_content/Page2';
import CoursePage3 from './course_content/Page3';
import CoursePage4 from './course_content/Page4';
import CoursePage5 from './course_content/Page5';
import CoursePage6 from './course_content/Page6';
import CoursePage7 from './course_content/Page7';
import CoursePage8 from './course_content/Page8';
import CoursePage9 from './course_content/Page9';
import CoursePage10 from './course_content/Page10';
import CoursePage11 from './course_content/Page11';

const InvestingCourseContent = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 11;
  const navigate = useNavigate();

  const pages = {
    1: CoursePage1,
    2: CoursePage2,
    3: CoursePage3,
    4: CoursePage4,
    5: CoursePage5,
    6: CoursePage6,
    7: CoursePage7,
    8: CoursePage8,
    9: CoursePage9,
    10: CoursePage10,
    11: CoursePage11
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleComplete = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Update course content completion status
      const courseRef = doc(db, user.uid, 'Financial Literacy Courses', 'Basics of Investing', 'Course Content');
      await setDoc(courseRef, {
        Completed: true
      });

      // Update total funds
      const fundsRef = doc(db, user.uid, 'Total Funds');
      const fundsDoc = await getDoc(fundsRef);
      
      if (fundsDoc.exists()) {
        const currentFunds = fundsDoc.data().totalFunds || 0;
        await updateDoc(fundsRef, {
          totalFunds: currentFunds + 100
        });
      }

      if (onComplete) {
        onComplete();
      }

      // Navigate back to the investing course page
      navigate('/investing-course');
    }
  };

  const CurrentPageComponent = pages[currentPage];

  return (
    <div className="content-container">
      <TransitionGroup>
        <CSSTransition
          key={currentPage}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <div className="investing-course-content-page">
            <CurrentPageComponent 
              onNext={handleNext} 
              onComplete={handleComplete}
            />
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default InvestingCourseContent; 