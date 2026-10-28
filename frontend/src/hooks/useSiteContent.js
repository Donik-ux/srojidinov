import { useEffect, useState } from 'react';
import api from '../services/api';
import { SITE_FALLBACK } from '../utils/siteFallback';

const mergeDeep = (target, source) => {
  const out = Array.isArray(target) ? [...target] : { ...target };
  if (!source || typeof source !== 'object') return out;
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = mergeDeep(target?.[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      out[key] = source[key];
    }
  });
  return out;
};

export const useSiteContent = (lang = 'uz') => {
  const [content, setContent] = useState(SITE_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Пробуем публичный эндпоинт конструктора сайта
        const res = await api.get('/site/content', { params: { lang } });
        const data = res.data?.data || res.data?.content || res.data;

        if (!cancelled && data && typeof data === 'object') {
          const merged = mergeDeep(SITE_FALLBACK, data?.home ? data : { home: data });
          // Если пришёл плоский вид с home блоком
          setContent(merged.home ? merged.home : merged);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          // Всегда остаёмся на фоллбэке - сайт не ломается
          setContent(SITE_FALLBACK);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { content, loading, error };
};

export default useSiteContent;
