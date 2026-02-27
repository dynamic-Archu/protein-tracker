// Simple localStorage wrapper
const STORAGE_KEY = 'protein_tracker_v2'; // Changed key to cleanly reset user data

const defaultData = {
  goal: 120, // default daily goal in grams
  entries: [], // { id, amount, label, date (ISO string), timestamp }
};

export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  } catch (e) {
    console.error('Failed to load data:', e);
    return defaultData;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};
