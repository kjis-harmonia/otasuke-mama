import { getTodayDate } from './dateUtils';

/** Returns the Monday (start) of the week containing `today` */
export function getCurrentWeekMonday(today?: Date): Date {
  const d = today ?? getTodayDate();
  const day = d.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
}

/** YYYY-MM-DD string of current week's Monday */
export function getCurrentWeekStart(today?: Date): string {
  const m = getCurrentWeekMonday(today);
  const y = m.getFullYear();
  const mo = String(m.getMonth() + 1).padStart(2, '0');
  const dy = String(m.getDate()).padStart(2, '0');
  return `${y}-${mo}-${dy}`;
}

/** { start: Monday 00:00, end: Sunday 23:59:59 } */
export function getCurrentWeekRange(today?: Date): { start: Date; end: Date } {
  const start = getCurrentWeekMonday(today);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/** "5/4(月)〜5/10(日)" */
export function formatWeekRange(today?: Date): string {
  const d = today ?? getTodayDate();
  const monday = getCurrentWeekMonday(d);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
  const fmt = (dt: Date) => `${dt.getMonth() + 1}/${dt.getDate()}(${DAYS[dt.getDay()]})`;
  return `${fmt(monday)}〜${fmt(sunday)}`;
}

export function isDateInCurrentWeek(dateStr: string, today?: Date): boolean {
  const { start, end } = getCurrentWeekRange(today);
  const d = new Date(dateStr);
  return d >= start && d <= end;
}
