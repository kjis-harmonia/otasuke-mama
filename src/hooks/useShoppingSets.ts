import { useLocalStorage } from './useLocalStorage';
import type { ShoppingSet, ShoppingSetItem } from '../types';

const SETS_KEY = 'otasuke_shopping_sets_v1';
export const FREE_LIMIT = 3;

const genId = () => Math.random().toString(36).slice(2, 11);

export function useShoppingSets() {
  const [sets, setSets] = useLocalStorage<ShoppingSet[]>(SETS_KEY, []);

  const canCreate = sets.length < FREE_LIMIT;

  const createSet = (name: string, emoji: string, items: ShoppingSetItem[]): boolean => {
    if (!canCreate) return false;
    setSets(prev => [...prev, { id: genId(), name, emoji, items, createdAt: '2026-05-08' }]);
    return true;
  };

  const deleteSet = (id: string) => {
    setSets(prev => prev.filter(s => s.id !== id));
  };

  return { sets, canCreate, createSet, deleteSet, FREE_LIMIT };
}

export type UseShoppingSetsReturn = ReturnType<typeof useShoppingSets>;
