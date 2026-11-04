import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Save, RefreshCw, LayoutTemplate, Image as ImageIcon, Video, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import MediaPicker from '../../components/admin/MediaPicker';
import ru from '../../i18n/ru.json';
import uz from '../../i18n/uz.json';
import en from '../../i18n/en.json';
import { invalidateSiteContentCache } from '../../hooks/useSiteContent';

const LANGS = [
  { id: 'uz', label: "O‘zbekcha" },
  { id: 'ru', label: 'Русский' },
  { id: 'en', label: 'English' },
];

const TABS = [
  { id: 'brand', label: 'Бренд и контакты' },
  { id: 'hero', label: 'Главный экран' },
  { id: 'texts', label: 'Заголовки и тексты' },
  { id: 'stats', label: 'Статистика' },
  { id: 'directions', label: 'Направления' },
  { id: 'teachers', label: 'Преподаватели' },
  { id: 'admission', label: 'Поступление' },
  { id: 'content', label: 'Новости и достижения' },
  { id: 'media', label: 'Медиа и галерея' },
];

const LOCALES = { uz: uz.lyceum, ru: ru.lyceum, en: en.lyceum };
const API_URL = import.meta.env.VITE_API_URL || '';
const mediaSrc = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};

const clone = (value) => JSON.parse(JSON.stringify(value ?? null));

const mergeDeep = (target, source) => {
  const out = clone(target) || {};
  if (!source || typeof source !== 'object') return out;
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = mergeDeep(out[key] || {}, value);
    } else if (value !== undefined) {
      out[key] = value;
    }
  });
  return out;
};

const setAt = (object, path, value) => {
  const next = clone(object) || {};
  const parts = path.split('.');
  let current = next;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value;
      return;
    }
    if (!current[part] || typeof current[part] !== 'object') current[part] = {};
    current = current[part];
  });
  return next;
};

const getAt = (object, path) => path.split('.').reduce((value, part) => value?.[part], object);

const buildHomeDefaults = (lang) => {
  const l = LOCALES[lang] || LOCALES.uz;
  return {
    hero: clone(l.hero || {}),
    stats: clone(l.stats || []),
    facts: clone(l.facts || []),
    advantages: clone(l.advantages?.items || []),
    directions: clone(l.directions?.items || []),
    teachers: clone(l.teachers?.list || []),
    admissionSteps: clone(l.admissions?.items || []),
    documents: clone(l.admissions?.documents || []),
    faqs: clone(l.questions?.items || []),
    achievements: clone(l.achievements?.list || []),
    newsItems: clone(l.news?.items || []),
    milestones: clone(l.about?.milestones || []),
    videos: [],
    gallery: [],
    about: {
      eyebrow: l.about?.eyebrow,
      title: l.about?.title,
      p1: l.about?.p1,
      p2: l.about?.p2,
      linkText: l.about?.linkText,
      imageAlt: l.about?.imageAlt,
      todayTitle: l.about?.todayTitle,
      todayText: l.about?.todayText,
    },
    sections: {
      meta: {
        title: l.meta?.title,
        description: l.meta?.description,
        ogTitle: l.meta?.ogTitle,
        ogDescription: l.meta?.ogDescription,
      },
      advantages: { eyebrow: l.advantages?.eyebrow, title: l.advantages?.title, text: l.advantages?.text },
      news: { eyebrow: l.news?.eyebrow, title: l.news?.title, linkText: l.news?.linkText },
      directions: {
        eyebrow: l.directions?.eyebrow,
        title: l.directions?.title,
        text: l.directions?.text,
        fitLabel: l.directions?.fitLabel,
        note: l.directions?.note,
      },
      teachers: {
        eyebrow: l.teachers?.eyebrow,
        title: l.teachers?.title,
        text: l.teachers?.text,
        stat1Value: l.teachers?.stat1Value,
        stat1Label: l.teachers?.stat1Label,
        stat2Value: l.teachers?.stat2Value,
        stat2Label: l.teachers?.stat2Label,
        label: l.teachers?.label,
      },
      achievements: {
        eyebrow: l.achievements?.eyebrow,
        title: l.achievements?.title,
        text: l.achievements?.text,
        closeLabel: l.achievements?.closeLabel,
        moreTitle: l.achievements?.moreTitle,
        moreText: l.achievements?.moreText,
      },
      admissions: {
        eyebrow: l.admissions?.eyebrow,
        title: l.admissions?.title,
        text: l.admissions?.text,
        documentsTitle: l.admissions?.documentsTitle,
        note: l.admissions?.note,
      },
      history: {
        eyebrow: l.history?.eyebrow,
        title: l.history?.title,
        text: l.history?.text,
        linkText: l.history?.linkText,
      },
      heritage: {
        eyebrow: l.heritage?.eyebrow,
        title: l.heritage?.title,
        text: l.heritage?.text,
        linkText: l.heritage?.linkText,
      },
      environment: {
        eyebrow: l.environment?.eyebrow,
        title: l.environment?.title,
        text: l.environment?.text,
        caption: l.environment?.caption,
        imageAlt: l.environment?.imageAlt,
      },
      questions: {
        eyebrow: l.questions?.eyebrow,
        title: l.questions?.title,
        text: l.questions?.text,
        addressLink: l.questions?.addressLink,
      },
      contact: {
        eyebrow: l.contact?.eyebrow,
        title: l.contact?.title,
        directionsLink: l.contact?.directionsLink,
        addressTitle: l.contact?.addressTitle,
        defaultAddress: l.contact?.defaultAddress || l.footer?.address,
        phoneTitle: l.contact?.phoneTitle,
        phoneNote: l.contact?.phoneNote,
        hoursTitle: l.contact?.hoursTitle,
        hours: l.contact?.hours,
        hoursNote: l.contact?.hoursNote,
        routeTitle: l.contact?.routeTitle,
        routeText: l.contact?.routeText,
        socialTitle: l.contact?.socialTitle,
        instagramText: l.contact?.instagramText,
        mapTitle: l.contact?.mapTitle,
        openMap: l.contact?.openMap,
      },
      cta: {
        eyebrow: l.cta?.eyebrow,
        title: l.cta?.title,
        text: l.cta?.text,
        instagram: l.cta?.instagram,
      },
    },
  };
};

