# Netflux Catalogue

SPA React + API Python (FastAPI) - Catalogue de films/series via OMDB API.

## Demarrage rapide

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # puis renseigner OMDB_API_KEY
uvicorn main:app --reload
```
-> http://localhost:8000 (docs sur /docs)

### Frontend
```bash
cd frontend
npm install
npm start
```
-> http://localhost:3000

## Structure
Voir le document de specs complet (netflux-README.docx) pour le detail
des criteres d'evaluation, la repartition des taches et l'architecture.

## A faire (TODO equipe)
- [ ] Backend : verifier les routes /search, /movies/{id}, /genres
- [ ] Frontend : brancher la recherche reelle (App.jsx fait une recherche par defaut "batman")
- [ ] FilterBar : adapter les filtres Type (movie/series) selon OMDB
- [ ] MovieModal : verifier l'affichage des champs OMDB
- [ ] Tests cross-navigateur + responsive mobile
- [ ] Verifier zero erreur console (PropTypes, keys)
