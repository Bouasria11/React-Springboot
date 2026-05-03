package com.cinestack.api.service;

import com.cinestack.api.domain.AppUser;
import com.cinestack.api.domain.Role;
import com.cinestack.api.dto.AuthDtos.AuthResponse;
import com.cinestack.api.dto.AuthDtos.LoginRequest;
import com.cinestack.api.dto.AuthDtos.RegisterRequest;
import com.cinestack.api.repository.UserRepository;
import com.cinestack.api.security.JwtService;
import java.util.Set;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository users,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService
    ) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (users.existsByUsername(request.username()) || users.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Username or email already used");
        }

        var user = new AppUser(
                request.username(),
                request.email(),
                passwordEncoder.encode(request.password()),
                Set.of(Role.ROLE_USER)
        );
        users.save(user);
        return tokenFor(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        var user = users.findByUsername(request.username()).orElseThrow();
        return tokenFor(user);
    }

    private AuthResponse tokenFor(AppUser user) {
        var principal = userDetailsService.loadUserByUsername(user.getUsername());
        return new AuthResponse(jwtService.createToken(principal), user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }
}
