package com.cinestack.api.controller;

import com.cinestack.api.dto.MovieDtos.GenreResponse;
import com.cinestack.api.repository.GenreRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/genres")
public class GenreController {
    private final GenreRepository genres;

    public GenreController(GenreRepository genres) {
        this.genres = genres;
    }

    @GetMapping
    List<GenreResponse> all() {
        return genres.findAll().stream()
                .sorted(Comparator.comparing(genre -> genre.getName().toLowerCase()))
                .map(genre -> new GenreResponse(genre.getId(), genre.getName()))
                .toList();
    }
}
