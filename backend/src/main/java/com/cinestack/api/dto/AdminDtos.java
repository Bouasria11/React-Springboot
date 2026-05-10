package com.cinestack.api.dto;

import com.cinestack.api.domain.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Set;

public final class AdminDtos {
    private AdminDtos() {
    }

    // DTO dedies au tableau de bord administrateur.
    public record AdminReviewResponse(
            Long id,
            Long movieId,
            String movieTitle,
            Long userId,
            String username,
            int rating,
            String comment,
            Instant createdAt
    ) {
    }

    public record AdminUserResponse(
            Long id,
            String username,
            String email,
            Set<Role> roles
    ) {
    }

    public record GenreRequest(
            @NotBlank @Size(max = 80) String name
    ) {
    }

    public record UserAdminRequest(
            boolean admin
    ) {
    }
}
