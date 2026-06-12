import PropTypes from "prop-types";

function MovieCard({ movie, onSelect }) {
  const poster =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x445?text=No+Poster";

  return (
    <div className="movie-card" onClick={() => onSelect(movie)}>
      <img className="movie-card__poster" src={poster} alt={movie.Title} />
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.Title}</h3>
        <p className="movie-card__year">{movie.Year}</p>
        <span className="movie-card__type">{movie.Type}</span>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    imdbID: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Year: PropTypes.string,
    Type: PropTypes.string,
    Poster: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MovieCard;
