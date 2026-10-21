# NER — Reconnaissance d'entités nommées en Darija

Projet full-stack pour analyser du texte en Darija marocaine et extraire des entités nommées (PER, LOC, ORG).  
Le dépôt contient :
- un backend **Django REST** (`backend`)
- un microservice IA **Flask + Transformers** (`ai-service`)
- un frontend **React + Vite** (`frontend`)
- une base **PostgreSQL** via Docker Compose.

## Fonctionnalités principales

- Authentification JWT (`/api/token/`, `/api/token/refresh/`)
- Inscription et gestion du profil utilisateur (`/api/users/register/`, `/api/users/me/`, `/api/users/change-password/`)
- Analyse NER d’un texte Darija via `/api/sentences/analyze/`
- Historique des phrases analysées par utilisateur (`/api/sentences/`, `/api/sentences/{id}/`)
- Statistiques utilisateur (`/api/sentences/stats/`)
- Endpoint santé du microservice IA (`/api/health`)

## Prérequis

- Docker
- Docker Compose

## Installation et lancement (méthode du dépôt)

Depuis la racine du projet :

```bash
docker compose up --build
```

Services exposés :
- Frontend : http://localhost:5173
- Backend Django : http://localhost:8000
- Microservice IA : http://localhost:5000
- PostgreSQL : localhost:5432

## Configuration

La configuration disponible dans le dépôt est principalement définie dans `docker-compose.yml` :

- Base PostgreSQL :
  - `POSTGRES_DB=ner_db`
  - `POSTGRES_USER=ner_user`
  - `POSTGRES_PASSWORD=ner_password`
- Backend :
  - `POSTGRES_HOST=db`
  - `POSTGRES_PORT=5432`
  - `AI_SERVICE_URL=http://ai-service:5000`

Informations non documentées explicitement dans le dépôt :
- aucune stratégie `.env` dédiée n’est fournie
- aucune procédure officielle de déploiement production n’est fournie.

## Exemples d’utilisation (API)

### 1) Inscription
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"Demo12345"}'
```

### 2) Obtention d’un token JWT
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"Demo12345"}'
```

### 3) Analyse d’un texte Darija (endpoint protégé)
```bash
curl -X POST http://localhost:8000/api/sentences/analyze/ \
  -H "Content-Type: application/json" \
  -H "Authorization: ******" \
  -d '{"text":"Mohammed Benali kayn f Casablanca, khdam f Maroc Telecom."}'
```

## Structure du projet

```text
.
├── ai-service/        # Microservice IA Flask (prédiction NER)
├── backend/           # API Django REST + persistance PostgreSQL
├── frontend/          # Interface React/Vite
└── docker-compose.yml # Orchestration des services
```

## Tests

- Des fichiers de tests Django existent (`backend/ner/tests.py`, `backend/users/tests.py`), mais ils sont actuellement vides.
- Aucun framework de tests frontend n’est configuré dans `frontend/package.json`.

## Contribution

Aucun guide `CONTRIBUTING` n’est présent dans le dépôt.  
Si vous souhaitez contribuer, ouvrez une issue ou une pull request avec une description claire des changements proposés.

## Licence

Aucun fichier de licence (`LICENSE`) n’a été trouvé dans le dépôt au moment de la rédaction.
