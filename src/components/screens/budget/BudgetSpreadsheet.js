import React from 'react';
import '../../styles/BudgetSpreadsheet.css';

const BudgetSpreadsheet = ({ formData }) => {
  const calculateBudgetSummary = () => {
    const totalIncome = Number(formData.monthlyIncome) + Number(formData.additionalIncome);
    const needs = Number(formData.rent) + Number(formData.mortgage) + 
                 Number(formData.utilities) + Number(formData.groceries) +
                 Number(formData.carPayment) + Number(formData.carInsurance) +
                 Number(formData.healthInsurance) + Number(formData.medicalExpenses);
    
    const wants = Number(formData.entertainment) + Number(formData.shopping) +
                 Number(formData.subscriptions) + Number(formData.personalCareBudget) +
                 Number(formData.travel) + Number(formData.diningOut);
    
    const needsPercentage = (needs / totalIncome) * 100;
    const wantsPercentage = (wants / totalIncome) * 100;
    const remainingPercentage = 100 - needsPercentage - wantsPercentage;

    return {
      totalIncome,
      needs,
      wants,
      needsPercentage,
      wantsPercentage,
      remainingPercentage
    };
  };

  const summary = calculateBudgetSummary();

  return (
    <div className="budgetspreadsheet-container">
      <div className="budgetspreadsheet-content">
        <header className="budgetspreadsheet-header">
          <h1 className="budgetspreadsheet-title">Your Budget Spreadsheet</h1>
          <p className="budgetspreadsheet-subtitle">A comprehensive view of your financial information</p>
        </header>

        <div className="budgetspreadsheet-tables">
          {/* Income Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Income</h2>
            <table className="budgetspreadsheet-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Income</td>
                  <td>${Number(formData.monthlyIncome).toFixed(2)}</td>
                  <td>{formData.incomeFrequency}</td>
                </tr>
                <tr>
                  <td>Additional Income</td>
                  <td>${Number(formData.additionalIncome).toFixed(2)}</td>
                  <td>Monthly</td>
                </tr>
                <tr className="budgetspreadsheet-total">
                  <td>Total Income</td>
                  <td>${summary.totalIncome.toFixed(2)}</td>
                  <td>Monthly</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Expenses Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Expenses</h2>
            <table className="budgetspreadsheet-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rent</td>
                  <td>${Number(formData.rent).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Mortgage</td>
                  <td>${Number(formData.mortgage).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Utilities</td>
                  <td>${Number(formData.utilities).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Groceries</td>
                  <td>${Number(formData.groceries).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Car Payment</td>
                  <td>${Number(formData.carPayment).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Car Insurance</td>
                  <td>${Number(formData.carInsurance).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Health Insurance</td>
                  <td>${Number(formData.healthInsurance).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Medical Expenses</td>
                  <td>${Number(formData.medicalExpenses).toFixed(2)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Entertainment</td>
                  <td>${Number(formData.entertainment).toFixed(2)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Shopping</td>
                  <td>${Number(formData.shopping).toFixed(2)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Subscriptions</td>
                  <td>${Number(formData.subscriptions).toFixed(2)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Personal Care</td>
                  <td>${Number(formData.personalCareBudget).toFixed(2)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Travel</td>
                  <td>${Number(formData.travel).toFixed(2)}</td>
                  <td>Wants</td>
                </tr>
                <tr className="budgetspreadsheet-total">
                  <td>Total Expenses</td>
                  <td>${(summary.needs + summary.wants).toFixed(2)}</td>
                  <td>Monthly</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Savings Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Savings</h2>
            <table className="budgetspreadsheet-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Emergency Fund</td>
                  <td>${Number(formData.emergencyFund).toFixed(2)}</td>
                  <td>Current Balance</td>
                </tr>
                <tr>
                  <td>Sinking Fund</td>
                  <td>${Number(formData.sinkingFund).toFixed(2)}</td>
                  <td>Current Balance</td>
                </tr>
                <tr>
                  <td>Goal/Investment Fund</td>
                  <td>${Number(formData.goalFund).toFixed(2)}</td>
                  <td>Current Balance</td>
                </tr>
                <tr className="budgetspreadsheet-total">
                  <td>Monthly Savings</td>
                  <td>${(summary.totalIncome - summary.needs - summary.wants).toFixed(2)}</td>
                  <td>Monthly</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Summary Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Budget Summary</h2>
            <div className="budgetspreadsheet-summary">
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Total Income:</span>
                <span className="budgetspreadsheet-summary-value">${summary.totalIncome.toFixed(2)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Needs ({summary.needsPercentage.toFixed(1)}%):</span>
                <span className="budgetspreadsheet-summary-value">${summary.needs.toFixed(2)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Wants ({summary.wantsPercentage.toFixed(1)}%):</span>
                <span className="budgetspreadsheet-summary-value">${summary.wants.toFixed(2)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Savings ({summary.remainingPercentage.toFixed(1)}%):</span>
                <span className="budgetspreadsheet-summary-value">${(summary.totalIncome - summary.needs - summary.wants).toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BudgetSpreadsheet; 