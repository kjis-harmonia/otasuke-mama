export type StockStatus = 'enough' | 'low' | 'empty';
export type Location = '冷蔵' | '冷凍' | '常温' | '日用品棚' | '子ども用品';
export type ItemCategory = 'food' | 'daily' | 'baby';
export type ExpenseCategory = '食費' | '日用品' | '子ども用品' | '外食' | 'その他';
export type EatingTendency = '少なめ' | 'ふつう' | 'よく食べる' | '肉多め' | '節約重視';
export type TastePreference = '標準' | '甘め' | 'しっかり甘め' | 'あっさり' | '濃いめ' | '出汁強め';
export type DataMode = 'demo' | 'real';
export type ExpiryType = '賞味期限' | '消費期限' | 'なし';
export type PortionFeedback = 'just_right' | 'slightly_less' | 'much_less' | 'slightly_more' | 'much_more';
export type TasteFeedback = 'just_right' | 'slightly_bland' | 'slightly_salty' | 'sweeter' | 'too_sweet';
export type RecipeMatchStatus = 'can_cook' | 'one_more' | 'two_more' | 'not_enough';

// ─── マスターアイテム ───────────────────────────────────────
export interface MasterItem {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  subCategory: string;
  defaultUnit: string;
  defaultLocation: Location;
  isQuickAdd: boolean;
  brandName?: string; // ブランド名（任意・表示は name を優先）
}

// ─── 在庫アイテム ──────────────────────────────────────────
export interface StockItem {
  id: string;
  masterItemId: string;
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
  brandName?: string;
  expiryDate?: string;          // 'YYYY-MM-DD'
  expiryType?: ExpiryType;      // default '賞味期限'
  alertDaysBefore?: number;     // default 3
}

// ─── 冷凍・作り置き ────────────────────────────────────────
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

// ─── 買い物リスト ──────────────────────────────────────────
export interface ShoppingItem {
  id: string;
  masterItemId?: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  subCategory?: string;
  checked: boolean;
  addedAt: string;
  quantity?: number;
  unit?: string;
}

// ─── 支出 ─────────────────────────────────────────────────
export interface BudgetEntry {
  id: string;
  date: string;
  storeName: string;
  amount: number;
  category: ExpenseCategory;
  memo: string;
}

// ─── レシピ ────────────────────────────────────────────────

/**
 * OR条件グループ：いずれか1つが在庫にあればOK
 * 例: { label: 'ご飯', itemIds: ['cooked_rice', 'frozen_rice', 'rice'] }
 */
export interface RequiredGroup {
  label: string;
  emoji: string;
  itemIds: string[];
}

export interface CustomIngredient {
  masterItemId?: string;
  name: string;
  amountLabel: string;
  fractionValue?: number;
  unit: string;
  required: boolean;
}

export interface CustomSeasoning {
  name: string;
  amountLabel: string;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  tags: string[];
  requiredItemIds: string[];
  requiredGroups?: RequiredGroup[];
  optionalItemIds: string[];
  category: string;
  difficulty: '簡単' | '普通' | 'やや難' | '少し手間';
  timeMinutes: number;
  portionNote: string;
  ingredientsSimple: string;
  seasoningSimple: string;
  tips: string;
  isSavingsMenu: boolean;
  isCustomRecipe?: boolean;
  ingredients?: CustomIngredient[];
  seasonings?: CustomSeasoning[];
  familyMemo?: string;
  stepsMemo?: string;
}

// ─── レシピ照合 ────────────────────────────────────────────

/**
 * 不足している材料（単品またはグループ）の表示情報
 */
export interface MissingIngredient {
  label: string;     // 日本語表示名（'ご飯'、'卵' など）
  emoji: string;
  primaryId: string; // 買い物リストへ追加する代表ID
  allIds: string[];  // グループの場合は複数ID
}

export interface RecipeMatch {
  recipe: Recipe;
  status: RecipeMatchStatus;
  missing: MissingIngredient[];  // 不足材料（単品・グループ統一）
  usesLowStock: boolean;
  usesFridge: boolean;
}

// ─── フィードバック ────────────────────────────────────────
export interface RecipeFeedback {
  recipeId: string;
  cookedAt: string;
  portionFeedback: PortionFeedback;
  tasteFeedback: TasteFeedback;
}

// ─── 設定 ─────────────────────────────────────────────────
export interface FamilySettings {
  adults: number;
  children: number;
  toddlers: number;
  eatingTendency: EatingTendency;
  tastePreference: TastePreference;
  frequentItems?: string[]; // よく買うもの（masterItemIds）
}

// ─── セットアップ ──────────────────────────────────────────
export interface SetupState {
  isComplete: boolean;
  dataMode: DataMode;
}

export interface WeeklyBudget {
  amount: number;
  weekStartDate: string;
}

// ─── 代用食材 ─────────────────────────────────────────────
export interface Substitution {
  originalId: string;
  substituteIds: string[];
  note: string;
}

// ─── アプリ全体 ───────────────────────────────────────────
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
