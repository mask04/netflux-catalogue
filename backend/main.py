import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import httpx

load_dotenv()

OMDB_API_KEY = os.getenv("OMDB_API_KEY")
OMDB_BASE_URL = "https://www.omdbapi.com/"

app = FastAPI(title="Netflux Catalogue API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def check_api_key():
    if not OMDB_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OMDB_API_KEY manquante. Verifie ton fichier .env",
        )


@app.get("/")
def root():
    return {"message": "Netflux Catalogue API - voir /docs pour la documentation"}


@app.get("/search")
async def search_movies(q: str = Query(..., min_length=0, description="Titre a rechercher")):
    """Recherche des films/series via OMDB (?s=...)"""
    check_api_key()

    params = {"s": q, "apikey": OMDB_API_KEY}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(OMDB_BASE_URL, params=params, timeout=10.0)
        except httpx.RequestError:
            # API OMDB injoignable
            raise HTTPException(status_code=502, detail="API OMDB injoignable")

    data = response.json()

    if data.get("Response") == "False":
        raise HTTPException(
            status_code=404,
            detail=data.get("Error", "Aucun titre trouve pour cette recherche"),
        )

    return data


@app.get("/movies/{imdb_id}")
async def get_movie(imdb_id: str):
    """Detail complet d'un film via OMDB (?i=...)"""
    check_api_key()

    params = {"i": imdb_id, "apikey": OMDB_API_KEY}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(OMDB_BASE_URL, params=params, timeout=10.0)
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="API OMDB injoignable")

    data = response.json()

    if data.get("Response") == "False":
        raise HTTPException(status_code=404, detail="Film introuvable")

    return data


@app.get("/genres")
def get_genres():
    """
    Liste de genres disponibles pour le filtre.
    OMDB ne fournit pas d'endpoint dedie -> liste statique cote back.
    A adapter selon les besoins du FilterBar.
    """
    return {
        "genres": [
            "Action",
            "Comedy",
            "Drama",
            "Horror",
            "Sci-Fi",
            "Animation",
            "Documentary",
        ]
    }
