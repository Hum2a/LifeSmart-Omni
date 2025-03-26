import React from 'react';
import BudgetSpreadsheet from './BudgetSpreadsheet';
import '../../styles/SpreadsheetModal.css';

const SpreadsheetModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  return (
    <div className="spreadsheet-modal-overlay">
      <div className="spreadsheet-modal-content">
        <button className="spreadsheet-modal-close" onClick={onClose}>
          ×
        </button>
        <BudgetSpreadsheet formData={formData} />
      </div>
    </div>
  );
};

export default SpreadsheetModal; 