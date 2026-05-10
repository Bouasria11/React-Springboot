package com.cinestack.api.repository;

import com.cinestack.api.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

// Repository du catalogue avec support des Specifications pour les filtres de recherche.
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
}
