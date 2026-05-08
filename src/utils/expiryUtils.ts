import { getTodayDate } from './dateUtils';

export type ExpiryStatus = 'expired' | 'today' | 'tomorrow' | 'soon' | 'ok' | 'none';

export interface ExpiryInfo {
  status: ExpiryStatus;
  daysUntil: number;   // negative = past, 9999 = no date
  label: string;
  badgeBg: string;
  badgeText: string;
  stripColor: string;
}

const NONE_INFO: ExpiryInfo = {
  status: 'none', daysUntil: 9999, label: '', badgeBg: '', badgeText: '', stripColor: 'transparent',
};

export function getExpiryInfo(expiryDate?: string, today?: Date): ExpiryInfo {
  if (!expiryDate) return NONE_INFO;
  const tod = today ?? getTodayDate();
  const exp = new Date(expiryDate);
  const todDay = new Date(tod.getFullYear(), tod.getMonth(), tod.getDate());
  const expDay = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate());
  const diffDays = Math.round((expDay.getTime() - todDay.getTime()) / 86400000);

  if (diffDays < 0)   return { status: 'expired',  daysUntil: diffDays, label: '期限切れ',       badgeBg: '#FFCDD2', badgeText: '#C62828', stripColor: '#F48A7A' };
  if (diffDays === 0) return { status: 'today',    daysUntil: 0,        label: '今日まで',       badgeBg: '#FFCDD2', badgeText: '#C62828', stripColor: '#F48A7A' };
  if (diffDays === 1) return { status: 'tomorrow', daysUntil: 1,        label: '明日まで',       badgeBg: '#FFE0B2', badgeText: '#BF360C', stripColor: '#F4A261' };
  if (diffDays <= 3)  return { status: 'soon',     daysUntil: diffDays, label: `あと${diffDays}日`, badgeBg: '#FFF9C4', badgeText: '#827717', stripColor: '#F4C842' };
  return NONE_INFO;
}

export function isAlertExpiry(status: ExpiryStatus): boolean {
  return status === 'expired' || status === 'today' || status === 'tomorrow' || status === 'soon';
}
