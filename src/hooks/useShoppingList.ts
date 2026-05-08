import { useLocalStorage } from './useLocalStorage';
import type { ShoppingItem, ItemCategory } from '../types';
import { initialShoppingList } from '../data/initialShopping';
import { getMasterItem } from '../data/masterItems';

const SHOPPING_KEY = 'otasuke_shopping_v2';

const genId = () => Math.random().toString(36).slice(2, 11);

export function useShoppingList() {
  const [list, setList] = useLocalStorage<ShoppingItem[]>(SHOPPING_KEY, initialShoppingList);

  const isAlreadyInList = (masterItemId: string) =>
    list.some(i => i.masterItemId === masterItemId && !i.checked);

  const addByMasterItemId = (masterItemId: string) => {
    if (isAlreadyInList(masterItemId)) return false;
    const master = getMasterItem(masterItemId);
    if (!master) return false;
    const newItem: ShoppingItem = {
      id: genId(),
      masterItemId,
      name: master.name,
      emoji: master.emoji,
      category: master.category,
      subCategory: master.subCategory,
      checked: false,
      addedAt: '2026-05-07',
    };
    setList(prev => [newItem, ...prev]);
    return true;
  };

  const addByName = (name: string, emoji: string, category: ItemCategory, subCategory?: string) => {
    if (list.some(i => i.name === name && !i.checked)) return false;
    const newItem: ShoppingItem = {
      id: genId(),
      name,
      emoji,
      category,
      subCategory,
      checked: false,
      addedAt: '2026-05-07',
    };
    setList(prev => [newItem, ...prev]);
    return true;
  };

  const toggle = (id: string) => {
    setList(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const remove = (id: string) => {
    setList(prev => prev.filter(i => i.id !== id));
  };

  const clearChecked = () => {
    setList(prev => prev.filter(i => !i.checked));
  };

  /** 自分の家用データへ切り替え時にリスト全件削除 */
  const clearAll = () => setList([]);

  const uncheckedItems = list.filter(i => !i.checked);
  const checkedItems = list.filter(i => i.checked);

  return {
    list,
    uncheckedItems,
    checkedItems,
    isAlreadyInList,
    addByMasterItemId,
    addByName,
    toggle,
    remove,
    clearChecked,
    clearAll,
  };
}

export type UseShoppingListReturn = ReturnType<typeof useShoppingList>;
