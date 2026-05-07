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

/* 左のカラーストリップで「少ない・ない」を一瞬で伝える */
function cardStyle(status: StockStatus): { bg: string; stripColor: string } {
  if (status === 'empty') return { bg: '#FFF4F2', stripColor: '#F48A7A' };
  if (status === 'low')   return { bg: '#FFFBF0', stripColor: '#F4A261' };
  return { bg: '#FFFFFF', stripColor: 'transparent' };
}

function FoodCard({ item, onQtyChange, onEmpty, onAddToShopping, onDelete }: {
  item: StockItem;
  onQtyChange: (delta: number) => void;
  onEmpty: () => void;
  onAddToShopping: () => void;
  onDelete: () => void;
}) {
  const { bg, stripColor } = cardStyle(item.stockStatus);
  return (
    <div style={{ backgroundColor: bg, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex' }}>
      {/* 左ストリップ */}
      <div style={{ width: '4px', backgroundColor: stripColor, flexShrink: 0 }} />
      {/* カード本体 */}
      <div style={{ flex: 1, padding: '14px 14px 10px 12px' }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.emoji}</span>
            <div>
              <p style={{ fontWeight: 600, color: '#2F2F3A', fontSize: '15px', margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: '12px', color: '#A09890', margin: 0 }}>{item.location}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#2F2F3A' }}>
              {item.quantity}<span style={{ fontSize: '12px', fontWeight: 500, color: '#A09890' }}>{item.unit}</span>
            </span>
            <StatusBadge status={item.stockStatus} />
          </div>
        </div>

        {/* ボタン1段目：+1 / -1 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={() => onQtyChange(1)}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#A9DCC4', color: '#0F5C3A', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform"
          >
            ＋1
          </button>
          <button
            onClick={() => onQtyChange(-1)}
            disabled={item.quantity <= 0}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#A8CFF0', color: '#1A507A', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', opacity: item.quantity <= 0 ? 0.35 : 1 }}
            className="active:scale-95 transition-transform"
          >
            －1
          </button>
        </div>

        {/* ボタン2段目：使い切った / 買い物へ */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onEmpty}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#FFD9D0', color: '#B84030', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform"
          >
            使い切った
          </button>
          <button
            onClick={onAddToShopping}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#FFE3D5', color: '#B85A28', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform"
          >
            🛒 買い物へ
          </button>
        </div>

        {/* 削除 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            onClick={onDelete}
            style={{ fontSize: '11px', color: '#C8B0A8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
          >
            削除
          </button>
        </div>
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
  const { bg, stripColor } = cardStyle(item.stockStatus);

  const statusBtn = (s: StockStatus, label: string, colors: { active: string; activeText: string; idle: string; idleText: string }) => {
    const isActive = item.stockStatus === s;
    return (
      <button
        onClick={() => onStatus(s)}
        style={{
          flex: 1,
          minHeight: '44px',
          backgroundColor: isActive ? colors.active : colors.idle,
          color: isActive ? colors.activeText : colors.idleText,
          borderRadius: '12px',
          fontWeight: isActive ? 700 : 600,
          fontSize: '13px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.12s',
        }}
        className="active:scale-95"
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ backgroundColor: bg, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex' }}>
      <div style={{ width: '4px', backgroundColor: stripColor, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '14px 14px 10px 12px' }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.emoji}</span>
            <div>
              <p style={{ fontWeight: 600, color: '#2F2F3A', fontSize: '15px', margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: '12px', color: '#A09890', margin: 0 }}>{item.location}</p>
            </div>
          </div>
          <StatusBadge status={item.stockStatus} />
        </div>

        {/* 残量ステータス3ボタン */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {statusBtn('enough', 'まだある', { active: '#1A8A56', activeText: '#fff', idle: '#D4F2E3', idleText: '#1A8A56' })}
          {statusBtn('low',    '少ない',   { active: '#E07A20', activeText: '#fff', idle: '#FFE8C4', idleText: '#B86820' })}
          {statusBtn('empty',  'ない',     { active: '#C04030', activeText: '#fff', idle: '#FFD9D0', idleText: '#B84030' })}
        </div>

        {/* 買い物リストへ */}
        <button
          onClick={onAddToShopping}
          style={{ width: '100%', minHeight: '44px', backgroundColor: '#FFE3D5', color: '#B85A28', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          className="active:scale-95 transition-transform"
        >
          🛒 買い物リストへ
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            onClick={onDelete}
            style={{ fontSize: '11px', color: '#C8B0A8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
          >
            削除
          </button>
        </div>
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
    <div style={{ backgroundColor: '#EFF8FF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex' }}>
      <div style={{ width: '4px', backgroundColor: '#7EC8F0', flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '14px 14px 10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.emoji}</span>
            <div>
              <p style={{ fontWeight: 600, color: '#2F2F3A', fontSize: '15px', margin: 0 }}>{item.name}</p>
              {item.memo && <p style={{ fontSize: '12px', color: '#A09890', margin: 0 }}>{item.memo}</p>}
            </div>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#2080B0' }}>
            {item.quantity}<span style={{ fontSize: '12px', fontWeight: 500, color: '#6AAAC0' }}>{item.unit}</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onQtyChange(1)}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#C0E8FF', color: '#1A70A0', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform"
          >＋1</button>
          <button
            onClick={() => onQtyChange(-1)}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#E8F4FA', color: '#4090B0', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform"
          >－1</button>
          <button
            onClick={onDelete}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#FFD9D0', color: '#B84030', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform"
          >削除</button>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage({ stock, shopping }: Props) {
  const [tab, setTab] = useState<StockTab>('food');
  const [showAddFrozen, setShowAddFrozen] = useState(false);
  const [newFrozen, setNewFrozen] = useState({ name: '', emoji: '🍱', quantity: 1, unit: '個', memo: '' });

  const foodItems  = stock.stock.filter(s => s.category === 'food');
  const dailyItems = stock.stock.filter(s => s.category === 'daily');
  const babyItems  = stock.stock.filter(s => s.category === 'baby');

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`「${name}」を在庫から削除しますか？`)) stock.deleteStockItem(id);
  };
  const handleDeleteFrozen = (id: string, name: string) => {
    if (window.confirm(`「${name}」を削除しますか？`)) stock.deleteFrozenItem(id);
  };

  const TABS: { id: StockTab; label: string; emoji: string }[] = [
    { id: 'food',   label: '食品',   emoji: '🥦' },
    { id: 'daily',  label: '日用品', emoji: '🧴' },
    { id: 'baby',   label: '子ども', emoji: '👶' },
    { id: 'frozen', label: '冷凍',   emoji: '❄️' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #EDD5C8',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    backgroundColor: '#FFFAF7',
    outline: 'none',
    color: '#2F2F3A',
  };

  return (
    <div style={{ padding: '16px 16px 8px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#2F2F3A', marginBottom: '16px' }}>📦 在庫</h1>

      {/* タブ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '2px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0,
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: tab === t.id ? '#F48A7A' : '#F0E8E4',
              color: tab === t.id ? '#fff' : '#8C7068',
              transition: 'all 0.15s',
            }}
            className="active:scale-95"
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tab === 'food' && foodItems.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            onQtyChange={d => stock.updateQuantity(item.id, d)}
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
                onQtyChange={d => stock.updateFrozenQuantity(item.id, d)}
                onDelete={() => handleDeleteFrozen(item.id, item.name)}
              />
            ))}

            <button
              onClick={() => setShowAddFrozen(true)}
              style={{ width: '100%', minHeight: '48px', backgroundColor: '#C0E8FF', color: '#1A70A0', borderRadius: '16px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              className="active:scale-95 transition-transform"
            >
              ＋ 冷凍・作り置きを追加
            </button>

            {showAddFrozen && (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1.5px solid #C0E8FF' }}>
                <h3 style={{ fontWeight: 700, color: '#2F2F3A', marginBottom: '12px', fontSize: '15px' }}>冷凍・作り置きを追加</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    style={inputStyle}
                    placeholder="名前（例：冷凍ごはん）"
                    value={newFrozen.name}
                    onChange={e => setNewFrozen(p => ({ ...p, name: e.target.value }))}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="数量"
                      value={newFrozen.quantity}
                      onChange={e => setNewFrozen(p => ({ ...p, quantity: Number(e.target.value) }))}
                    />
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="単位（個・食分など）"
                      value={newFrozen.unit}
                      onChange={e => setNewFrozen(p => ({ ...p, unit: e.target.value }))}
                    />
                  </div>
                  <input
                    style={inputStyle}
                    placeholder="メモ（任意）"
                    value={newFrozen.memo}
                    onChange={e => setNewFrozen(p => ({ ...p, memo: e.target.value }))}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        if (!newFrozen.name.trim()) return;
                        stock.addFrozenItem({ name: newFrozen.name.trim(), emoji: newFrozen.emoji, quantity: newFrozen.quantity, unit: newFrozen.unit, location: '冷凍', createdAt: '2026-05-07', memo: newFrozen.memo });
                        setNewFrozen({ name: '', emoji: '🍱', quantity: 1, unit: '個', memo: '' });
                        setShowAddFrozen(false);
                      }}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: '#7EC8F0', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                      className="active:scale-95"
                    >追加する</button>
                    <button
                      onClick={() => setShowAddFrozen(false)}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                      className="active:scale-95"
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
