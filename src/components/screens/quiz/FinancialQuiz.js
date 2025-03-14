import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';
import Question4 from './questions/Question4';
import Question5 from './questions/Question5';
import Question6 from './questions/Question6';
import '../../styles/FinancialQuiz.css';

const FinancialQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = [
    Question1,
    Question2,
    Question3,
    Question4,
    Question5,
    Question6
  ];

  useEffect(() => {
    // Parse teams from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const teamsParam = searchParams.get('teams');
    
    if (teamsParam) {
      const teamsList = teamsParam.split(',');
      setTeams(teamsList);
      
      // Initialize scores for each team
      const initialScores = {};
      teamsList.forEach(team => {
        initialScores[team] = 0;
      });
      setScores(initialScores);
    } else {
      // If no teams are provided, redirect back to the landing page
      navigate('/quiz-landing');
    }
  }, [location.search, navigate]);

  const handleAnswer = (answer) => {
    console.log("Team answered:", answer);
  };

  const updateScores = (points) => {
    setScores(prevScores => {
      const newScores = { ...prevScores };
      teams.forEach((team, index) => {
        newScores[team] += points[index] || 0;
      });
      return newScores;
    });
    setShowResults(true);
  };

  const nextQuestion = () => {
    setShowResults(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const finishQuiz = () => {
    navigate(`/quiz-simulation?teams=${teams.join(',')}&scores=${JSON.stringify(scores)}`);
  };

  if (teams.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  if (quizComplete) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Complete!</h2>
        <div className="final-scores">
          <h3>Final Scores:</h3>
          {Object.entries(scores).map(([team, score]) => (
            <div key={team} className="team-score">
              <span className="team-name">{team}:</span>
              <span className="score">{score} points</span>
            </div>
          ))}
        </div>
        <button onClick={finishQuiz} className="button continue-button">
          Continue to Simulation
        </button>
      </div>
    );
  }

  const CurrentQuestionComponent = questions[currentQuestion];

  return (
    <div className="financial-quiz">
      <header className="quiz-header">
        <h1>Financial Quiz</h1>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </header>

      <main className="quiz-content">
        {showResults ? (
          <div className="results-screen">
            <h2>Current Standings</h2>
            <div className="scores">
              {Object.entries(scores)
                .sort(([,a], [,b]) => b - a)
                .map(([team, score]) => (
                  <div key={team} className="team-score">
                    <span className="team-name">{team}:</span>
                    <span className="score">{score}</span>
                  </div>
                ))}
            </div>
            <button onClick={nextQuestion} className="button next-button">
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        ) : (
          <CurrentQuestionComponent
            teams={teams}
            onAnswer={handleAnswer}
            onNextQuestion={() => setShowResults(true)}
            onAwardPoints={updateScores}
          />
        )}
      </main>

      <footer className="quiz-footer">
        <div className="scores">
          {Object.entries(scores).map(([team, score]) => (
            <div key={team} className="team-score">
              <span className="team-name">{team}:</span>
              <span className="score">{score}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default FinancialQuiz; 