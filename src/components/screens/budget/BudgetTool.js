import React, { useState } from 'react';
import '../../styles/BudgetTool.css';
import BudgetSpreadsheet from './BudgetSpreadsheet';
import SpreadsheetModal from './SpreadsheetModal';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Developer Testing Configuration
const DEV_TESTING_ENABLED = true; // Toggle this to enable/disable developer testing features

// Random number generation helper functions
const generateRandomAmount = (min = 100, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomSelection = (options) => {
  return options[Math.floor(Math.random() * options.length)].value;
};

// Developer testing ranges for different expense types
const DEV_RANGES = {
  income: { min: 2000, max: 8000 },
  rent: { min: 800, max: 2500 },
  mortgage: { min: 1000, max: 3000 },
  utilities: { min: 100, max: 500 },
  transportation: { min: 100, max: 800 },
  groceries: { min: 200, max: 800 },
  healthInsurance: { min: 50, max: 400 },
  medicalExpenses: { min: 20, max: 300 },
  dining: { min: 100, max: 500 },
  entertainment: { min: 50, max: 400 },
  shopping: { min: 100, max: 800 },
  travel: { min: 100, max: 1000 },
  charity: { min: 20, max: 500 },
  emergency: { min: 1000, max: 10000 },
  sinking: { min: 500, max: 5000 },
  goal: { min: 1000, max: 20000 }
};

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Income Information
    monthlyIncome: '',
    additionalIncome: '',
    
    // Housing Expenses
    housingType: 'neither',  // Changed from 'neither' to 'rent'
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
    charity: '',
    
    // Savings & Investments
    hasSavingsPot: 'no',
    savingsPotType: 'one',
    emergencyFund: '',
    sinkingFund: '',
    goalFund: '',
    
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
          id: 'housingPayment',
          label: 'What is your monthly housing payment?',
          type: 'number',
          placeholder: 'Enter your monthly housing payment',
          validation: (value) => {
            if (!value || value <= 0) return 'Please enter a valid housing payment';
            return null;
          },
          housingType: {
            type: 'checkbox',
            options: [
              {
                label: 'This is a mortgage payment',
                value: 'mortgage',
                onChange: (e, formData) => {
                  const newFormData = { ...formData };
                  if (e.target.checked) {
                    newFormData.housingType = 'mortgage';
                    newFormData.mortgage = newFormData.housingPayment;
                    newFormData.rent = 0;
                  } else {
                    newFormData.housingType = 'rent';
                    newFormData.rent = newFormData.housingPayment;
                    newFormData.mortgage = 0;
                  }
                  return newFormData;
                }
              },
              {
                label: 'This is a rent payment',
                value: 'rent',
                onChange: (e, formData) => {
                  const newFormData = { ...formData };
                  if (e.target.checked) {
                    newFormData.housingType = 'rent';
                    newFormData.rent = newFormData.housingPayment;
                    newFormData.mortgage = 0;
                  } else {
                    newFormData.housingType = 'mortgage';
                    newFormData.mortgage = newFormData.housingPayment;
                    newFormData.rent = 0;
                  }
                  return newFormData;
                }
              }
            ]
          }
        },
        {
          id: 'utilities',
          label: 'How much do you spend on utilities (electricity, water, internet, gas, phone bill, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'groceries',
          label: 'How much do you spend on essential groceries per month?',
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
          id: 'healthInsurance',
          label: 'How much do you spend on health insurance per month?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'medicalExpenses',
          label: 'Do you have any regular medical expenses (prescriptions, treatments, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'hasOtherLoans',
          label: 'Do you have any other loans apart from a mortgage or student loan?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
        },
        {
          id: 'otherLoanAmount',
          label: 'What is the total amount of your other loans?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.hasOtherLoans === 'yes',
        },
        {
          id: 'otherLoanPayment',
          label: 'What is your monthly required loan payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.hasOtherLoans === 'yes',
        },
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
          label: 'How much do you spend on gym memberships and sports?',
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
        },
        {
          id: 'charity',
          label: 'How much do you spend on charity?',
          type: 'number',
          placeholder: 'Enter amount',
        },
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
                With your necessities fixed at £{needs.toFixed(2)} ({needsPercentage.toFixed(1)}%), 
                from the remaining £{(totalIncome - needs).toFixed(2)}, we recommend:
              </p>
              <ul className="budgettool-analysis-list">
                <li>Putting £{recommendedSavings.toFixed(2)} (33%) into savings</li>
                <li>Using £{recommendedWants.toFixed(2)} (67%) for wants</li>
              </ul>
              
              {wantsReduction > 0 && (
                <p className="budgettool-analysis-warning">
                  To achieve this balance, you'll need to reduce your wants spending by £{wantsReduction.toFixed(2)} per month.
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
      questions: [],  // We'll handle the questions in the custom content
      renderCustomContent: (formData) => {
        const getNextMonths = () => {
          const months = [];
          const today = new Date();
          for (let i = 0; i < 6; i++) {
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
            months.push(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
          }
          return months;
        };

        const nextMonths = getNextMonths();
        const summary = calculateBudgetSummary();

        return (
          <div className="budgettool-projections">
            <h3 className="budgettool-projections-title">6-Month Projection</h3>
            
            {/* Income Section */}
            <div className="budgettool-projections-section">
              <div className="budgettool-projections-question">
                <label>Do you expect your income to change over the next 6 months?</label>
                <select
                  name="incomeChange"
                  value={formData.incomeChange}
                  onChange={handleInputChange}
                  className="budgettool-select"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

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
            </div>

            {/* Needs Section */}
            <div className="budgettool-projections-section">
              <div className="budgettool-projections-question">
                <label>Do you expect your needs spending to change over the next 6 months?</label>
                <select
                  name="needsChange"
                  value={formData.needsChange}
                  onChange={handleInputChange}
                  className="budgettool-select"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.needsChange === 'yes' && (
                <div className="budgettool-projections-table">
                  <h4>Expected Needs Changes</h4>
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
                        <td>{formData.housingType === 'mortgage' ? 'Mortgage Payment' : 'Rent Payment'}</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.housing || (formData.housingType === 'mortgage' ? Number(formData.mortgage || 0) : Number(formData.rent || 0))}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.housing', e.target.value)}
                              className="budgettool-input"
                              placeholder={`£${(formData.housingType === 'mortgage' ? Number(formData.mortgage || 0) : Number(formData.rent || 0)).toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                      {formData.housingType === 'mortgage' && (
                        <>
                          <tr>
                            <td>Property Tax</td>
                            {nextMonths.map((_, index) => (
                              <td key={index}>
                                <input
                                  type="number"
                                  value={formData.monthlyProjections[index]?.needsDetails?.propertyTax || ''}
                                  onChange={(e) => handleAmountChange(index, 'needsDetails.propertyTax', e.target.value)}
                                  placeholder={`£${Number(formData.propertyTax || 0).toFixed(2)}`}
                                  className="budgettool-input"
                                />
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td>Home Insurance</td>
                            {nextMonths.map((_, index) => (
                              <td key={index}>
                                <input
                                  type="number"
                                  value={formData.monthlyProjections[index]?.needsDetails?.homeInsurance || ''}
                                  onChange={(e) => handleAmountChange(index, 'needsDetails.homeInsurance', e.target.value)}
                                  placeholder={`£${Number(formData.homeInsurance || 0).toFixed(2)}`}
                                  className="budgettool-input"
                                />
                              </td>
                            ))}
                          </tr>
                        </>
                      )}
                      <tr>
                        <td>Utilities</td>
                        {nextMonths.map((_, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={formData.monthlyProjections[index]?.needsDetails?.utilities || ''}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.utilities', e.target.value)}
                              placeholder={`£${Number(formData.utilities || 0).toFixed(2)}`}
                              className="budgettool-input"
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
                              value={formData.monthlyProjections[index]?.needsDetails?.transportation || ''}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.transportation', e.target.value)}
                              placeholder={`£${Number(formData.transportation || 0).toFixed(2)}`}
                              className="budgettool-input"
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
                              value={formData.monthlyProjections[index]?.needsDetails?.groceries || ''}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.groceries', e.target.value)}
                              placeholder={`£${Number(formData.groceries || 0).toFixed(2)}`}
                              className="budgettool-input"
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
                              value={formData.monthlyProjections[index]?.needsDetails?.healthInsurance || ''}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.healthInsurance', e.target.value)}
                              placeholder={`£${Number(formData.healthInsurance || 0).toFixed(2)}`}
                              className="budgettool-input"
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
                              value={formData.monthlyProjections[index]?.needsDetails?.medicalExpenses || ''}
                              onChange={(e) => handleAmountChange(index, 'needsDetails.medicalExpenses', e.target.value)}
                              placeholder={`£${Number(formData.medicalExpenses || 0).toFixed(2)}`}
                              className="budgettool-input"
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Wants Section */}
            <div className="budgettool-projections-section">
              <div className="budgettool-projections-question">
                <label>Do you think you can change your wants spending over the next 6 months?</label>
                <select
                  name="wantsChange"
                  value={formData.wantsChange}
                  onChange={handleInputChange}
                  className="budgettool-select"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

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
                          <td>Entertainment</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.entertainment || Number(formData.entertainment)}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.entertainment', e.target.value)}
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
                                value={formData.monthlyProjections[index]?.wantsDetails?.shopping || Number(formData.shopping)}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.shopping', e.target.value)}
                                className="budgettool-input"
                                placeholder={`£${Number(formData.shopping).toFixed(2)}`}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>Dining Out & Takeout</td>
                          {nextMonths.map((_, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                value={formData.monthlyProjections[index]?.wantsDetails?.diningOut || ''}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.diningOut', e.target.value)}
                                placeholder={`£${Number(formData.diningOut || 0).toFixed(2)}`}
                                className="budgettool-input"
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
                                value={formData.monthlyProjections[index]?.wantsDetails?.personalCare || Number(formData.personalCare)}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.personalCare', e.target.value)}
                                className="budgettool-input"
                                placeholder={`£${Number(formData.personalCare).toFixed(2)}`}
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
                                value={formData.monthlyProjections[index]?.wantsDetails?.gymMembership || Number(formData.gymMembership)}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.gymMembership', e.target.value)}
                                className="budgettool-input"
                                placeholder={`£${Number(formData.gymMembership).toFixed(2)}`}
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
                                value={formData.monthlyProjections[index]?.wantsDetails?.subscriptions || Number(formData.subscriptions)}
                                onChange={(e) => handleAmountChange(index, 'wantsDetails.subscriptions', e.target.value)}
                                className="budgettool-input"
                                placeholder={`£${Number(formData.subscriptions).toFixed(2)}`}
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

            <div className="budgettool-projections-footer">
              <p>
                Please come back after one month and enter the actual figures to compare with these projections.
                This will help you track your progress and make necessary adjustments to your budget.
              </p>
            </div>
          </div>
        );
      }
    },
  ];

  const calculateBudgetSummary = () => {
    // Calculate total income
    const totalIncome = Number(formData.monthlyIncome || 0) + Number(formData.additionalIncome || 0);
    
    // Get housing payment based on type
    const housingPayment = formData.housingType === 'mortgage' ? Number(formData.mortgage || 0) : Number(formData.rent || 0);
    
    // Calculate total needs
    const needs = 
      // Housing
      housingPayment + 
      (formData.housingType === 'mortgage' ? Number(formData.propertyTax || 0) + Number(formData.homeInsurance || 0) : 0) + 
      Number(formData.utilities || 0) +
      // Transportation
      Number(formData.transportation || 0) + 
      Number(formData.carInsurance || 0) + 
      Number(formData.gas || 0) + 
      Number(formData.publicTransportation || 0) +
      // Food & Dining (groceries are needs)
      Number(formData.groceries || 0) +
      // Personal Care (health related)
      Number(formData.healthInsurance || 0) + 
      Number(formData.medicalExpenses || 0) +
      // Other Loans
      Number(formData.otherLoanPayment || 0);
    
    // Calculate total wants
    const wants = 
      // Food & Dining (dining out and takeout are wants)
      Number(formData.diningOut || 0) + 
      // Personal Care (non-health related)
      Number(formData.gymMembership || 0) + 
      Number(formData.personalCare || 0) +
      // Entertainment & Leisure
      Number(formData.entertainment || 0) + 
      Number(formData.shopping || 0) + 
      Number(formData.subscriptions || 0) + 
      Number(formData.personalCareBudget || 0) + 
      Number(formData.travel || 0) +
      Number(formData.charity || 0);

    // Calculate total savings
    const totalSavings = Number(formData.emergencyFund || 0) + Number(formData.sinkingFund || 0) + Number(formData.goalFund || 0);
    
    // Calculate percentages
    const needsPercentage = totalIncome > 0 ? (needs / totalIncome) * 100 : 0;
    const wantsPercentage = totalIncome > 0 ? (wants / totalIncome) * 100 : 0;
    const savingsPercentage = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
    const remainingPercentage = Math.max(0, 100 - needsPercentage - wantsPercentage);

    return {
      totalIncome,
      needs,
      wants,
      totalSavings,
      needsPercentage,
      wantsPercentage,
      savingsPercentage,
      remainingPercentage,
      housingPayment
    };
  };

  const handleAmountChange = (monthIndex, field, value) => {
    setFormData(prev => {
      const newProjections = [...prev.monthlyProjections];
      if (!newProjections[monthIndex]) {
        newProjections[monthIndex] = {
          wantsDetails: {},  // Initialize wantsDetails if it doesn't exist
        };
      }

      // If updating wants details, recalculate total wants
      if (field.startsWith('wantsDetails.')) {
        const wantsKey = field.split('.')[1];
        newProjections[monthIndex] = {
          ...newProjections[monthIndex],
          wantsDetails: {
            ...newProjections[monthIndex].wantsDetails || {},
            [wantsKey]: Number(value) || 0
          }
        };
        
        // Calculate total wants from all wants categories
        const totalWants = Object.values({
          entertainment: Number(formData.entertainment || 0),
          shopping: Number(formData.shopping || 0),
          diningOut: Number(formData.diningOut || 0),
          personalCare: Number(formData.personalCare || 0),
          gymMembership: Number(formData.gymMembership || 0),
          subscriptions: Number(formData.subscriptions || 0),
          travel: Number(formData.travel || 0),
          charity: Number(formData.charity || 0),
          ...newProjections[monthIndex].wantsDetails
        }).reduce((sum, val) => sum + (Number(val) || 0), 0);
        
        // Update the total wants for this month
        newProjections[monthIndex].wants = totalWants;
      } else {
        newProjections[monthIndex] = {
          ...newProjections[monthIndex],
          [field]: Number(value) || 0
        };
      }

      return {
        ...prev,
        monthlyProjections: newProjections
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'housingPayment') {
      // When housing payment changes, update either rent or mortgage based on current type
      setFormData(prev => ({
        ...prev,
        [name]: value,
        rent: prev.housingType === 'rent' ? value : prev.rent,
        mortgage: prev.housingType === 'mortgage' ? value : prev.mortgage
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === questions.length - 1) {
      setCurrentStep(prev => prev + 1); // Move to step 7
      setShowSpreadsheet(true); // Show spreadsheet modal
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      if (currentStep === questions.length) { // If on step 7
        setShowSpreadsheet(false); // Hide spreadsheet modal
      }
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

  const renderQuestion = (question) => {
    if (question.showIf && !question.showIf(formData)) {
      return null;
    }

    switch (question.type) {
      case 'number':
        return (
          <div className="budgettool-input-group">
            <input
              type="number"
              name={question.id}
              value={formData[question.id]}
              onChange={handleInputChange}
              placeholder={question.placeholder}
              className="budgettool-input"
            />
            {question.housingType && (
              <div className="budgettool-checkbox-group">
                {question.housingType.options.map((option, index) => (
                  <label key={index} className="budgettool-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.housingType === option.value}
                      onChange={(e) => {
                        const newFormData = option.onChange(e, formData);
                        setFormData(newFormData);
                      }}
                      className="budgettool-checkbox"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
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

  // Helper function to format currency values
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

  // Add helper function to get month names
  const getNextMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
      months.push(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
    return months;
  };

  // Add helper function to calculate wants percentage change
  const calculateWantsChange = (currentMonth, previousMonth) => {
    if (!previousMonth) return 'N/A';
    
    const currentWants = calculateMonthlyWants(currentMonth);
    const previousWants = calculateMonthlyWants(previousMonth);
    
    if (previousWants === 0) return 'N/A';
    return `${((currentWants - previousWants) / previousWants * 100).toFixed(1)}%`;
  };

  const downloadBudgetSpreadsheet = () => {
    // Calculate summary data
    const summary = calculateBudgetSummary();
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      // Title
      ['Budget Overview'],
      [],
      
      // Income Information
      ['Income Information'],
      ['Category', 'Amount', 'Frequency'],
      ['Monthly Income', formData.monthlyIncome, 'Monthly'],
      ['Additional Income', formData.additionalIncome, 'Monthly'],
      ['Total Income', summary.totalIncome, 'Monthly'],
      [],
      
      // Housing Expenses
      ['Housing Expenses'],
      ['Category', 'Amount', 'Type'],
      [getHousingPaymentLabel(), summary.housingPayment, 'Needs'],
      ...(formData.housingType === 'mortgage' ? [
        ['Property Tax', formData.propertyTax, 'Needs'],
        ['Home Insurance', formData.homeInsurance, 'Needs']
      ] : []),
      ['Utilities', formData.utilities, 'Needs'],
      [],
      
      // Transportation
      ['Transportation'],
      ['Category', 'Amount', 'Type'],
      ['Transportation Expenses', formData.transportation, 'Needs'],
      [],
      
      // Food & Dining
      ['Food & Dining'],
      ['Category', 'Amount', 'Type'],
      ['Groceries', formData.groceries, 'Needs'],
      ['Dining Out', formData.diningOut, 'Wants'],
      [],
      
      // Personal Care
      ['Personal Care'],
      ['Category', 'Amount', 'Type'],
      ['Health Insurance', formData.healthInsurance, 'Needs'],
      ['Medical Expenses', formData.medicalExpenses, 'Needs'],
      ['Gym Membership', formData.gymMembership, 'Wants'],
      ['Personal Care', formData.personalCare, 'Wants'],
      [],
      
      // Entertainment & Leisure
      ['Entertainment & Leisure'],
      ['Category', 'Amount', 'Type'],
      ['Entertainment', formData.entertainment, 'Wants'],
      ['Shopping', formData.shopping, 'Wants'],
      ['Subscriptions', formData.subscriptions, 'Wants'],
      ['Travel', formData.travel, 'Wants'],
      [],
      
      // Savings Information
      ['Savings Information'],
      ['Category', 'Amount', 'Type'],
      ['Has Savings Pot', formData.hasSavingsPot === 'yes' ? 'Yes' : 'No', 'Status'],
      ['Savings Pot Type', formData.savingsPotType || 'Not specified', 'Type'],
      ['Emergency Fund', formData.emergencyFund, 'Current Balance'],
      ['Sinking Fund', formData.sinkingFund, 'Current Balance'],
      ['Goal/Investment Fund', formData.goalFund, 'Current Balance'],
      ['Monthly Savings', summary.monthlySavings, 'Monthly'],
      ['Total Savings', summary.totalSavings, 'Total'],
      [],
      
      // Current Budget Summary
      ['Current Budget Summary'],
      ['Category', 'Amount', 'Percentage'],
      ['Total Income', summary.totalIncome, '100%'],
      ['Needs', summary.needs, `${summary.needsPercentage.toFixed(1)}%`],
      ['Wants', summary.totalWants, `${summary.wantsPercentage.toFixed(1)}%`],
      ['Available for Savings', summary.monthlySavings, `${summary.remainingPercentage.toFixed(1)}%`],
      [],
      
      // 6-Month Projection
      ['6-Month Projection'],
      ['Month', 'Income', 'Needs', 'Wants', 'Savings', 'Savings Pot', 'Income Change', 'Needs Change', 'Wants Change']
    ]);

    // Add monthly projection data
    if (formData.monthlyProjections && formData.monthlyProjections.length > 0) {
      const nextMonths = getNextMonths();
      formData.monthlyProjections.forEach((month, index) => {
        const prevMonth = index > 0 ? formData.monthlyProjections[index - 1] : null;
        const monthlyWants = calculateMonthlyWants(month);
        
        // Calculate cumulative savings pot
        const currentSavingsPot = summary.currentSavings + 
          formData.monthlyProjections
            .slice(0, index + 1)
            .reduce((sum, m) => sum + (Number(m.savings) || 0), 0);
        
        // Calculate percentage changes
        const incomeChange = prevMonth ? 
          ((month.income - prevMonth.income) / prevMonth.income * 100).toFixed(1) + '%' : 'N/A';
        const needsChange = prevMonth ? 
          ((month.needs - prevMonth.needs) / prevMonth.needs * 100).toFixed(1) + '%' : 'N/A';
        const wantsChange = calculateWantsChange(month, prevMonth);
        
        XLSX.utils.sheet_add_aoa(ws, [[
          nextMonths[index],
          month.income,
          month.needs,
          monthlyWants,
          month.savings,
          currentSavingsPot,
          incomeChange,
          needsChange,
          wantsChange
        ]], { origin: -1 });
      });
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Budget Overview');

    // Generate and download the file
    XLSX.writeFile(wb, 'budget_overview.xlsx');
  };


  const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="budgettool-modal-overlay">
        <div className="budgettool-modal-content">
          <div className="budgettool-modal-header">
            <h2>Confirm Navigation</h2>
            <button onClick={onClose} className="budgettool-modal-close">&times;</button>
          </div>
          <div className="budgettool-modal-body">
            <p className="budgettool-modal-text">Are you SURE you want to leave yet?</p>
            <div className="budgettool-modal-actions">
              <button
                onClick={onClose}
                className="budgettool-button budgettool-button-secondary"
              >
                Stay Here
              </button>
              <button
                onClick={onConfirm}
                className="budgettool-button budgettool-button-primary"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showSpreadsheet) {
    return (
      <div className="budgettool-container">
        <div className="budgettool-content">
          <header className="budgettool-header">
            <h1 className="budgettool-title">Budget Planning Tool</h1>
            <p className="budgettool-subtitle">Review your complete budget information</p>
          </header>

          <div className="budgettool-progress">
            <div 
              className="budgettool-progress-bar"
              style={{ width: `${((currentStep + 1) / (questions.length + 1)) * 100}%` }}
            ></div>
            <p className="budgettool-progress-text">
              Step {currentStep + 1} of {questions.length + 1}
            </p>
          </div>

          <div className="budgettool-spreadsheet-step">
            <BudgetSpreadsheet formData={formData} />
          </div>

          <div className="budgettool-navigation">
            <button
              onClick={handlePrevious}
              className="budgettool-button budgettool-button-secondary"
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <div className="budgettool-navigation-right">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="budgettool-button budgettool-button-secondary"
              >
                Return to Home
              </button>
              <button
                onClick={downloadBudgetSpreadsheet}
                className="budgettool-button budgettool-button-primary"
              >
                Download Spreadsheet
              </button>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => window.location.href = '/select'}
        />
      </div>
    );
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
            style={{ width: `${((currentStep + 1) / (questions.length + 1)) * 100}%` }}
          ></div>
          <p className="budgettool-progress-text">
            Step {currentStep + 1} of {questions.length + 1}
          </p>
        </div>

        <div className="budgettool-form">
          {currentStep < questions.length ? (
            <>
              {DEV_TESTING_ENABLED && (
                <div className="budgettool-dev-controls" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '0.5rem', color: '#ffc107', fontFamily: 'monospace' }}>
                    🛠️ Developer Testing Mode: ON
                  </div>
                  <button
                    onClick={() => {
                      const newFormData = { ...formData };
                      
                      // Handle standard questions if they exist
                      if (questions[currentStep].questions.length > 0) {
                        questions[currentStep].questions.forEach(question => {
                          if (!question.showIf || question.showIf(formData)) {
                            if (question.type === 'number') {
                              const range = Object.entries(DEV_RANGES).find(([key]) => 
                                question.id.toLowerCase().includes(key)
                              );
                              const { min, max } = range ? range[1] : { min: 100, max: 5000 };
                              newFormData[question.id] = generateRandomAmount(min, max).toString();
                            } else if (question.type === 'select') {
                              newFormData[question.id] = generateRandomSelection(question.options);
                            } else if (question.type === 'multiselect' && question.options) {
                              const numSelections = Math.floor(Math.random() * 3) + 1;
                              const shuffled = [...question.options].sort(() => 0.5 - Math.random());
                              newFormData[question.id] = shuffled.slice(0, numSelections).map(opt => opt.value);
                            }
                          }
                        });
                      }
                      
                      // Special handling for 6-Month Projection step
                      if (currentStep === 5) { // 6-Month Projection step
                        // Always set all changes to yes
                        newFormData.incomeChange = 'yes';
                        newFormData.needsChange = 'yes';
                        newFormData.wantsChange = 'yes';
                        
                        // Get current summary for base values
                        const summary = calculateBudgetSummary();
                        
                        // Generate monthly projections with realistic variations
                        const monthlyProjections = Array(6).fill().map((_, index) => {
                          const variationRange = 0.15; // 15% variation range
                          const getRandomVariation = () => 1 + (Math.random() * variationRange * 2 - variationRange);
                          
                          // Generate variations for income
                          const income = Math.round(summary.totalIncome * getRandomVariation());
                          
                          // Get the correct housing payment based on type
                          const baseHousingPayment = formData.housingType === 'mortgage' 
                            ? Number(formData.mortgage || 0) 
                            : Number(formData.rent || 0);
                            
                          // Generate variations for needs categories
                          const needsDetails = {
                            housing: Math.round(baseHousingPayment * getRandomVariation()),
                            transportation: Math.round((Number(formData.transportation) || generateRandomAmount(DEV_RANGES.transportation.min, DEV_RANGES.transportation.max)) * getRandomVariation()),
                            groceries: Math.round(Number(formData.groceries) * getRandomVariation()),
                            healthInsurance: Math.round((Number(formData.healthInsurance) || generateRandomAmount(DEV_RANGES.healthInsurance.min, DEV_RANGES.healthInsurance.max)) * getRandomVariation()),
                            medicalExpenses: Math.round((Number(formData.medicalExpenses) || generateRandomAmount(DEV_RANGES.medicalExpenses.min, DEV_RANGES.medicalExpenses.max)) * getRandomVariation()),
                            utilities: Math.round(Number(formData.utilities) * getRandomVariation()),
                            propertyTax: formData.housingType === 'mortgage' ? Math.round(Number(formData.propertyTax) * getRandomVariation()) : 0,
                            homeInsurance: formData.housingType === 'mortgage' ? Math.round(Number(formData.homeInsurance) * getRandomVariation()) : 0
                          };
                          
                          // Generate variations for wants categories
                          const wantsDetails = {
                            entertainment: Math.round(Number(formData.entertainment || 0) * getRandomVariation()),
                            shopping: Math.round(Number(formData.shopping || 0) * getRandomVariation()),
                            diningOut: Math.round(Number(formData.diningOut || 0) * getRandomVariation()),
                            personalCare: Math.round(Number(formData.personalCare || 0) * getRandomVariation()),
                            gymMembership: Math.round(Number(formData.gymMembership || 0) * getRandomVariation()),
                            subscriptions: Math.round(Number(formData.subscriptions || 0) * getRandomVariation()),
                            travel: Math.round(Number(formData.travel || 0) * getRandomVariation()),
                            charity: Math.round(Number(formData.charity || 0) * getRandomVariation())
                          };

                          // Generate variations for savings categories
                          const savingsDetails = {
                            emergencyFund: Math.round(Number(formData.emergencyFund) * getRandomVariation()),
                            sinkingFund: Math.round(Number(formData.sinkingFund) * getRandomVariation()),
                            goalFund: Math.round(Number(formData.goalFund) * getRandomVariation())
                          };
                          
                          // Calculate totals
                          const totalNeeds = Object.values(needsDetails).reduce((sum, val) => sum + val, 0);
                          const totalWants = Object.values(wantsDetails).reduce((sum, val) => sum + val, 0);
                          const totalSavings = Object.values(savingsDetails).reduce((sum, val) => sum + val, 0);
                          
                          return {
                            income,
                            needs: totalNeeds,
                            wants: totalWants,
                            savings: income - totalNeeds - totalWants,
                            needsDetails,
                            wantsDetails,
                            savingsDetails
                          };
                        });
                        
                        newFormData.monthlyProjections = monthlyProjections;
                        
                        // Random selection for wants reduction question
                        newFormData.canReduceWants = Math.random() > 0.5 ? 'yes' : 'no';
                        
                        console.log('[Dev] Generated random projections:', monthlyProjections);
                      }
                      
                      setFormData(newFormData);
                      console.log(`[Dev] Generated random data for ${questions[currentStep].category}:`, newFormData);
                    }}
                    className="budgettool-dev-button"
                  >
                    🎲 Generate Random Data for {questions[currentStep].category}
                    <br />
                    <small style={{ opacity: 0.7 }}>Using realistic ranges for each field type</small>
                  </button>
                </div>
              )}
              
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
            </>
          ) : (
            <div className="budgettool-spreadsheet-step">
              <h2 className="budgettool-category-title">Your Budget Spreadsheet</h2>
              <p className="budgettool-spreadsheet-text">
                Review your complete budget information in the spreadsheet below.
                You can download it at any time using the button below.
              </p>
              <BudgetSpreadsheet formData={formData} />
            </div>
          )}
        </div>

        <div className="budgettool-navigation">
          <button
            onClick={handlePrevious}
            className="budgettool-button budgettool-button-secondary"
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <div className="budgettool-navigation-right">
            {currentStep === questions.length && (
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="budgettool-button budgettool-button-secondary"
              >
                Return to Home
              </button>
            )}
            <button
              onClick={currentStep === questions.length ? downloadBudgetSpreadsheet : handleNext}
              className="budgettool-button budgettool-button-primary"
            >
              {currentStep === questions.length ? 'Download Spreadsheet' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <SpreadsheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => window.location.href = '/select'}
      />
    </div>
  );
};

export default BudgetTool; 