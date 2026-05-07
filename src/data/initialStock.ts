import type { StockItem } from '../types';

export const initialStock: StockItem[] = [
  // ─── 食品・主食 ───────────────────────────────────
  { id: 's0',  masterItemId: 'cooked_rice',   name: 'ご飯',              emoji: '🍚', category: 'food',  subCategory: '主食',   quantity: 3,  unit: '杯分',  stockStatus: 'enough', location: '常温', memo: '', lastUpdatedAt: '2026-05-07' },
  // ─── 食品・乳卵 ───────────────────────────────────
  { id: 's1',  masterItemId: 'egg',           name: '卵',                emoji: '🥚', category: 'food',  subCategory: '乳卵',   quantity: 6,  unit: '個',    stockStatus: 'enough', location: '冷蔵', memo: '', lastUpdatedAt: '2026-05-07' },
  { id: 's2',  masterItemId: 'milk',          name: '牛乳',              emoji: '🥛', category: 'food',  subCategory: '乳卵',   quantity: 1,  unit: '本',    stockStatus: 'low',    location: '冷蔵', memo: '', lastUpdatedAt: '2026-05-06' },
  { id: 's3',  masterItemId: 'tofu',          name: '豆腐',              emoji: '🫘', category: 'food',  subCategory: '豆類',   quantity: 1,  unit: '個',    stockStatus: 'enough', location: '冷蔵', memo: '', lastUpdatedAt: '2026-05-07' },
  { id: 's4',  masterItemId: 'natto',         name: '納豆',              emoji: '🫘', category: 'food',  subCategory: '豆類',   quantity: 3,  unit: 'パック', stockStatus: 'enough', location: '冷蔵', memo: '', lastUpdatedAt: '2026-05-05' },
  { id: 's5',  masterItemId: 'yogurt',        name: 'ヨーグルト',        emoji: '🥣', category: 'food',  subCategory: '乳卵',   quantity: 2,  unit: '個',    stockStatus: 'enough', location: '冷蔵', memo: '', lastUpdatedAt: '2026-05-04' },
  // ─── 食品・野菜 ───────────────────────────────────
  { id: 's6',  masterItemId: 'onion',         name: '玉ねぎ',            emoji: '🧅', category: 'food',  subCategory: '野菜',   quantity: 3,  unit: '個',    stockStatus: 'enough', location: '常温', memo: '', lastUpdatedAt: '2026-05-03' },
  { id: 's7',  masterItemId: 'carrot',        name: 'にんじん',          emoji: '🥕', category: 'food',  subCategory: '野菜',   quantity: 2,  unit: '本',    stockStatus: 'enough', location: '冷蔵', memo: '', lastUpdatedAt: '2026-05-03' },
  { id: 's8',  masterItemId: 'potato',        name: 'じゃがいも',        emoji: '🥔', category: 'food',  subCategory: '野菜',   quantity: 4,  unit: '個',    stockStatus: 'enough', location: '常温', memo: '', lastUpdatedAt: '2026-05-02' },
  { id: 's11', masterItemId: 'bread',         name: '食パン',            emoji: '🍞', category: 'food',  subCategory: 'パン',   quantity: 1,  unit: '袋',    stockStatus: 'enough', location: '常温', memo: '', lastUpdatedAt: '2026-05-07' },
  { id: 's12', masterItemId: 'banana',        name: 'バナナ',            emoji: '🍌', category: 'food',  subCategory: '果物',   quantity: 5,  unit: '本',    stockStatus: 'enough', location: '常温', memo: '', lastUpdatedAt: '2026-05-06' },
  // ─── 食品・肉類 ───────────────────────────────────
  { id: 's9',  masterItemId: 'chicken_thigh', name: '鶏もも肉',          emoji: '🍗', category: 'food',  subCategory: '肉類',   quantity: 2,  unit: '枚',    stockStatus: 'enough', location: '冷蔵', memo: '', lastUpdatedAt: '2026-05-07' },
  { id: 's10', masterItemId: 'pork_cut',      name: '豚こま',            emoji: '🥩', category: 'food',  subCategory: '肉類',   quantity: 1,  unit: 'パック', stockStatus: 'low',    location: '冷凍', memo: '', lastUpdatedAt: '2026-05-06' },
  // ─── 食品・調味料 ─────────────────────────────────
  { id: 's13', masterItemId: 'soy_sauce',     name: 'しょうゆ',          emoji: '🫙', category: 'food',  subCategory: '調味料', quantity: 1,  unit: '本',    stockStatus: 'low',    location: '常温', memo: '', lastUpdatedAt: '2026-04-20' },
  { id: 's14', masterItemId: 'miso',          name: 'みそ',              emoji: '🫙', category: 'food',  subCategory: '調味料', quantity: 1,  unit: '個',    stockStatus: 'enough', location: '冷蔵', memo: '', lastUpdatedAt: '2026-04-15' },
  // ─── 日用品（汎用名） ─────────────────────────────
  { id: 's15', masterItemId: 'laundry',       name: '洗濯洗剤',          emoji: '🧴', category: 'daily', subCategory: '洗濯',   quantity: 1,  unit: '',      stockStatus: 'low',    location: '日用品棚', memo: '',     lastUpdatedAt: '2026-05-01' },
  { id: 's16', masterItemId: 'toilet_paper',  name: 'トイレットペーパー', emoji: '🧻', category: 'daily', subCategory: 'トイレ', quantity: 4,  unit: 'ロール', stockStatus: 'enough', location: '日用品棚', memo: '',     lastUpdatedAt: '2026-05-01' },
  { id: 's17', masterItemId: 'tissue',        name: 'ティッシュ',        emoji: '🤧', category: 'daily', subCategory: 'その他', quantity: 1,  unit: '箱',    stockStatus: 'low',    location: '日用品棚', memo: '',     lastUpdatedAt: '2026-04-28' },
  { id: 's18', masterItemId: 'shampoo',       name: 'シャンプー',        emoji: '🧴', category: 'daily', subCategory: '入浴',   quantity: 1,  unit: '',      stockStatus: 'enough', location: '日用品棚', memo: '',     lastUpdatedAt: '2026-04-25' },
  { id: 's19', masterItemId: 'trash_bag',     name: 'ゴミ袋',            emoji: '🗑️', category: 'daily', subCategory: 'その他', quantity: 0,  unit: '袋',    stockStatus: 'empty',  location: '日用品棚', memo: '45Lが切れた', lastUpdatedAt: '2026-05-05' },
  // ─── 子ども用品 ───────────────────────────────────
  { id: 's20', masterItemId: 'diaper',        name: 'おむつ',            emoji: '👶', category: 'baby',  subCategory: 'ケア',   quantity: 1,  unit: '袋',    stockStatus: 'low',    location: '子ども用品', memo: 'Lサイズ', lastUpdatedAt: '2026-05-06' },
  { id: 's21', masterItemId: 'wet_wipe',      name: 'おしりふき',        emoji: '🧻', category: 'baby',  subCategory: 'ケア',   quantity: 2,  unit: 'パック', stockStatus: 'enough', location: '子ども用品', memo: '',     lastUpdatedAt: '2026-05-03' },
  { id: 's22', masterItemId: 'formula',       name: 'ミルク',            emoji: '🍼', category: 'baby',  subCategory: '食品',   quantity: 1,  unit: '缶',    stockStatus: 'enough', location: '子ども用品', memo: '',     lastUpdatedAt: '2026-05-01' },
];
