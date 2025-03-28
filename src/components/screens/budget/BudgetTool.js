import React, { useState } from 'react';
import '../../styles/BudgetTool.css';
import BudgetSpreadsheet from './BudgetSpreadsheet';
import SpreadsheetModal from './SpreadsheetModal';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Income Information
    monthlyIncome: '',
    additionalIncome: '',
    
    // Housing Expenses
    housingType: 'neither',
    rent: '',
    mortgage: '',
    propertyTax: '',
    homeInsurance: '',
    utilities: '',
    
    // Transportation
    carPayment: '',
    carInsurance: '',
    gas: '',
    publicTransportation: '',
    
    // Food & Dining
    groceries: '',
    diningOut: '',
    takeout: '',
    
    // Personal Care
    healthInsurance: '',
    medicalExpenses: '',
    gymMembership: '',
    personalCare: '',
    
    // Entertainment & Leisure
    entertainment: '',
    shopping: '',
    subscriptions: '',
    personalCareBudget: '',
    travel: '',
    
    // Savings & Investments
    hasSavingsPot: 'no',
    savingsPotType: 'one',
    emergencyFund: '',
    sinkingFund: '',
    goalFund: '',
    
    // Debt
    debtTypes: [],
    creditCardDebt: '',
    studentLoanPayment: '',
    carLoanPayment: '',
    personalLoanPayment: '',
    
    // 6-Month Projection
    incomeChange: 'no',
    incomeChangeMonth: '',
    needsChange: 'no',
    needsChangeMonth: '',
    wantsChange: 'no',
    wantsChangeMonth: '',
    monthlyProjections: Array(6).fill().map(() => ({
      income: '',
      needs: '',
      wants: '',
      savings: '',
    })),
    canReduceWants: '',
  });

  const questions = [
    {
      category: 'Income',
      questions: [
        {
          id: 'monthlyIncome',
          label: 'What is your monthly income?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'additionalIncome',
          label: 'Do you have any additional income?',
          type: 'number',
          placeholder: 'Enter amount',
        }
      ],
    },
    {
      category: 'Needs',
      questions: [
        {
          id: 'housingType',
          label: 'Do you pay rent or have a mortgage?',
          type: 'select',
          options: [
            { value: 'rent', label: 'Rent' },
            { value: 'mortgage', label: 'Mortgage' },
            { value: 'neither', label: 'Neither' }
          ],
        },
        {
          id: 'rent',
          label: 'What is your current monthly rent or mortgage payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.housingType === 'rent',
        },
        {
          id: 'mortgage',
          label: 'What is your current monthly rent or mortgage payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.housingType === 'mortgage',
        },
        {
          id: 'utilities',
          label: 'How much do you spend on utilities (electricity, water, internet, gas)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'groceries',
          label: 'How much do you spend on groceries per month?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'transportation',
          label: 'What is your monthly transportation cost?',
          type: 'number',
          placeholder: 'Enter amount for public transport, fuel, and car insurance/tax combined',
        },
        {
          id: 'insurance',
          label: 'Do you have any monthly insurance costs (health, home, car, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'childcare',
          label: 'Do you have any childcare or education expenses?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'debtTypes',
          label: 'Do you have any outstanding debts? (Select all that apply)',
          type: 'multiselect',
          options: [
            { value: 'credit', label: 'Credit card balance' },
            { value: 'student', label: 'Student loan' },
            { value: 'car', label: 'Car loan' },
            { value: 'personal', label: 'Personal loan' },
            { value: 'none', label: 'No debt' }
          ],
        },
        {
          id: 'creditCardDebt',
          label: 'How much is your monthly credit card payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.debtTypes && data.debtTypes.includes('credit'),
        },
        {
          id: 'studentLoanPayment',
          label: 'How much is your monthly student loan payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.debtTypes && data.debtTypes.includes('student'),
        },
        {
          id: 'carLoanPayment',
          label: 'How much is your monthly car loan payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.debtTypes && data.debtTypes.includes('car'),
        },
        {
          id: 'personalLoanPayment',
          label: 'How much is your monthly personal loan payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.debtTypes && data.debtTypes.includes('personal'),
        },
        {
          id: 'totalDebtPayment',
          label: 'Total Monthly Debt Payments',
          type: 'display',
          getValue: (data) => {
            const total = 
              (data.debtTypes?.includes('credit') ? Number(data.creditCardDebt) || 0 : 0) +
              (data.debtTypes?.includes('student') ? Number(data.studentLoanPayment) || 0 : 0) +
              (data.debtTypes?.includes('car') ? Number(data.carLoanPayment) || 0 : 0) +
              (data.debtTypes?.includes('personal') ? Number(data.personalLoanPayment) || 0 : 0);
            return `£${total.toFixed(2)}`;
          },
          showIf: (data) => data.debtTypes && !data.debtTypes.includes('none') && data.debtTypes.length > 0,
        }
      ],
    },
    {
      category: 'Wants',
      questions: [
        {
          id: 'diningOut',
          label: 'How much do you spend on dining out and takeout?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'gymMembership',
          label: 'How much do you spend on gym membership?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'personalCare',
          label: 'How much do you spend on personal care (haircuts, skincare, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'entertainment',
          label: 'How much do you spend on entertainment (going out, hobbies)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'shopping',
          label: 'How much do you spend on shopping (clothes, gadgets, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'subscriptions',
          label: 'How much do you spend on subscription services (Netflix, Spotify, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'travel',
          label: 'How much do you spend on trips or holidays?',
          type: 'number',
          placeholder: 'Enter amount',
        }
      ],
    },
    {
      category: 'Savings & Investments',
      questions: [
        {
          id: 'hasSavingsPot',
          label: 'Do you currently have a savings pot?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 'savingsPotType',
          label: 'Do you have multiple savings pots or everything in one?',
          type: 'select',
          options: [
            { value: 'one', label: 'One' },
            { value: 'multiple', label: 'Multiple' },
          ],
          showIf: (data) => data.hasSavingsPot === 'yes',
        },
        {
          id: 'emergencyFund',
          label: 'How much do you currently have in your Emergency Fund?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.hasSavingsPot === 'yes',
        },
        {
          id: 'sinkingFund',
          label: 'How much do you currently have in your Sinking Fund?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.hasSavingsPot === 'yes',
        },
        {
          id: 'goalFund',
          label: 'How much do you currently have in your Goal/Investment Fund?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.hasSavingsPot === 'yes',
        },
      ],
      renderCustomContent: (formData) => {
        if (formData.hasSavingsPot === 'no') {
          return (
            <div className="budgettool-savings-info">
              <h3 className="budgettool-savings-title">Understanding Savings Pots</h3>
              <p className="budgettool-savings-text">
                Having a structured approach to savings is crucial for financial stability. We recommend setting up three distinct savings pots:
              </p>
              <div className="budgettool-savings-pots">
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">🛡️</div>
                  <h4>Emergency Fund</h4>
                  <p>3-6 months of essential expenses for unexpected situations</p>
                </div>
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">🎯</div>
                  <h4>Sinking Fund</h4>
                  <p>For planned future expenses like holidays or home repairs</p>
                </div>
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">💎</div>
                  <h4>Goal/Investment Fund</h4>
                  <p>For long-term goals and wealth building</p>
                </div>
              </div>
            </div>
          );
        }

        if (formData.savingsPotType === 'one') {
          return (
            <div className="budgettool-savings-info">
              <h3 className="budgettool-savings-title">Multiple Savings Pots</h3>
              <p className="budgettool-savings-text">
                While having a single savings pot is a good start, it's important to build up multiple savings pots that have different roles. Here's how we suggest you structure your savings:
              </p>
              <div className="budgettool-savings-pots">
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">🛡️</div>
                  <h4>Emergency Fund</h4>
                  <p>3-6 months of essential expenses for unexpected situations</p>
                </div>
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">🎯</div>
                  <h4>Sinking Fund</h4>
                  <p>For planned future expenses like holidays or home repairs</p>
                </div>
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">💎</div>
                  <h4>Goal/Investment Fund</h4>
                  <p>For long-term goals and wealth building</p>
                </div>
              </div>
            </div>
          );
        }

        if (formData.savingsPotType === 'multiple') {
          return (
            <div className="budgettool-savings-info">
              <h3 className="budgettool-savings-title">Great Job!</h3>
              <p className="budgettool-savings-text">
                You're on the right track with multiple savings pots. Let's review your current savings structure:
              </p>
              <div className="budgettool-savings-pots">
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">🛡️</div>
                  <h4>Emergency Fund</h4>
                  <p>3-6 months of essential expenses for unexpected situations</p>
                </div>
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">🎯</div>
                  <h4>Sinking Fund</h4>
                  <p>For planned future expenses like holidays or home repairs</p>
                </div>
                <div className="budgettool-savings-pot">
                  <div className="budgettool-savings-pot-icon">💎</div>
                  <h4>Goal/Investment Fund</h4>
                  <p>For long-term goals and wealth building</p>
                </div>
              </div>
            </div>
          );
        }

        return null;
      }
    },
    {
      category: 'Budget Analysis',
      questions: [],
      renderCustomContent: (formData) => {
        const summary = calculateBudgetSummary();
        const totalIncome = summary.totalIncome;
        const needs = summary.needs;
        const wants = summary.wants;
        const needsPercentage = summary.needsPercentage;
        const wantsPercentage = summary.wantsPercentage;
        const remainingPercentage = summary.remainingPercentage;
        
        const recommendedSavings = (totalIncome - needs) * 0.33; // 1/3 of remaining after needs
        const recommendedWants = (totalIncome - needs) * 0.67; // 2/3 of remaining after needs
        const currentWants = wants;
        const wantsReduction = Math.max(0, currentWants - recommendedWants);
        
        const recommendedEmergencyFund = needs * 6; // 6 months of needs
        const minimumEmergencyFund = needs * 3; // 3 months of needs
        const currentEmergencyFund = Number(formData.emergencyFund) || 0;
        const emergencyFundGap = Math.max(0, minimumEmergencyFund - currentEmergencyFund);

        return (
          <div className="budgettool-analysis">
            <h3 className="budgettool-analysis-title">Your Budget Breakdown</h3>
            
            <div className="budgettool-analysis-chart">
              <Pie
                data={{
                  labels: ['Needs', 'Wants', 'Savings'],
                  datasets: [
                    {
                      data: [
                        Math.max(0, summary.needs || 0),
                        Math.max(0, summary.wants || 0),
                        Math.max(0, (summary.totalIncome || 0) - (summary.needs || 0) - (summary.wants || 0))
                      ],
                      backgroundColor: [
                        'rgba(76, 175, 80, 0.85)',  // Green for needs
                        'rgba(33, 150, 243, 0.85)', // Blue for wants
                        'rgba(255, 193, 7, 0.85)'   // Yellow for savings
                      ],
                      borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(33, 150, 243, 1)',
                        'rgba(255, 193, 7, 1)'
                      ],
                      borderWidth: 2,
                      hoverOffset: 15,
                      hoverBorderWidth: 3
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#ffffff',
                        font: {
                          size: 14,
                          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${context.label}: £${value.toFixed(2)} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  cutout: '60%',
                  radius: '80%'
                }}
              />
            </div>
            
            <div className="budgettool-analysis-content">
              <p className="budgettool-analysis-text">
                Based on your spending, you're currently using:
              </p>
              <ul className="budgettool-analysis-list">
                <li>{needsPercentage.toFixed(1)}% on necessities</li>
                <li>{wantsPercentage.toFixed(1)}% on wants</li>
                <li>{remainingPercentage.toFixed(1)}% remaining</li>
              </ul>
              
              <p className="budgettool-analysis-text">
                With your necessities fixed at ${needs.toFixed(2)} ({needsPercentage.toFixed(1)}%), 
                from the remaining ${(totalIncome - needs).toFixed(2)}, we recommend:
              </p>
              <ul className="budgettool-analysis-list">
                <li>Putting ${recommendedSavings.toFixed(2)} (33%) into savings</li>
                <li>Using ${recommendedWants.toFixed(2)} (67%) for wants</li>
              </ul>
              
              {wantsReduction > 0 && (
                <p className="budgettool-analysis-warning">
                  To achieve this balance, you'll need to reduce your wants spending by ${wantsReduction.toFixed(2)} per month.
                </p>
              )}
              
              <div className="budgettool-analysis-savings">
                <h4>Savings Recommendations</h4>
                <p>Emergency Fund:</p>
                <ul className="budgettool-analysis-list">
                  <li>Minimum target: £{minimumEmergencyFund.toFixed(2)} (3 months of needs)</li>
                  <li>Ideal target: £{recommendedEmergencyFund.toFixed(2)} (6 months of needs)</li>
                  <li>Current amount: £{currentEmergencyFund.toFixed(2)}</li>
                  {emergencyFundGap > 0 && (
                    <li className="budgettool-analysis-warning">
                      You need £{emergencyFundGap.toFixed(2)} more to reach the minimum target
                    </li>
                  )}
                </ul>
                
                <p>Sinking Fund and Goal Fund:</p>
                <p className="budgettool-analysis-text">
                  These funds are flexible and should be based on your personal goals. 
                  Consider setting specific targets for major purchases, holidays, or long-term investments.
                </p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      category: '6-Month Projection',
      questions: [
        {
          id: 'incomeChange',
          label: 'Do you expect your income to change over the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
        },
        {
          id: 'needsChange',
          label: 'Do you expect your needs spending to change over the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]
        },
        {
          id: 'wantsChange',
          label: 'Do you think you can change your wants spending over the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]
        }
      ],
      renderCustomContent: (formData) => {
        const getNextMonths = () => {
          const months = [];
          const today = new Date();
          for (let i = 0; i < 6; i++) {
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
            months.push(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
          }
          return months;
        };

        const nextMonths = getNextMonths();
        const summary = calculateBudgetSummary();

        return (
          <div className="budgettool-projections">
            <h3 className="budgettool-projections-title">6-Month Projection</h3>
            
            {formData.incomeChange === 'yes' && (
              <div className="budgettool-projections-table">
                <h4>Expected Income Changes</h4>
                <div className="budgettool-table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Month</th>
                        {nextMonths.map((month, index) => (
                          <th key={index}>{month}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Monthly Income</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.income || summary.totalIncome}
                              onChange={(e) => handleAmountChange(index, 'income', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${summary.totalIncome.toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {formData.needsChange === 'yes' && (
              <div className="budgettool-projections-table">
                <h4>Expected Needs Changes</h4>
                <div className="budgettool-table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        {nextMonths.map((month, index) => (
                          <th key={index}>{month}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Housing</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.housing || (Number(formData.rent) + Number(formData.mortgage) + Number(formData.utilities))}
                              onChange={(e) => handleAmountChange(index, 'housing', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${(Number(formData.rent) + Number(formData.mortgage) + Number(formData.utilities)).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Transportation</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.transportation || (Number(formData.carPayment) + Number(formData.carInsurance) + Number(formData.gas) + Number(formData.publicTransportation))}
                              onChange={(e) => handleAmountChange(index, 'transportation', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${(Number(formData.carPayment) + Number(formData.carInsurance) + Number(formData.gas) + Number(formData.publicTransportation)).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Groceries</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.groceries || Number(formData.groceries)}
                              onChange={(e) => handleAmountChange(index, 'groceries', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.groceries).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Health Insurance</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.healthInsurance || Number(formData.healthInsurance)}
                              onChange={(e) => handleAmountChange(index, 'healthInsurance', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.healthInsurance).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Medical Expenses</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.medicalExpenses || Number(formData.medicalExpenses)}
                              onChange={(e) => handleAmountChange(index, 'medicalExpenses', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.medicalExpenses).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Debt Payments</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.debtPayments || (
                                Number(formData.creditCardDebt) +
                                Number(formData.studentLoanPayment) +
                                Number(formData.carLoanPayment) +
                                Number(formData.personalLoanPayment)
                              )}
                              onChange={(e) => handleAmountChange(index, 'debtPayments', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${(
                                Number(formData.creditCardDebt) +
                                Number(formData.studentLoanPayment) +
                                Number(formData.carLoanPayment) +
                                Number(formData.personalLoanPayment)
                              ).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {formData.wantsChange === 'yes' && (
              <div className="budgettool-projections-table">
                <h4>Expected Wants Changes</h4>
                <div className="budgettool-table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        {nextMonths.map((month, index) => (
                          <th key={index}>{month}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Dining Out</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.diningOut || Number(formData.diningOut)}
                              onChange={(e) => handleAmountChange(index, 'diningOut', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.diningOut).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Takeout</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.takeout || Number(formData.takeout)}
                              onChange={(e) => handleAmountChange(index, 'takeout', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.takeout).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Gym Membership</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.gymMembership || Number(formData.gymMembership)}
                              onChange={(e) => handleAmountChange(index, 'gymMembership', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.gymMembership).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Personal Care</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.personalCare || Number(formData.personalCare)}
                              onChange={(e) => handleAmountChange(index, 'personalCare', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.personalCare).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Entertainment</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.entertainment || Number(formData.entertainment)}
                              onChange={(e) => handleAmountChange(index, 'entertainment', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.entertainment).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Shopping</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.shopping || Number(formData.shopping)}
                              onChange={(e) => handleAmountChange(index, 'shopping', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.shopping).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Subscriptions</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.subscriptions || Number(formData.subscriptions)}
                              onChange={(e) => handleAmountChange(index, 'subscriptions', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.subscriptions).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Travel</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.travel || Number(formData.travel)}
                              onChange={(e) => handleAmountChange(index, 'travel', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${Number(formData.travel).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      }
    },
  ];

  const calculateBudgetSummary = () => {
    // Calculate total income
    const totalIncome = Number(formData.monthlyIncome || 0) + Number(formData.additionalIncome || 0);
    
    // Calculate total needs
    const needs = 
      // Housing
      Number(formData.rent || 0) + 
      Number(formData.mortgage || 0) + 
      Number(formData.propertyTax || 0) + 
      Number(formData.homeInsurance || 0) + 
      Number(formData.utilities || 0) +
      // Transportation
      Number(formData.carPayment || 0) + 
      Number(formData.carInsurance || 0) + 
      Number(formData.gas || 0) + 
      Number(formData.publicTransportation || 0) +
      // Food & Dining (groceries are needs)
      Number(formData.groceries || 0) +
      // Personal Care (health related)
      Number(formData.healthInsurance || 0) + 
      Number(formData.medicalExpenses || 0);
    
    // Calculate total wants
    const wants = 
      // Food & Dining (dining out and takeout are wants)
      Number(formData.diningOut || 0) + 
      Number(formData.takeout || 0) +
      // Personal Care (non-health related)
      Number(formData.gymMembership || 0) + 
      Number(formData.personalCare || 0) +
      // Entertainment & Leisure
      Number(formData.entertainment || 0) + 
      Number(formData.shopping || 0) + 
      Number(formData.subscriptions || 0) + 
      Number(formData.personalCareBudget || 0) + 
      Number(formData.travel || 0);
    
    // Calculate percentages
    const needsPercentage = totalIncome > 0 ? (needs / totalIncome) * 100 : 0;
    const wantsPercentage = totalIncome > 0 ? (wants / totalIncome) * 100 : 0;
    const remainingPercentage = Math.max(0, 100 - needsPercentage - wantsPercentage);

    return {
      totalIncome,
      needs,
      wants,
      needsPercentage,
      wantsPercentage,
      remainingPercentage
    };
  };

  const calculateMonthlyProjections = () => {
    const currentSummary = calculateBudgetSummary();
    const monthlyProjections = Array(6).fill().map(() => ({
      income: currentSummary.totalIncome,
      needs: currentSummary.needs,
      wants: currentSummary.wants,
      savings: currentSummary.totalIncome - currentSummary.needs - currentSummary.wants,
    }));

    // Apply changes based on user input
    if (formData.incomeChange === 'no' && formData.incomeChangeMonth) {
      const changeMonth = parseInt(formData.incomeChangeMonth) - 1;
      for (let i = changeMonth; i < 6; i++) {
        monthlyProjections[i].income = formData.monthlyProjections[i].income || currentSummary.totalIncome;
      }
    }

    if (formData.needsChange === 'no' && formData.needsChangeMonth) {
      const changeMonth = parseInt(formData.needsChangeMonth) - 1;
      for (let i = changeMonth; i < 6; i++) {
        monthlyProjections[i].needs = formData.monthlyProjections[i].needs || currentSummary.needs;
      }
    }

    if (formData.wantsChange === 'no' && formData.wantsChangeMonth) {
      const changeMonth = parseInt(formData.wantsChangeMonth) - 1;
      for (let i = changeMonth; i < 6; i++) {
        monthlyProjections[i].wants = formData.monthlyProjections[i].wants || currentSummary.wants;
      }
    }

    // Recalculate savings for each month
    monthlyProjections.forEach(projection => {
      projection.savings = projection.income - projection.needs - projection.wants;
    });

    return monthlyProjections;
  };

  const handleAmountChange = (monthIndex, field, value) => {
    setFormData(prev => {
      const newProjections = [...prev.monthlyProjections];
      if (!newProjections[monthIndex]) {
        newProjections[monthIndex] = {};
      }
      newProjections[monthIndex] = {
        ...newProjections[monthIndex],
        [field]: Number(value) || 0
      };
      return {
        ...prev,
        monthlyProjections: newProjections
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowSpreadsheet(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderSavingsInfo = () => {
    if (formData.hasSavingsPot === 'no') {
      return (
        <div className="budgettool-savings-info">
          <h3 className="budgettool-savings-title">Understanding Savings Pots</h3>
          <p className="budgettool-savings-text">
            Having a structured approach to savings is crucial for financial stability. We recommend setting up three distinct savings pots:
          </p>
          <div className="budgettool-savings-pots">
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">🛡️</div>
              <h4>Emergency Fund</h4>
              <p>3-6 months of essential expenses for unexpected situations</p>
            </div>
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">🎯</div>
              <h4>Sinking Fund</h4>
              <p>For planned future expenses like holidays or home repairs</p>
            </div>
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">💎</div>
              <h4>Goal/Investment Fund</h4>
              <p>For long-term goals and wealth building</p>
            </div>
          </div>
        </div>
      );
    }

    if (formData.savingsPotType === 'one') {
      return (
        <div className="budgettool-savings-info">
          <h3 className="budgettool-savings-title">Multiple Savings Pots</h3>
          <p className="budgettool-savings-text">
            While having a single savings pot is a good start, it's important to build up multiple savings pots that have different roles. Here's how we suggest you structure your savings:
          </p>
          <div className="budgettool-savings-pots">
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">🛡️</div>
              <h4>Emergency Fund</h4>
              <p>3-6 months of essential expenses for unexpected situations</p>
            </div>
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">🎯</div>
              <h4>Sinking Fund</h4>
              <p>For planned future expenses like holidays or home repairs</p>
            </div>
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">💎</div>
              <h4>Goal/Investment Fund</h4>
              <p>For long-term goals and wealth building</p>
            </div>
          </div>
        </div>
      );
    }

    if (formData.savingsPotType === 'multiple') {
      return (
        <div className="budgettool-savings-info">
          <h3 className="budgettool-savings-title">Great Job!</h3>
          <p className="budgettool-savings-text">
            You're on the right track with multiple savings pots. Let's review your current savings structure:
          </p>
          <div className="budgettool-savings-pots">
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">🛡️</div>
              <h4>Emergency Fund</h4>
              <p>3-6 months of essential expenses for unexpected situations</p>
            </div>
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">🎯</div>
              <h4>Sinking Fund</h4>
              <p>For planned future expenses like holidays or home repairs</p>
            </div>
            <div className="budgettool-savings-pot">
              <div className="budgettool-savings-pot-icon">💎</div>
              <h4>Goal/Investment Fund</h4>
              <p>For long-term goals and wealth building</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderMonthlyProjections = () => {
    const projections = calculateMonthlyProjections();
    const averageWantsPercentage = projections.reduce((acc, month) => 
      acc + (month.wants / month.income) * 100, 0) / 6;
    const recommendedSavingsPercentage = 14;

    return (
      <div className="budgettool-projections">
        <h3 className="budgettool-projections-title">6-Month Projection</h3>
        
        {averageWantsPercentage > 28 && (
          <div className="budgettool-projections-warning">
            <p>
              It seems you are spending a much higher portion of your income on wants without saving. 
              We would recommend you save at least {recommendedSavingsPercentage}%.
            </p>
            <div className="budgettool-projections-question">
              <label>Do you think you can reduce your wants over the next 6 months?</label>
              <select
                value={formData.canReduceWants}
                onChange={(e) => handleInputChange(e)}
                className="budgettool-select"
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        )}

        <div className="budgettool-projections-grid">
          {projections.map((month, index) => (
            <div key={index} className="budgettool-projections-month">
              <h4>Month {index + 1}</h4>
              <div className="budgettool-projections-details">
                <div className="budgettool-projections-item">
                  <span>Income:</span>
                  <span>£{month.income.toFixed(2)}</span>
                </div>
                <div className="budgettool-projections-item">
                  <span>Needs:</span>
                  <span>£{month.needs.toFixed(2)}</span>
                </div>
                <div className="budgettool-projections-item">
                  <span>Wants:</span>
                  <span>£{month.wants.toFixed(2)}</span>
                </div>
                <div className="budgettool-projections-item">
                  <span>Savings:</span>
                  <span>£{month.savings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="budgettool-projections-footer">
          <p>
            Please come back after one month and enter the actual figures to compare with these projections.
            This will help you track your progress and make necessary adjustments to your budget.
          </p>
        </div>
      </div>
    );
  };

  const renderQuestion = (question) => {
    if (question.showIf && !question.showIf(formData)) {
      return null;
    }

    switch (question.type) {
      case 'number':
        return (
          <input
            type="number"
            name={question.id}
            value={formData[question.id]}
            onChange={handleInputChange}
            placeholder={question.placeholder}
            className="budgettool-input"
          />
        );
      case 'select':
        return (
          <select
            name={question.id}
            value={formData[question.id]}
            onChange={handleInputChange}
            className="budgettool-select"
          >
            <option value="">Select option</option>
            {question.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <div className="budgettool-multiselect">
            {question.options.map(option => (
              <label 
                key={option.value} 
                className="budgettool-checkbox-label"
                data-checked={formData[question.id]?.includes(option.value)}
              >
                <input
                  type="checkbox"
                  name={question.id}
                  value={option.value}
                  checked={formData[question.id]?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = formData[question.id] || [];
                    let newValues;
                    if (option.value === 'none') {
                      // If 'none' is selected, clear all other selections
                      newValues = e.target.checked ? ['none'] : [];
                    } else {
                      // If any other option is selected, remove 'none' and toggle the selected option
                      newValues = currentValues.filter(v => v !== 'none');
                      if (e.target.checked) {
                        newValues.push(option.value);
                      } else {
                        newValues = newValues.filter(v => v !== option.value);
                      }
                    }
                    setFormData(prev => ({
                      ...prev,
                      [question.id]: newValues
                    }));
                  }}
                  className="budgettool-checkbox"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case 'display':
        return (
          <div className="budgettool-display-value">
            {question.getValue(formData)}
          </div>
        );
      default:
        return null;
    }
  };

  const renderSummary = () => {
    const summary = calculateBudgetSummary();
    
    return (
      <div className="budgettool-summary">
        <h2 className="budgettool-category-title">Budget Summary</h2>
        <div className="budgettool-summary-content">
          <p className="budgettool-summary-text">
            Based on the numbers entered, it seems you are spending around {summary.needsPercentage.toFixed(1)}% of your income on your needs and around {summary.wantsPercentage.toFixed(1)}% on your wants.
          </p>
          <p className="budgettool-summary-text">
            After the {summary.needsPercentage.toFixed(1)}% you spend on needs, It is recommended you save around 14% of your remaining amount and spend around 28% on your wants.
          </p>
          <div className="budgettool-summary-details">
            <div className="budgettool-summary-item">
              <span className="budgettool-summary-label">Total Income:</span>
              <span className="budgettool-summary-value">£{summary.totalIncome.toFixed(2)}</span>
            </div>
            <div className="budgettool-summary-item">
              <span className="budgettool-summary-label">Needs:</span>
              <span className="budgettool-summary-value">£{summary.needs.toFixed(2)} ({summary.needsPercentage.toFixed(1)}%)</span>
            </div>
            <div className="budgettool-summary-item">
              <span className="budgettool-summary-label">Wants:</span>
              <span className="budgettool-summary-value">£{summary.wants.toFixed(2)} ({summary.wantsPercentage.toFixed(1)}%)</span>
            </div>
            <div className="budgettool-summary-item">
              <span className="budgettool-summary-label">Remaining:</span>
              <span className="budgettool-summary-value">£{(summary.totalIncome - summary.needs - summary.wants).toFixed(2)} ({summary.remainingPercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const downloadBudgetSpreadsheet = () => {
    const summary = calculateBudgetSummary();
    const monthlyProjections = formData.monthlyProjections;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare all data in sections with spacing between them
    const allData = [
      ['INCOME INFORMATION', '', ''],
      ['Category', 'Amount', 'Frequency/Type'],
      ['Monthly Income', Number(formData.monthlyIncome) || 0, 'Monthly'],
      ['Additional Income', Number(formData.additionalIncome) || 0, 'Monthly'],
      ['Total Monthly Income', summary.totalIncome, 'Monthly'],
      ['', '', ''],
      
      ['HOUSING EXPENSES', '', ''],
      ['Category', 'Amount', 'Frequency'],
      ['Rent', Number(formData.rent) || 0, 'Monthly'],
      ['Mortgage', Number(formData.mortgage) || 0, 'Monthly'],
      ['Property Tax', Number(formData.propertyTax) || 0, 'Monthly'],
      ['Home Insurance', Number(formData.homeInsurance) || 0, 'Monthly'],
      ['Utilities', Number(formData.utilities) || 0, 'Monthly'],
      ['Total Housing Expenses', 
        (Number(formData.rent) || 0) + 
        (Number(formData.mortgage) || 0) + 
        (Number(formData.propertyTax) || 0) + 
        (Number(formData.homeInsurance) || 0) + 
        (Number(formData.utilities) || 0), 
        'Monthly'
      ],
      ['', '', ''],
      
      ['TRANSPORTATION EXPENSES', '', ''],
      ['Category', 'Amount', 'Frequency'],
      ['Car Payment', Number(formData.carPayment) || 0, 'Monthly'],
      ['Car Insurance', Number(formData.carInsurance) || 0, 'Monthly'],
      ['Gas', Number(formData.gas) || 0, 'Monthly'],
      ['Public Transportation', Number(formData.publicTransportation) || 0, 'Monthly'],
      ['Total Transportation', 
        (Number(formData.carPayment) || 0) + 
        (Number(formData.carInsurance) || 0) + 
        (Number(formData.gas) || 0) + 
        (Number(formData.publicTransportation) || 0), 
        'Monthly'
      ],
      ['', '', ''],
      
      ['FOOD & DINING EXPENSES', '', ''],
      ['Category', 'Amount', 'Frequency'],
      ['Groceries', Number(formData.groceries) || 0, 'Monthly'],
      ['Dining Out', Number(formData.diningOut) || 0, 'Monthly'],
      ['Takeout', Number(formData.takeout) || 0, 'Monthly'],
      ['Total Food & Dining', 
        (Number(formData.groceries) || 0) + 
        (Number(formData.diningOut) || 0) + 
        (Number(formData.takeout) || 0), 
        'Monthly'
      ],
      ['', '', ''],
      
      ['PERSONAL CARE EXPENSES', '', ''],
      ['Category', 'Amount', 'Frequency'],
      ['Health Insurance', Number(formData.healthInsurance) || 0, 'Monthly'],
      ['Medical Expenses', Number(formData.medicalExpenses) || 0, 'Monthly'],
      ['Gym Membership', Number(formData.gymMembership) || 0, 'Monthly'],
      ['Personal Care', Number(formData.personalCare) || 0, 'Monthly'],
      ['Total Personal Care', 
        (Number(formData.healthInsurance) || 0) + 
        (Number(formData.medicalExpenses) || 0) + 
        (Number(formData.gymMembership) || 0) + 
        (Number(formData.personalCare) || 0), 
        'Monthly'
      ],
      ['', '', ''],
      
      ['ENTERTAINMENT & LEISURE EXPENSES', '', ''],
      ['Category', 'Amount', 'Frequency'],
      ['Entertainment', Number(formData.entertainment) || 0, 'Monthly'],
      ['Shopping', Number(formData.shopping) || 0, 'Monthly'],
      ['Subscriptions', Number(formData.subscriptions) || 0, 'Monthly'],
      ['Personal Care Budget', Number(formData.personalCareBudget) || 0, 'Monthly'],
      ['Travel', Number(formData.travel) || 0, 'Monthly'],
      ['Total Entertainment', 
        (Number(formData.entertainment) || 0) + 
        (Number(formData.shopping) || 0) + 
        (Number(formData.subscriptions) || 0) + 
        (Number(formData.personalCareBudget) || 0) + 
        (Number(formData.travel) || 0), 
        'Monthly'
      ],
      ['', '', ''],
      
      ['DEBT INFORMATION', '', ''],
      ['Category', 'Amount', 'Type'],
      ['Credit Card Debt', Number(formData.creditCardDebt) || 0, 'Current Balance'],
      ['Student Loans', Number(formData.studentLoanPayment) || 0, 'Current Balance'],
      ['Car Loan', Number(formData.carLoanPayment) || 0, 'Current Balance'],
      ['Personal Loan', Number(formData.personalLoanPayment) || 0, 'Current Balance'],
      ['Total Debt', 
        (Number(formData.creditCardDebt) || 0) + 
        (Number(formData.studentLoanPayment) || 0) + 
        (Number(formData.carLoanPayment) || 0) + 
        (Number(formData.personalLoanPayment) || 0), 
        'Current Balance'
      ],
      ['', '', ''],
      
      ['SAVINGS INFORMATION', '', ''],
      ['Category', 'Amount', 'Type'],
      ['Has Savings Pot', formData.hasSavingsPot || 'No', 'Status'],
      ['Savings Pot Type', formData.savingsPotType || 'N/A', 'Type'],
      ['Emergency Fund', Number(formData.emergencyFund) || 0, 'Current Balance'],
      ['Sinking Fund', Number(formData.sinkingFund) || 0, 'Current Balance'],
      ['Goal/Investment Fund', Number(formData.goalFund) || 0, 'Current Balance'],
      ['Monthly Savings Target', summary.totalIncome - summary.needs - summary.wants, 'Monthly'],
      ['Total Current Savings', 
        (Number(formData.emergencyFund) || 0) + 
        (Number(formData.sinkingFund) || 0) + 
        (Number(formData.goalFund) || 0), 
        'Current Balance'
      ],
      ['', '', ''],
      
      ['BUDGET SUMMARY', '', ''],
      ['Category', 'Amount', 'Percentage of Income'],
      ['Total Monthly Income', summary.totalIncome, '100%'],
      ['Total Needs', summary.needs, `${summary.needsPercentage.toFixed(1)}%`],
      ['Total Wants', summary.wants, `${summary.wantsPercentage.toFixed(1)}%`],
      ['Available for Savings', summary.totalIncome - summary.needs - summary.wants, `${summary.remainingPercentage.toFixed(1)}%`],
      ['', '', ''],
      ['Recommended Allocations', '', ''],
      ['Needs', '', '50%'],
      ['Wants', '', '30%'],
      ['Savings', '', '20%'],
      ['', '', ''],
      
      ['6-MONTH PROJECTION', '', '', '', '', ''],
      ['Month', 'Income', 'Needs', 'Wants', 'Savings', 'Percentage Changes'],
      ...monthlyProjections.map((month, index) => [
        `Month ${index + 1}`,
        Number(month.income).toFixed(2),
        Number(month.needs).toFixed(2),
        Number(month.wants).toFixed(2),
        Number(month.savings).toFixed(2),
        `Income: ${month.totalIncomePercentage || 0}%, Needs: ${month.needsPercentage || 0}%, Wants: ${month.wantsPercentage || 0}%`
      ]),
      ['', '', '', '', '', ''],
      ['Projection Settings', '', '', '', '', ''],
      ['Income Change Expected', formData.incomeChange === 'no' ? 'Yes' : 'No', '', '', '', ''],
      ['Income Change Month', formData.incomeChangeMonth || 'N/A', '', '', '', ''],
      ['Needs Change Expected', formData.needsChange === 'no' ? 'Yes' : 'No', '', '', '', ''],
      ['Needs Change Month', formData.needsChangeMonth || 'N/A', '', '', '', ''],
      ['Wants Change Expected', formData.wantsChange === 'no' ? 'Yes' : 'No', '', '', '', ''],
      ['Wants Change Month', formData.wantsChangeMonth || 'N/A', '', '', '', ''],
      ['Can Reduce Wants', formData.canReduceWants || 'N/A', '', '', '', '']
    ];

    // Create the worksheet
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Define styles
    const styles = {
      headerSection: {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4CAF50" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "medium", color: { rgb: "FFFFFF" } },
          bottom: { style: "medium", color: { rgb: "FFFFFF" } },
          left: { style: "medium", color: { rgb: "FFFFFF" } },
          right: { style: "medium", color: { rgb: "FFFFFF" } }
        }
      },
      subHeader: {
        font: { bold: true, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "E8F5E9" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "4CAF50" } },
          bottom: { style: "thin", color: { rgb: "4CAF50" } },
          left: { style: "thin", color: { rgb: "4CAF50" } },
          right: { style: "thin", color: { rgb: "4CAF50" } }
        }
      },
      totalRow: {
        font: { bold: true, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "C8E6C9" } },
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "4CAF50" } },
          bottom: { style: "thin", color: { rgb: "4CAF50" } },
          left: { style: "thin", color: { rgb: "4CAF50" } },
          right: { style: "thin", color: { rgb: "4CAF50" } }
        }
      },
      currency: {
        numFmt: '"£"#,##0.00',
        font: { color: { rgb: "1B5E20" } }
      },
      percentage: {
        numFmt: '0.0"%"',
        font: { color: { rgb: "0277BD" } }
      },
      defaultCell: {
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "B0BEC5" } },
          bottom: { style: "thin", color: { rgb: "B0BEC5" } },
          left: { style: "thin", color: { rgb: "B0BEC5" } },
          right: { style: "thin", color: { rgb: "B0BEC5" } }
        },
        fill: { fgColor: { rgb: "FFFFFF" } }
      },
      projectionHeader: {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2196F3" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "medium", color: { rgb: "FFFFFF" } },
          bottom: { style: "medium", color: { rgb: "FFFFFF" } },
          left: { style: "medium", color: { rgb: "FFFFFF" } },
          right: { style: "medium", color: { rgb: "FFFFFF" } }
        }
      },
      savingsHeader: {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "FFC107" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "medium", color: { rgb: "FFFFFF" } },
          bottom: { style: "medium", color: { rgb: "FFFFFF" } },
          left: { style: "medium", color: { rgb: "FFFFFF" } },
          right: { style: "medium", color: { rgb: "FFFFFF" } }
        }
      },
      positiveChange: {
        font: { color: { rgb: "4CAF50" } }
      },
      negativeChange: {
        font: { color: { rgb: "F44336" } }
      }
    };

    // Apply column widths
    ws['!cols'] = [
      { wch: 30 }, // Category column
      { wch: 15 }, // Amount column
      { wch: 20 }, // Frequency/Type column
      { wch: 15 }, // Extra column for projections
      { wch: 25 }  // Changes Expected column
    ];

    // Apply styles to section headers
    const sectionHeaders = {
      'A1': { text: 'INCOME INFORMATION', style: styles.headerSection },
      'A8': { text: 'HOUSING EXPENSES', style: { ...styles.headerSection, fill: { fgColor: { rgb: "009688" } } } },
      'A19': { text: 'TRANSPORTATION EXPENSES', style: { ...styles.headerSection, fill: { fgColor: { rgb: "673AB7" } } } },
      'A27': { text: 'FOOD & DINING EXPENSES', style: { ...styles.headerSection, fill: { fgColor: { rgb: "FF5722" } } } },
      'A34': { text: 'PERSONAL CARE EXPENSES', style: { ...styles.headerSection, fill: { fgColor: { rgb: "795548" } } } },
      'A42': { text: 'ENTERTAINMENT & LEISURE EXPENSES', style: { ...styles.headerSection, fill: { fgColor: { rgb: "E91E63" } } } },
      'A51': { text: 'DEBT INFORMATION', style: { ...styles.headerSection, fill: { fgColor: { rgb: "F44336" } } } },
      'A59': { text: 'SAVINGS INFORMATION', style: styles.savingsHeader },
      'A69': { text: 'BUDGET SUMMARY', style: { ...styles.headerSection, fill: { fgColor: { rgb: "3F51B5" } } } },
      'A79': { text: '6-MONTH PROJECTION', style: styles.projectionHeader }
    };

    // Apply styles to section headers
    Object.keys(sectionHeaders).forEach(cell => {
      if (!ws[cell]) ws[cell] = {};
      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: cell === 'A1' ? "4CAF50" : 
                           cell === 'A8' ? "009688" :
                           cell === 'A19' ? "673AB7" :
                           cell === 'A27' ? "FF5722" :
                           cell === 'A34' ? "795548" :
                           cell === 'A42' ? "E91E63" :
                           cell === 'A51' ? "F44336" :
                           cell === 'A59' ? "FFC107" :
                           cell === 'A69' ? "3F51B5" :
                           "2196F3" }
        },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "medium", color: { rgb: "FFFFFF" } },
          bottom: { style: "medium", color: { rgb: "FFFFFF" } },
          left: { style: "medium", color: { rgb: "FFFFFF" } },
          right: { style: "medium", color: { rgb: "FFFFFF" } }
        }
      };
      
      // Merge cells for section headers
      const mergeCell = cell.replace('A', '');
      ws['!merges'] = ws['!merges'] || [];
      ws['!merges'].push({ s: { r: parseInt(mergeCell) - 1, c: 0 }, e: { r: parseInt(mergeCell) - 1, c: 2 } });
    });

    // Apply alternating row colors to data rows
    for (let i = 1; i < 100; i++) {
      for (let j = 0; j < 5; j++) {
        const cell = XLSX.utils.encode_cell({ r: i, c: j });
        if (ws[cell]) {
          if (!ws[cell].s) ws[cell].s = {};
          ws[cell].s = {
            fill: {
              patternType: 'solid',
              fgColor: { rgb: i % 2 === 0 ? "F5F5F5" : "FFFFFF" }
            },
            border: {
              top: { style: "thin", color: { rgb: "B0BEC5" } },
              bottom: { style: "thin", color: { rgb: "B0BEC5" } },
              left: { style: "thin", color: { rgb: "B0BEC5" } },
              right: { style: "thin", color: { rgb: "B0BEC5" } }
            }
          };
        }
      }
    }

    // Apply currency format with green color to amount columns
    for (let i = 1; i < 100; i++) {
      const cell = `B${i}`;
      if (ws[cell] && typeof ws[cell].v === 'number') {
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s = {
          numFmt: '"£"#,##0.00',
          font: { color: { rgb: "1B5E20" } },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: "E8F5E9" }
          }
        };
      }
    }

    // Apply special formatting for total rows
    const totalRows = ['A5', 'A13', 'A18', 'A24', 'A31', 'A39', 'A47', 'A55', 'A66'];
    totalRows.forEach(cell => {
      const row = cell.substring(1);
      for (let col = 0; col < 3; col++) {
        const totalCell = XLSX.utils.encode_cell({ r: parseInt(row) - 1, c: col });
        if (ws[totalCell]) {
          if (!ws[totalCell].s) ws[totalCell].s = {};
          ws[totalCell].s = {
            font: { bold: true, color: { rgb: "1B5E20" } },
            fill: {
              patternType: 'solid',
              fgColor: { rgb: "C8E6C9" }
            }
          };
        }
      }
    });

    // Apply special formatting for the budget summary section
    for (let i = 69; i < 74; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = XLSX.utils.encode_cell({ r: i, c: j });
        if (ws[cell]) {
          if (!ws[cell].s) ws[cell].s = {};
          ws[cell].s = {
            font: { bold: true },
            fill: {
              patternType: 'solid',
              fgColor: { rgb: "E3F2FD" }
            }
          };
        }
      }
    }

    // Apply special formatting for the 6-month projection section
    for (let i = 79; i < 87; i++) {
      for (let j = 0; j < 6; j++) {
        const cell = XLSX.utils.encode_cell({ r: i, c: j });
        if (ws[cell]) {
          if (!ws[cell].s) ws[cell].s = {};
          ws[cell].s = {
            fill: {
              patternType: 'solid',
              fgColor: { rgb: "E1F5FE" }
            }
          };
          
          // Add special styling for change percentages
          if (j === 5 && i > 80) {
            const value = ws[cell].v;
            if (typeof value === 'string' && value.includes('%')) {
              const percentages = value.match(/-?\d+\.?\d*%/g);
              if (percentages) {
                const allPositive = percentages.every(p => !p.startsWith('-'));
                ws[cell].s = {
                  fill: {
                    patternType: 'solid',
                    fgColor: { rgb: allPositive ? "E8F5E9" : "FFEBEE" }
                  },
                  font: {
                    color: { rgb: allPositive ? "1B5E20" : "C62828" }
                  }
                };
              }
            }
          }
        }
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Budget Overview');

    // Save the file
    XLSX.writeFile(wb, 'budget_spreadsheet.xlsx');
  };

  // Helper function to get changes for each month
  function getMonthChanges(monthNum) {
    const changes = [];
    if (formData.incomeChangeMonth === monthNum.toString()) changes.push('Income');
    if (formData.needsChangeMonth === monthNum.toString()) changes.push('Needs');
    if (formData.wantsChangeMonth === monthNum.toString()) changes.push('Wants');
    return changes.length ? changes.join(', ') : 'No Changes';
  }

  if (showSpreadsheet) {
    return <BudgetSpreadsheet formData={formData} />;
  }

  return (
    <div className="budgettool-container">
      <div className="budgettool-content">
        <header className="budgettool-header">
          <h1 className="budgettool-title">Budget Planning Tool</h1>
          <p className="budgettool-subtitle">Let's get started with your financial information</p>
        </header>

        <div className="budgettool-progress">
          <div 
            className="budgettool-progress-bar"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
          <p className="budgettool-progress-text">
            Step {currentStep + 1} of {questions.length}
          </p>
        </div>

        <div className="budgettool-form">
          <h2 className="budgettool-category-title">
            {questions[currentStep].category}
          </h2>
          
          {questions[currentStep].questions.map((question, index) => {
            if (question.showIf && !question.showIf(formData)) {
              return null;
            }

            return (
              <div key={index} className="budgettool-question">
                <label className="budgettool-label">{question.label}</label>
                {renderQuestion(question)}
              </div>
            );
          })}

          {questions[currentStep].renderCustomContent && 
            questions[currentStep].renderCustomContent(formData)
          }
        </div>

        {currentStep === questions.length - 1 && renderSummary()}

        <div className="budgettool-navigation">
          <button
            onClick={handlePrevious}
            className="budgettool-button budgettool-button-secondary"
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <div className="budgettool-navigation-right">
            {currentStep === questions.length - 1 && (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="budgettool-button budgettool-button-secondary"
                >
                  View Spreadsheet
                </button>
                <button
                  onClick={() => window.location.href = '/select'}
                  className="budgettool-button budgettool-button-secondary"
                >
                  Return to Home
                </button>
              </>
            )}
            <button
              onClick={currentStep === questions.length - 1 ? downloadBudgetSpreadsheet : handleNext}
              className="budgettool-button budgettool-button-primary"
            >
              {currentStep === questions.length - 1 ? 'Download Spreadsheet' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <SpreadsheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
      />
    </div>
  );
};

export default BudgetTool; 