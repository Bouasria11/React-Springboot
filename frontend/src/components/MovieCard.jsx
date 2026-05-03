import { Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="group overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft transition hover:-translate-y-1">
      <div className="aspect-[2/3] bg-ink/10">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm font-semibold text-ink/50">{movie.title}</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h2 className="text-base font-black leading-tight">{movie.title}</h2>
          <div className="mt-1 flex items-center gap-2 text-sm text-ink/60">
            <Calendar size={15} />
            {movie.releaseDate || 'Date inconnue'}
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-ink/70">{movie.synopsis}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {movie.genres?.slice(0, 2).map((genre) => (
              <span key={genre.id ?? genre.name} className="rounded bg-moss/10 px-2 py-1 text-xs font-bold text-moss">{genre.name}</span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 rounded bg-ember/10 px-2 py-1 text-sm font-black text-ember">
            <Star size={15} fill="currentColor" />
            {movie.weightedScore}
          </span>
        </div>
      </div>
    </Link>
  );
}
