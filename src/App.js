import React from 'react';
import './App.css';
import Navigation from './components/common/Navigation';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Navigation />
    </HelmetProvider>
  );
}

export default App;
