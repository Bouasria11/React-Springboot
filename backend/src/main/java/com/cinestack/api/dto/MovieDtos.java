package com.cinestack.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Set;

public final class MovieDtos {
    private MovieDtos() {
    }

    // DTO recus et renvoyes par l'API films pour ne pas exposer directement les entites JPA.
    public record MovieRequest(
            @NotBlank @Size(max = 180) String title,
            @Size(max = 2000) String synopsis,
            LocalDate releaseDate,
            String posterUrl,
            String trailerUrl,
            Set<@NotBlank String> genres
    ) {
    }

    public record GenreResponse(Long id, String name) {
    }

    public record MovieResponse(
            Long id,
            String title,
            String synopsis,
            LocalDate releaseDate,
            String posterUrl,
            String trailerUrl,
            Set<GenreResponse> genres,
            double weightedScore,
            long reviewCount
    ) {
    }
}
