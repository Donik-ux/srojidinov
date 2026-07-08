const LOCALE_STRINGS = {
  uz: {
    justNow: 'hozirgina',
    minuteAgo: '1 daqiqa oldin',
    minutesAgo: (n) => `${n} daqiqa oldin`,
    hourAgo: '1 soat oldin',
    hoursAgo: (n) => `${n} soat oldin`,
    yesterday: 'kecha',
    daysAgo: (n) => `${n} kun oldin`,
    weeksAgo: (n) => `${n} hafta oldin`,
    monthsAgo: (n) => `${n} oy oldin`,
    yearsAgo: (n) => `${n} yil oldin`,
  },
  ru: {
    justNow: 'только что',
    minuteAgo: '1 минуту назад',
    minutesAgo: (n) => `${n} минут назад`,
    hourAgo: '1 час назад',
    hoursAgo: (n) => `${n} часов назад`,
    yesterday: 'вчера',
    daysAgo: (n) => `${n} дней назад`,
    weeksAgo: (n) => `${n} недель назад`,
    monthsAgo: (n) => `${n} месяцев назад`,
    yearsAgo: (n) => `${n} лет назад`,
  },
  en: {
    justNow: 'just now',
    minuteAgo: '1 minute ago',
    minutesAgo: (n) => `${n} minutes ago`,
    hourAgo: '1 hour ago',
    hoursAgo: (n) => `${n} hours ago`,
    yesterday: 'yesterday',
    daysAgo: (n) => `${n} days ago`,
    weeksAgo: (n) => `${n} weeks ago`,
    monthsAgo: (n) => `${n} months ago`,
    yearsAgo: (n) => `${n} years ago`,
  },
};

export const timeAgo = (date, locale = 'uz') => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';

  const L = LOCALE_STRINGS[locale] || LOCALE_STRINGS.uz;

  const diffMs   = Date.now() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs  = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs  / 24);
  const diffWks  = Math.floor(diffDays / 7);
  const diffMons = Math.floor(diffDays / 30);
  const diffYrs  = Math.floor(diffDays / 365);

  if (diffSecs < 60)   return L.justNow;
  if (diffMins === 1)  return L.minuteAgo;
  if (diffMins < 60)   return L.minutesAgo(diffMins);
  if (diffHrs  === 1)  return L.hourAgo;
  if (diffHrs  < 24)   return L.hoursAgo(diffHrs);
  if (diffDays === 1)  return L.yesterday;
  if (diffDays < 7)    return L.daysAgo(diffDays);
  if (diffWks  < 5)    return L.weeksAgo(diffWks);
  if (diffMons < 12)   return L.monthsAgo(diffMons);
  return L.yearsAgo(diffYrs);
};

export const formatDate = (date, locale = 'uz-UZ') => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
};
