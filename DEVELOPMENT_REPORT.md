# Project Development & Modification Report

This document records the system configurations, verified tool versions, detected issues, and modifications made to the project code. You can use this content directly when compiling your project report.

---

## 📋 Table of Contents
1. [System Audit & Version Checks](#1-system-audit--version-checks)
2. [Identified Issues & Resolution Plan](#2-identified-issues--resolution-plan)
3. [Summary of File Modifications](#3-summary-of-file-modifications)
4. [Architectural Design: Package-by-Layer](#4-architectural-design-package-by-layer)
5. [Prévention du Surbooking (Optimistic Locking)](#5-prévention-du-surbooking-optimistic-locking)
6. [Perspectives : Intégration de JWT](#6-perspectives--intégration-de-jwt)
7. [Gestion des Erreurs : Problèmes Résolus et Exceptions Anticipées](#7-gestion-des-erreurs--problèmes-résolus-et-exceptions-anticipées)
8. [Sécurité par Rôle : @EnableMethodSecurity & @PreAuthorize](#8-sécurité-par-rôle--enablemethodsecurity--preauthorize)

---

## 1. System Audit & Version Checks

Before applying changes, an internal system check was performed to align the project's dependencies with the tools installed on your host system:

* **Java Development Kit (JDK)**:
  * **Installed**: OpenJDK `17.0.17` (Eclipse Temurin)
  * **Project Configuration**: Maven compiler target set to `17` (Aligned)
* **Build Tool**: 
  * **Installed**: Apache Maven `3.9.12` (Fully compatible)
* **Docker**:
  * **Installed**: Docker version `29.4.1`
* **PostgreSQL (Local Host Services)**:
  * **Service 1**: PostgreSQL 18 running on Port `5432`
  * **Service 2**: PostgreSQL 14 running on Port `5433`

---

## 2. Identified Issues & Resolution Plan

During the review of the database configurations, two major issues were identified:

> [!WARNING]
> **Issue A: PostgreSQL Version Mismatch**
> The default configuration was using PostgreSQL 15, while your preferred system environment uses version 18.
> 
> * **Resolution**: Upgraded the Docker container image tag to use `postgres:18-alpine`.

> [!CAUTION]
> **Issue B: Database Port Conflict**
> The Docker container was configured to bind PostgreSQL to host port `5432`. However, the local Windows PostgreSQL 18 service was already running and listening on port `5432`. Running `docker compose up` would fail due to this address conflict.
> 
> * **Resolution**: Remapped the Docker service host port from `5432` to `5434`, and synchronized the backend datasource URL to connect through port `5434`.

---

## 3. Summary of File Modifications

### 📄 backend/docker-compose.yml
* **Path**: `backend/docker-compose.yml`
* **Changes**:
  * Upgraded PostgreSQL image from `15-alpine` to `18-alpine`.
  * Changed mapped host port from `5432` to `5434` to prevent local service conflicts.

```diff
 services:
   postgres:
-    image: postgres:15-alpine
+    image: postgres:18-alpine
     container_name: fosmef-postgres
     ports:
-      - "5432:5432"
+      - "5434:5432"
```

---

### 📄 backend/src/main/resources/application.properties
* **Path**: `backend/src/main/resources/application.properties`
* **Changes**:
  * Synchronized the connection string to target the `prevention_db` database instead of the placeholder `plateforme`.
  * Updated connection port from `5432` to `5434` to align with Docker Compose.
  * Updated the database credentials from default placeholders (`postgres`/`ton_mot_de_passe`) to match the Docker credentials (`fosmef_user`/`fosmef_password`).

```diff
 spring.application.name=plateforme 
-spring.datasource.url=jdbc:postgresql://localhost:5432/plateforme
-spring.datasource.username=postgres
-spring.datasource.password=ton_mot_de_passe
+spring.datasource.url=jdbc:postgresql://localhost:5434/prevention_db
+spring.datasource.username=fosmef_user
+spring.datasource.password=fosmef_password
```

---

### 📄 backend/pom.xml
* **Path**: `backend/pom.xml`
* **Changes**:
  * Added `springdoc-openapi-starter-webmvc-ui` (v2.5.0) to automatically generate API documentation and Swagger UI.

```xml
+		<dependency>
+			<groupId>org.springdoc</groupId>
+			<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
+			<version>2.5.0</version>
+		</dependency>
```

---

### 📄 backend/src/main/resources/application.properties (Port configuration)
* **Changes**:
  * Configured `server.port=8081` to bypass port conflict on port 8080 (already in use on host system).

```properties
+server.port=8081
```

---

### 📄 backend/src/main/java/com/fosmef/prevention/config/SecurityConfig.java
* **Changes**:
  * Added BCrypt password encoder bean.
  * Configured Spring Security HTTP filter chain to permit all requests for initial testing.

---

### 📄 Restructured Layer Components (Controllers, Services, Repositories, DTOs)
* **Changes**:
  * Created DTO records: `RegisterRequest`, `LoginRequest`, `UserResponse`, `CampagneRequest`, `CampagneResponse`.
  * Created service contracts and implementations: `UserService`, `UserServiceImpl`, `CampagneService`, `CampagneServiceImpl`.
  * Created REST controllers: `UserController`, `CampagneController`.
  * Created Spring Data JPA interfaces: `UserRepository`, `CampagneRepository`, `ReservationRepository`.

---

## 4. Architectural Design: Package-by-Layer

In this phase of development, the backend has been restructured using the **Package-by-Layer** pattern.

### What is Package-by-Layer?
**Package-by-Layer** is an architectural layout pattern where codebase classes are grouped by their technical role or responsibility in the application stack (e.g., all database models/entities are grouped together in one package, all controllers in another, etc.).

This is highly useful for separating technical concerns, establishing clear conventions for developers, and preventing dependency coupling between distant parts of the system.

### Application Layout in Our Project
We organized the package `com.fosmef.prevention` under `src/main/java` into distinct layers:

* **`entity`**: Contains database entities and enums.
  * *Files*: `User`, `Role`, `Campagne`, `StatutCampagne`, `Reservation`, `StatutReservation`.
* **`repository`**: Interfaces extending `JpaRepository` for data access.
* **`service` & `service/impl`**: Interfaces and concrete implementations of business logic and application rules.
* **`controller`**: REST controllers exposing API endpoints to the client.
* **`dto` (`request`/`response`)**: Data Transfer Objects to separate presentation from persistence models.
* **`config`**: Spring Configuration classes.
* **`mapper`**: Mappers (e.g., MapStruct) to translate between entities and DTOs.
* **`exception`**: Centralized exception handling controllers.
* **`security`**: Configuration filters and JWT security providers.

### Benefits of Package-by-Layer for FOSMEF
1. **Clear Separation of Concerns (SoC)**: Developers immediately understand that the database layer (`entity`) does not interact directly with HTTP requests (`controller`), protecting internal database structures.
2. **Predictable Code Placement**: Every class has a clear home based on its technical category, speeding up onboarding and onboarding consistency.
3. **Structured Dependency Flow**: Dependencies flow strictly downward (e.g., Controller ➔ Service ➔ Repository ➔ DB), minimizing circular references.

---

## 5. Prévention du Surbooking (Optimistic Locking)

Pour assurer la robustesse métier de l'application (notamment lors de pics de connexion où plusieurs adhérents tentent de réserver simultanément), nous avons implémenté le **verrouillage optimiste** (Optimistic Locking).

### Le Problème Métier (Concurrence Critique)
Si deux adhérents cliquent sur "Réserver" à la milliseconde près alors qu'il ne reste qu'une seule place disponible pour une campagne, deux requêtes concurrentes s'exécutent en parallèle. Sans protection, les deux requêtes liront la base de données indiquant qu'une place est libre, réserveront toutes les deux, entraînant un **surbooking (dépassement des places autorisées)**.

### Notre Solution : L'annotation `@Version`
Nous avons ajouté un champ de versionnement dans l'entité `Campagne` :
```java
@Version
private Long version;
```

* **Fonctionnement** :
  1. Lorsque Hibernate lit les données d'une campagne pour une réservation, il récupère également la valeur actuelle de `version`.
  2. Lors de la mise à jour (incrémentation des places réservées), Hibernate exécute une requête SQL contenant : `WHERE id = ? AND version = {version_initiale}`.
  3. La première transaction qui valide la modification réussit et incrémente automatiquement la version en base de données.
  4. La seconde transaction, s'exécutant au même moment, tentera de valider sa mise à jour mais le critère `version = {version_initiale}` ne correspondra plus (la version ayant déjà été incrémentée par la première transaction).
  5. Hibernate détecte alors qu'aucune ligne n'a été modifiée et lève une exception `ObjectOptimisticLockingFailureException`.
  6. La base de données bloque ainsi automatiquement la seconde tentative, garantissant l'intégrité des places disponibles sans verrouiller lourdement la base de données (ce qui préserve les performances globales de l'application).

---

## 6. Perspectives : Intégration de JWT

La prochaine phase majeure du développement consistera à sécuriser l'ensemble des API REST du backend à l'aide de **JSON Web Tokens (JWT)**.

### Pourquoi intégrer JWT ?
1. **Authentification Stateless (Sans État)** : Pour une API REST robuste, le serveur ne doit stocker aucune session utilisateur en mémoire. Le client stocke le jeton (JWT) et l'envoie dans l'en-tête HTTP `Authorization: Bearer <token>`. Le serveur vérifie simplement la signature cryptographique du jeton.
2. **Contrôle d'Accès par Rôle (RBAC)** : Les jetons JWT contiendront le rôle de l'utilisateur (ex: `role: "GESTIONNAIRE"` ou `role: "ADHERENT"`). Cela permettra au filtre de sécurité de Spring d'autoriser ou bloquer les accès (ex: seuls les gestionnaires pourront créer des campagnes).
3. **Sécurité et Intégrité** : Chaque jeton sera signé numériquement avec une clé secrète connue uniquement par le serveur backend. Toute modification du jeton par le client invalidera la signature, entraînant le rejet immédiat de la requête.

### Prochaines étapes de mise en œuvre
* Ajouter la dépendance JWT (`io.jsonwebtoken`) au fichier `pom.xml`. (Fait)
* Implémenter un utilitaire `JwtUtils` pour la création et validation des tokens. (Fait - `JwtService`)
* Configurer un filtre personnalisé `JwtAuthenticationFilter` interceptant et validant chaque requête entrante. (Fait)
* Définir les autorisations d'URL restrictives dans `SecurityConfig`. (Fait)

---

## 7. Gestion des Erreurs : Problèmes Résolus et Exceptions Anticipées

Afin de garantir la robustesse technique et métier de la plateforme, plusieurs scénarios d'exceptions et de conflits potentiels ont été identifiés, anticipés et résolus :

### 1. Concurrence Critique & Surbooking (Réservation simultanée)
* **Problème** : Deux adhérents tentant de réserver la toute dernière place d'une campagne de prévention à la milliseconde près.
* **Résolution** : Mise en place du **verrouillage optimiste** via le champ `@Version` dans l'entité `Campagne`.
* **Exception Anticipée** : `ObjectOptimisticLockingFailureException` (Hibernate détecte que la version en base a changé et bloque la transaction concurrente perdante, évitant ainsi le dépassement de la limite de places).

### 2. Conflits de Ports Hôtes (Erreur de démarrage local)
* **Problème** : Échec du démarrage de Spring Boot car le port par défaut `8080` est déjà utilisé localement, ou échec de Docker car le port `5432` de Postgres est occupé.
* **Résolution** :
  * PostgreSQL configuré sur le port externe `5434` dans le fichier `docker-compose.yml`.
  * Spring Boot configuré sur le port `8081` dans `application.properties`.
* **Exception Anticipée** : `PortInUseException` / `ApplicationContextException` (évitées grâce au remappage des ports).

### 3. Incompatibilité de Volume de Base de Données (PostgreSQL)
* **Problème** : Le démarrage du conteneur Postgres échoue en boucle après une tentative de montée de version de l'image (de 15 à 18) car les fichiers de données existants du volume local `postgres_data` sont restés au format v15.
* **Résolution** : Rétablissement de l'image `postgres:15-alpine` dans le fichier `docker-compose.yml` pour correspondre au stockage local existant.
* **Exception Anticipée** : PostgreSQL container exit code `1` (bloquant le démarrage de l'appli).

### 4. Violation d'Unicité d'Email (Création de compte)
* **Problème** : Tentative d'enregistrement de deux utilisateurs différents avec la même adresse email.
* **Résolution** :
  * Ajout d'une contrainte d'unicité au niveau de la base de données via `@UniqueConstraint(columnNames = "email")` sur la table `users`.
  * Double validation métier dans la couche service avec un contrôle préventif : `userRepository.findByEmail(email).isPresent()`.
* **Exception Anticipée** : `ResponseStatusException` (renvoyant une erreur HTTP `400 Bad Request` claire pour le client au lieu d'une erreur brute d'insertion SQL `DataIntegrityViolationException`).

### 5. Falsification et Expiration de Tokens Sécurisés (JWT)
* **Problème** : Un client tente d'appeler une API sécurisée avec un jeton expiré, falsifié (ex : changement de rôle de `ADHERENT` à `GESTIONNAIRE`), ou mal formé.
* **Résolution** :
  * Validation cryptographique de la signature avec l'algorithme HS256 et une clé secrète de 256 bits configurée dans `application.properties`.
  * Contrôle de la date d'expiration intégrée au Payload du jeton.
* **Exceptions Anticipées** : `SignatureException`, `ExpiredJwtException`, `MalformedJwtException` (levées par `Jwts.parserBuilder()` et interceptées par Spring Security pour renvoyer une erreur `401 Unauthorized` ou `403 Forbidden`).

### 6. Erreurs de Saisie de Données (Validation DTO)
* **Problème** : Requêtes HTTP contenant des données incorrectes (ex : email non conforme, mot de passe vide, nombre de places négatif).
* **Résolution** : Validation automatique des objets d'entrée avec `@Valid` dans les contrôleurs et les annotations `@NotBlank`, `@Email`, `@Min(1)` et `@NotNull` dans les DTOs.
* **Exception Anticipée** : `MethodArgumentNotValidException` (Spring intercepte les violations et renvoie automatiquement une erreur structurée `400 Bad Request` détaillant les champs erronés).

---

## 8. Sécurité par Rôle : `@EnableMethodSecurity` & `@PreAuthorize`

Cette phase finalise la mise en place du **contrôle d'accès basé sur les rôles (RBAC)** au niveau des méthodes, en complément du filtre JWT déjà opérationnel.

### 8.1 Correction : import manquant pour `@EnableMethodSecurity`

**Fichier concerné** : [`SecurityConfig.java`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/backend/src/main/java/com/fosmef/prevention/config/SecurityConfig.java)

**Problème** : L'annotation `@EnableMethodSecurity` présente sur la classe était reconnue au niveau de la syntaxe mais non résolue par le compilateur Java, car son import était absent. Cela provoquait une erreur de compilation bloquante :

```
EnableMethodSecurity cannot be resolved to a type
```

**Résolution** : Ajout de l'import manquant dans `SecurityConfig.java` :

```java
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
```

**Rôle de `@EnableMethodSecurity`** : Cette annotation (disponible depuis Spring Security 5.6, remplaçant `@EnableGlobalMethodSecurity`) active le moteur d'évaluation des annotations de sécurité au niveau des méthodes, notamment `@PreAuthorize` et `@PostAuthorize`. Sans elle, ces annotations sont ignorées silencieusement par Spring, rendant l'API non protégée malgré leur présence.

---

### 8.2 Implémentation du contrôle d'accès par rôle dans `CampagneController`

**Fichier concerné** : [`CampagneController.java`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/backend/src/main/java/com/fosmef/prevention/controller/CampagneController.java)

**Objectif** : Appliquer des règles d'accès différenciées sur les endpoints de gestion des campagnes selon le rôle de l'utilisateur authentifié.

#### Changements apportés

| Endpoint | Méthode HTTP | Règle d'accès appliquée |
|---|---|---|
| `/api/campagnes` | `GET` | `@PreAuthorize("hasAnyRole('ADHERENT', 'GESTIONNAIRE')")` |
| `/api/campagnes` | `POST` | `@PreAuthorize("hasRole('GESTIONNAIRE')")` |

#### Code résultant

```java
@GetMapping
@PreAuthorize("hasAnyRole('ADHERENT', 'GESTIONNAIRE')")
public ResponseEntity<List<CampagneResponse>> getAllCampagnes() {
    return ResponseEntity.ok(campagneService.getAllCampagnes());
}

@PostMapping
@PreAuthorize("hasRole('GESTIONNAIRE')")
public ResponseEntity<CampagneResponse> createCampagne(@Valid @RequestBody CampagneRequest request) {
    CampagneResponse response = campagneService.createCampagne(request);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
}
```

#### Comportement en production

* Un `ADHERENT` appelant `GET /api/campagnes` avec un token JWT valide reçoit la liste des campagnes (**200 OK**).
* Un `ADHERENT` appelant `POST /api/campagnes` est bloqué avant même d'atteindre le service métier (**403 Forbidden**).
* Un `GESTIONNAIRE` peut appeler les deux endpoints sans restriction.

> **Convention Spring Security** : Les rôles doivent être stockés avec le préfixe `ROLE_` en base de données (ex : `ROLE_ADHERENT`, `ROLE_GESTIONNAIRE`), ce que le `CustomUserDetailsService` prend en charge lors du chargement du profil utilisateur.
