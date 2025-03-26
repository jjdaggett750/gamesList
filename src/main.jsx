import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import GameTracker from './pages/GameTracker';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameTracker />
  </React.StrictMode>
);