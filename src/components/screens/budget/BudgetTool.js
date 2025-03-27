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
    creditCardDebt: '',
    studentLoans: '',
    otherDebt: '',
    
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
      category: 'Housing',
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
          label: 'How much do you pay in rent?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.housingType === 'rent',
        },
        {
          id: 'mortgage',
          label: 'How much is your mortgage payment?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.housingType === 'mortgage',
        },
        {
          id: 'propertyTax',
          label: 'How much do you pay in property tax?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.housingType === 'mortgage',
        },
        {
          id: 'homeInsurance',
          label: 'How much is your home insurance?',
          type: 'number',
          placeholder: 'Enter amount',
          showIf: (data) => data.housingType === 'mortgage',
        },
        {
          id: 'utilities',
          label: 'How much do you pay in utilities (electric, water, gas)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
      ],
    },
    {
      category: 'Transportation',
      questions: [
        {
          id: 'carPayment',
          label: 'Do you have a car payment?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'carInsurance',
          label: 'How much do you pay for car insurance?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'gas',
          label: 'How much do you spend on gas per month?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'publicTransportation',
          label: 'How much do you spend on public transportation (buses, trains, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        }
      ],
    },
    {
      category: 'Food & Dining',
      questions: [
        {
          id: 'groceries',
          label: 'How much do you spend on groceries per month?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'diningOut',
          label: 'How much do you spend on dining out per month?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'takeout',
          label: 'How much do you spend on takeout per month?',
          type: 'number',
          placeholder: 'Enter amount',
        }
      ],
    },
    {
      category: 'Personal Care',
      questions: [
        {
          id: 'healthInsurance',
          label: 'How much do you pay for health insurance?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'medicalExpenses',
          label: 'How much do you spend on medical expenses per month?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'gymMembership',
          label: 'How much do you spend on gym membership per month?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'personalCare',
          label: 'How much do you spend on personal care (haircuts, skincare, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
      ],
    },
    {
      category: 'Entertainment & Personal Expenses',
      questions: [
        {
          id: 'entertainment',
          label: 'How much do you spend per month on entertainment (Going out, eating out, hobbies)?',
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
          label: 'Do you have any monthly subscription services (Netflix, Spotify, etc)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'personalCareBudget',
          label: 'What is your monthly budget for personal care (sport, salon, skincare, etc.)?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'travel',
          label: 'What do you spend on trips or holidays?',
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
                          return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
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
                  <li>Minimum target: ${minimumEmergencyFund.toFixed(2)} (3 months of needs)</li>
                  <li>Ideal target: ${recommendedEmergencyFund.toFixed(2)} (6 months of needs)</li>
                  <li>Current amount: ${currentEmergencyFund.toFixed(2)}</li>
                  {emergencyFundGap > 0 && (
                    <li className="budgettool-analysis-warning">
                      You need ${emergencyFundGap.toFixed(2)} more to reach the minimum target
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
          label: 'Do you expect your income to be the same for the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
        },
        {
          id: 'needsChange',
          label: 'Do you expect your needs spending to be the same for the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
        },
        {
          id: 'wantsChange',
          label: 'Do you think you can change your wants spending over the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ],
        }
      ],
      renderCustomContent: (formData) => {
        const summary = calculateBudgetSummary();
        
        // Get next 6 months from today
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

        // Calculate cumulative changes for a specific month
        const calculateCumulativeChanges = (monthIndex) => {
          const currentProjections = formData.monthlyProjections[monthIndex];
          const income = Number(currentProjections.income) || summary.totalIncome;
          const needs = Number(currentProjections.needs) || summary.needs;
          const wants = Number(currentProjections.wants) || summary.wants;
          const savings = income - needs - wants;
          
          const needsPercentage = (needs / income) * 100;
          const wantsPercentage = (wants / income) * 100;
          const savingsPercentage = (savings / income) * 100;

          const changeFromBase = {
            income: ((income - summary.totalIncome) / summary.totalIncome) * 100,
            needs: ((needs - summary.needs) / summary.needs) * 100,
            wants: ((wants - summary.wants) / summary.wants) * 100,
            savings: savings > 0 ? ((savings - (summary.totalIncome - summary.needs - summary.wants)) / 
                      (summary.totalIncome - summary.needs - summary.wants)) * 100 : 0
          };

          return {
            income,
            needs,
            wants,
            savings,
            needsPercentage,
            wantsPercentage,
            savingsPercentage,
            changeFromBase
          };
        };

        const handlePercentageChange = (index, field, percentageValue) => {
          const baseValue = index === 0 ? summary[field] : Number(formData.monthlyProjections[index - 1][field]);
          const percentage = parseFloat(percentageValue) || 0;
          const newValue = baseValue * (1 + percentage / 100);
          
          const newProjections = [...formData.monthlyProjections];
          newProjections[index] = {
            ...newProjections[index],
            [field]: newValue.toFixed(2),
            [`${field}Percentage`]: percentage  // Store the percentage value
          };

          // Update subsequent months to maintain their percentage changes relative to their previous month
          for (let i = index + 1; i < 6; i++) {
            const prevValue = Number(newProjections[i - 1][field]);
            const currentPercentage = Number(formData.monthlyProjections[i][`${field}Percentage`]) || 0;
            newProjections[i] = {
              ...newProjections[i],
              [field]: (prevValue * (1 + currentPercentage / 100)).toFixed(2),
              [`${field}Percentage`]: currentPercentage
            };
          }
          
          setFormData(prev => ({
            ...prev,
            monthlyProjections: newProjections
          }));
        };

        const handleAmountChange = (index, field, amount) => {
          const baseValue = index === 0 ? summary[field] : Number(formData.monthlyProjections[index - 1][field]);
          const newValue = parseFloat(amount) || 0;
          const percentageChange = ((newValue - baseValue) / baseValue) * 100;
          
          const newProjections = [...formData.monthlyProjections];
          newProjections[index] = {
            ...newProjections[index],
            [field]: newValue.toFixed(2),
            [`${field}Percentage`]: percentageChange.toFixed(2)
          };

          // Update subsequent months to maintain their percentage changes relative to their previous month
          for (let i = index + 1; i < 6; i++) {
            const prevValue = Number(newProjections[i - 1][field]);
            const currentPercentage = Number(formData.monthlyProjections[i][`${field}Percentage`]) || 0;
            newProjections[i] = {
              ...newProjections[i],
              [field]: (prevValue * (1 + currentPercentage / 100)).toFixed(2),
              [`${field}Percentage`]: currentPercentage
            };
          }
          
          setFormData(prev => ({
            ...prev,
            monthlyProjections: newProjections
          }));
        };

        const generateRandomData = (index) => {
          // Generate random percentage changes between -20% and +20%
          const getRandomPercentage = () => (Math.random() * 40 - 20).toFixed(2);
          
          const incomeChange = getRandomPercentage();
          const needsChange = getRandomPercentage();
          const wantsChange = getRandomPercentage();
          
          const baseIncome = index === 0 ? summary.totalIncome : Number(formData.monthlyProjections[index - 1].income);
          const baseNeeds = index === 0 ? summary.needs : Number(formData.monthlyProjections[index - 1].needs);
          const baseWants = index === 0 ? summary.wants : Number(formData.monthlyProjections[index - 1].wants);
          
          const newIncome = baseIncome * (1 + parseFloat(incomeChange) / 100);
          const newNeeds = baseNeeds * (1 + parseFloat(needsChange) / 100);
          const newWants = baseWants * (1 + parseFloat(wantsChange) / 100);
          
          const newProjections = [...formData.monthlyProjections];
          newProjections[index] = {
            income: newIncome.toFixed(2),
            needs: newNeeds.toFixed(2),
            wants: newWants.toFixed(2),
            savings: (newIncome - newNeeds - newWants).toFixed(2),
            totalIncomePercentage: incomeChange,
            needsPercentage: needsChange,
            wantsPercentage: wantsChange
          };
          
          // Update subsequent months to maintain their percentage changes relative to their previous month
          for (let i = index + 1; i < 6; i++) {
            const prevIncome = Number(newProjections[i - 1].income);
            const prevNeeds = Number(newProjections[i - 1].needs);
            const prevWants = Number(newProjections[i - 1].wants);
            
            const currentIncomePercentage = Number(formData.monthlyProjections[i].totalIncomePercentage) || 0;
            const currentNeedsPercentage = Number(formData.monthlyProjections[i].needsPercentage) || 0;
            const currentWantsPercentage = Number(formData.monthlyProjections[i].wantsPercentage) || 0;
            
            const nextIncome = prevIncome * (1 + currentIncomePercentage / 100);
            const nextNeeds = prevNeeds * (1 + currentNeedsPercentage / 100);
            const nextWants = prevWants * (1 + currentWantsPercentage / 100);
            
            newProjections[i] = {
              income: nextIncome.toFixed(2),
              needs: nextNeeds.toFixed(2),
              wants: nextWants.toFixed(2),
              savings: (nextIncome - nextNeeds - nextWants).toFixed(2),
              totalIncomePercentage: currentIncomePercentage,
              needsPercentage: currentNeedsPercentage,
              wantsPercentage: currentWantsPercentage
            };
          }
          
          setFormData(prev => ({
            ...prev,
            monthlyProjections: newProjections
          }));
        };
        
        return (
          <div className="budgettool-monthly-inputs">
            <h3 className="budgettool-monthly-inputs-title">Monthly Projections</h3>
            <p className="budgettool-monthly-inputs-text">
              Enter your expected changes for each month. You can either enter the exact amount or a percentage change.
              For percentage, use positive numbers for increase (e.g., 10 for 10% increase) and negative for decrease (e.g., -10 for 10% decrease).
            </p>
            
            <div className="budgettool-monthly-grid">
              {nextMonths.map((monthYear, index) => {
                const monthSummary = calculateCumulativeChanges(index);
                
                return (
                  <div key={index} className="budgettool-monthly-item">
                    <div className="budgettool-monthly-header">
                      <h4>{monthYear}</h4>
                      <button
                        onClick={() => generateRandomData(index)}
                        className="budgettool-button budgettool-button-secondary budgettool-button-small"
                      >
                        Generate Random Data
                      </button>
                    </div>
                    <div className="budgettool-monthly-fields">
                      <div className="budgettool-monthly-field">
                        <label>Income</label>
                        <div className="budgettool-input-group">
                          <input
                            type="number"
                            name={`monthlyProjections.${index}.income`}
                            value={formData.monthlyProjections[index].income}
                            onChange={(e) => handleAmountChange(index, 'totalIncome', e.target.value)}
                            placeholder={`Current: $${summary.totalIncome.toFixed(2)}`}
                            className="budgettool-input"
                          />
                          <div className="budgettool-percentage-input">
                            <input
                              type="number"
                              placeholder="% change"
                              value={formData.monthlyProjections[index].totalIncomePercentage || ''}
                              onChange={(e) => handlePercentageChange(index, 'totalIncome', e.target.value)}
                              className="budgettool-input"
                            />
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="budgettool-monthly-field">
                        <label>Needs</label>
                        <div className="budgettool-input-group">
                          <input
                            type="number"
                            name={`monthlyProjections.${index}.needs`}
                            value={formData.monthlyProjections[index].needs}
                            onChange={(e) => handleAmountChange(index, 'needs', e.target.value)}
                            placeholder={`Current: $${summary.needs.toFixed(2)}`}
                            className="budgettool-input"
                          />
                          <div className="budgettool-percentage-input">
                            <input
                              type="number"
                              placeholder="% change"
                              value={formData.monthlyProjections[index].needsPercentage || ''}
                              onChange={(e) => handlePercentageChange(index, 'needs', e.target.value)}
                              className="budgettool-input"
                            />
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="budgettool-monthly-field">
                        <label>Wants</label>
                        <div className="budgettool-input-group">
                          <input
                            type="number"
                            name={`monthlyProjections.${index}.wants`}
                            value={formData.monthlyProjections[index].wants}
                            onChange={(e) => handleAmountChange(index, 'wants', e.target.value)}
                            placeholder={`Current: $${summary.wants.toFixed(2)}`}
                            className="budgettool-input"
                          />
                          <div className="budgettool-percentage-input">
                            <input
                              type="number"
                              placeholder="% change"
                              value={formData.monthlyProjections[index].wantsPercentage || ''}
                              onChange={(e) => handlePercentageChange(index, 'wants', e.target.value)}
                              className="budgettool-input"
                            />
                            <span>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="budgettool-monthly-summary">
                        <h5>Month Summary</h5>
                        <div className="budgettool-monthly-summary-grid">
                          <div className="budgettool-monthly-summary-item">
                            <span>Income:</span>
                            <span>${monthSummary.income.toFixed(2)}</span>
                            <span className={monthSummary.changeFromBase.income >= 0 ? 'positive' : 'negative'}>
                              ({monthSummary.changeFromBase.income.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="budgettool-monthly-summary-item">
                            <span>Needs:</span>
                            <span>${monthSummary.needs.toFixed(2)}</span>
                            <span className={monthSummary.changeFromBase.needs >= 0 ? 'positive' : 'negative'}>
                              ({monthSummary.changeFromBase.needs.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="budgettool-monthly-summary-item">
                            <span>Wants:</span>
                            <span>${monthSummary.wants.toFixed(2)}</span>
                            <span className={monthSummary.changeFromBase.wants >= 0 ? 'positive' : 'negative'}>
                              ({monthSummary.changeFromBase.wants.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="budgettool-monthly-summary-item">
                            <span>Savings:</span>
                            <span>${monthSummary.savings.toFixed(2)}</span>
                            <span className={monthSummary.changeFromBase.savings >= 0 ? 'positive' : 'negative'}>
                              ({monthSummary.changeFromBase.savings.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="budgettool-monthly-distribution">
                          <div className="budgettool-monthly-distribution-item">
                            <span>Distribution:</span>
                            <span>Needs: {monthSummary.needsPercentage.toFixed(1)}%</span>
                            <span>Wants: {monthSummary.wantsPercentage.toFixed(1)}%</span>
                            <span>Savings: {monthSummary.savingsPercentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
                  <span>${month.income.toFixed(2)}</span>
                </div>
                <div className="budgettool-projections-item">
                  <span>Needs:</span>
                  <span>${month.needs.toFixed(2)}</span>
                </div>
                <div className="budgettool-projections-item">
                  <span>Wants:</span>
                  <span>${month.wants.toFixed(2)}</span>
                </div>
                <div className="budgettool-projections-item">
                  <span>Savings:</span>
                  <span>${month.savings.toFixed(2)}</span>
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
              <span className="budgettool-summary-value">${summary.totalIncome.toFixed(2)}</span>
            </div>
            <div className="budgettool-summary-item">
              <span className="budgettool-summary-label">Needs:</span>
              <span className="budgettool-summary-value">${summary.needs.toFixed(2)} ({summary.needsPercentage.toFixed(1)}%)</span>
            </div>
            <div className="budgettool-summary-item">
              <span className="budgettool-summary-label">Wants:</span>
              <span className="budgettool-summary-value">${summary.wants.toFixed(2)} ({summary.wantsPercentage.toFixed(1)}%)</span>
            </div>
            <div className="budgettool-summary-item">
              <span className="budgettool-summary-label">Remaining:</span>
              <span className="budgettool-summary-value">${(summary.totalIncome - summary.needs - summary.wants).toFixed(2)} ({summary.remainingPercentage.toFixed(1)}%)</span>
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
      ['Student Loans', Number(formData.studentLoans) || 0, 'Current Balance'],
      ['Other Debt', Number(formData.otherDebt) || 0, 'Current Balance'],
      ['Total Debt', 
        (Number(formData.creditCardDebt) || 0) + 
        (Number(formData.studentLoans) || 0) + 
        (Number(formData.otherDebt) || 0), 
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
        numFmt: '"$"#,##0.00',
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
          numFmt: '"$"#,##0.00',
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
          
          {questions[currentStep].renderCustomContent ? (
            questions[currentStep].renderCustomContent(formData)
          ) : (
            questions[currentStep].questions.map((question, index) => {
              if (question.showIf && !question.showIf(formData)) {
                return null;
              }

              return (
                <div key={index} className="budgettool-question">
                  <label className="budgettool-label">{question.label}</label>
                  {renderQuestion(question)}
                </div>
              );
            })
          )}

          {currentStep === questions.length - 1 && renderSavingsInfo()}
          {/* {currentStep === questions.length - 1 && renderMonthlyProjections()} */}
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