import { useState } from 'react';
import type { UseStockReturn } from '../hooks/useStock';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { StockItem, StockStatus, FrozenItem } from '../types';
import StatusBadge from '../components/StatusBadge';

type StockTab = 'food' | 'daily' | 'baby' | 'frozen';

interface Props {
  stock: UseStockReturn;
  shopping: UseShoppingListReturn;
}

function FoodCard({ item, onQtyChange, onEmpty, onAddToShopping, onDelete }: {
  item: StockItem;
  onQtyChange: (delta: number) => void;
  onEmpty: () => void;
  onAddToShopping: () => void;
  onDelete: () => void;
}) {
  const bgColor = item.stockStatus === 'empty' ? '#FEF2F2' : item.stockStatus === 'low' ? '#FFFBEB' : '#FFFFFF';
  return (
    <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{item.emoji}</span>
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-400">{item.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800">{item.quantity}{item.unit}</span>
          <StatusBadge status={item.stockStatus} />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => onQtyChange(1)} className="flex-1 py-2.5 bg-green-100 text-green-700 font-bold rounded-xl text-sm active:scale-95 transition-transform">+1</button>
        <button onClick={() => onQtyChange(-1)} disabled={item.quantity <= 0} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm active:scale-95 transition-transform disabled:opacity-40">-1</button>
        <button onClick={onEmpty} className="flex-1 py-2.5 bg-red-100 text-red-600 font-bold rounded-xl text-sm active:scale-95 transition-transform">使い切った</button>
        <button onClick={onAddToShopping} className="flex-1 py-2.5 bg-orange-100 text-orange-700 font-bold rounded-xl text-sm active:scale-95 transition-transform">🛒 買い物へ</button>
      </div>
      <div className="flex justify-end mt-2">
        <button onClick={onDelete} className="text-xs text-gray-300 px-2 py-1 active:scale-95">削除</button>
      </div>
    </div>
  );
}

function DailyCard({ item, onStatus, onAddToShopping, onDelete }: {
  item: StockItem;
  onStatus: (s: StockStatus) => void;
  onAddToShopping: () => void;
  onDelete: () => void;
}) {
  const bgColor = item.stockStatus === 'empty' ? '#FEF2F2' : item.stockStatus === 'low' ? '#FFFBEB' : '#FFFFFF';
  return (
    <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{item.emoji}</span>
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-400">{item.location}</p>
          </div>
        </div>
        <StatusBadge status={item.stockStatus} />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onStatus('enough')}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-all"
          style={{ backgroundColor: item.stockStatus === 'enough' ? '#22C55E' : '#DCFCE7', color: item.stockStatus === 'enough' ? '#fff' : '#16A34A' }}
        >まだある</button>
        <button
          onClick={() => onStatus('low')}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-all"
          style={{ backgroundColor: item.stockStatus === 'low' ? '#EAB308' : '#FEF9C3', color: item.stockStatus === 'low' ? '#fff' : '#CA8A04' }}
        >少ない</button>
        <button
          onClick={() => onStatus('empty')}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-all"
          style={{ backgroundColor: item.stockStatus === 'empty' ? '#EF4444' : '#FEE2E2', color: item.stockStatus === 'empty' ? '#fff' : '#DC2626' }}
        >ない</button>
      </div>
      <button onClick={onAddToShopping} className="mt-2 w-full py-2.5 bg-orange-100 text-orange-700 font-medium rounded-xl text-sm active:scale-95 transition-transform">🛒 買い物リストへ</button>
      <div className="flex justify-end mt-1">
        <button onClick={onDelete} className="text-xs text-gray-300 px-2 py-1 active:scale-95">削除</button>
      </div>
    </div>
  );
}

function FrozenCard({ item, onQtyChange, onDelete }: {
  item: FrozenItem;
  onQtyChange: (delta: number) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-blue-50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{item.emoji}</span>
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            {item.memo && <p className="text-xs text-gray-400">{item.memo}</p>}
          </div>
        </div>
        <span className="text-lg font-bold text-blue-700">{item.quantity}{item.unit}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onQtyChange(1)} className="flex-1 py-2.5 bg-blue-100 text-blue-700 font-bold rounded-xl text-sm active:scale-95">+1</button>
        <button onClick={() => onQtyChange(-1)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm active:scale-95">-1</button>
        <button onClick={onDelete} className="flex-1 py-2.5 bg-red-100 text-red-600 font-bold rounded-xl text-sm active:scale-95">削除</button>
      </div>
    </div>
  );
}

