// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ModoProvider } from './context/ModoContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🔹 El BrowserRouter debe envolver toda la app, incluyendo el contexto */}
    <BrowserRouter>
      <ModoProvider>
        <App />
      </ModoProvider>
    </BrowserRouter>
  </React.StrictMode>
);