export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function todayString(): string {
  return '2026-05-07'; // アプリのデモ用固定日付
}

export function getTodayDate(): Date {
  return new Date('2026-05-07');
}

export function getDayOfWeek(dateStr: string): string {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[new Date(dateStr).getDay()];
}
