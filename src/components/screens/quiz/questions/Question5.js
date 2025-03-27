import React, { useState, useEffect } from 'react';
import './Question5.css';

const Question5 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(300);
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
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill([]));

  const answerOptions = [
    'A: Paying bills and payments on time',
    'B: Registering on the electoral roll',
    'C: Frequently applying for new credit',
    'D: Paying off or maintaining low levels of debt',
    'E: Keeping a bank account open for many years',
    'F: Maxing out your credit cards regularly',
    'G: Avoiding frequent credit applications',
    'H: Moving house regularly'
  ];

  const correctAnswers = [0, 1, 3, 4, 6]; // Correct answers: A, B, D, E, G

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
  const progressBarWidth = (timer / 300) * 100;

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
    if (term === 'creditRating') {
      setGlossaryTitle('Credit Rating');
      setGlossaryContent('A score that everyone has, that tells banks how good you are at paying back money. If you have a high score, banks think you\'re good at paying back and are more likely to lend you money.');
    }
  };

  const toggleTeamAnswer = (teamIndex, optionIndex) => {
    const newAnswers = [...teamAnswers];
    const answers = [...newAnswers[teamIndex]];
    const answerPosition = answers.indexOf(optionIndex);

    if (answerPosition === -1) {
      answers.push(optionIndex);
    } else {
      answers.splice(answerPosition, 1);
    }
    newAnswers[teamIndex] = answers;
    setTeamAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const calculateScore = (index) => {
    const answers = teamAnswers[index] || [];
    let score = 0;
    answers.forEach((answer) => {
      if (correctAnswers.includes(answer)) {
        score += 1;
      }
    });
    return score;
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map((answers, index) => calculateScore(index));
    onAwardPoints(pointsArray);
    onNextQuestion();
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
            <h3>Challenge 5</h3>
            <img src="/assets/Lightning Bolt.png" alt="Lightning Bolt" className="lightning-bolt" />
            <p className="points">5 points</p>
          </div>
          <div className="button-container">
            {/* <button className="hint-button" onClick={() => setShowHintModal(true)}>Hint?</button> */}
          </div>
        </div>
        <div>
          <p>
            Ben decides he wants to get another loan in the future, so he would like to improve his
            <span className="hoverable-term"
                  onMouseOver={(e) => showHoverModal('Credit Rating', 'A score that everyone has, that tells banks how good you are at paying back money. If you have a high score, banks think you\'re good at paying back and are more likely to lend you money.', e)}
                  onMouseLeave={hideHoverModal}>
              <strong>credit rating</strong>
            </span>.
          </p>
          <img src="/assets/moneyhandshake.png" alt="Task 5 Image" className="task-image" />
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

      {/* Question Section */}
      <div className="question-section">
        <p className="question-section">
          Which of the following things improve your
          <span className="hoverable-term"
                onMouseOver={(e) => showHoverModal('Credit Rating', 'A score that everyone has, that tells banks how good you are at paying back money. If you have a high score, banks think you\'re good at paying back and are more likely to lend you money.', e)}
                onMouseLeave={hideHoverModal}>
            <strong>credit rating</strong>
          </span>?
        </p>
      </div>

      {/* Answer Options and Team Selection */}
      {!showResults ? (
        <div>
          {/* Answer Options */}
          <div className="answer-options">
            {answerOptions.map((option, index) => (
              <div key={index} className="answer-option">
                <p>{option}</p>
              </div>
            ))}
          </div>

          {/* Teams Answer Selection */}
          <div className="teams-selection">
            {teams.map((team, teamIndex) => (
              <div key={teamIndex} className="team-selection">
                <h4>{team.name}</h4>
                <div className="team-options">
                  {answerOptions.map((_, index) => (
                    <button
                      key={index}
                      className={`${teamAnswers[teamIndex]?.includes(index) ? 'selected' : ''}`}
                      onClick={() => toggleTeamAnswer(teamIndex, index)}
                    >
                      {String.fromCharCode(65 + index)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button className="submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="results-section">
          {/* Updated answer options with correct/incorrect indicators */}
          <div className="answer-options">
            {answerOptions.map((option, index) => (
              <div
                key={index}
                className={`answer-option ${correctAnswers.includes(index) ? 'correct' : 'incorrect'}`}
              >
                <p>{option}</p>
              </div>
            ))}
          </div>

          {/* Team Results */}
          <div className="teams-results">
            {teams.map((team, index) => (
              <div key={index} className="team-result">
                <h4>{team.name}</h4>
                {teamAnswers[index]?.map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className={correctAnswers.includes(answer) ? 'correct' : 'incorrect'}
                  >
                    {String.fromCharCode(65 + answer)}
                  </div>
                ))}
                <p>Points: {calculateScore(index)}</p>
              </div>
            ))}
          </div>

          {/* Next Button */}
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

export default Question5; 