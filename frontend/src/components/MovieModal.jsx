import PropTypes from "prop-types";

function MovieModal({ movie, isLoading, onClose }) {
  if (!movie && !isLoading) return null;

  return (
    <div className="movie-modal__overlay" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        <button className="movie-modal__close" onClick={onClose}>
          ×
        </button>

        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <>
            <h2>{movie.Title} ({movie.Year})</h2>
            {movie.Poster && movie.Poster !== "N/A" && (
              <img
                className="movie-modal__poster"
                src={movie.Poster}
                alt={movie.Title}
              />
            )}
            <p><strong>Genre :</strong> {movie.Genre}</p>
            <p><strong>Realisateur :</strong> {movie.Director}</p>
            <p><strong>Acteurs :</strong> {movie.Actors}</p>
            <p><strong>Synopsis :</strong> {movie.Plot}</p>
            <p><strong>Note IMDB :</strong> {movie.imdbRating}</p>
          </>
        )}
      </div>
    </div>
  );
}

MovieModal.propTypes = {
  movie: PropTypes.object,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

MovieModal.defaultProps = {
  movie: null,
  isLoading: false,
};

export default MovieModal;
