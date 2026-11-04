import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Atom,
  Award,
  BookOpen,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  FlaskConical,
  GraduationCap,
  Landmark,
  MapPin,
  Microscope,
  Phone,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import useSiteContent from '../hooks/useSiteContent';
import { ICON_MAP } from '../utils/siteFallback';
import ru from '../i18n/ru.json';
import uz from '../i18n/uz.json';
import en from '../i18n/en.json';

const CAMPUS_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=88';
const HERO_VIDEO = '/assets/videos/hero.mp4';
const HERO_POSTER = '/assets/videos/hero-poster.jpg';
const STUDENT_IMAGE = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85';
const ABOUT_IMAGE = '/assets/images/students-group.jpg';

const DEFAULT_ADDRESS = '100097, Toshkent shahri, Chilonzor tumani, Chilonzor-9 mavzesi, 33-uy';
const DEFAULT_PHONE = '+998 71 278 43 58';
const DEFAULT_PHONE_HREF = 'tel:+998712784358';
const DEFAULT_LAT = '41.289371';
const DEFAULT_LNG = '69.1964656';
const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/sirojiddinov_academic_lyceum/';
const DEFAULT_NUU_URL = 'https://nuu.uz/s-h-sirojiddinov-nomidagi-akademik-litseyi/';

const milestones = [
  { year: '1970', text: 'Respublika maxsus maktab-internati sifatida tashkil etildi.' },
  { year: '1990', text: 'Muassasaga akademik S.H. Sirojiddinov nomi berildi.' },
  { year: '1998', text: 'Vazirlar Mahkamasi qarori bilan akademik litsey maqomi berildi.' },
  { year: 'Bugun', text: 'O‘zMU qoshidagi tabiiy va aniq fanlarga ixtisoslashgan litsey sifatida faoliyat yuritadi.' },
];

const facts = [
  { value: '1970', label: 'tashkil topgan yil', Icon: CalendarDays },
  { value: '1990', label: 'Sirojiddinov nomi berilgan', Icon: GraduationCap },
  { value: '1998', label: 'akademik litsey maqomi', Icon: BookOpen },
  { value: 'O‘zMU', label: 'qoshidagi litsey', Icon: Landmark },
];

const advantages = [
  {
    Icon: Landmark,
    title: 'O‘zMU bilan uzviy aloqa',
    text: 'Litsey O‘zbekiston Milliy universiteti qoshida faoliyat yuritadi. O‘quvchilar universitetning ilmiy va ta’lim muhitiga yaqindan tanishadi.',
  },
  {
    Icon: Atom,
    title: 'Chuqur fan tayyorgarligi',
    text: 'Matematika, fizika, kimyo va biologiya fanlari chuqurlashtirilgan holda o‘qitiladi, amaliy mashg‘ulotlarga alohida e’tibor beriladi.',
  },
  {
    Icon: Users,
    title: 'Tajribali pedagogalar',
    text: 'Malakali o‘qituvchilar har bir o‘quvchining qobiliyatiga mos yondashadi va mustaqil fikrlashni rag‘batlantiradi.',
  },
  {
    Icon: FlaskConical,
    title: 'Ilmiy va amaliy muhit',
    text: 'Laboratoriya mashg‘ulotlari, fan to‘garaklari va ilmiy loyihalar o‘quvchilarda izlanish ko‘nikmalarini shakllantiradi.',
  },
];

const stats = [
  { value: '1970', label: 'tashkil etilgan yil' },
  { value: '55+', label: 'yillik ta’lim an’anasi' },
  { value: '3', label: 'asosiy ta’lim yo‘nalishi' },
  { value: 'O‘zMU', label: 'qoshidagi akademik litsey' },
];

const directions = [
  {
    Icon: Atom,
    title: 'Aniq fanlar',
    subjects: ['Matematika', 'Fizika'],
    text: 'Mantiqiy tafakkur, hisob-kitob va fizik hodisalarni chuqur o‘rganishga yo‘naltirilgan guruhlar.',
    fit: 'Matematika va fizikaga qiziqqan, aniq hisob-kitob bilan ishlashni yoqtirgan o‘quvchilar uchun.',
  },
  {
    Icon: Microscope,
    title: 'Tabiiy fanlar',
    subjects: ['Kimyo', 'Biologiya'],
    text: 'Tirik organizmlar, moddalar tuzilishi va laboratoriya tadqiqotlariga asoslangan tayyorgarlik.',
    fit: 'Tabiat, tibbiyot va ekologiyaga qiziqqan o‘quvchilar uchun.',
  },
  {
    Icon: TrendingUp,
    title: 'Iqtisod',
    subjects: ['Matematika', 'Ingliz tili'],
    text: 'Iqtisodiy tafakkur, moliyaviy savodxonlik va xalqaro muloqot ko‘nikmalarini rivojlantirishga qaratilgan guruhlar.',
    fit: 'Iqtisodiyot, biznes va xalqaro aloqalarga qiziqqan o‘quvchilar uchun.',
  },
];

