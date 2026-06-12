/**
 * Netflux Catalogue - Services API
 * ---------------------------------
 * Toutes les fonctions de fetch vers le backend FastAPI.
 * Le backend tourne sur http://localhost:8000 et proxy l'API OMDB.
 */

const API_BASE_URL = "http://localhost:8000";

export async function searchMovies(query) {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Aucun titre trouvé pour cette recherche");
    }
    if (response.status === 502) {
      throw new Error("API OMDB injoignable");
    }
    throw new Error("Erreur lors de la recherche");
  }

  return response.json();
}

export async function getMovieDetails(imdbId) {
  const response = await fetch(`${API_BASE_URL}/movies/${imdbId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Film introuvable");
    }
    throw new Error("Erreur lors de la récupération du film");
  }

  return response.json();
}

export async function getGenres() {
  const response = await fetch(`${API_BASE_URL}/genres`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des genres");
  }

  return response.json();
}
