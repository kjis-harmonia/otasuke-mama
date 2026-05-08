import { useLocalStorage } from './useLocalStorage';
import type { StockItem, FrozenItem, StockStatus } from '../types';
import { initialStock } from '../data/initialStock';
import { getMasterItem } from '../data/masterItems';
import { calcStockStatus } from '../utils/stockUtils';

const STOCK_KEY = 'otasuke_stock_v2';
const FROZEN_KEY = 'otasuke_frozen_v2';

const genId = () => Math.random().toString(36).slice(2, 11);

const initialFrozenItems: FrozenItem[] = [
  { id: 'f1', name: '冷凍ごはん',       emoji: '🍚', quantity: 3, unit: '個',   location: '冷凍', createdAt: '2026-05-05', memo: '' },
  { id: 'f2', name: '冷凍うどん',       emoji: '🍜', quantity: 2, unit: '玉',   location: '冷凍', createdAt: '2026-05-01', memo: '' },
  { id: 'f3', name: '作り置きカレー',   emoji: '🍛', quantity: 2, unit: '食分', location: '冷凍', createdAt: '2026-05-04', memo: '中辛' },
  { id: 'f4', name: '下味冷凍 鶏もも', emoji: '🍗', quantity: 1, unit: '袋',   location: '冷凍', createdAt: '2026-05-03', memo: '照り焼き用' },
  { id: 'f5', name: '冷凍枝豆',         emoji: '🫛', quantity: 1, unit: '袋',   location: '冷凍', createdAt: '2026-04-28', memo: '' },
];

export function useStock() {
  const [stock, setStock] = useLocalStorage<StockItem[]>(STOCK_KEY, initialStock);
  const [frozenItems, setFrozenItems] = useLocalStorage<FrozenItem[]>(FROZEN_KEY, initialFrozenItems);

  const updateQuantity = (id: string, delta: number) => {
    setStock(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(0, item.quantity + delta);
      return { ...item, quantity: newQty, stockStatus: calcStockStatus(newQty), lastUpdatedAt: '2026-05-07' };
    }));
  };

  const setStatus = (id: string, status: StockStatus) => {
    setStock(prev => prev.map(item =>
      item.id === id ? { ...item, stockStatus: status, lastUpdatedAt: '2026-05-07' } : item
    ));
  };

  const addStockItem = (masterItemId: string, overrides?: Partial<StockItem>) => {
    const master = getMasterItem(masterItemId);
    if (!master) return;
    const existing = stock.find(s => s.masterItemId === masterItemId);
    if (existing) {
      updateQuantity(existing.id, 1);
      return;
    }
    const newItem: StockItem = {
      id: genId(),
      masterItemId,
      name: master.name,
      emoji: master.emoji,
      category: master.category,
      subCategory: master.subCategory,
      quantity: 1,
      unit: master.defaultUnit,
      stockStatus: 'enough',
      location: master.defaultLocation,
      memo: '',
      lastUpdatedAt: '2026-05-07',
      ...overrides,
    };
    setStock(prev => [...prev, newItem]);
  };

  const deleteStockItem = (id: string) => {
    setStock(prev => prev.filter(i => i.id !== id));
  };

  const updateStockItem = (id: string, updates: Partial<StockItem>) => {
    setStock(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const decrementByMasterItemId = (masterItemId: string, amount = 1) => {
    const item = stock.find(s => s.masterItemId === masterItemId);
    if (item && item.category === 'food') {
      updateQuantity(item.id, -amount);
    }
  };

  // 冷凍アイテム
  const addFrozenItem = (item: Omit<FrozenItem, 'id'>) => {
    setFrozenItems(prev => [...prev, { ...item, id: genId() }]);
  };

  const updateFrozenQuantity = (id: string, delta: number) => {
    setFrozenItems(prev => prev
      .map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter(item => item.quantity > 0)
    );
  };

  const deleteFrozenItem = (id: string) => {
    setFrozenItems(prev => prev.filter(i => i.id !== id));
  };

  /** 自分の家用データへ切り替え時に在庫・冷凍を初期化 */
  const clearUserData = () => {
    setStock([]);
    setFrozenItems([]);
  };

  return {
    stock,
    frozenItems,
    updateQuantity,
    setStatus,
    addStockItem,
    deleteStockItem,
    updateStockItem,
    decrementByMasterItemId,
    addFrozenItem,
    updateFrozenQuantity,
    deleteFrozenItem,
    clearUserData,
  };
}

export type UseStockReturn = ReturnType<typeof useStock>;
