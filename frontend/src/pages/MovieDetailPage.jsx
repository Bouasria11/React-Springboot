import { MessageSquare, Play, Send, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';

export default function MovieDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });

  async function load() {
    // Recupere le film et ses avis ensemble pour afficher une page coherente apres publication.
    const [movieResponse, reviewResponse] = await Promise.all([
      api.get(`/api/movies/${id}`),
      api.get(`/api/movies/${id}/reviews`),
    ]);
    setMovie(movieResponse.data);
    setReviews(reviewResponse.data);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function submitReview(event) {
    event.preventDefault();
    // Apres l'envoi, on recharge les donnees pour mettre a jour le score calcule cote backend.
    await api.post(`/api/movies/${id}/reviews`, form);
    setForm({ rating: 5, comment: '' });
    load();
  }

  if (!movie) {
    return <div className="rounded-lg border border-ink/10 bg-white p-8 text-center font-semibold shadow-soft">Chargement...</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <aside className="space-y-4">
        <img src={movie.posterUrl} alt={movie.title} className="aspect-[2/3] w-full rounded-lg object-cover shadow-soft" />
        {movie.trailerUrl && (
          <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded bg-ember font-black text-white">
            <Play size={18} fill="currentColor" />
            Bande-annonce
          </a>
        )}
      </aside>
      <section className="space-y-6">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black leading-tight">{movie.title}</h1>
              <p className="mt-1 text-ink/60">{movie.releaseDate}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded bg-ember/10 px-3 py-2 font-black text-ember">
              <Star size={18} fill="currentColor" />
              {movie.weightedScore} ({movie.reviewCount})
            </span>
          </div>
          <p className="text-ink/75">{movie.synopsis}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.genres.map((genre) => <span key={genre.id} className="rounded bg-moss/10 px-3 py-1 text-sm font-bold text-moss">{genre.name}</span>)}
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare size={20} />
            <h2 className="text-xl font-black">Avis</h2>
          </div>
          {user ? (
            <form onSubmit={submitReview} className="mb-5 grid gap-3 sm:grid-cols-[120px_1fr_auto]">
              <select className="h-11 rounded border border-ink/15 px-3" value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}/5</option>)}
              </select>
              <input className="h-11 rounded border border-ink/15 px-3" placeholder="Votre commentaire" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} />
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded bg-ink px-4 font-black text-linen">
                <Send size={17} />
                Publier
              </button>
            </form>
          ) : (
            <Link to="/login" className="mb-5 inline-flex h-11 items-center rounded bg-ink px-4 font-black text-linen">Se connecter pour noter</Link>
          )}
          <div className="space-y-3">
            {reviews.map((review) => (
              <article key={review.id} className="rounded border border-ink/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <strong>{review.username}</strong>
                  <span className="font-black text-ember">{review.rating}/5</span>
                </div>
                <p className="mt-1 text-sm text-ink/70">{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
