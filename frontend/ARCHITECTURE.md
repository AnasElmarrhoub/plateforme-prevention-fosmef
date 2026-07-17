# Architecture du Frontend - Plateforme Prévention FOSMEF

Ce document décrit l'architecture, l'organisation des répertoires et les flux de données de l'application frontend (Next.js avec App Router, configurée en JavaScript pur).

---

## 📂 Structure du Répertoire (`src/`)

L'application suit la structure Next.js standard avec le dossier `src/` contenant les pages de l'App Router, les utilitaires de communication API et les contextes d'état global en JavaScript (`.js` et `.jsx`).

```text
src/
├── app/                            # Pages et Layouts (Next.js App Router)
│   ├── layout.jsx                  # Layout global (contient l'AuthProvider)
│   ├── page.jsx                    # Page d'accueil / Root
│   ├── login/                      # Page de connexion
│   │   └── page.jsx
│   ├── register/                   # Page d'inscription
│   │   └── page.jsx
│   ├── campagnes/                  # Liste des campagnes
│   │   ├── page.jsx
│   │   └── [id]/                   # Détail d'une campagne
│   │       └── page.jsx
│   ├── mes-reservations/           # Historique des réservations (Adhérent)
│   │   └── page.jsx
│   └── admin/                      # Espace Administrateur / Gestionnaire
│       ├── dashboard/              # Tableau de bord global
│       │   └── page.jsx
│       └── campagnes/
│           └── [id]/
│               └── inscrits/       # Gestion des inscrits pour une campagne
│                   └── page.jsx
├── context/
│   └── AuthContext.jsx             # Gestion de l'état d'authentification (JWT)
└── lib/
    └── api.js                      # Client API centralisé (Axios/Fetch)
```

---

## ⚙️ Composants Clés de l'Architecture

### 1. Routage & Structure des Pages (`src/app/`)
L'application utilise le **App Router** de Next.js.
*   **Dossiers dynamiques `[id]`** : Utilisés pour le détail d'une campagne (`/campagnes/[id]`) et l'administration des inscrits d'une campagne spécifique (`/admin/campagnes/[id]/inscrits`).
*   **Organisation par rôle** :
    *   **Espace Adhérent** : `campagnes`, `mes-reservations`
    *   **Espace Admin/Gestionnaire** : Regroupé sous le préfixe `/admin/` pour simplifier la gestion des accès et le filtrage par rôle.

### 2. Client API Centralisé (`src/lib/api.js`)
*   Centralise tous les appels HTTP vers l'API backend Spring Boot.
*   Configure l'URL de base (ex: `http://localhost:8080/api`).
*   Injecte automatiquement le token JWT dans les en-têtes `Authorization: Bearer <token>` si l'utilisateur est connecté.
*   Gère globalement les erreurs (redirection en cas de token expiré / HTTP 401).

### 3. Gestion Globale de l'Utilisateur (`src/context/AuthContext.jsx`)
*   Enveloppe l'application dans un fournisseur d'état global (`AuthProvider`).
*   Stocke l'utilisateur actuel (`user`) et l'état de connexion (`isAuthenticated`).
*   Fournit les fonctions de connexion (`login`), déconnexion (`logout`) et maintient le token JWT (en local storage ou cookies sécurisés).

---

## 🔄 Flux de Données et Sécurité

1.  **Authentification** :
    *   L'utilisateur saisit ses identifiants sur `/login`.
    *   Appel API vers `/api/auth/login`. Le backend retourne un JWT.
    *   `AuthContext` récupère le token, le stocke, décode les informations utilisateur (rôle, email) et met à jour l'état global.
2.  **Appels API Sécurisés** :
    *   Chaque requête utilisant le client `api.js` inclut le JWT.
    *   Le backend vérifie la signature du token et valide les autorisations par rôle.
3.  **Contrôle d'Accès (Middleware ou Layout-level)** :
    *   Les pages sous `/admin/` vérifient que le rôle de l'utilisateur connecté dans le contexte est bien `GESTIONNAIRE` ou `ADMIN`. Sinon, redirection vers la page d'accueil ou de connexion.