export default function InventoryPage({ stock, shopping }: Props) {
  const [tab, setTab] = useState<StockTab>('food');
  const [showAddFrozen, setShowAddFrozen] = useState(false);
  const [newFrozen, setNewFrozen] = useState({ name: '', emoji: '🍱', quantity: 1, unit: '個', memo: '' });

  const foodItems = stock.stock.filter(s => s.category === 'food');
  const dailyItems = stock.stock.filter(s => s.category === 'daily');
  const babyItems = stock.stock.filter(s => s.category === 'baby');

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`「${name}」を在庫から削除しますか？`)) {
      stock.deleteStockItem(id);
    }
  };

  const handleDeleteFrozen = (id: string, name: string) => {
    if (window.confirm(`「${name}」を削除しますか？`)) {
      stock.deleteFrozenItem(id);
    }
  };

  const TABS: { id: StockTab; label: string; emoji: string }[] = [
    { id: 'food',   label: '食品',   emoji: '🥦' },
    { id: 'daily',  label: '日用品', emoji: '🧴' },
    { id: 'baby',   label: '子ども', emoji: '👶' },
    { id: 'frozen', label: '冷凍',   emoji: '❄️' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">📦 在庫</h1>

      {/* タブ */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ backgroundColor: tab === t.id ? '#F97316' : '#F3F4F6', color: tab === t.id ? '#fff' : '#6B7280' }}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tab === 'food' && foodItems.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            onQtyChange={delta => stock.updateQuantity(item.id, delta)}
            onEmpty={() => stock.updateQuantity(item.id, -item.quantity)}
            onAddToShopping={() => { if (item.masterItemId) shopping.addByMasterItemId(item.masterItemId); }}
            onDelete={() => handleDelete(item.id, item.name)}
          />
        ))}

        {tab === 'daily' && dailyItems.map(item => (
          <DailyCard
            key={item.id}
            item={item}
            onStatus={s => stock.setStatus(item.id, s)}
            onAddToShopping={() => { if (item.masterItemId) shopping.addByMasterItemId(item.masterItemId); }}
            onDelete={() => handleDelete(item.id, item.name)}
          />
        ))}

        {tab === 'baby' && babyItems.map(item => (
          <DailyCard
            key={item.id}
            item={item}
            onStatus={s => stock.setStatus(item.id, s)}
            onAddToShopping={() => { if (item.masterItemId) shopping.addByMasterItemId(item.masterItemId); }}
            onDelete={() => handleDelete(item.id, item.name)}
          />
        ))}

        {tab === 'frozen' && (
          <>
            {stock.frozenItems.map(item => (
              <FrozenCard
                key={item.id}
                item={item}
                onQtyChange={delta => stock.updateFrozenQuantity(item.id, delta)}
                onDelete={() => handleDeleteFrozen(item.id, item.name)}
              />
            ))}

            <button
              onClick={() => setShowAddFrozen(true)}
              className="w-full py-3 rounded-2xl text-sm font-medium bg-blue-100 text-blue-700 active:scale-95 transition-transform"
            >
              ＋ 冷凍・作り置きを追加
            </button>

            {showAddFrozen && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-3">冷凍・作り置きを追加</h3>
                <div className="space-y-2">
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    placeholder="名前（例：冷凍ごはん）"
                    value={newFrozen.name}
                    onChange={e => setNewFrozen(p => ({ ...p, name: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                      placeholder="数量"
                      value={newFrozen.quantity}
                      onChange={e => setNewFrozen(p => ({ ...p, quantity: Number(e.target.value) }))}
                    />
                    <input
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                      placeholder="単位（個・食分など）"
                      value={newFrozen.unit}
                      onChange={e => setNewFrozen(p => ({ ...p, unit: e.target.value }))}
                    />
                  </div>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    placeholder="メモ（任意）"
                    value={newFrozen.memo}
                    onChange={e => setNewFrozen(p => ({ ...p, memo: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!newFrozen.name.trim()) return;
                        stock.addFrozenItem({
                          name: newFrozen.name.trim(),
                          emoji: newFrozen.emoji,
                          quantity: newFrozen.quantity,
                          unit: newFrozen.unit,
                          location: '冷凍',
                          createdAt: '2026-05-07',
                          memo: newFrozen.memo,
                        });
                        setNewFrozen({ name: '', emoji: '🍱', quantity: 1, unit: '個', memo: '' });
                        setShowAddFrozen(false);
                      }}
                      className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl text-sm active:scale-95"
                    >追加する</button>
                    <button
                      onClick={() => setShowAddFrozen(false)}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm active:scale-95"
                    >キャンセル</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
