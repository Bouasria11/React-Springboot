import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('cinestack_user');
  if (raw) {
    const user = JSON.parse(raw);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});
