import { useLocalStorage } from './useLocalStorage';
import type { CustomItem } from '../types';

const CUSTOM_KEY = 'otasuke_custom_items_v1';
const genId = () => Math.random().toString(36).slice(2, 11);

export function useCustomItems() {
  const [items, setItems] = useLocalStorage<CustomItem[]>(CUSTOM_KEY, []);

  const visibleItems = items.filter(i => !i.hidden);
  const hiddenItems  = items.filter(i => !!i.hidden);

  const addCustomItem = (draft: Omit<CustomItem, 'id' | 'createdAt'>): boolean => {
    const dup = items.some(i =>
      i.name === draft.name &&
      i.category === draft.category &&
      i.subCategory === draft.subCategory
    );
    if (dup) return false;
    setItems(prev => [...prev, { ...draft, id: genId(), createdAt: '2026-05-07' }]);
    return true;
  };

  const hideCustomItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, hidden: true } : i));
  };

  const restoreCustomItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, hidden: false } : i));
  };

  const deleteCustomItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return {
    items,
    visibleItems,
    hiddenItems,
    addCustomItem,
    hideCustomItem,
    restoreCustomItem,
    deleteCustomItem,
  };
}

export type UseCustomItemsReturn = ReturnType<typeof useCustomItems>;
