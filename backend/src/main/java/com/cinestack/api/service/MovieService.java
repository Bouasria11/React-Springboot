package com.cinestack.api.service;

import static com.cinestack.api.movie.MovieSpecifications.hasGenre;
import static com.cinestack.api.movie.MovieSpecifications.releasedAfter;
import static com.cinestack.api.movie.MovieSpecifications.titleContains;

import com.cinestack.api.domain.Genre;
import com.cinestack.api.domain.Movie;
import com.cinestack.api.dto.MovieDtos.GenreResponse;
import com.cinestack.api.dto.MovieDtos.MovieRequest;
import com.cinestack.api.dto.MovieDtos.MovieResponse;
import com.cinestack.api.repository.GenreRepository;
import com.cinestack.api.repository.MovieRepository;
import com.cinestack.api.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MovieService {
    // Constantes du score bayesien: elles evitent qu'un film avec peu d'avis domine trop vite.
    private static final double GLOBAL_AVERAGE = 3.5;
    private static final int MINIMUM_VOTES = 10;

    private final MovieRepository movies;
    private final GenreRepository genres;
    private final ReviewRepository reviews;

    public MovieService(MovieRepository movies, GenreRepository genres, ReviewRepository reviews) {
        this.movies = movies;
        this.genres = genres;
        this.reviews = reviews;
    }

    @Transactional(readOnly = true)
    public Page<MovieResponse> search(String title, String genre, LocalDate releasedAfter, Pageable pageable) {
        // Combine les filtres optionnels sous forme de Specifications JPA.
        Specification<Movie> spec = Specification.where(titleContains(title))
                .and(hasGenre(genre))
                .and(releasedAfter(releasedAfter));
        return movies.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public MovieResponse get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public MovieResponse create(MovieRequest request) {
        Movie movie = new Movie();
        apply(movie, request);
        return toResponse(movies.save(movie));
    }

    @Transactional
    public MovieResponse update(Long id, MovieRequest request) {
        Movie movie = find(id);
        apply(movie, request);
        return toResponse(movie);
    }

    @Transactional
    public void delete(Long id) {
        movies.delete(find(id));
    }

    @Transactional(readOnly = true)
    public java.util.List<MovieResponse> topRated() {
        // Le classement public se base sur le score pondere plutot que sur la moyenne brute.
        return movies.findAll().stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(MovieResponse::weightedScore).reversed())
                .limit(12)
                .toList();
    }

    Movie find(Long id) {
        return movies.findById(id).orElseThrow(() -> new EntityNotFoundException("Movie not found"));
    }

    MovieResponse toResponse(Movie movie) {
        double average = reviews.averageRating(movie);
        long count = reviews.countByMovie(movie);
        // Score pondere inspire d'IMDb pour stabiliser les notes avec peu d'avis.
        double weighted = ((count / (double) (count + MINIMUM_VOTES)) * average)
                + ((MINIMUM_VOTES / (double) (count + MINIMUM_VOTES)) * GLOBAL_AVERAGE);

        Set<GenreResponse> genreResponses = movie.getGenres().stream()
                .sorted(Comparator.comparing(Genre::getName))
                .map(genre -> new GenreResponse(genre.getId(), genre.getName()))
                .collect(Collectors.toCollection(java.util.LinkedHashSet::new));

        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getSynopsis(),
                movie.getReleaseDate(),
                movie.getPosterUrl(),
                movie.getTrailerUrl(),
                genreResponses,
                Math.round(weighted * 100.0) / 100.0,
                count
        );
    }

    private void apply(Movie movie, MovieRequest request) {
        // Methode partagee par creation et modification pour garder les champs synchronises.
        movie.setTitle(request.title());
        movie.setSynopsis(request.synopsis());
        movie.setReleaseDate(request.releaseDate());
        movie.setPosterUrl(request.posterUrl());
        movie.setTrailerUrl(request.trailerUrl());
        movie.getGenres().clear();
        movie.getGenres().addAll(resolveGenres(request.genres()));
    }

    private Set<Genre> resolveGenres(Set<String> names) {
        if (names == null || names.isEmpty()) {
            return Set.of();
        }
        Set<Genre> resolved = new HashSet<>();
        for (String name : names) {
            // Reutilise un genre existant, sinon le cree a la volee depuis le formulaire admin.
            resolved.add(genres.findByNameIgnoreCase(name.trim())
                    .orElseGet(() -> genres.save(new Genre(name.trim()))));
        }
        return resolved;
    }
}
