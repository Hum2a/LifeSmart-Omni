import React from 'react';
import './QuestionTemplate.css';

const QuestionTemplate = ({ question, onAnswered }) => {
  const selectAnswer = (option) => {
    onAnswered(option);
  };

  return (
    <div className="question-container">
      <h2 className="question-text">{question.text}</h2>
      <ul className="options-list">
        {question.options.map((option, index) => (
          <li key={index} className="option-item">
            <button 
              onClick={() => selectAnswer(option)} 
              className="option-button"
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionTemplate; 