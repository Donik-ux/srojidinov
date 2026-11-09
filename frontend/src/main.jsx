import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './app/store';
import App from './App';
import './i18n';
import './index.css';

// Wake up the (free-tier) API server as early as possible so it is ready by the
// time the visitor opens the admin login or any data-driven page.
if (import.meta.env.VITE_API_URL) {
  fetch(`${import.meta.env.VITE_API_URL}/api/health`, { mode: 'no-cors', cache: 'no-store' }).catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HelmetProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            theme="dark"
            toastStyle={{ background: '#2d4057', border: '1px solid rgba(255,255,255,0.1)', color: '#DDE6ED' }}
          />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