const buildSettingsDefaults = (lang) => {
  const l = LOCALES[lang] || LOCALES.uz;
  return {
    brand: l.nav?.brand,
    university: l.nav?.university,
    motto: l.nav?.motto,
    logo: '',
    phone: '+998 71 278 43 58',
    phoneHref: 'tel:+998712784358',
    address: l.footer?.address,
    footerDescription: l.footer?.description,
    instagram: 'https://www.instagram.com/sirojiddin_academic_lyceum/',
    lat: '41.289371',
    lng: '69.1964656',
    nuu: 'https://nuu.uz',
    workingHours: '',
  };
};

const Field = ({ label, value, onChange, placeholder, mono = false }) => (
  <label className="block">
    <span className="block text-sm font-semibold mb-1.5 text-[#272829]">{label}</span>
    <input
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm ${mono ? 'font-mono' : ''}`}
    />
  </label>
);

const Area = ({ label, value, onChange, rows = 3 }) => (
  <label className="block">
    <span className="block text-sm font-semibold mb-1.5 text-[#272829]">{label}</span>
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y"
    />
  </label>
);

const Card = ({ title, description, children }) => (
  <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
    <div>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
    {children}
  </section>
);

const Repeater = ({ items = [], onChange, addLabel, renderItem, emptyItem = {} }) => (
  <div className="space-y-3">
    {(items || []).map((item, index) => (
      <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-[#fcfcfd]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">#{index + 1}</span>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
        {renderItem(item, index, (patch) => onChange(items.map((row, i) => (i === index ? { ...row, ...patch } : row))))}
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" onClick={() => onChange([...(items || []), clone(emptyItem)])}>
      <Plus size={16} /> {addLabel}
    </Button>
  </div>
);

const MediaButton = ({ onPick, label = 'Загрузить' }) => (
  <button
    type="button"
    onClick={onPick}
    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
  >
    <ImageIcon size={15} /> {label}
  </button>
);

const AdminSiteBuilder = () => {
  const [lang, setLang] = useState('uz');
  const [tab, setTab] = useState('brand');
  const [drafts, setDrafts] = useState(() => Object.fromEntries(
    LANGS.map(({ id }) => [id, {
      home: buildHomeDefaults(id),
      settings: buildSettingsDefaults(id),
    }]),
  ));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState({ open: false, path: '', accept: 'image/*' });

  const home = drafts[lang]?.home || buildHomeDefaults(lang);
  const settings = drafts[lang]?.settings || buildSettingsDefaults(lang);
  const homeDefaults = useMemo(() => buildHomeDefaults(lang), [lang]);
  const settingsDefaults = useMemo(() => buildSettingsDefaults(lang), [lang]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/site/content/all');
      const saved = res.data?.data || {};
      const loaded = Object.fromEntries(LANGS.map(({ id }) => {
        const languageContent = saved[id] || {};
        return [id, {
          home: mergeDeep(buildHomeDefaults(id), languageContent.home || {}),
          settings: mergeDeep(buildSettingsDefaults(id), languageContent.settings || {}),
        }];
      }));
      const sharedLogo = LANGS
        .map(({ id }) => loaded[id].settings.logo)
        .find(Boolean) || '';
      LANGS.forEach(({ id }) => {
        loaded[id].settings.logo = sharedLogo;
      });
      setDrafts(loaded);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Не удалось загрузить контент');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setHomeField = (path, value) => setDrafts((current) => ({
    ...current,
    [lang]: {
      ...current[lang],
      home: setAt(current[lang]?.home || homeDefaults, path, value),
    },
  }));
  const setSetting = (key, value) => setDrafts((current) => ({
    ...current,
    ...(
      key === 'logo'
        ? Object.fromEntries(LANGS.map(({ id }) => [id, {
          ...current[id],
          settings: { ...current[id]?.settings, [key]: value },
        }]))
        : {
          [lang]: {
            ...current[lang],
            settings: { ...current[lang]?.settings, [key]: value },
          },
        }
    ),
  }));

  const openPicker = (path, accept = 'image/*') => setPicker({ open: true, path, accept });
  const handlePick = (url) => {
    if (picker.path.startsWith('settings.')) setSetting(picker.path.replace('settings.', ''), url);
    else setHomeField(picker.path, url);
  };

  const save = async () => {
    try {
      setSaving(true);
      const languages = Object.fromEntries(LANGS.map(({ id }) => {
        const languageDraft = drafts[id] || {
          home: buildHomeDefaults(id),
          settings: buildSettingsDefaults(id),
        };
        const languageSettings = { ...languageDraft.settings, logo: settings.logo };
        const syncedHome = {
          ...languageDraft.home,
          site: languageSettings,
          contacts: {
            ...(languageDraft.home.contacts || {}),
            address: languageSettings.address,
            phone: languageSettings.phone,
            phoneHref: languageSettings.phoneHref,
            lat: languageSettings.lat,
            lng: languageSettings.lng,
            instagram: languageSettings.instagram,
            nuu: languageSettings.nuu,
          },
        };
        return [id, { home: syncedHome, settings: languageSettings }];
      }));
      await api.put('/admin/site/content/all', { languages });
      invalidateSiteContentCache();
      setDrafts(Object.fromEntries(LANGS.map(({ id }) => [id, {
        ...drafts[id],
        home: languages[id].home,
        settings: languages[id].settings,
      }])));
      toast.success('Все языки сохранены');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Не удалось сохранить контент');
    } finally {
      setSaving(false);
    }
  };

  const renderTextBox = (path, label, rows) => {
    const value = getAt(home, path);
    return rows ? (
      <Area key={path} label={label} value={value} onChange={(v) => setHomeField(path, v)} rows={rows} />
    ) : (
      <Field key={path} label={label} value={value} onChange={(v) => setHomeField(path, v)} />
    );
  };

  const textSections = [
    {
      key: 'about',
      title: 'О лицее',
      fields: [
        ['about.eyebrow', 'Надзаголовок'],
        ['about.title', 'Заголовок', 2],
        ['about.p1', 'Абзац 1', 4],
        ['about.p2', 'Абзац 2', 4],
        ['about.todayTitle', 'Заголовок блока «Сегодня»'],
        ['about.todayText', 'Текст блока «Сегодня»', 4],
        ['about.linkText', 'Текст ссылки'],
        ['about.imageAlt', 'Описание фото'],
      ],
    },
    {
      key: 'advantages',
      title: 'Преимущества — заголовки',
      fields: [
        ['sections.advantages.eyebrow', 'Надзаголовок'],
        ['sections.advantages.title', 'Заголовок', 2],
        ['sections.advantages.text', 'Описание', 3],
      ],
    },
    {
      key: 'news',
      title: 'Новости — заголовки',
      fields: [
        ['sections.news.eyebrow', 'Надзаголовок'],
        ['sections.news.title', 'Заголовок', 2],
        ['sections.news.linkText', 'Текст ссылки'],
      ],
    },
    {
      key: 'directions',
      title: 'Направления — заголовки',
      fields: [
        ['sections.directions.eyebrow', 'Надзаголовок'],
        ['sections.directions.title', 'Заголовок', 2],
        ['sections.directions.text', 'Описание', 3],
        ['sections.directions.fitLabel', 'Подпись «кому подходит»'],
        ['sections.directions.note', 'Примечание', 3],
      ],
    },
    {
      key: 'teachers',
      title: 'Преподаватели — заголовки',
      fields: [
        ['sections.teachers.eyebrow', 'Надзаголовок'],
        ['sections.teachers.title', 'Заголовок', 2],
        ['sections.teachers.text', 'Описание', 3],
        ['sections.teachers.stat1Value', 'Показатель 1'],
        ['sections.teachers.stat1Label', 'Подпись 1'],
        ['sections.teachers.stat2Value', 'Показатель 2'],
        ['sections.teachers.stat2Label', 'Подпись 2'],
        ['sections.teachers.label', 'Подпись карточки'],
      ],
    },
    {
      key: 'achievements',
      title: 'Достижения — заголовки',
      fields: [
        ['sections.achievements.eyebrow', 'Надзаголовок'],
        ['sections.achievements.title', 'Заголовок', 2],
        ['sections.achievements.text', 'Описание', 3],
        ['sections.achievements.closeLabel', 'Кнопка закрытия'],
        ['sections.achievements.moreTitle', 'Заголовок «ещё»', 2],
        ['sections.achievements.moreText', 'Текст «ещё»', 3],
      ],
    },
    {
      key: 'admissions',
      title: 'Поступление — заголовки',
      fields: [
        ['sections.admissions.eyebrow', 'Надзаголовок'],
        ['sections.admissions.title', 'Заголовок', 2],
        ['sections.admissions.text', 'Описание', 3],
        ['sections.admissions.documentsTitle', 'Заголовок документов'],
        ['sections.admissions.note', 'Примечание', 3],
      ],
    },
    {
      key: 'history',
      title: 'История',
      fields: [
        ['sections.history.eyebrow', 'Надзаголовок'],
        ['sections.history.title', 'Заголовок', 2],
        ['sections.history.text', 'Текст', 4],
        ['sections.history.linkText', 'Текст ссылки'],
      ],
    },
    {
      key: 'heritage',
      title: 'Наследие',
      fields: [
        ['sections.heritage.eyebrow', 'Надзаголовок'],
        ['sections.heritage.title', 'Заголовок', 2],
        ['sections.heritage.text', 'Текст', 4],
        ['sections.heritage.linkText', 'Текст ссылки'],
      ],
    },
    {
      key: 'environment',
      title: 'Среда обучения',
      fields: [
        ['sections.environment.eyebrow', 'Надзаголовок'],
        ['sections.environment.title', 'Заголовок', 2],
        ['sections.environment.text', 'Текст', 3],
        ['sections.environment.caption', 'Подпись к фото'],
        ['sections.environment.imageAlt', 'Описание фото'],
      ],
    },
    {
      key: 'questions',
      title: 'Вопросы и ответы — заголовки',
      fields: [
        ['sections.questions.eyebrow', 'Надзаголовок'],
        ['sections.questions.title', 'Заголовок', 2],
        ['sections.questions.text', 'Текст', 3],
        ['sections.questions.addressLink', 'Текст ссылки на адрес'],
      ],
    },
    {
      key: 'contact',
      title: 'Контакты — заголовки',
      fields: [
        ['sections.contact.eyebrow', 'Надзаголовок'],
        ['sections.contact.title', 'Заголовок', 2],
        ['sections.contact.directionsLink', 'Ссылка «маршрут»'],
        ['sections.contact.addressTitle', 'Заголовок адреса'],
        ['sections.contact.phoneTitle', 'Заголовок телефона'],
        ['sections.contact.phoneNote', 'Примечание телефона'],
        ['sections.contact.hoursTitle', 'Заголовок часов'],
        ['sections.contact.hours', 'Часы работы'],
        ['sections.contact.hoursNote', 'Примечание часов'],
        ['sections.contact.routeTitle', 'Заголовок маршрута'],
        ['sections.contact.routeText', 'Текст маршрута', 3],
        ['sections.contact.socialTitle', 'Заголовок соцсетей'],
        ['sections.contact.instagramText', 'Текст Instagram'],
        ['sections.contact.mapTitle', 'Заголовок карты'],
        ['sections.contact.openMap', 'Текст «открыть карту»'],
      ],
    },
    {
      key: 'cta',
      title: 'Нижний призыв',
      fields: [
        ['sections.cta.eyebrow', 'Надзаголовок'],
        ['sections.cta.title', 'Заголовок', 2],
        ['sections.cta.text', 'Текст', 3],
        ['sections.cta.instagram', 'Текст ссылки Instagram'],
      ],
    },
    {
      key: 'meta',
      title: 'SEO / мета',
      fields: [
        ['sections.meta.title', 'Title'],
        ['sections.meta.description', 'Description', 3],
        ['sections.meta.ogTitle', 'OG title'],
        ['sections.meta.ogDescription', 'OG description', 3],
      ],
    },
  ];

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
              <p className="text-sm text-[#61677A]">Редактируйте каждый язык отдельно и сохраняйте весь сайт одной кнопкой</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              {LANGS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLang(item.id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold ${lang === item.id ? 'bg-[#272829] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={load}><RefreshCw size={16} /> Обновить</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Spinner size="sm" /> : <Save size={16} />} {saving ? 'Сохранение всех языков...' : 'Сохранить все языки'}</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === item.id ? 'bg-[#272829] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {tab === 'brand' && (
            <>
              <Card title="Логотип и название" description="Эти данные показываются в шапке и подвале сайта.">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-24 h-24 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {settings.logo ? <img src={mediaSrc(settings.logo)} alt="logo" className="w-full h-full object-contain" /> : <ImageIcon className="text-gray-300" size={30} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <MediaButton onPick={() => openPicker('settings.logo')} label="Выбрать логотип" />
                    {settings.logo && (
                      <button type="button" onClick={() => setSetting('logo', '')} className="text-sm text-red-500 hover:underline">
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Название лицея" value={settings.brand} onChange={(v) => setSetting('brand', v)} />
                  <Field label="Организация / вуз" value={settings.university} onChange={(v) => setSetting('university', v)} />
                  <Field label="Девиз" value={settings.motto} onChange={(v) => setSetting('motto', v)} />
                  <Field label="Телефон" value={settings.phone} onChange={(v) => setSetting('phone', v)} />
                  <Field label="Ссылка телефона" value={settings.phoneHref} onChange={(v) => setSetting('phoneHref', v)} mono />
                  <Field label="Instagram" value={settings.instagram} onChange={(v) => setSetting('instagram', v)} mono />
                  <Field label="Ссылка НУУз" value={settings.nuu} onChange={(v) => setSetting('nuu', v)} mono />
                  <Field label="Часы работы" value={settings.workingHours} onChange={(v) => setSetting('workingHours', v)} />
                </div>
                <Area label="Адрес" value={settings.address} onChange={(v) => setSetting('address', v)} rows={2} />
                <Area label="Описание в подвале" value={settings.footerDescription} onChange={(v) => setSetting('footerDescription', v)} rows={3} />
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Широта (карта)" value={settings.lat} onChange={(v) => setSetting('lat', v)} mono />
                  <Field label="Долгота (карта)" value={settings.lng} onChange={(v) => setSetting('lng', v)} mono />
                </div>
              </Card>
            </>
          )}

          {tab === 'hero' && (
            <>
              <Card title="Главный экран">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Надзаголовок" value={home.hero?.eyebrow} onChange={(v) => setHomeField('hero.eyebrow', v)} />
                  <Field label="Подпись видео" value={home.hero?.overlayLabel} onChange={(v) => setHomeField('hero.overlayLabel', v)} />
                </div>
                <Area label="Заголовок" value={home.hero?.title} onChange={(v) => setHomeField('hero.title', v)} rows={2} />
                <Area label="Подзаголовок" value={home.hero?.subtitle} onChange={(v) => setHomeField('hero.subtitle', v)} rows={3} />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Field label="Видео (URL или файл)" value={home.hero?.video} onChange={(v) => setHomeField('hero.video', v)} mono />
                    <MediaButton onPick={() => openPicker('hero.video', 'video/*')} label="Загрузить видео" />
                  </div>
                  <div className="space-y-2">
                    <Field label="Постер (фото)" value={home.hero?.poster} onChange={(v) => setHomeField('hero.poster', v)} mono />
                    <MediaButton onPick={() => openPicker('hero.poster')} label="Загрузить постер" />
                  </div>
                </div>
              </Card>

              <Card title="Плашки под заголовком">
                <Repeater
                  items={home.hero?.badges || []}
                  onChange={(items) => setHomeField('hero.badges', items)}
                  addLabel="Добавить плашку"
                  emptyItem={{ icon: 'CalendarDays', text: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="grid md:grid-cols-[1fr_2fr] gap-3">
                      <Field label="Иконка" value={item.icon} onChange={(v) => patch({ icon: v })} placeholder="CalendarDays" />
                      <Field label="Текст" value={item.text} onChange={(v) => patch({ text: v })} />
                    </div>
                  )}
                />
              </Card>

              <Card title="Кнопки">
                <Repeater
                  items={home.hero?.buttons || []}
                  onChange={(items) => setHomeField('hero.buttons', items)}
                  addLabel="Добавить кнопку"
                  emptyItem={{ text: '', href: '#contact', variant: 'secondary' }}
                  renderItem={(item, index, patch) => (
                    <div className="grid md:grid-cols-[1fr_1fr_160px] gap-3">
                      <Field label="Текст" value={item.text} onChange={(v) => patch({ text: v })} />
                      <Field label="Ссылка" value={item.href} onChange={(v) => patch({ href: v })} mono />
                      <label className="block">
                        <span className="block text-sm font-semibold mb-1.5">Стиль</span>
                        <select value={item.variant || 'secondary'} onChange={(e) => patch({ variant: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                          <option value="primary">Основная</option>
                          <option value="secondary">Вторичная</option>
                          <option value="ghost">Прозрачная</option>
                        </select>
                      </label>
                    </div>
                  )}
                />
              </Card>
            </>
          )}

          {tab === 'texts' && textSections.map((section) => (
            <Card key={section.key} title={section.title}>
              <div className="grid md:grid-cols-2 gap-4">
                {section.fields.map(([path, label, rows]) => renderTextBox(path, label, rows))}
              </div>
            </Card>
          ))}

          {tab === 'stats' && (
            <>
              <Card title="Цифры под главным экраном">
                <Repeater
                  items={home.stats || []}
                  onChange={(items) => setHomeField('stats', items)}
                  addLabel="Добавить показатель"
                  emptyItem={{ value: '', label: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="grid md:grid-cols-2 gap-3">
                      <Field label="Значение" value={item.value} onChange={(v) => patch({ value: v })} />
                      <Field label="Подпись" value={item.label} onChange={(v) => patch({ label: v })} />
                    </div>
                  )}
                />
              </Card>
              <Card title="Факты о лицее">
                <Repeater
                  items={home.facts || []}
                  onChange={(items) => setHomeField('facts', items)}
                  addLabel="Добавить факт"
                  emptyItem={{ value: '', label: '', icon: 'CalendarDays' }}
                  renderItem={(item, index, patch) => (
                    <div className="grid md:grid-cols-3 gap-3">
                      <Field label="Значение" value={item.value} onChange={(v) => patch({ value: v })} />
                      <Field label="Подпись" value={item.label} onChange={(v) => patch({ label: v })} />
                      <Field label="Иконка" value={item.icon} onChange={(v) => patch({ icon: v })} placeholder="CalendarDays" />
                    </div>
                  )}
                />
              </Card>
              <Card title="Вехи истории">
                <Repeater
                  items={home.milestones || []}
                  onChange={(items) => { setHomeField('milestones', items); setHomeField('about.milestones', items); }}
                  addLabel="Добавить веху"
                  emptyItem={{ year: '', text: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="grid md:grid-cols-[120px_1fr] gap-3">
                      <Field label="Год" value={item.year} onChange={(v) => patch({ year: v })} />
                      <Field label="Текст" value={item.text} onChange={(v) => patch({ text: v })} />
                    </div>
                  )}
                />
              </Card>
            </>
          )}

          {tab === 'directions' && (
            <Card title="Направления обучения">
              <Repeater
                items={home.directions || []}
                onChange={(items) => setHomeField('directions', items)}
                addLabel="Добавить направление"
                emptyItem={{ title: '', icon: 'Atom', subjects: [], text: '', fit: '' }}
                renderItem={(item, index, patch) => (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-[1fr_160px] gap-3">
                      <Field label="Название" value={item.title} onChange={(v) => patch({ title: v })} />
                      <Field label="Иконка" value={item.icon} onChange={(v) => patch({ icon: v })} placeholder="Atom" />
                    </div>
                    <Field label="Предметы (через запятую)" value={(item.subjects || []).join(', ')} onChange={(v) => patch({ subjects: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
                    <Area label="Описание" value={item.text} onChange={(v) => patch({ text: v })} rows={2} />
                    <Area label="Кому подходит" value={item.fit} onChange={(v) => patch({ fit: v })} rows={2} />
                  </div>
                )}
              />
            </Card>
          )}

          {tab === 'teachers' && (
            <Card title="Преподаватели">
              <Repeater
                items={home.teachers || []}
                onChange={(items) => setHomeField('teachers', items)}
                addLabel="Добавить преподавателя"
                emptyItem={{ image: '', subject: '', role: '' }}
                renderItem={(item, index, patch) => (
                  <div className="grid md:grid-cols-[110px_1fr_1fr] gap-3 items-start">
                    <div className="space-y-2">
                      <div className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                        {item.image ? <img src={mediaSrc(item.image)} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
                      </div>
                      <MediaButton onPick={() => openPicker(`teachers.${index}.image`)} label="Фото" />
                    </div>
                    <Field label="ФИО / предмет" value={item.subject} onChange={(v) => patch({ subject: v })} />
                    <Field label="Роль" value={item.role} onChange={(v) => patch({ role: v })} />
                  </div>
                )}
              />
            </Card>
          )}

          {tab === 'admission' && (
            <>
              <Card title="Шаги поступления">
                <Repeater
                  items={home.admissionSteps || []}
                  onChange={(items) => setHomeField('admissionSteps', items)}
                  addLabel="Добавить шаг"
                  emptyItem={{ icon: 'Phone', title: '', text: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-[1fr_160px] gap-3">
                        <Field label="Заголовок" value={item.title} onChange={(v) => patch({ title: v })} />
                        <Field label="Иконка" value={item.icon} onChange={(v) => patch({ icon: v })} placeholder="Phone" />
                      </div>
                      <Area label="Текст" value={item.text} onChange={(v) => patch({ text: v })} rows={3} />
                    </div>
                  )}
                />
              </Card>
              <Card title="Документы">
                <Repeater
                  items={(home.documents || []).map((text) => ({ text }))}
                  onChange={(items) => setHomeField('documents', items.map((item) => item.text || ''))}
                  addLabel="Добавить документ"
                  emptyItem={{ text: '' }}
                  renderItem={(item, index, patch) => (
                    <Field label="Документ" value={item.text} onChange={(v) => patch({ text: v })} />
                  )}
                />
              </Card>
            </>
          )}

          {tab === 'content' && (
            <>
              <Card title="Новости">
                <Repeater
                  items={home.newsItems || []}
                  onChange={(items) => setHomeField('newsItems', items)}
                  addLabel="Добавить новость"
                  emptyItem={{ icon: 'CalendarDays', badge: '', title: '', text: '', linkText: 'Подробнее', href: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-[1fr_1fr_160px] gap-3">
                        <Field label="Заголовок" value={item.title} onChange={(v) => patch({ title: v })} />
                        <Field label="Дата / бейдж" value={item.badge} onChange={(v) => patch({ badge: v })} />
                        <Field label="Иконка" value={item.icon} onChange={(v) => patch({ icon: v })} />
                      </div>
                      <Area label="Текст" value={item.text} onChange={(v) => patch({ text: v })} rows={2} />
                      <div className="grid md:grid-cols-2 gap-3">
                        <Field label="Текст ссылки" value={item.linkText} onChange={(v) => patch({ linkText: v })} />
                        <Field label="Ссылка" value={item.href} onChange={(v) => patch({ href: v })} mono />
                      </div>
                    </div>
                  )}
                />
              </Card>
              <Card title="Достижения учеников">
                <Repeater
                  items={home.achievements || []}
                  onChange={(items) => setHomeField('achievements', items)}
                  addLabel="Добавить достижение"
                  emptyItem={{ name: '', group: '', teacher: '', summary: '', image: '', alt: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-3 gap-3">
                        <Field label="Ученик" value={item.name} onChange={(v) => patch({ name: v })} />
                        <Field label="Группа" value={item.group} onChange={(v) => patch({ group: v })} />
                        <Field label="Учитель" value={item.teacher} onChange={(v) => patch({ teacher: v })} />
                      </div>
                      <Area label="Описание" value={item.summary} onChange={(v) => patch({ summary: v })} rows={2} />
                      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
                        <Field label="Фото сертификата" value={item.image} onChange={(v) => patch({ image: v })} mono />
                        <MediaButton onPick={() => openPicker(`achievements.${index}.image`)} label="Фото" />
                      </div>
                      <Field label="Описание фото" value={item.alt} onChange={(v) => patch({ alt: v })} />
                    </div>
                  )}
                />
              </Card>
            </>
          )}

          {tab === 'media' && (
            <>
              <Card title="Фото разделов">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Фото блока «О лицее»</p>
                    <Field label="URL" value={home.about?.image} onChange={(v) => setHomeField('about.image', v)} mono />
                    <MediaButton onPick={() => openPicker('about.image')} label="Загрузить фото" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Фото блока «Среда обучения»</p>
                    <Field label="URL" value={home.sections?.environment?.image} onChange={(v) => setHomeField('sections.environment.image', v)} mono />
                    <MediaButton onPick={() => openPicker('sections.environment.image')} label="Загрузить фото" />
                  </div>
                </div>
              </Card>
              <Card title="Видео">
                <Repeater
                  items={home.videos || []}
                  onChange={(items) => setHomeField('videos', items)}
                  addLabel="Добавить видео"
                  emptyItem={{ title: '', url: '', photo: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="space-y-3">
                      <Field label="Название" value={item.title} onChange={(v) => patch({ title: v })} />
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Field label="Видео (URL или файл)" value={item.url} onChange={(v) => patch({ url: v })} mono />
                          <MediaButton onPick={() => openPicker(`videos.${index}.url`, 'video/*')} label="Загрузить видео" />
                        </div>
                        <div className="space-y-2">
                          <Field label="Превью" value={item.photo} onChange={(v) => patch({ photo: v })} mono />
                          <MediaButton onPick={() => openPicker(`videos.${index}.photo`)} label="Загрузить фото" />
                        </div>
                      </div>
                    </div>
                  )}
                />
              </Card>
              <Card title="Галерея">
                <Repeater
                  items={home.gallery || []}
                  onChange={(items) => setHomeField('gallery', items)}
                  addLabel="Добавить фото"
                  emptyItem={{ title: '', image: '', category: '' }}
                  renderItem={(item, index, patch) => (
                    <div className="grid md:grid-cols-[1fr_1fr_160px] gap-3 items-end">
                      <Field label="Название" value={item.title} onChange={(v) => patch({ title: v })} />
                      <div className="space-y-2">
                        <Field label="Фото" value={item.image} onChange={(v) => patch({ image: v })} mono />
                        <MediaButton onPick={() => openPicker(`gallery.${index}.image`)} label="Загрузить" />
                      </div>
                      <Field label="Категория" value={item.category} onChange={(v) => patch({ category: v })} />
                    </div>
                  )}
                />
              </Card>
            </>
          )}
        </div>

        <div className="sticky bottom-4 mt-6 flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? <Spinner size="sm" /> : <Save size={16} />} {saving ? 'Сохранение всех языков...' : 'Сохранить все языки'}</Button>
        </div>
      </div>

      <MediaPicker
        isOpen={picker.open}
        onClose={() => setPicker({ open: false, path: '', accept: 'image/*' })}
        accept={picker.accept}
        onSelect={handlePick}
      />
    </>
  );
};

export default AdminSiteBuilder;