const teachers = [
  { subject: 'Деректор', image: '/assets/Ustozlar/IMG_20261026_175341_878.jpg' },
  { subject: 'Зам деректор ', image: '/assets/Ustozlar/зам.jpg' },
  { subject: 'Fizika', image: '/assets/Ustozlar/fizika.jpg' },
  { subject: 'Matematika', image: '/assets/Ustozlar/matem.jpg' },
    { subject: 'Ona tili', image: '/assets/Ustozlar/ona.jpg' },
  { name: 'Karimova Ziynat', subject: 'Matematika', image: '/assets/Ustozlar/karimova-ziynat.jpg' },
  { name: 'Po‘latova Mazluma', subject: 'Matematika', image: '/assets/Ustozlar/polatova-mazluma.jpg' },
  { name: 'Yermatov Shermuhammad', subject: 'Jismoniy Tarbiya', image: '/assets/Ustozlar/yermatov-shermuhammad.jpg' },
  { name: 'Xatarova Munira', subject: 'Matematika', image: '/assets/Ustozlar/xatarova-munira.jpg' },
  { name: 'Saidova Zulfizar', subject: 'Matematika', image: '/assets/Ustozlar/saidova-zulfizar.jpg' },

];

const admissionSteps = [
  {
    Icon: Phone,
    title: 'Ma’lumot olish',
    text: 'Joriy qabul shartlari, kvota va imtihon sanalari bilan litsey telefon orqali tanishing.',
  },
  {
    Icon: FileText,
    title: 'Hujjatlarni tayyorlash',
    text: 'Ariza, shaxsni tasdiqlovchi hujjat nusxasi, foto va maktab hujjatlarini yig‘ing.',
  },
  {
    Icon: CheckCircle2,
    title: 'Ariza topshirish',
    text: 'Belgilangan muddatda hujjatlarni litsey qabul komissiyasiga topshiring.',
  },
  {
    Icon: GraduationCap,
    title: 'Imtihon va suhbat',
    text: 'Yo‘nalish fanlaridan imtihon hamda suhbatdan muvaffaqiyatli o‘ting.',
  },
];

const documents = [
  'Ariza (litsey blankasida)',
  'Tug‘ilganlik haqida guvohnoma nusxasi',
  'Pasport yoki ID-karta nusxasi',
  '3x4 o‘lchamdagi foto (2 dona)',
  'Oldingi o‘quv yurtidan ma’lumotnoma',
];

const faqs = [
  ['Litsey qaysi oliygoh qoshida?', 'O‘zbekiston Milliy universiteti qoshidagi akademik litsey.'],
  ['Qachon tashkil etilgan?', 'Rasmiy tarix sahifasiga ko‘ra, muassasa 1970-yil 25-sentabrda Respublika maxsus maktab-internati sifatida tashkil etilgan.'],
  ['Qachon akademik litsey maqomini olgan?', 'Vazirlar Mahkamasi 1998-yil 24-fevralda maktab-internatga akademik litsey maqomini berish haqida qaror qabul qilgan.'],
  ['Qaysi fanlarga ixtisoslashgan?', 'Litsey tabiiy va aniq fanlarga ixtisoslashgan. Avvalgi qabul e’lonida aniq fanlar uchun matematika va fizika, tabiiy fanlar uchun kimyo va biologiya ko‘rsatilgan.'],
  ['Qabul uchun qanday hujjatlar kerak?', 'Ariza, tug‘ilganlik guvohnomasi va pasport nusxalari, 3x4 foto hamda oldingi o‘quv yurtidan ma’lumotnoma. Aniq ro‘yxatni litsey bilan aniqlashtiring.'],
  ['Litseyga qanday yetib borish mumkin?', 'Manzil: Chilonzor-9 mavzesi, 33-uy. Jamoat transportida Chilonzor-9 mavzesigacha yetib kelish mumkin.'],
  ['Joriy qabul kvotasi va imtihon sanalarini qayerdan bilish mumkin?', 'Bu ma’lumotlar o‘quv yiliga qarab yangilanadi. Litsey bilan telefon orqali bog‘lanib, joriy e’lonni tasdiqlang.'],
];

const FALLBACK_STATS = stats;
const FALLBACK_ADVANTAGES = advantages;
const FALLBACK_DIRECTIONS = directions;
const FALLBACK_TEACHERS = teachers;
const FALLBACK_ADMISSION_STEPS = admissionSteps;
const FALLBACK_DOCUMENTS = documents;
const FALLBACK_FAQS = faqs;

