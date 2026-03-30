
import { fetchExercises, fetchBodyParts, fetchNutrition } from './js/api.js';
import {
    renderSkeletons, renderNutritionSkeletons, renderExerciseCards,
    renderNutritionResults, renderFavoriteCards, renderDashboardStats,
    showToast, showError, renderPagination, populateBodyPartFilter,
    renderExerciseModal,
} from './js/ui.js';
import {
    getFavorites, addFavorite, removeFavorite, isFavorite,
    getTheme, saveTheme, getDashboardStats, saveDashboardStats,
} from './js/storage.js';
import { debounce, filterExercises, sortExercises, paginate, reduceCalories } from './js/utils.js';

const state = {
    exercises: [],
    filteredExercises: [],
    currentPage: 1,
    pageSize: 12,
    sortKey: 'name',
    sortDir: 'asc',
    filters: { query: '', bodyPart: '', equipment: '' },
    currentExercise: null,
};

const $ = id => document.getElementById(id);
const exerciseGrid = $('exercise-grid');
const paginationEl = $('pagination');
const searchInput = $('search-input');
const bodyPartSelect = $('filter-bodypart');
const equipSelect = $('filter-equipment');
const sortSelect = $('sort-select');
const sortDirBtn = $('sort-dir-btn');
const favGrid = $('favorites-grid');
const nutritionForm = $('nutrition-form');
const nutritionInput = $('nutrition-input');
const nutritionGrid = $('nutrition-grid');
const themeToggle = $('theme-toggle');
const modal = $('exercise-modal');
const modalContent = $('modal-content');
const modalClose = $('modal-close');

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme());
    renderDashboardStats(getDashboardStats());
    setupNavigation();
    setupThemeToggle();
    setupExerciseSection();
    setupNutritionSection();
    setupFavoritesSection();
    setupDashboardEditing();
    setupModal();
});

function setupNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.page;
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const page = document.getElementById(`page-${target}`);
            if (page) {
                page.classList.add('active');
                if (target === 'favorites') refreshFavorites();
            }
        });
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setupThemeToggle() {
    if (!themeToggle) return;
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        saveTheme(next);
        showToast(`Switched to ${next} mode`, 'info');
    });
}

async function setupExerciseSection() {
    const parts = await fetchBodyParts();
    populateBodyPartFilter(parts, bodyPartSelect);

    await loadExercises();

    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            state.filters.query = searchInput.value.trim();
            state.currentPage = 1;
            applyFiltersAndRender();
        }, 400));
    }

    if (bodyPartSelect) {
        bodyPartSelect.addEventListener('change', async () => {
            const bp = bodyPartSelect.value;
            state.filters.bodyPart = bp === 'all' ? '' : bp;
            state.currentPage = 1;
            renderSkeletons(exerciseGrid, 6);
            await loadExercises(bp === 'all' ? '' : bp);
        });
    }

    if (equipSelect) {
        equipSelect.addEventListener('change', () => {
            state.filters.equipment = equipSelect.value;
            state.currentPage = 1;
            applyFiltersAndRender();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            state.sortKey = sortSelect.value;
            state.currentPage = 1;
            applyFiltersAndRender();
        });
    }

    if (sortDirBtn) {
        sortDirBtn.addEventListener('click', () => {
            state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
            sortDirBtn.textContent = state.sortDir === 'asc' ? '↑' : '↓';
            state.currentPage = 1;
            applyFiltersAndRender();
        });
    }
}

async function loadExercises(bodyPart = '') {
    renderSkeletons(exerciseGrid, 6);
    try {
        const data = await fetchExercises({ bodyPart, limit: 100 });
        state.exercises = data;
        state.filteredExercises = data;
        applyFiltersAndRender();
    } catch (err) {
        showError(exerciseGrid, 'Failed to load exercises. Please try again later.');
    }
}

function applyFiltersAndRender() {
    let result = filterExercises(state.exercises, state.filters);
    result = sortExercises(result, state.sortKey, state.sortDir);
    state.filteredExercises = result;

    const totalPages = Math.ceil(result.length / state.pageSize);
    const paginated = paginate(result, state.currentPage, state.pageSize);

    const countEl = document.getElementById('result-count');
    if (countEl) countEl.textContent = `${result.length} result${result.length !== 1 ? 's' : ''}`;

    const favBadge = document.getElementById('favorites-count');
    if (favBadge) favBadge.textContent = `❤️ ${getFavorites().length} saved`;

    renderExerciseCards(paginated, exerciseGrid, handleFavToggle);
    renderPagination(paginationEl, state.currentPage, totalPages, page => {
        state.currentPage = page;
        applyFiltersAndRender();
        exerciseGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    exerciseGrid.querySelectorAll('.exercise-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.fav-btn')) return;
            const ex = state.filteredExercises.find(x => x.id === card.dataset.id)
                || state.exercises.find(x => x.id === card.dataset.id);
            if (ex) openModal(ex);
        });
    });
}

function handleFavToggle(id) {
    const ex = state.exercises.find(x => x.id === id)
        || state.filteredExercises.find(x => x.id === id);
    if (!ex) return;

    if (isFavorite(id)) {
        removeFavorite(id);
        showToast(`Removed "${ex.name}" from favorites`, 'error');
    } else {
        addFavorite(ex);
        showToast(`❤️ Added "${ex.name}" to favorites!`, 'success');
    }
    applyFiltersAndRender();
}

function openModal(ex) {
    state.currentExercise = ex;
    if (modalContent) modalContent.innerHTML = renderExerciseModal(ex);
    if (modal) modal.classList.add('open');
}

function setupModal() {
    if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('open'));
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal?.classList.remove('open'); });
}

function setupNutritionSection() {
    if (!nutritionForm) return;
    nutritionForm.addEventListener('submit', async e => {
        e.preventDefault();
        const query = nutritionInput.value.trim();
        if (!query) return;

        renderNutritionSkeletons(nutritionGrid, 3);
        try {
            const items = await fetchNutrition(query);
            renderNutritionResults(items, nutritionGrid);

            nutritionGrid.querySelectorAll('.btn-log-meal').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cal = Number(btn.dataset.cal);
                    const stats = getDashboardStats();
                    stats.calories = Math.min(stats.calories + cal, 9999);
                    saveDashboardStats(stats);
                    renderDashboardStats(stats);
                    showToast(`✅ Logged ${cal} kcal from ${btn.dataset.name}!`, 'success');
                    navigateTo('dashboard');
                });
            });
        } catch (err) {
            showError(nutritionGrid, 'Failed to fetch nutrition data.');
        }
    });
}

function setupFavoritesSection() {
    refreshFavorites();
}

function refreshFavorites() {
    const favs = getFavorites();
    renderFavoriteCards(favs, favGrid, id => {
        removeFavorite(id);
        showToast('Removed from favorites', 'error');
        refreshFavorites();
    });
}

function setupDashboardEditing() {
    document.querySelectorAll('.stat-adjust-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const metric = btn.dataset.metric;
            const amount = Number(btn.dataset.amount);
            const stats = getDashboardStats();
            if (metric in stats) {
                stats[metric] = Math.max(0, stats[metric] + amount);
                saveDashboardStats(stats);
                renderDashboardStats(stats);
                showToast(`Updated ${metric}!`, 'success');
            }
        });
    });
}

function navigateTo(pageId) {
    const tab = document.querySelector(`.nav-tab[data-page="${pageId}"]`);
    if (tab) tab.click();
}
