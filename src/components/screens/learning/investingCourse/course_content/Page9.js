import React from 'react';
import './styles/CoursePage.css';

const Page9 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <div className="course-image-container">
        <img 
          src={process.env.PUBLIC_URL + '/images/Investing mini course/9.png'} 
          alt="Investment Risks" 
          className="course-image"
        />
      </div>
      <div className="course-navigation">
        <button onClick={onNext} className="next-button">
          Next
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Page9; 