import React, { useState, useEffect } from 'react';
import './Question5.css';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../../../assets/icons/moneybars.png';

const Question5 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(240);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverModal, setHoverModal] = useState({
    show: false,
    title: "",
    content: "",
    x: 0,
    y: 0,
  });
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const [detailedAnswerShown, setDetailedAnswerShown] = useState(false);

  const correctAnswer = 'B';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const progressBarWidth = (timer / 240) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const showHoverModal = (title, content, event) => {
    if (!event) return;
    setHoverModal({
      show: true,
      title,
      content,
      x: event.clientX + 15,
      y: event.clientY + 15
    });
  };

  const hideHoverModal = () => {
    setHoverModal(prev => ({ ...prev, show: false }));
  };

  const openGlossary = (term) => {
    setShowGlossary(true);
    if (term === 'stocksFundPortfolio') {
      setGlossaryTitle('Stocks Fund Portfolio');
      setGlossaryContent('A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn\'t do well, others in the basket might still grow!');
    } else if (term === 'sAndP500') {
      setGlossaryTitle('S&P 500');
      setGlossaryContent('A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you\'re buying a little piece of each of those 500 companies.');
    } else if (term === 'annually') {
      setGlossaryTitle('Annually');
      setGlossaryContent('The return rate is calculated based on a yearly period. For example, an 8% annual return means an 8% increase over one year.');
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 3 : 0));
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const toggleDetailedAnswer = () => {
    setDetailedAnswerShown(!detailedAnswerShown);
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="question5-container">
      {/* Header and Progress Bar */}
      <div className="question5-progress-bar-container">
        <div className="question5-progress-bar">
          <div className="question5-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question5-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question5-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question5-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question5-task-header">
        <div className="question5-top-layer">
          <div className="question5-points-section">
            <h3>Challenge 5</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question5-lightning-bolt" />
            <p className="question5-points">5 points</p>
          </div>
          <div className="question5-button-container">
            <button className="question5-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question5-task-header-question">
          <p>Ben wants to save money for his future. He has £1,000 to invest.</p>
          <img src={moneyBars} alt="Task 5 Image" className="question5-task-image" />
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="question5-glossary-sidebar">
          <div className="question5-glossary-header">
            <h2>{glossaryTitle}</h2>
            <button className="question5-close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="question5-glossary-content">
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question5-hint-modal-overlay">
          <div className="question5-hint-modal">
            <h3>Hint</h3>
            <p>Consider the risk and potential return of each investment option.</p>
            <button onClick={() => setShowHintModal(false)} className="question5-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Conditionally display answer options or result section */}
      {!showResults ? (
        <div>
          {/* Question and Points Section */}
          <div className="question5-question-section">
            <p className="question5-question-text">What should he invest in?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question5-choices-container">
            <button className="question5-choice-button">A. High-risk stocks</button>
            <button className="question5-choice-button">B. Government bonds</button>
            <button className="question5-choice-button">C. Savings account</button>
            <button className="question5-choice-button">D. Cryptocurrency</button>
            <button className="question5-choice-button">E. Real estate</button>
          </div>

          {/* Team Answer Section */}
          <div className="question5-team-answer-section">
            <h4>Your answers</h4>
            <div className="question5-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question5-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question5-answer-select"
                  >
                    <option value="" disabled>Select answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button className="question5-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question5-result-section">
          <h4>Correct Answer:</h4>
          <p className="question5-correct-answer">B. Government bonds</p>
          <p onClick={toggleDetailedAnswer} className="question5-toggle-detailed-answer">
            Click to see detailed answer
            <span>{detailedAnswerShown ? '⬆️' : '⬇️'}</span>
          </p>

          {/* Expanded Answer (Detailed Explanation) */}
          {detailedAnswerShown && (
            <div className="question5-expanded-answer">
              <p>Government bonds are a good choice for Ben because:</p>
              <ul>
                <li>They are low-risk investments</li>
                <li>They provide steady returns</li>
                <li>They are backed by the government</li>
                <li>They are suitable for long-term savings</li>
              </ul>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="question5-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question5-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question5-correct' : 'question5-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question5-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question5-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question5; 