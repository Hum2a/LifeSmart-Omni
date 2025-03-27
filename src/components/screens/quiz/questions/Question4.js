import React, { useState, useEffect } from 'react';
import './Question4.css';

const Question4 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
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

  const correctAnswer = 'D';

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
    <div className="question-container">
      {/* Header and Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="task-header">
        <div className="top-layer">
          <div className="points-section">
            <h3>Challenge 4</h3>
            <img src="/assets/icons/Lightning Bolt.png" alt="Lightning Bolt" className="lightning-bolt" />
            <p className="points">2 points</p>
          </div>
          <div className="button-container">
            {/* <button className="hint-button" onClick={() => setShowHintModal(true)}>Hint?</button> */}
          </div>
        </div>
        <div className="task-header-question">
          <p>
            Ben decides to use £500 a month of his savings and invest in a
            <span className="clickable-term"
                  onMouseOver={(e) => showHoverModal('Stocks Fund Portfolio', 'A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn\'t do well, others in the basket might still grow!', e)}
                  onMouseLeave={hideHoverModal}>
              <strong>stocks fund portfolio</strong>
            </span>.
            He chooses the '
            <span className="clickable-term"
                  onMouseOver={(e) => showHoverModal('S&P 500', 'A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you\'re buying a little piece of each of those 500 companies.', e)}
                  onMouseLeave={hideHoverModal}>
              <strong>S&P500 Fund</strong>
            </span>' because it is predicted to return 8%.
          </p>
          <img src="/assets/icons/moneybars.png" alt="Task 4 Image" className="task-image" />
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="glossary-sidebar">
          <div className="glossary-header">
            <h2>{glossaryTitle}</h2>
            <button className="close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="glossary-content">
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="hint-modal-overlay">
          <div className="hint-modal">
            <h3>Hint</h3>
            <p>Net worth = Total Assets – Total Liabilities</p>
            <button onClick={() => setShowHintModal(false)} className="close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Question and Points Section */}
      <div className="question-section">
        <p className="question-text">
          If he continues to put in £500 a month and the fund has a return of 8%
          <span className="clickable-term"
                onMouseOver={(e) => showHoverModal('Annually', 'The return rate is calculated based on a yearly period. For example, an 8% annual return means an 8% increase over one year.', e)}
                onMouseLeave={hideHoverModal}>
            <strong>annually</strong>
          </span>, approximately how much money will he have after 10 years?
        </p>
      </div>

      {/* Multiple Choice Options */}
      {!showResults && (
        <div className="choices-container">
          <button className="choice-button" onClick={() => handleTeamAnswerChange(0, 'A')}>A. £25,000</button>
          <button className="choice-button" onClick={() => handleTeamAnswerChange(0, 'B')}>B. £40,000</button>
          <button className="choice-button" onClick={() => handleTeamAnswerChange(0, 'C')}>C. £55,000</button>
          <button className="choice-button" onClick={() => handleTeamAnswerChange(0, 'D')}>D. £90,000</button>
          <button className="choice-button" onClick={() => handleTeamAnswerChange(0, 'E')}>E. £120,000</button>
        </div>
      )}

      {/* Team Answer Section */}
      {!showResults && (
        <div className="team-answer-section">
          <h4>Your answers</h4>
          <div className="team-answer-container">
            {teams.map((team, index) => (
              <div key={team.name} className="team-answer-box">
                <p>{team.name}</p>
                <select
                  value={teamAnswers[index]}
                  onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                  className="answer-select"
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
          <button className="submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      )}

      {/* Result Section */}
      {showResults && (
        <div className="result-section">
          <h4>Correct Answer:</h4>
          <p className="correct-answer">£90,000</p>
          <p onClick={toggleDetailedAnswer} className="toggle-detailed-answer">
            Click to {detailedAnswerShown ? 'hide detailed answer ⬆' : 'see detailed answer ⬇'}
          </p>

          {/* Detailed Answer with Calculator Widget */}
          {detailedAnswerShown && (
            <div>
              {/* Investment Calculator component will be added here */}
            </div>
          )}

          {/* Team Answer Comparison */}
          <div className="team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="team-answer-box">
                <p>{team.name}</p>
                <div className={`points-earned ${teamAnswers[index] === correctAnswer ? 'correct' : 'incorrect'}`}>
                  {teamAnswers[index] === correctAnswer ? '3' : '0'} points
                </div>
              </div>
            ))}
          </div>
          <button className="next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question4; 