package com.cinestack.api.service;

import com.cinestack.api.domain.AppUser;
import com.cinestack.api.domain.Genre;
import com.cinestack.api.domain.Role;
import com.cinestack.api.dto.AdminDtos.AdminReviewResponse;
import com.cinestack.api.dto.AdminDtos.AdminUserResponse;
import com.cinestack.api.dto.AdminDtos.GenreRequest;
import com.cinestack.api.dto.MovieDtos.GenreResponse;
import com.cinestack.api.repository.GenreRepository;
import com.cinestack.api.repository.MovieRepository;
import com.cinestack.api.repository.ReviewRepository;
import com.cinestack.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
    private final UserRepository users;
    private final GenreRepository genres;
    private final MovieRepository movies;
    private final ReviewRepository reviews;

    public AdminService(UserRepository users, GenreRepository genres, MovieRepository movies, ReviewRepository reviews) {
        this.users = users;
        this.genres = genres;
        this.movies = movies;
        this.reviews = reviews;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> users() {
        return users.findAll().stream()
                .sorted(Comparator.comparing(AppUser::getUsername, String.CASE_INSENSITIVE_ORDER))
                .map(this::toUserResponse)
                .toList();
    }

    @Transactional
    public AdminUserResponse setAdmin(Long id, boolean admin, String currentUsername) {
        AppUser user = user(id);
        if (!admin && user.getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("You cannot remove your own administrator role");
        }

        if (admin) {
            user.getRoles().add(Role.ROLE_USER);
            user.getRoles().add(Role.ROLE_ADMIN);
        } else {
            user.getRoles().remove(Role.ROLE_ADMIN);
            user.getRoles().add(Role.ROLE_USER);
        }
        return toUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long id, String currentUsername) {
        AppUser user = user(id);
        if (user.getUsername().equals(currentUsername)) {
            throw new IllegalArgumentException("You cannot delete your own account");
        }
        reviews.deleteByUser(user);
        users.delete(user);
    }

    @Transactional(readOnly = true)
    public List<AdminReviewResponse> reviews() {
        return reviews.findAllByOrderByCreatedAtDesc().stream()
                .map(review -> new AdminReviewResponse(
                        review.getId(),
                        review.getMovie().getId(),
                        review.getMovie().getTitle(),
                        review.getUser().getId(),
                        review.getUser().getUsername(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public void deleteReview(Long id) {
        reviews.delete(reviews.findById(id).orElseThrow(() -> new EntityNotFoundException("Review not found")));
    }

    @Transactional
    public GenreResponse createGenre(GenreRequest request) {
        String name = request.name().trim();
        genres.findByNameIgnoreCase(name).ifPresent(existing -> {
            throw new IllegalArgumentException("Genre already exists");
        });
        Genre genre = genres.save(new Genre(name));
        return new GenreResponse(genre.getId(), genre.getName());
    }

    @Transactional
    public GenreResponse updateGenre(Long id, GenreRequest request) {
        Genre genre = genre(id);
        String name = request.name().trim();
        genres.findByNameIgnoreCase(name)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Genre already exists");
                });
        genre.setName(name);
        return new GenreResponse(genre.getId(), genre.getName());
    }

    @Transactional
    public void deleteGenre(Long id) {
        Genre genre = genre(id);
        movies.findAll().forEach(movie -> movie.getGenres().remove(genre));
        genres.delete(genre);
    }

    private AppUser user(Long id) {
        return users.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private Genre genre(Long id) {
        return genres.findById(id).orElseThrow(() -> new EntityNotFoundException("Genre not found"));
    }

    private AdminUserResponse toUserResponse(AppUser user) {
        return new AdminUserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }
}
