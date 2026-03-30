
import { isFavorite } from './storage.js';
import { titleCase } from './utils.js';

const BODY_PART_ICONS = {
    'back': '🏋️', 'cardio': '🏃', 'chest': '💪', 'lower arms': '🦾',
    'lower legs': '🦵', 'neck': '🏆', 'shoulders': '🤸', 'upper arms': '💪',
    'upper legs': '🦵', 'waist': '🏋️', 'default': '⚡',
};

const EQUIPMENT_COLORS = {
    'barbell': '#6366f1', 'dumbbell': '#8b5cf6', 'body weight': '#10b981',
    'cable': '#f59e0b', 'leverage machine': '#ef4444', 'roller': '#06b6d4',
    'stationary bike': '#3b82f6', 'default': '#94a3b8',
};

export function renderSkeletons(container, count = 6) {
    container.innerHTML = Array.from({ length: count }).map(() => `
    <div class="card skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-sub"></div>
      <div class="skeleton skeleton-tag"></div>
    </div>
  `).join('');
}

export function renderNutritionSkeletons(container, count = 3) {
    container.innerHTML = Array.from({ length: count }).map(() => `
    <div class="nutrition-card skeleton-card">
      <div class="skeleton skeleton-title"></div>
      <div class="nutrition-macros">
        ${Array.from({ length: 4 }).map(() => `<div class="macro-item"><div class="skeleton skeleton-macro"></div></div>`).join('')}
      </div>
    </div>
  `).join('');
}

export function showError(container, message = 'Something went wrong. Please try again.') {
    container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Oops!</h3>
      <p>${message}</p>
    </div>
  `;
}

export function showEmpty(container, message = 'No results found.') {
    container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>Nothing here</h3>
      <p>${message}</p>
    </div>
  `;
}

export function renderExerciseCards(exercises, container, onFav) {
    if (!exercises.length) { showEmpty(container, 'No exercises match your search.'); return; }

    container.innerHTML = exercises.map(ex => {
        const fav = isFavorite(ex.id);
        const icon = BODY_PART_ICONS[ex.bodyPart] || BODY_PART_ICONS.default;
        const equipColor = EQUIPMENT_COLORS[ex.equipment] || EQUIPMENT_COLORS.default;

        return `
      <div class="card exercise-card" data-id="${ex.id}">
        <div class="card-header" style="background: linear-gradient(135deg, ${equipColor}22, ${equipColor}44)">
          <span class="body-icon">${icon}</span>
          <button class="fav-btn ${fav ? 'active' : ''}" data-id="${ex.id}" aria-label="Toggle favourite">
            ${fav ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="card-body">
          <h3 class="card-title">${titleCase(ex.name)}</h3>
          <div class="card-tags">
            <span class="tag tag-bodypart">${titleCase(ex.bodyPart)}</span>
            <span class="tag tag-equipment" style="border-color: ${equipColor}; color: ${equipColor}">${titleCase(ex.equipment)}</span>
          </div>
          <p class="card-target">🎯 ${titleCase(ex.target)}</p>
        </div>
      </div>
    `;
    }).join('');

    container.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            onFav(btn.dataset.id);
        });
    });
}

