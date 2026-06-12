from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

app = FastAPI(title="Netflix Catalogue API")

# Autorise le front React (port 3000) à parler au back
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------
# Données en dur (pas de base de données ici)
# Dans un vrai projet, on utiliserait PostgreSQL etc.
# -----------------------------------------------
MOVIES = [
    {
        "id": 1,
        "title": "Stranger Things",
        "type": "serie",
        "genre": "Sci-Fi",
        "year": 2022,
        "rating": 96,
        "description": "Des ados d'Hawkins affrontent des forces surnaturelles.",
        "thumbnail": "🌌",
        "color": "#1a1a3e",
        "seasons": 4,
        "is_new": False,
    },
    {
        "id": 2,
        "title": "Dark",
        "type": "serie",
        "genre": "Sci-Fi",
        "year": 2020,
        "rating": 97,
        "description": "Quatre familles piégées dans un cycle temporel à Winden.",
        "thumbnail": "⏳",
        "color": "#1e0e2b",
        "seasons": 3,
        "is_new": False,
    },
    {
        "id": 3,
        "title": "The Last of Us",
        "type": "serie",
        "genre": "Drame",
        "year": 2023,
        "rating": 98,
        "description": "Un survivant escorte une jeune fille à travers un monde ravagé.",
        "thumbnail": "🏚",
        "color": "#2d1b1b",
        "seasons": 1,
        "is_new": True,
    },
    {
        "id": 4,
        "title": "Breaking Bad",
        "type": "serie",
        "genre": "Thriller",
        "year": 2013,
        "rating": 99,
        "description": "Un prof de chimie devient le plus grand fabricant de drogue du Nouveau-Mexique.",
        "thumbnail": "🏜️",
        "color": "#2b1e0e",
        "seasons": 5,
        "is_new": False,
    },
    {
        "id": 5,
        "title": "Wednesday",
        "type": "serie",
        "genre": "Comédie",
        "year": 2023,
        "rating": 88,
        "description": "Les aventures surnaturelles de Wednesday Addams à l'académie Nevermore.",
        "thumbnail": "🎭",
        "color": "#2d1b2d",
        "seasons": 1,
        "is_new": True,
    },
    {
        "id": 6,
        "title": "Inception",
        "type": "film",
        "genre": "Sci-Fi",
        "year": 2010,
        "rating": 94,
        "description": "Un voleur s'infiltre dans les rêves pour planter une idée.",
        "thumbnail": "🌀",
        "color": "#0e1e2b",
        "seasons": None,
        "is_new": False,
    },
    {
        "id": 7,
        "title": "Squid Game",
        "type": "serie",
        "genre": "Thriller",
        "year": 2022,
        "rating": 92,
        "description": "Des candidats endettés jouent leur vie dans des jeux mortels.",
        "thumbnail": "🃏",
        "color": "#2b0e0e",
        "seasons": 2,
        "is_new": True,
    },
    {
        "id": 8,
        "title": "Black Mirror",
        "type": "serie",
        "genre": "Sci-Fi",
        "year": 2023,
        "rating": 90,
        "description": "Anthologie sur les dérives technologiques de notre société.",
        "thumbnail": "🔬",
        "color": "#0e1e2b",
        "seasons": 6,
        "is_new": True,
    },
]


@app.get("/movies", response_model=List[dict])
def get_movies(genre: Optional[str] = None, type: Optional[str] = None):
    """
    Retourne tous les films/séries.
    Paramètres optionnels :
      - genre : filtre par genre (ex: Sci-Fi, Thriller)
      - type  : filtre par type (film ou serie)
    """
    results = MOVIES

    if genre:
        results = [m for m in results if m["genre"].lower() == genre.lower()]

    if type:
        results = [m for m in results if m["type"].lower() == type.lower()]

    return results


@app.get("/movies/{movie_id}")
def get_movie(movie_id: int):
    """
    Retourne un film/série par son ID.
    """
    for movie in MOVIES:
        if movie["id"] == movie_id:
            return movie
    return {"error": "Film non trouvé"}, 404


@app.get("/genres")
def get_genres():
    """
    Retourne la liste de tous les genres disponibles.
    """
    genres = list(set(m["genre"] for m in MOVIES))
    return {"genres": sorted(genres)}
