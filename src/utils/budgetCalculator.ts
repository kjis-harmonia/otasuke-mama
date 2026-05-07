import type { BudgetEntry, WeeklyBudget } from '../types';

export function getWeekDateRange(weekStartDate: string): { start: Date; end: Date } {
  const start = new Date(weekStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export function getWeekEntries(entries: BudgetEntry[], weekStartDate: string): BudgetEntry[] {
  const { start, end } = getWeekDateRange(weekStartDate);
  return entries.filter(e => {
    const d = new Date(e.date);
    return d >= start && d <= end && e.category === '食費';
  });
}

export function calcWeekTotal(entries: BudgetEntry[], weekStartDate: string): number {
  return getWeekEntries(entries, weekStartDate).reduce((sum, e) => sum + e.amount, 0);
}

export function calcRemainingBudget(budget: WeeklyBudget, entries: BudgetEntry[]): number {
  return budget.amount - calcWeekTotal(entries, budget.weekStartDate);
}

export function calcDaysLeftInWeek(weekStartDate: string, today: Date): number {
  const { end } = getWeekDateRange(weekStartDate);
  const diffMs = end.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function calcDailyBudget(remaining: number, daysLeft: number): number {
  if (daysLeft <= 0) return 0;
  return Math.floor(remaining / daysLeft);
}

export function getCategoryTotal(entries: BudgetEntry[], weekStartDate: string): Record<string, number> {
  const { start, end } = getWeekDateRange(weekStartDate);
  const weekEntries = entries.filter(e => {
    const d = new Date(e.date);
    return d >= start && d <= end;
  });
  return weekEntries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
}
