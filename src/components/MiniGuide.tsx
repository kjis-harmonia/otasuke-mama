interface Props {
  emoji: string;
  title: string;
  desc: string;
  tip?: string;
  onClose: () => void;
}

export default function MiniGuide({ emoji, title, desc, tip, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 90, padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '360px',
          backgroundColor: '#FFF8F1', borderRadius: '24px',
          padding: '28px 24px 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          backgroundColor: '#F0E8E4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', marginBottom: '16px',
        }}>
          {emoji}
        </div>

        <p style={{ fontSize: '17px', fontWeight: 800, color: '#2F2F3A', marginBottom: '10px', lineHeight: 1.3 }}>
          {title}
        </p>

        <p style={{ fontSize: '13px', color: '#5A4A44', lineHeight: 1.8, marginBottom: tip ? '14px' : '20px' }}>
          {desc}
        </p>

        {tip && (
          <div style={{
            backgroundColor: '#FFF0EC', borderRadius: '10px',
            padding: '10px 14px', marginBottom: '20px',
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            width: '100%', textAlign: 'left',
          }}>
            <span style={{ fontSize: '13px', flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: '12px', color: '#5A4A44', lineHeight: 1.6, fontWeight: 600 }}>{tip}</p>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%', minHeight: '48px', borderRadius: '14px', border: 'none',
            backgroundColor: '#F48A7A', color: '#fff',
            fontWeight: 700, fontSize: '15px', cursor: 'pointer',
          }}
          className="active:scale-95"
        >
          わかった！
        </button>
      </div>
    </div>
  );
}
