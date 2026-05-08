import { useLocalStorage } from './useLocalStorage';
import { getCurrentWeekStart } from '../utils/weekUtils';
import type { MealEntry } from '../types';

const STORAGE_KEY = 'otasuke_meal_plan_v1';

interface MealPlanData {
  weekStart: string;
  entries: MealEntry[];
}

export interface UseMealPlanReturn {
  entries: MealEntry[];
  addEntry: (entry: Omit<MealEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<Omit<MealEntry, 'id'>>) => void;
  deleteEntry: (id: string) => void;
}

export function useMealPlan(): UseMealPlanReturn {
  const [data, setData] = useLocalStorage<MealPlanData>(STORAGE_KEY, {
    weekStart: getCurrentWeekStart(),
    entries: [],
  });

  const currentWeekStart = getCurrentWeekStart();
  const entries = data.weekStart === currentWeekStart ? data.entries : [];

  const addEntry = (entry: Omit<MealEntry, 'id'>) => {
    const newEntry: MealEntry = { ...entry, id: `meal_${Date.now()}` };
    setData(prev => ({
      weekStart: currentWeekStart,
      entries: [...(prev.weekStart === currentWeekStart ? prev.entries : []), newEntry],
    }));
  };

  const updateEntry = (id: string, updates: Partial<Omit<MealEntry, 'id'>>) => {
    setData(prev => ({
      ...prev,
      entries: prev.entries.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  };

  const deleteEntry = (id: string) => {
    setData(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.id !== id),
    }));
  };

  return { entries, addEntry, updateEntry, deleteEntry };
}
