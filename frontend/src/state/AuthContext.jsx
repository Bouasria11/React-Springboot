import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('cinestack_user');
    return raw ? JSON.parse(raw) : null;
  });

  async function login(username, password) {
    const { data } = await api.post('/api/auth/login', { username, password });
    localStorage.setItem('cinestack_user', JSON.stringify(data));
    setUser(data);
  }

  async function register(payload) {
    const { data } = await api.post('/api/auth/register', payload);
    localStorage.setItem('cinestack_user', JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem('cinestack_user');
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    isAdmin: user?.roles?.includes('ROLE_ADMIN') ?? false,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
