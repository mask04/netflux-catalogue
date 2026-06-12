# Netflux Catalogue

SPA React + API Python (FastAPI) - Catalogue de films/series via OMDB API.

## Démarrage rapide

### Backend

```bash
cd backend
pip install -r requirements.txt
echo "OMDB_API_KEY=ta_clé" > .env
uvicorn main:app --reload
```
-> API disponible sur http://localhost:8000 (docs sur /docs)

> ⚠️ Génère ta clé gratuite sur https://www.omdbapi.com/apikey.aspx
> et confirme-la via l'email reçu avant utilisation.

### Frontend

```bash
cd frontend
npm install
npm start
```
-> App disponible sur http://localhost:3000

> Le frontend n'a pas besoin de clé API : il passe par le backend
> (http://localhost:8000), qui se charge des appels vers OMDB.

## Structure
Voir le document de specs complet (netflux-README.docx) pour le détail
des critères d'évaluation, la répartition des tâches et l'architecture.
