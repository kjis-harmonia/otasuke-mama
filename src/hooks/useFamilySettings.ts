import { useLocalStorage } from './useLocalStorage';
import type { FamilySettings } from '../types';

export const FAMILY_KEY = 'otasuke_family_v2';

export const defaultFamilySettings: FamilySettings = {
  adults: 2,
  children: 1,
  toddlers: 1,
  eatingTendency: 'ふつう',
  tastePreference: '標準',
  frequentItems: [],
};

export function useFamilySettings() {
  const [settings, setSettings] = useLocalStorage<FamilySettings>(FAMILY_KEY, defaultFamilySettings);

  const updateSettings = (patch: Partial<FamilySettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  };

  const toggleFrequentItem = (masterItemId: string) => {
    setSettings(prev => {
      const current = prev.frequentItems ?? [];
      const next = current.includes(masterItemId)
        ? current.filter(id => id !== masterItemId)
        : [...current, masterItemId];
      return { ...prev, frequentItems: next };
    });
  };

  return {
    settings,
    updateSettings,
    toggleFrequentItem,
  };
}

export type UseFamilySettingsReturn = ReturnType<typeof useFamilySettings>;
