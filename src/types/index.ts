export type StockStatus = 'enough' | 'low' | 'empty';
export type Location = '冷蔵' | '冷凍' | '常温' | '日用品棚' | '子ども用品';
export type ItemCategory = 'food' | 'daily' | 'baby';
export type ExpenseCategory = '食費' | '日用品' | '子ども用品' | '外食' | 'その他';
export type EatingTendency = '少なめ' | 'ふつう' | 'よく食べる' | '肉多め' | '節約重視';
export type TastePreference = '標準' | '甘め' | 'しっかり甘め' | 'あっさり' | '濃いめ' | '出汁強め';
export type PortionFeedback = 'just_right' | 'slightly_less' | 'much_less' | 'slightly_more' | 'much_more';
export type TasteFeedback = 'just_right' | 'slightly_bland' | 'slightly_salty' | 'sweeter' | 'too_sweet';
export type RecipeMatchStatus = 'can_cook' | 'one_more' | 'two_more' | 'not_enough';

// 定番品マスター（買い物・在庫・レシピの共通キー）
export interface MasterItem {
  id: string;           // 'egg', 'milk', 'tofu' など
  name: string;         // '卵'
  emoji: string;        // '🥚'
  category: ItemCategory;
  subCategory: string;
  defaultUnit: string;
  defaultLocation: Location;
  isQuickAdd: boolean;
}

// 在庫アイテム
export interface StockItem {
  id: string;
  masterItemId: string; // MasterItem.id と紐付け
  name: string;
  emoji: string;
  category: ItemCategory;
  subCategory: string;
  quantity: number;
  unit: string;
  stockStatus: StockStatus;
  location: Location;
  memo: string;
  lastUpdatedAt: string;
}

// 冷凍・作り置きアイテム
export interface FrozenItem {
  id: string;
  masterItemId?: string;
  name: string;
  emoji: string;
  quantity: number;
  unit: string;
  location: '冷凍' | '冷蔵';
  createdAt: string;
  memo: string;
}

// 買い物リストアイテム
export interface ShoppingItem {
  id: string;
  masterItemId?: string; // MasterItem.id と紐付け（手入力の場合はundefined）
  name: string;
  emoji: string;
  category: ItemCategory;
  checked: boolean;
  addedAt: string;
  quantity?: number;
  unit?: string;
}

// 支出エントリ
export interface BudgetEntry {
  id: string;
  date: string;
  storeName: string;
  amount: number;
  category: ExpenseCategory;
  memo: string;
}

// レシピ
export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  tags: string[];
  requiredItemIds: string[];   // MasterItem.id の配列
  optionalItemIds: string[];   // MasterItem.id の配列
  category: string;
  difficulty: '簡単' | '普通' | 'やや難';
  timeMinutes: number;
  portionNote: string;
  ingredientsSimple: string;
  seasoningSimple: string;
  tips: string;
  isSavingsMenu: boolean;
}

// レシピ照合結果
export interface RecipeMatch {
  recipe: Recipe;
  status: RecipeMatchStatus;
  missingItems: MasterItem[];
  usesLowStock: boolean;    // 残りわずか食材を使える
  usesFridge: boolean;      // 冷蔵庫の食材を消費できる
}

// レシピフィードバック
export interface RecipeFeedback {
  recipeId: string;
  cookedAt: string;
  portionFeedback: PortionFeedback;
  tasteFeedback: TasteFeedback;
}

// 家族設定
export interface FamilySettings {
  adults: number;
  children: number;
  toddlers: number;
  eatingTendency: EatingTendency;
  tastePreference: TastePreference;
}

// 週予算
export interface WeeklyBudget {
  amount: number;
  weekStartDate: string;
}

// 代用食材
export interface Substitution {
  originalId: string;    // 代用される食材のmasterItemId
  substituteIds: string[]; // 代わりになり得る食材のmasterItemId
  note: string;          // '似た風味で使えます'
}

// アプリ全体の状態
export interface AppState {
  stock: StockItem[];
  frozenItems: FrozenItem[];
  shoppingList: ShoppingItem[];
  budgetEntries: BudgetEntry[];
  recipes: Recipe[];
  recipeFeedbacks: RecipeFeedback[];
  familySettings: FamilySettings;
  weeklyBudget: WeeklyBudget;
}
