package com.cinestack.api.dto;

import com.cinestack.api.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 3, max = 80) String username,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 120) String password
    ) {
    }

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(
            String token,
            Long id,
            String username,
            String email,
            Set<Role> roles
    ) {
    }
}
