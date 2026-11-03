import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SeoHelmet from '../components/common/SeoHelmet';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  Lock,
  Phone,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { login, selectAuth, clearError } from '../features/auth/authSlice';
import PhoneInput from '../components/ui/PhoneInput';

const CAMPUS_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=85';

const inputClass =
  'w-full bg-white border border-[#d7cbb7] rounded-none pr-4 py-3.5 text-[#19354d] text-[15px] ' +
  'placeholder:text-[#9aa3a8] focus:outline-none focus:border-[#9d7335] focus:ring-2 focus:ring-[#9d7335]/15 transition-all';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(selectAuth);
  const location = useLocation();
  const [form, setForm] = useState({ phone: '', login: '', password: '' });
  const [mode, setMode] = useState('phone'); // 'phone' | 'login'
  const [showPass, setShowPass] = useState(false);
  const justSubmitted = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (justSubmitted.current) {
      justSubmitted.current = false;
      const from = location.state?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
      return;
    }
    navigate('/', { replace: true });
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'phone') {
      if (!form.phone || form.phone.replace(/\D/g, '').length < 12) {
        toast.error(t('loginPage.errPhone'));
        return;
      }
    } else {
      if (!form.login || form.login.trim().length < 3) {
        toast.error(t('loginPage.errLogin'));
        return;
      }
    }
    const identifier = mode === 'phone' ? form.phone : form.login.trim();
    justSubmitted.current = true;
    dispatch(login({ identifier, password: form.password }));
  };

  return (
    <>
      <SeoHelmet
        title={`${t('auth.signIn')} — S.H. Sirojiddinov akademik litseyi`}
        noindex
      />

      <div className="flex min-h-screen bg-[#f7f5ef]">
        {/* ════ LEFT — visual ════ */}
        <div className="relative hidden overflow-hidden bg-[#142f45] lg:flex lg:w-1/2">
          <img
            src={CAMPUS_IMAGE}
            alt="Litsey kampusi"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(13,34,52,.96)_0%,rgba(23,52,75,.88)_55%,rgba(13,34,52,.96)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(13,34,52,.75),transparent_55%)]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e5c98f 1px, transparent 0)', backgroundSize: '26px 26px' }}
          />

          <div className="relative z-10 flex flex-col justify-between p-12 text-white xl:p-16">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3" aria-label={t('lyceum.nav.homeLabel')}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d5ad68]/70 text-[#e2c37f]">
                  <BookOpen size={21} strokeWidth={1.7} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase leading-4 text-white/60">{t('lyceum.nav.university')}</span>
                  <span className="mt-0.5 block font-['Source_Serif_4'] text-base font-semibold leading-tight">{t('lyceum.nav.brand')}</span>
                </span>
              </Link>
            </div>

            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase text-white/70">
                  <span className="h-px w-9 bg-[#d5ad68]" />
                  {t('loginPage.brand')}
                </div>
                <h1 className="whitespace-pre-line font-['Source_Serif_4'] text-[42px] font-semibold leading-[1.08] text-white xl:text-[52px]">
                  {t('loginPage.heroTitle')}
                </h1>
                <p className="mt-6 max-w-md text-[15px] leading-7 text-white/75">
                  {t('loginPage.heroParagraph')}
                </p>

                <ul className="mt-8 space-y-3">
                  {[
                    t('registerPage.feature1'),
                    t('registerPage.feature2'),
                    t('registerPage.feature3'),
                    t('registerPage.feature4'),
                  ].map((txt, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3 text-[14px] text-white/85"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#d5ad68]/50 bg-[#d5ad68]/15">
                        <Check size={13} className="text-[#e5c98f]" strokeWidth={3} />
                      </span>
                      {txt}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs text-white/45">
              <span>© {new Date().getFullYear()} S.H. Sirojiddinov akademik litseyi</span>
              <a href="tel:+998712784358" className="inline-flex items-center gap-2 text-white/60 transition hover:text-[#e5c98f]">
                <Phone size={13} /> +998 71 278 43 58
              </a>
            </div>
          </div>
        </div>

        {/* ════ RIGHT — form ════ */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md border border-[#e5e9ea] bg-white p-6 shadow-sm sm:p-9"
          >
            <div className="mb-7 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#53616a] transition hover:text-[#9d7335]">
                <ArrowLeft size={16} /> {t('loginPage.backHome')}
              </Link>
            </div>

            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#9d7335]" />
              <span className="text-xs font-bold uppercase text-[#9d7335]">{t('loginPage.sectionLabel')}</span>
            </div>
            <h2 className="whitespace-pre-line font-['Source_Serif_4'] text-[32px] font-semibold leading-[1.12] text-[#19354d] sm:text-[38px]">
              {t('loginPage.formTitle')}
            </h2>
            <p className="mt-3 text-sm text-[#5b666d]">
              {t('loginPage.noAccount')}{' '}
              <Link to="/register" className="font-bold text-[#9d7335] hover:underline">{t('loginPage.signUp')}</Link>
            </p>

            {error && (
              <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Telefon / Login toggle */}
              <div className="grid grid-cols-2 gap-1 border border-[#d7cbb7] bg-[#f7f5ef] p-1">
                <button
                  type="button"
                  onClick={() => setMode('phone')}
                  className={`py-2.5 text-[13px] font-bold uppercase tracking-wide transition-all ${
                    mode === 'phone' ? 'bg-[#19354d] text-white' : 'text-[#5b666d] hover:text-[#19354d]'
                  }`}
                >
                  {t('loginPage.tabPhone')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`py-2.5 text-[13px] font-bold uppercase tracking-wide transition-all ${
                    mode === 'login' ? 'bg-[#19354d] text-white' : 'text-[#5b666d] hover:text-[#19354d]'
                  }`}
                >
                  {t('loginPage.tabLogin')}
                </button>
              </div>

              <div>
                {mode === 'phone' ? (
                  <>
                    <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-[#19354d]">
                      {t('loginPage.tabPhone')}
                    </label>
                    <PhoneInput
                      value={form.phone}
                      onChange={(v) => setForm(p => ({ ...p, phone: v }))}
                      prefixClassName="text-[#19354d]"
                      className={inputClass}
                    />
                  </>
                ) : (
                  <>
                    <label className="mb-2 block text-[13px] font-bold uppercase tracking-wide text-[#19354d]">
                      {t('loginPage.loginLabel')}
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d7335]" />
                      <input
                        type="text"
                        placeholder={t('loginPage.loginPlaceholder')}
                        value={form.login}
                        onChange={e => setForm(p => ({ ...p, login: e.target.value }))}
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[13px] font-bold uppercase tracking-wide text-[#19354d]">
                    {t('loginPage.passwordLabel')}
                  </label>
                  <a href="/login" className="text-[13px] font-semibold text-[#9d7335] hover:underline">
                    {t('loginPage.forgot')}
                  </a>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d7335]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                    className={`${inputClass} pl-12 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    aria-label={showPass ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa3a8] transition-colors hover:text-[#9d7335]"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 bg-[#d5ad68] px-6 py-4 text-sm font-bold text-[#172c3d] transition-all duration-200 hover:bg-[#e3c486] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#172c3d]/30 border-t-[#172c3d]" />
                    {t('loginPage.submitting')}
                  </>
                ) : (
                  <>{t('loginPage.submit')} <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#e5e9ea] pt-5 text-xs text-[#7b858a]">
              <span>{t('loginPage.needHelp')}</span>
              <a href="tel:+998712784358" className="inline-flex items-center gap-1.5 font-semibold text-[#19354d] transition hover:text-[#9d7335]">
                <Phone size={13} /> +998 71 278 43 58
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
