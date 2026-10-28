import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, RefreshCw, LayoutTemplate } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { SITE_FALLBACK } from '../../utils/siteFallback';
import HeroEditor from './builder/sections/HeroEditor';
import StatsEditor from './builder/sections/StatsEditor';
import DirectionsEditor from './builder/sections/DirectionsEditor';
import TeachersEditor from './builder/sections/TeachersEditor';
import ContactsEditor from './builder/sections/ContactsEditor';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'stats', label: 'Статистика' },
  { id: 'directions', label: 'Направления' },
  { id: 'teachers', label: 'Преподаватели' },
  { id: 'contacts', label: 'Контакты' },
];

const mergeDeep = (target, source) => {
  const out = JSON.parse(JSON.stringify(target));
  if (!source || typeof source !== 'object') return out;
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = mergeDeep(out[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      out[key] = source[key];
    }
  });
  return out;
};

const AdminSiteBuilder = () => {
  const [tab, setTab] = useState('hero');
  const [data, setData] = useState(SITE_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState('uz');

  const load = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.get('/admin/site/content', { params: { lang } });
      } catch {
        try {
          res = await api.get('/site/content', { params: { lang } });
        } catch {
          res = null;
        }
      }
      if (res) {
        const d = res.data?.data || res.data?.content || res.data;
        if (d) {
          setData(mergeDeep(SITE_FALLBACK, d?.home ? d.home : d));
        }
      }
    } catch {
      // остаёмся на фоллбэке
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [lang]);

  const save = async () => {
    try {
      setSaving(true);
      const payload = { lang, home: data };
      try {
        await api.put('/admin/site/content', payload);
      } catch {
        try {
          await api.post('/admin/site/content', payload);
        } catch (e) {
          throw e;
        }
      }
      toast.success('Сохранено');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Не удалось сохранить. Проверь бэкенд-эндпоинт /admin/site/content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-theme p-6 md:p-8 flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Конструктор сайта | Админка</title>
      </Helmet>
      <div className="admin-theme p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#272829] text-white flex items-center justify-center">
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Конструктор сайта</h1>
              <p className="text-sm text-[#61677A]">Редактирование главной страницы без правок кода</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="uz">O‘zbek</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
            <Button variant="outline" onClick={load}><RefreshCw size={16} /> Обновить</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Spinner size="sm" /> : <Save size={16} />} {saving ? 'Сохранение...' : 'Сохранить'}</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.id ? 'bg-[#272829] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'hero' && <HeroEditor data={data} onChange={setData} />}
        {tab === 'stats' && <StatsEditor data={data} onChange={setData} />}
        {tab === 'directions' && <DirectionsEditor data={data} onChange={setData} />}
        {tab === 'teachers' && <TeachersEditor data={data} onChange={setData} />}
        {tab === 'contacts' && <ContactsEditor data={data} onChange={setData} />}
      </div>
    </>
  );
};

export default AdminSiteBuilder;
