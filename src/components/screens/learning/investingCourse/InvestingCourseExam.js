import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseQuestion1 from './questions/Question1';
import CourseQuestion2 from './questions/Question2';
import CourseQuestion3 from './questions/Question3';
import CourseQuestion4 from './questions/Question4';
import CourseQuestion5 from './questions/Question5';
import CourseQuestion6 from './questions/Question6';
import CourseQuestion7 from './questions/Question7';
import CourseQuestion8 from './questions/Question8';
import CourseQuestion9 from './questions/Question9';
import CourseQuestion10 from './questions/Question10';
import ExamResults from './InvestingCourseExamResults';
import './styles/InvestingCourse.css';

const InvestingCourseExam = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const totalPages = 10;

  const nextQuestion = async (answer) => {
    console.log(`nextQuestion called with answer: ${answer}`);
    console.log(`Current page before increment: ${currentPage}`);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      console.log(`Current page after increment: ${currentPage + 1}`);
    } else {
      completeExam();
    }
  };

  const completeExam = () => {
    console.log('Exam completed');
    setShowResults(true);
  };

  const backToCourse = () => {
    console.log('Back to course');
    navigate('/investing-course');
  };

  const renderCurrentQuestion = () => {
    const questionComponents = {
      1: CourseQuestion1,
      2: CourseQuestion2,
      3: CourseQuestion3,
      4: CourseQuestion4,
      5: CourseQuestion5,
      6: CourseQuestion6,
      7: CourseQuestion7,
      8: CourseQuestion8,
      9: CourseQuestion9,
      10: CourseQuestion10
    };

    const QuestionComponent = questionComponents[currentPage];
    return QuestionComponent ? <QuestionComponent onAnswered={nextQuestion} /> : null;
  };

  return (
    <div className="exam-container">
      <div className="fade-transition">
        {!showResults ? (
          renderCurrentQuestion()
        ) : (
          <ExamResults onBackToCourse={backToCourse} />
        )}
      </div>
    </div>
  );
};

export default InvestingCourseExam; 