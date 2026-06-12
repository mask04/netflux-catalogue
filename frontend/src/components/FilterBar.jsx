import PropTypes from "prop-types";

function FilterBar({ activeFilter, onFilterChange }) {
    const filters = [
        { key: "all", label: "Tout" },
        { key: "movie", label: "Films" },
        { key: "series", label: "Séries"}
    ];

    return (
        <div className="filter-bar">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    className={
                        activeFilter === filter.key
                        ? "filter-bar__btn filter-bar__btn--active"
                        : "filter-bar__btn"
                    }
                    onClick={() => onFilterChange(filter.key)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}

FilterBar.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;