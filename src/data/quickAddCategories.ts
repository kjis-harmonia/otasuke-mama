import type { ItemCategory } from '../types';

interface QuickAddItem {
  masterItemId: string;
  name: string;
  emoji: string;
  category: ItemCategory;
}

interface QuickAddCategory {
  label: string;
  emoji: string;
  items: QuickAddItem[];
}

export const quickAddCategories: QuickAddCategory[] = [
  {
    label: '食品',
    emoji: '🥦',
    items: [
      { masterItemId: 'egg',           name: '卵',         emoji: '🥚', category: 'food' },
      { masterItemId: 'milk',          name: '牛乳',       emoji: '🥛', category: 'food' },
      { masterItemId: 'cooked_rice',   name: 'ご飯',       emoji: '🍚', category: 'food' },
      { masterItemId: 'frozen_rice',   name: '冷凍ごはん', emoji: '🍚', category: 'food' },
      { masterItemId: 'pack_rice',     name: 'パックご飯', emoji: '🍚', category: 'food' },
      { masterItemId: 'tofu',          name: '豆腐',       emoji: '🫘', category: 'food' },
      { masterItemId: 'natto',         name: '納豆',       emoji: '🫘', category: 'food' },
      { masterItemId: 'bread',         name: '食パン',     emoji: '🍞', category: 'food' },
      { masterItemId: 'yogurt',        name: 'ヨーグルト', emoji: '🥣', category: 'food' },
      { masterItemId: 'banana',        name: 'バナナ',     emoji: '🍌', category: 'food' },
      { masterItemId: 'onion',         name: '玉ねぎ',     emoji: '🧅', category: 'food' },
      { masterItemId: 'carrot',        name: 'にんじん',   emoji: '🥕', category: 'food' },
      { masterItemId: 'potato',        name: 'じゃがいも', emoji: '🥔', category: 'food' },
      { masterItemId: 'chicken_thigh', name: '鶏もも肉',   emoji: '🍗', category: 'food' },
      { masterItemId: 'pork_cut',      name: '豚こま',     emoji: '🥩', category: 'food' },
    ],
  },
  {
    label: '日用品',
    emoji: '🧴',
    items: [
      { masterItemId: 'laundry',       name: '洗濯洗剤',          emoji: '🧴', category: 'daily' },
      { masterItemId: 'dish_soap',     name: '食器用洗剤',         emoji: '🫧', category: 'daily' },
      { masterItemId: 'softener',      name: '柔軟剤',            emoji: '🧺', category: 'daily' },
      { masterItemId: 'toilet_paper',  name: 'トイレットペーパー', emoji: '🧻', category: 'daily' },
      { masterItemId: 'tissue',        name: 'ティッシュ',        emoji: '🤧', category: 'daily' },
      { masterItemId: 'shampoo',       name: 'シャンプー',        emoji: '🧴', category: 'daily' },
      { masterItemId: 'body_soap',     name: 'ボディソープ',       emoji: '🧼', category: 'daily' },
      { masterItemId: 'hand_soap',     name: 'ハンドソープ',       emoji: '🫧', category: 'daily' },
      { masterItemId: 'trash_bag',     name: 'ゴミ袋',            emoji: '🗑️', category: 'daily' },
      { masterItemId: 'wrap',          name: 'ラップ',            emoji: '🥡', category: 'daily' },
      { masterItemId: 'kitchen_paper', name: 'キッチンペーパー',   emoji: '🧻', category: 'daily' },
    ],
  },
  {
    label: '子ども用品',
    emoji: '👶',
    items: [
      { masterItemId: 'diaper',    name: 'おむつ',        emoji: '👶', category: 'baby' },
      { masterItemId: 'wet_wipe',  name: 'おしりふき',    emoji: '🧻', category: 'baby' },
      { masterItemId: 'formula',   name: 'ミルク',        emoji: '🍼', category: 'baby' },
      { masterItemId: 'baby_food', name: 'ベビーフード',   emoji: '🍱', category: 'baby' },
    ],
  },
];
