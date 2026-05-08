import type { MasterItem } from '../types';

export const masterItems: MasterItem[] = [
  // ─── 食品：主食・米 ───────────────────────────────────────
  { id: 'cooked_rice',    name: 'ご飯',           emoji: '🍚', category: 'food', subCategory: '主食・米',   defaultUnit: '杯分',   defaultLocation: '常温', isQuickAdd: true },
  { id: 'pack_rice',      name: 'パックご飯',      emoji: '🍚', category: 'food', subCategory: '主食・米',   defaultUnit: '個',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'rice',           name: '米',             emoji: '🌾', category: 'food', subCategory: '主食・米',   defaultUnit: '合',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'bread',          name: '食パン',          emoji: '🍞', category: 'food', subCategory: '主食・米',   defaultUnit: '袋',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'pasta',          name: 'パスタ',          emoji: '🍝', category: 'food', subCategory: '主食・米',   defaultUnit: '袋',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'udon_noodle',    name: 'うどん',          emoji: '🍜', category: 'food', subCategory: '主食・米',   defaultUnit: '袋',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'soba_noodle',    name: 'そば',            emoji: '🍜', category: 'food', subCategory: '主食・米',   defaultUnit: '袋',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'ramen_noodle',   name: 'ラーメン麺',       emoji: '🍜', category: 'food', subCategory: '主食・米',   defaultUnit: '袋',     defaultLocation: '常温', isQuickAdd: false },

  // ─── 食品：卵・乳製品 ─────────────────────────────────────
  { id: 'egg',            name: '卵',             emoji: '🥚', category: 'food', subCategory: '卵・乳製品', defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'milk',           name: '牛乳',            emoji: '🥛', category: 'food', subCategory: '卵・乳製品', defaultUnit: '本',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'yogurt',         name: 'ヨーグルト',       emoji: '🥣', category: 'food', subCategory: '卵・乳製品', defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'soy_milk',       name: '豆乳',            emoji: '🥛', category: 'food', subCategory: '卵・乳製品', defaultUnit: '本',     defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'cheese',         name: 'チーズ',          emoji: '🧀', category: 'food', subCategory: '卵・乳製品', defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'butter',         name: 'バター',          emoji: '🧈', category: 'food', subCategory: '卵・乳製品', defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品：豆腐・大豆 ─────────────────────────────────────
  { id: 'tofu',           name: '豆腐',            emoji: '🫘', category: 'food', subCategory: '豆腐・大豆', defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'natto',          name: '納豆',            emoji: '🫘', category: 'food', subCategory: '豆腐・大豆', defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'aburaage',       name: '油揚げ',           emoji: '🫘', category: 'food', subCategory: '豆腐・大豆', defaultUnit: '枚',     defaultLocation: '冷蔵', isQuickAdd: true },

  // ─── 食品：根菜・いも ─────────────────────────────────────
  { id: 'onion',          name: '玉ねぎ',          emoji: '🧅', category: 'food', subCategory: '根菜・いも', defaultUnit: '個',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'carrot',         name: 'にんじん',         emoji: '🥕', category: 'food', subCategory: '根菜・いも', defaultUnit: '本',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'potato',         name: 'じゃがいも',       emoji: '🥔', category: 'food', subCategory: '根菜・いも', defaultUnit: '個',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'daikon',         name: '大根',            emoji: '🥬', category: 'food', subCategory: '根菜・いも', defaultUnit: '本',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'long_onion',     name: '長ねぎ',           emoji: '🌿', category: 'food', subCategory: '根菜・いも', defaultUnit: '本',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'satsumaimo',     name: 'さつまいも',        emoji: '🍠', category: 'food', subCategory: '根菜・いも', defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'ginger',         name: 'しょうが',         emoji: '🌿', category: 'food', subCategory: '根菜・いも', defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品：葉もの ─────────────────────────────────────────
  { id: 'cabbage',        name: 'キャベツ',         emoji: '🥬', category: 'food', subCategory: '葉もの',    defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'hakusai',        name: '白菜',            emoji: '🥬', category: 'food', subCategory: '葉もの',    defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'spinach',        name: 'ほうれん草',        emoji: '🥬', category: 'food', subCategory: '葉もの',    defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'komatsuna',      name: '小松菜',           emoji: '🥬', category: 'food', subCategory: '葉もの',    defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'lettuce',        name: 'レタス',           emoji: '🥗', category: 'food', subCategory: '葉もの',    defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },

  // ─── 食品：実野菜 ─────────────────────────────────────────
  { id: 'bean_sprout',    name: 'もやし',           emoji: '🌱', category: 'food', subCategory: '実野菜',    defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'tomato',         name: 'トマト',           emoji: '🍅', category: 'food', subCategory: '実野菜',    defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'broccoli',       name: 'ブロッコリー',      emoji: '🥦', category: 'food', subCategory: '実野菜',    defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'cucumber',       name: 'きゅうり',         emoji: '🥒', category: 'food', subCategory: '実野菜',    defaultUnit: '本',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'bell_pepper',    name: 'ピーマン',         emoji: '🫑', category: 'food', subCategory: '実野菜',    defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'eggplant',       name: 'なす',            emoji: '🍆', category: 'food', subCategory: '実野菜',    defaultUnit: '本',     defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品：きのこ ─────────────────────────────────────────
  { id: 'shimeji',        name: 'しめじ',           emoji: '🍄', category: 'food', subCategory: 'きのこ',    defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'enoki',          name: 'えのき',           emoji: '🍄', category: 'food', subCategory: 'きのこ',    defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'shiitake',       name: 'しいたけ',         emoji: '🍄', category: 'food', subCategory: 'きのこ',    defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品：肉 ─────────────────────────────────────────────
  { id: 'chicken_thigh',  name: '鶏もも肉',         emoji: '🍗', category: 'food', subCategory: '肉',        defaultUnit: '枚',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'chicken_breast', name: '鶏むね肉',         emoji: '🍗', category: 'food', subCategory: '肉',        defaultUnit: '枚',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'pork_cut',       name: '豚こま',           emoji: '🥩', category: 'food', subCategory: '肉',        defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'pork_belly',     name: '豚バラ',           emoji: '🥩', category: 'food', subCategory: '肉',        defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'ground_meat',    name: 'ひき肉',           emoji: '🥩', category: 'food', subCategory: '肉',        defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'beef_cut',       name: '牛こま',           emoji: '🥩', category: 'food', subCategory: '肉',        defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'sausage',        name: 'ソーセージ',        emoji: '🌭', category: 'food', subCategory: '肉',        defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: true },

  // ─── 食品：魚・海鮮 ──────────────────────────────────────
  { id: 'salmon',         name: '鮭',              emoji: '🐟', category: 'food', subCategory: '魚・海鮮',   defaultUnit: '切れ',   defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'mackerel',       name: 'さば',            emoji: '🐟', category: 'food', subCategory: '魚・海鮮',   defaultUnit: '切れ',   defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'tuna_sashimi',   name: 'まぐろ',           emoji: '🐠', category: 'food', subCategory: '魚・海鮮',   defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'shrimp',         name: 'えび',            emoji: '🦐', category: 'food', subCategory: '魚・海鮮',   defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: false },
  { id: 'fish_cake',      name: 'ちくわ',           emoji: '🍢', category: 'food', subCategory: '魚・海鮮',   defaultUnit: '袋',     defaultLocation: '冷蔵', isQuickAdd: true },

  // ─── 食品：果物 ──────────────────────────────────────────
  { id: 'banana',         name: 'バナナ',           emoji: '🍌', category: 'food', subCategory: '果物',      defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'apple',          name: 'りんご',           emoji: '🍎', category: 'food', subCategory: '果物',      defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'orange',         name: 'みかん',           emoji: '🍊', category: 'food', subCategory: '果物',      defaultUnit: '個',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'strawberry',     name: 'いちご',           emoji: '🍓', category: 'food', subCategory: '果物',      defaultUnit: 'パック', defaultLocation: '冷蔵', isQuickAdd: false },

  // ─── 食品：調味料 ────────────────────────────────────────
  { id: 'soy_sauce',      name: 'しょうゆ',         emoji: '🫙', category: 'food', subCategory: '調味料',    defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'miso',           name: 'みそ',            emoji: '🫙', category: 'food', subCategory: '調味料',    defaultUnit: '個',     defaultLocation: '冷蔵', isQuickAdd: true },
  { id: 'mayonnaise',     name: 'マヨネーズ',        emoji: '🫙', category: 'food', subCategory: '調味料',    defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: true },
  { id: 'mirin',          name: 'みりん',           emoji: '🍶', category: 'food', subCategory: '調味料',    defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'cooking_sake',   name: '料理酒',           emoji: '🍶', category: 'food', subCategory: '調味料',    defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'sugar',          name: '砂糖',            emoji: '🫙', category: 'food', subCategory: '調味料',    defaultUnit: '袋',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'salt',           name: '塩',              emoji: '🫙', category: 'food', subCategory: '調味料',    defaultUnit: '袋',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'sesame_oil',     name: 'ごま油',           emoji: '🫙', category: 'food', subCategory: '調味料',    defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'ponzu',          name: 'ポン酢',           emoji: '🫙', category: 'food', subCategory: '調味料',    defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: false },
  { id: 'ketchup',        name: 'ケチャップ',        emoji: '🍅', category: 'food', subCategory: '調味料',    defaultUnit: '本',     defaultLocation: '常温', isQuickAdd: false },

  // ─── 食品：冷凍 ──────────────────────────────────────────
  { id: 'frozen_rice',    name: '冷凍ごはん',        emoji: '🍚', category: 'food', subCategory: '冷凍',      defaultUnit: '個',     defaultLocation: '冷凍', isQuickAdd: true },
  { id: 'frozen_gyoza',   name: '冷凍餃子',         emoji: '🥟', category: 'food', subCategory: '冷凍',      defaultUnit: '袋',     defaultLocation: '冷凍', isQuickAdd: true },
  { id: 'frozen_edamame', name: '冷凍枝豆',         emoji: '🌿', category: 'food', subCategory: '冷凍',      defaultUnit: '袋',     defaultLocation: '冷凍', isQuickAdd: true },
  { id: 'frozen_karaage', name: '冷凍唐揚げ',        emoji: '🍗', category: 'food', subCategory: '冷凍',      defaultUnit: '袋',     defaultLocation: '冷凍', isQuickAdd: true },
  { id: 'frozen_udon',    name: '冷凍うどん',        emoji: '🍜', category: 'food', subCategory: '冷凍',      defaultUnit: '袋',     defaultLocation: '冷凍', isQuickAdd: true },

  // ─── 日用品 ──────────────────────────────────────────────
  { id: 'laundry',        name: '洗濯洗剤',          emoji: '🧴', category: 'daily', subCategory: '洗濯',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'softener',       name: '柔軟剤',            emoji: '🧺', category: 'daily', subCategory: '洗濯',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'bleach',         name: '漂白剤',            emoji: '🧴', category: 'daily', subCategory: '洗濯',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'dish_soap',      name: '食器用洗剤',         emoji: '🫧', category: 'daily', subCategory: '台所',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'wrap',           name: 'ラップ',            emoji: '🥡', category: 'daily', subCategory: '台所',    defaultUnit: '本',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'kitchen_paper',  name: 'キッチンペーパー',   emoji: '🧻', category: 'daily', subCategory: '台所',    defaultUnit: '本',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'aluminum_foil',  name: 'アルミホイル',       emoji: '🥡', category: 'daily', subCategory: '台所',    defaultUnit: '本',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'sponge',         name: 'スポンジ',           emoji: '🧽', category: 'daily', subCategory: '台所',    defaultUnit: '個',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'toilet_paper',   name: 'トイレットペーパー', emoji: '🧻', category: 'daily', subCategory: 'トイレ',  defaultUnit: 'ロール', defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'tissue',         name: 'ティッシュ',        emoji: '🤧', category: 'daily', subCategory: 'トイレ',  defaultUnit: '箱',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'shampoo',        name: 'シャンプー',        emoji: '🧴', category: 'daily', subCategory: '入浴',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'conditioner',    name: 'トリートメント',     emoji: '🧴', category: 'daily', subCategory: '入浴',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'body_soap',      name: 'ボディソープ',       emoji: '🧼', category: 'daily', subCategory: '入浴',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'hand_soap',      name: 'ハンドソープ',       emoji: '🫧', category: 'daily', subCategory: '洗面',    defaultUnit: '',       defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'toothbrush',     name: '歯ブラシ',           emoji: '🪥', category: 'daily', subCategory: '洗面',    defaultUnit: '本',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'toothpaste',     name: '歯磨き粉',           emoji: '🪥', category: 'daily', subCategory: '洗面',    defaultUnit: '本',     defaultLocation: '日用品棚', isQuickAdd: false },
  { id: 'trash_bag',      name: 'ゴミ袋',            emoji: '🗑️', category: 'daily', subCategory: 'その他',  defaultUnit: '袋',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'mask',           name: 'マスク',            emoji: '😷', category: 'daily', subCategory: 'その他',  defaultUnit: '袋',     defaultLocation: '日用品棚', isQuickAdd: true },
  { id: 'air_freshener',  name: '消臭剤',            emoji: '🌸', category: 'daily', subCategory: 'その他',  defaultUnit: '個',     defaultLocation: '日用品棚', isQuickAdd: false },

  // ─── 子ども用品 ───────────────────────────────────────────
  { id: 'diaper',         name: 'おむつ',            emoji: '👶', category: 'baby', subCategory: 'ケア',     defaultUnit: '袋',     defaultLocation: '子ども用品', isQuickAdd: true },
  { id: 'wet_wipe',       name: 'おしりふき',         emoji: '🧻', category: 'baby', subCategory: 'ケア',     defaultUnit: 'パック', defaultLocation: '子ども用品', isQuickAdd: true },
  { id: 'formula',        name: 'ミルク',            emoji: '🍼', category: 'baby', subCategory: '食品',     defaultUnit: '缶',     defaultLocation: '子ども用品', isQuickAdd: true },
  { id: 'baby_food',      name: 'ベビーフード',        emoji: '🍱', category: 'baby', subCategory: '食品',     defaultUnit: '個',     defaultLocation: '子ども用品', isQuickAdd: true },
];

export function getMasterItem(id: string): MasterItem | undefined {
  return masterItems.find(m => m.id === id);
}
