# CLAUDE.md — Readability API

## Aperçu du projet

API webhook légère en Node.js qui extrait le contenu lisible de pages web grâce à [Readability.js](https://github.com/mozilla/readability) de Mozilla. Elle récupère une URL, analyse le HTML et renvoie le texte nettoyé de l'article, son titre, son extrait et son auteur.

## Stack technique

- **Runtime :** Node.js (modules CommonJS)
- **Framework :** Express
- **Client HTTP :** Axios
- **Analyse HTML :** JSDOM + @mozilla/readability
- **Pas de TypeScript, pas d'étape de build** — JavaScript pur, exécuté directement avec `node`

## Structure du projet

```
readability-api/
├── index.js         # Application complète — serveur Express avec un unique endpoint /parse
├── package.json     # Dépendances et script de démarrage
└── CLAUDE.md        # Ce fichier
```

L'application tient dans un seul fichier. Toute la logique se trouve dans `index.js`.

## Démarrage rapide

```bash
npm install
npm start          # ou : node index.js
```

Le serveur écoute sur la variable d'environnement `PORT` (par défaut : `3000`).

## API

### POST /parse

Extrait le contenu lisible d'une URL.

**Requête :**
```json
{ "url": "https://example.com/article" }
```

**Réponse succès (200) :**
```json
{
  "title": "Titre de l'article",
  "content": "Texte extrait (max 10 000 caractères)",
  "excerpt": "Extrait de l'article ou null",
  "byline": "Nom de l'auteur ou null"
}
```

**Réponses d'erreur :**
- `400` — `url` manquant dans le corps de la requête
- `500` — Échec de récupération, d'analyse ou contenu illisible

## Détails d'implémentation

- Le contenu est tronqué à **10 000 caractères** (`article.textContent.slice(0, 10000)`)
- Les requêtes HTTP utilisent un **timeout de 10 secondes** et un en-tête générique `User-Agent: Mozilla/5.0`
- JSDOM reçoit l'URL d'origine pour la résolution correcte des URLs relatives
- L'application est **sans état** — pas de base de données, pas de cache, pas de stockage persistant

## Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT`   | `3000` | Port d'écoute du serveur |

## Notes de développement

- **Pas de tests** — aucun framework de test ni suite de tests configurés
- **Pas de linter/formatter** — aucune configuration ESLint ou Prettier
- **Pas de CI/CD** — aucun pipeline GitHub Actions ou de déploiement
- **Pas de .gitignore** — `node_modules` doit être exclu manuellement si nécessaire
- **Pas de Docker** — aucune configuration de conteneurisation

## Conventions de code

- Imports CommonJS avec `require()` (pas de modules ES)
- Handlers de routes asynchrones avec gestion d'erreurs try/catch
- JSON en entrée et en sortie partout
- Dépendances minimales — uniquement le nécessaire

## Tâches courantes

| Tâche | Commande |
|-------|----------|
| Installer les dépendances | `npm install` |
| Démarrer le serveur | `npm start` |
| Tester l'endpoint | `curl -X POST http://localhost:3000/parse -H "Content-Type: application/json" -d '{"url":"https://example.com"}'` |
