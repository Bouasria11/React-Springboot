import { Crown, Film, Pencil, Plus, Tags, Trash2, UserCog, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';

const emptyMovie = { title: '', synopsis: '', releaseDate: '', posterUrl: '', trailerUrl: '', genres: '' };

// Tableau de bord d'administration: films, utilisateurs, genres et moderation des avis.
export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(emptyMovie);
  const [genreForm, setGenreForm] = useState({ id: null, name: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAll();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="rounded-lg border border-ink/10 bg-white p-8 text-center font-black shadow-soft">Acces admin requis.</div>;
  }

  async function loadAll() {
    // Charge les donnees en parallele pour garder l'interface admin reactive.
    await Promise.all([loadMovies(), loadUsers(), loadGenres(), loadReviews()]);
  }

  async function loadMovies() {
    const { data } = await api.get('/api/movies?size=50&sort=title,asc');
    setMovies(data.content);
  }

  async function loadUsers() {
    const { data } = await api.get('/api/admin/users');
    setUsers(data);
  }

  async function loadGenres() {
    const { data } = await api.get('/api/genres');
    setGenres(data);
  }

  async function loadReviews() {
    const { data } = await api.get('/api/admin/reviews');
    setReviews(data);
  }

  async function run(action, success) {
    // Encapsule les actions admin pour afficher un message uniforme en succes ou erreur.
    try {
      setMessage('');
      await action();
      setMessage(success);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Action impossible.');
    }
  }

  async function saveMovie(event) {
    event.preventDefault();
    // L'API attend un tableau de genres; le formulaire les saisit sous forme de liste texte.
    const payload = { ...form, genres: form.genres.split(',').map((value) => value.trim()).filter(Boolean) };
    await run(async () => {
      if (editingId) {
        await api.put(`/api/movies/${editingId}`, payload);
      } else {
        await api.post('/api/movies', payload);
      }
      setForm(emptyMovie);
      setEditingId(null);
      await Promise.all([loadMovies(), loadGenres()]);
    }, 'Film enregistre.');
  }

  function editMovie(movie) {
    setEditingId(movie.id);
    setForm({ ...movie, genres: movie.genres.map((genre) => genre.name).join(', ') });
  }

  async function removeMovie(id) {
    await run(async () => {
      await api.delete(`/api/movies/${id}`);
      await Promise.all([loadMovies(), loadReviews()]);
    }, 'Film supprime.');
  }

  async function saveGenre(event) {
    event.preventDefault();
    await run(async () => {
      const payload = { name: genreForm.name };
      if (genreForm.id) {
        await api.put(`/api/admin/genres/${genreForm.id}`, payload);
      } else {
        await api.post('/api/admin/genres', payload);
      }
      setGenreForm({ id: null, name: '' });
      await Promise.all([loadGenres(), loadMovies()]);
    }, 'Genre enregistre.');
  }

  async function removeGenre(id) {
    await run(async () => {
      await api.delete(`/api/admin/genres/${id}`);
      await Promise.all([loadGenres(), loadMovies()]);
    }, 'Genre supprime.');
  }

  async function setAdminRole(targetUser, admin) {
    await run(async () => {
      await api.put(`/api/admin/users/${targetUser.id}/admin`, { admin });
      await loadUsers();
    }, admin ? 'Administrateur ajoute.' : 'Administrateur retire.');
  }

  async function removeUser(id) {
    await run(async () => {
      await api.delete(`/api/admin/users/${id}`);
      await Promise.all([loadUsers(), loadReviews()]);
    }, 'Utilisateur supprime.');
  }

  async function removeReview(id) {
    await run(async () => {
      await api.delete(`/api/admin/reviews/${id}`);
      await Promise.all([loadReviews(), loadMovies()]);
    }, 'Avis supprime.');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <TabButton active={activeTab === 'movies'} icon={<Film size={17} />} onClick={() => setActiveTab('movies')}>Films</TabButton>
        <TabButton active={activeTab === 'users'} icon={<UserCog size={17} />} onClick={() => setActiveTab('users')}>Utilisateurs</TabButton>
        <TabButton active={activeTab === 'genres'} icon={<Tags size={17} />} onClick={() => setActiveTab('genres')}>Genres</TabButton>
        <TabButton active={activeTab === 'reviews'} icon={<MessageSquare size={17} />} onClick={() => setActiveTab('reviews')}>Avis</TabButton>
      </div>

      {message && <div className="rounded border border-ink/10 bg-white px-4 py-3 text-sm font-semibold shadow-soft">{message}</div>}

      {activeTab === 'movies' && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={saveMovie} className="space-y-3 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h1 className="text-xl font-black">{editingId ? 'Modifier un film' : 'Ajouter un film'}</h1>
            {['title', 'posterUrl', 'trailerUrl'].map((field) => (
              <input key={field} className="h-11 w-full rounded border border-ink/15 px-3" placeholder={field} value={form[field] ?? ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
            ))}
            <input className="h-11 w-full rounded border border-ink/15 px-3" type="date" value={form.releaseDate ?? ''} onChange={(event) => setForm({ ...form, releaseDate: event.target.value })} />
            <input className="h-11 w-full rounded border border-ink/15 px-3" placeholder="Genres separes par virgule" value={form.genres ?? ''} onChange={(event) => setForm({ ...form, genres: event.target.value })} />
            <textarea className="min-h-28 w-full rounded border border-ink/15 p-3" placeholder="Synopsis" value={form.synopsis ?? ''} onChange={(event) => setForm({ ...form, synopsis: event.target.value })} />
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-ink font-black text-linen">
              <Plus size={18} />
              Enregistrer
            </button>
          </form>

          <section className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
            <MovieTable movies={movies} onEdit={editMovie} onRemove={removeMovie} />
          </section>
        </div>
      )}

      {activeTab === 'users' && (
        <section className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-ink text-linen">
              <tr>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((account) => {
                const admin = account.roles.includes('ROLE_ADMIN');
                const self = account.id === user?.id;
                return (
                  <tr key={account.id} className="border-t border-ink/10">
                    <td className="p-3 font-bold">{account.username}</td>
                    <td className="p-3">{account.email}</td>
                    <td className="p-3">{admin ? 'Administrateur' : 'Utilisateur'}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" disabled={self && admin} className="inline-flex h-9 items-center gap-2 rounded border border-ink/15 px-3 disabled:opacity-40" onClick={() => setAdminRole(account, !admin)}>
                          <Crown size={15} />
                          {admin ? 'Retirer' : 'Rendre admin'}
                        </button>
                        <button type="button" disabled={self} className="grid h-9 w-9 place-items-center rounded bg-ember text-white disabled:opacity-40" onClick={() => removeUser(account.id)} title="Supprimer"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'genres' && (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={saveGenre} className="space-y-3 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h1 className="text-xl font-black">{genreForm.id ? 'Modifier un genre' : 'Ajouter un genre'}</h1>
            <input className="h-11 w-full rounded border border-ink/15 px-3" placeholder="Nom du genre" value={genreForm.name} onChange={(event) => setGenreForm({ ...genreForm, name: event.target.value })} />
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-ink font-black text-linen">
              <Plus size={18} />
              Enregistrer
            </button>
          </form>

          <section className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-ink text-linen">
                <tr>
                  <th className="p-3">Genre</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre) => (
                  <tr key={genre.id} className="border-t border-ink/10">
                    <td className="p-3 font-bold">{genre.name}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="grid h-9 w-9 place-items-center rounded border border-ink/15" onClick={() => setGenreForm(genre)} title="Modifier"><Pencil size={16} /></button>
                        <button type="button" className="grid h-9 w-9 place-items-center rounded bg-ember text-white" onClick={() => removeGenre(genre.id)} title="Supprimer"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}

      {activeTab === 'reviews' && (
        <section className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-ink text-linen">
              <tr>
                <th className="p-3">Film</th>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Note</th>
                <th className="p-3">Commentaire</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-t border-ink/10 align-top">
                  <td className="p-3 font-bold">{review.movieTitle}</td>
                  <td className="p-3">{review.username}</td>
                  <td className="p-3 font-black text-ember">{review.rating}/5</td>
                  <td className="max-w-xl p-3 text-ink/70">{review.comment || '-'}</td>
                  <td className="p-3">
                    <div className="flex justify-end">
                      <button type="button" className="grid h-9 w-9 place-items-center rounded bg-ember text-white" onClick={() => removeReview(review.id)} title="Supprimer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function TabButton({ active, icon, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex h-10 items-center gap-2 rounded px-3 text-sm font-semibold ${active ? 'bg-ink text-linen' : 'border border-ink/15 bg-white text-ink'}`}>
      {icon}
      {children}
    </button>
  );
}

function MovieTable({ movies, onEdit, onRemove }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead className="bg-ink text-linen">
        <tr>
          <th className="p-3">Titre</th>
          <th className="p-3">Date</th>
          <th className="p-3">Score</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie) => (
          <tr key={movie.id} className="border-t border-ink/10">
            <td className="p-3 font-bold">{movie.title}</td>
            <td className="p-3">{movie.releaseDate}</td>
            <td className="p-3">{movie.weightedScore}</td>
            <td className="p-3">
              <div className="flex justify-end gap-2">
                <button type="button" className="grid h-9 w-9 place-items-center rounded border border-ink/15" onClick={() => onEdit(movie)} title="Modifier"><Pencil size={16} /></button>
                <button type="button" className="grid h-9 w-9 place-items-center rounded bg-ember text-white" onClick={() => onRemove(movie.id)} title="Supprimer"><Trash2 size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
