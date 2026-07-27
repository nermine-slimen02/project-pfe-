# HelpDesk Backend

## Description

HelpDesk Backend est une API REST développée avec **NestJS**, **Prisma** et **PostgreSQL** dans le cadre de mon Projet de Fin d'Études (PFE).

L'application permet de gérer le cycle de vie complet d'un ticket d'assistance informatique, depuis sa création jusqu'à sa résolution, avec gestion des interventions, commentaires, notifications, audit des actions et statistiques.

---

# Technologies utilisées

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger (OpenAPI)
- Bcrypt
- Class Validator
- Class Transformer

---

# Installation

Cloner le dépôt :

```bash
git clone https://github.com/nermine-slimen02/project-pfe-.git
```

Accéder au projet :

```bash
cd helpdesk-backend
```

Se placer sur la branche backend :

```bash
git checkout backend
```

Installer les dépendances :

```bash
npm install
```

---

# Variables d'environnement

Créer un fichier `.env` à la racine du projet.

Exemple :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/helpdesk_pfe"

JWT_SECRET=your_secret_key

PORT=3000
```

---

# Base de données

Exécuter les migrations :

```bash
npx prisma migrate dev
```

Générer Prisma Client :

```bash
npx prisma generate
```

Ouvrir Prisma Studio :

```bash
npx prisma studio
```

---

# Lancer le projet

Mode développement :

```bash
npm run start:dev
```

Compilation :

```bash
npm run build
```

---

# Documentation API

Swagger est disponible à l'adresse :

```
http://localhost:3000/api
```

---

# Fonctionnalités

## Authentification

- Authentification JWT
- Protection des routes
- Gestion des rôles

Rôles disponibles :

- USER
- TECHNICIAN
- SUPERVISOR
- ADMIN

---

## Module Tickets

Fonctionnalités :

- Création d'un ticket
- Modification d'un ticket
- Suppression
- Consultation
- Assignation à un technicien
- Gestion du SLA
- Calcul automatique de isLate

Routes :

```
POST   /tickets
GET    /tickets
GET    /tickets/:id
PATCH  /tickets/:id
PATCH  /tickets/:id/assign/:userId
```

---

## Module Interventions

Fonctionnalités :

- Création d'une intervention
- Démarrage d'une intervention
- Clôture d'une intervention
- Rapport
- Temps passé
- Actions réalisées
- Mise à jour automatique du statut du ticket

Routes :

```
POST   /interventions
GET    /interventions
GET    /interventions/:id
PATCH  /interventions/:id
DELETE /interventions/:id
PATCH  /interventions/:id/start
PATCH  /interventions/:id/finish
```

---

## Module Commentaires

Fonctionnalités :

- Ajout de commentaires
- Commentaires publics
- Notes internes
- Historique des commentaires

Routes :

```
POST   /comments
GET    /comments
GET    /comments/:id
GET    /comments/ticket/:ticketId
PATCH  /comments/:id
DELETE /comments/:id
```

---

## Module Notifications

Notifications automatiques lors de :

- Création d'un ticket
- Assignation
- Changement de statut
- Ajout d'un commentaire
- Résolution
- Ticket en retard

Fonctionnalités :

- Liste des notifications
- Notifications non lues
- Marquer comme lue

Routes :

```
POST   /notifications
GET    /notifications
GET    /notifications/user/:userId
GET    /notifications/user/:userId/unread-count
PATCH  /notifications/:id/read
PATCH  /notifications/:id
DELETE /notifications/:id
```

---

## Module Audit Log

Historique automatique des actions :

- Création du ticket
- Modification
- Assignation
- Changement de statut
- Intervention
- Résolution

Chaque historique contient :

- Utilisateur
- Action
- Ancienne valeur
- Nouvelle valeur
- Ticket concerné
- Date

Route :

```
GET /audit-logs/ticket/:ticketId
```

---

## Module Dashboard

Statistiques disponibles :

- Total des tickets
- Tickets ouverts
- Tickets résolus
- Tickets en retard
- Tickets critiques
- Tickets par statut
- Tickets par priorité
- Tickets par technicien
- Temps moyen de résolution

Route :

```
GET /dashboard/stats
```

---

# Sécurité

Le projet utilise :

- JWT Authentication
- Guards NestJS
- Role Guards
- ValidationPipe
- Class Validator

Les permissions sont gérées selon les rôles :

- USER
- TECHNICIAN
- SUPERVISOR
- ADMIN

---

# Tests

Tous les modules ont été testés avec Swagger.

Modules testés :

- Auth
- Tickets
- Interventions
- Commentaires
- Notifications
- Audit Logs
- Dashboard

---

# Captures d'écran

Le dossier `captures/` contient les captures Swagger des tests suivants :

- Auth Login
- Création Ticket
- Assignation Ticket
- Création Intervention
- Start Intervention
- Finish Intervention
- Création Commentaire
- Notifications
- Dashboard
- Audit Log

---

# Structure du projet

```
src
│
├── auth
├── users
├── tickets
├── interventions
├── comments
├── notifications
├── dashboard
├── audit-logs
├── prisma
└── main.ts
```

---

# Auteur

**Nermine Slimen**

Projet de Fin d'Études (PFE)

IMSET Sousse

2026

---

# Dépôt GitHub

Branche principale du backend :

```
backend
```

Projet :

```
https://github.com/nermine-slimen02/project-pfe-
```
