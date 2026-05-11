import { AlertCircle, CheckCircle2, KeyRound, UserPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigationTimer = useRef(null);

  // Nettoie le timer si l'utilisateur quitte la page avant la redirection.
  useEffect(() => () => clearTimeout(navigationTimer.current), []);

  async function submit(event) {
    event.preventDefault();
    // Le meme formulaire bascule entre connexion et inscription selon le mode choisi.
    setToast(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(form.username, form.password);
      } else {
        await register(form);
      }
      setToast({
        type: 'success',
        text: mode === 'login' ? 'Connexion reussie.' : 'Compte cree avec succes.',
      });
      navigationTimer.current = setTimeout(() => navigate('/'), 700);
    } catch (error) {
      setToast({
        type: 'error',
        text: error.response?.data?.detail || 'Identifiants ou donnees invalides.',
      });
      setSubmitting(false);
    }
  }

  return (
    <>
      {toast && <AuthToast toast={toast} onClose={() => setToast(null)} />}

      <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <div className="mb-5 grid grid-cols-2 rounded border border-ink/15 p-1">
          <button type="button" className={`h-10 rounded font-black ${mode === 'login' ? 'bg-ink text-linen' : ''}`} onClick={() => setMode('login')}>Connexion</button>
          <button type="button" className={`h-10 rounded font-black ${mode === 'register' ? 'bg-ink text-linen' : ''}`} onClick={() => setMode('register')}>Inscription</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="h-11 w-full rounded border border-ink/15 px-3" placeholder="Nom utilisateur" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          {mode === 'register' && (
            <input className="h-11 w-full rounded border border-ink/15 px-3" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          )}
          <input className="h-11 w-full rounded border border-ink/15 px-3" placeholder="Mot de passe" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <button disabled={submitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-ember font-black text-white disabled:opacity-60">
            {mode === 'login' ? <KeyRound size={18} /> : <UserPlus size={18} />}
            {submitting ? 'Veuillez patienter...' : mode === 'login' ? 'Entrer' : 'Creer le compte'}
          </button>
        </form>
        <p className="mt-4 text-sm text-ink/60">Demo: demo/demo12345 ou admin/admin12345.</p>
      </div>
    </>
  );
}

function AuthToast({ toast, onClose }) {
  const success = toast.type === 'success';

  // Toast local a la page, utilise pour confirmer l'authentification avant la redirection.
  return (
    <div className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-start gap-3">
        {success ? <CheckCircle2 className="mt-0.5 text-moss" size={20} /> : <AlertCircle className="mt-0.5 text-ember" size={20} />}
        <p className="flex-1 text-sm font-semibold text-ink">{toast.text}</p>
        <button type="button" className="grid h-7 w-7 place-items-center rounded border border-ink/10 text-ink/60" onClick={onClose} aria-label="Fermer">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
