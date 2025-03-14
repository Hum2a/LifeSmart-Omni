import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Simulation.css';

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [teamData, setTeamData] = useState({});
  const totalRounds = 10;

  useEffect(() => {
    // Parse teams from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const teamsParam = searchParams.get('teams');
    
    if (teamsParam) {
      const teamsList = teamsParam.split(',');
      setTeams(teamsList);
      
      // Initialize team data
      const initialTeamData = {};
      teamsList.forEach(team => {
        initialTeamData[team] = {
          cash: 10000,
          stocks: 0,
          bonds: 0,
          realEstate: 0,
          debt: 0,
          income: 0,
          expenses: 0,
          history: []
        };
      });
      setTeamData(initialTeamData);
    } else {
      // If no teams are provided, redirect back to the simulation setup page
      navigate('/simulation');
    }
  }, [location.search, navigate]);

  const handleInvestment = (team, amount, type) => {
    if (amount <= 0 || amount > teamData[team].cash) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].cash -= amount;
      
      switch (type) {
        case 'stocks':
          newData[team].stocks += amount;
          break;
        case 'bonds':
          newData[team].bonds += amount;
          break;
        case 'realEstate':
          newData[team].realEstate += amount;
          break;
        default:
          break;
      }
      
      newData[team].history.push({
        round: currentRound,
        action: `Invested $${amount} in ${type}`,
        change: -amount,
        balance: newData[team].cash
      });
      
      return newData;
    });
  };

  const handleDebt = (team, amount) => {
    if (amount <= 0) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].cash += amount;
      newData[team].debt += amount;
      newData[team].history.push({
        round: currentRound,
        action: `Took on debt of $${amount}`,
        change: amount,
        balance: newData[team].cash
      });
      return newData;
    });
  };

  const handleIncome = (team, amount) => {
    if (amount <= 0) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].cash += amount;
      newData[team].income += amount;
      newData[team].history.push({
        round: currentRound,
        action: `Earned income of $${amount}`,
        change: amount,
        balance: newData[team].cash
      });
      return newData;
    });
  };

  const handleExpense = (team, amount) => {
    if (amount <= 0 || amount > teamData[team].cash) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].cash -= amount;
      newData[team].expenses += amount;
      newData[team].history.push({
        round: currentRound,
        action: `Paid expenses of $${amount}`,
        change: -amount,
        balance: newData[team].cash
      });
      return newData;
    });
  };

  const handleDebtPayment = (team, amount) => {
    if (amount <= 0 || amount > teamData[team].cash || amount > teamData[team].debt) return;

    setTeamData(prevData => {
      const newData = { ...prevData };
      newData[team].cash -= amount;
      newData[team].debt -= amount;
      newData[team].history.push({
        round: currentRound,
        action: `Paid debt of $${amount}`,
        change: -amount,
        balance: newData[team].cash
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
        // Stocks: Higher risk, higher potential return (-15% to +25%)
        const stockReturn = (Math.random() * 0.4) - 0.15;
        const stockChange = newData[team].stocks * stockReturn;
        newData[team].stocks += stockChange;
        
        // Bonds: Lower risk, lower return (-5% to +15%)
        const bondReturn = (Math.random() * 0.2) - 0.05;
        const bondChange = newData[team].bonds * bondReturn;
        newData[team].bonds += bondChange;
        
        // Real Estate: Medium risk, medium return (-10% to +20%)
        const realEstateReturn = (Math.random() * 0.3) - 0.1;
        const realEstateChange = newData[team].realEstate * realEstateReturn;
        newData[team].realEstate += realEstateChange;
        
        // Add interest on debt (5% per round)
        const debtInterest = newData[team].debt * 0.05;
        newData[team].debt += debtInterest;
        
        // Record investment changes in history
        if (stockChange !== 0) {
          newData[team].history.push({
            round: currentRound,
            action: `Stocks ${stockReturn >= 0 ? 'gained' : 'lost'} ${Math.abs(stockChange.toFixed(2))}`,
            change: 0,
            balance: newData[team].cash
          });
        }
        
        if (bondChange !== 0) {
          newData[team].history.push({
            round: currentRound,
            action: `Bonds ${bondReturn >= 0 ? 'gained' : 'lost'} ${Math.abs(bondChange.toFixed(2))}`,
            change: 0,
            balance: newData[team].cash
          });
        }
        
        if (realEstateChange !== 0) {
          newData[team].history.push({
            round: currentRound,
            action: `Real Estate ${realEstateReturn >= 0 ? 'gained' : 'lost'} ${Math.abs(realEstateChange.toFixed(2))}`,
            change: 0,
            balance: newData[team].cash
          });
        }
        
        if (debtInterest > 0) {
          newData[team].history.push({
            round: currentRound,
            action: `Debt increased by $${debtInterest.toFixed(2)} (5% interest)`,
            change: 0,
            balance: newData[team].cash
          });
        }
      });
      
      return newData;
    });
  };

  const calculateNetWorth = (team) => {
    if (!teamData[team]) return 0;
    return teamData[team].cash + teamData[team].stocks + teamData[team].bonds + teamData[team].realEstate - teamData[team].debt;
  };

  const finishSimulation = () => {
    // Navigate to results page
    navigate('/simulation-results', { 
      state: { 
        teams, 
        teamData
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
              <p>Cash: ${teamData[team].cash.toFixed(2)}</p>
              <p>Stocks: ${teamData[team].stocks.toFixed(2)}</p>
              <p>Bonds: ${teamData[team].bonds.toFixed(2)}</p>
              <p>Real Estate: ${teamData[team].realEstate.toFixed(2)}</p>
              <p>Debt: ${teamData[team].debt.toFixed(2)}</p>
              <p>Net Worth: ${calculateNetWorth(team).toFixed(2)}</p>
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
    <div className="simulation">
      <header className="simulation-header">
        <h1>Financial Simulation</h1>
        <div className="simulation-progress">
          Round {currentRound} of {totalRounds}
        </div>
      </header>

      <main className="simulation-content">
        <div className="market-update">
          <h2>Market Update - Round {currentRound}</h2>
          <div className="market-conditions">
            <div className="market-condition">
              <h3>Stock Market</h3>
              <p>Volatility: High</p>
              <p>Potential Return: -15% to +25%</p>
            </div>
            <div className="market-condition">
              <h3>Bond Market</h3>
              <p>Volatility: Low</p>
              <p>Potential Return: -5% to +15%</p>
            </div>
            <div className="market-condition">
              <h3>Real Estate Market</h3>
              <p>Volatility: Medium</p>
              <p>Potential Return: -10% to +20%</p>
            </div>
          </div>
        </div>

        <div className="teams-container">
          {teams.map(team => (
            <div key={team} className="team-panel">
              <h2 className="team-name">{team}</h2>
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">Cash:</span>
                  <span className="stat-value">${teamData[team].cash.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Stocks:</span>
                  <span className="stat-value">${teamData[team].stocks.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Bonds:</span>
                  <span className="stat-value">${teamData[team].bonds.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Real Estate:</span>
                  <span className="stat-value">${teamData[team].realEstate.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Debt:</span>
                  <span className="stat-value">${teamData[team].debt.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Net Worth:</span>
                  <span className="stat-value">${calculateNetWorth(team).toFixed(2)}</span>
                </div>
              </div>

              <div className="team-actions">
                <div className="action-group">
                  <h3>Investments</h3>
                  <div className="action-buttons">
                    <button onClick={() => handleInvestment(team, 1000, 'stocks')} className="action-button invest-button">
                      Invest $1000 in Stocks
                    </button>
                    <button onClick={() => handleInvestment(team, 1000, 'bonds')} className="action-button invest-button">
                      Invest $1000 in Bonds
                    </button>
                    <button onClick={() => handleInvestment(team, 1000, 'realEstate')} className="action-button invest-button">
                      Invest $1000 in Real Estate
                    </button>
                  </div>
                </div>

                <div className="action-group">
                  <h3>Financial Actions</h3>
                  <div className="action-buttons">
                    <button onClick={() => handleDebt(team, 2000)} className="action-button debt-button">
                      Take on $2000 Debt
                    </button>
                    <button onClick={() => handleDebtPayment(team, 1000)} className="action-button pay-debt-button">
                      Pay $1000 Debt
                    </button>
                    <button onClick={() => handleIncome(team, 1500)} className="action-button income-button">
                      Earn $1500 Income
                    </button>
                    <button onClick={() => handleExpense(team, 1000)} className="action-button expense-button">
                      Pay $1000 Expenses
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
                        {entry.change !== 0 && (
                          <span className={`history-change ${entry.change >= 0 ? 'positive' : 'negative'}`}>
                            {entry.change >= 0 ? '+' : ''}{entry.change.toFixed(2)}
                          </span>
                        )}
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

export default Simulation; 