const SectionHeading = ({ eyebrow, title, text }) => (
  <div className="max-w-3xl">
    <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">{eyebrow}</p>
    <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">{title}</h2>
    {text ? <p className="mt-4 text-sm leading-6 text-[#5b666d]">{text}</p> : null}
  </div>
);

const LyceumHomePage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : i18n.language?.startsWith('en') ? 'en' : 'uz';
  const isUz = lang === 'uz';
  const localeFallback = lang === 'ru' ? ru.lyceum : lang === 'en' ? en.lyceum : uz.lyceum;
  const safeArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);
  const safeObject = (value, fallback = {}) => (value && typeof value === 'object' ? value : fallback);
  const tr = { ...localeFallback, ...(t('lyceum', { returnObjects: true }) || {}) };
  const [activeCertificate, setActiveCertificate] = useState(null);

  const { content, overrides, sharedMediaContent, settings: siteSettings } = useSiteContent(lang);
  const c = content || {};
  const saved = overrides || {};
  const sharedMedia = sharedMediaContent || {};
  const savedSections = safeObject(saved.sections, {});
  const sectionMeta = (key) => ({ ...safeObject(safeObject(tr)[key]), ...safeObject(savedSections[key]) });

  const hero = { ...safeObject(safeObject(tr).hero), ...safeObject(saved.hero) };
  const newsMeta = { ...safeObject(tr.news), ...safeObject(savedSections.news), ...(Array.isArray(saved.news) ? {} : safeObject(saved.news)) };
  const newsItems = safeArray(saved.news?.items, safeArray(saved.newsItems, safeArray(tr.news?.items, localeFallback.news?.items || [])));
  const stats = safeArray(saved.stats, safeArray(tr.stats, FALLBACK_STATS));
  const advantages = safeArray(saved.advantages, safeArray(tr.advantages?.items, FALLBACK_ADVANTAGES)).map((a) => ({ ...a, Icon: ICON_MAP[a.icon] || Landmark }));
  const directions = safeArray(saved.directions, safeArray(tr.directions?.items, FALLBACK_DIRECTIONS)).map((d) => ({ ...d, Icon: ICON_MAP[d.icon] || Atom }));
  const syncImages = (items, sharedItems) => items.map((item, index) => {
    const sharedItem = item.name
      ? sharedItems.find((candidate) => candidate.name === item.name) || sharedItems[index]
      : sharedItems[index];
    return sharedItem?.image ? { ...item, image: sharedItem.image } : item;
  });
  const teachers = syncImages(
    safeArray(saved.teachers, safeArray(tr.teachers?.list, FALLBACK_TEACHERS)),
    safeArray(sharedMedia.teachers, en.lyceum.teachers.list),
  );
  const sharedAchievements = safeArray(sharedMedia.achievements, en.lyceum.achievements.list);
  const achievements = syncImages(
    safeArray(saved.achievements, safeArray(tr.achievements?.list, localeFallback.achievements?.list || [])),
    sharedAchievements,
  ).map((item, index) => {
    const sharedItem = item.name
      ? sharedAchievements.find((candidate) => candidate.name === item.name) || sharedAchievements[index]
      : sharedAchievements[index];
    const sharedDocuments = safeArray(sharedItem?.documents, []);
    if (!Array.isArray(item.documents) || !sharedDocuments.length) return item;
    return {
      ...item,
      documents: item.documents.map((document, documentIndex) => ({
        ...document,
        ...(sharedDocuments[documentIndex]?.image ? { image: sharedDocuments[documentIndex].image } : {}),
      })),
    };
  });
  const admissionSteps = safeArray(saved.admissionSteps, safeArray(tr.admissions?.items, FALLBACK_ADMISSION_STEPS)).map((step) => ({ ...step, Icon: ICON_MAP[step.icon] || Phone }));
  const documents = safeArray(saved.documents, safeArray(tr.admissions?.documents, FALLBACK_DOCUMENTS));
  const faqs = safeArray(saved.faqs, safeArray(tr.questions?.items, FALLBACK_FAQS));
  const factsData = safeArray(saved.facts, safeArray(tr.facts, facts)).map((f) => ({ ...f, Icon: f.Icon || ICON_MAP[f.icon] || CalendarDays }));
  const milestonesData = safeArray(saved.about?.milestones, safeArray(saved.milestones, safeArray(tr.about?.milestones, milestones)));
  const aboutMeta = { ...safeObject(tr.about), ...safeObject(savedSections.about), ...safeObject(saved.about) };
  const advantagesMeta = sectionMeta('advantages');
  const directionsMeta = sectionMeta('directions');
  const teachersMeta = sectionMeta('teachers');
  const achievementsMeta = sectionMeta('achievements');
  const admissionsMeta = sectionMeta('admissions');
  const historyMeta = sectionMeta('history');
  const heritageMeta = sectionMeta('heritage');
  const environmentMeta = sectionMeta('environment');
  const questionsMeta = sectionMeta('questions');
  const contactMeta = sectionMeta('contact');
  const ctaMeta = sectionMeta('cta');
  const meta = { ...safeObject(tr.meta), ...safeObject(savedSections.meta) };

  const site = { ...siteSettings, ...safeObject(saved.site) };
  const contacts = { ...siteSettings, ...site, ...safeObject(saved.contacts) };
  const ADDRESS = contacts.address || contactMeta.defaultAddress || tr.contact?.defaultAddress || DEFAULT_ADDRESS;
  const PHONE = contacts.phone || DEFAULT_PHONE;
  const PHONE_HREF = contacts.phoneHref || DEFAULT_PHONE_HREF;
  const LAT = contacts.lat || DEFAULT_LAT;
  const LNG = contacts.lng || DEFAULT_LNG;
  const MAP_EMBED = `https://www.google.com/maps?q=${LAT},${LNG}&z=17&hl=uz&output=embed`;
  const MAP_DIR = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
  const MAP_YANDEX = `https://yandex.uz/maps/?pt=${LNG},${LAT}&z=17&l=map`;
  const MAP_OSM = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=18/${LAT}/${LNG}`;
  const INSTAGRAM_URL = contacts.instagram || DEFAULT_INSTAGRAM_URL;
  const NUU_URL = contacts.nuu || DEFAULT_NUU_URL;
  const HERO_V = hero.video || HERO_VIDEO;
  const HERO_P = hero.poster || HERO_POSTER;
  const ABOUT_VISUAL = aboutMeta.image || ABOUT_IMAGE;
  const ENVIRONMENT_VISUAL = environmentMeta.image || STUDENT_IMAGE;

  return (
  <>
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.ogTitle || meta.title} />
      <meta property="og:description" content={meta.ogDescription || meta.description} />
      <meta property="og:image" content={meta.ogImage || CAMPUS_IMAGE} />
    </Helmet>

    <div>
      <section id="hero" className="relative isolate min-h-[620px] overflow-hidden bg-[#132d43] text-white sm:min-h-[690px] lg:min-h-[720px]">
        <video
          src={HERO_V}
          poster={HERO_P}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,34,52,.94)_0%,rgba(13,34,52,.78)_48%,rgba(13,34,52,.18)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(13,34,52,.7),transparent_42%)]" />

        <div className="mx-auto flex min-h-[620px] max-w-[1440px] items-center px-5 pb-24 pt-16 sm:min-h-[690px] sm:px-10 sm:pb-28 lg:min-h-[720px] lg:px-16">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase text-white/80 sm:text-sm">
              <span className="h-px w-10 bg-[#d5ad68]" />
              {hero.eyebrow || tr.hero.eyebrow}
            </div>
            <h1 className="!text-white max-w-4xl font-['Source_Serif_4'] text-4xl font-semibold leading-[1.06] sm:text-6xl lg:text-7xl">
              {hero.title || tr.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              {hero.subtitle || tr.hero.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              {(hero.badges || tr.hero.badges).map((b, i) => {
                const BIcon = ICON_MAP[b.icon] || CalendarDays;
                return <span key={i} className="inline-flex items-center gap-2"><BIcon size={16} className="text-[#d5ad68]" /> {b.text}</span>;
              })}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {(hero.buttons || tr.hero.buttons).map((btn, i) => {
                if (btn.variant === 'primary') {
                  return <a key={i} href={btn.href} className="inline-flex min-h-12 items-center gap-3 bg-[#d5ad68] px-6 py-3 text-sm font-bold text-[#172c3d] transition hover:bg-[#e3c486]">{btn.text} <ArrowRight size={17} /></a>;
                }
                if (btn.variant === 'ghost') {
                  return <a key={i} href={btn.href} className="inline-flex min-h-12 items-center border border-white/25 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10">{btn.text}</a>;
                }
                return <a key={i} href={btn.href} className="inline-flex min-h-12 items-center gap-3 border border-white/55 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">{btn.text}</a>;
              })}
            </div>
          </div>
        </div>
        <span className="absolute bottom-5 right-5 bg-black/45 px-3 py-1.5 text-[11px] text-white/80 sm:right-10">
          {hero.overlayLabel || tr.hero.overlayLabel}
        </span>
      </section>

      <section aria-label="Litsey haqida qisqacha" className="border-b border-[#ddd3c2] bg-[#eee6d8]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-[#cfc3ae] px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-10 lg:px-16">
          {factsData.map(({ value, label, Icon }) => (
            <div key={value} className="flex min-h-28 items-center gap-3 px-3 py-5 sm:min-h-32 sm:gap-4 sm:px-5 lg:px-7">
              <Icon className="hidden shrink-0 text-[#9d7335] sm:block" size={23} strokeWidth={1.7} />
              <div>
                <div className="font-['Source_Serif_4'] text-2xl font-semibold leading-none text-[#19354d] sm:text-3xl">{value}</div>
                <div className="mt-2 text-xs leading-4 text-[#53616a] sm:text-sm">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="advantages" className="scroll-mt-32 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <SectionHeading
            eyebrow={advantagesMeta.eyebrow}
            title={advantagesMeta.title}
            text={advantagesMeta.text}
          />
          <div className="mt-9 grid gap-px border border-[#dfe3e4] bg-[#dfe3e4] sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map(({ Icon, title, text }) => (
              <article key={title} className="group bg-white p-7 transition-colors hover:bg-[#f7f5ef]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2eee6] text-[#9d7335] transition-colors group-hover:bg-[#19354d] group-hover:text-[#e5c98f]">
                  <Icon size={23} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-['Source_Serif_4'] text-xl font-semibold text-[#19354d]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5b666d]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="scroll-mt-32 bg-[#f7f5ef] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-[#d9dfe1] pb-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase text-[#9d7335]">{newsMeta.eyebrow}</p>
              <h2 className="font-['Source_Serif_4'] text-3xl font-semibold text-[#19354d] sm:text-4xl">{newsMeta.title}</h2>
            </div>
            <a href={newsItems[0]?.href || NUU_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#19354d] hover:text-[#9d7335]">
              {newsMeta.linkText || 'Batafsil'} <ExternalLink size={15} />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {newsItems.map((item, index) => {
              const NIcon = ICON_MAP[item.icon] || CalendarDays;
              return (
                <article key={`${item.href || item.title}-${index}`} className="border border-[#dfe3e4] bg-white p-6 sm:p-8">
                  <div className="mb-5 flex items-center gap-3 text-xs font-semibold text-[#6d777c]">
                    <NIcon size={16} className="text-[#9d7335]" />
                    {item.badge}
                  </div>
                  <h3 className="font-['Source_Serif_4'] text-2xl font-semibold leading-snug text-[#19354d]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#5b666d]">
                    {item.text}
                  </p>
                  <a href={item.href || NUU_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
                    {item.linkText || 'Batafsil'} <ArrowRight size={16} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-32 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">{aboutMeta.eyebrow}</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">
              {aboutMeta.title}
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#53616a]">
              {aboutMeta.p1 || aboutMeta.paragraphs?.[0]}
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[#53616a]">
              {aboutMeta.p2 || aboutMeta.paragraphs?.[1]}
            </p>
            <a href={aboutMeta.linkHref || NUU_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
              {aboutMeta.linkText} <ExternalLink size={15} />
            </a>

            <figure className="mt-8 overflow-hidden border border-[#dfe3e4]">
              <img src={ABOUT_VISUAL} alt={aboutMeta.imageAlt} loading="lazy" className="h-56 w-full object-cover sm:h-64" />
            </figure>
          </div>

          <div className="border-l border-[#c9bda8] pl-5 sm:pl-8">
            {milestonesData.map(({ year, text }, index) => (
              <div key={year} className={`relative grid grid-cols-[86px_1fr] gap-4 pb-8 sm:grid-cols-[105px_1fr] sm:gap-6 ${index === milestonesData.length - 1 ? 'pb-0' : ''}`}>
                <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#a27a3b] sm:-left-[41px]" />
                <span className="font-['Source_Serif_4'] text-2xl font-semibold text-[#9d7335]">{year}</span>
                <p className="text-sm leading-6 text-[#53616a]">{text}</p>
              </div>
            ))}

            <div className="mt-10 border border-[#e0e3e3] bg-[#f5f6f4] p-6">
              <div className="flex items-center gap-3 text-[#9d7335]">
                <Sparkles size={20} strokeWidth={1.7} />
                <h3 className="font-['Source_Serif_4'] text-xl font-semibold text-[#19354d]">{aboutMeta.todayTitle}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#53616a]">
                {aboutMeta.todayText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Litsey raqamlarda" className="bg-[#f2eee6] py-12 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-[#d7cbb7] px-5 sm:px-10 lg:grid-cols-4 lg:px-16">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-[#f2eee6] px-4 py-7 text-center sm:px-6">
              <div className="font-['Source_Serif_4'] text-3xl font-semibold text-[#19354d] sm:text-4xl">{value}</div>
              <div className="mt-2 text-xs leading-4 text-[#53616a] sm:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="directions" className="scroll-mt-32 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <SectionHeading
            eyebrow={directionsMeta.eyebrow}
            title={directionsMeta.title}
            text={directionsMeta.text}
          />

          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {directions.map(({ Icon, title, subjects, text, fit }) => (
              <article key={title} className="group flex flex-col border border-[#dfe3e4] p-7 transition-colors hover:border-[#a27a3b] sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <Icon size={28} strokeWidth={1.6} className="text-[#9d7335]" />
                  <div className="flex flex-wrap justify-end gap-2">
                    {subjects.map(subject => (
                      <span key={subject} className="border border-[#d7cbb7] bg-[#f7f5ef] px-3 py-1 text-xs font-semibold text-[#19354d]">{subject}</span>
                    ))}
                  </div>
                </div>
                <h3 className="mt-5 font-['Source_Serif_4'] text-2xl font-semibold text-[#19354d]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5b666d]">{text}</p>
                <div className="mt-5 border-t border-[#e5e9ea] pt-4">
                  <p className="text-xs font-bold uppercase text-[#9d7335]">{directionsMeta.fitLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5b666d]">{fit}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#707a7f]">{directionsMeta.note}</p>
        </div>
      </section>

      <section id="teachers" className="scroll-mt-32 bg-[#17344b] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-bold uppercase text-[#d5ad68]">{teachersMeta.eyebrow}</p>
              <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {teachersMeta.title}
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-white/80">
                {teachersMeta.text}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4 text-sm">
                <div className="border border-white/15 bg-white/5 p-4">
                  <div className="font-['Source_Serif_4'] text-2xl font-semibold text-[#e5c98f]">{teachersMeta.stat1Value}</div>
                  <div className="mt-1 text-white/70">{teachersMeta.stat1Label}</div>
                </div>
                <div className="border border-white/15 bg-white/5 p-4">
                  <div className="font-['Source_Serif_4'] text-2xl font-semibold text-[#e5c98f]">{teachersMeta.stat2Value}</div>
                  <div className="mt-1 text-white/70">{teachersMeta.stat2Label}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {teachers.map(({ subject, name, image }) => {
                const title = name || subject;
                return (
                  <figure key={title} className="group relative overflow-hidden border border-white/15 bg-white/5">
                    <img src={image} alt={name ? `${name} — ${subject}` : t('lyceum.teachers.alt', { subject })} loading="lazy" className="h-52 w-full object-cover object-top transition duration-500 group-hover:scale-105 sm:h-60 lg:h-56" />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d2234] via-[#0d2234]/70 to-transparent px-4 pb-4 pt-10">
                      <span className="block text-xs font-semibold uppercase text-[#e5c98f]">{teachersMeta.label}</span>
                      <span className="mt-1 block font-['Source_Serif_4'] text-lg font-semibold">{title}</span>
                      {name && <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-white/65">{subject}</span>}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="achievements" className="scroll-mt-32 bg-[#f2eee6] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <SectionHeading
            eyebrow={achievementsMeta.eyebrow}
            title={achievementsMeta.title}
            text={achievementsMeta.text}
          />

          <div className="mt-9 space-y-6">
            {achievements.map((item) => {
              const documents = item.documents || [{ label: tr.achievements.certificateLabel, image: item.image, alt: item.alt }];
              const mainDocument = documents[0];
              return (
              <article key={item.name} className="grid overflow-hidden border border-[#dfe3e4] bg-white md:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
                <button
                  type="button"
                  onClick={() => setActiveCertificate({ image: mainDocument.image, alt: mainDocument.alt, name: item.name, label: mainDocument.label })}
                  aria-label={`${tr.achievements.viewLabel}: ${item.name} — ${mainDocument.label}`}
                  className="group relative block min-h-[320px] overflow-hidden bg-[#0d2234] md:min-h-full"
                >
                  <img
                    src={mainDocument.image}
                    alt={mainDocument.alt}
                    loading="lazy"
                    className="h-full w-full object-contain object-center transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-[#d5ad68] px-3 py-1 text-[11px] font-bold uppercase text-[#172c3d]">
                    <Award size={13} /> {mainDocument.label}
                  </span>
                </button>

                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <h3 className="font-['Source_Serif_4'] text-2xl font-semibold text-[#19354d] sm:text-3xl">{item.name}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5b666d]">{item.summary}</p>

                  <div className="mt-5 grid gap-3 xl:grid-cols-2">
                    {item.scores.map((score) => (
                      <div key={score.label} className="border border-[#d7cbb7] bg-[#f7f5ef] p-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[10px] font-bold uppercase text-[#9d7335]">{score.label}</span>
                          <span className="font-['Source_Serif_4'] text-2xl font-semibold text-[#19354d]">
                            {score.value}
                            {score.note && <> <span className="align-middle font-sans text-[10px] font-bold uppercase text-[#5b666d]">{score.note}</span></>}
                          </span>
                        </div>
                        {score.parts?.length > 0 && (
                          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-[#e5e9ea] pt-3 text-xs">
                            {score.parts.map((part) => (
                              <div key={part.label} className="flex items-center justify-between gap-2">
                                <dt className="text-[#5b666d]">{part.label}</dt>
                                <dd className="font-semibold text-[#19354d]">{part.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e5e9ea] pt-4 text-xs text-[#5b666d]">
                    <span><span className="font-bold uppercase text-[#9d7335]">{tr.achievements.groupLabel}:</span> {item.group}</span>
                    <span><span className="font-bold uppercase text-[#9d7335]">{tr.achievements.teacherLabel}:</span> {item.teacher}</span>
                    {item.duration && <span><span className="font-bold uppercase text-[#9d7335]">{tr.achievements.durationLabel}:</span> {item.duration}</span>}
                  </div>

                  {item.congrats && (
                    <p className="mt-4 border-l-2 border-[#d5ad68] bg-[#f7f5ef] px-4 py-3 text-xs leading-5 text-[#5b666d]">{item.congrats}</p>
                  )}

                  <div className="mt-5 border-t border-[#e5e9ea] pt-4">
                    <p className="text-[10px] font-bold uppercase text-[#9d7335]">{tr.achievements.documentsLabel}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {documents.map((doc) => (
                        <button
                          key={doc.label}
                          type="button"
                          onClick={() => setActiveCertificate({ image: doc.image, alt: doc.alt, name: item.name, label: doc.label })}
                          className="inline-flex items-center gap-1.5 border border-[#d7cbb7] bg-[#f7f5ef] px-3 py-1.5 text-[11px] font-bold uppercase text-[#19354d] transition hover:border-[#9d7335] hover:text-[#9d7335]"
                        >
                          <Award size={12} /> {doc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-5 border border-[#19354d]/15 bg-[#17344b] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-4">
              <span className="font-['Source_Serif_4'] text-4xl font-semibold leading-none text-[#e5c98f] sm:text-5xl">{tr.achievements.moreValue}</span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-white">{tr.achievements.moreTitle}</p>
                <p className="mt-1 max-w-xl text-xs leading-5 text-white/65">{tr.achievements.moreText}</p>
              </div>
            </div>
            <a
              href="https://t.me/sirojiddinov_academic_lyceum"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#d5ad68] px-5 py-2.5 text-sm font-bold text-[#172c3d] transition hover:bg-[#e3c486]"
            >
              {tr.achievements.moreLink} <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      <section id="admissions" className="scroll-mt-32 bg-[#f7f5ef] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={admissionsMeta.eyebrow}
                title={admissionsMeta.title}
                text={admissionsMeta.text}
              />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {admissionSteps.map(({ Icon, title, text }, index) => (
                  <article key={title} className="border border-[#dfe3e4] bg-white p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#19354d] text-sm font-bold text-[#e5c98f]">{index + 1}</span>
                      <Icon size={20} className="text-[#9d7335]" />
                    </div>
                    <h3 className="mt-4 font-['Source_Serif_4'] text-xl font-semibold text-[#19354d]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5b666d]">{text}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="border border-[#d7cbb7] bg-[#eee6d8] p-6 sm:p-8">
              <h3 className="font-['Source_Serif_4'] text-2xl font-semibold text-[#19354d]">{admissionsMeta.documentsTitle}</h3>
              <ul className="mt-5 space-y-3">
                {documents.map(document => (
                  <li key={document} className="flex items-start gap-3 text-sm leading-6 text-[#53616a]">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#9d7335]" />
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-[#cfc3ae] pt-5">
                <p className="text-xs leading-5 text-[#6d777c]">
                  {admissionsMeta.note}
                </p>
                <a href={PHONE_HREF} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-3 bg-[#17344b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#244863]">
                  <Phone size={16} /> {PHONE}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="history" className="scroll-mt-32 bg-[#17344b] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#d5ad68]">{historyMeta.eyebrow}</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-white sm:text-4xl">{historyMeta.title}</h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-[15px] leading-7 text-white/80">
              {historyMeta.text}
            </p>
            <a href={NUU_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e5c98f] hover:text-white">
              {historyMeta.linkText} <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      <section id="heritage" className="scroll-mt-32 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">{heritageMeta.eyebrow}</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">
              {heritageMeta.title}
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#53616a]">
              {heritageMeta.text}
            </p>
            <a href={heritageMeta.linkHref || NUU_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
              {heritageMeta.linkText} <ExternalLink size={15} />
            </a>
          </div>

          <div className="grid gap-px border border-[#e0e3e3] bg-[#e0e3e3] sm:grid-cols-3">
            {(heritageMeta.items || []).map(({ value, label }) => (
              <div key={value} className="flex min-h-36 flex-col justify-between bg-[#f5f6f4] p-6 sm:min-h-48 sm:p-7">
                <span className="font-['Source_Serif_4'] text-2xl font-semibold text-[#9d7335] sm:text-3xl">{value}</span>
                <p className="mt-6 text-sm leading-5 text-[#53616a]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2eee6] py-14 sm:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-14 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">{environmentMeta.eyebrow}</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">{environmentMeta.title}</h2>
            <p className="mt-4 text-sm leading-6 text-[#53616a]">
              {environmentMeta.text}
            </p>
            <ul className="mt-5 space-y-3">
              {(environmentMeta.items || []).map(item => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#53616a]">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#9d7335]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="relative min-h-[260px] overflow-hidden bg-[#19354d] sm:min-h-[340px]">
            <img src={ENVIRONMENT_VISUAL} alt={environmentMeta.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142f45]/80 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 text-xs font-medium text-white/90 sm:bottom-6 sm:left-6">{environmentMeta.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section id="questions" className="scroll-mt-32 bg-[#f7f5ef] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">{questionsMeta.eyebrow}</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold text-[#19354d] sm:text-4xl">{questionsMeta.title}</h2>
            <p className="mt-4 text-sm leading-6 text-[#5b666d]">{questionsMeta.text}</p>
            <a href={PHONE_HREF} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]"><Phone size={16} /> {PHONE}</a>
            <a href="#contact" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#19354d] hover:text-[#9d7335]"><MapPin size={16} className="text-[#9d7335]" /> {questionsMeta.addressLink}</a>
          </div>

          <div className="border-t border-[#d9dfe1]">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group border-b border-[#d9dfe1]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold text-[#19354d] marker:hidden">
                  <span>{question}</span>
                  <ChevronDown size={18} className="shrink-0 text-[#9d7335] transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-3xl pb-5 pr-8 text-sm leading-6 text-[#5b666d]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-32 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d9dfe1] pb-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">{contactMeta.eyebrow}</p>
              <h2 className="font-['Source_Serif_4'] text-3xl font-semibold text-[#19354d] sm:text-4xl">{contactMeta.title}</h2>
            </div>
            <a href={MAP_DIR} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#19354d] hover:text-[#9d7335]">
              {contactMeta.directionsLink} <ExternalLink size={15} />
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 shrink-0 text-[#9d7335]" size={20} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">{contactMeta.addressTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5b666d]">{ADDRESS}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-[#19354d]">
                    <a href={MAP_DIR} target="_blank" rel="noreferrer" className="hover:text-[#9d7335]">Google Maps</a>
                    <a href={MAP_YANDEX} target="_blank" rel="noreferrer" className="hover:text-[#9d7335]">Yandex Maps</a>
                    <a href={MAP_OSM} target="_blank" rel="noreferrer" className="hover:text-[#9d7335]">OpenStreetMap</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">{contactMeta.phoneTitle}</h3>
                  <a href={PHONE_HREF} className="mt-1 inline-block text-sm text-[#5b666d] hover:text-[#9d7335]">{PHONE}</a>
                  <p className="mt-1 text-xs text-[#707a7f]">{contactMeta.phoneNote}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">{contactMeta.hoursTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5b666d]">{contactMeta.hours || contacts.workingHours}</p>
                  <p className="mt-1 text-xs text-[#707a7f]">{contactMeta.hoursNote}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Bus className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">{contactMeta.routeTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5b666d]">{contactMeta.routeText}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ExternalLink className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">{contactMeta.socialTitle}</h3>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-[#5b666d] hover:text-[#9d7335]">{contactMeta.instagramText}</a>
                </div>
              </div>
            </div>

            <div className="overflow-hidden border border-[#dfe3e4] bg-[#f2eee6]">
              <iframe
                title={contactMeta.mapTitle}
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[320px] w-full border-0 sm:h-[420px] lg:h-full lg:min-h-[420px]"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-[#e5e9ea] bg-[#f7f5ef] px-5 py-4 text-xs text-[#6d777c]">
            <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-[#9d7335]" /> {LAT}, {LNG}</span>
            <a href={MAP_DIR} target="_blank" rel="noreferrer" className="font-semibold text-[#19354d] hover:text-[#9d7335]">{contactMeta.openMap}</a>
          </div>
        </div>
      </section>

      <section className="bg-[#eee6d8] py-14 sm:py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase text-[#9d7335]">{ctaMeta.eyebrow}</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d]">{ctaMeta.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#53616a]">{ctaMeta.text}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={PHONE_HREF} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#17344b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#244863]">
              <Phone size={17} /> {PHONE}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 border border-[#19354d]/25 px-6 py-3 text-sm font-bold text-[#19354d] transition hover:bg-white/50">
              {ctaMeta.instagram} <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      {activeCertificate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCertificate.name} — ${activeCertificate.label}`}
          onClick={() => setActiveCertificate(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d2234]/95 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setActiveCertificate(null)}
            aria-label={achievementsMeta.closeLabel}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center border border-white/25 text-white transition hover:bg-white/10 sm:right-6 sm:top-6"
          >
            <X size={22} />
          </button>
          <img
            src={activeCertificate.image}
            alt={activeCertificate.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] max-w-full object-contain"
          />
        </div>
      )}
    </div>
    </>
  );
};

export default LyceumHomePage;
