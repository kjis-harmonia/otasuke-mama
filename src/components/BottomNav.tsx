import type { TabName } from '../App';

const TABS: { id: TabName; label: string; emoji: string }[] = [
  { id: 'home',      label: 'ホーム',     emoji: '🏠' },
  { id: 'inventory', label: '在庫',       emoji: '📦' },
  { id: 'shopping',  label: '買い物',     emoji: '🛒' },
  { id: 'budget',    label: '家計簿',     emoji: '💰' },
  { id: 'recipes',   label: 'うちレシピ', emoji: '🍳' },
  { id: 'settings',  label: '設定',       emoji: '⚙️' },
];

interface Props {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 bg-white border-t border-gray-100 shadow-lg"
      style={{ width: '100%', maxWidth: '430px', left: '50%', transform: 'translateX(-50%)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-2 transition-colors"
            style={{ color: activeTab === tab.id ? '#F97316' : '#9CA3AF' }}
          >
            <span className="text-xl leading-tight">{tab.emoji}</span>
            <span className="font-medium leading-tight" style={{ fontSize: '9px' }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
