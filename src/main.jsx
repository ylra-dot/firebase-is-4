import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AuthProvider } from "./context/AuthProvider";
// ASUMIENDO: La importación de tu contexto de Modo Oscuro
import { ModoProvider } from './context/ModoContext'; 
//                     ^ (Puede ser otra ruta, ajústala si es necesario)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Proveedor de Modo Oscuro (DEBE estar arriba para que Navbar lo use) */}
    <ModoProvider> 
        {/* 2. Proveedor de Autenticación */}
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
      </ModoProvider>
      </React.StrictMode>
);
