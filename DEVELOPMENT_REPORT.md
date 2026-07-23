# 📄 RAPPORT DE DÉVELOPPEMENT ET D'ARCHITECTURE TECHNIQUE — FOSMEF

**Projet :** Plateforme de Gestion des Campagnes de Prévention Médicale  
**Organisme :** Fondation des Œuvres Sociales du Personnel du Ministère de l'Économie et des Finances (FOSMEF)  
**Auteur :** Anas EL MARRHOUB  
**Date :** 23 Juillet 2026  

---

## 📑 Sommaire
1. [Vue d'Ensemble du Projet](#1-vue-densemble-du-projet)
2. [Décisions d'Architecture Technique et Arbitrages](#2-décisions-darchitecture-technique-et-arbitrages)
   - [2.1 Génération des Tickets PDF : OpenPDF (Java) vs jsPDF (Client-Side)](#21-génération-des-tickets-pdf--openpdf-java-vs-jspdf-client-side)
   - [2.2 Assistant Virtuel IA : Intégration de Google Gemini AI](#22-assistant-virtuel-ia--intégration-de-google-gemini-ai)
   - [2.3 Base de Données PostgreSQL & Synchronisation Dynamique Temps Réel](#23-base-de-données-postgresql--synchronisation-dynamique-temps-réel)
   - [2.4 Service d'Envoi d'Email Automatique & Pièce Jointe PDF (Nodemailer & Ethereal)](#24-service-denvoi-demail-automatique--pièce-jointe-pdf-nodemailer--ethereal)
3. [Détail des Fonctionnalités Implémentées](#3-détail-des-fonctionnalités-implémentées)
4. [Bilan et Perspectives](#4-bilan-et-perspectives)

---

## 1. Vue d'Ensemble du Projet

La plateforme FOSMEF est une application web moderne (Architecture découplée Next.js / Spring Boot) permettant la gestion intégrale des campagnes de prévention sanitaire au profit du personnel du Ministère de l'Économie et des Finances.

Le système propose deux espaces distincts :
* **Espace Adhérent :** Consultation des campagnes, réservation en ligne, génération automatique d'attestations/tickets de convocation PDF, notification par email, consultation de l'historique et assistance IA.
* **Espace Administration :** Création et pilotage des campagnes médicales, suivi des taux d'occupation, gestion de la liste des inscrits.

---

## 2. Décisions d'Architecture Technique et Arbitrages

### 2.1 Génération des Tickets PDF : OpenPDF (Java) vs jsPDF (Client-Side)

#### ❌ L'Approche Initiale Envisagée (OpenPDF Backend)
Une dépendance `com.github.librepdf:openpdf:3.0.5` avait initialement été ajoutée dans le fichier `backend/pom.xml` pour générer les documents PDF côté serveur Spring Boot.

**Limites constatées de l'approche backend (OpenPDF) :**
1. **Consommation de Ressources Serveur :** Le rendu graphique et la compilation de fichiers binaire PDF par la JVM sur le serveur Spring Boot consomment de la mémoire RAM et des cycles CPU importants lors de pic d'affluence.
2. **Latence Réseau Accrue :** Le flux binaire PDF devait voyager depuis le serveur Java jusqu'au navigateur via HTTP.
3. **Complexité du Design :** La mise en page avec OpenPDF en Java nécessite un code verbeux pour gérer la disposition graphique des cartes, bordures et logos.

#### ✅ La Solution Retenue et Implémentée (jsPDF Frontend)
Nous avons fait le choix stratégique de retirer `openpdf` du `pom.xml` backend et d'implémenter la génération côté client grâce au module utilitaire [`pdfGenerator.js`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/lib/pdfGenerator.js) basé sur **`jsPDF`**.

**Avantages majeurs de l'alternatives `jsPDF` :**
* **Instantannéité & Zéro Latence :** Le document est généré en quelques millisecondes directement par le navigateur de l'utilisateur sans aucun appel réseau binaire.
* **Rendu Vectoriel Haute Définition :** Intégration des logos officiels du **Ministère de l'Économie et des Finances** (`/ministere-logo.png`) et de la **FOSMEF** (`/fos-logo.png`) convertis en Data URLs Base64.
* **Format Administratif Officiel :** Conception d'une attestation officielle de convocation comprenant :
  * En-tête institutionnel complet (*ROYAUME DU MAROC*, *Ministère de l'Économie et des Finances*, *FOSMEF*).
  * Numéro de référence officiel automatisé (`RÉF : FOS/PM-2026-XXXXX`).
  * Charte graphique exacte du projet (Bleu Nuit `#19365D` et Teal `#009BA4`).
  * Informations de l'adhérent (Nom, Prénom, Matricule PPR, Email, Téléphone).
  * Consignes réglementaires et pièces à présenter au centre de consultation.
  * Code de vérification automatisé et graphisme de code-barres de sécurité.

---

### 2.2 Assistant Virtuel IA : Intégration de Google Gemini AI

Pour offrir une assistance 24/7 aux adhérents, un chatbot alimenté par le modèle **Google Gemini AI** a été développé.

#### Architecture Technique de l'IA :
1. **SDK Officiel Google :** Installation de `@google/generative-ai` dans le projet frontend Next.js.
2. **Route API Sécurisée ([`frontend/src/app/api/chat/route.js`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/app/api/chat/route.js)) :**
   * Masquage de la clé `GEMINI_API_KEY`.
   * **System Prompt personnalisé :** Définition de la persona "Assistant FOSMEF AI" spécialisé dans l'accompagnement des adhérents et les conseils de prévention médicale.
   * **Stratégie de Fallback Automatisé des Modèles :** En raison des variations de versions d'API et de formules de clés, une boucle de repli automatique teste dans l'ordre : `gemini-2.5-flash`, `gemini-1.5-flash-latest`, `gemini-2.0-flash`, `gemini-1.5-pro-latest`, `gemini-1.5-flash`.
   * **Conformité du Rôle de l'Historique :** L'historique transmis au SDK est filtré pour garantir que la séquence de messages débute impérativement par le rôle `'user'`, évitant les erreurs d'initialisation SDK (`First content should be with role 'user'`).
3. **Interface Utilisateur Flottante ([`ChatbotWidget.jsx`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/components/ChatbotWidget.jsx)) :**
   * Widget flottant positionné en bas à droite de l'écran avec badge lumineux d'état.
   * Réponses formatées avec gestion des listes à puces et de la mise en gras.
   * Boutons de suggestions de questions rapides en 1 clic (*"Comment réserver une place ?"*, *"Où télécharger mon ticket PDF ?"*, *"Conseils de prévention santé"*).
   * Indicateur d'animation de frappe (*typing indicator*) pendant la réflexion de l'IA.
   * Intégration globale dans `AdherentLayout` et `AdminLayout`.

---

### 2.3 Base de Données PostgreSQL & Synchronisation Dynamique Temps Réel

#### Données Utilisateur & Persistance :
* Table `users` sous PostgreSQL 15 (Docker) contenant les attributs : `id`, `email`, `nom`, `prenom`, `ppm` (Matricule PPR), `telephone`, `role`, `password`.
* Mise à jour effective des profils en base de données (Exemple : `Nom: El Marrhoub`, `Prénom: Anas`, `Matricule: PPR-198742`, `Téléphone: 0649906142`).

#### Élimination Totale des Données Statiques :
* Mise à jour du contexte d'authentification React ([`AuthContext.jsx`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/context/AuthContext.jsx)).
* Au chargement ou rafraîchissement de n'importe quelle page, `AuthContext` interroge automatiquement l'API backend `GET /api/auth/me`.
* Toute modification effectuée en base de données PostgreSQL est ainsi répercutée instantanément sur l'ensemble de l'interface et dans les billets PDF.

---

### 2.4 Service d'Envoi d'Email Automatique & Pièce Jointe PDF (Nodemailer & Ethereal)

Pour garantir que l'adhérent reçoive une preuve écrite de sa convocation :

1. **Génération & Encodage du Ticket PDF :**
   La fonction `generateTicketPDF` de [`pdfGenerator.js`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/lib/pdfGenerator.js) produit le document officiel et extrait sa représentation en binaire Base64 (`pdfBase64`).
2. **Route API d'Envoi d'Email ([`send-ticket/route.js`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/app/api/email/send-ticket/route.js)) :**
   * Implémentée avec le module **Nodemailer**.
   * Reçoit le flux PDF Base64 et l'attache directement sous forme de pièce jointe nommée `Attestation_Reservation_FOSMEF_XXXX.pdf`.
   * **Gabarit HTML Institutionnel :** Intègre un corps d'email aux couleurs officielles FOSMEF (Bleu Nuit `#19365D`, Teal `#009BA4`) récapitulant les détails de la convocation.
3. **Système de Test et Simulation (Ethereal Mail) :**
   * Si les identifiants SMTP réels ne sont pas configurés dans `.env.local`, la route crée dynamiquement un compte de test **Ethereal Mail**.
   * Génère un lien de visualisation d'email sécurisé (`previewUrl`) permettant d'inspecter l'email et son attestation PDF directement dans le navigateur.
   * Support complet de tout serveur SMTP réel (Gmail, Brevo, SMTP Ministère).

---

## 3. Détail des Fonctionnalités Implémentées

| Fonctionnalité | Composant / Fichier | Statification |
| :--- | :--- | :--- |
| 🎟️ **Billet PDF automatique à la confirmation** | [`campagnes/[id]/page.jsx`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/app/campagnes/%5Bid%5D/page.jsx) | ✅ Opérationnel (Téléchargement auto lors du clic sur *Confirmer*) |
| ✉️ **Envoi d'Email de confirmation avec PDF joint** | [`send-ticket/route.js`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/app/api/email/send-ticket/route.js) | ✅ Opérationnel (Envoi automatique avec le ticket PDF officiel en pièce jointe) |
| 📄 **Téléchargement Billet PDF depuis l'historique** | [`mes-reservations/page.jsx`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/app/mes-reservations/page.jsx) | ✅ Opérationnel (Bouton *Ticket PDF* près du bouton *Annuler*) |
| 📜 **Mise en page administrative officielle du PDF** | [`pdfGenerator.js`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/lib/pdfGenerator.js) | ✅ Opérationnel (Logos Ministère & FOSMEF, référence officielle, couleurs de charte) |
| 🤖 **Chatbot IA Gemini (Assistant FOSMEF AI)** | [`ChatbotWidget.jsx`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/components/ChatbotWidget.jsx) & [`route.js`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/app/api/chat/route.js) | ✅ Opérationnel (Route `/api/chat`, SDK `@google/generative-ai`, widget UI flottant) |
| 🔄 **Synchronisation Live Profil DB** | [`AuthContext.jsx`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/frontend/src/context/AuthContext.jsx) | ✅ Opérationnel (Actualisation automatique via `/api/auth/me`) |
| 🧹 **Nettoyage Dépendances Backend** | [`backend/pom.xml`](file:///c:/Users/anase/OneDrive/Bureau/plateforme-prevention-fosmef/backend/pom.xml) | ✅ Opérationnel (Retrait d'OpenPDF obsolète) |

---

## 4. Bilan et Perspectives

L'application respecte désormais les plus hauts standards techniques et visuels institutionnels :
* **Performance :** Génération de PDF instantanée et envoi d'email sans surcharge backend.
* **Modernité :** Assistance IA basée sur les LLM récents (Google Gemini).
* **Conformité visuelle :** Intégration stricte de la charte graphique et des emblèmes officiels du Ministère de l'Économie et des Finances et de la FOSMEF.
* **Dynanisme :** Aucune donnée en dur (0% static name), tout le profil est issu dynamiquement de PostgreSQL.
