import type { StockStatus } from '../types';

interface Props {
  status: StockStatus;
}

const CONFIG: Record<StockStatus, { label: string; bg: string; text: string }> = {
  enough: { label: 'まだある', bg: '#DCFCE7', text: '#16A34A' },
  low:    { label: '少ない',  bg: '#FEF9C3', text: '#CA8A04' },
  empty:  { label: 'ない',    bg: '#FEE2E2', text: '#DC2626' },
};

export default function StatusBadge({ status }: Props) {
  const { label, bg, text } = CONFIG[status];
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}
