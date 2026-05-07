import type {
  Recipe, StockItem, RecipeMatch, MissingIngredient, RecipeMatchStatus,
} from '../types';
import { getMasterItem } from '../data/masterItems';
import { substitutions } from '../data/substitutions';

function hasItemInStock(masterItemId: string, stock: StockItem[]): boolean {
  return stock.some(s => s.masterItemId === masterItemId && s.stockStatus !== 'empty');
}

function hasSubstituteInStock(masterItemId: string, stock: StockItem[]): boolean {
  const subs = substitutions.find(s => s.originalId === masterItemId);
  if (!subs) return false;
  return subs.substituteIds.some(subId => hasItemInStock(subId, stock));
}

export function matchRecipe(recipe: Recipe, stock: StockItem[]): RecipeMatch {
  const missing: MissingIngredient[] = [];

  // ── requiredItemIds：全て必要（AND条件） ──────────────────────
  for (const requiredId of recipe.requiredItemIds) {
    const inStock = hasItemInStock(requiredId, stock);
    const hasSub  = hasSubstituteInStock(requiredId, stock);
    if (!inStock && !hasSub) {
      const master = getMasterItem(requiredId);
      if (master) {
        missing.push({
          label:     master.name,
          emoji:     master.emoji,
          primaryId: requiredId,
          allIds:    [requiredId],
        });
      }
    }
  }

  // ── requiredGroups：グループ内のいずれか1つ（OR条件） ──────────
  for (const group of (recipe.requiredGroups ?? [])) {
    const satisfied = group.itemIds.some(id => hasItemInStock(id, stock));
    if (!satisfied) {
      // 代表アイテム（グループの先頭）の絵文字を使用
      const primaryMaster = getMasterItem(group.itemIds[0]);
      missing.push({
        label:     group.label,
        emoji:     group.emoji ?? primaryMaster?.emoji ?? '🍚',
        primaryId: group.itemIds[0],
        allIds:    group.itemIds,
      });
    }
  }

  const missingCount = missing.length;
  let status: RecipeMatchStatus;
  if (missingCount === 0)      status = 'can_cook';
  else if (missingCount === 1) status = 'one_more';
  else if (missingCount === 2) status = 'two_more';
  else                         status = 'not_enough';

  // 残りわずか食材を使えるか
  const usesLowStock = recipe.requiredItemIds.some(id =>
    stock.some(s => s.masterItemId === id && s.stockStatus === 'low')
  );

  // 冷蔵庫の食材を使えるか
  const usesFridge = recipe.requiredItemIds.some(id =>
    stock.some(s => s.masterItemId === id && s.location === '冷蔵' && s.stockStatus !== 'empty')
  );

  return { recipe, status, missing, usesLowStock, usesFridge };
}

export function matchAllRecipes(recipes: Recipe[], stock: StockItem[]): RecipeMatch[] {
  return recipes.map(recipe => matchRecipe(recipe, stock));
}

// 優先順位でソート
export function sortRecipeMatches(matches: RecipeMatch[], budgetRemaining: number): RecipeMatch[] {
  return [...matches].sort((a, b) => {
    const ORDER: Record<RecipeMatchStatus, number> = {
      can_cook: 0, one_more: 1, two_more: 2, not_enough: 3,
    };
    if (ORDER[a.status] !== ORDER[b.status]) {
      return ORDER[a.status] - ORDER[b.status];
    }
    // 予算残り少ない時は節約メニューを優先
    if (budgetRemaining < 3000) {
      if (a.recipe.isSavingsMenu !== b.recipe.isSavingsMenu) {
        return a.recipe.isSavingsMenu ? -1 : 1;
      }
    }
    // 残りわずか食材を使えるレシピを優先
    if (a.usesLowStock !== b.usesLowStock) return a.usesLowStock ? -1 : 1;
    // 冷蔵庫の食材を使えるレシピを優先
    if (a.usesFridge !== b.usesFridge) return a.usesFridge ? -1 : 1;
    return 0;
  });
}
