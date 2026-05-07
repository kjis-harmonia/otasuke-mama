import type { MasterItem, ItemCategory } from '../types';

export const masterItems: MasterItem[] = [
  // ─── 食品・乳卵 ───────────────────────────────────
  { id: 'egg',          name: '卵',          emoji: '🥚', category: 'food', subCategory: '乳卵',   defaultUnit: '個',    defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'milk',         name: '牛乳',        emoji: '🥛', category: 'food', subCategory: '乳卵',   defaultUnit: '本',    defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'yogurt',       name: 'ヨーグルト',  emoji: '🥣', category: 'food', subCategory: '乳卵',   defaultUnit: '個',    defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'soy_milk',     name: '豆乳',        emoji: '🥛', category: 'food', subCategory: '乳卵',   defaultUnit: '本',    defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品・主食 ───────────────────────────────────
  { id: 'cooked_rice',  name: 'ご飯',        emoji: '🍚', category: 'food', subCategory: '主食',   defaultUnit: '杯分',  defaultLocation: '常温', isQuickAdd: true },
  { id: 'frozen_rice',  name: '冷凍ごはん',  emoji: '🍚', category: 'food', subCategory: '主食',   defaultUnit: '個',    defaultLocation: '冷凍', isQuickAdd: true },
  { id: 'pack_rice',    name: 'パックご飯',  emoji: '🍚', category: 'food', subCategory: '主食',   defaultUnit: '個',    defaultLocation: '常温', isQuickAdd: true },
  { id: 'rice',         name: '米',          emoji: '🌾', category: 'food', subCategory: '主食',   defaultUnit: '合',    defaultLocation: '常温', isQuickAdd: false },
  { id: 'bread',        name: '食パン',      emoji: '🍞', category: 'food', subCategory: 'パン',   defaultUnit: '袋',    defaultLocation: '常温', isQuickAdd: true },

  // ─── 食品・豆類 ───────────────────────────────────
  { id: 'tofu',         name: '豆腐',        emoji: '🫘', category: 'food', subCategory: '豆類',   defaultUnit: '個',    defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'natto',        name: '納豆',        emoji: '🫘', category: 'food', subCategory: '豆類',   defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: true },

  // ─── 食品・野菜 ───────────────────────────────────
  { id: 'onion',        name: '玉ねぎ',      emoji: '🧅', category: 'food', subCategory: '野菜',   defaultUnit: '個',    defaultLocation: '常温', isQuickAdd: true },
  { id: 'carrot',       name: 'にんじん',    emoji: '🥕', category: 'food', subCategory: '野菜',   defaultUnit: '本',    defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'potato',       name: 'じゃがいも',  emoji: '🥔', category: 'food', subCategory: '野菜',   defaultUnit: '個',    defaultLocation: '常温', isQuickAdd: true },
  { id: 'banana',       name: 'バナナ',      emoji: '🍌', category: 'food', subCategory: '果物',   defaultUnit: '本',    defaultLocation: '常温', isQuickAdd: true },
  { id: 'cabbage',      name: 'キャベツ',    emoji: '🥬', category: 'food', subCategory: '野菜',   defaultUnit: '個',    defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'bean_sprout',  name: 'もやし',      emoji: '🌱', category: 'food', subCategory: '野菜',   defaultUnit: '袋',    defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品・肉類 ───────────────────────────────────
  { id: 'chicken_thigh', name: '鶏もも肉',   emoji: '🍗', category: 'food', subCategory: '肉類',   defaultUnit: '枚',    defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'pork_cut',      name: '豚こま',     emoji: '🥩', category: 'food', subCategory: '肉類',   defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'ground_meat',   name: 'ひき肉',     emoji: '🥩', category: 'food', subCategory: '肉類',   defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品・調味料 ─────────────────────────────────
  { id: 'soy_sauce',    name: 'しょうゆ',    emoji: '🫙', category: 'food', subCategory: '調味料', defaultUnit: '本',    defaultLocation: '常温', isQuickAdd: false },
  { id: 'miso',         name: 'みそ',        emoji: '🫙', category: 'food', subCategory: '調味料', defaultUnit: '個',    defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 日用品（ブランド名ではなく用途名） ────────────
  { id: 'laundry',      name: '洗濯洗剤',          emoji: '🧴', category: 'daily', subCategory: '洗濯',   defaultUnit: '',      defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'dish_soap',    name: '食器用洗剤',         emoji: '🫧', category: 'daily', subCategory: '台所',   defaultUnit: '',      defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'softener',     name: '柔軟剤',            emoji: '🧺', category: 'daily', subCategory: '洗濯',   defaultUnit: '',      defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'toilet_paper', name: 'トイレットペーパー', emoji: '🧻', category: 'daily', subCategory: 'トイレ', defaultUnit: 'ロール', defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'tissue',       name: 'ティッシュ',        emoji: '🤧', category: 'daily', subCategory: 'その他', defaultUnit: '箱',    defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'shampoo',      name: 'シャンプー',        emoji: '🧴', category: 'daily', subCategory: '入浴',   defaultUnit: '',      defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'body_soap',    name: 'ボディソープ',       emoji: '🧼', category: 'daily', subCategory: '入浴',   defaultUnit: '',      defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'hand_soap',    name: 'ハンドソープ',       emoji: '🫧', category: 'daily', subCategory: '洗面',   defaultUnit: '',      defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'trash_bag',    name: 'ゴミ袋',            emoji: '🗑️', category: 'daily', subCategory: 'その他', defaultUnit: '袋',    defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'wrap',         name: 'ラップ',            emoji: '🥡', category: 'daily', subCategory: '台所',   defaultUnit: '本',    defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'kitchen_paper',name: 'キッチンペーパー',   emoji: '🧻', category: 'daily', subCategory: '台所',   defaultUnit: '本',    defaultLocation: '日用品棚', isQuickAdd: true },

  // ─── 子ども用品 ───────────────────────────────────
  { id: 'diaper',    name: 'おむつ',        emoji: '👶', category: 'baby', subCategory: 'ケア',  defaultUnit: '袋',    defaultLocation: '子ども用品', isQuickAdd: true },
  { id: 'wet_wipe',  name: 'おしりふき',    emoji: '🧻', category: 'baby', subCategory: 'ケア',  defaultUnit: 'パック', defaultLocation: '子ども用品', isQuickAdd: true },
  { id: 'formula',   name: 'ミルク',        emoji: '🍼', category: 'baby', subCategory: '食品',  defaultUnit: '缶',    defaultLocation: '子ども用品', isQuickAdd: true },
  { id: 'baby_food', name: 'ベビーフード',   emoji: '🍱', category: 'baby', subCategory: '食品',  defaultUnit: '個',    defaultLocation: '子ども用品', isQuickAdd: true },
];

export function getMasterItem(id: string): MasterItem | undefined {
  return masterItems.find(m => m.id === id);
}

export function getMasterItemsByCategory(category: ItemCategory): MasterItem[] {
  return masterItems.filter(m => m.category === category);
}
