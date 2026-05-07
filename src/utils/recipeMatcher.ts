import type { Recipe, StockItem, RecipeMatch, MasterItem, RecipeMatchStatus } from '../types';
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
  const missingItems: MasterItem[] = [];

  for (const requiredId of recipe.requiredItemIds) {
    const inStock = hasItemInStock(requiredId, stock);
    const hasSub = hasSubstituteInStock(requiredId, stock);
    if (!inStock && !hasSub) {
      const masterItem = getMasterItem(requiredId);
      if (masterItem) missingItems.push(masterItem);
    }
  }

  let status: RecipeMatchStatus;
  if (missingItems.length === 0) status = 'can_cook';
  else if (missingItems.length === 1) status = 'one_more';
  else if (missingItems.length === 2) status = 'two_more';
  else status = 'not_enough';

  const usesLowStock = recipe.requiredItemIds.some(id =>
    stock.some(s => s.masterItemId === id && s.stockStatus === 'low')
  );

  const usesFridge = recipe.requiredItemIds.some(id =>
    stock.some(s => s.masterItemId === id && s.location === '冷蔵' && s.stockStatus !== 'empty')
  );

  return { recipe, status, missingItems, usesLowStock, usesFridge };
}

export function matchAllRecipes(recipes: Recipe[], stock: StockItem[]): RecipeMatch[] {
  return recipes.map(recipe => matchRecipe(recipe, stock));
}

// 優先順位でソート
export function sortRecipeMatches(matches: RecipeMatch[], budgetRemaining: number): RecipeMatch[] {
  return [...matches].sort((a, b) => {
    const statusOrder: Record<RecipeMatchStatus, number> = { can_cook: 0, one_more: 1, two_more: 2, not_enough: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // 予算が少ない時は節約メニューを優先
    if (budgetRemaining < 3000) {
      if (a.recipe.isSavingsMenu !== b.recipe.isSavingsMenu) {
        return a.recipe.isSavingsMenu ? -1 : 1;
      }
    }
    // 残りわずかの食材を使えるレシピを優先
    if (a.usesLowStock !== b.usesLowStock) return a.usesLowStock ? -1 : 1;
    // 冷蔵庫の食材を使えるレシピを優先
    if (a.usesFridge !== b.usesFridge) return a.usesFridge ? -1 : 1;
    return 0;
  });
}
