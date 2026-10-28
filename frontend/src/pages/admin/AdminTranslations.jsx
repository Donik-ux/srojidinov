import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Globe, Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const LANGS = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const flatten = (obj, prefix = '') => {
  const res = [];
  Object.keys(obj || {}).forEach((k) => {
    const val = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      res.push(...flatten(val, key));
    } else {
      res.push({ key, value: val });
    }
  });
  return res;
};

const unflatten = (items) => {
  const out = {};
  (items || []).forEach(({ key, value }) => {
    const parts = key.split('.');
    let cur = out;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  });
  return out;
};

const AdminTranslations = () => {
  const [active, setActive] = useState('uz');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translations, setTranslations] = useState({ uz: [], ru: [], en: [] });
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/translations').catch(() => null);
      if (res?.data?.data) {
        const data = res.data.data;
        setTranslations({
          uz: flatten(data.uz || {}),
          ru: flatten(data.ru || {}),
          en: flatten(data.en || {}),
        });
        return;
      }
    } catch {}
    // fallback - load from local files
    try {
      const uz = await import('../../i18n/uz.json');
      const ru = await import('../../i18n/ru.json');
      const en = await import('../../i18n/en.json');
      setTranslations({
        uz: flatten(uz.default || uz),
        ru: flatten(ru.default || ru),
        en: flatten(en.default || en),
      });
    } catch {
      setTranslations({ uz: [], ru: [], en: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (lang, idx, value) => {
    setTranslations((prev) => {
      const next = { ...prev };
      next[lang] = [...next[lang]];
      next[lang][idx] = { ...next[lang][idx], value };
      return next;
    });
  };

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        uz: unflatten(translations.uz),
        ru: unflatten(translations.ru),
        en: unflatten(translations.en),
      };
      await api.put('/admin/translations', payload).catch(async () => {
        await api.post('/admin/translations', payload);
      });
      toast.success('Переводы сохранены');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const list = translations[active] || [];
  const filtered = search ? list.filter((item) => item.key.toLowerCase().includes(search.toLowerCase()) || String(item.value).toLowerCase().includes(search.toLowerCase())) : list;

  return (
    <>
      <Helmet>
        <title>Переводы | Админка</title>
      </Helmet>
      <div className="admin-theme p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#272829] text-white flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Переводы сайта</h1>
              <p className="text-sm text-[#61677A]">Редактирование текстов на узбекском, русском, английском</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по ключу или тексту..." className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-64" />
            <Button variant="outline" onClick={load}><RefreshCw size={16} /> Обновить</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Spinner size="sm" /> : <Save size={16} />} {saving ? 'Сохранение...' : 'Сохранить'}</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => setActive(l.code)} className={`px-4 py-2 rounded-lg text-sm font-medium ${active === l.code ? 'bg-[#272829] text-white' : 'bg-white border border-gray-200'}`}>
              {l.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-600">Ключ</th>
                    <th className="text-left p-3 font-semibold text-gray-600">Текст ({LANGS.find(l=>l.code===active)?.label})</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => {
                    const realIdx = list.findIndex((x) => x.key === item.key);
                    return (
                      <tr key={item.key} className="border-t border-gray-100">
                        <td className="p-3 text-gray-500 font-mono text-xs">{item.key}</td>
                        <td className="p-3">
                          <textarea
                            value={item.value || ''}
                            onChange={(e) => update(active, realIdx, e.target.value)}
                            rows={Math.max(1, String(item.value).split('\n').length)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTranslations;
