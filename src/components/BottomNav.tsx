import type { TabName } from '../App';

const TABS: { id: TabName; label: string; emoji: string }[] = [
  { id: 'home',      label: 'ホーム',  emoji: '🏠' },
  { id: 'inventory', label: '在庫',    emoji: '📦' },
  { id: 'shopping',  label: '買い物',  emoji: '🛒' },
  { id: 'budget',    label: '家計簿',  emoji: '💰' },
  { id: 'recipes',   label: '献立',    emoji: '🍴' },
];

interface Props {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      maxWidth: '430px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 -2px 16px rgba(180,120,100,0.12)',
      paddingBottom: 'env(safe-area-inset-bottom, 4px)',
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 2px 8px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* ピル型背景（アクティブ時のみ） */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '5px 10px 4px',
                borderRadius: '20px',
                backgroundColor: isActive ? '#FFE3D5' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}>
                <span style={{ fontSize: '20px', lineHeight: 1.1 }}>{tab.emoji}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#D4604A' : '#B0A098',
                  letterSpacing: '-0.2px',
                  lineHeight: 1,
                }}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
