import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'orange' | 'blue' | 'green' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<string, { bg: string; text: string }> = {
  orange: { bg: '#F97316', text: '#fff' },
  blue:   { bg: '#60A5FA', text: '#fff' },
  green:  { bg: '#34D399', text: '#fff' },
  red:    { bg: '#F87171', text: '#fff' },
  gray:   { bg: '#E5E7EB', text: '#6B7280' },
};

const SIZE_STYLES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-4 py-4 text-base rounded-2xl font-bold',
};

export default function PrimaryButton({ children, onClick, variant = 'orange', size = 'md', disabled, className = '' }: Props) {
  const { bg, text } = VARIANT_STYLES[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium active:scale-95 transition-transform disabled:opacity-50 ${SIZE_STYLES[size]} ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </button>
  );
}
