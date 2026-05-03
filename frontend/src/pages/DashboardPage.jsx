import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import MovieCard from '../components/MovieCard.jsx';
import { useAuth } from '../state/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({ title: '', genre: '' });
  const [searchFilters, setSearchFilters] = useState({ title: '', genre: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams({ page, size: 8, sort: 'releaseDate,desc' });
    Object.entries(searchFilters).forEach(([key, value]) => value && params.set(key, value));
    api.get(`/api/movies?${params}`).then(({ data }) => {
      setMovies(data.content);
      setTotalPages(data.totalPages);
    });
  }, [searchFilters, page]);

  useEffect(() => {
    api.get('/api/genres').then(({ data }) => setGenres(data));
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/api/recommendations').then(({ data }) => setRecommended(data)).catch(() => setRecommended([]));
    }
  }, [user]);

  function submitSearch(event) {
    event.preventDefault();
    setPage(0);
    setSearchFilters(filters);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submitSearch} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" size={18} />
          <input className="h-11 w-full rounded border border-ink/15 pl-10 pr-3 outline-none focus:border-ember" placeholder="Rechercher un titre" value={filters.title} onChange={(event) => setFilters({ ...filters, title: event.target.value })} />
        </label>
        <select className="h-11 rounded border border-ink/15 px-3 outline-none focus:border-ember" value={filters.genre} onChange={(event) => setFilters({ ...filters, genre: event.target.value })}>
          <option value="">Tous les genres</option>
          {genres.map((genre) => <option key={genre.id} value={genre.name}>{genre.name}</option>)}
        </select>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded bg-ink px-4 font-black text-linen">
          <Search size={18} />
          Rechercher
        </button>
      </form>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} />
          <h1 className="text-xl font-black">Catalogue</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
        <div className="flex justify-center gap-2">
          <button className="h-10 rounded border border-ink/15 px-4 font-semibold disabled:opacity-40" disabled={page === 0} onClick={() => setPage(page - 1)}>Precedent</button>
          <span className="grid h-10 min-w-12 place-items-center rounded bg-ink px-3 text-sm font-black text-linen">{page + 1}/{Math.max(totalPages, 1)}</span>
          <button className="h-10 rounded border border-ink/15 px-4 font-semibold disabled:opacity-40" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Suivant</button>
        </div>
      </section>

      {recommended.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-ember" />
            <h1 className="text-xl font-black">Recommandes pour vous</h1>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.slice(0, 4).map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </section>
      )}
    </div>
  );
}
