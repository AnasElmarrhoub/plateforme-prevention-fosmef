# 🏥 Plateforme de Gestion des Campagnes de Prévention Sanitaire — FOS-MEF

Plateforme web complète développée pour la **Fondation des Œuvres Sociales du personnel du Ministère de l'Économie et des Finances (FOS-MEF)**.

---

## 🛠️ Stack Technique

- **Backend** : Java 17, Spring Boot 3, Spring Security (JWT), Hibernate / Spring Data JPA, Maven.
- **Base de Données** : PostgreSQL 15 (exécuté sous Docker).
- **Frontend** : Next.js 16 (React 19), Tailwind CSS, JavaScript.
- **Documentation API** : Swagger UI / OpenAPI 3.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
1. [Git](https://git-scm.com/)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour exécuter la base de données PostgreSQL)
3. [JDK 17](https://www.oracle.com/java/technologies/downloads/#java17) (ou supérieur)
4. [Node.js (v18+)](https://nodejs.org/) & `npm`

---

## 🚀 Guide d'Installation et Exécution Pas à Pas

### 1️⃣ Cloner le Dépôt GitHub

Ouvrez un terminal et exécutez :

```bash
git clone https://github.com/AnasElmarrhoub/plateforme-prevention-fosmef.git
cd plateforme-prevention-fosmef
```

---

### 2️⃣ Lancer la Base de Données (PostgreSQL avec Docker)

1. Ouvrez l'application **Docker Desktop** sur votre ordinateur.
2. Allez dans le dossier `backend` :

```bash
cd backend
```

3. Démarrez le conteneur PostgreSQL :

```bash
docker compose up -d
```
*(ou `docker-compose up -d` selon votre version de Docker)*

> ℹ️ **Note** : La base de données PostgreSQL écoutera sur le port `5434` (`prevention_db`).

---

### 3️⃣ Lancer le Backend (Spring Boot)

Toujours depuis le dossier `backend` :

- **Sur Windows (Invite de commandes / PowerShell)** :
  ```cmd
  .\mvnw spring-boot:run
  ```
- **Sur Linux / macOS** :
  ```bash
  ./mvnw spring-boot:run
  ```

Le backend va démarrer sur **`http://localhost:8081`**.

> 💡 **Initialisation Automatique des Données** :
> Au premier démarrage, le backend crée automatiquement :
> - Le **compte Administrateur** : `admin@fosmef.ma` / `admin123`
> - Les **campagnes de démonstration** initialisées à 0% de réservation.

---

### 4️⃣ Lancer le Frontend (Next.js)

Ouvrez un **deuxième terminal**, puis rendez-vous dans le dossier `frontend` :

```bash
cd plateforme-prevention-fosmef/frontend
```

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

Le frontend s'exécute sur **`http://localhost:3000`** (ou **`http://localhost:3002`** si le port 3000 est occupé).

---

## 🔐 Identifiants de Test et Accès

| Service / Interface | URL | Identifiants |
| :--- | :--- | :--- |
| 🖥️ **Interface Frontend** | `http://localhost:3002` (ou `3000`) | — |
| 🛡️ **Espace Administration** | `http://localhost:3002` (Onglet *Administration*) | **Email** : `admin@fosmef.ma`<br>**Mot de passe** : `admin123` |
| 👤 **Espace Adhérent** | `http://localhost:3002/register` | Créer un nouveau compte adhérent |
| 📚 **Documentation API (Swagger UI)** | `http://localhost:8081/swagger-ui.html` | En-tête JWT Supported |

---

## 📁 Structure du Projet

```text
plateforme-prevention-fosmef/
├── backend/                  # Application Spring Boot (Java 17)
│   ├── docker-compose.yml    # Configuration Docker PostgreSQL
│   ├── src/main/java/        # Entités, Repositories, Services, Controllers, Security
│   └── src/main/resources/   # Configuration application.properties
├── frontend/                 # Application Next.js (React 19)
│   ├── src/app/              # Pages & Routes (Adhérent, Admin, Login, Profil)
│   ├── src/components/       # Composants réutilisables & Layouts (AdherentLayout, AdminLayout)
│   ├── src/context/          # AuthContext (Gestion du rôle et du Token JWT)
│   └── src/lib/              # Client API centralisé (api.js)
└── README.md
```

---

## 👥 Auteur
Projet développé dans le cadre de la plateforme de gestion des campagnes de prévention sanitaire FOS-MEF par **Anas EL-MARRHOUB**.