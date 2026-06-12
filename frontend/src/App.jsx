import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import { searchMovies, getMovieDetails } from "./services/api";
import "./App.css";

function App() {

  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  async function handleSearch() {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchMovies(searchValue);
      setMovies(data.Search || []);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setSearchValue("");
  }, []);

  useEffect(() => {
    if (searchValue) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

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

  const filteredMovies = movies.filter((movie) => {
    if (activeFilter === "all") return true;
    return movie.Type === activeFilter;
  });

  return (
    <div className="app">
      <Navbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearch}
      />

      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <main className="app__content">
        {isLoading && <p className="app__message">Chargement...</p>}

        {error && !isLoading && (
          <p className="app__message app__message--error">{error}</p>
        )}

        {!isLoading && !error && filteredMovies.length === 0 && (
          <p className="app__message">Aucun titre trouve pour cette recherche</p>
        )}

        <div className="app__grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} onSelect={handleSelectMovie} />
          ))}
        </div>
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
