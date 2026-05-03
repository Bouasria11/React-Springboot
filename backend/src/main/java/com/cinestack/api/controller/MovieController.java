package com.cinestack.api.controller;

import com.cinestack.api.dto.MovieDtos.MovieRequest;
import com.cinestack.api.dto.MovieDtos.MovieResponse;
import com.cinestack.api.service.MovieService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    Page<MovieResponse> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate releasedAfter,
            Pageable pageable
    ) {
        return movieService.search(title, genre, releasedAfter, pageable);
    }

    @GetMapping("/{id}")
    MovieResponse get(@PathVariable Long id) {
        return movieService.get(id);
    }

    @GetMapping("/top-rated")
    List<MovieResponse> topRated() {
        return movieService.topRated();
    }

    @PostMapping
    MovieResponse create(@Valid @RequestBody MovieRequest request) {
        return movieService.create(request);
    }

    @PutMapping("/{id}")
    MovieResponse update(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        return movieService.update(id, request);
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id) {
        movieService.delete(id);
    }
}
