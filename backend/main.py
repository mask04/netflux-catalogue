"""
Netflux Catalogue - Backend API
--------------------------------
Proxy FastAPI vers l'API OMDB.

Routes :
- GET /search?q={titre}      -> recherche de films/series
- GET /movies/{imdbID}        -> detail complet d'un film
- GET /genres                 -> liste de genres (statique, OMDB ne fournit pas cette donnee)
"""
