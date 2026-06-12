const API_KEY  = import.meta.env.VITE_OMDB_API_KEY ?? '';
const BASE_URL = 'https://www.omdbapi.com/';

const MAX_HISTORY = 8;

const LS_FAVORITES = 'netflux_favorites';
const LS_HISTORY   = 'netflux_history';

function normalizeError(raw) {
  if (raw instanceof Error) {
    return { code: 'NETWORK', message: 'Connexion impossible. Vérifiez votre réseau.' };
  }
  const msg = typeof raw === 'string' ? raw.toLowerCase() : '';
  if (msg.includes('not found') || msg.includes('movie not found')) {
    return { code: 'NOT_FOUND', message: 'Aucun résultat pour cette recherche.' };
  }
  if (msg.includes('invalid api')) {
    return { code: 'API_KEY', message: 'Clé API invalide. Vérifiez VITE_OMDB_API_KEY.' };
  }
  return { code: 'UNKNOWN', message: raw || 'Une erreur inattendue est survenue.' };
}

function buildUrl(params) {
  const qs = new URLSearchParams({ apikey: API_KEY, ...params });
  return `${BASE_URL}?${qs.toString()}`;
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    throw normalizeError(err instanceof Error ? err : new Error(String(err)));
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw normalizeError(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw normalizeError(data.Error ?? 'Unknown OMDB error');
  }

  return data;
}

export async function searchMovies(query, { type = '', page = 1 } = {}) {
  const params = { s: query.trim(), page: String(page) };
  if (type) params.type = type;

  const data = await fetchJson(buildUrl(params));

  return {
    results:     (data.Search ?? []),
    totalResults: parseInt(String(data.totalResults ?? '0'), 10),
  };
}
export async function getMovieById(imdbID) {
  const data = await fetchJson(buildUrl({ i: imdbID, plot: 'full' }));
  return (data);
}

export async function getMovieByTitle(title, type = '') {
  const params = { t: title.trim(), plot: 'full' };
  if (type) params.type = type;
  const data = await fetchJson(buildUrl(params));
  return /** @type {MovieDetail} */ (data);
}

export function getFavorites() {
  try {
    const raw = localStorage.getItem(LS_FAVORITES);
    return raw ?  (JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(movie) {
  const favorites = getFavorites();
  const idx = favorites.findIndex((f) => f.imdbID === movie.imdbID);
  let added = false;

  if (idx === -1) {
    favorites.unshift(movie);
    added = true;
  } else {
    favorites.splice(idx, 1);
  }

  try {
    localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites));
  } catch {
    console.warn('[Netflux] localStorage quota exceeded, favorites not saved.');
  }

  return { favorites, added };
}

export function isFavorite(imdbID) {
  return getFavorites().some((f) => f.imdbID === imdbID);
}

export function getSearchHistory() {
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    return raw ? (JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function addToHistory(query) {
  const trimmed = query.trim();
  if (!trimmed) return getSearchHistory();

  const history = getSearchHistory().filter((h) => h !== trimmed);
  history.unshift(trimmed);
  const trimmed_history = history.slice(0, MAX_HISTORY);

  try {
    localStorage.setItem(LS_HISTORY, JSON.stringify(trimmed_history));
  } catch {
    console.warn('[Netflux] localStorage quota exceeded, history not saved.');
  }

  return trimmed_history;
}

export function clearHistory() {
  try {
    localStorage.removeItem(LS_HISTORY);
  } catch { /* silencieux */ }
}

export function getPosterUrl(poster) {
  return poster && poster !== 'N/A' ? poster : null;
}

export function formatRating(rating) {
  return rating && rating !== 'N/A' ? rating : '–';
}

export function formatYear(year) {
  return year ? year.split('–')[0] : '–';
}
