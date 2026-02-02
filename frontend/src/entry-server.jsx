import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/AuthContext';
import AppContent from './App.jsx';

export function render(url, context = {}) {
  const html = renderToString(
    <StrictMode>
      <ErrorProvider>
        <AuthProvider>
          <StaticRouter location={url}>
            <AppContent />
          </StaticRouter>
        </AuthProvider>
      </ErrorProvider>
    </StrictMode>
  );
  return { html };
}
