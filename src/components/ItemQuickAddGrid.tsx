import { useState } from 'react';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import { quickAddCategories } from '../data/quickAddCategories';

interface Props {
  shopping: UseShoppingListReturn;
}

export default function ItemQuickAddGrid({ shopping }: Props) {
  const [activeCat, setActiveCat] = useState(0);
  const cat = quickAddCategories[activeCat];

  return (
    <div>
      {/* カテゴリタブ */}
      <div className="flex gap-2 mb-3">
        {quickAddCategories.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveCat(i)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeCat === i ? '#F97316' : '#F3F4F6',
              color: activeCat === i ? '#fff' : '#6B7280',
            }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* アイテムグリッド */}
      <div className="grid grid-cols-4 gap-2">
        {cat.items.map(item => {
          const inList = shopping.isAlreadyInList(item.masterItemId);
          return (
            <button
              key={item.masterItemId}
              onClick={() => shopping.addByMasterItemId(item.masterItemId)}
              disabled={inList}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl active:scale-95 transition-all"
              style={{
                backgroundColor: inList ? '#FEF9C3' : '#FFF8F0',
                border: inList ? '2px solid #FCD34D' : '2px solid transparent',
                opacity: inList ? 0.7 : 1,
              }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs text-center text-gray-700 leading-tight">{item.name}</span>
              {inList && <span className="text-xs text-yellow-600">✓ 追加済み</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
