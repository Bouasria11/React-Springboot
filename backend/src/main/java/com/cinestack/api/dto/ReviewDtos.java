package com.cinestack.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public final class ReviewDtos {
    private ReviewDtos() {
    }

    public record ReviewRequest(
            @Min(1) @Max(5) int rating,
            @Size(max = 1200) String comment
    ) {
    }

    public record ReviewResponse(
            Long id,
            Long movieId,
            String username,
            int rating,
            String comment,
            Instant createdAt
    ) {
    }
}
