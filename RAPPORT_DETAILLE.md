# RAPPORT TECHNIQUE DE FIN DE PROJET : CINESTACK
**Version :** 1.0.0  
**Date :** 12 mai 2026  
**Auteurs :** Équipe de Développement CineStack (Gemini CLI)  
**Destinataire :** Direction Technique / Comité de Pilotage  

---

## TABLE DES MATIÈRES
1. [Introduction](#1-introduction)
2. [Contexte et Objectifs](#2-contexte-et-objectifs)
3. [Architecture Globale](#3-architecture-globale)
4. [Étude du Backend (Spring Boot)](#4-étude-du-backend)
5. [Étude du Frontend (React)](#5-étude-du-frontend)
6. [Modélisation des Données](#6-modélisation-des-données)
7. [Sécurité et Authentification](#7-sécurité-et-authentification)
8. [Documentation de l'API REST](#8-documentation-de-lapi-rest)
9. [Interface Utilisateur et UX](#9-interface-utilisateur-et-ux)
10. [Gestion des Exceptions et Qualité](#10-gestion-des-exceptions-et-qualité)
11. [Stratégie de Test](#11-stratégie-de-test)
12. [Déploiement et Conteneurisation](#12-déploiement-et-conteneurisation)
13. [Analyse de la Performance](#13-analyse-de-la-performance)
14. [Journal de Bord des Défis](#14-journal-de-bord-des-défis)
15. [Conclusion et Perspectives](#15-conclusion-et-perspectives)

---

## 1. INTRODUCTION
Ce document constitue le rapport final du projet **CineStack**, une plateforme de gestion cinématographique de nouvelle génération. Il retrace l'intégralité du cycle de vie du développement, de la conception architecturale jusqu'à la mise en production via Docker. L'objectif principal était de fournir une expérience utilisateur fluide pour la consultation de films tout en garantissant une administration sécurisée et performante.

## 2. CONTEXTE ET OBJECTIFS
Le marché des plateformes de streaming et de gestion de catalogues de films nécessite des outils capables de gérer des volumes de données croissants tout en offrant une interactivité riche.
### Objectifs Spécifiques :
*   **Performance :** Temps de réponse de l'API inférieur à 200ms.
*   **Modularité :** Architecture découplée permettant une évolution indépendante du frontend et du backend.
*   **Sécurité :** Protection des données utilisateurs et des fonctionnalités administratives par des standards industriels.

## 3. ARCHITECTURE GLOBALE
L'application repose sur une architecture **Cient-Serveur** moderne :
*   **Client (Frontend) :** Application Single Page (SPA) développée avec React 18, utilisant Vite comme outil de build pour une rapidité optimale en développement et production.
*   **Serveur (Backend) :** API RESTful construite avec Spring Boot 3.x, s'appuyant sur Java 17 pour bénéficier des dernières améliorations de performance et de syntaxe (Records, Sealed Classes).
*   **Base de Données :** Système relationnel (H2 pour le développement, PostgreSQL pour la production) géré via Spring Data JPA.

## 4. ÉTUDE DU BACKEND (SPRING BOOT)
Le backend est structuré selon les principes de la **Clean Architecture** :
*   **Controllers :** Points d'entrée de l'API, gérant la désérialisation JSON et la validation des entrées.
*   **Services :** Couche métier contenant l'intelligence de l'application (validation des droits, calculs, orchestration).
*   **Repositories :** Interface avec la couche de persistance via le pattern Data Access Object (DAO).
*   **DTOs (Data Transfer Objects) :** Assurent un découplage total entre le modèle de données de la base et les réponses renvoyées au client, évitant les fuites d'informations sensibles (ex: mots de passe).

## 5. ÉTUDE DU FRONTEND (REACT)
Le frontend privilégie la **composition de composants** :
*   **Gestion d'État :** Utilisation de l'API `Context` pour la gestion de l'authentification globale.
*   **Styling :** Intégration de Tailwind CSS permettant un design "Utility-First" et un responsive design immédiat.
*   **Routage :** React Router DOM pour une navigation fluide sans rechargement de page.

## 6. MODÉLISATION DES DONNÉES
Le schéma relationnel comprend cinq entités clés :
1.  **AppUser :** Gestion des profils, emails et rôles (USER, ADMIN).
2.  **Movie :** Titre, description, année de sortie, et relation avec les genres.
3.  **Genre :** Catégorisation des œuvres (Action, Drame, etc.).
4.  **Review :** Commentaires et notes attribuées par les utilisateurs.
5.  **Role :** Gestion fine des habilitations.

## 7. SÉCURITÉ ET AUTHENTIFICATION
La sécurité est le pilier central de CineStack.
*   **Spring Security :** Configuration d'une chaîne de filtres personnalisée.
*   **JWT (JSON Web Token) :** Authentification stateless. Chaque requête sécurisée doit inclure un Bearer Token valide.
*   **BCrypt :** Hachage des mots de passe en base de données pour une sécurité maximale contre les attaques par force brute.

## 8. DOCUMENTATION DE L'API REST
### Endpoints Majeurs :
*   `POST /api/auth/login` : Authentification et génération du token.
*   `GET /api/movies` : Récupération paginée de la liste des films.
*   `POST /api/admin/movies` : Ajout d'un film (réservé aux administrateurs).
*   `DELETE /api/reviews/{id}` : Suppression d'une critique.

## 9. INTERFACE UTILISATEUR ET UX
L'interface a été conçue pour être **intuitive** :
*   **Dashboard :** Vue d'ensemble pour les administrateurs avec statistiques rapides.
*   **Mode Sombre (Dark Mode) :** Optimisé pour le confort visuel lors de la consultation de catalogues de films.
*   **Feedback Visuel :** Toasts et indicateurs de chargement pour chaque action asynchrone.

## 10. GESTION DES EXCEPTIONS ET QUALITÉ
Une classe `ApiExceptionHandler` centralise tous les retours d'erreur. Cela garantit que le client reçoit toujours un format d'erreur standard :
```json
{
  "timestamp": "2026-05-12T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Le film avec l'ID 123 n'existe pas"
}
```

## 11. STRATÉGIE DE TEST
*   **Tests Unitaires :** Validation des services via JUnit 5 et Mockito.
*   **Tests de Spécifications :** Validation du moteur de recherche dynamique des films.
*   **Tests de Sécurité :** Vérification que les endpoints sensibles rejettent bien les requêtes sans token.

## 12. DÉPLOIEMENT ET CONTENEURISATION
Le projet utilise **Docker** pour garantir la parité entre les environnements de développement et de production.
*   **Dockerfile Backend :** Build multi-stage pour minimiser la taille de l'image finale.
*   **Dockerfile Frontend :** Utilisation de Nginx pour servir les assets statiques de manière ultra-rapide.
*   **Docker Compose :** Orchestration permettant de lancer l'intégralité de la stack (Backend + Frontend + DB) avec une seule commande.

## 13. ANALYSE DE LA PERFORMANCE
L'utilisation de `Spring Data JPA Specifications` permet de générer des requêtes SQL optimisées, évitant le problème classique du "N+1 select". Côté frontend, le "Code Splitting" assure que l'utilisateur ne charge que le code nécessaire à la page qu'il consulte.

## 14. JOURNAL DE BORD DES DÉFIS
*   **Challenge :** Gestion du CORS (Cross-Origin Resource Sharing) entre le port 5173 (Vite) et le port 8080 (Spring).
*   **Solution :** Configuration d'une politique globale de CORS dans `SecurityConfig`.
*   **Challenge :** Persistance des données lors des redémarrages de containers Docker.
*   **Solution :** Mise en œuvre de volumes Docker nommés pour le stockage de la base de données.

## 15. CONCLUSION ET PERSPECTIVES
CineStack est une plateforme mature et prête à l'emploi. Les perspectives d'évolution incluent l'ajout d'un système de recommandation basé sur l'IA et l'intégration d'APIs tierces (comme TMDB) pour enrichir automatiquement le catalogue.

---
**Signé :** Gemini CLI - Expert Project Manager
