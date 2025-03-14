import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuizSimulation.css';

const QuizSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [teamData, setTeamData] = useState({});
  const totalRounds = 5;

  useEffect(() => {
    // Parse teams and scores from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const teamsParam = searchParams.get('teams');
    const scoresParam = searchParams.get('scores');
    
    if (teamsParam) {
      const teamsList = teamsParam.split(',');
      setTeams(teamsList);
      
      // Initialize team data
      const initialTeamData = {};
      teamsList.forEach(team => {
        initialTeamData[team] = {
          savings: 1000, // Starting amount
          investments: [],
          debt: 0,
          income: 0,
          expenses: 0,
          history: []
        };
      });
      setTeamData(initialTeamData);
      
      // Set scores if available
      if (scoresParam) {
        try {
          const parsedScores = JSON.parse(scoresParam);
          setScores(parsedScores);
        } catch (error) {
          console.error("Error parsing scores:", error);
        }
      }
    } else {
      // If no teams are provided, redirect back to the landing page
      navigate('/quiz-landing');
    }
  }, [location.search, navigate]);

  const handleInvestment = (team, amount, type) => {
    if (amount <= 0 || amount > teamData[team].savings) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].savings -= amount;
      newData[team].investments.push({
        type,
        amount,
        initialValue: amount,
        currentValue: amount,
        round: currentRound
      });
      newData[team].history.push({
        round: currentRound,
        action: `Invested $${amount} in ${type}`,
        change: -amount,
        balance: newData[team].savings
      });
      return newData;
    });
  };

  const handleDebt = (team, amount) => {
    if (amount <= 0) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].savings += amount;
      newData[team].debt += amount;
      newData[team].history.push({
        round: currentRound,
        action: `Took on debt of $${amount}`,
        change: amount,
        balance: newData[team].savings
      });
      return newData;
    });
  };

  const handleIncome = (team, amount) => {
    if (amount <= 0) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].savings += amount;
      newData[team].income += amount;
      newData[team].history.push({
        round: currentRound,
        action: `Earned income of $${amount}`,
        change: amount,
        balance: newData[team].savings
      });
      return newData;
    });
  };

  const handleExpense = (team, amount) => {
    if (amount <= 0 || amount > teamData[team].savings) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].savings -= amount;
      newData[team].expenses += amount;
      newData[team].history.push({
        round: currentRound,
        action: `Spent $${amount} on expenses`,
        change: -amount,
        balance: newData[team].savings
      });
      return newData;
    });
  };

  const nextRound = () => {
    if (currentRound < totalRounds) {
      // Update investments based on market conditions
      updateInvestments();
      setCurrentRound(currentRound + 1);
    } else {
      // Simulation complete
      setSimulationComplete(true);
    }
  };

  const updateInvestments = () => {
    // Simulate market changes for investments
    setTeamData(prevData => {
      const newData = { ...prevData };
      
      teams.forEach(team => {
        newData[team].investments = newData[team].investments.map(investment => {
          // Simple random return between -10% and +20%
          const returnRate = (Math.random() * 0.3) - 0.1;
          const valueChange = investment.currentValue * returnRate;
          const newValue = investment.currentValue + valueChange;
          
          newData[team].history.push({
            round: currentRound,
            action: `${investment.type} investment ${returnRate >= 0 ? 'gained' : 'lost'} ${Math.abs(valueChange.toFixed(2))}`,
            change: 0, // Not affecting savings directly
            balance: newData[team].savings
          });
          
          return {
            ...investment,
            currentValue: newValue
          };
        });
      });
      
      return newData;
    });
  };

  const finishSimulation = () => {
    // Calculate final results and navigate to results page
    navigate('/simulation-results', { 
      state: { 
        teams, 
        teamData,
        quizScores: scores
      } 
    });
  };

  if (teams.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  if (simulationComplete) {
    return (
      <div className="simulation-complete">
        <h2>Simulation Complete!</h2>
        <div className="final-results">
          <h3>Final Results:</h3>
          {teams.map(team => (
            <div key={team} className="team-result">
              <h4>{team}</h4>
              <p>Savings: ${teamData[team].savings.toFixed(2)}</p>
              <p>Total Investments: ${teamData[team].investments.reduce((sum, inv) => sum + inv.currentValue, 0).toFixed(2)}</p>
              <p>Debt: ${teamData[team].debt.toFixed(2)}</p>
              <p>Net Worth: ${(
                teamData[team].savings + 
                teamData[team].investments.reduce((sum, inv) => sum + inv.currentValue, 0) - 
                teamData[team].debt
              ).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <button onClick={finishSimulation} className="button continue-button">
          See Detailed Results
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-simulation">
      <header className="simulation-header">
        <h1>Financial Simulation</h1>
        <div className="simulation-progress">
          Round {currentRound} of {totalRounds}
        </div>
      </header>

      <main className="simulation-content">
        <div className="teams-container">
          {teams.map(team => (
            <div key={team} className="team-panel">
              <h2 className="team-name">{team}</h2>
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">Savings:</span>
                  <span className="stat-value">${teamData[team].savings.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Investments:</span>
                  <span className="stat-value">${teamData[team].investments.reduce((sum, inv) => sum + inv.currentValue, 0).toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Debt:</span>
                  <span className="stat-value">${teamData[team].debt.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Net Worth:</span>
                  <span className="stat-value">${(
                    teamData[team].savings + 
                    teamData[team].investments.reduce((sum, inv) => sum + inv.currentValue, 0) - 
                    teamData[team].debt
                  ).toFixed(2)}</span>
                </div>
              </div>

              <div className="team-actions">
                <div className="action-group">
                  <h3>Investments</h3>
                  <div className="action-buttons">
                    <button onClick={() => handleInvestment(team, 100, 'Stocks')} className="action-button invest-button">
                      Invest $100 in Stocks
                    </button>
                    <button onClick={() => handleInvestment(team, 100, 'Bonds')} className="action-button invest-button">
                      Invest $100 in Bonds
                    </button>
                    <button onClick={() => handleInvestment(team, 100, 'Real Estate')} className="action-button invest-button">
                      Invest $100 in Real Estate
                    </button>
                  </div>
                </div>

                <div className="action-group">
                  <h3>Financial Actions</h3>
                  <div className="action-buttons">
                    <button onClick={() => handleDebt(team, 200)} className="action-button debt-button">
                      Take on $200 Debt
                    </button>
                    <button onClick={() => handleIncome(team, 150)} className="action-button income-button">
                      Earn $150 Income
                    </button>
                    <button onClick={() => handleExpense(team, 100)} className="action-button expense-button">
                      Pay $100 Expenses
                    </button>
                  </div>
                </div>
              </div>

              <div className="team-history">
                <h3>Transaction History</h3>
                <div className="history-list">
                  {teamData[team].history.length > 0 ? (
                    teamData[team].history.map((entry, index) => (
                      <div key={index} className="history-entry">
                        <span className="history-round">Round {entry.round}:</span>
                        <span className="history-action">{entry.action}</span>
                        <span className={`history-change ${entry.change >= 0 ? 'positive' : 'negative'}`}>
                          {entry.change >= 0 ? '+' : ''}{entry.change.toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="no-history">No transactions yet</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={nextRound} className="button next-round-button">
          {currentRound < totalRounds ? `Next Round` : `Complete Simulation`}
        </button>
      </main>
    </div>
  );
};

export default QuizSimulation; 