package com.cinestack.api.controller;

import com.cinestack.api.dto.MovieDtos.MovieResponse;
import com.cinestack.api.dto.ReviewDtos.ReviewRequest;
import com.cinestack.api.dto.ReviewDtos.ReviewResponse;
import com.cinestack.api.service.ReviewService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/movies/{movieId}/reviews")
    List<ReviewResponse> byMovie(@PathVariable Long movieId) {
        return reviewService.byMovie(movieId);
    }

    @PostMapping("/movies/{movieId}/reviews")
    ReviewResponse create(@PathVariable Long movieId, @Valid @RequestBody ReviewRequest request, Principal principal) {
        return reviewService.create(movieId, principal.getName(), request);
    }

    @GetMapping("/recommendations")
    List<MovieResponse> recommendations(Principal principal) {
        return reviewService.recommendations(principal.getName());
    }
}
