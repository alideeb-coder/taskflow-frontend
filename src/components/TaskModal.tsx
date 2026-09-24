import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Task } from '../lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; status: boolean }) => void;
  task?: Task | null;
  loading?: boolean;
}

export function TaskModal({ open, onClose, onSubmit, task, loading }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setStatus(task?.status || false);
      setError('');
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('common.required'));
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), status });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            <h2 className="mb-5 text-xl font-bold text-white">
              {task ? t('dashboard.update') : t('dashboard.create')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t('dashboard.taskTitle')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  className={`input-field ${error ? 'border-red-500' : ''}`}
                  placeholder={t('dashboard.taskTitle')}
                  autoFocus
                />
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t('dashboard.taskDescription')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder={t('dashboard.taskDescription')}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="status"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-brand-500"
                />
                <label htmlFor="status" className="text-sm text-slate-300">
                  {t('dashboard.completed')}
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  {t('dashboard.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('dashboard.save')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}