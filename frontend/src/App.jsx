import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import { searchMovies, getMovieDetails } from "./services/api";
import "./App.css";

const DEFAULT_CATEGORIES = [
  { title: "Populaires", query: "love" },
  { title: "Action & Aventure", query: "war" },
  { title: "Suggestions", query: "man" },
];

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [rows, setRows] = useState([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);

  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    async function loadDefaultRows() {
      setIsLoadingRows(true);
      try {
        const results = await Promise.all(
          DEFAULT_CATEGORIES.map((cat) =>
            searchMovies(cat.query)
              .then((data) => ({ title: cat.title, movies: data.Search || [] }))
              .catch(() => ({ title: cat.title, movies: [] }))
          )
        );
        setRows(results);
      } finally {
        setIsLoadingRows(false);
      }
    }
    loadDefaultRows();
  }, []);

  async function handleSearchSubmit() {
    const query = searchValue.trim();
    if (!query) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const data = await searchMovies(query);
      setSearchResults(data.Search || []);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSelectMovie(movie) {
    setIsModalLoading(true);
    setSelectedMovie({});

    try {
      const details = await getMovieDetails(movie.imdbID);
      setSelectedMovie(details);
    } catch (err) {
      setError(err.message);
      setSelectedMovie(null);
    } finally {
      setIsModalLoading(false);
    }
  }

  function handleCloseModal() {
    setSelectedMovie(null);
  }

  function applyFilter(list) {
    return list.filter((movie) => {
      if (activeFilter === "all") return true;
      return movie.Type === activeFilter;
    });
  }

  const isSearchMode = searchResults !== null;

  return (
    <div className="app">
      <Navbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
      />

      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <main className="app__content">
        {error && <p className="app__message app__message--error">{error}</p>}

        {isSearchMode ? (
          <>
            {isSearching && <p className="app__message">Chargement...</p>}

            {!isSearching && applyFilter(searchResults).length === 0 && (
              <p className="app__message">Aucun titre trouvé pour cette recherche</p>
            )}

            <div className="app__grid">
              {applyFilter(searchResults).map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} onSelect={handleSelectMovie} />
              ))}
            </div>
          </>
        ) : (
          // ── Mode accueil : rangées par catégorie ──
          <>
            {isLoadingRows && <p className="app__message">Chargement...</p>}

            {!isLoadingRows &&
              rows.map((row) => {
                const filtered = applyFilter(row.movies);
                if (filtered.length === 0) return null;

                return (
                  <section className="app__row" key={row.title}>
                    <h2 className="app__row-title">{row.title}</h2>
                    <div className="app__grid">
                      {filtered.map((movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} onSelect={handleSelectMovie} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </>
        )}
      </main>

      <MovieModal
        movie={selectedMovie}
        isLoading={isModalLoading}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
