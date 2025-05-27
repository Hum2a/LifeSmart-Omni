import React, { useState, useEffect } from 'react';
import './Question1.css';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import q1Image from '../../../../assets/icons/q1image.png';
import { MdFlashOn } from 'react-icons/md';

const Question1 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverTerm, setHoverTerm] = useState(null);
  const [hoverContent, setHoverContent] = useState('');
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const [showHoverModal, setShowHoverModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));

  const correctAnswer = 'A';

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
  const progressBarWidth = (timer / 180) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const showModal = (term, event) => {
    if (term === 'assets') {
      setModalTitle('Assets');
      setModalContent('Assets are things you own that have monetary value, such as cash, property, or investments.');
    } else if (term === 'liabilities') {
      setModalTitle('Liabilities');
      setModalContent('Liabilities are things you owe, such as debts or financial obligations.');
    }
    setShowHoverModal(true);

    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY - 60,
      left: rect.left + window.scrollX + 20,
    });
  };

  const hideModal = () => {
    setShowHoverModal(false);
  };

  const showDefinition = (term, event) => {
    setHoverTerm(term);
    if (term === 'assets') {
      setHoverContent('Things you own that are worth money.');
    } else if (term === 'liabilities') {
      setHoverContent('Money you owe to someone else.');
    }
    const rect = event.target.getBoundingClientRect();
    setBubblePosition({
      top: rect.top + window.scrollY - 40,
      left: rect.left + window.scrollX + 10
    });
  };

  const hideDefinition = () => {
    setHoverTerm(null);
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => {
      if (answer === 'A') return 3;
      if (answer === 'B' || answer === 'C') return 2;
      if (answer === 'D' || answer === 'E') return 1;
      return 0;
    });
    onAwardPoints(pointsArray);
  };

  const nextQuestion = () => {
    onNextQuestion();
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="question1-container">
      {/* Progress Bar Container */}
      <div className="question1-progress-bar-container">
        <div className="question1-progress-bar">
          <div className="question1-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        
        <div className="question1-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question1-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question1-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Header */}
      <div className="question1-task-header">
        <div className="question1-header-content">
          <div className="question1-points-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ margin: 0 }}>Challenge 1</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MdFlashOn size={32} color="#0b57bd" style={{ verticalAlign: 'middle' }} />
              <span className="question1-points">3 points</span>
            </span>
          </div>
          <div className="question1-button-container">
            <button className="question1-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <img src={q1Image} alt="Task 1 Image" className="question1-task-image" />
        <p>
          The year is 2150. Zara, an 18-year-old, has just arrived at the New Horizon Colony on Mars. 
          She's given 10,000 Mars Credits (MC) to start her new life. Her task is to allocate these funds 
          across four categories:
        </p>
        <div className="question1-category-cards-container">
          <div className="question1-category-card">
            <span role="img" aria-label="Habitat" className="question1-category-icon">🏠</span>
            <div>
              <div className="question1-category-title">Habitat</div>
              <div className="question1-category-desc">Life pod, air recycling</div>
            </div>
          </div>
          <div className="question1-category-card">
            <span role="img" aria-label="Life-Support" className="question1-category-icon">💧</span>
            <div>
              <div className="question1-category-title">Life-Support</div>
              <div className="question1-category-desc">Food, water, utilities</div>
            </div>
          </div>
          <div className="question1-category-card">
            <span role="img" aria-label="Safety Fund" className="question1-category-icon">🛡️</span>
            <div>
              <div className="question1-category-title">Safety Fund</div>
              <div className="question1-category-desc">Unexpected repairs</div>
            </div>
          </div>
          <div className="question1-category-card">
            <span role="img" aria-label="Exploration & Fun" className="question1-category-icon">🚀</span>
            <div>
              <div className="question1-category-title">Exploration & Fun</div>
              <div className="question1-category-desc">Holo-games, rover trips</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {showResults ? (
        <div className="question1-result-section">
          <h4>Correct Answer:</h4>
          <p className="question1-correct-answer">Option A: Habitat – 30%, Life-Support – 20%, Safety Fund – 20%, Exploration and Fun – 30%</p>
          <p className="question1-correct-answer-description">This follows the 50/30/20 rule:</p>
          <div className="question1-explanation-cards-container">
            <div className="question1-explanation-card needs">
              <div className="question1-explanation-label">Needs</div>
              <div className="question1-explanation-main">Habitat + Life-Support ≈ 50%</div>
              <div className="question1-explanation-desc">Keeps Zara safe and healthy</div>
            </div>
            <div className="question1-explanation-card savings">
              <div className="question1-explanation-label">Savings</div>
              <div className="question1-explanation-main">Safety Fund ≈ 20%</div>
              <div className="question1-explanation-desc">Builds an emergency cushion for Mars mishaps</div>
            </div>
            <div className="question1-explanation-card wants">
              <div className="question1-explanation-label">Wants</div>
              <div className="question1-explanation-main">Exploration & Fun ≈ 30%</div>
              <div className="question1-explanation-desc">Leaves room for enjoyment without derailing her budget</div>
            </div>
          </div>
          <h4 className="question1-your-answers">Your answers</h4>

          <div className="question1-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question1-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question1-correct' : 'question1-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question1-next-button" onClick={nextQuestion}>Next</button>
        </div>
      ) : (
        <div>
          {/* Question Section */}
          <div className="question1-question-section">
            <p className="question1-question">Decide the best allocation for how she should spend her money:</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question1-choices-container">
            <button className="question1-choice-button">A. Habitat – 30%, Life-Support – 20%, Safety Fund – 20%, Exploration and Fun – 30%</button>
            <button className="question1-choice-button">B. Habitat – 15%, Life-Support – 30%, Safety Fund – 30%, Exploration and Fun – 25%</button>
            <button className="question1-choice-button">C. Habitat – 25%, Life-Support – 30%, Safety Fund – 30%, Exploration and Fun – 15%</button>
            <button className="question1-choice-button">D. Habitat – 30%, Life-Support – 30%, Safety Fund – 35%, Exploration and Fun – 5%</button>
            <button className="question1-choice-button">E. Habitat – 25%, Life-Support – 20%, Safety Fund – 5%, Exploration and Fun – 50%</button>
          </div>

          {/* Team Answer Section */}
          <div className="question1-team-answer-section">
            <h4>Your answers</h4>
            <div className="question1-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question1-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question1-team-answer-select"
                  >
                    <option value="">Select an answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              ))}
            </div>
            <button 
              className="question1-submit-button" 
              onClick={submitAnswers}
              disabled={teamAnswers.some(answer => !answer)}
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question1; 