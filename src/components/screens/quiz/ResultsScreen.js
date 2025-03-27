import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultsScreen.css';

const ResultsScreen = ({ teams, quizComplete, onNextQuestion }) => {
  const [barWidths, setBarWidths] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);
  const navigate = useNavigate();
  const maxPoints = 23;

  // Calculate sorted and ranked teams
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const rankedTeams = sortedTeams.map((team, index) => {
    const rank = index > 0 && team.points === sortedTeams[index - 1].points
      ? rankedTeams[index - 1].rank
      : index + 1;
    return { ...team, rank };
  });

  const calculateBarWidth = (points) => {
    return (points / maxPoints) * 100;
  };

  const toggleTeamExpansion = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  const goHome = () => {
    navigate('/');
  };

  const nextOrNavigateToSimulation = () => {
    if (quizComplete) {
      navigate('/quiz-simulation');
    } else {
      onNextQuestion();
    }
  };

  useEffect(() => {
    // Set initial widths to 0 for animation
    const initialWidths = {};
    sortedTeams.forEach(team => {
      initialWidths[team.name] = 0;
    });
    setBarWidths(initialWidths);

    // Animate bar widths with cascading delays
    setTimeout(() => {
      sortedTeams.forEach((team, index) => {
        setTimeout(() => {
          setBarWidths(prev => ({
            ...prev,
            [team.name]: calculateBarWidth(team.points)
          }));
        }, index * 300);
      });
    }, 200);
  }, [sortedTeams]);

  return (
    <div className="results-container">
      <button onClick={goHome} className="home-button">Go to Home</button>
      <button onClick={() => navigate('/quiz-simulation')} className="simulation-button">
        Go to Simulation
      </button>
      
      <h2 className="title">Scoreboard</h2>

      <div className="content-wrapper">
        <div className="team-results">
          {rankedTeams.map((team, index) => (
            <div
              key={team.name}
              className={`team-bar-container ${expandedTeam === team.name ? 'expanded' : ''} ${team.rank === 1 ? 'winning-team' : ''}`}
              style={{
                backgroundColor: team.rank === 1 ? '#C5FF9A' : '',
                color: team.rank === 1 ? 'black' : ''
              }}
              onClick={() => toggleTeamExpansion(team.name)}
            >
              <div className="team-bar">
                <p className="team-name">
                  {team.rank}. {team.name}
                  {team.rank === 1 && (
                    <img src="/assets/icons/crown.png" alt="Crown" className="crown-icon" />
                  )}
                </p>
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{
                      width: `${barWidths[team.name]}%`,
                      transitionDelay: `${index * 0.2}s`
                    }}
                  />
                </div>
                <div className="points-info">
                  <p className="points" style={{ color: team.rank === 1 ? 'black' : 'white' }}>
                    ⚡ {team.points}
                  </p>
                </div>
              </div>

              {expandedTeam === team.name && (
                <div className="team-points-breakdown">
                  <table>
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(team.taskScores || {}).map(([task, points]) => (
                        <tr key={task}>
                          <td>Task {task}</td>
                          <td>{points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          
          <div className="next-button-container">
            <button className="next-button" onClick={nextOrNavigateToSimulation}>
              {quizComplete ? 'See Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen; 