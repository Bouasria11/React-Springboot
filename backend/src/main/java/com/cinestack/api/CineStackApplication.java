package com.cinestack.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CineStackApplication {
    public static void main(String[] args) {
        // Point d'entree de l'API CineStack.
        SpringApplication.run(CineStackApplication.class, args);
    }
}
