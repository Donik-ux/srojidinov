import { useTranslation } from 'react-i18next';
import { BookOpen, ExternalLink, MapPin, Phone } from 'lucide-react';

const LyceumFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#142f45] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-10 md:grid-cols-[1.2fr_0.8fr] lg:px-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d5ad68]/70 text-[#e2c37f]">
              <BookOpen size={21} strokeWidth={1.7} />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase text-white/60">{t('lyceum.nav.university')}</p>
              <p className="mt-1 font-['Source_Serif_4'] text-lg font-semibold">{t('lyceum.nav.brand')}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/65">
            {t('lyceum.footer.description')}
          </p>
        </div>

        <div className="grid gap-5 text-sm text-white/80 sm:grid-cols-2">
          <a href="tel:+998712784358" className="flex items-start gap-3 transition hover:text-[#e2c37f]">
            <Phone size={17} className="mt-0.5 shrink-0 text-[#d5ad68]" />
            <span>+998 71 278 43 58</span>
          </a>
          <a href="https://www.instagram.com/sirojiddinov_academic_lyceum/" target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-[#e2c37f]">
            <ExternalLink size={17} className="mt-0.5 shrink-0 text-[#d5ad68]" />
            <span>{t('lyceum.footer.instagramText')}</span>
          </a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=41.289371,69.1964656" target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-[#e2c37f] sm:col-span-2">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[#d5ad68]" />
            <span>{t('lyceum.footer.address')}</span>
          </a>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <span>{t('lyceum.nav.brand')}</span>
          <a href="https://nuu.uz/s-h-sirojiddinov-nomidagi-akademik-litseyi/" target="_blank" rel="noreferrer" className="hover:text-white/80">{t('lyceum.footer.universityLink')}</a>
        </div>
      </div>
    </footer>
  );
};

export default LyceumFooter;
