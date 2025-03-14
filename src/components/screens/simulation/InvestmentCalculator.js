import React, { useState, useEffect } from 'react';
import './InvestmentCalculator.css';

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [results, setResults] = useState({
    futureValue: 0,
    totalContributions: 0,
    interestEarned: 0,
    yearlyData: []
  });

  useEffect(() => {
    calculateInvestment();
  }, [initialInvestment, monthlyContribution, annualReturn, investmentPeriod]);

  const calculateInvestment = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = investmentPeriod * 12;
    let futureValue = initialInvestment;
    const yearlyData = [];
    
    // Calculate initial year data
    yearlyData.push({
      year: 0,
      totalValue: initialInvestment,
      totalContributions: initialInvestment,
      interestEarned: 0
    });
    
    // Calculate for each month
    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly contribution
      futureValue += monthlyContribution;
      
      // Apply interest for the month
      futureValue *= (1 + monthlyRate);
      
      // Record yearly data
      if (month % 12 === 0) {
        const year = month / 12;
        const totalContributions = initialInvestment + (monthlyContribution * month);
        const interestEarned = futureValue - totalContributions;
        
        yearlyData.push({
          year,
          totalValue: futureValue,
          totalContributions,
          interestEarned
        });
      }
    }
    
    const totalContributions = initialInvestment + (monthlyContribution * totalMonths);
    const interestEarned = futureValue - totalContributions;
    
    setResults({
      futureValue,
      totalContributions,
      interestEarned,
      yearlyData
    });
  };

  const handleInputChange = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  return (
    <div className="investment-calculator">
      <header className="calculator-header">
        <h1>Investment Calculator</h1>
        <p>See how your money can grow over time with compound interest</p>
      </header>

      <main className="calculator-content">
        <div className="calculator-inputs">
          <div className="input-group">
            <label htmlFor="initialInvestment">Initial Investment ($)</label>
            <input
              type="number"
              id="initialInvestment"
              value={initialInvestment}
              onChange={handleInputChange(setInitialInvestment)}
              min="0"
              step="100"
            />
          </div>

          <div className="input-group">
            <label htmlFor="monthlyContribution">Monthly Contribution ($)</label>
            <input
              type="number"
              id="monthlyContribution"
              value={monthlyContribution}
              onChange={handleInputChange(setMonthlyContribution)}
              min="0"
              step="10"
            />
          </div>

          <div className="input-group">
            <label htmlFor="annualReturn">Annual Return (%)</label>
            <input
              type="number"
              id="annualReturn"
              value={annualReturn}
              onChange={handleInputChange(setAnnualReturn)}
              min="0"
              max="30"
              step="0.1"
            />
          </div>

          <div className="input-group">
            <label htmlFor="investmentPeriod">Investment Period (years)</label>
            <input
              type="number"
              id="investmentPeriod"
              value={investmentPeriod}
              onChange={handleInputChange(setInvestmentPeriod)}
              min="1"
              max="50"
              step="1"
            />
          </div>
        </div>

        <div className="calculator-results">
          <div className="result-summary">
            <div className="result-card">
              <h3>Future Value</h3>
              <p className="result-value">${results.futureValue.toFixed(2)}</p>
            </div>
            <div className="result-card">
              <h3>Total Contributions</h3>
              <p className="result-value">${results.totalContributions.toFixed(2)}</p>
            </div>
            <div className="result-card">
              <h3>Interest Earned</h3>
              <p className="result-value">${results.interestEarned.toFixed(2)}</p>
            </div>
          </div>

          <div className="result-table-container">
            <h3>Year-by-Year Breakdown</h3>
            <div className="table-wrapper">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Total Value</th>
                    <th>Total Contributions</th>
                    <th>Interest Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((data) => (
                    <tr key={data.year}>
                      <td>{data.year}</td>
                      <td>${data.totalValue.toFixed(2)}</td>
                      <td>${data.totalContributions.toFixed(2)}</td>
                      <td>${data.interestEarned.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="calculator-footer">
        <p>This calculator is for illustrative purposes only and does not guarantee investment results.</p>
      </footer>
    </div>
  );
};

export default InvestmentCalculator; 