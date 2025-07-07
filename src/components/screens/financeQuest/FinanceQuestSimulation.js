import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './FinanceQuestSimulation.css';
import QuestionHeader from './questions/QuestionHeader';
import FinanceQuestResultsScreen from './FinanceQuestResultsScreen';

// Each year: { label, changes: { A: multiplier, B: multiplier, ... }, flat: { A: amount, ... } }
export const FINANCE_QUEST_YEARS = [
  { label: 'Year 1', changes: { C: 2, D: 2 } },
  { label: 'Year 2', changes: { B: 3, C: 2, D: 2 } },
  { label: 'Year 3', changes: { D: 2, E: 2 }, flat: { A: -50, B: -50, C: -50, D: -50, E: -50 } },
  { label: 'Year 4', changes: { C: 0.5, A: 2, B: 0.5, E: 3 } },
  { label: 'Year 5', changes: { A: 2, C: 2 } },
  { label: 'Year 6', changes: { A: 0.5, B: 0.5, C: 0.5, E: 2, D: 2 } },
  { label: 'Year 7', changes: { A: 3, C: 2, B: 3 } },
];

const potLetters = ['A', 'B', 'C', 'D', 'E'];
const potNames = {
  A: 'Training & Self-Development',
  B: 'Life-Experiences & Fun',
  C: 'Investment',
  D: 'Health & Well-being',
  E: 'Emergency',
};

function simulateAllYears(teams, initialAllocations, baseFunds) {
  // Returns: [{ name, yearly: [ {A, B, C, D, E, total}, ... ] }]
  return teams.map((team, idx) => {
    const teamBase = baseFunds + (team.points || 0) * 1000;
    const alloc = initialAllocations[idx];
    // Year 0: initial allocation
    let prev = {};
    let yearArr = [];
    let total = 0;
    let pots = {};
    potLetters.forEach(l => {
      pots[l] = (parseInt(alloc[l]) || 0) / 100 * teamBase;
      total += pots[l];
    });
    yearArr.push({ ...pots, total });
    // Years 1-7
    for (let y = 0; y < FINANCE_QUEST_YEARS.length; y++) {
      const { changes = {}, flat = {} } = FINANCE_QUEST_YEARS[y];
      let newPots = {};
      let newTotal = 0;
      potLetters.forEach(l => {
        let val = yearArr[y][l];
        if (changes[l]) val *= changes[l];
        if (flat[l]) val += flat[l];
        // Prevent negative values
        val = Math.max(0, val);
        newPots[l] = val;
        newTotal += val;
      });
      yearArr.push({ ...newPots, total: newTotal });
    }
    return { name: team.name, yearly: yearArr };
  });
}

const teamColors = [
  '#FFD43B', '#CA70E3', '#4DD7FF', '#FF9524', '#E1551D', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40'
];

const potColors = {
  A: '#4DD7FF',
  B: '#FF9524',
  C: '#FFD43B',
  D: '#CA70E3',
  E: '#E1551D',
};

