package com.cinestack.api.repository;

import com.cinestack.api.domain.AppUser;
import com.cinestack.api.domain.Movie;
import com.cinestack.api.domain.Review;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovieOrderByCreatedAtDesc(Movie movie);

    List<Review> findByUserAndRatingGreaterThanEqual(AppUser user, int rating);

    List<Review> findAllByOrderByCreatedAtDesc();

    void deleteByUser(AppUser user);

    @Query("select coalesce(avg(r.rating), 0) from Review r where r.movie = :movie")
    double averageRating(Movie movie);

    long countByMovie(Movie movie);
}
