package com.cinestack.api.movie;

import com.cinestack.api.domain.Movie;
import jakarta.persistence.criteria.JoinType;
import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;

public final class MovieSpecifications {
    private MovieSpecifications() {
    }

    // Chaque methode retourne une Specification neutre quand le filtre n'est pas fourni.
    public static Specification<Movie> titleContains(String title) {
        return (root, query, cb) -> title == null || title.isBlank()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Movie> hasGenre(String genre) {
        return (root, query, cb) -> {
            if (genre == null || genre.isBlank()) {
                return cb.conjunction();
            }
            // Le distinct evite les doublons provoques par la jointure many-to-many.
            query.distinct(true);
            return cb.equal(cb.lower(root.join("genres", JoinType.LEFT).get("name")), genre.toLowerCase());
        };
    }

    public static Specification<Movie> releasedAfter(LocalDate date) {
        return (root, query, cb) -> date == null ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("releaseDate"), date);
    }
}
