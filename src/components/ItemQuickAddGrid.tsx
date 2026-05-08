import { useState } from 'react';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import { quickAddCategories } from '../data/quickAddCategories';
import { useHiddenItems } from '../hooks/useHiddenItems';

const FOOD_SUB_CATS = [
  'よく買う', '主食・米', '卵・乳製品', '豆腐・大豆', '根菜・いも',
  '葉もの', '実野菜', 'きのこ', '肉', '魚・海鮮', '果物', '調味料', '冷凍',
];

interface Props {
  shopping: UseShoppingListReturn;
  onAdded?: (name: string) => void;
}

export default function ItemQuickAddGrid({ shopping, onAdded }: Props) {
  const [activeCat, setActiveCat] = useState(0);
  const [activeSubCat, setActiveSubCat] = useState('よく買う');
  const { hideItem, isHidden } = useHiddenItems();

  const cat = quickAddCategories[activeCat];
  const isFood = activeCat === 0;

  const handleCatChange = (i: number) => {
    setActiveCat(i);
    setActiveSubCat('よく買う');
  };

  const visibleItems = cat.items.filter(item => {
    if (isHidden(item.masterItemId)) return false;
    if (!isFood) return true;
    if (activeSubCat === 'よく買う') return !!item.isFrequent;
    return item.subCategory === activeSubCat;
  });

  return (
    <div>
      {/* カテゴリタブ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {quickAddCategories.map((c, i) => (
          <button
            key={i}
            onClick={() => handleCatChange(i)}
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

      {/* サブカテゴリチップ（食品のみ） */}
      {isFood && (
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '12px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {FOOD_SUB_CATS.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubCat(sub)}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeSubCat === sub ? '#F48A7A' : '#F0E8E4',
                color: activeSubCat === sub ? '#fff' : '#8C7068',
                whiteSpace: 'nowrap',
                transition: 'all 0.12s',
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* 3列グリッド */}
      {visibleItems.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#C0A898', padding: '20px 0' }}>
          このカテゴリにアイテムはありません
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {visibleItems.map(item => {
            const inList = shopping.isAlreadyInList(item.masterItemId);
            return (
              <div
                key={item.masterItemId}
                onClick={() => {
                  if (inList) return;
                  const added = shopping.addByMasterItemId(item.masterItemId);
                  if (added && onAdded) onAdded(item.name);
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px 10px',
                  borderRadius: '16px',
                  border: inList ? '2px solid #A9DCC4' : '2px solid transparent',
                  backgroundColor: inList ? '#E8F8F0' : '#FFFAF7',
                  cursor: inList ? 'default' : 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  userSelect: 'none',
                }}
                className={inList ? '' : 'active:scale-95'}
              >
                {/* 非表示ボタン */}
                {!inList && (
                  <button
                    onClick={e => { e.stopPropagation(); hideItem(item.masterItemId); }}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      color: '#999',
                      padding: 0,
                      lineHeight: 1,
                    }}
                    title="非表示にする"
                  >
                    ✕
                  </button>
                )}

                <span style={{ fontSize: '30px', lineHeight: 1 }}>{item.emoji}</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: inList ? '#1A8A56' : '#2F2F3A',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  wordBreak: 'break-all',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  width: '100%',
                }}>
                  {item.name}
                </span>
                {inList ? (
                  <span style={{ fontSize: '11px', color: '#1A8A56', fontWeight: 700 }}>✓ 追加済み</span>
                ) : (
                  <span style={{ fontSize: '11px', color: '#C0A898' }}>タップで追加</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
