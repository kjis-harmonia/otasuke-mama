import type { ItemCategory } from '../types';

export interface QuickAddItem {
  masterItemId: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  subCategory?: string;
  isFrequent?: boolean;
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
      // 主食・米
      { masterItemId: 'cooked_rice',    name: 'ご飯',           emoji: '🍚', category: 'food', subCategory: '主食・米',   isFrequent: true  },
      { masterItemId: 'pack_rice',      name: 'パックご飯',      emoji: '🍚', category: 'food', subCategory: '主食・米',   isFrequent: true  },
      { masterItemId: 'bread',          name: '食パン',          emoji: '🍞', category: 'food', subCategory: '主食・米',   isFrequent: true  },
      { masterItemId: 'pasta',          name: 'パスタ',          emoji: '🍝', category: 'food', subCategory: '主食・米',   isFrequent: false },
      { masterItemId: 'udon_noodle',    name: 'うどん',          emoji: '🍜', category: 'food', subCategory: '主食・米',   isFrequent: false },
      // 卵・乳製品
      { masterItemId: 'egg',            name: '卵',             emoji: '🥚', category: 'food', subCategory: '卵・乳製品', isFrequent: true  },
      { masterItemId: 'milk',           name: '牛乳',            emoji: '🥛', category: 'food', subCategory: '卵・乳製品', isFrequent: true  },
      { masterItemId: 'yogurt',         name: 'ヨーグルト',       emoji: '🥣', category: 'food', subCategory: '卵・乳製品', isFrequent: true  },
      { masterItemId: 'cheese',         name: 'チーズ',          emoji: '🧀', category: 'food', subCategory: '卵・乳製品', isFrequent: false },
      // 豆腐・大豆
      { masterItemId: 'tofu',           name: '豆腐',            emoji: '🫘', category: 'food', subCategory: '豆腐・大豆', isFrequent: true  },
      { masterItemId: 'natto',          name: '納豆',            emoji: '🫘', category: 'food', subCategory: '豆腐・大豆', isFrequent: true  },
      { masterItemId: 'aburaage',       name: '油揚げ',           emoji: '🫘', category: 'food', subCategory: '豆腐・大豆', isFrequent: false },
      // 根菜・いも
      { masterItemId: 'onion',          name: '玉ねぎ',          emoji: '🧅', category: 'food', subCategory: '根菜・いも', isFrequent: true  },
      { masterItemId: 'carrot',         name: 'にんじん',         emoji: '🥕', category: 'food', subCategory: '根菜・いも', isFrequent: true  },
      { masterItemId: 'potato',         name: 'じゃがいも',       emoji: '🥔', category: 'food', subCategory: '根菜・いも', isFrequent: true  },
      { masterItemId: 'daikon',         name: '大根',            emoji: '🥬', category: 'food', subCategory: '根菜・いも', isFrequent: false },
      { masterItemId: 'long_onion',     name: '長ねぎ',           emoji: '🌿', category: 'food', subCategory: '根菜・いも', isFrequent: false },
      // 葉もの
      { masterItemId: 'cabbage',        name: 'キャベツ',         emoji: '🥬', category: 'food', subCategory: '葉もの',    isFrequent: false },
      { masterItemId: 'hakusai',        name: '白菜',            emoji: '🥬', category: 'food', subCategory: '葉もの',    isFrequent: false },
      { masterItemId: 'spinach',        name: 'ほうれん草',        emoji: '🥬', category: 'food', subCategory: '葉もの',    isFrequent: false },
      { masterItemId: 'lettuce',        name: 'レタス',           emoji: '🥗', category: 'food', subCategory: '葉もの',    isFrequent: false },
      // 実野菜
      { masterItemId: 'bean_sprout',    name: 'もやし',           emoji: '🌱', category: 'food', subCategory: '実野菜',    isFrequent: false },
      { masterItemId: 'tomato',         name: 'トマト',           emoji: '🍅', category: 'food', subCategory: '実野菜',    isFrequent: false },
      { masterItemId: 'broccoli',       name: 'ブロッコリー',      emoji: '🥦', category: 'food', subCategory: '実野菜',    isFrequent: false },
      { masterItemId: 'cucumber',       name: 'きゅうり',         emoji: '🥒', category: 'food', subCategory: '実野菜',    isFrequent: false },
      { masterItemId: 'bell_pepper',    name: 'ピーマン',         emoji: '🫑', category: 'food', subCategory: '実野菜',    isFrequent: false },
      // きのこ
      { masterItemId: 'shimeji',        name: 'しめじ',           emoji: '🍄', category: 'food', subCategory: 'きのこ',    isFrequent: false },
      { masterItemId: 'enoki',          name: 'えのき',           emoji: '🍄', category: 'food', subCategory: 'きのこ',    isFrequent: false },
      { masterItemId: 'shiitake',       name: 'しいたけ',         emoji: '🍄', category: 'food', subCategory: 'きのこ',    isFrequent: false },
      // 肉
      { masterItemId: 'chicken_thigh',  name: '鶏もも肉',         emoji: '🍗', category: 'food', subCategory: '肉',        isFrequent: true  },
      { masterItemId: 'pork_cut',       name: '豚こま',           emoji: '🥩', category: 'food', subCategory: '肉',        isFrequent: true  },
      { masterItemId: 'chicken_breast', name: '鶏むね肉',         emoji: '🍗', category: 'food', subCategory: '肉',        isFrequent: false },
      { masterItemId: 'pork_belly',     name: '豚バラ',           emoji: '🥩', category: 'food', subCategory: '肉',        isFrequent: false },
      { masterItemId: 'ground_meat',    name: 'ひき肉',           emoji: '🥩', category: 'food', subCategory: '肉',        isFrequent: false },
      { masterItemId: 'sausage',        name: 'ソーセージ',        emoji: '🌭', category: 'food', subCategory: '肉',        isFrequent: false },
      // 魚・海鮮
      { masterItemId: 'salmon',         name: '鮭',              emoji: '🐟', category: 'food', subCategory: '魚・海鮮',   isFrequent: false },
      { masterItemId: 'fish_cake',      name: 'ちくわ',           emoji: '🍢', category: 'food', subCategory: '魚・海鮮',   isFrequent: false },
      { masterItemId: 'mackerel',       name: 'さば',            emoji: '🐟', category: 'food', subCategory: '魚・海鮮',   isFrequent: false },
      // 果物
      { masterItemId: 'banana',         name: 'バナナ',           emoji: '🍌', category: 'food', subCategory: '果物',      isFrequent: true  },
      { masterItemId: 'apple',          name: 'りんご',           emoji: '🍎', category: 'food', subCategory: '果物',      isFrequent: false },
      { masterItemId: 'orange',         name: 'みかん',           emoji: '🍊', category: 'food', subCategory: '果物',      isFrequent: false },
      // 調味料
      { masterItemId: 'soy_sauce',      name: 'しょうゆ',         emoji: '🫙', category: 'food', subCategory: '調味料',    isFrequent: false },
      { masterItemId: 'miso',           name: 'みそ',            emoji: '🫙', category: 'food', subCategory: '調味料',    isFrequent: false },
      { masterItemId: 'mayonnaise',     name: 'マヨネーズ',        emoji: '🫙', category: 'food', subCategory: '調味料',    isFrequent: false },
      { masterItemId: 'mirin',          name: 'みりん',           emoji: '🍶', category: 'food', subCategory: '調味料',    isFrequent: false },
      { masterItemId: 'cooking_sake',   name: '料理酒',           emoji: '🍶', category: 'food', subCategory: '調味料',    isFrequent: false },
      { masterItemId: 'sesame_oil',     name: 'ごま油',           emoji: '🫙', category: 'food', subCategory: '調味料',    isFrequent: false },
      // 冷凍
      { masterItemId: 'frozen_rice',    name: '冷凍ごはん',        emoji: '🍚', category: 'food', subCategory: '冷凍',      isFrequent: true  },
      { masterItemId: 'frozen_gyoza',   name: '冷凍餃子',         emoji: '🥟', category: 'food', subCategory: '冷凍',      isFrequent: false },
      { masterItemId: 'frozen_edamame', name: '冷凍枝豆',         emoji: '🌿', category: 'food', subCategory: '冷凍',      isFrequent: false },
      { masterItemId: 'frozen_karaage', name: '冷凍唐揚げ',        emoji: '🍗', category: 'food', subCategory: '冷凍',      isFrequent: false },
      { masterItemId: 'frozen_udon',    name: '冷凍うどん',        emoji: '🍜', category: 'food', subCategory: '冷凍',      isFrequent: false },
    ],
  },
  {
    label: '日用品',
    emoji: '🧴',
    items: [
      { masterItemId: 'laundry',       name: '洗濯洗剤',          emoji: '🧴', category: 'daily', isFrequent: true },
      { masterItemId: 'softener',      name: '柔軟剤',            emoji: '🧺', category: 'daily', isFrequent: true },
      { masterItemId: 'bleach',        name: '漂白剤',            emoji: '🧴', category: 'daily', isFrequent: false },
      { masterItemId: 'dish_soap',     name: '食器用洗剤',         emoji: '🫧', category: 'daily', isFrequent: true },
      { masterItemId: 'wrap',          name: 'ラップ',            emoji: '🥡', category: 'daily', isFrequent: true },
      { masterItemId: 'kitchen_paper', name: 'キッチンペーパー',   emoji: '🧻', category: 'daily', isFrequent: true },
      { masterItemId: 'aluminum_foil', name: 'アルミホイル',       emoji: '🥡', category: 'daily', isFrequent: false },
      { masterItemId: 'sponge',        name: 'スポンジ',           emoji: '🧽', category: 'daily', isFrequent: false },
      { masterItemId: 'toilet_paper',  name: 'トイレットペーパー', emoji: '🧻', category: 'daily', isFrequent: true },
      { masterItemId: 'tissue',        name: 'ティッシュ',        emoji: '🤧', category: 'daily', isFrequent: true },
      { masterItemId: 'shampoo',       name: 'シャンプー',        emoji: '🧴', category: 'daily', isFrequent: true },
      { masterItemId: 'conditioner',   name: 'トリートメント',     emoji: '🧴', category: 'daily', isFrequent: false },
      { masterItemId: 'body_soap',     name: 'ボディソープ',       emoji: '🧼', category: 'daily', isFrequent: true },
      { masterItemId: 'hand_soap',     name: 'ハンドソープ',       emoji: '🫧', category: 'daily', isFrequent: true },
      { masterItemId: 'toothbrush',    name: '歯ブラシ',           emoji: '🪥', category: 'daily', isFrequent: false },
      { masterItemId: 'trash_bag',     name: 'ゴミ袋',            emoji: '🗑️', category: 'daily', isFrequent: true },
      { masterItemId: 'mask',          name: 'マスク',            emoji: '😷', category: 'daily', isFrequent: false },
    ],
  },
  {
    label: '子ども用品',
    emoji: '👶',
    items: [
      { masterItemId: 'diaper',    name: 'おむつ',        emoji: '👶', category: 'baby', isFrequent: true },
      { masterItemId: 'wet_wipe',  name: 'おしりふき',    emoji: '🧻', category: 'baby', isFrequent: true },
      { masterItemId: 'formula',   name: 'ミルク',        emoji: '🍼', category: 'baby', isFrequent: true },
      { masterItemId: 'baby_food', name: 'ベビーフード',   emoji: '🍱', category: 'baby', isFrequent: true },
    ],
  },
];
