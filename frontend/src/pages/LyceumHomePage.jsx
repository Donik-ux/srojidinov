import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Atom,
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
} from 'lucide-react';
import useSiteContent from '../hooks/useSiteContent';
import { ICON_MAP } from '../utils/siteFallback';

const CAMPUS_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=88';
const HERO_VIDEO = '/assets/videos/hero.mp4';
const HERO_POSTER = '/assets/videos/hero-poster.jpg';
const STUDENT_IMAGE = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85';
const ABOUT_IMAGE = '/assets/images/about-new-1.jpg';

const ADDRESS = '100097, Toshkent shahri, Chilonzor tumani, Chilonzor-9 mavzesi, 33-uy';
const PHONE = '+998 71 278 43 58';
const PHONE_HREF = 'tel:+998712784358';
const LAT = '41.289371';
const LNG = '69.1964656';
const MAP_EMBED = `https://www.google.com/maps?q=${LAT},${LNG}&z=17&hl=uz&output=embed`;
const MAP_LINK = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
const YANDEX_LINK = `https://yandex.uz/maps/?pt=${LNG},${LAT}&z=17&l=map`;
const OSM_LINK = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=18/${LAT}/${LNG}`;
const INSTAGRAM = 'https://www.instagram.com/sirojiddinov_academic_lyceum/';
const NUU_PAGE = 'https://nuu.uz/s-h-sirojiddinov-nomidagi-akademik-litseyi/';

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

const SectionHeading = ({ eyebrow, title, text }) => (
  <div className="max-w-3xl">
    <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">{eyebrow}</p>
    <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">{title}</h2>
    {text ? <p className="mt-4 text-sm leading-6 text-[#5b666d]">{text}</p> : null}
  </div>
);

const LyceumHomePage = () => {
  const { content } = useSiteContent('uz');
  const c = content || {};
  const hero = c.hero || {};
  const stats = c.stats || ia;
  const advantages = (c.advantages || ea).map((a) => ({ ...a, Icon: ICON_MAP[a.icon] || Landmark }));
  const directions = (c.directions || sa).map((d) => ({ ...d, Icon: ICON_MAP[d.icon] || Atom }));
  const teachers = c.teachers || ta;
  const admissionSteps = (c.admissionSteps || la).map((s) => ({ ...s, Icon: ICON_MAP[s.icon] || Phone }));
  const documents = c.documents || ra;
  const faqs = c.faqs || na;
  const contacts = c.contacts || {};
  const ADDRESS = contacts.address || DEFAULT_ADDRESS;
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

  return (
  <>
    <Helmet>
      <title>S.H. Sirojiddinov nomidagi akademik litsey</title>
      <meta
        name="description"
        content="O‘zbekiston Milliy universiteti qoshidagi tabiiy va aniq fanlarga ixtisoslashtirilgan S.H. Sirojiddinov nomidagi respublika akademik litseyi."
      />
      <meta property="og:title" content="S.H. Sirojiddinov nomidagi akademik litsey" />
      <meta
        property="og:description"
        content="Tabiiy va aniq fanlarga ixtisoslashtirilgan respublika akademik litseyi."
      />
      <meta property="og:image" content={CAMPUS_IMAGE} />
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
              {hero.eyebrow || 'O‘zbekiston Milliy universiteti qoshida'}
            </div>
            <h1 className="!text-white max-w-4xl font-['Source_Serif_4'] text-4xl font-semibold leading-[1.06] sm:text-6xl lg:text-7xl">
              {hero.title || 'S.H. Sirojiddinov nomidagi respublika akademik litseyi'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              {hero.subtitle || 'Tabiiy va aniq fanlarga ixtisoslashgan, ilmiy izlanish va puxta ta’lim an’analariga tayangan maskan.'}
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              {(hero.badges || [
                { icon: 'CalendarDays', text: '1970-yildan beri' },
                { icon: 'Atom', text: 'Aniq va tabiiy fanlar' },
                { icon: 'Landmark', text: 'O‘zMU qoshida' },
              ]).map((b, i) => {
                const BIcon = ICON_MAP[b.icon] || CalendarDays;
                return <span key={i} className="inline-flex items-center gap-2"><BIcon size={16} className="text-[#d5ad68]" /> {b.text}</span>;
              })}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {(hero.buttons || [
                { text: "Ta’lim yo‘nalishlari", href: '#directions', variant: 'primary' },
                { text: "Qabul jarayoni", href: '#admissions', variant: 'secondary' },
                { text: "Bog‘lanish", href: '#contact', variant: 'ghost' },
              ]).map((btn, i) => {
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
          {hero.overlayLabel || 'Video'}
        </span>
      </section>

      <section aria-label="Litsey haqida qisqacha" className="border-b border-[#ddd3c2] bg-[#eee6d8]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-[#cfc3ae] px-5 sm:grid-cols-4 sm:divide-y-0 sm:px-10 lg:px-16">
          {facts.map(({ value, label, Icon }) => (
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
            eyebrow="Afzalliklar"
            title="Nega litseyni tanlashadi"
            text="Litsey o‘quvchilarga puxta bilim, ilmiy qiziqish va universitet muhitiga yaqinlikni birga taqdim etadi."
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
              <p className="mb-2 text-xs font-bold uppercase text-[#9d7335]">Rasmiy ma’lumotlar</p>
              <h2 className="font-['Source_Serif_4'] text-3xl font-semibold text-[#19354d] sm:text-4xl">Litsey hayotidan</h2>
            </div>
            <a href="https://nuu.uz/ru/rektor-universitet-qoshidagi-talim-muassasalari-faoliyatini-organdi/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#19354d] hover:text-[#9d7335]">
              O‘zMU xabari <ExternalLink size={15} />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article className="border border-[#dfe3e4] bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3 text-xs font-semibold text-[#6d777c]">
                <CalendarDays size={16} className="text-[#9d7335]" />
                25-dekabr, 2025
              </div>
              <h3 className="font-['Source_Serif_4'] text-2xl font-semibold leading-snug text-[#19354d]">
                O‘zMU rektori litsey faoliyati bilan tanishdi
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#5b666d]">
                Rasmiy tashrif davomida jamoa bilan uchrashuv o‘tkazilib, ta’lim muhiti va litsey faoliyatini rivojlantirish masalalari muhokama qilingan.
              </p>
              <a href="https://nuu.uz/ru/rektor-universitet-qoshidagi-talim-muassasalari-faoliyatini-organdi/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
                Batafsil <ArrowRight size={16} />
              </a>
            </article>

            <article className="border border-[#dfe3e4] bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3 text-xs font-semibold text-[#6d777c]">
                <Landmark size={16} className="text-[#9d7335]" />
                Litsey tarixi
              </div>
              <h3 className="font-['Source_Serif_4'] text-2xl font-semibold leading-snug text-[#19354d]">
                Aniq fanlar ta’limiga tayangan an’ana
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#5b666d]">
                Litsey tarixi 1970-yilda tashkil etilgan Respublika maxsus maktab-internatidan boshlanadi. Dastlabki ixtisosligi fizika va matematika bo‘lgan.
              </p>
              <a href={NUU_PAGE} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
                O‘zMUdagi tarix sahifasi <ArrowRight size={16} />
              </a>
            </article>

            <article className="border border-[#dfe3e4] bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3 text-xs font-semibold text-[#6d777c]">
                <CalendarDays size={16} className="text-[#9d7335]" />
                30-sentabr, 2026
              </div>
              <h3 className="font-['Source_Serif_4'] text-2xl font-semibold leading-snug text-[#19354d]">
                Litseyda bayram tadbiri va uch avlod uchrashuvi
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#5b666d]">
                O‘zMU xabarida litseyda bayram tadbiri hamda uch avlod uchrashuvi o‘tkazilgani qayd etilgan.
              </p>
              <a href="https://nuu.uz/s-h-sirojiddinov-nomidagi-akademik-litseyda-bayram-tadbiri-hamda-uch-avlod-uchrashuvi-bolib-otdi/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
                O‘zMU xabarini ochish <ArrowRight size={16} />
              </a>
            </article>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-32 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">Biz haqimizda</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">
              Ilmga mehr bilan boshlangan yo‘l
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#53616a]">
              S.H. Sirojiddinov nomidagi respublika akademik litseyi O‘zbekiston Milliy universiteti qoshidagi ta’lim muassasasidir. Bugun litsey tabiiy va aniq fanlarga ixtisoslashgan ta’lim maskani sifatida tanilgan.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[#53616a]">
              Litsey o‘z tarixi davomida minglab bitiruvchilarga puxta bilim berib, ularning nufuzli oliy ta’lim muassasalarida tahsil olishiga zamin yaratgan. Asosiy maqsad — yoshlarda mustaqil fikrlash, izlanish va fanlarga samimiy qiziqishni shakllantirish.
            </p>
            <a href={NUU_PAGE} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
              Rasmiy tarixni o‘qish <ExternalLink size={15} />
            </a>

            <figure className="mt-8 overflow-hidden border border-[#dfe3e4]">
              <img src={ABOUT_IMAGE} alt="Litsey bunyosi va ta’lim muhiti" loading="lazy" className="h-56 w-full object-cover sm:h-64" />
            </figure>
          </div>

          <div className="border-l border-[#c9bda8] pl-5 sm:pl-8">
            {milestones.map(({ year, text }, index) => (
              <div key={year} className={`relative grid grid-cols-[86px_1fr] gap-4 pb-8 sm:grid-cols-[105px_1fr] sm:gap-6 ${index === milestones.length - 1 ? 'pb-0' : ''}`}>
                <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#a27a3b] sm:-left-[41px]" />
                <span className="font-['Source_Serif_4'] text-2xl font-semibold text-[#9d7335]">{year}</span>
                <p className="text-sm leading-6 text-[#53616a]">{text}</p>
              </div>
            ))}

            <div className="mt-10 border border-[#e0e3e3] bg-[#f5f6f4] p-6">
              <div className="flex items-center gap-3 text-[#9d7335]">
                <Sparkles size={20} strokeWidth={1.7} />
                <h3 className="font-['Source_Serif_4'] text-xl font-semibold text-[#19354d]">Litseyning bugungi kuni</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#53616a]">
                Zamonaviy o‘quv xonalari, fan laboratoriyalari va kutubxona o‘quvchilarga nazariy bilimlarni amaliyot bilan bog‘lash imkonini beradi.
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
            eyebrow="Ta’lim yo‘nalishlari"
            title="Tabiiy, aniq va iqtisod fanlari"
            text="Ochiq manbalardagi avvalgi qabul e’lonlarida quyidagi fan juftliklari ko‘rsatilgan. Joriy o‘quv yili yo‘nalishlari va kvotalarini litsey bilan aniqlashtiring."
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
                  <p className="text-xs font-bold uppercase text-[#9d7335]">Kimga mos</p>
                  <p className="mt-2 text-sm leading-6 text-[#5b666d]">{fit}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#707a7f]">Fanlar ro‘yxati 2023–2024 o‘quv yiliga oid ochiq e’londa uchraydi; yangi qabul ma’lumotlari o‘zgarishi mumkin.</p>
        </div>
      </section>

      <section id="teachers" className="scroll-mt-32 bg-[#17344b] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="mb-3 text-xs font-bold uppercase text-[#d5ad68]">Ustozlar</p>
              <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Bilim va tajriba ustozlari
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-white/80">
                Litseyda o‘z fanini sevadigan, tajribali pedagog-o‘qituvchilar jamoasi faoliyat yuritadi. Ular o‘quvchilarni nafaqat imtihonlarga, balki mustaqil izlanish va ilmiy tafakkurga ham tayyorlaydi.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4 text-sm">
                <div className="border border-white/15 bg-white/5 p-4">
                  <div className="font-['Source_Serif_4'] text-2xl font-semibold text-[#e5c98f]">4</div>
                  <div className="mt-1 text-white/70">asosiy fan yo‘nalishi</div>
                </div>
                <div className="border border-white/15 bg-white/5 p-4">
                  <div className="font-['Source_Serif_4'] text-2xl font-semibold text-[#e5c98f]">55+</div>
                  <div className="mt-1 text-white/70">yillik pedagogik tajriba</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {teachers.map(({ subject, image }) => (
                <figure key={subject} className="group relative overflow-hidden border border-white/15 bg-white/5">
                  <img src={image} alt={`${subject} fani o‘qituvchisi`} loading="lazy" className="h-52 w-full object-cover object-top transition duration-500 group-hover:scale-105 sm:h-60 lg:h-56" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d2234] via-[#0d2234]/70 to-transparent px-4 pb-4 pt-10">
                    <span className="block text-xs font-semibold uppercase text-[#e5c98f]">O‘qituvchi</span>
                    <span className="mt-1 block font-['Source_Serif_4'] text-lg font-semibold">{subject}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="admissions" className="scroll-mt-32 bg-[#f7f5ef] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Qabul"
                title="Qabul jarayoni qanday kechadi"
                text="Quyidagi bosqichlar umumiy tartibni ko‘rsatadi. Joriy o‘quv yiliga oid aniq muddat, kvota va imtihon sanalarini litseydan aniqlashtiring."
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
              <h3 className="font-['Source_Serif_4'] text-2xl font-semibold text-[#19354d]">Hujjatlar ro‘yxati</h3>
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
                  Hujjatlar ro‘yxati o‘quv yiliga qarab yangilanishi mumkin. Ariza topshirishdan oldin litsey bilan bog‘laning.
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
            <p className="mb-3 text-xs font-bold uppercase text-[#d5ad68]">Nom sohibi</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-white sm:text-4xl">Akademik S.H. Sirojiddinov</h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-[15px] leading-7 text-white/80">
              S.H. Sirojiddinov — O‘zbekistonning taniqli matematigi, akademik va professor. O‘zMU rasmiy tarix sahifasida uning ilmiy faoliyati ehtimollar nazariyasi va matematik statistika bilan bog‘liqligi qayd etilgan.
            </p>
            <a href={NUU_PAGE} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e5c98f] hover:text-white">
              Biografik ma’lumot <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      <section id="heritage" className="scroll-mt-32 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">Ilmiy meros</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">
              Akademik S.H. Sirojiddinov
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#53616a]">
              O‘zMU tarixiy ma’lumotida S.H. Sirojiddinov matematik, akademik va professor sifatida ta’riflanadi. Uning ilmiy ishlari ehtimollar nazariyasi hamda matematik statistika bilan bog‘liq.
            </p>
            <a href={NUU_PAGE} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]">
              Rasmiy biografik ma’lumot <ExternalLink size={15} />
            </a>
          </div>

          <div className="grid gap-px border border-[#e0e3e3] bg-[#e0e3e3] sm:grid-cols-3">
            {[
              { value: '1920–1988', label: 'S.H. Sirojiddinov hayot yillari' },
              { value: '1937', label: 'Fizika-matematika fakultetini tamomlagan yil' },
              { value: '1973', label: 'Beruniy nomidagi davlat mukofoti' },
            ].map(({ value, label }) => (
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
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">Ta’lim muhiti</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d] sm:text-4xl">Fanlarga qiziqishdan ilmiy izlanishgacha</h2>
            <p className="mt-4 text-sm leading-6 text-[#53616a]">
              Litseyning tabiiy va aniq fanlarga ixtisoslashuvi matematik tafakkur, kuzatish va tajribaga qiziqishni qo‘llab-quvvatlaydi.
            </p>
            <ul className="mt-5 space-y-3">
              {['Chuqurlashtirilgan fan darslari', 'Laboratoriya va amaliy mashg‘ulotlar', 'Ilmiy loyihalar va to‘garaklar'].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#53616a]">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#9d7335]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="relative min-h-[260px] overflow-hidden bg-[#19354d] sm:min-h-[340px]">
            <img src={STUDENT_IMAGE} alt="O‘quvchilar hamkorlikda ta’lim olayotgani tasvirlangan foto" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142f45]/80 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 text-xs font-medium text-white/90 sm:bottom-6 sm:left-6">Ta’lim jarayoni — tasviriy foto</figcaption>
          </figure>
        </div>
      </section>

      <section id="questions" className="scroll-mt-32 bg-[#f7f5ef] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:px-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">Savol-javob</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold text-[#19354d] sm:text-4xl">Ko‘p so‘raladigan savollar</h2>
            <p className="mt-4 text-sm leading-6 text-[#5b666d]">Qabulning joriy tafsilotlarini telefon orqali aniqlashtiring.</p>
            <a href={PHONE_HREF} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#19354d] hover:text-[#9d7335]"><Phone size={16} /> {PHONE}</a>
            <a href="#contact" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#19354d] hover:text-[#9d7335]"><MapPin size={16} className="text-[#9d7335]" /> Manzil va xarita</a>
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
              <p className="mb-3 text-xs font-bold uppercase text-[#9d7335]">Aloqa</p>
              <h2 className="font-['Source_Serif_4'] text-3xl font-semibold text-[#19354d] sm:text-4xl">Litsey manzili</h2>
            </div>
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#19354d] hover:text-[#9d7335]">
              Marshrut qurish <ExternalLink size={15} />
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 shrink-0 text-[#9d7335]" size={20} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">Manzil</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5b666d]">{ADDRESS}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-[#19354d]">
                    <a href={MAP_LINK} target="_blank" rel="noreferrer" className="hover:text-[#9d7335]">Google Maps</a>
                    <a href={YANDEX_LINK} target="_blank" rel="noreferrer" className="hover:text-[#9d7335]">Yandex Maps</a>
                    <a href={OSM_LINK} target="_blank" rel="noreferrer" className="hover:text-[#9d7335]">OpenStreetMap</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">Telefon</h3>
                  <a href={PHONE_HREF} className="mt-1 inline-block text-sm text-[#5b666d] hover:text-[#9d7335]">{PHONE}</a>
                  <p className="mt-1 text-xs text-[#707a7f]">Qabul va umumiy savollar bo‘yicha</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">Ish vaqti</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5b666d]">Dushanba–shanba</p>
                  <p className="mt-1 text-xs text-[#707a7f]">Bayram kunlari dam olish kuni</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Bus className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">Qanday yetib borish mumkin</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5b666d]">Chilonzor-9 mavzesi, 33-uy. Jamoat transportida mavzegacha yetib kelib, piyoda davom etish mumkin.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ExternalLink className="mt-1 shrink-0 text-[#9d7335]" size={19} />
                <div>
                  <h3 className="font-semibold text-[#19354d]">Ijtimoiy tarmoq</h3>
                  <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-[#5b666d] hover:text-[#9d7335]">Instagram sahifasi</a>
                </div>
              </div>
            </div>

            <div className="overflow-hidden border border-[#dfe3e4] bg-[#f2eee6]">
              <iframe
                title="S.H. Sirojiddinov akademik litseyi joylashuvi"
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
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="font-semibold text-[#19354d] hover:text-[#9d7335]">Xaritada ochish</a>
          </div>
        </div>
      </section>

      <section className="bg-[#eee6d8] py-14 sm:py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase text-[#9d7335]">Qabul bo‘yicha</p>
            <h2 className="font-['Source_Serif_4'] text-3xl font-semibold leading-tight text-[#19354d]">Joriy qabul shartlarini litseydan aniqlashtiring</h2>
            <p className="mt-3 text-sm leading-6 text-[#53616a]">Kvota, imtihon sanalari va hujjatlar ro‘yxati o‘quv yiliga qarab yangilanadi.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={PHONE_HREF} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#17344b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#244863]">
              <Phone size={17} /> {PHONE}
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 border border-[#19354d]/25 px-6 py-3 text-sm font-bold text-[#19354d] transition hover:bg-white/50">
              Instagram <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default LyceumHomePage;
