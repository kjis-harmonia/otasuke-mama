import { useState } from 'react';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import { quickAddCategories } from '../data/quickAddCategories';

interface Props {
  shopping: UseShoppingListReturn;
  onAdded?: (name: string) => void;
}

export default function ItemQuickAddGrid({ shopping, onAdded }: Props) {
  const [activeCat, setActiveCat] = useState(0);
  const cat = quickAddCategories[activeCat];

  const handleTap = (masterItemId: string, name: string) => {
    const added = shopping.addByMasterItemId(masterItemId);
    if (added && onAdded) onAdded(name);
  };

  return (
    <div>
      {/* カテゴリタブ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {quickAddCategories.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveCat(i)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeCat === i ? '#F48A7A' : '#F0E8E4',
              color: activeCat === i ? '#fff' : '#8C7068',
              transition: 'all 0.15s',
            }}
            className="active:scale-95"
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* 3列グリッド */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
      }}>
        {cat.items.map(item => {
          const inList = shopping.isAlreadyInList(item.masterItemId);
          return (
            <button
              key={item.masterItemId}
              onClick={() => handleTap(item.masterItemId, item.name)}
              disabled={inList}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 8px 10px',
                borderRadius: '16px',
                border: inList ? '2px solid #A9DCC4' : '2px solid transparent',
                backgroundColor: inList ? '#E8F8F0' : '#FFFAF7',
                cursor: inList ? 'default' : 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
              className={inList ? '' : 'active:scale-95'}
            >
              <span style={{ fontSize: '30px', lineHeight: 1 }}>{item.emoji}</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: inList ? '#1A8A56' : '#2F2F3A',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {item.name}
              </span>
              {inList ? (
                <span style={{ fontSize: '11px', color: '#1A8A56', fontWeight: 700 }}>✓ 追加済み</span>
              ) : (
                <span style={{ fontSize: '11px', color: '#C0A898' }}>タップで追加</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
