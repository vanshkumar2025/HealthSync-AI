
const EXERCISE_API_KEY = 'demo_key'; 
const CALORIE_API_KEY = 'demo_key'; 

const EXERCISE_BASE = 'https://exercisedb.p.rapidapi.com';
const CALORIE_BASE = 'https://api.calorieninjas.com/v1';


export async function fetchExercises({ bodyPart = '', limit = 50, offset = 0 } = {}) {
    try {
        const endpoint = bodyPart && bodyPart !== 'all'
            ? `${EXERCISE_BASE}/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=${limit}&offset=${offset}`
            : `${EXERCISE_BASE}/exercises?limit=${limit}&offset=${offset}`;

        const res = await fetch(endpoint, {
            headers: {
                'X-RapidAPI-Key': EXERCISE_API_KEY,
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            },
        });
        if (!res.ok) throw new Error(`ExerciseDB: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn('ExerciseDB unavailable — using local fallback data.', err.message);
        return getFallbackExercises(bodyPart, limit, offset);
    }
}

export async function fetchBodyParts() {
    try {
        const res = await fetch(`${EXERCISE_BASE}/exercises/bodyPartList`, {
            headers: {
                'X-RapidAPI-Key': EXERCISE_API_KEY,
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            },
        });
        if (!res.ok) throw new Error(`BodyParts: ${res.status}`);
        return await res.json();
    } catch {
        return ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
    }
}

export async function fetchNutrition(query) {
    try {
        const res = await fetch(`${CALORIE_BASE}/nutrition?query=${encodeURIComponent(query)}`, {
            headers: { 'X-Api-Key': CALORIE_API_KEY },
        });
        if (!res.ok) throw new Error(`CalorieNinjas: ${res.status}`);
        const data = await res.json();
        return data.items || [];
    } catch (err) {
        console.warn('CalorieNinjas unavailable — using local fallback data.', err.message);
        return getFallbackNutrition(query);
    }
}


function getFallbackExercises(bodyPart, limit, offset) {
    const all = FALLBACK_EXERCISES.filter(e =>
        !bodyPart || bodyPart === 'all' || e.bodyPart === bodyPart
    );
    return all.slice(offset, offset + limit);
}

function getFallbackNutrition(query) {
    const q = query.toLowerCase();
    return FALLBACK_NUTRITION.filter(item =>
        item.name.toLowerCase().includes(q)
    );
}

const FALLBACK_EXERCISES = [
    { id: 'f001', name: 'Barbell Bench Press', bodyPart: 'chest', equipment: 'barbell', target: 'pectorals', gifUrl: '', secondaryMuscles: ['triceps', 'delts'], instructions: ['Lie flat on bench', 'Grip barbell', 'Lower to chest', 'Press up'] },
    { id: 'f002', name: 'Pull Up', bodyPart: 'back', equipment: 'body weight', target: 'lats', gifUrl: '', secondaryMuscles: ['biceps', 'rhomboids'], instructions: ['Hang from bar', 'Pull body up', 'Lower controlled'] },
    { id: 'f003', name: 'Barbell Back Squat', bodyPart: 'upper legs', equipment: 'barbell', target: 'quads', gifUrl: '', secondaryMuscles: ['glutes', 'hamstrings'], instructions: ['Bar on traps', 'Squat down', 'Drive through heels'] },
    { id: 'f004', name: 'Deadlift', bodyPart: 'back', equipment: 'barbell', target: 'spine', gifUrl: '', secondaryMuscles: ['glutes', 'hamstrings', 'traps'], instructions: ['Stand with bar at feet', 'Hinge at hips', 'Drive hips forward'] },
    { id: 'f005', name: 'Overhead Press', bodyPart: 'shoulders', equipment: 'barbell', target: 'delts', gifUrl: '', secondaryMuscles: ['triceps', 'core'], instructions: ['Hold bar at shoulders', 'Press overhead', 'Lower controlled'] },
    { id: 'f006', name: 'Dumbbell Curl', bodyPart: 'upper arms', equipment: 'dumbbell', target: 'biceps', gifUrl: '', secondaryMuscles: ['brachialis'], instructions: ['Hold dumbbells', 'Curl up', 'Lower slowly'] },
    { id: 'f007', name: 'Tricep Dip', bodyPart: 'upper arms', equipment: 'body weight', target: 'triceps', gifUrl: '', secondaryMuscles: ['chest', 'shoulders'], instructions: ['Grip parallel bars', 'Dip down', 'Push back up'] },
    { id: 'f008', name: 'Plank', bodyPart: 'waist', equipment: 'body weight', target: 'abs', gifUrl: '', secondaryMuscles: ['glutes', 'shoulders'], instructions: ['Forearms on ground', 'Hold straight body', 'Engage core'] },
    { id: 'f009', name: 'Running', bodyPart: 'cardio', equipment: 'body weight', target: 'cardiovascular system', gifUrl: '', secondaryMuscles: ['quads', 'calves'], instructions: ['Maintain steady pace', 'Land midfoot', 'Breathe rhythmically'] },
    { id: 'f010', name: 'Calf Raise', bodyPart: 'lower legs', equipment: 'body weight', target: 'calves', gifUrl: '', secondaryMuscles: ['soleus'], instructions: ['Stand on edge of step', 'Rise on toes', 'Lower heel'] },
    { id: 'f011', name: 'Lateral Raise', bodyPart: 'shoulders', equipment: 'dumbbell', target: 'delts', gifUrl: '', secondaryMuscles: ['traps'], instructions: ['Hold dumbbells at sides', 'Raise to shoulder height', 'Lower slowly'] },
    { id: 'f012', name: 'Leg Press', bodyPart: 'upper legs', equipment: 'leverage machine', target: 'quads', gifUrl: '', secondaryMuscles: ['glutes', 'hamstrings'], instructions: ['Sit in machine', 'Feet on platform', 'Press and return'] },
    { id: 'f013', name: 'Cable Row', bodyPart: 'back', equipment: 'cable', target: 'lats', gifUrl: '', secondaryMuscles: ['rhomboids', 'biceps'], instructions: ['Sit at cable machine', 'Pull handle to abdomen', 'Extend arms'] },
    { id: 'f014', name: 'Incline Dumbbell Press', bodyPart: 'chest', equipment: 'dumbbell', target: 'pectorals', gifUrl: '', secondaryMuscles: ['triceps', 'delts'], instructions: ['Incline bench 45°', 'Press dumbbells up', 'Lower to chest'] },
    { id: 'f015', name: 'Jump Rope', bodyPart: 'cardio', equipment: 'body weight', target: 'cardiovascular system', gifUrl: '', secondaryMuscles: ['calves', 'shoulders'], instructions: ['Hold rope handles', 'Jump in rhythm', 'Land softly'] },
    { id: 'f016', name: 'Hip Thrust', bodyPart: 'upper legs', equipment: 'barbell', target: 'glutes', gifUrl: '', secondaryMuscles: ['hamstrings', 'abs'], instructions: ['Shoulders on bench', 'Bar across hips', 'Drive hips up'] },
    { id: 'f017', name: 'Face Pull', bodyPart: 'shoulders', equipment: 'cable', target: 'delts', gifUrl: '', secondaryMuscles: ['rotator cuff', 'rhomboids'], instructions: ['Set cable at head height', 'Pull to face', 'External rotate'] },
    { id: 'f018', name: 'Leg Curl', bodyPart: 'upper legs', equipment: 'leverage machine', target: 'hamstrings', gifUrl: '', secondaryMuscles: ['calves'], instructions: ['Lie on machine', 'Curl legs up', 'Lower slowly'] },
    { id: 'f019', name: 'Ab Rollout', bodyPart: 'waist', equipment: 'roller', target: 'abs', gifUrl: '', secondaryMuscles: ['lats', 'shoulders'], instructions: ['Kneel with roller', 'Roll forward', 'Pull back tight'] },
    { id: 'f020', name: 'Box Jump', bodyPart: 'cardio', equipment: 'body weight', target: 'cardiovascular system', gifUrl: '', secondaryMuscles: ['quads', 'glutes'], instructions: ['Stand before box', 'Jump explosively', 'Land softly on box'] },
    { id: 'f021', name: 'Wrist Curl', bodyPart: 'lower arms', equipment: 'barbell', target: 'forearms', gifUrl: '', secondaryMuscles: [], instructions: ['Rest forearms on bench', 'Curl wrists up', 'Lower slowly'] },
    { id: 'f022', name: 'Neck Flexion', bodyPart: 'neck', equipment: 'body weight', target: 'sternocleidomastoid', gifUrl: '', secondaryMuscles: [], instructions: ['Sit tall', 'Gently flex neck forward', 'Return to neutral'] },
    { id: 'f023', name: 'Russian Twist', bodyPart: 'waist', equipment: 'body weight', target: 'abs', gifUrl: '', secondaryMuscles: ['obliques'], instructions: ['Sit with knees bent', 'Lean back slightly', 'Rotate torso side to side'] },
    { id: 'f024', name: 'Seated Row', bodyPart: 'back', equipment: 'cable', target: 'rhomboids', gifUrl: '', secondaryMuscles: ['biceps', 'rear delts'], instructions: ['Sit upright', 'Pull handle to waist', 'Squeeze shoulder blades'] },
    { id: 'f025', name: 'Dumbbell Fly', bodyPart: 'chest', equipment: 'dumbbell', target: 'pectorals', gifUrl: '', secondaryMuscles: ['biceps'], instructions: ['Lie on bench', 'Arms wide with slight bend', 'Squeeze to top'] },
    { id: 'f026', name: 'Step Up', bodyPart: 'upper legs', equipment: 'body weight', target: 'quads', gifUrl: '', secondaryMuscles: ['glutes', 'hamstrings'], instructions: ['Stand before step', 'Step up with one leg', 'Drive knee up'] },
    { id: 'f027', name: 'Cycling', bodyPart: 'cardio', equipment: 'stationary bike', target: 'cardiovascular system', gifUrl: '', secondaryMuscles: ['quads', 'calves'], instructions: ['Adjust seat height', 'Pedal at steady pace', 'Maintain cadence'] },
    { id: 'f028', name: 'Hammer Curl', bodyPart: 'upper arms', equipment: 'dumbbell', target: 'brachialis', gifUrl: '', secondaryMuscles: ['biceps'], instructions: ['Neutral grip on dumbbells', 'Curl up', 'Lower slowly'] },
    { id: 'f029', name: 'Romanian Deadlift', bodyPart: 'upper legs', equipment: 'barbell', target: 'hamstrings', gifUrl: '', secondaryMuscles: ['glutes', 'spine'], instructions: ['Hold bar at hips', 'Hinge forward', 'Squeeze glutes to return'] },
    { id: 'f030', name: 'Burpee', bodyPart: 'cardio', equipment: 'body weight', target: 'cardiovascular system', gifUrl: '', secondaryMuscles: ['chest', 'quads'], instructions: ['Stand', 'Drop to push-up', 'Jump feet in', 'Jump up'] },
];

const FALLBACK_NUTRITION = [
    { name: 'Chicken Breast', calories: 165, protein_g: 31, fat_total_g: 3.6, carbohydrates_total_g: 0, serving_size_g: 100 },
    { name: 'Brown Rice', calories: 216, protein_g: 4.5, fat_total_g: 1.8, carbohydrates_total_g: 45, serving_size_g: 100 },
    { name: 'Banana', calories: 89, protein_g: 1.1, fat_total_g: 0.3, carbohydrates_total_g: 23, serving_size_g: 100 },
    { name: 'Egg', calories: 155, protein_g: 13, fat_total_g: 11, carbohydrates_total_g: 1.1, serving_size_g: 100 },
    { name: 'Salmon', calories: 208, protein_g: 20, fat_total_g: 13, carbohydrates_total_g: 0, serving_size_g: 100 },
    { name: 'Oatmeal', calories: 68, protein_g: 2.5, fat_total_g: 1.4, carbohydrates_total_g: 12, serving_size_g: 100 },
    { name: 'Broccoli', calories: 34, protein_g: 2.8, fat_total_g: 0.4, carbohydrates_total_g: 7, serving_size_g: 100 },
    { name: 'Greek Yogurt', calories: 59, protein_g: 10, fat_total_g: 0.4, carbohydrates_total_g: 3.6, serving_size_g: 100 },
    { name: 'Almonds', calories: 579, protein_g: 21, fat_total_g: 50, carbohydrates_total_g: 22, serving_size_g: 100 },
    { name: 'Sweet Potato', calories: 86, protein_g: 1.6, fat_total_g: 0.1, carbohydrates_total_g: 20, serving_size_g: 100 },
    { name: 'Avocado', calories: 160, protein_g: 2, fat_total_g: 15, carbohydrates_total_g: 9, serving_size_g: 100 },
    { name: 'Quinoa', calories: 120, protein_g: 4.4, fat_total_g: 1.9, carbohydrates_total_g: 22, serving_size_g: 100 },
    { name: 'Beef Steak', calories: 250, protein_g: 26, fat_total_g: 15, carbohydrates_total_g: 0, serving_size_g: 100 },
    { name: 'Whole Milk', calories: 61, protein_g: 3.2, fat_total_g: 3.3, carbohydrates_total_g: 4.8, serving_size_g: 100 },
    { name: 'Apple', calories: 52, protein_g: 0.3, fat_total_g: 0.2, carbohydrates_total_g: 14, serving_size_g: 100 },
    { name: 'Peanut Butter', calories: 598, protein_g: 25, fat_total_g: 51, carbohydrates_total_g: 20, serving_size_g: 100 },
    { name: 'Tuna', calories: 130, protein_g: 28, fat_total_g: 1, carbohydrates_total_g: 0, serving_size_g: 100 },
    { name: 'Pasta', calories: 131, protein_g: 5, fat_total_g: 1.1, carbohydrates_total_g: 25, serving_size_g: 100 },
    { name: 'Orange', calories: 47, protein_g: 0.9, fat_total_g: 0.1, carbohydrates_total_g: 12, serving_size_g: 100 },
    { name: 'Spinach', calories: 23, protein_g: 2.9, fat_total_g: 0.4, carbohydrates_total_g: 3.6, serving_size_g: 100 },
];
