import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResultsScreen.css';

const ResultsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teams, teamData, quizScores } = location.state || {};

  const calculateTotalScore = (team) => {
    if (!teamData || !teamData[team]) return 0;
    
    const financialScore = (
      teamData[team].savings + 
      teamData[team].investments.reduce((sum, inv) => sum + inv.currentValue, 0) - 
      teamData[team].debt
    );
    
    // Scale financial score to be out of 100
    const scaledFinancialScore = Math.min(100, Math.max(0, financialScore / 20));
    
    // Quiz score (if available)
    const quizScore = quizScores && quizScores[team] ? quizScores[team] * 20 : 0; // Assuming 5 questions max
    
    // Total score is average of financial and quiz scores
    return (scaledFinancialScore + quizScore) / 2;
  };

  const getTeamRank = (team) => {
    if (!teams || !teamData) return 'N/A';
    
    const scores = teams.map(t => ({
      team: t,
      score: calculateTotalScore(t)
    }));
    
    scores.sort((a, b) => b.score - a.score);
    
    const rank = scores.findIndex(s => s.team === team) + 1;
    return rank;
  };

  const getFinancialAdvice = (team) => {
    if (!teamData || !teamData[team]) return 'No data available for financial advice.';
    
    const data = teamData[team];
    const netWorth = data.savings + data.investments.reduce((sum, inv) => sum + inv.currentValue, 0) - data.debt;
    
    if (data.debt > netWorth * 0.5) {
      return 'Focus on reducing your debt before making new investments. High debt levels can limit your financial flexibility.';
    } else if (data.investments.length === 0) {
      return 'Consider starting to invest to grow your wealth over time. Even small investments can compound significantly.';
    } else if (data.savings < 500) {
      return 'Build up your emergency savings fund. Aim to have 3-6 months of expenses saved for unexpected situations.';
    } else {
      return 'Your financial situation looks balanced. Continue to diversify investments and maintain a healthy savings buffer.';
    }
  };

  const restartGame = () => {
    navigate('/');
  };

  if (!teams || !teamData) {
    return (
      <div className="results-error">
        <h2>No simulation data available</h2>
        <p>Please complete a simulation first to see results.</p>
        <button onClick={restartGame} className="button restart-button">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="results-screen">
      <header className="results-header">
        <h1>Simulation Results</h1>
      </header>

      <main className="results-content">
        <div className="results-summary">
          <h2>Team Performance Summary</h2>
          <div className="teams-ranking">
            {teams.map(team => (
              <div key={team} className="team-rank-card">
                <h3>{team}</h3>
                <div className="rank">Rank: {getTeamRank(team)}</div>
                <div className="score">Score: {calculateTotalScore(team).toFixed(1)}</div>
                <div className="financial-stats">
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
                <div className="financial-advice">
                  <h4>Financial Advice:</h4>
                  <p>{getFinancialAdvice(team)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="learning-resources">
          <h2>Financial Learning Resources</h2>
          <div className="resources-list">
            <div className="resource-card">
              <h3>Budgeting Basics</h3>
              <p>Learn how to create and maintain a budget that works for your financial goals.</p>
              <a href="https://www.investopedia.com/personal-finance/how-to-budget/" target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
            <div className="resource-card">
              <h3>Investment Strategies</h3>
              <p>Understand different investment options and how to build a diversified portfolio.</p>
              <a href="https://www.nerdwallet.com/article/investing/how-to-invest-money" target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
            <div className="resource-card">
              <h3>Debt Management</h3>
              <p>Strategies for managing and reducing debt effectively.</p>
              <a href="https://www.consumerfinance.gov/consumer-tools/debt-collection/" target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          </div>
        </div>

        <button onClick={restartGame} className="button restart-button">
          Play Again
        </button>
      </main>
    </div>
  );
};

export default ResultsScreen; 