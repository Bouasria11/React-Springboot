import { Film, LayoutDashboard, LogOut, Shield, Star, UserRound } from 'lucide-react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MovieDetailPage from './pages/MovieDetailPage.jsx';
import { useAuth } from './state/AuthContext.jsx';

export default function App() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-linen/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded bg-ink text-linen">
              <Film size={20} />
            </span>
            CineStack
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink className={navClass} to="/">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Films</span>
            </NavLink>
            {isAdmin && (
              <NavLink className={navClass} to="/admin">
                <Shield size={18} />
                <span className="hidden sm:inline">Admin</span>
              </NavLink>
            )}
            {user ? (
              <button onClick={logout} className="inline-flex h-10 items-center gap-2 rounded border border-ink/15 px-3 text-sm font-semibold">
                <LogOut size={18} />
                <span className="hidden sm:inline">Sortir</span>
              </button>
            ) : (
              <NavLink className={navClass} to="/login">
                <UserRound size={18} />
                <span className="hidden sm:inline">Connexion</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      <footer className="mx-auto flex max-w-7xl items-center gap-2 px-4 pb-8 text-sm text-ink/60">
        <Star size={16} className="text-ember" />
        API REST Spring Boot, SPA React, JWT, recommandations.
      </footer>
    </div>
  );
}

function navClass({ isActive }) {
  return `inline-flex h-10 items-center gap-2 rounded px-3 text-sm font-semibold ${isActive ? 'bg-ink text-linen' : 'border border-ink/15 text-ink'}`;
}
