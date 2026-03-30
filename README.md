# HealthSync AI ⚡

## 🚀 Overview
A modern health tracking web application that allows users to monitor workouts, nutrition, and fitness activities — built with pure HTML, CSS, and JavaScript (no frameworks).

## 🌐 APIs Used
- **ExerciseDB** (RapidAPI) — exercise library with search by body part
- **CalorieNinjas** — nutrition data and macros
- Graceful offline fallback with 30+ exercises and 20+ food items built-in

## ✨ Features
- 🏠 **Dashboard** — calorie, step, water, and workout tracking with animated SVG progress rings
- 🏋️ **Exercise Explorer** — search, filter by body part/equipment, sort asc/desc, paginated grid
- 🥗 **Nutrition Tracker** — search food items, see macronutrient breakdowns, log to dashboard
- ❤️ **Favorites** — save exercises from anywhere; persisted to localStorage
- 🌙 **Dark / Light Mode** — toggle with localStorage persistence
- 📊 **Weekly Activity Chart** and **Water Glass Tracker** on dashboard
- 🔍 **Debounced Search** — no jank while typing
- 📑 **Pagination** — 12 cards per page
- 💬 **Toast Notifications** — non-blocking feedback for all actions
- 💀 **Skeleton Loading** — polished loading state
- ⚠️ **Error UI** — graceful error states (not just console.log)
- 📱 **Fully Responsive** — mobile, tablet, desktop

## ⚙️ Technologies
- HTML5 (semantic, accessible)
- CSS3 — glassmorphism, CSS variables, animations, responsive grid
- JavaScript ES6+ Modules — `import`/`export`, async/await
- Fetch API — exercise & nutrition APIs
- localStorage — favorites, theme, dashboard stats
- Array HOFs — `.map()`, `.filter()`, `.sort()`, `.reduce()`, `.slice()` (no for/while loops)
- PWA Manifest — installable on mobile

## 🗂️ Folder Structure
```
Healthsync AI/
│
├── index.html          ← Single-page shell, all 4 views
├── style.css           ← Full design system (glassmorphism, themes, animations)
├── app.js              ← Main orchestrator (event wiring, navigation, state)
│
├── js/
│   ├── api.js          ← Fetch calls + fallback data
│   ├── ui.js           ← DOM rendering (cards, skeletons, toasts, pagination)
│   ├── storage.js      ← localStorage helpers
│   └── utils.js        ← Pure HOF helpers (debounce, filter, sort, paginate)
│
├── assets/
│   └── icons/
│
├── manifest.json       ← PWA manifest
└── README.md
```

## 📦 Setup
1. Clone the repo
2. Open `index.html` in Chrome/Firefox (no build step needed)
3. *(Optional)* Replace API keys in `js/api.js` with your own:
   - ExerciseDB key from [rapidapi.com](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
   - CalorieNinjas key from [api-ninjas.com](https://api-ninjas.com/api/nutrition)

> **Note:** The app ships with a full offline fallback dataset (30+ exercises, 20+ foods) so it works even without API keys.

## 🌍 Live Demo
*(Add Netlify/Vercel link after deployment)*

## 📝 JavaScript Highlights (Array HOFs)
```js
// Debounced search using .filter()
const filtered = exercises.filter(ex =>
  ex.name.toLowerCase().includes(query.toLowerCase())
);

// Sort using .sort()
const sorted = [...arr].sort((a, b) =>
  dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
);

// Total calories using .reduce()
const totalCal = items.reduce((sum, item) => sum + item.calories, 0);

// Pagination using .slice()
const page = arr.slice((page - 1) * pageSize, page * pageSize);
```
