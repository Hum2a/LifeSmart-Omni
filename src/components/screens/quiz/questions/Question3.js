import React, { useState } from 'react';

const Question3 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionSelect = (index) => {
    if (!showFeedback) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === 2; // Index of correct answer (Government bonds)
    setShowFeedback(true);
    
    // Award points based on correct answer
    const points = teams.map(() => isCorrect ? 1 : 0);
    onAwardPoints(points);
  };

  const styles = {
    questionContainer: {
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      color: '#003F91',
      fontSize: '1.5rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    scenario: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem',
    },
    scenarioText: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      color: '#495057',
      margin: 0,
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    option: {
      padding: '1rem',
      border: '2px solid transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8f9fa',
      textAlign: 'left',
      fontSize: '1rem',
      width: '100%',
    },
    optionSelected: {
      backgroundColor: '#B8CEF0',
      borderColor: '#003F91',
    },
    optionCorrect: {
      backgroundColor: '#d4edda',
      borderColor: '#28a745',
      color: '#155724',
    },
    optionIncorrect: {
      backgroundColor: '#f8d7da',
      borderColor: '#dc3545',
      color: '#721c24',
    },
    feedback: {
      marginTop: '1.5rem',
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
    },
    feedbackText: {
      marginBottom: '1rem',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    },
    explanation: {
      color: '#495057',
      lineHeight: '1.5',
    },
    button: {
      backgroundColor: '#003F91',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '1.5rem',
      width: '100%',
    },
    buttonHover: {
      backgroundColor: '#002a61',
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  };

  const getOptionStyle = (index) => {
    if (!showFeedback) {
      return {
        ...styles.option,
        ...(selectedOption === index ? styles.optionSelected : {})
      };
    }
    
    if (index === 2) { // Correct answer
      return { ...styles.option, ...styles.optionCorrect };
    }
    
    if (selectedOption === index) {
      return { ...styles.option, ...styles.optionIncorrect };
    }
    
    return styles.option;
  };

  return (
    <div style={styles.questionContainer}>
      <h2 style={styles.title}>Question 3: Investment Risk</h2>
      
      <div style={styles.scenario}>
        <p style={styles.scenarioText}>
          Which of these investment options typically carries the LOWEST risk?
        </p>
      </div>

      <div style={styles.optionsContainer}>
        <button 
          style={getOptionStyle(0)}
          onClick={() => handleOptionSelect(0)}
          disabled={showFeedback}
        >
          Individual stocks
        </button>
        
        <button 
          style={getOptionStyle(1)}
          onClick={() => handleOptionSelect(1)}
          disabled={showFeedback}
        >
          Cryptocurrency
        </button>
        
        <button 
          style={getOptionStyle(2)}
          onClick={() => handleOptionSelect(2)}
          disabled={showFeedback}
        >
          Government bonds
        </button>
        
        <button 
          style={getOptionStyle(3)}
          onClick={() => handleOptionSelect(3)}
          disabled={showFeedback}
        >
          Real estate investment trusts
        </button>
      </div>

      {showFeedback ? (
        <div style={styles.feedback}>
          <p style={{
            ...styles.feedbackText,
            color: selectedOption === 2 ? '#155724' : '#721c24'
          }}>
            {selectedOption === 2 ? 'Correct!' : 'Incorrect!'}
          </p>
          <p style={styles.explanation}>
            Government bonds, particularly those issued by stable governments, are generally considered 
            the safest investment option. They offer lower returns compared to other investments but 
            provide a guaranteed return and are backed by the full faith and credit of the issuing 
            government. Stocks, cryptocurrencies, and REITs all carry higher levels of risk due to 
            market volatility and other factors.
          </p>
          <button 
            style={styles.button}
            onClick={onNextQuestion}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            Next
          </button>
        </div>
      ) : (
        <button 
          style={{
            ...styles.button,
            ...(selectedOption === null ? styles.buttonDisabled : {})
          }}
          onClick={handleSubmit}
          disabled={selectedOption === null}
          onMouseOver={(e) => {
            if (selectedOption !== null) {
              e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
            }
          }}
          onMouseOut={(e) => {
            if (selectedOption !== null) {
              e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
            }
          }}
        >
          Submit Answer
        </button>
      )}
    </div>
  );
};

export default Question3; 