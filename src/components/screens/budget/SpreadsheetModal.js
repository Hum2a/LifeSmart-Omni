import React from 'react';
import '../../styles/BudgetTool.css';

const SpreadsheetModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  const summary = {
    totalIncome: Number(formData.monthlyIncome) + Number(formData.additionalIncome),
    needs: Number(formData.rent) + Number(formData.mortgage) + 
           Number(formData.utilities) + Number(formData.groceries) +
           Number(formData.carPayment) + Number(formData.carInsurance) +
           Number(formData.healthInsurance) + Number(formData.medicalExpenses),
    wants: Number(formData.entertainment) + Number(formData.shopping) +
           Number(formData.subscriptions) + Number(formData.personalCareBudget) +
           Number(formData.travel) + Number(formData.diningOut)
  };

  summary.needsPercentage = (summary.needs / summary.totalIncome) * 100;
  summary.wantsPercentage = (summary.wants / summary.totalIncome) * 100;
  summary.remainingPercentage = 100 - summary.needsPercentage - summary.wantsPercentage;

  return (
    <div className="budgettool-modal-overlay">
      <div className="budgettool-modal-content">
        <div className="budgettool-modal-header">
          <h2>Budget Overview</h2>
          <button onClick={onClose} className="budgettool-modal-close">&times;</button>
        </div>
        
        <div className="budgettool-modal-body">
          {/* Income Information */}
          <div className="budgettool-modal-section">
            <h3>Income Information</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Monthly Income:</span>
                <span>${Number(formData.monthlyIncome).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Additional Income:</span>
                <span>${Number(formData.additionalIncome).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Income Frequency:</span>
                <span>{formData.incomeFrequency}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Total Income:</span>
                <span>${summary.totalIncome.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Housing Expenses */}
          <div className="budgettool-modal-section">
            <h3>Housing Expenses</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Housing Type:</span>
                <span>{formData.housingType}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Rent:</span>
                <span>${Number(formData.rent).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Mortgage:</span>
                <span>${Number(formData.mortgage).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Property Tax:</span>
                <span>${Number(formData.propertyTax).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Home Insurance:</span>
                <span>${Number(formData.homeInsurance).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Utilities:</span>
                <span>${Number(formData.utilities).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Transportation */}
          <div className="budgettool-modal-section">
            <h3>Transportation</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Car Payment:</span>
                <span>${Number(formData.carPayment).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Car Insurance:</span>
                <span>${Number(formData.carInsurance).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Gas:</span>
                <span>${Number(formData.gas).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Public Transportation:</span>
                <span>${Number(formData.publicTransportation).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Food & Dining */}
          <div className="budgettool-modal-section">
            <h3>Food & Dining</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Groceries:</span>
                <span>${Number(formData.groceries).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Dining Out:</span>
                <span>${Number(formData.diningOut).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Takeout:</span>
                <span>${Number(formData.takeout).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Personal Care */}
          <div className="budgettool-modal-section">
            <h3>Personal Care</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Health Insurance:</span>
                <span>${Number(formData.healthInsurance).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Medical Expenses:</span>
                <span>${Number(formData.medicalExpenses).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Gym Membership:</span>
                <span>${Number(formData.gymMembership).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Personal Care:</span>
                <span>${Number(formData.personalCare).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Entertainment & Leisure */}
          <div className="budgettool-modal-section">
            <h3>Entertainment & Leisure</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Entertainment:</span>
                <span>${Number(formData.entertainment).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Shopping:</span>
                <span>${Number(formData.shopping).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Subscriptions:</span>
                <span>${Number(formData.subscriptions).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Personal Care Budget:</span>
                <span>${Number(formData.personalCareBudget).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Travel:</span>
                <span>${Number(formData.travel).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Debt Information */}
          <div className="budgettool-modal-section">
            <h3>Debt Information</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Credit Card Debt:</span>
                <span>${Number(formData.creditCardDebt).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Student Loans:</span>
                <span>${Number(formData.studentLoans).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Other Debt:</span>
                <span>${Number(formData.otherDebt).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Savings Information */}
          <div className="budgettool-modal-section">
            <h3>Savings Information</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Has Savings Pot:</span>
                <span>{formData.hasSavingsPot}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Savings Pot Type:</span>
                <span>{formData.savingsPotType}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Emergency Fund:</span>
                <span>${Number(formData.emergencyFund).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Sinking Fund:</span>
                <span>${Number(formData.sinkingFund).toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Goal/Investment Fund:</span>
                <span>${Number(formData.goalFund).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Current Budget Summary */}
          <div className="budgettool-modal-section">
            <h3>Current Budget Summary</h3>
            <div className="budgettool-modal-grid">
              <div className="budgettool-modal-item">
                <span>Total Income:</span>
                <span>${summary.totalIncome.toFixed(2)}</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Needs:</span>
                <span>${summary.needs.toFixed(2)} ({summary.needsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Wants:</span>
                <span>${summary.wants.toFixed(2)} ({summary.wantsPercentage.toFixed(1)}%)</span>
              </div>
              <div className="budgettool-modal-item">
                <span>Available for Savings:</span>
                <span>${(summary.totalIncome - summary.needs - summary.wants).toFixed(2)} ({summary.remainingPercentage.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          {/* 6-Month Projection */}
          <div className="budgettool-modal-section">
            <h3>6-Month Projection</h3>
            <div className="budgettool-modal-table">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Needs</th>
                    <th>Wants</th>
                    <th>Savings</th>
                    <th>Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.monthlyProjections.map((month, index) => (
                    <tr key={index}>
                      <td>Month {index + 1}</td>
                      <td>${Number(month.income).toFixed(2)}</td>
                      <td>${Number(month.needs).toFixed(2)}</td>
                      <td>${Number(month.wants).toFixed(2)}</td>
                      <td>${Number(month.savings).toFixed(2)}</td>
                      <td>
                        Income: {month.totalIncomePercentage || 0}%<br/>
                        Needs: {month.needsPercentage || 0}%<br/>
                        Wants: {month.wantsPercentage || 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetModal; 