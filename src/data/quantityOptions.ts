export interface QuantityOption {
  label: string;
  fractionValue: number;
  unit: string;
}

export interface QuantityGroup {
  groupLabel: string;
  options: QuantityOption[];
}

export const QUANTITY_GROUPS: QuantityGroup[] = [
  {
    groupLabel: '個数',
    options: [
      { label: '1個',   fractionValue: 1,     unit: '個' },
      { label: '1/2個', fractionValue: 0.5,   unit: '個' },
      { label: '1/3個', fractionValue: 0.333, unit: '個' },
      { label: '1/4個', fractionValue: 0.25,  unit: '個' },
      { label: '2個',   fractionValue: 2,     unit: '個' },
      { label: '3個',   fractionValue: 3,     unit: '個' },
    ],
  },
  {
    groupLabel: '本数',
    options: [
      { label: '1本',   fractionValue: 1,     unit: '本' },
      { label: '1/2本', fractionValue: 0.5,   unit: '本' },
      { label: '1/3本', fractionValue: 0.333, unit: '本' },
      { label: '1/4本', fractionValue: 0.25,  unit: '本' },
      { label: '2本',   fractionValue: 2,     unit: '本' },
    ],
  },
  {
    groupLabel: 'パック・枚',
    options: [
      { label: '1パック',   fractionValue: 1,   unit: 'パック' },
      { label: '1/2パック', fractionValue: 0.5, unit: 'パック' },
      { label: '2パック',   fractionValue: 2,   unit: 'パック' },
      { label: '1枚',       fractionValue: 1,   unit: '枚' },
      { label: '1〜2枚',    fractionValue: 1.5, unit: '枚' },
    ],
  },
  {
    groupLabel: '調味料',
    options: [
      { label: '大さじ1',   fractionValue: 1,   unit: '大さじ' },
      { label: '大さじ2',   fractionValue: 2,   unit: '大さじ' },
      { label: '大さじ3',   fractionValue: 3,   unit: '大さじ' },
      { label: '小さじ1',   fractionValue: 1,   unit: '小さじ' },
      { label: '小さじ2',   fractionValue: 2,   unit: '小さじ' },
      { label: '少々',       fractionValue: 0.1, unit: '' },
      { label: 'ひとつまみ', fractionValue: 0.1, unit: '' },
      { label: '適量',       fractionValue: 0,   unit: '' },
    ],
  },
  {
    groupLabel: 'その他',
    options: [
      { label: '多め',   fractionValue: 1.5, unit: '' },
      { label: '少なめ', fractionValue: 0.5, unit: '' },
      { label: '少し',   fractionValue: 0.1, unit: '' },
      { label: '適量',   fractionValue: 0,   unit: '' },
    ],
  },
];

export const ALL_QUANTITY_OPTIONS: QuantityOption[] = QUANTITY_GROUPS.flatMap(g => g.options);

const FRACTION_DISPLAY: Record<string, string> = {
  '0.50': '1/2',
  '0.33': '1/3',
  '0.25': '1/4',
  '0.75': '3/4',
  '0.67': '2/3',
};

export function formatFractionalQuantity(value: number, unit: string): string {
  if (value <= 0) return `0${unit}`;
  const intPart = Math.floor(value);
  const frac = parseFloat((value - intPart).toFixed(2));
  if (frac === 0) return `${intPart}${unit}`;
  const fracStr = FRACTION_DISPLAY[frac.toFixed(2)] ?? frac.toFixed(2);
  if (intPart === 0) return `${fracStr}${unit}`;
  return `${intPart}${unit}＋${fracStr}${unit}`;
}
