import { useLocalStorage } from './useLocalStorage';
import type { BudgetEntry, WeeklyBudget } from '../types';
import {
  calcWeekTotal,
  calcRemainingBudget,
  calcDaysLeftInWeek,
  calcDailyBudget,
  getCategoryTotal,
} from '../utils/budgetCalculator';
import { getTodayDate } from '../utils/dateUtils';

const BUDGET_KEY = 'otasuke_budget_v2';
const WEEKLY_KEY = 'otasuke_weekly_v2';

const genId = () => Math.random().toString(36).slice(2, 11);

const initialEntries: BudgetEntry[] = [
  { id: 'b1', date: '2026-05-07', storeName: 'イオン',       amount: 3200, category: '食費',     memo: '' },
  { id: 'b2', date: '2026-05-06', storeName: 'ドラッグストア', amount: 1850, category: '日用品',   memo: 'シャンプー等' },
  { id: 'b3', date: '2026-05-05', storeName: 'スーパー',      amount: 2100, category: '食費',     memo: '' },
  { id: 'b4', date: '2026-05-04', storeName: 'コンビニ',      amount: 680,  category: '食費',     memo: '昼ごはん' },
  { id: 'b5', date: '2026-05-03', storeName: 'ファミレス',    amount: 2800, category: '外食',     memo: '家族ランチ' },
  { id: 'b6', date: '2026-05-02', storeName: 'スーパー',      amount: 4200, category: '食費',     memo: '' },
  { id: 'b7', date: '2026-05-01', storeName: 'ベビー用品店',  amount: 3500, category: '子ども用品', memo: 'おむつ等' },
];

const initialWeeklyBudget: WeeklyBudget = {
  amount: 15000,
  weekStartDate: '2026-05-05',
};

export function useBudget() {
  const [entries, setEntries] = useLocalStorage<BudgetEntry[]>(BUDGET_KEY, initialEntries);
  const [weeklyBudget, setWeeklyBudget] = useLocalStorage<WeeklyBudget>(WEEKLY_KEY, initialWeeklyBudget);

  const weekTotal = calcWeekTotal(entries, weeklyBudget.weekStartDate);
  const remaining = calcRemainingBudget(weeklyBudget, entries);
  const daysLeft = calcDaysLeftInWeek(weeklyBudget.weekStartDate, getTodayDate());
  const dailyBudget = calcDailyBudget(remaining, daysLeft);
  const categoryTotals = getCategoryTotal(entries, weeklyBudget.weekStartDate);

  const addEntry = (entry: Omit<BudgetEntry, 'id'>) => {
    setEntries(prev => [{ ...entry, id: genId() }, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateBudget = (amount: number) => {
    setWeeklyBudget(prev => ({ ...prev, amount }));
  };

  /** 自分の家用データへ切り替え時に支出履歴を初期化 */
  const clearEntries = () => setEntries([]);

  return {
    entries,
    weeklyBudget,
    weekTotal,
    remaining,
    daysLeft,
    dailyBudget,
    categoryTotals,
    addEntry,
    deleteEntry,
    updateBudget,
    clearEntries,
  };
}

export type UseBudgetReturn = ReturnType<typeof useBudget>;
