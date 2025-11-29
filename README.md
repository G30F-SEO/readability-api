# CrossFit Program Builder

Application complète pour créer et gérer vos programmes d'entraînement CrossFit personnalisés.

## Fonctionnalités

### 📚 Bibliothèque d'Exercices
- Gestion complète d'une bibliothèque d'exercices CrossFit
- 30 exercices pré-chargés (Gymnastique, Haltérophilie, Cardio, Kettlebell, Core, Haltères)
- CRUD complet : Créer, Lire, Modifier, Supprimer
- Classification par catégorie, difficulté et équipement requis

### 🎯 Gestion de Programmes
- Créer des programmes d'entraînement personnalisés
- Définir la durée, le niveau de difficulté et les objectifs
- Organiser les programmes sur plusieurs semaines
- Associer plusieurs WODs à chaque programme

### 💪 Planification de WODs (Workout of the Day)
- Créer des WODs avec différents types :
  - AMRAP (As Many Rounds As Possible)
  - For Time
  - EMOM (Every Minute On the Minute)
  - Tabata
  - Chipper
  - Custom
- Configurer la durée, le nombre de rounds
- Associer des exercices à chaque WOD
- Organiser les WODs par jour de programme

### 📊 Suivi de Progression
- Enregistrer vos performances après chaque workout
- Tracker les rounds complétés, le temps, les poids utilisés
- Noter vos sessions (1-5 étoiles)
- Visualiser vos statistiques globales
- Ajouter des notes personnelles

### 🤖 Générateur Automatique de Programmes
- Génération intelligente de programmes complets
- Paramètres personnalisables :
  - Niveau de difficulté (Débutant, Intermédiaire, Avancé)
  - Durée du programme (en semaines)
  - Objectifs spécifiques
- Création automatique de 5 WODs par semaine
- Variation des types de WODs et exercices
- Adaptation des répétitions selon le niveau

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

L'application sera accessible sur http://localhost:3000

## Technologies utilisées

- **Backend**: Node.js, Express
- **Base de données**: SQLite (better-sqlite3)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API**: RESTful

## Structure de la base de données

- `exercises` : Bibliothèque d'exercices
- `programs` : Programmes d'entraînement
- `wods` : Workouts of the Day
- `wod_exercises` : Relation many-to-many entre WODs et exercices
- `progress` : Suivi des performances

## API Endpoints

### Exercices
- `GET /api/exercises` - Liste tous les exercices
- `GET /api/exercises/:id` - Détails d'un exercice
- `POST /api/exercises` - Créer un exercice
- `PUT /api/exercises/:id` - Modifier un exercice
- `DELETE /api/exercises/:id` - Supprimer un exercice

### Programmes
- `GET /api/programs` - Liste tous les programmes
- `GET /api/programs/:id` - Détails d'un programme avec WODs
- `POST /api/programs` - Créer un programme
- `PUT /api/programs/:id` - Modifier un programme
- `DELETE /api/programs/:id` - Supprimer un programme
- `POST /api/programs/generate` - Générer un programme automatique

### WODs
- `GET /api/wods` - Liste tous les WODs
- `GET /api/wods/:id` - Détails d'un WOD avec exercices
- `POST /api/wods` - Créer un WOD
- `PUT /api/wods/:id` - Modifier un WOD
- `DELETE /api/wods/:id` - Supprimer un WOD

### Progression
- `GET /api/progress` - Liste toutes les entrées de progression
- `POST /api/progress` - Enregistrer une performance
- `DELETE /api/progress/:id` - Supprimer une entrée

### Utilitaires
- `GET /api/categories` - Liste des catégories d'exercices

## Exemples d'utilisation

### Générer un programme automatique

Utilisez l'onglet "Générateur" pour créer un programme complet :
1. Sélectionnez votre niveau (débutant/intermédiaire/avancé)
2. Définissez la durée en semaines (1-12)
3. Spécifiez votre objectif (force, endurance, etc.)
4. Cliquez sur "Générer le programme"

Le système créera automatiquement :
- Un programme avec le nombre de semaines choisi
- 5 WODs par semaine (du lundi au vendredi)
- Exercices adaptés à votre niveau
- Variation des types de WODs (AMRAP, For Time, EMOM, Tabata)

### Suivre votre progression

1. Après avoir complété un WOD, cliquez sur "Enregistrer performance"
2. Entrez vos résultats (rounds, temps, poids)
3. Notez votre session
4. Consultez l'onglet "Progression" pour voir vos stats

## Licence

MIT
