import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { IntakeProvider } from './context/IntakeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IntakeProvider>
      <App />
    </IntakeProvider>
  </React.StrictMode>
);