const FinanceQuestSimulation = ({ teams, initialAllocations, baseFunds }) => {
  const [year, setYear] = useState(0); // 0 = initial, 1 = after year 1, ...
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const results = simulateAllYears(teams, initialAllocations, baseFunds);
  const maxYear = FINANCE_QUEST_YEARS.length;
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const runTimeout = useRef(null);

  // Always show all years on the x-axis
  const allLabels = ['Initial', ...FINANCE_QUEST_YEARS.map(y => y.label)];

  useEffect(() => {
    // Prepare data for the chart
    const datasets = results.map((team, idx) => {
      // Only show data up to the current year, rest as null
      const data = team.yearly.map((y, i) => (i <= year ? y.total : null));
      return {
        label: team.name,
        data,
        borderColor: teamColors[idx % teamColors.length],
        backgroundColor: teamColors[idx % teamColors.length],
        fill: false,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      };
    });
    // Destroy previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    if (chartRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: { labels: allLabels, datasets },
        options: {
          responsive: true,
          animation: false,
          transitions: { active: { animation: false } },
          plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Team Total Value Over Years' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: £${Math.round(context.parsed.y).toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) { return '£' + value.toLocaleString(); }
              }
            }
          }
        }
      });
    }
    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [results, year]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (runTimeout.current) clearTimeout(runTimeout.current);
    };
  }, []);

  const runSimulation = () => {
    setIsRunning(true);
    const step = (current) => {
      if (current > maxYear) {
        setIsRunning(false);
        return;
      }
      setYear(current);
      runTimeout.current = setTimeout(() => step(current + 1), 700);
    };
    step(1);
  };

  if (showResults) {
    return <FinanceQuestResultsScreen results={results} onRestart={() => window.location.href = '/finance-quest'} />;
  }

  return (
    <>
    <QuestionHeader />
    <div className="financeQuest-simulation-root">
      <h2>Finance Quest Simulation</h2>
      <div className="financeQuest-simulation-year-controls">
        <button className="financeQuest-simulation-btn" onClick={() => setYear(y => Math.max(0, y - 1))} disabled={year === 0 || isRunning}>Previous</button>
        <span className="financeQuest-simulation-year-label">
          {year === 0 ? 'Initial Allocation' : FINANCE_QUEST_YEARS[year - 1].label}
        </span>
        <button className="financeQuest-simulation-btn" onClick={() => setYear(y => Math.min(maxYear, y + 1))} disabled={year === maxYear || isRunning}>Next</button>
        <button className="financeQuest-simulation-run-btn" onClick={runSimulation} disabled={isRunning || year === maxYear}>
          {isRunning ? 'Running...' : 'Run Simulation'}
        </button>
        {year === maxYear && !isRunning && (
          <button className="financeQuest-simulation-run-btn" style={{ marginLeft: 18 }} onClick={() => setShowResults(true)}>
            View Results
          </button>
        )}
      </div>
      <div className="financeQuest-simulation-chart-container">
        <canvas id="financeQuestChart" ref={chartRef} height={320}></canvas>
        <div className="financeQuest-simulation-chart-legend">
          {results.map((team, idx) => (
            <div key={team.name} className="financeQuest-simulation-legend-item">
              <span className="financeQuest-simulation-legend-color" style={{ background: teamColors[idx % teamColors.length] }}></span>
              {team.name}
            </div>
          ))}
        </div>
      </div>
      <div className="financeQuest-simulation-perpot-details">
        {results.map((team, idx) => (
          <div key={team.name} className="financeQuest-simulation-perpot-card">
            <div className="financeQuest-simulation-perpot-title">{team.name}</div>
            {potLetters.map(l => (
              <div key={l} className={`financeQuest-simulation-perpot-label-${l}`} style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 700 }}>{potNames[l]}:</span>
                <span className="financeQuest-simulation-perpot-value" style={{ color: potColors[l], marginLeft: 8 }}>
                  £{Math.round(team.yearly[year][l]).toLocaleString()}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 10, fontWeight: 700, color: teamColors[idx % teamColors.length] }}>
              Total: £{Math.round(team.yearly[year].total).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="financeQuest-simulation-teams">
        {results.map(team => (
          <div key={team.name} className="financeQuest-simulation-team-card">
            <div className="financeQuest-simulation-team-name">{team.name}</div>
            <table className="financeQuest-simulation-table">
              <thead>
                <tr>
                  {potLetters.map(l => (
                    <th key={l}>{potNames[l]}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {potLetters.map(l => (
                    <td key={l}>£{Math.round(team.yearly[year][l]).toLocaleString()}</td>
                  ))}
                  <td className="financeQuest-simulation-total">£{Math.round(team.yearly[year].total).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div> */}
    </div>
    </>
  );
};

export default FinanceQuestSimulation; 