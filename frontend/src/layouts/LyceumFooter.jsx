import { useTranslation } from 'react-i18next';
import { BookOpen, ExternalLink, MapPin, Phone } from 'lucide-react';
import useSiteContent from '../hooks/useSiteContent';

const API_URL = import.meta.env.VITE_API_URL || '';
const mediaSrc = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};

const LyceumFooter = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : i18n.language?.startsWith('en') ? 'en' : 'uz';
  const { overrides, settings } = useSiteContent(lang);
  const site = overrides?.site || {};
  const logo = site.logo || settings.logo || '';
  const brand = site.brand || t('lyceum.nav.brand');
  const university = site.university || t('lyceum.nav.university');
  const description = site.footerDescription || settings.footerDescription || t('lyceum.footer.description');
  const phone = site.phone || settings.phone || '+998 71 278 43 58';
  const phoneHref = site.phoneHref || settings.phoneHref || `tel:${String(phone).replace(/[^+\d]/g, '')}`;
  const instagram = site.instagram || settings.instagram || 'https://www.instagram.com/sirojiddinov_academic_lyceum/';
  const address = site.address || settings.address || t('lyceum.footer.address');
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <footer className="bg-[#142f45] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-10 md:grid-cols-[1.2fr_0.8fr] lg:px-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#d5ad68]/70 text-[#e2c37f]">
              {logo ? <img src={mediaSrc(logo)} alt={brand} className="h-full w-full object-contain" /> : <BookOpen size={21} strokeWidth={1.7} />}
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase text-white/60">{university}</p>
              <p className="mt-1 font-['Source_Serif_4'] text-lg font-semibold">{brand}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/65">
            {description}
          </p>
        </div>

        <div className="grid gap-5 text-sm text-white/80 sm:grid-cols-2">
          <a href={phoneHref} className="flex items-start gap-3 transition hover:text-[#e2c37f]">
            <Phone size={17} className="mt-0.5 shrink-0 text-[#d5ad68]" />
            <span>{phone}</span>
          </a>
          <a href={instagram} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-[#e2c37f]">
            <ExternalLink size={17} className="mt-0.5 shrink-0 text-[#d5ad68]" />
            <span>{t('lyceum.footer.instagramText')}</span>
          </a>
          <a href={mapUrl} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-[#e2c37f] sm:col-span-2">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[#d5ad68]" />
            <span>{address}</span>
          </a>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <span>{brand}</span>
          <a href="https://nuu.uz/s-h-sirojiddinov-nomidagi-akademik-litseyi/" target="_blank" rel="noreferrer" className="hover:text-white/80">{t('lyceum.footer.universityLink')}</a>
        </div>
      </div>
    </footer>
  );
};

export default LyceumFooter;
