import { useLocalStorage } from './useLocalStorage';
import type { NotificationPrefs } from '../types';

const PREFS_KEY = 'otasuke_notification_prefs_v1';

const defaultPrefs: NotificationPrefs = {
  expiryAlert: true,
  expiryDaysBefore: 3,
  shoppingReminder: false,
  shoppingReminderDay: 0,
  weeklyBudgetReview: false,
  recipeReminder: false,
};

export function useNotificationPrefs() {
  const [prefs, setPrefs] = useLocalStorage<NotificationPrefs>(PREFS_KEY, defaultPrefs);

  const updatePrefs = (updates: Partial<NotificationPrefs>) => {
    setPrefs(prev => ({ ...prev, ...updates }));
  };

  return { prefs, updatePrefs };
}
