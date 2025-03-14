import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupCreation.css';

const GroupCreation = () => {
  const navigate = useNavigate();
  const [teamCount, setTeamCount] = useState(1);
  const [teams, setTeams] = useState([""]);
  const maxTeams = 10000;

  const increaseTeams = () => {
    if (teamCount < maxTeams) {
      setTeamCount(teamCount + 1);
      setTeams([...teams, ""]);
    }
  };

  const decreaseTeams = () => {
    if (teamCount > 1) {
      setTeamCount(teamCount - 1);
      setTeams(teams.slice(0, -1));
    }
  };

  const handleTeamNameChange = (index, value) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  };

  const startSimulation = () => {
    if (teams.every(name => name.trim())) {
      navigate(`/simulation-page?teams=${teams.join(',')}`);
    }
  };

  return (
    <div className="group-creation">
      <header className="header">
        <h1 className="header-title">Create Simulation Groups</h1>
      </header>

      <main className="main-content">
        <div className="simulation-intro">
          <h2>Financial Simulation</h2>
          <p>
            Welcome to the Financial Simulation! In this activity, you'll make financial decisions 
            and see how they impact your wealth over time. Create teams to compete and learn about 
            investing, saving, and managing debt.
          </p>
        </div>

        <div className="team-details">
          <div className="team-number">
            <label htmlFor="teamCount">NUMBER OF TEAMS</label>
            <div className="team-controls">
              <button onClick={decreaseTeams} className="team-control-button">-</button>
              <input type="text" value={teamCount} id="teamCount" className="team-count-display" readOnly />
              <button onClick={increaseTeams} className="team-control-button">+</button>
            </div>
          </div>

          <div className="team-names">
            <label>TEAM NAMES</label>
            {Array.from({ length: teamCount }).map((_, index) => (
              <div key={index} className="team-name-input-container">
                <input 
                  value={teams[index]} 
                  onChange={(e) => handleTeamNameChange(index, e.target.value)} 
                  type="text" 
                  placeholder="Enter team name" 
                  className="team-input" 
                />
              </div>
            ))}
          </div>

          <button 
            onClick={startSimulation} 
            className="button start-button" 
            disabled={teams.some(name => !name)}
          >
            Start Simulation
          </button>
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">© 2024 Life Smart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GroupCreation; 