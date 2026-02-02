import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/AuthContext';
import AppContent from './App.jsx';

// Hydrate the app on the client
hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <ErrorProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  </StrictMode>
);
