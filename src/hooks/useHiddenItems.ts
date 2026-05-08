import { useLocalStorage } from './useLocalStorage';

const HIDDEN_KEY = 'otasuke_hidden_items_v2';

export function useHiddenItems() {
  const [hidden, setHidden] = useLocalStorage<string[]>(HIDDEN_KEY, []);

  const hideItem = (masterItemId: string) => {
    setHidden(prev => prev.includes(masterItemId) ? prev : [...prev, masterItemId]);
  };

  const restoreItem = (masterItemId: string) => {
    setHidden(prev => prev.filter(id => id !== masterItemId));
  };

  const restoreAll = () => setHidden([]);

  const isHidden = (masterItemId: string) => hidden.includes(masterItemId);

  return { hidden, hideItem, restoreItem, restoreAll, isHidden };
}
