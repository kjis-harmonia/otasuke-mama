import { useLocalStorage } from './useLocalStorage';
import type { Recipe, CustomIngredient } from '../types';

const CUSTOM_RECIPES_KEY = 'otasuke_custom_recipes_v2';

const genId = () => `cr_${Math.random().toString(36).slice(2, 11)}`;

function buildRequiredItemIds(ingredients: CustomIngredient[]): string[] {
  return ingredients
    .filter(i => i.required && !!i.masterItemId)
    .map(i => i.masterItemId as string);
}

export type CustomRecipeInput = Omit<Recipe, 'id' | 'requiredItemIds' | 'optionalItemIds' | 'tags'>;

export function useCustomRecipes() {
  const [customRecipes, setCustomRecipes] = useLocalStorage<Recipe[]>(CUSTOM_RECIPES_KEY, []);

  const addCustomRecipe = (input: CustomRecipeInput): string => {
    const id = genId();
    const recipe: Recipe = {
      ...input,
      id,
      tags: [],
      requiredItemIds: buildRequiredItemIds(input.ingredients ?? []),
      optionalItemIds: [],
      isCustomRecipe: true,
    };
    setCustomRecipes(prev => [...prev, recipe]);
    return id;
  };

  const updateCustomRecipe = (id: string, input: Partial<CustomRecipeInput>) => {
    setCustomRecipes(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...input };
      if (input.ingredients !== undefined) {
        updated.requiredItemIds = buildRequiredItemIds(input.ingredients);
      }
      return updated;
    }));
  };

  const deleteCustomRecipe = (id: string) => {
    setCustomRecipes(prev => prev.filter(r => r.id !== id));
  };

  return { customRecipes, addCustomRecipe, updateCustomRecipe, deleteCustomRecipe };
}
