import React from 'react';
import '../styles/BudgetSpreadsheet.css';
import ExcelJS from 'exceljs';

// Create downloadSpreadsheet as a standalone function
export const downloadSpreadsheet = async (formData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Budget Projection');

  // Set column widths
  worksheet.columns = [
    { header: 'Category', key: 'category', width: 40 },
    ...Array(12).fill(null).map(() => ({ width: 20 }))
  ];

  // Helper function to get the predicted value for a specific field and month
  const getPredictedValue = (monthIndex, category, subcategory = null) => {
    const monthData = formData.monthlyProjections[monthIndex] || {};
    
    if (subcategory) {
      if (category === 'needs') {
        return monthData.needsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'wants') {
        return monthData.wantsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'savings') {
        return monthData.savingsDetails?.[subcategory] || formData[subcategory] || 0;
      }
    }
    return monthData[category] || 0;
  };

  // Helper function to calculate totals for each category
  const calculateTotals = (monthIndex) => {
    const monthData = formData.monthlyProjections[monthIndex] || {};

    const totalNeeds = monthData.needs || (
      Number(formData.rent || formData.mortgage || 0) +
      Number(formData.utilities || 0) +
      Number(formData.transportation || 0) +
      Number(formData.groceries || 0) +
      Number(formData.healthInsurance || 0) +
      Number(formData.medicalExpenses || 0)
    );

    const totalWants = monthData.wants || (
      Number(formData.subscriptions || 0) +
      Number(formData.diningOut || 0) +
      Number(formData.gymMembership || 0) +
      Number(formData.shopping || 0) +
      Number(formData.entertainment || 0) +
      Number(formData.travel || 0) +
      Number(formData.charity || 0)
    );

    const totalIncome = monthData.income || (
      Number(formData.monthlyIncome || 0) +
      Number(formData.additionalIncome || 0)
    );

    const fundsRemaining = totalIncome - totalNeeds - totalWants;

    const savings = {
      sinkingFund: monthData.savingsDetails?.sinkingFund || Number(formData.sinkingFund || 0),
      goalFund: monthData.savingsDetails?.goalFund || Number(formData.goalFund || 0),
      emergencyFund: monthData.savingsDetails?.emergencyFund || Number(formData.emergencyFund || 0)
    };

    const distribution = {
      needs: totalIncome > 0 ? (totalNeeds / totalIncome) * 100 : 0,
      wants: totalIncome > 0 ? (totalWants / totalIncome) * 100 : 0,
      savings: totalIncome > 0 ? (fundsRemaining / totalIncome) * 100 : 0
    };

    return {
      totalIncome,
      totalNeeds,
      totalWants,
      fundsRemaining,
      savings,
      distribution
    };
  };

  const getNextMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(nextMonth.toLocaleString('default', { month: 'long' }));
    }
    return months;
  };

  const months = getNextMonths();

  // Add headers
  const headerRow = worksheet.addRow(['Category']);
  months.forEach(month => {
    headerRow.getCell(headerRow.cellCount + 1).value = `${month} (Predicted)`;
    headerRow.getCell(headerRow.cellCount + 1).value = `${month} (Actual)`;
  });

  // Style header row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
  });

  // Helper function to add a section header
  const addSectionHeader = (title) => {
    const row = worksheet.addRow([title]);
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB8CCE4' }
    };
    row.font = { bold: true };
    worksheet.mergeCells(`A${row.number}:M${row.number}`);
  };

  // Helper function to add data rows
  const addDataRow = (label, values) => {
    const row = worksheet.addRow([label, ...values]);
    row.eachCell((cell, colNumber) => {
      if (colNumber > 1) { // Skip the label column
        cell.numFmt = '£#,##0.00';
      }
    });
    return row;
  };

  // INCOME SECTION
  addSectionHeader('TOTAL INCOME');
  
  // Salary row (only monthly income)
  const salaryValues = [];
  months.forEach((_, index) => {
    salaryValues.push(Number(formData.monthlyIncome || 0), null); // null for actual
  });
  addDataRow('Salary', salaryValues);

  // Other income row (only additional income)
  const otherValues = [];
  months.forEach((_, index) => {
    otherValues.push(Number(formData.additionalIncome || 0), null);
  });
  addDataRow('Other', otherValues);

  // NEEDS SECTION
  addSectionHeader("TOTAL 'NEEDS' SPENDING");
  const needsCategories = [
    { label: "Rent", key: "rent" },
    { label: "Bills (utilities, bills, internet)", key: "utilities" },
    { label: "Transport", key: "transportation" },
    { label: "Groceries (basic)", key: "groceries" },
    { label: "Health (contact lenses)", key: "medicalExpenses" },
    { label: "Unexpected", key: "unexpected" }
  ];

  needsCategories.forEach(({ label, key }) => {
    const values = [];
    months.forEach((_, index) => {
      values.push(
        getPredictedValue(index, 'needs', key),
        null
      );
    });
    addDataRow(label, values);
  });

  // WANTS SECTION
  addSectionHeader("TOTAL 'WANTS' SPENDING");
  const wantsCategories = [
    { label: "Subscriptions", key: "subscriptions" },
    { label: "Takeaway/eating out", key: "diningOut" },
    { label: "Gym and sport", key: "gymMembership" },
    { label: "Shopping (clothes and accessories)", key: "shopping" },
    { label: "Shopping (tech, books and other)", key: "shopping" },
    { label: "Entertainment (events and activities)", key: "entertainment" },
    { label: "Gifts and charity", key: "charity" },
    { label: "Other", key: "other" },
    { label: "Large spend (sinking fund)", key: "sinkingFund" }
  ];

  wantsCategories.forEach(({ label, key }) => {
    const values = [];
    months.forEach((_, index) => {
      const totals = calculateTotals(index);
      values.push(
        key === "other" ? 0 : 
        key === "sinkingFund" ? totals.savings.sinkingFund :
        getPredictedValue(index, 'wants', key),
        null
      );
    });
    addDataRow(label, values);
  });

  // FUNDS REMAINING
  addSectionHeader('Funds remaining');
  const fundsRemainingValues = [];
  months.forEach((_, index) => {
    const totals = calculateTotals(index);
    fundsRemainingValues.push(totals.fundsRemaining, null);
  });
  addDataRow('Funds remaining', fundsRemainingValues);

  // SAVINGS SECTION
  addSectionHeader('TOTAL SAVINGS');
  const savingsCategories = [
    { label: "Sinking Fund", key: "sinkingFund" },
    { label: "Goal Fund", key: "goalFund" },
    { label: "Emergency fund (gatehouse)", key: "emergencyFund" }
  ];

  savingsCategories.forEach(({ label, key }) => {
    const values = [];
    months.forEach((_, index) => {
      const totals = calculateTotals(index);
      values.push(totals.savings[key], null);
    });
    addDataRow(label, values);
  });

  // DISTRIBUTION SECTION
  addSectionHeader('Distribution');
  ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'].forEach((label, idx) => {
    const values = [];
    months.forEach((_, index) => {
      const totals = calculateTotals(index);
      const dist = ['needs', 'wants', 'savings'][idx];
      values.push(`${totals.distribution[dist].toFixed(1)}%`, null);
    });
    const row = worksheet.addRow([label, ...values]);
    row.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        cell.alignment = { horizontal: 'right' };
      }
    });
  });

  // FUND BALANCES
  addSectionHeader('Fund Balances');
  const balanceCategories = [
    { label: "Sinking Fund balance", key: "sinkingFund" },
    { label: "Goal Fund balance", key: "goalFund" },
    { label: "Emergency Fund balance", key: "emergencyFund" }
  ];

  balanceCategories.forEach(({ label, key }) => {
    const values = [];
    months.forEach((_, index) => {
      let cumulativeBalance = Number(formData[key] || 0);
      for (let i = 0; i <= index; i++) {
        const monthData = formData.monthlyProjections[i] || {};
        cumulativeBalance += Number(monthData.savingsDetails?.[key] || formData[key] || 0);
      }
      values.push(cumulativeBalance, null);
    });
    addDataRow(label, values);
  });

  // Apply borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Auto-filter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headerRow.cellCount }
  };

  // Generate the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', '6_month_budget_projection.xlsx');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const BudgetSpreadsheet = ({ formData }) => {
  const handleDownload = () => {
    downloadSpreadsheet(formData);
  };

  const formatCurrency = (value) => {
    // Remove any existing currency symbols and non-breaking spaces
    const cleanValue = String(value || 0).replace(/[£\u00A0]/g, '').trim();
    // Format without using toLocaleString to avoid any truncation
    return `£${Number(cleanValue).toFixed(2)}`;
  };

  const getNextMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(nextMonth.toLocaleString('default', { month: 'long' }));
    }
    return months;
  };

  const months = getNextMonths();

  // Helper function to get the predicted value for a specific field and month
  const getPredictedValue = (monthIndex, category, subcategory = null) => {
    const monthData = formData.monthlyProjections[monthIndex] || {};
    
    if (subcategory) {
      if (category === 'needs') {
        return monthData.needsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'wants') {
        return monthData.wantsDetails?.[subcategory] || formData[subcategory] || 0;
      } else if (category === 'savings') {
        return monthData.savingsDetails?.[subcategory] || formData[subcategory] || 0;
      }
    }

    return monthData[category] || 0;
  };

  // Helper function to calculate totals for each category
  const calculateTotals = (monthIndex) => {
    const monthData = formData.monthlyProjections[monthIndex] || {};

    const totalIncome = monthData.income || (
      Number(formData.monthlyIncome || 0) +
      Number(formData.additionalIncome || 0)
    );

    const totalNeeds = monthData.needs || (
      Number(formData.rent || formData.mortgage || 0) +
      Number(formData.utilities || 0) +
      Number(formData.transportation || 0) +
      Number(formData.groceries || 0) +
      Number(formData.healthInsurance || 0) +
      Number(formData.medicalExpenses || 0)
    );

    const totalWants = monthData.wants || (
      Number(formData.subscriptions || 0) +
      Number(formData.diningOut || 0) +
      Number(formData.gymMembership || 0) +
      Number(formData.shopping || 0) +
      Number(formData.entertainment || 0) +
      Number(formData.travel || 0) +
      Number(formData.charity || 0)
    );

    const fundsRemaining = totalIncome - totalNeeds - totalWants;

    const savings = {
      sinkingFund: monthData.savingsDetails?.sinkingFund || Number(formData.sinkingFund || 0),
      goalFund: monthData.savingsDetails?.goalFund || Number(formData.goalFund || 0),
      emergencyFund: monthData.savingsDetails?.emergencyFund || Number(formData.emergencyFund || 0)
    };

    const distribution = {
      needs: totalIncome > 0 ? (totalNeeds / totalIncome) * 100 : 0,
      wants: totalIncome > 0 ? (totalWants / totalIncome) * 100 : 0,
      savings: totalIncome > 0 ? (fundsRemaining / totalIncome) * 100 : 0
    };

    return {
      totalIncome,
      totalNeeds,
      totalWants,
      fundsRemaining,
      savings,
      distribution
    };
  };

  return (
    <div className="budgetspreadsheet-container">
      <div className="budgetspreadsheet-content">
        <header className="budgetspreadsheet-header">
          <h1>6-Month Budget Projection</h1>
          <p>Track your finances across the next 6 months</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button 
              className="budgettool-button budgettool-button-primary"
              onClick={handleDownload}
            >
              Download Excel Spreadsheet
            </button>
          </div>
        </header>

        <div className="budgetspreadsheet-table-wrapper">
          <table className="budgetspreadsheet-table">
            <colgroup>
              <col style={{ width: '250px' }} /> {/* Category column */}
              {months.map((_, index) => (
                <React.Fragment key={index}>
                  <col style={{ width: '120px' }} /> {/* Predicted column */}
                  <col style={{ width: '120px' }} /> {/* Actual column */}
                </React.Fragment>
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="fixed-column">Category</th>
                {months.map((month, index) => (
                  <th key={index} colSpan="2">
                    {month}
                    <div className="column-subheader">
                      <span>Predicted</span>
                      <span>Actual</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* INCOME SECTION */}
              <tr className="section-header">
                <td colSpan={13}>TOTAL INCOME</td>
              </tr>
              <tr>
                <td className="fixed-column">Salary</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(Number(formData.monthlyIncome || 0))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Other</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(Number(formData.additionalIncome || 0))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>

              {/* NEEDS SECTION */}
              <tr className="section-header">
                <td colSpan={13}>TOTAL 'NEEDS' SPENDING</td>
              </tr>
              <tr>
                <td className="fixed-column">Rent</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'needs', 'rent'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Bills (utilities, bills, internet)</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'needs', 'utilities'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Transport</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'needs', 'transportation'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Groceries (basic)</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'needs', 'groceries'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Health (contact lenses)</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'needs', 'medicalExpenses'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Unexpected</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">£0.00</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>

              {/* WANTS SECTION */}
              <tr className="section-header">
                <td colSpan={13}>TOTAL 'WANTS' SPENDING</td>
              </tr>
              <tr>
                <td className="fixed-column">Subscriptions</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'wants', 'subscriptions'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Takeaway/eating out</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'wants', 'diningOut'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Gym and sport</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'wants', 'gymMembership'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Shopping (clothes and accessories)</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'wants', 'shopping'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Shopping (tech, books and other)</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'wants', 'shopping'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Entertainment (events and activities)</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'wants', 'entertainment'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Gifts and charity</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">{formatCurrency(getPredictedValue(index, 'wants', 'charity'))}</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Other</td>
                {months.map((_, index) => (
                  <React.Fragment key={index}>
                    <td className="predicted">£0.00</td>
                    <td className="actual"></td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="fixed-column">Large spend (sinking fund)</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(totals.savings.sinkingFund)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* FUNDS REMAINING */}
              <tr className="section-header">
                <td colSpan={13}>Funds remaining</td>
              </tr>
              <tr>
                <td className="fixed-column">Funds remaining</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(totals.fundsRemaining)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* SAVINGS SECTION */}
              <tr className="section-header">
                <td colSpan={13}>TOTAL SAVINGS</td>
              </tr>
              <tr>
                <td className="fixed-column">Sinking Fund</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(totals.savings.sinkingFund)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Goal Fund</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(totals.savings.goalFund)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Emergency fund (gatehouse)</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(totals.savings.emergencyFund)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* DISTRIBUTION SECTION */}
              <tr className="section-header">
                <td colSpan={13}>Distribution</td>
              </tr>
              <tr>
                <td className="fixed-column">Needs (50%)</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{totals.distribution.needs.toFixed(1)}%</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Wants (30%)</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{totals.distribution.wants.toFixed(1)}%</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Savings (20%)</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{totals.distribution.savings.toFixed(1)}%</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* FUND BALANCES */}
              <tr className="section-header">
                <td colSpan={13}>Fund Balances</td>
              </tr>
              <tr>
                <td className="fixed-column">Sinking Fund balance</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  // Calculate cumulative balance by adding monthly contributions
                  let cumulativeBalance = Number(formData.sinkingFund || 0);
                  for (let i = 0; i <= index; i++) {
                    const monthData = formData.monthlyProjections[i] || {};
                    cumulativeBalance += Number(monthData.savingsDetails?.sinkingFund || formData.sinkingFund || 0);
                  }
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(cumulativeBalance)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Goal Fund balance</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  // Calculate cumulative balance by adding monthly contributions
                  let cumulativeBalance = Number(formData.goalFund || 0);
                  for (let i = 0; i <= index; i++) {
                    const monthData = formData.monthlyProjections[i] || {};
                    cumulativeBalance += Number(monthData.savingsDetails?.goalFund || formData.goalFund || 0);
                  }
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(cumulativeBalance)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
              <tr>
                <td className="fixed-column">Emergency Fund balance</td>
                {months.map((_, index) => {
                  const totals = calculateTotals(index);
                  // Calculate cumulative balance by adding monthly contributions
                  let cumulativeBalance = Number(formData.emergencyFund || 0);
                  for (let i = 0; i <= index; i++) {
                    const monthData = formData.monthlyProjections[i] || {};
                    cumulativeBalance += Number(monthData.savingsDetails?.emergencyFund || formData.emergencyFund || 0);
                  }
                  return (
                    <React.Fragment key={index}>
                      <td className="predicted">{formatCurrency(cumulativeBalance)}</td>
                      <td className="actual"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Large spending log */}
        <div className="budgetspreadsheet-spending-log">
          <h2>Large spending log</h2>
          <table className="budgetspreadsheet-log-table">
            <thead>
              <tr>
                <th>Details</th>
                <th>Amount</th>
                <th>Details</th>
                <th>Amount</th>
                <th>Details</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetSpreadsheet; 