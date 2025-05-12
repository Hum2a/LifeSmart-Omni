import React from 'react';
import './GlossaryModal.css';
import { FaBookOpen } from 'react-icons/fa';

const GlossaryModal = ({ open, onClose, title, children }) => {
  return (
    <div className={`glossary-modal-backdrop${open ? ' open' : ''}`} onClick={onClose}>
      <div
        className={`glossary-modal${open ? ' open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="glossary-modal-header">
          <FaBookOpen className="glossary-modal-icon" />
          <span className="glossary-modal-title">{title}</span>
          <button className="glossary-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="glossary-modal-content">{children}</div>
      </div>
    </div>
  );
};

export default GlossaryModal; 