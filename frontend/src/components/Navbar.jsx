import PropTypes from "prop-types";

function Navbar({ searchValue, onSearchChange, onSearchSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSearchSubmit();
  }

  return (
    <nav className="navbar">
      <h1 className="navbar__logo">NETFLUX</h1>

      <form className="navbar__search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Rechercher un film ou une serie..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>
    </nav>
  );
}

Navbar.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
};

export default Navbar;
