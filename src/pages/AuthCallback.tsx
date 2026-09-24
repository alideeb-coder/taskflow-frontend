import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  // حارس يضمن إن الـ effect ينفّذ مرة واحدة فقط
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = params.get('token');

    if (!token) {
      toast.error(t('toast.error'));
      navigate('/login', { replace: true });
      return;
    }

    (async () => {
      try {
        await login(token);
        toast.success(t('toast.loginSuccess'));
        window.history.replaceState({}, '', '/dashboard');
        navigate('/dashboard', { replace: true });
      } catch {
        toast.error(t('toast.error'));
        navigate('/login', { replace: true });
      }
    })();
  }, [params, navigate, login, t]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-brand-500" />
        <p className="text-slate-400">{t('common.loading')}</p>
      </motion.div>
    </div>
  );
}