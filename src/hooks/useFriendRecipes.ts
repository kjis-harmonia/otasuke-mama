import { useLocalStorage } from './useLocalStorage';
import type { SavedFriendRecipe } from '../types';

const STORAGE_KEY = 'otasuke_friend_recipes_v1';

export interface UseFriendRecipesReturn {
  friendRecipes: SavedFriendRecipe[];
  saveRecipe: (recipe: Omit<SavedFriendRecipe, 'id' | 'savedAt'>) => string;
  deleteRecipe: (id: string) => void;
  isSaved: (sourcePostId: string) => boolean;
  getSaved: (sourcePostId: string) => SavedFriendRecipe | undefined;
  getById: (id: string) => SavedFriendRecipe | undefined;
}

export function useFriendRecipes(): UseFriendRecipesReturn {
  const [friendRecipes, setFriendRecipes] = useLocalStorage<SavedFriendRecipe[]>(STORAGE_KEY, []);

  const saveRecipe = (recipe: Omit<SavedFriendRecipe, 'id' | 'savedAt'>): string => {
    if (recipe.sourcePostId) {
      const existing = friendRecipes.find(r => r.sourcePostId === recipe.sourcePostId);
      if (existing) return existing.id;
    }
    const id = `fr_${Date.now()}`;
    const newRecipe: SavedFriendRecipe = {
      ...recipe,
      id,
      savedAt: new Date().toISOString().slice(0, 10),
    };
    setFriendRecipes(prev => [...prev, newRecipe]);
    return id;
  };

  const deleteRecipe = (id: string) => {
    setFriendRecipes(prev => prev.filter(r => r.id !== id));
  };

  const isSaved = (sourcePostId: string) =>
    friendRecipes.some(r => r.sourcePostId === sourcePostId);

  const getSaved = (sourcePostId: string) =>
    friendRecipes.find(r => r.sourcePostId === sourcePostId);

  const getById = (id: string) =>
    friendRecipes.find(r => r.id === id);

  return { friendRecipes, saveRecipe, deleteRecipe, isSaved, getSaved, getById };
}