export function renderExerciseModal(ex) {
    const icon = BODY_PART_ICONS[ex.bodyPart] || BODY_PART_ICONS.default;
    return `
    <div class="modal-header">
      <span class="modal-icon">${icon}</span>
      <div>
        <h2>${titleCase(ex.name)}</h2>
        <div class="modal-tags">
          <span class="tag tag-bodypart">${titleCase(ex.bodyPart)}</span>
          <span class="tag">${titleCase(ex.equipment)}</span>
          <span class="tag">🎯 ${titleCase(ex.target)}</span>
        </div>
      </div>
    </div>
    ${ex.secondaryMuscles?.length ? `
      <div class="modal-section">
        <h4>Secondary Muscles</h4>
        <div class="modal-tags">${ex.secondaryMuscles.map(m => `<span class="tag">${titleCase(m)}</span>`).join('')}</div>
      </div>` : ''}
    ${ex.instructions?.length ? `
      <div class="modal-section">
        <h4>Instructions</h4>
        <ol class="instructions-list">
          ${ex.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>` : ''}
  `;
}

export function renderNutritionResults(items, container) {
    if (!items.length) { showEmpty(container, 'No food items found. Try a different query.'); return; }

    container.innerHTML = items.map(item => `
    <div class="nutrition-card">
      <div class="nutrition-header">
        <h3 class="nutrition-name">${titleCase(item.name)}</h3>
        <span class="serving-size">per ${item.serving_size_g}g</span>
      </div>
      <div class="nutrition-macros">
        <div class="macro-item macro-cal">
          <span class="macro-value">${Math.round(item.calories)}</span>
          <span class="macro-label">kcal</span>
        </div>
        <div class="macro-item macro-protein">
          <span class="macro-value">${item.protein_g.toFixed(1)}</span>
          <span class="macro-label">Protein</span>
        </div>
        <div class="macro-item macro-carbs">
          <span class="macro-value">${item.carbohydrates_total_g.toFixed(1)}</span>
          <span class="macro-label">Carbs</span>
        </div>
        <div class="macro-item macro-fat">
          <span class="macro-value">${item.fat_total_g.toFixed(1)}</span>
          <span class="macro-label">Fat</span>
        </div>
      </div>
      <div class="macro-bar">
        ${renderMacroBar(item)}
      </div>
      <button class="btn-log-meal" data-name="${item.name}" data-cal="${Math.round(item.calories)}">
        + Log to Dashboard
      </button>
    </div>
  `).join('');
}

function renderMacroBar(item) {
    const total = item.protein_g + item.carbohydrates_total_g + item.fat_total_g || 1;
    const p = ((item.protein_g / total) * 100).toFixed(1);
    const c = ((item.carbohydrates_total_g / total) * 100).toFixed(1);
    const f = ((item.fat_total_g / total) * 100).toFixed(1);
    return `
    <div class="bar-segment bar-protein" style="width:${p}%" title="Protein ${p}%"></div>
    <div class="bar-segment bar-carbs"   style="width:${c}%" title="Carbs ${c}%"></div>
    <div class="bar-segment bar-fat"     style="width:${f}%" title="Fat ${f}%"></div>
  `;
}

export function renderFavoriteCards(favorites, container, onRemove) {
    if (!favorites.length) {
        container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">❤️</div>
        <h3>No Favorites Yet</h3>
        <p>Heart an exercise in the Explorer to save it here.</p>
      </div>`;
        return;
    }

    container.innerHTML = favorites.map(ex => `
    <div class="card exercise-card" data-id="${ex.id}">
      <div class="card-header" style="background: linear-gradient(135deg,#6366f122,#8b5cf644)">
        <span class="body-icon">${BODY_PART_ICONS[ex.bodyPart] || BODY_PART_ICONS.default}</span>
        <button class="fav-btn active remove-btn" data-id="${ex.id}" aria-label="Remove favourite">❤️</button>
      </div>
      <div class="card-body">
        <h3 class="card-title">${titleCase(ex.name)}</h3>
        <div class="card-tags">
          <span class="tag tag-bodypart">${titleCase(ex.bodyPart)}</span>
          <span class="tag">${titleCase(ex.equipment)}</span>
        </div>
        <p class="card-target">🎯 ${titleCase(ex.target)}</p>
      </div>
    </div>
  `).join('');

    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => onRemove(btn.dataset.id));
    });
}

export function renderDashboardStats(stats) {
    const safeSet = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    safeSet('stat-calories', stats.calories);
    safeSet('stat-steps', stats.steps.toLocaleString());
    safeSet('stat-water', `${stats.water} L`);
    safeSet('stat-workout', `${stats.workoutMinutes} min`);

    animateProgressRing('ring-calories', stats.calories, 2500);
    animateProgressRing('ring-steps', stats.steps, 10000);
    animateProgressRing('ring-water', stats.water * 100, 800 );
    animateProgressRing('ring-workout', stats.workoutMinutes, 60);
}

function animateProgressRing(id, value, max) {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 36; 
    const offset = circumference - (pct / 100) * circumference;
    el.style.strokeDasharray = circumference;
    el.style.strokeDashoffset = offset;
}

let toastTimer;
export function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

export function renderPagination(container, currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    container.innerHTML = `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">‹</button>
    ${pages.map(p => `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`).join('')}
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">›</button>
  `;
    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => onPageChange(Number(btn.dataset.page)));
    });
}

export function populateBodyPartFilter(bodyParts, selectEl) {
    const opts = ['all', ...bodyParts].map(bp =>
        `<option value="${bp}">${bp === 'all' ? 'All Body Parts' : titleCase(bp)}</option>`
    ).join('');
    selectEl.innerHTML = opts;
}
