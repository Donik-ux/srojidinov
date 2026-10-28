// Фоллбэк-данные, копия текущего хардкода LyceumHomePage.jsx
// Используется если API недоступен или данные не загружены

import {
  Atom,
  BookOpen,
  Bus,
  CalendarDays,
  CheckCircle2,
  FileText,
  FlaskConical,
  GraduationCap,
  Landmark,
  Microscope,
  Phone,
  Sparkles,
  Users,
  TrendingUp,
} from 'lucide-react';

export const SITE_FALLBACK = {
  hero: {
    eyebrow: "O‘zbekiston Milliy universiteti qoshida",
    title: "S.H. Sirojiddinov nomidagi respublika akademik litseyi",
    subtitle: "Tabiiy va aniq fanlarga ixtisoslashgan, ilmiy izlanish va puxta ta’lim an’analariga tayangan maskan.",
    badges: [
      { icon: 'CalendarDays', text: '1970-yildan beri' },
      { icon: 'Atom', text: 'Aniq va tabiiy fanlar' },
      { icon: 'Landmark', text: 'O‘zMU qoshida' },
    ],
    buttons: [
      { text: "Ta’lim yo‘nalishlari", href: '#directions', variant: 'primary' },
      { text: "Qabul jarayoni", href: '#admissions', variant: 'secondary' },
      { text: "Bog‘lanish", href: '#contact', variant: 'ghost' },
    ],
    video: '/assets/videos/hero.mp4',
    poster: '/assets/videos/hero-poster.jpg',
    overlayLabel: 'Video',
  },
  stats: [
    { value: '1970', label: 'tashkil etilgan yil' },
    { value: '55+', label: 'yillik ta’lim an’anasi' },
    { value: '3', label: 'asosiy ta’lim yo‘nalishi' },
    { value: 'O‘zMU', label: 'qoshidagi akademik litsey' },
  ],
  advantages: [
    {
      icon: 'Landmark',
      title: "O‘zMU bilan uzviy aloqa",
      text: "Litsey O‘zbekiston Milliy universiteti qoshida faoliyat yuritadi. O‘quvchilar universitetning ilmiy va ta’lim muhitiga yaqindan tanishadi.",
    },
    {
      icon: 'BookOpen',
      title: "Chuqur fan tayyorgarligi",
      text: "Matematika, fizika, kimyo va biologiya fanlari chuqurlashtirilgan holda o‘qitiladi, amaliy mashg‘ulotlarga alohida e’tibor beriladi.",
    },
    {
      icon: 'Users',
      title: "Tajribali pedagogalar",
      text: "Malakali o‘qituvchilar har bir o‘quvchining qobiliyatiga mos yondashadi va mustaqil fikrlashni rag‘batlantiradi.",
    },
    {
      icon: 'FlaskConical',
      title: "Ilmiy va amaliy muhit",
      text: "Laboratoriya mashg‘ulotlari, fan to‘garaklari va ilmiy loyihalar o‘quvchilarda izlanish ko‘nikmalarini shakllantiradi.",
    },
  ],
  about: {
    eyebrow: "Biz haqimizda",
    title: "Ilmga mehr bilan boshlangan yo‘l",
    paragraphs: [
      "S.H. Sirojiddinov nomidagi respublika akademik litseyi O‘zbekiston Milliy universiteti qoshidagi ta’lim muassasasidir. Bugun litsey tabiiy va aniq fanlarga ixtisoslashgan ta’lim maskani sifatida tanilgan.",
      "Litsey o‘z tarixi davomida minglab bitiruvchilarga puxta bilim berib, ularning nufuzli oliy ta’lim muassasalarida tahsil olishiga zamin yaratgan. Asosiy maqsad — yoshlarda mustaqil fikrlash, izlanish va fanlarga samimiy qiziqishni shakllantirish.",
    ],
    linkText: "Rasmiy tarixni o‘qish",
    linkHref: "https://nuu.uz/s-h-sirojiddinov-nomidagi-akademik-litseyi/",
    image: "/assets/images/about-new-1.jpg",
  },
  milestones: [
    { year: '1970', text: 'Respublika maxsus maktab-internati sifatida tashkil etildi.' },
    { year: '1990', text: 'Muassasaga akademik S.H. Sirojiddinov nomi berildi.' },
    { year: '1998', text: 'Vazirlar Mahkamasi qarori bilan akademik litsey maqomi berildi.' },
    { year: 'Bugun', text: 'O‘zMU qoshidagi tabiiy va aniq fanlarga ixtisoslashgan litsey sifatida faoliyat yuritadi.' },
  ],
  directions: [
    {
      icon: 'Atom',
      title: 'Aniq fanlar',
      subjects: ['Matematika', 'Fizika'],
      text: 'Mantiqiy tafakkur, hisob-kitob va fizik hodisalarni chuqur o‘rganishga yo‘naltirilgan guruhlar.',
      fit: 'Matematika va fizikaga qiziqqan, aniq hisob-kitob bilan ishlashni yoqtirgan o‘quvchilar uchun.',
    },
    {
      icon: 'Microscope',
      title: 'Tabiiy fanlar',
      subjects: ['Kimyo', 'Biologiya'],
      text: 'Tirik organizmlar, moddalar tuzilishi va laboratoriya tadqiqotlariga asoslangan tayyorgarlik.',
      fit: 'Tabiat, tibbiyot va ekologiyaga qiziqqan o‘quvchilar uchun.',
    },
    {
      icon: 'TrendingUp',
      title: 'Iqtisod',
      subjects: ['Matematika', 'Ingliz tili'],
      text: 'Iqtisodiy tafakkur, moliyaviy savodxonlik va xalqaro muloqot ko‘nikmalarini rivojlantirishga qaratilgan guruhlar.',
      fit: 'Iqtisodiyot, biznes va xalqaro aloqalarga qiziqqan o‘quvchilar uchun.',
    },
  ],
  teachers: [
    { subject: 'Matematika', image: '/assets/Ustozlar/teacher-new-1.webp' },
    { subject: 'Fizika', image: '/assets/Ustozlar/teacher-new-2.webp' },
    { subject: 'Kimyo', image: '/assets/Ustozlar/teacher-new-3.webp' },
    { subject: 'Biologiya', image: '/assets/Ustozlar/teacher-new-4.webp' },
  ],
  admissionSteps: [
    { icon: 'Phone', title: 'Ma’lumot olish', text: 'Joriy qabul shartlari, kvota va imtihon sanalari bilan litsey telefon orqali tanishing.' },
    { icon: 'FileText', title: 'Hujjatlarni tayyorlash', text: 'Ariza, shaxsni tasdiqlovchi hujjat nusxasi, foto va maktab hujjatlarini yig‘ing.' },
    { icon: 'CheckCircle2', title: 'Ariza topshirish', text: 'Belgilangan muddatda hujjatlarni litsey qabul komissiyasiga topshiring.' },
    { icon: 'GraduationCap', title: 'Imtihon va suhbat', text: 'Yo‘nalish fanlaridan imtihon hamda suhbatdan muvaffaqiyatli o‘ting.' },
  ],
  documents: [
    'Ariza (litsey blankasida)',
    'Tug‘ilganlik haqida guvohnoma nusxasi',
    'Pasport yoki ID-karta nusxasi',
    '3x4 o‘lchamdagi foto (2 dona)',
    'Oldingi o‘quv yurtidan ma’lumotnoma',
  ],
  faqs: [
    ['Litsey qaysi oliygoh qoshida?', 'O‘zbekiston Milliy universiteti qoshidagi akademik litsey.'],
    ['Qachon tashkil etilgan?', 'Rasmiy tarix sahifasiga ko‘ra, muassasa 1970-yil 25-sentabrda Respublika maxsus maktab-internati sifatida tashkil etilgan.'],
    ['Qachon akademik litsey maqomini olgan?', 'Vazirlar Mahkamasi 1998-yil 24-fevralda maktab-internatga akademik litsey maqomini berish haqida qaror qabul qilgan.'],
    ['Qaysi fanlarga ixtisoslashgan?', 'Litsey tabiiy va aniq fanlarga ixtisoslashgan. Avvalgi qabul e’lonida aniq fanlar uchun matematika va fizika, tabiiy fanlar uchun kimyo va biologiya ko‘rsatilgan.'],
    ['Qabul uchun qanday hujjatlar kerak?', 'Ariza, tug‘ilganlik guvohnomasi va pasport nusxalari, 3x4 foto hamda oldingi o‘quv yurtidan ma’lumotnoma. Aniq ro‘yxatni litsey bilan aniqlashtiring.'],
    ['Litseyga qanday yetib borish mumkin?', 'Manzil: Chilonzor-9 mavzesi, 33-uy. Jamoat transportida Chilonzor-9 mavzesigacha yetib kelish mumkin.'],
    ['Joriy qabul kvotasi va imtihon sanalarini qayerdan bilish mumkin?', 'Bu ma’lumotlar o‘quv yiliga qarab yangilanadi. Litsey bilan telefon orqali bog‘lanib, joriy e’lonni tasdiqlang.'],
  ],
  contacts: {
    address: '100097, Toshkent shahri, Chilonzor tumani, Chilonzor-9 mavzesi, 33-uy',
    phone: '+998 71 278 43 58',
    phoneHref: 'tel:+998712784358',
    lat: '41.289371',
    lng: '69.1964656',
    instagram: 'https://www.instagram.com/sirojiddinov_academic_lyceum/',
    nuu: 'https://nuu.uz/s-h-sirojiddinov-nomidagi-akademik-litseyi/',
  },
};

export const ICON_MAP = {
  Atom,
  BookOpen,
  Bus,
  CalendarDays,
  CheckCircle2,
  FileText,
  FlaskConical,
  GraduationCap,
  Landmark,
  Microscope,
  Phone,
  Sparkles,
  Users,
  TrendingUp,
};
