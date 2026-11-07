import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { fetchMe, setCredentials, markInitialized } from './features/auth/authSlice';
import { warmupBackend } from './services/api';
import AppRouter from './routes/AppRouter';

let restorePromise = null;

const PLACEHOLDER =
  'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#2a2a3a"/>' +
    '<path d="M180 140h40v40h-40z" fill="#555"/>' +
    '<text x="200" y="200" text-anchor="middle" fill="#666" font-size="14">Rasm topilmadi</text>' +
    '</svg>'
  );

const App = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const requiresBackend = pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/profile' || pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (requiresBackend) warmupBackend();
  }, [requiresBackend]);

  useEffect(() => {
    document.addEventListener('error', (e) => {
      if (e.target?.tagName === 'IMG' && !e.target.dataset.fallback) {
        e.target.dataset.fallback = 'true';
        e.target.src = PLACEHOLDER;
      }
    }, true);
  }, []);

  useEffect(() => {
    if (!requiresBackend) {
      dispatch(markInitialized());
      return;
    }

    // Access token lives only in memory (not localStorage). The session is restored
    // from the httpOnly refresh cookie; a single shared request avoids double rotation.
    if (!restorePromise) {
      const BASE = `${import.meta.env.VITE_API_URL || ''}/api`;
      restorePromise = axios
        .post(`${BASE}/auth/refresh`, {}, { withCredentials: true })
        .then(({ data }) => data.accessToken || data.data?.accessToken || null)
        .catch(() => null);
    }
    restorePromise.then((token) => {
      restorePromise = null;
      if (token) {
        dispatch(setCredentials({ accessToken: token }));
        dispatch(fetchMe());
      } else {
        dispatch(markInitialized());
      }
    });
  }, [dispatch, requiresBackend]);

  return <AppRouter />;
};

export default App;
