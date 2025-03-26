import React, { useState } from 'react';
import '../../styles/BudgetTool.css';
import BudgetSpreadsheet from './BudgetSpreadsheet';
import SpreadsheetModal from './SpreadsheetModal';
import * as XLSX from 'xlsx';

const BudgetTool = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Income Information
    monthlyIncome: '',
    additionalIncome: '',
    incomeFrequency: 'monthly',
    
    // Housing Expenses
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
    incomeChange: 'yes',
    incomeChangeMonth: '',
    needsChange: 'yes',
    needsChangeMonth: '',
    wantsChange: 'yes',
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
        },
        {
          id: 'incomeFrequency',
          label: 'How often do you receive your income?',
          type: 'select',
          options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Bi-weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'annually', label: 'Annually' },
          ],
        },
      ],
    },
    {
      category: 'Housing',
      questions: [
        {
          id: 'rent',
          label: 'How much do you pay in rent?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'mortgage',
          label: 'How much is your mortgage payment?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'propertyTax',
          label: 'How much do you pay in property tax?',
          type: 'number',
          placeholder: 'Enter amount',
        },
        {
          id: 'homeInsurance',
          label: 'How much is your home insurance?',
          type: 'number',
          placeholder: 'Enter amount',
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
      category: '6-Month Projection',
      questions: [
        {
          id: 'incomeChange',
          label: 'Do you expect your income to be the same for the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 'incomeChangeMonth',
          label: 'Which month do you expect your income to change?',
          type: 'select',
          options: [
            { value: '1', label: 'Month 1' },
            { value: '2', label: 'Month 2' },
            { value: '3', label: 'Month 3' },
            { value: '4', label: 'Month 4' },
            { value: '5', label: 'Month 5' },
            { value: '6', label: 'Month 6' },
          ],
          showIf: (data) => data.incomeChange === 'no',
        },
        {
          id: 'needsChange',
          label: 'Do you expect your needs spending to be the same for the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 'needsChangeMonth',
          label: 'Which month do you expect your needs spending to change?',
          type: 'select',
          options: [
            { value: '1', label: 'Month 1' },
            { value: '2', label: 'Month 2' },
            { value: '3', label: 'Month 3' },
            { value: '4', label: 'Month 4' },
            { value: '5', label: 'Month 5' },
            { value: '6', label: 'Month 6' },
          ],
          showIf: (data) => data.needsChange === 'no',
        },
        {
          id: 'wantsChange',
          label: 'Do you expect your wants spending to be the same for the next 6 months?',
          type: 'select',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 'wantsChangeMonth',
          label: 'Which month do you expect your wants spending to change?',
          type: 'select',
          options: [
            { value: '1', label: 'Month 1' },
            { value: '2', label: 'Month 2' },
            { value: '3', label: 'Month 3' },
            { value: '4', label: 'Month 4' },
            { value: '5', label: 'Month 5' },
            { value: '6', label: 'Month 6' },
          ],
          showIf: (data) => data.wantsChange === 'no',
        },
      ],
    },
  ];

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
    const projections = calculateMonthlyProjections();
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare all data in sections with spacing between them
    const allData = [
      ['INCOME INFORMATION', '', ''],
      ['Category', 'Amount', 'Frequency/Type'],
      ['Monthly Income', Number(formData.monthlyIncome) || 0, formData.incomeFrequency],
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
      
      ['6-MONTH PROJECTION', '', '', '', ''],
      ['Month', 'Income', 'Needs', 'Wants', 'Savings', 'Changes Expected'],
      ...projections.map((month, index) => [
        `Month ${index + 1}`,
        month.income.toFixed(2),
        month.needs.toFixed(2),
        month.wants.toFixed(2),
        month.savings.toFixed(2),
        getMonthChanges(index + 1)
      ]),
      ['', '', '', '', ''],
      ['Projection Settings', '', '', '', ''],
      ['Income Change Expected', formData.incomeChange === 'no' ? 'Yes' : 'No', '', '', ''],
      ['Income Change Month', formData.incomeChangeMonth || 'N/A', '', '', ''],
      ['Needs Change Expected', formData.needsChange === 'no' ? 'Yes' : 'No', '', '', ''],
      ['Needs Change Month', formData.needsChangeMonth || 'N/A', '', '', ''],
      ['Wants Change Expected', formData.wantsChange === 'no' ? 'Yes' : 'No', '', '', ''],
      ['Wants Change Month', formData.wantsChangeMonth || 'N/A', '', '', ''],
      ['Can Reduce Wants', formData.canReduceWants || 'N/A', '', '', '']
    ];

    // Create the worksheet
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Define styles
    const styles = {
      headerSection: {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4CAF50" } },
        alignment: { horizontal: "center" }
      },
      subHeader: {
        font: { bold: true },
        fill: { fgColor: { rgb: "E8F5E9" } },
        alignment: { horizontal: "center" }
      },
      totalRow: {
        font: { bold: true },
        fill: { fgColor: { rgb: "C8E6C9" } }
      },
      currency: {
        numFmt: '"$"#,##0.00'
      },
      percentage: {
        numFmt: '0.0"%"'
      },
      defaultCell: {
        alignment: { horizontal: "left" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      }
    };

    // Apply column widths
    ws['!cols'] = [
      { wch: 25 }, // Category column
      { wch: 15 }, // Amount column
      { wch: 15 }, // Frequency/Type column
      { wch: 15 }, // Extra column for projections
      { wch: 20 }  // Changes Expected column
    ];

    // Apply styles to section headers
    const sectionHeaders = {
      'A1': 'INCOME INFORMATION',
      'A8': 'HOUSING EXPENSES',
      'A19': 'TRANSPORTATION EXPENSES',
      'A27': 'FOOD & DINING EXPENSES',
      'A34': 'PERSONAL CARE EXPENSES',
      'A42': 'ENTERTAINMENT & LEISURE EXPENSES',
      'A51': 'DEBT INFORMATION',
      'A59': 'SAVINGS INFORMATION',
      'A69': 'BUDGET SUMMARY',
      'A79': '6-MONTH PROJECTION'
    };

    // Apply header styles
    Object.keys(sectionHeaders).forEach(cell => {
      if (!ws[cell]) ws[cell] = {};
      ws[cell].s = styles.headerSection;
      // Merge cells for section headers
      const mergeCell = cell.replace('A', '');
      ws['!merges'] = ws['!merges'] || [];
      ws['!merges'].push({ s: { r: parseInt(mergeCell) - 1, c: 0 }, e: { r: parseInt(mergeCell) - 1, c: 2 } });
    });

    // Apply subheader styles (Category, Amount, Frequency rows)
    const subHeaders = ['A2', 'A9', 'A20', 'A28', 'A35', 'A43', 'A52', 'A60', 'A70', 'A80'];
    subHeaders.forEach(cell => {
      if (!ws[cell]) ws[cell] = {};
      ws[cell].s = styles.subHeader;
    });

    // Apply total row styles
    const totalRows = ['A5', 'A14', 'A24', 'A31', 'A38', 'A47', 'A54', 'A66', 'A73'];
    totalRows.forEach(cell => {
      if (!ws[cell]) ws[cell] = {};
      ws[cell].s = styles.totalRow;
    });

    // Apply currency format to amount columns
    for (let i = 1; i < 100; i++) {
      const cell = `B${i}`;
      if (ws[cell] && typeof ws[cell].v === 'number') {
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s = { ...ws[cell].s, ...styles.currency };
      }
    }

    // Apply percentage format to percentage cells
    const percentageCells = ['C71', 'C72', 'C73', 'C74', 'C77', 'C78', 'C79'];
    percentageCells.forEach(cell => {
      if (ws[cell]) {
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s = { ...ws[cell].s, ...styles.percentage };
      }
    });

    // Apply default cell style to all cells
    for (let i = 1; i < 100; i++) {
      for (let j = 0; j < 5; j++) {
        const cell = XLSX.utils.encode_cell({ r: i, c: j });
        if (ws[cell]) {
          if (!ws[cell].s) ws[cell].s = {};
          ws[cell].s = { ...ws[cell].s, ...styles.defaultCell };
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
          
          {questions[currentStep].questions.map((question, index) => (
            <div key={index} className="budgettool-question">
              <label className="budgettool-label">{question.label}</label>
              {renderQuestion(question)}
            </div>
          ))}

          {currentStep === questions.length - 1 && renderSavingsInfo()}
          {currentStep === questions.length - 1 && renderMonthlyProjections()}
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
                  onClick={() => window.location.href = '/homescreen'}
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