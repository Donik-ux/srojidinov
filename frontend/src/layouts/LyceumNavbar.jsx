import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronDown, Menu, Phone, X } from 'lucide-react';

const links = [
  { href: '/#about', label: 'Litsey haqida' },
  { href: '/#advantages', label: 'Afzalliklar' },
  { href: '/#directions', label: 'Yo‘nalishlar' },
  { href: '/#teachers', label: 'Ustozlar' },
  { href: '/#admissions', label: 'Qabul' },
  { href: '/#questions', label: 'Savol-javob' },
  { href: '/#contact', label: 'Aloqa' },
];

const LyceumNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-[#142f45] text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 sm:px-10 lg:px-16">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Litsey bosh sahifasi">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d5ad68]/70 text-[#e2c37f]">
              <BookOpen size={23} strokeWidth={1.7} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-semibold uppercase leading-4 text-white/65 sm:text-xs">O‘zbekiston Milliy universiteti qoshida</span>
              <span className="mt-1 block font-['Source_Serif_4'] text-base font-semibold leading-tight sm:text-xl">S.H. Sirojiddinov akademik litseyi</span>
            </span>
          </Link>

          <div className="hidden max-w-[330px] items-center gap-3 border-l border-white/20 pl-6 text-sm leading-6 text-white/75 xl:flex">
            <span className="h-8 w-px bg-[#d5ad68]" />
            <span>Ilm, izlanish va kelajak sari</span>
          </div>

          <a href="tel:+998712784358" className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-[#e2c37f] md:flex">
            <Phone size={16} className="text-[#d5ad68]" />
            +998 71 278 43 58
          </a>
          <button
            type="button"
            aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 text-white transition hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <nav aria-label="Asosiy navigatsiya" className="border-b border-[#d7cbb7] bg-[#eee6d8]">
        <div className="mx-auto flex min-h-12 max-w-[1440px] items-center justify-between px-5 sm:px-10 lg:px-16">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="lyceum-menu"
            onClick={() => setMenuOpen(open => !open)}
            className="hidden items-center gap-2 py-3 text-xs font-bold uppercase text-[#19354d] hover:text-[#9d7335] lg:flex"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
            Menyu
          </button>
          <div className="hidden items-center gap-1 lg:flex">
            {links.map(({ href, label }) => (
              <a key={href} href={href} className="px-4 py-3 text-sm font-semibold text-[#344c5c] transition hover:text-[#9d7335]">{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="#admissions" className="inline-flex items-center gap-2 py-3 text-xs font-bold uppercase text-[#19354d] transition hover:text-[#9d7335]">
              Qabul haqida <ChevronDown size={15} />
            </a>
            <Link to="/register" className="inline-flex min-h-9 items-center bg-[#d5ad68] px-3 text-xs font-bold text-[#172c3d] transition hover:bg-[#e3c486] sm:px-4 sm:text-sm">
              Ro‘yxatdan o‘tish
            </Link>
          </div>
        </div>
        {menuOpen && (
          <div id="lyceum-menu" className="border-t border-[#d7cbb7] bg-white lg:absolute lg:left-0 lg:right-0 lg:shadow-lg">
            <div className="mx-auto grid max-w-[1440px] gap-1 px-5 py-4 sm:grid-cols-2 sm:px-10 lg:grid-cols-5 lg:px-16">
              {links.map(({ href, label }) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm font-semibold text-[#19354d] transition hover:bg-[#f4f0e8] hover:text-[#9d7335]">{label}</a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LyceumNavbar;