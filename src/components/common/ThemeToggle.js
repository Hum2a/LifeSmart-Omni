import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: 24,
        right: 0,
        zIndex: 1000,
        padding: '10px 20px',
        borderRadius: '22px',
        border: 'none',
        background: theme === 'dark' ? '#ffffff' : '#000000',
        color: theme === 'dark' ? '#000000' : '#ffffff',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: theme === 'dark' 
          ? '0 0 20px rgba(255, 255, 255, 0.5)' 
          : '0 0 20px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
      }}
    >
      <span style={{
        position: 'relative',
        zIndex: 2,
      }}>
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </span>
    </button>
  );
}

export default ThemeToggle; 