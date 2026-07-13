import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';
import './index.css';

setAuthTokenGetter(() => localStorage.getItem('token'));

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

createRoot(rootEl).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
