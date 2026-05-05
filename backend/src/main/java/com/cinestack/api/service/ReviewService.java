package com.cinestack.api.service;

import com.cinestack.api.domain.AppUser;
import com.cinestack.api.domain.Review;
import com.cinestack.api.dto.MovieDtos.MovieResponse;
import com.cinestack.api.dto.ReviewDtos.ReviewRequest;
import com.cinestack.api.dto.ReviewDtos.ReviewResponse;
import com.cinestack.api.repository.MovieRepository;
import com.cinestack.api.repository.ReviewRepository;
import com.cinestack.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {
    private final ReviewRepository reviews;
    private final MovieRepository movies;
    private final UserRepository users;
    private final MovieService movieService;

    public ReviewService(ReviewRepository reviews, MovieRepository movies, UserRepository users, MovieService movieService) {
        this.reviews = reviews;
        this.movies = movies;
        this.users = users;
        this.movieService = movieService;
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> byMovie(Long movieId) {
        var movie = movies.findById(movieId).orElseThrow(() -> new EntityNotFoundException("Movie not found"));
        return reviews.findByMovieOrderByCreatedAtDesc(movie).stream().map(this::toResponse).toList();
    }

    @Transactional
    public ReviewResponse create(Long movieId, String username, ReviewRequest request) {
        var movie = movies.findById(movieId).orElseThrow(() -> new EntityNotFoundException("Movie not found"));
        var user = user(username);
        var review = reviews.save(new Review(movie, user, request.rating(), request.comment()));
        return toResponse(review);
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> recommendations(String username) {
        AppUser user = user(username);
        var likedGenres = reviews.findByUserAndRatingGreaterThanEqual(user, 4).stream()
                .flatMap(review -> review.getMovie().getGenres().stream())
                .map(genre -> genre.getName().toLowerCase())
                .collect(java.util.stream.Collectors.toSet());

        if (likedGenres.isEmpty()) {
            return movies.findAll(PageRequest.of(0, 8)).stream().map(movieService::toResponse).toList();
        }

        return movies.findAll().stream()
                .filter(movie -> movie.getGenres().stream().anyMatch(genre -> likedGenres.contains(genre.getName().toLowerCase())))
                .map(movieService::toResponse)
                .sorted(Comparator.comparing(MovieResponse::weightedScore).reversed())
                .limit(8)
                .toList();
    }

    private AppUser user(String username) {
        return users.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getMovie().getId(),
                review.getUser().getUsername(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
