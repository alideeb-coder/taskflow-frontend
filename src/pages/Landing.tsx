import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeroScene } from '../components/HeroScene';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const goToApp = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const features = [
    {
      title: t('landing.feature1Title'),
      desc: t('landing.feature1Desc'),
      icon: '⚡',
    },
    {
      title: t('landing.feature2Title'),
      desc: t('landing.feature2Desc'),
      icon: '🔒',
    },
    {
      title: t('landing.feature3Title'),
      desc: t('landing.feature3Desc'),
      icon: '🌍',
    },
    {
      title: t('landing.feature4Title'),
      desc: t('landing.feature4Desc'),
      icon: '✨',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <HeroScene />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-300 backdrop-blur"
          >
            {t('landing.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {t('landing.heroTitle')}{' '}
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.heroTitleAccent')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl"
          >
            {t('landing.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <button onClick={goToApp} className="btn-primary !px-8 !py-4 !text-base">
              {t('landing.getStarted')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <button onClick={goToApp} className="btn-secondary !px-8 !py-4 !text-base">
              {t('landing.addTask')}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid w-full max-w-3xl grid-cols-3 gap-4"
          >
            {[
              { value: '10k+', label: t('landing.stat1') },
              { value: '99.9%', label: t('landing.stat2') },
              { value: '4.9★', label: t('landing.stat3') },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur"
              >
                <div className="text-2xl font-extrabold text-white sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            {t('landing.featuresTitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            {t('landing.featuresSubtitle')}
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="card group cursor-default"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 text-2xl">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-600/20 via-purple-600/20 to-pink-600/20 p-12 text-center backdrop-blur"
        >
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500 blur-3xl" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {t('landing.ctaTitle')}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-slate-300">
            {t('landing.ctaSubtitle')}
          </p>
          <button onClick={goToApp} className="btn-primary !px-8 !py-4 !text-base">
            {t('landing.ctaButton')}
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} TaskFlow. Built with Ali Deeb
      </footer>
    </div>
  );
}