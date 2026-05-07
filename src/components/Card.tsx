import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, className = '', style }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-4 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
