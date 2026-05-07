import type { Substitution } from '../types';

export const substitutions: Substitution[] = [
  {
    originalId: 'pork_cut',
    substituteIds: ['chicken_thigh'],
    note: '鶏もも肉でも同様に作れます',
  },
  {
    originalId: 'chicken_thigh',
    substituteIds: ['pork_cut'],
    note: '豚こまでも同様に作れます',
  },
  {
    originalId: 'cabbage',
    substituteIds: ['bean_sprout'],
    note: 'もやしで代用できます（食感が変わります）',
  },
  {
    originalId: 'milk',
    substituteIds: ['soy_milk'],
    note: '豆乳で代用できます',
  },
  {
    originalId: 'soy_milk',
    substituteIds: ['milk'],
    note: '牛乳で代用できます',
  },
];

export function getSubstitutes(masterItemId: string, subs: Substitution[]): string[] {
  const sub = subs.find(s => s.originalId === masterItemId);
  return sub ? sub.substituteIds : [];
}

export function getSubstitutionNote(originalId: string, substituteId: string, subs: Substitution[]): string {
  const sub = subs.find(s => s.originalId === originalId && s.substituteIds.includes(substituteId));
  return sub?.note ?? '';
}
