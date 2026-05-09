package com.cinestack.api.controller;

import com.cinestack.api.dto.AdminDtos.AdminReviewResponse;
import com.cinestack.api.dto.AdminDtos.AdminUserResponse;
import com.cinestack.api.dto.AdminDtos.GenreRequest;
import com.cinestack.api.dto.AdminDtos.UserAdminRequest;
import com.cinestack.api.dto.MovieDtos.GenreResponse;
import com.cinestack.api.service.AdminService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    // Toutes ces routes sont protegees par SecurityConfig avec le role ADMIN.
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    List<AdminUserResponse> users() {
        return adminService.users();
    }

    @PutMapping("/users/{id}/admin")
    AdminUserResponse setAdmin(@PathVariable Long id, @RequestBody UserAdminRequest request, Principal principal) {
        return adminService.setAdmin(id, request.admin(), principal.getName());
    }

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id, Principal principal) {
        adminService.deleteUser(id, principal.getName());
    }

    @PostMapping("/genres")
    GenreResponse createGenre(@Valid @RequestBody GenreRequest request) {
        return adminService.createGenre(request);
    }

    @PutMapping("/genres/{id}")
    GenreResponse updateGenre(@PathVariable Long id, @Valid @RequestBody GenreRequest request) {
        return adminService.updateGenre(id, request);
    }

    @DeleteMapping("/genres/{id}")
    void deleteGenre(@PathVariable Long id) {
        adminService.deleteGenre(id);
    }

    @GetMapping("/reviews")
    List<AdminReviewResponse> reviews() {
        return adminService.reviews();
    }

    @DeleteMapping("/reviews/{id}")
    void deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
    }
}
