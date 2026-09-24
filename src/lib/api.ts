import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'taskflow_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Don't redirect if it's a login/register attempt
      const url = error.config?.url || '';
      if (!url.includes('/login') && !url.includes('/register')) {
        localStorage.removeItem(TOKEN_KEY);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface LaravelError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth API
export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => api.post<{ token: string }>('/register', payload),

  login: (payload: { email: string; password: string }) =>
    api.post<{ token: string }>('/login', payload),

  logout: () => api.post('/logout'),

  me: () => api.get<User>('/user'),
};

// Tasks API
export const tasksApi = {
  list: (params?: { status?: 0 | 1; search?: string; page?: number }) =>
    api.get<Paginated<Task>>('/tasks', { params }),

  get: (id: number) => api.get<Task>(`/tasks/${id}`),

  create: (payload: { title: string; description?: string }) =>
    api.post<Task>('/tasks', payload),

  update: (
    id: number,
    payload: { title?: string; description?: string; status?: boolean }
  ) => api.put<Task>(`/tasks/${id}`, payload),

  remove: (id: number) => api.delete(`/tasks/${id}`),
};

// Helper to extract Laravel errors
export function parseLaravelError(err: unknown): LaravelError {
  const axiosErr = err as AxiosError<LaravelError>;
  if (axiosErr.response?.data) return axiosErr.response.data;
  return { message: 'Something went wrong' };
}
// Helper للـ OAuth URLs
export const apiUrl = (path: string) => {
  const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  return `${base}${path}`;
};