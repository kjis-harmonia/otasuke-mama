import type { ShoppingItem } from '../types';

export const initialShoppingList: ShoppingItem[] = [
  { id: 'sh1', masterItemId: 'egg',       name: '卵',     emoji: '🥚', category: 'food',  checked: false, addedAt: '2026-05-07' },
  { id: 'sh2', masterItemId: 'milk',      name: '牛乳',   emoji: '🥛', category: 'food',  checked: false, addedAt: '2026-05-07' },
  { id: 'sh3', masterItemId: 'trash_bag', name: 'ゴミ袋', emoji: '🗑️', category: 'daily', checked: false, addedAt: '2026-05-06' },
  { id: 'sh4', masterItemId: 'diaper',    name: 'おむつ(L)', emoji: '👶', category: 'baby',  checked: true,  addedAt: '2026-05-06' },
];
