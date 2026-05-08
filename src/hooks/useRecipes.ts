import { useLocalStorage } from './useLocalStorage';
import type { RecipeFeedback, PortionFeedback, TasteFeedback, StockItem } from '../types';
import { recipeData } from '../data/recipeData';
import { matchAllRecipes, sortRecipeMatches } from '../utils/recipeMatcher';
import { useCustomRecipes } from './useCustomRecipes';

const FEEDBACK_KEY = 'otasuke_feedback_v2';

const genId = () => Math.random().toString(36).slice(2, 11);

export function useRecipes(stock: StockItem[], budgetRemaining: number) {
  const [feedbacks, setFeedbacks] = useLocalStorage<RecipeFeedback[]>(FEEDBACK_KEY, []);
  const { customRecipes, addCustomRecipe, updateCustomRecipe, deleteCustomRecipe } = useCustomRecipes();

  const allRecipes = [...recipeData, ...customRecipes];
  const allMatches = sortRecipeMatches(matchAllRecipes(allRecipes, stock), budgetRemaining);

  const canCook    = allMatches.filter(m => m.status === 'can_cook');
  const oneMissing = allMatches.filter(m => m.status === 'one_more');
  const twoMissing = allMatches.filter(m => m.status === 'two_more');
  const savingsMenu = allMatches.filter(m => m.recipe.isSavingsMenu && m.status !== 'not_enough');

  const clearFeedbacks = () => setFeedbacks([]);

  const addFeedback = (
    recipeId: string,
    portionFeedback: PortionFeedback,
    tasteFeedback: TasteFeedback
  ) => {
    const newFeedback: RecipeFeedback & { id: string } = {
      id: genId(),
      recipeId,
      cookedAt: '2026-05-07',
      portionFeedback,
      tasteFeedback,
    };
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  return {
    allMatches,
    canCook,
    oneMissing,
    twoMissing,
    savingsMenu,
    feedbacks,
    addFeedback,
    clearFeedbacks,
    recipes: allRecipes,
    customRecipes,
    addCustomRecipe,
    updateCustomRecipe,
    deleteCustomRecipe,
  };
}

export type UseRecipesReturn = ReturnType<typeof useRecipes>;
