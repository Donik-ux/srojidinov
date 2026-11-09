import { useEffect, useState } from 'react';
import api from '../services/api';
import i18n from '../i18n';
import { SITE_FALLBACK } from '../utils/siteFallback';

let englishContentRequest;
const RESOURCE_CACHE_MS = 15_000;
const resourceCache = new Map();
const pendingRequests = new Map();

const getEnglishContent = () => {
  if (!englishContentRequest) {
    englishContentRequest = api.get('/site/content', { params: { lang: 'en' } }).catch((error) => {
      englishContentRequest = null;
      throw error;
    });
  }
  return englishContentRequest;
};

const getCachedResource = (key, request) => {
  const cached = resourceCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value);

  const pending = pendingRequests.get(key);
  if (pending) return pending;

  const requestPromise = request()
    .then((response) => {
      resourceCache.set(key, { value: response, expiresAt: Date.now() + RESOURCE_CACHE_MS });
      return response;
    })
    .finally(() => pendingRequests.delete(key));
  pendingRequests.set(key, requestPromise);
  return requestPromise;
};

const API_URL = import.meta.env.VITE_API_URL || '';

// The admin panel stores uploaded media as relative paths (/api/media/<id>, /uploads/...).
// On the public site (a different origin than the API) they must point to the API host,
// otherwise the browser requests them from the frontend domain and gets index.html.
export const absolutizeMedia = (value) => {
  if (!API_URL) return value;
  if (typeof value === 'string') {
    return /^\/(api\/media|uploads)\//.test(value) ? `${API_URL}${value}` : value;
  }
  if (Array.isArray(value)) return value.map(absolutizeMedia);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, absolutizeMedia(item)]));
  }
  return value;
};

export const invalidateSiteContentCache = () => {
  resourceCache.clear();
  englishContentRequest = null;
};

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
  const [overrides, setOverrides] = useState({});
  const [sharedMediaContent, setSharedMediaContent] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setOverrides({});
        setSharedMediaContent({});
        setSettings({});

        // Пробуем публичный эндпоинт конструктора сайта
        const [res, translationsRes, englishRes] = await Promise.all([
          getCachedResource(`site-content:${lang}`, () => api.get('/site/content', { params: { lang } })),
          getCachedResource('site-translations', () => api.get('/translations')).catch(() => null),
          lang === 'en'
            ? Promise.resolve(null)
            : getCachedResource('site-content:en', getEnglishContent).catch(() => null),
        ]);
        const translations = translationsRes?.data?.data?.[lang];
        if (translations && typeof translations === 'object') {
          i18n.addResourceBundle(lang, 'translation', translations, true, true);
        }
        const data = absolutizeMedia(res.data?.data || res.data?.content || res.data);
        const englishData = lang === 'en'
          ? data
          : absolutizeMedia(englishRes?.data?.data || englishRes?.data?.content || englishRes?.data);

        if (!cancelled && data && typeof data === 'object') {
          const home = data?.home || data;
          const englishHome = englishData?.home || englishData;
          const nextSettings = data?.settings && typeof data.settings === 'object' ? data.settings : {};
          const merged = mergeDeep(SITE_FALLBACK, data?.home ? data : { home: data });
          setOverrides(home && typeof home === 'object' ? home : {});
          setSharedMediaContent(englishHome && typeof englishHome === 'object' ? englishHome : {});
          setSettings(nextSettings);
          setContent(merged.home ? merged.home : merged);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setOverrides({});
          setSharedMediaContent({});
          setSettings({});
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

  return { content, overrides, sharedMediaContent, settings, loading, error };
};

export default useSiteContent;
