
export function debounce(fn, delay = 400) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

export function filterExercises(arr, { query = '', bodyPart = '', equipment = '' } = {}) {
    return arr
        .filter(ex => !query || ex.name.toLowerCase().includes(query.toLowerCase()))
        .filter(ex => !bodyPart || ex.bodyPart === bodyPart)
        .filter(ex => !equipment || ex.equipment === equipment);
}

export function sortExercises(arr, key = 'name', dir = 'asc') {
    return [...arr].sort((a, b) => {
        const av = (a[key] || '').toLowerCase();
        const bv = (b[key] || '').toLowerCase();
        if (av < bv) return dir === 'asc' ? -1 : 1;
        if (av > bv) return dir === 'asc' ? 1 : -1;
        return 0;
    });
}

export function reduceCalories(items) {
    return items.reduce((total, item) => total + (item.calories || 0), 0).toFixed(1);
}

export function paginate(arr, page = 1, size = 12) {
    return arr.slice((page - 1) * size, page * size);
}

export function formatNumber(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function titleCase(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

export function uid() {
    return Math.random().toString(36).slice(2, 10);
}
