import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Task, tasksApi } from '../lib/api';
import { Navbar } from '../components/Navbar';
import { TaskModal } from '../components/TaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Spinner } from '../components/Spinner';

type FilterType = 'all' | 'pending' | 'completed';

export default function Dashboard() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params: { status?: 0 | 1; search?: string; page?: number } = { page };
      if (filter === 'pending') params.status = 0;
      if (filter === 'completed') params.status = 1;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const { data } = await tasksApi.list(params);
      setTasks(data.data);
      setLastPage(data.last_page);
      setTotal(data.total);
    } catch {
      toast.error(t('toast.error'));
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch, page, t]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (data: {
    title: string;
    description: string;
    status: boolean;
  }) => {
    setSaving(true);
    try {
      if (editingTask) {
        await tasksApi.update(editingTask.id, data);
        toast.success(t('toast.taskUpdated'));
      } else {
        await tasksApi.create({
          title: data.title,
          description: data.description || undefined,
        });
        toast.success(t('toast.taskCreated'));
      }
      setModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error(t('toast.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await tasksApi.update(task.id, { status: !task.status });
      toast.success(t('toast.taskUpdated'));
      fetchTasks();
    } catch {
      toast.error(t('toast.error'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await tasksApi.remove(deleteTarget.id);
      toast.success(t('toast.taskDeleted'));
      setDeleteTarget(null);
      // If last item on page, go back
      if (tasks.length === 1 && page > 1) setPage(page - 1);
      else fetchTasks();
    } catch {
      toast.error(t('toast.error'));
    } finally {
      setDeleting(false);
    }
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('dashboard.filterAll') },
    { key: 'pending', label: t('dashboard.filterPending') },
    { key: 'completed', label: t('dashboard.filterCompleted') },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {t('dashboard.title')}
            </h1>
            <p className="mt-1 text-slate-400">{t('dashboard.subtitle')}</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
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
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t('dashboard.addTask')}
          </button>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 rtl:left-auto rtl:right-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('dashboard.search')}
              className="input-field pl-10 rtl:pl-4 rtl:pr-10"
            />
          </div>

          <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === f.key
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tasks list */}
        {loading ? (
          <Spinner />
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-3xl">
              📝
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              {debouncedSearch || filter !== 'all'
                ? t('dashboard.noResults')
                : t('dashboard.noTasks')}
            </h3>
            {!debouncedSearch && filter === 'all' && (
              <>
                <p className="mb-6 text-slate-400">
                  {t('dashboard.noTasksDesc')}
                </p>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setModalOpen(true);
                  }}
                  className="btn-primary"
                >
                  {t('dashboard.createFirst')}
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                    task.status
                      ? 'border-slate-800/60 bg-slate-900/40'
                      : 'border-slate-800 bg-slate-900/70 hover:border-brand-500/40 hover:bg-slate-900'
                  }`}
                >
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      task.status
                        ? 'border-green-500 bg-green-500'
                        : 'border-slate-600 hover:border-brand-500'
                    }`}
                    aria-label={
                      task.status
                        ? t('dashboard.markPending')
                        : t('dashboard.markComplete')
                    }
                  >
                    {task.status && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold ${
                        task.status
                          ? 'text-slate-500 line-through'
                          : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-slate-400">
                        {task.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-brand-400"
                      aria-label={t('dashboard.edit')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(task)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                      aria-label={t('dashboard.delete')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!loading && tasks.length > 0 && lastPage > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {total} {t('dashboard.totalTasks')}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary !px-4 !py-2 !text-sm disabled:opacity-40"
              >
                {t('dashboard.prev')}
              </button>
              <span className="text-sm text-slate-400">
                {t('dashboard.page')} {page} {t('dashboard.of')} {lastPage}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="btn-secondary !px-4 !py-2 !text-sm disabled:opacity-40"
              >
                {t('dashboard.next')}
              </button>
            </div>
          </div>
        )}
      </main>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('dashboard.confirmDeleteTitle')}
        message={t('dashboard.confirmDeleteMsg')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}