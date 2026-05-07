import { useState } from 'react';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { UseStockReturn } from '../hooks/useStock';
import type { ShoppingItem, ItemCategory } from '../types';
import ItemQuickAddGrid from '../components/ItemQuickAddGrid';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

interface Props {
  shopping: UseShoppingListReturn;
  stock: UseStockReturn;
}

export default function ShoppingPage({ shopping, stock }: Props) {
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ name: '', emoji: '🛒', category: 'food' as ItemCategory });
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAddToStock = (item: ShoppingItem) => {
    if (item.masterItemId) {
      stock.addStockItem(item.masterItemId);
    }
    shopping.remove(item.id);
  };

  const showAdded = (name: string) => {
    setJustAdded(name);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">🛒 買い物リスト</h1>

      {/* トースト */}
      {justAdded && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50">
          ✓ {justAdded} を追加しました
        </div>
      )}

      {/* 今日の買い物リスト */}
      <Card>
        <h2 className="font-bold text-gray-800 mb-3">📋 今日の買い物リスト</h2>
        {shopping.list.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">リストは空です。下から追加してください。</p>
        ) : (
          <div className="space-y-2">
            {shopping.uncheckedItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#FFF8F0' }}>
                <button
                  onClick={() => shopping.toggle(item.id)}
                  className="w-6 h-6 rounded-full border-2 border-orange-300 flex items-center justify-center flex-shrink-0 active:scale-95"
                />
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <span className="flex-1 text-sm font-medium text-gray-800">{item.name}</span>
                <button onClick={() => shopping.remove(item.id)} className="text-gray-300 text-xs px-2 py-1 active:scale-95">✕</button>
              </div>
            ))}

            {shopping.checkedItems.length > 0 && (
              <>
                <div className="pt-2 pb-1">
                  <p className="text-xs text-gray-400 font-medium">購入済み</p>
                </div>
                {shopping.checkedItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 opacity-60">
                    <button
                      onClick={() => shopping.toggle(item.id)}
                      className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 active:scale-95"
                    >
                      <span className="text-white text-xs">✓</span>
                    </button>
                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                    <span className="flex-1 text-sm text-gray-500 line-through">{item.name}</span>
                    <button
                      onClick={() => handleAddToStock(item)}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg active:scale-95"
                    >在庫へ</button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (window.confirm('購入済みをすべて削除しますか？')) shopping.clearChecked();
                  }}
                  className="w-full py-2 text-xs text-gray-400 active:scale-95"
                >
                  購入済みを削除
                </button>
              </>
            )}
          </div>
        )}
      </Card>

      {/* 写真タップ式追加 */}
      <Card>
        <h2 className="font-bold text-gray-800 mb-3">📸 タップで追加</h2>
        <ItemQuickAddGrid shopping={shopping} />
      </Card>

      {/* 手入力 */}
      <div>
        <button
          onClick={() => setShowManual(!showManual)}
          className="w-full py-3 text-sm text-gray-500 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform"
        >
          {showManual ? '▲ 手入力を閉じる' : '▼ その他を手入力で追加'}
        </button>

        {showManual && (
          <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                placeholder="商品名を入力"
                value={manual.name}
                onChange={e => setManual(p => ({ ...p, name: e.target.value }))}
              />
              <input
                className="w-12 border border-gray-200 rounded-xl px-2 py-2.5 text-center text-xl"
                value={manual.emoji}
                onChange={e => setManual(p => ({ ...p, emoji: e.target.value }))}
              />
            </div>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              value={manual.category}
              onChange={e => setManual(p => ({ ...p, category: e.target.value as ItemCategory }))}
            >
              <option value="food">食品</option>
              <option value="daily">日用品</option>
              <option value="baby">子ども用品</option>
            </select>
            <PrimaryButton
              size="lg"
              className="w-full"
              onClick={() => {
                if (!manual.name.trim()) return;
                const added = shopping.addByName(manual.name.trim(), manual.emoji, manual.category);
                if (added) {
                  showAdded(manual.name.trim());
                  setManual({ name: '', emoji: '🛒', category: 'food' });
                }
              }}
            >
              追加する
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
