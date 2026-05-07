import type { StockStatus } from '../types';

interface Props {
  status: StockStatus;
}

const CONFIG: Record<StockStatus, { label: string; bg: string; text: string }> = {
  enough: { label: 'まだある', bg: '#D4F2E3', text: '#1A8A56' },
  low:    { label: '少ない',   bg: '#FFE8C4', text: '#B86820' },
  empty:  { label: 'ない',     bg: '#FFD9D0', text: '#B84030' },
};

export default function StatusBadge({ status }: Props) {
  const { label, bg, text } = CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: bg,
        color: text,
        fontSize: '11px',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
