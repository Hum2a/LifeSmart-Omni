import React from 'react';
import '../../styles/BudgetSpreadsheet.css';

const BudgetSpreadsheet = ({ formData }) => {
  const calculateBudgetSummary = () => {
    // Income calculations
    const totalIncome = Number(formData.monthlyIncome || 0) + Number(formData.additionalIncome || 0);
    
    // Get housing payment based on type
    const housingPayment = formData.housingType === 'mortgage' ? Number(formData.mortgage || 0) : Number(formData.rent || 0);
    
    // Needs calculations
    const needs = (
      // Housing
      housingPayment + 
      Number(formData.propertyTax || 0) + 
      Number(formData.homeInsurance || 0) + 
      Number(formData.utilities || 0) +
      // Transportation
      Number(formData.transportation || 0) +
      // Food
      Number(formData.groceries || 0) +
      // Healthcare
      Number(formData.healthInsurance || 0) + 
      Number(formData.medicalExpenses || 0)
    );
    
    // Wants calculations - Include ALL want categories
    const totalWants = (
      // Dining & Food
      Number(formData.diningOut || 0) +
      // Entertainment & Shopping
      Number(formData.entertainment || 0) +
      Number(formData.shopping || 0) + 
      Number(formData.subscriptions || 0) + 
      Number(formData.travel || 0) +
      // Personal Care wants
      Number(formData.gymMembership || 0) +
      Number(formData.personalCare || 0)
    );

    // Calculate percentages
    const needsPercentage = (needs / totalIncome) * 100 || 0;
    const wantsPercentage = (totalWants / totalIncome) * 100 || 0;
    const remainingPercentage = Math.max(0, 100 - needsPercentage - wantsPercentage);

    // Calculate total savings (both current savings pots and monthly savings)
    const currentSavings = (
      Number(formData.emergencyFund || 0) +
      Number(formData.sinkingFund || 0) +
      Number(formData.goalFund || 0)
    );
    
    // Monthly savings is what's left after needs and wants
    const monthlySavings = Math.max(0, totalIncome - needs - totalWants);

    // Add total savings calculation (current balance + projected monthly savings)
    const totalSavings = currentSavings + monthlySavings;

    return {
      totalIncome,
      needs,
      totalWants,
      needsPercentage,
      wantsPercentage,
      remainingPercentage,
      currentSavings,
      monthlySavings,
      totalSavings,
      housingPayment
    };
  };

  const summary = calculateBudgetSummary();
  const formatCurrency = (value) => `£${Number(value || 0).toFixed(2)}`;

  // Helper function to get housing payment label
  const getHousingPaymentLabel = () => {
    return formData.housingType === 'mortgage' ? 'Mortgage Payment' : 'Rent Payment';
  };

  // Add a helper function to calculate total wants for a month
  const calculateMonthlyWants = (month) => {
    if (!month) return 0;
    
    if (month.wantsDetails) {
      return Object.values(month.wantsDetails).reduce((sum, val) => sum + (Number(val) || 0), 0);
    }
    
    // Fallback to direct wants value if wantsDetails is not available
    return Number(month.wants || 0);
  };

  // Add a helper function to calculate wants percentage change
  const calculateWantsChange = (currentMonth, previousMonth) => {
    if (!previousMonth) return 'N/A';
    
    const currentWants = calculateMonthlyWants(currentMonth);
    const previousWants = calculateMonthlyWants(previousMonth);
    
    if (previousWants === 0) return 'N/A';
    return `${((currentWants - previousWants) / previousWants * 100).toFixed(1)}%`;
  };

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
                  <td>{formatCurrency(formData.monthlyIncome)}</td>
                  <td>Monthly</td>
                </tr>
                <tr>
                  <td>Additional Income</td>
                  <td>{formatCurrency(formData.additionalIncome)}</td>
                  <td>Monthly</td>
                </tr>
                <tr className="budgetspreadsheet-total">
                  <td>Total Income</td>
                  <td>{formatCurrency(summary.totalIncome)}</td>
                  <td>Monthly</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Housing Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Housing</h2>
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
                  <td>{getHousingPaymentLabel()}</td>
                  <td>{formatCurrency(summary.housingPayment)}</td>
                  <td>Needs</td>
                </tr>
                {formData.housingType === 'mortgage' && (
                  <tr>
                    <td>Property Tax</td>
                    <td>{formatCurrency(formData.propertyTax)}</td>
                    <td>Needs</td>
                  </tr>
                )}
                {formData.housingType === 'mortgage' && (
                  <tr>
                    <td>Home Insurance</td>
                    <td>{formatCurrency(formData.homeInsurance)}</td>
                    <td>Needs</td>
                  </tr>
                )}
                <tr>
                  <td>Utilities</td>
                  <td>{formatCurrency(formData.utilities)}</td>
                  <td>Needs</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Transportation Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Transportation</h2>
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
                  <td>Transportation Expenses</td>
                  <td>{formatCurrency(formData.transportation)}</td>
                  <td>Needs</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Food & Dining Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Food & Dining</h2>
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
                  <td>Groceries</td>
                  <td>{formatCurrency(formData.groceries)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Dining Out & Takeout</td>
                  <td>{formatCurrency(Number(formData.diningOut || 0))}</td>
                  <td>Wants</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Personal Care Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Personal Care</h2>
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
                  <td>Health Insurance</td>
                  <td>{formatCurrency(formData.healthInsurance)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Medical Expenses</td>
                  <td>{formatCurrency(formData.medicalExpenses)}</td>
                  <td>Needs</td>
                </tr>
                <tr>
                  <td>Gym Membership</td>
                  <td>{formatCurrency(formData.gymMembership)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Personal Care</td>
                  <td>{formatCurrency(formData.personalCare)}</td>
                  <td>Wants</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Entertainment & Leisure Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Entertainment & Leisure</h2>
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
                  <td>Entertainment</td>
                  <td>{formatCurrency(formData.entertainment)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Shopping</td>
                  <td>{formatCurrency(formData.shopping)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Subscriptions</td>
                  <td>{formatCurrency(formData.subscriptions)}</td>
                  <td>Wants</td>
                </tr>
                <tr>
                  <td>Travel</td>
                  <td>{formatCurrency(formData.travel)}</td>
                  <td>Wants</td>
                </tr>
                <tr className="budgetspreadsheet-total">
                  <td>Total Wants</td>
                  <td>{formatCurrency(summary.totalWants)}</td>
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
                  <td>Has Savings Pot</td>
                  <td colSpan="2">{formData.hasSavingsPot === 'yes' ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td>Savings Pot Type</td>
                  <td colSpan="2">{formData.savingsPotType || 'Not specified'}</td>
                </tr>
                <tr>
                  <td>Emergency Fund</td>
                  <td>{formatCurrency(formData.emergencyFund)}</td>
                  <td>Current Balance</td>
                </tr>
                <tr>
                  <td>Sinking Fund</td>
                  <td>{formatCurrency(formData.sinkingFund)}</td>
                  <td>Current Balance</td>
                </tr>
                <tr>
                  <td>Goal/Investment Fund</td>
                  <td>{formatCurrency(formData.goalFund)}</td>
                  <td>Current Balance</td>
                </tr>
                <tr className="budgetspreadsheet-total">
                  <td>Monthly Savings</td>
                  <td>{formatCurrency(summary.monthlySavings)}</td>
                  <td>Monthly</td>
                </tr>
                <tr className="budgetspreadsheet-total">
                  <td>Total Savings</td>
                  <td>{formatCurrency(summary.totalSavings)}</td>
                  <td>Total</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 6-Month Projection */}
          {formData.monthlyProjections && formData.monthlyProjections.length > 0 && (
            <section className="budgetspreadsheet-section">
              <h2 className="budgetspreadsheet-section-title">6-Month Projection</h2>
              <table className="budgetspreadsheet-table">
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
                  {formData.monthlyProjections.map((month, index) => {
                    const prevMonth = index > 0 ? formData.monthlyProjections[index - 1] : null;
                    const monthlyWants = calculateMonthlyWants(month);
                    
                    return (
                      <tr key={index}>
                        <td>Month {index + 1}</td>
                        <td>{formatCurrency(month.income)}</td>
                        <td>{formatCurrency(month.needs)}</td>
                        <td>{formatCurrency(monthlyWants)}</td>
                        <td>{formatCurrency(month.savings)}</td>
                        <td>
                          Income: {((month.income - (prevMonth?.income || month.income)) / (prevMonth?.income || month.income) * 100).toFixed(1)}%<br />
                          Needs: {((month.needs - (prevMonth?.needs || month.needs)) / (prevMonth?.needs || month.needs) * 100).toFixed(1)}%<br />
                          Wants: {calculateWantsChange(month, prevMonth)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}

          {/* Budget Summary Section */}
          <section className="budgetspreadsheet-section">
            <h2 className="budgetspreadsheet-section-title">Budget Summary</h2>
            <div className="budgetspreadsheet-summary">
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Total Income:</span>
                <span className="budgetspreadsheet-summary-value">{formatCurrency(summary.totalIncome)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Needs ({summary.needsPercentage.toFixed(1)}%):</span>
                <span className="budgetspreadsheet-summary-value">{formatCurrency(summary.needs)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Wants ({summary.wantsPercentage.toFixed(1)}%):</span>
                <span className="budgetspreadsheet-summary-value">{formatCurrency(summary.totalWants)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Monthly Savings ({summary.remainingPercentage.toFixed(1)}%):</span>
                <span className="budgetspreadsheet-summary-value">{formatCurrency(summary.monthlySavings)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Current Savings Balance:</span>
                <span className="budgetspreadsheet-summary-value">{formatCurrency(summary.currentSavings)}</span>
              </div>
              <div className="budgetspreadsheet-summary-item">
                <span className="budgetspreadsheet-summary-label">Total Savings:</span>
                <span className="budgetspreadsheet-summary-value">{formatCurrency(summary.totalSavings)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BudgetSpreadsheet; 