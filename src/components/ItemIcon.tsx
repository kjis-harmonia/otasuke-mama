interface Props {
  emoji: string;
  customIconData?: string;
  iconShape?: 'circle' | 'square';
  size?: number;
  style?: React.CSSProperties;
}

export default function ItemIcon({ emoji, customIconData, iconShape = 'square', size = 30, style }: Props) {
  const radius = iconShape === 'circle' ? '50%' : `${Math.round(size * 0.22)}px`;

  if (customIconData) {
    return (
      <img
        src={customIconData}
        alt={emoji}
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: radius,
          flexShrink: 0,
          display: 'block',
          ...style,
        }}
      />
    );
  }

  return (
    <span
      style={{
        fontSize: size,
        lineHeight: 1,
        flexShrink: 0,
        display: 'inline-block',
        ...style,
      }}
    >
      {emoji}
    </span>
  );
}
