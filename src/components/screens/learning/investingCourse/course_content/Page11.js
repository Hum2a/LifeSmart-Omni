import React from 'react';
import './styles/CoursePage.css';

const Page11 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <div className="course-image-container">
        <img 
          src={process.env.PUBLIC_URL + '/images/Investing mini course/11.png'} 
          alt="Course Summary" 
          className="course-image"
        />
      </div>
      <div className="course-navigation">
        <button onClick={onComplete} className="next-button">
          Complete Course
          <i className="fas fa-check"></i>
        </button>
      </div>
    </div>
  );
};

export default Page11; 