package com.cinestack.api.config;

import com.cinestack.api.domain.AppUser;
import com.cinestack.api.domain.Genre;
import com.cinestack.api.domain.Movie;
import com.cinestack.api.domain.Role;
import com.cinestack.api.repository.GenreRepository;
import com.cinestack.api.repository.MovieRepository;
import com.cinestack.api.repository.UserRepository;
import java.time.LocalDate;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("!prod")
public class DataInitializer {
    @Bean
    CommandLineRunner seed(UserRepository users, GenreRepository genres, MovieRepository movies, PasswordEncoder passwordEncoder) {
        return args -> {
            // Donnees de demonstration chargees uniquement hors production.
            if (!users.existsByUsername("admin")) {
                users.save(new AppUser("admin", "admin@cinestack.local", passwordEncoder.encode("admin12345"), Set.of(Role.ROLE_ADMIN, Role.ROLE_USER)));
            }
            if (!users.existsByUsername("demo")) {
                users.save(new AppUser("demo", "demo@cinestack.local", passwordEncoder.encode("demo12345"), Set.of(Role.ROLE_USER)));
            }
            if (movies.count() > 0) {
                // Ne reseed pas si la base contient deja un catalogue.
                return;
            }

            Genre sciFi = genres.save(new Genre("Science-fiction"));
            Genre drama = genres.save(new Genre("Drame"));
            Genre thriller = genres.save(new Genre("Thriller"));

            movies.save(movie("Interstellar", "Une equipe traverse un trou de ver pour chercher un futur a l'humanite.", LocalDate.of(2014, 11, 5), "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", "https://www.youtube.com/watch?v=zSWdZVtXT7E", sciFi, drama));
            movies.save(movie("Inception", "Un voleur infiltre les reves pour voler et implanter des idees.", LocalDate.of(2010, 7, 16), "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg", "https://www.youtube.com/watch?v=YoHD9XEInc0", sciFi, thriller));
            movies.save(movie("Parasite", "Deux familles que tout oppose entrent dans une relation explosive.", LocalDate.of(2019, 5, 30), "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", "https://www.youtube.com/watch?v=5xH0HfJHsaY", drama, thriller));
        };
    }

    private Movie movie(String title, String synopsis, LocalDate releaseDate, String posterUrl, String trailerUrl, Genre... genres) {
        // Fabrique un film complet pour garder le seed lisible.
        Movie movie = new Movie();
        movie.setTitle(title);
        movie.setSynopsis(synopsis);
        movie.setReleaseDate(releaseDate);
        movie.setPosterUrl(posterUrl);
        movie.setTrailerUrl(trailerUrl);
        movie.getGenres().addAll(Set.of(genres));
        return movie;
    }
}
