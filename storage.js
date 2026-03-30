
const KEYS = {
  FAVORITES: 'hs_favorites',
  THEME: 'hs_theme',
  STATS: 'hs_dashboard_stats',
};

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEYS.FAVORITES) || '[]');
}

export function saveFavorites(arr) {
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(arr));
}

export function addFavorite(exercise) {
  const favs = getFavorites();
  if (!favs.find(f => f.id === exercise.id)) {
    saveFavorites([...favs, exercise]);
    return true;
  }
  return false;
}

export function removeFavorite(id) {
  saveFavorites(getFavorites().filter(f => f.id !== id));
}

export function isFavorite(id) {
  return getFavorites().some(f => f.id === id);
}

export function getTheme() {
  return localStorage.getItem(KEYS.THEME) || 'dark';
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme);
}

export function getDashboardStats() {
  return JSON.parse(localStorage.getItem(KEYS.STATS) || JSON.stringify({
    calories: 0,
    steps: 0,
    water: 0,
    workoutMinutes: 0,
  }));
}

export function saveDashboardStats(stats) {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}
