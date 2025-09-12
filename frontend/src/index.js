import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza o App principal
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Mantém o report de performance opcional
reportWebVitals(console.log);
