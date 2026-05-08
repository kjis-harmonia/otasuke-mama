import { useState } from 'react';
import type { UseStockReturn } from '../hooks/useStock';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { StockItem, StockStatus, FrozenItem, ExpiryType, Location } from '../types';
import { getExpiryInfo, isAlertExpiry } from '../utils/expiryUtils';
import StatusBadge from '../components/StatusBadge';
import MiniGuide from '../components/MiniGuide';
import { isTabGuideSeen, markTabGuideSeen } from '../hooks/useGuide';

type StockTab = 'food' | 'daily' | 'baby' | 'frozen';
type SortOrder = 'default' | 'expiry' | 'quantity';

interface AddFormState {
  name: string;
  emoji: string;
  quantity: number;
  unit: string;
  location: Location;
}

const FORM_DEFAULTS: Record<'food' | 'daily' | 'baby', AddFormState> = {
  food:  { name: '', emoji: '🥦', quantity: 1, unit: '個', location: '冷蔵' },
  daily: { name: '', emoji: '🧴', quantity: 1, unit: '個', location: '日用品棚' },
  baby:  { name: '', emoji: '👶', quantity: 1, unit: '個', location: '子ども用品' },
};

const EMPTY_STATE: Record<'food' | 'daily' | 'baby' | 'frozen', { emoji: string; message: string; sub: string }> = {
  food:   { emoji: '🥦', message: 'まだ食品が登録されていません',       sub: '買ったものや冷蔵庫にあるものを追加してみましょう' },
  daily:  { emoji: '🧴', message: 'まだ日用品が登録されていません',     sub: '洗剤やティッシュなどを追加できます' },
  baby:   { emoji: '👶', message: 'まだ子ども用品が登録されていません', sub: 'おむつやおしりふきなどを追加できます' },
  frozen: { emoji: '❄️', message: 'まだ冷凍・作り置きが登録されていません', sub: '冷凍ごはんや作り置きを追加できます' },
};

const ADD_BUTTON_LABEL: Record<'food' | 'daily' | 'baby', string> = {
  food:  '＋ 食品を追加',
  daily: '＋ 日用品を追加',
  baby:  '＋ 子ども用品を追加',
};

const ADD_BUTTON_STYLE: Record<'food' | 'daily' | 'baby', { bg: string; color: string; border: string }> = {
  food:  { bg: '#D4F0E3', color: '#1A8A56', border: '#A9DCC4' },
  daily: { bg: '#D8EEFF', color: '#1A507A', border: '#A8CFF0' },
  baby:  { bg: '#FFE3F4', color: '#8B2252', border: '#FFB8D8' },
};

interface Props {
  stock: UseStockReturn;
  shopping: UseShoppingListReturn;
}

function cardStyle(item: StockItem): { bg: string; stripColor: string } {
  const exp = getExpiryInfo(item.expiryDate);
  if (exp.status === 'expired' || exp.status === 'today')    return { bg: '#FFF4F2', stripColor: '#F48A7A' };
  if (exp.status === 'tomorrow')                              return { bg: '#FFFBF0', stripColor: '#F4A261' };
  if (exp.status === 'soon')                                  return { bg: '#FFFDF0', stripColor: '#F4C842' };
  if (item.stockStatus === 'empty')                           return { bg: '#FFF4F2', stripColor: '#F48A7A' };
  if (item.stockStatus === 'low')                             return { bg: '#FFFBF0', stripColor: '#F4A261' };
  return { bg: '#FFFFFF', stripColor: 'transparent' };
}

function sortFoodItems(items: StockItem[], sort: SortOrder): StockItem[] {
  if (sort === 'default') return items;
  if (sort === 'expiry') {
    return [...items].sort((a, b) => {
      const ia = getExpiryInfo(a.expiryDate);
      const ib = getExpiryInfo(b.expiryDate);
      if (isAlertExpiry(ia.status) && !isAlertExpiry(ib.status)) return -1;
      if (!isAlertExpiry(ia.status) && isAlertExpiry(ib.status)) return 1;
      return ia.daysUntil - ib.daysUntil;
    });
  }
  if (sort === 'quantity') {
    const ord: Record<StockStatus, number> = { empty: 0, low: 1, enough: 2 };
    return [...items].sort((a, b) => {
      if (ord[a.stockStatus] !== ord[b.stockStatus]) return ord[a.stockStatus] - ord[b.stockStatus];
      return a.quantity - b.quantity;
    });
  }
  return items;
}

// ── 期限編集フォーム ─────────────────────────────────────────
function ExpiryEditForm({ item, onSave, onClear, onClose }: {
  item: StockItem;
  onSave: (date: string, type: ExpiryType) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [date, setDate] = useState(item.expiryDate ?? '');
  const [type, setType] = useState<ExpiryType>(item.expiryType ?? '賞味期限');
  const inputS: React.CSSProperties = {
    border: '1.5px solid #EDD5C8', borderRadius: '10px', padding: '8px 12px',
    fontSize: '14px', backgroundColor: '#FFFAF7', outline: 'none', color: '#2F2F3A',
  };
  return (
    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F0E8E4' }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '8px' }}>📅 期限を設定</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="date"
          style={{ ...inputS, width: '100%' }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['賞味期限', '消費期限', 'なし'] as ExpiryType[]).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1, padding: '7px 4px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                backgroundColor: type === t ? '#F48A7A' : '#F0E8E4',
                color: type === t ? '#fff' : '#8C7068',
              }}
            >{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => { if (date) onSave(date, type); }}
            disabled={!date}
            style={{ flex: 2, minHeight: '40px', backgroundColor: '#A9DCC4', color: '#0F5C3A', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: date ? 'pointer' : 'default', opacity: date ? 1 : 0.4 }}
            className="active:scale-95"
          >保存</button>
          {item.expiryDate && (
            <button
              onClick={onClear}
              style={{ flex: 1, minHeight: '40px', backgroundColor: '#FFD9D0', color: '#B84030', borderRadius: '10px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
              className="active:scale-95"
            >削除</button>
          )}
          <button
            onClick={onClose}
            style={{ flex: 1, minHeight: '40px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '10px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95"
          >閉じる</button>
        </div>
      </div>
    </div>
  );
}

// ── 食品カード ───────────────────────────────────────────────
function FoodCard({ item, onQtyChange, onEmpty, onAddToShopping, onDelete, onUpdateExpiry }: {
  item: StockItem;
  onQtyChange: (delta: number) => void;
  onEmpty: () => void;
  onAddToShopping: () => void;
  onDelete: () => void;
  onUpdateExpiry: (date: string | undefined, type: ExpiryType | undefined) => void;
}) {
  const [showExpiryForm, setShowExpiryForm] = useState(false);
  const { bg, stripColor } = cardStyle(item);
  const expInfo = getExpiryInfo(item.expiryDate);

  return (
    <div style={{ backgroundColor: bg, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex' }}>
      <div style={{ width: '4px', backgroundColor: stripColor, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '14px 14px 10px 12px' }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '26px', lineHeight: 1, marginTop: '2px' }}>{item.emoji}</span>
            <div>
              <p style={{ fontWeight: 600, color: '#2F2F3A', fontSize: '15px', margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: '12px', color: '#A09890', margin: '1px 0 0' }}>{item.location}</p>
              {/* 期限バッジ */}
              {isAlertExpiry(expInfo.status) && (
                <button
                  onClick={() => setShowExpiryForm(!showExpiryForm)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    marginTop: '4px', padding: '2px 8px', borderRadius: '10px',
                    backgroundColor: expInfo.badgeBg, color: expInfo.badgeText,
                    fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer',
                  }}
                >
                  🕐 {item.expiryType} {expInfo.label}
                </button>
              )}
              {item.expiryDate && expInfo.status === 'none' && (
                <button
                  onClick={() => setShowExpiryForm(!showExpiryForm)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '4px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#F0E8E4', color: '#8C7068', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  📅 {item.expiryDate}
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#2F2F3A' }}>
              {item.quantity}<span style={{ fontSize: '12px', fontWeight: 500, color: '#A09890' }}>{item.unit}</span>
            </span>
            <StatusBadge status={item.stockStatus} />
          </div>
        </div>

        {/* ボタン +1 / -1 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button onClick={() => onQtyChange(1)}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#A9DCC4', color: '#0F5C3A', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform">＋1</button>
          <button onClick={() => onQtyChange(-1)} disabled={item.quantity <= 0}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#A8CFF0', color: '#1A507A', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', opacity: item.quantity <= 0 ? 0.35 : 1 }}
            className="active:scale-95 transition-transform">－1</button>
        </div>

        {/* 使い切った / 買い物へ */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onEmpty}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#FFD9D0', color: '#B84030', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform">使い切った</button>
          <button onClick={onAddToShopping}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#FFE3D5', color: '#B85A28', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform">🛒 買い物へ</button>
        </div>

        {/* フッター操作 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <button
            onClick={() => setShowExpiryForm(!showExpiryForm)}
            style={{ fontSize: '11px', color: '#A09890', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
          >
            {item.expiryDate ? '✏️ 期限を編集' : '📅 期限を設定'}
          </button>
          <button onClick={onDelete}
            style={{ fontSize: '11px', color: '#C8B0A8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>
            削除
          </button>
        </div>

        {/* 期限編集フォーム */}
        {showExpiryForm && (
          <ExpiryEditForm
            item={item}
            onSave={(date, type) => { onUpdateExpiry(date, type); setShowExpiryForm(false); }}
            onClear={() => { onUpdateExpiry(undefined, undefined); setShowExpiryForm(false); }}
            onClose={() => setShowExpiryForm(false)}
          />
        )}
      </div>
    </div>
  );
}

// ── 日用品・ベビーカード ─────────────────────────────────────
function DailyCard({ item, onStatus, onAddToShopping, onDelete }: {
  item: StockItem;
  onStatus: (s: StockStatus) => void;
  onAddToShopping: () => void;
  onDelete: () => void;
}) {
  const { bg, stripColor } = cardStyle(item);

  const statusBtn = (s: StockStatus, label: string, colors: { active: string; activeText: string; idle: string; idleText: string }) => {
    const isActive = item.stockStatus === s;
    return (
      <button
        onClick={() => onStatus(s)}
        style={{ flex: 1, minHeight: '44px', backgroundColor: isActive ? colors.active : colors.idle, color: isActive ? colors.activeText : colors.idleText, borderRadius: '12px', fontWeight: isActive ? 700 : 600, fontSize: '13px', border: 'none', cursor: 'pointer', transition: 'all 0.12s' }}
        className="active:scale-95"
      >{label}</button>
    );
  };

  return (
    <div style={{ backgroundColor: bg, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex' }}>
      <div style={{ width: '4px', backgroundColor: stripColor, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '14px 14px 10px 12px' }}>
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {statusBtn('enough', 'まだある', { active: '#1A8A56', activeText: '#fff', idle: '#D4F2E3', idleText: '#1A8A56' })}
          {statusBtn('low',    '少ない',   { active: '#E07A20', activeText: '#fff', idle: '#FFE8C4', idleText: '#B86820' })}
          {statusBtn('empty',  'ない',     { active: '#C04030', activeText: '#fff', idle: '#FFD9D0', idleText: '#B84030' })}
        </div>
        <button onClick={onAddToShopping}
          style={{ width: '100%', minHeight: '44px', backgroundColor: '#FFE3D5', color: '#B85A28', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          className="active:scale-95 transition-transform">🛒 買い物リストへ</button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button onClick={onDelete} style={{ fontSize: '11px', color: '#C8B0A8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}>削除</button>
        </div>
      </div>
    </div>
  );
}

// ── 冷凍カード ───────────────────────────────────────────────
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
          <button onClick={() => onQtyChange(1)}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#C0E8FF', color: '#1A70A0', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform">＋1</button>
          <button onClick={() => onQtyChange(-1)}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#E8F4FA', color: '#4090B0', borderRadius: '12px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform">－1</button>
          <button onClick={onDelete}
            style={{ flex: 1, minHeight: '44px', backgroundColor: '#FFD9D0', color: '#B84030', borderRadius: '12px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            className="active:scale-95 transition-transform">削除</button>
        </div>
      </div>
    </div>
  );
}

// ── 空状態 ───────────────────────────────────────────────────
function EmptyState({ emoji, message, sub }: { emoji: string; message: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>{emoji}</div>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#A09890', marginBottom: '8px' }}>{message}</p>
      <p style={{ fontSize: '13px', color: '#C0A898', lineHeight: 1.7 }}>{sub}</p>
    </div>
  );
}

// ── メインページ ─────────────────────────────────────────────
export default function InventoryPage({ stock, shopping }: Props) {
  const [tab, setTab]       = useState<StockTab>('food');
  const [sort, setSort]     = useState<SortOrder>('default');
  const [showAddFrozen, setShowAddFrozen] = useState(false);
  const [showGuide, setShowGuide] = useState(() => !isTabGuideSeen('inventory'));
  const [newFrozen, setNewFrozen] = useState({ name: '', emoji: '🍱', quantity: 1, unit: '個', memo: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<AddFormState>(FORM_DEFAULTS.food);

  const handleTabChange = (t: StockTab) => {
    setTab(t);
    setShowAddForm(false);
    setShowAddFrozen(false);
  };

  const openAddForm = () => {
    const cat = tab as 'food' | 'daily' | 'baby';
    setAddForm(FORM_DEFAULTS[cat]);
    setShowAddForm(true);
  };

  const handleAddStock = () => {
    if (!addForm.name.trim()) return;
    const cat = tab as 'food' | 'daily' | 'baby';
    stock.addCustomStockItem({
      name: addForm.name.trim(),
      emoji: addForm.emoji || (cat === 'food' ? '🥦' : cat === 'daily' ? '🧴' : '👶'),
      category: cat,
      location: addForm.location,
      unit: addForm.unit || '個',
      quantity: cat === 'food' ? Math.max(1, addForm.quantity) : 1,
    });
    setShowAddForm(false);
  };

  const foodItems  = stock.stock.filter(s => s.category === 'food');
  const dailyItems = stock.stock.filter(s => s.category === 'daily');
  const babyItems  = stock.stock.filter(s => s.category === 'baby');
  const sortedFood = sortFoodItems(foodItems, sort);

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
    width: '100%', border: '1.5px solid #EDD5C8', borderRadius: '12px', padding: '10px 14px',
    fontSize: '14px', backgroundColor: '#FFFAF7', outline: 'none', color: '#2F2F3A',
  };

  return (
    <div style={{ padding: '16px 16px 8px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#2F2F3A', marginBottom: '16px' }}>📦 在庫</h1>

      {/* タブ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '2px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => handleTabChange(t.id)}
            style={{ flexShrink: 0, padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: tab === t.id ? '#F48A7A' : '#F0E8E4', color: tab === t.id ? '#fff' : '#8C7068', transition: 'all 0.15s' }}
            className="active:scale-95">
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* 食品ソート */}
      {tab === 'food' && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', color: '#A09890', alignSelf: 'center', flexShrink: 0 }}>並び替え：</span>
          {([['default', '通常'], ['expiry', '期限近い順'], ['quantity', '少ない順']] as [SortOrder, string][]).map(([s, label]) => (
            <button key={s} onClick={() => setSort(s)}
              style={{ padding: '4px 10px', borderRadius: '14px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: sort === s ? '#F48A7A' : '#F0E8E4', color: sort === s ? '#fff' : '#8C7068' }}
              className="active:scale-95">
              {label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* ── 食品タブ ── */}
        {tab === 'food' && (
          <>
            {/* 追加ボタン／フォーム（最上部に固定） */}
            {!showAddForm ? (
              <button
                onClick={openAddForm}
                style={{ width: '100%', minHeight: '48px', backgroundColor: ADD_BUTTON_STYLE.food.bg, color: ADD_BUTTON_STYLE.food.color, borderRadius: '16px', fontWeight: 700, fontSize: '15px', border: `1.5px solid ${ADD_BUTTON_STYLE.food.border}`, cursor: 'pointer' }}
                className="active:scale-95 transition-transform"
              >
                {ADD_BUTTON_LABEL.food}
              </button>
            ) : (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: `1.5px solid ${ADD_BUTTON_STYLE.food.border}` }}>
                <h3 style={{ fontWeight: 700, color: '#2F2F3A', marginBottom: '12px', fontSize: '15px' }}>食品を追加</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      style={{ ...inputStyle, width: '64px', textAlign: 'center', fontSize: '22px', padding: '8px 4px' }}
                      value={addForm.emoji} maxLength={2}
                      onChange={e => setAddForm(p => ({ ...p, emoji: e.target.value }))}
                    />
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="名前（例：牛乳）" value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" style={{ ...inputStyle, flex: 1 }} placeholder="数量" value={addForm.quantity} min={1} onChange={e => setAddForm(p => ({ ...p, quantity: Number(e.target.value) }))} />
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="単位（個・本など）" value={addForm.unit} onChange={e => setAddForm(p => ({ ...p, unit: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(['冷蔵', '常温'] as Location[]).map(loc => (
                      <button key={loc} onClick={() => setAddForm(p => ({ ...p, location: loc }))}
                        style={{ flex: 1, padding: '8px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: addForm.location === loc ? '#A9DCC4' : '#F0E8E4', color: addForm.location === loc ? '#0F5C3A' : '#8C7068' }}
                      >{loc}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button onClick={handleAddStock} disabled={!addForm.name.trim()}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: addForm.name.trim() ? '#A9DCC4' : '#F0E8E4', color: addForm.name.trim() ? '#0F5C3A' : '#C0A898', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: addForm.name.trim() ? 'pointer' : 'default' }}
                      className="active:scale-95">追加する</button>
                    <button onClick={() => setShowAddForm(false)}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                      className="active:scale-95">キャンセル</button>
                  </div>
                </div>
              </div>
            )}
            {/* 空状態 */}
            {sortedFood.length === 0 && !showAddForm && (
              <EmptyState {...EMPTY_STATE.food} />
            )}
            {/* アイテム一覧 */}
            {sortedFood.map(item => (
              <FoodCard
                key={item.id}
                item={item}
                onQtyChange={d => stock.updateQuantity(item.id, d)}
                onEmpty={() => stock.updateQuantity(item.id, -item.quantity)}
                onAddToShopping={() => { if (item.masterItemId) shopping.addByMasterItemId(item.masterItemId); }}
                onDelete={() => handleDelete(item.id, item.name)}
                onUpdateExpiry={(date, type) => {
                  stock.updateStockItem(item.id, { expiryDate: date, expiryType: type });
                }}
              />
            ))}
          </>
        )}

        {/* ── 日用品タブ ── */}
        {tab === 'daily' && (
          <>
            {/* 追加ボタン／フォーム（最上部に固定） */}
            {!showAddForm ? (
              <button
                onClick={openAddForm}
                style={{ width: '100%', minHeight: '48px', backgroundColor: ADD_BUTTON_STYLE.daily.bg, color: ADD_BUTTON_STYLE.daily.color, borderRadius: '16px', fontWeight: 700, fontSize: '15px', border: `1.5px solid ${ADD_BUTTON_STYLE.daily.border}`, cursor: 'pointer' }}
                className="active:scale-95 transition-transform"
              >
                {ADD_BUTTON_LABEL.daily}
              </button>
            ) : (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: `1.5px solid ${ADD_BUTTON_STYLE.daily.border}` }}>
                <h3 style={{ fontWeight: 700, color: '#2F2F3A', marginBottom: '12px', fontSize: '15px' }}>日用品を追加</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      style={{ ...inputStyle, width: '64px', textAlign: 'center', fontSize: '22px', padding: '8px 4px' }}
                      value={addForm.emoji} maxLength={2}
                      onChange={e => setAddForm(p => ({ ...p, emoji: e.target.value }))}
                    />
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="名前（例：洗剤）" value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button onClick={handleAddStock} disabled={!addForm.name.trim()}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: addForm.name.trim() ? '#A8CFF0' : '#F0E8E4', color: addForm.name.trim() ? '#1A507A' : '#C0A898', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: addForm.name.trim() ? 'pointer' : 'default' }}
                      className="active:scale-95">追加する</button>
                    <button onClick={() => setShowAddForm(false)}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                      className="active:scale-95">キャンセル</button>
                  </div>
                </div>
              </div>
            )}
            {/* 空状態 */}
            {dailyItems.length === 0 && !showAddForm && (
              <EmptyState {...EMPTY_STATE.daily} />
            )}
            {/* アイテム一覧 */}
            {dailyItems.map(item => (
              <DailyCard key={item.id} item={item}
                onStatus={s => stock.setStatus(item.id, s)}
                onAddToShopping={() => { if (item.masterItemId) shopping.addByMasterItemId(item.masterItemId); }}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            ))}
          </>
        )}

        {/* ── 子どもタブ ── */}
        {tab === 'baby' && (
          <>
            {/* 追加ボタン／フォーム（最上部に固定） */}
            {!showAddForm ? (
              <button
                onClick={openAddForm}
                style={{ width: '100%', minHeight: '48px', backgroundColor: ADD_BUTTON_STYLE.baby.bg, color: ADD_BUTTON_STYLE.baby.color, borderRadius: '16px', fontWeight: 700, fontSize: '15px', border: `1.5px solid ${ADD_BUTTON_STYLE.baby.border}`, cursor: 'pointer' }}
                className="active:scale-95 transition-transform"
              >
                {ADD_BUTTON_LABEL.baby}
              </button>
            ) : (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: `1.5px solid ${ADD_BUTTON_STYLE.baby.border}` }}>
                <h3 style={{ fontWeight: 700, color: '#2F2F3A', marginBottom: '12px', fontSize: '15px' }}>子ども用品を追加</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      style={{ ...inputStyle, width: '64px', textAlign: 'center', fontSize: '22px', padding: '8px 4px' }}
                      value={addForm.emoji} maxLength={2}
                      onChange={e => setAddForm(p => ({ ...p, emoji: e.target.value }))}
                    />
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="名前（例：おむつ）" value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button onClick={handleAddStock} disabled={!addForm.name.trim()}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: addForm.name.trim() ? '#FFB8D8' : '#F0E8E4', color: addForm.name.trim() ? '#8B2252' : '#C0A898', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: addForm.name.trim() ? 'pointer' : 'default' }}
                      className="active:scale-95">追加する</button>
                    <button onClick={() => setShowAddForm(false)}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                      className="active:scale-95">キャンセル</button>
                  </div>
                </div>
              </div>
            )}
            {/* 空状態 */}
            {babyItems.length === 0 && !showAddForm && (
              <EmptyState {...EMPTY_STATE.baby} />
            )}
            {/* アイテム一覧 */}
            {babyItems.map(item => (
              <DailyCard key={item.id} item={item}
                onStatus={s => stock.setStatus(item.id, s)}
                onAddToShopping={() => { if (item.masterItemId) shopping.addByMasterItemId(item.masterItemId); }}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            ))}
          </>
        )}

        {/* ── 冷凍タブ ── */}
        {tab === 'frozen' && (
          <>
            {/* 追加ボタン／フォーム（最上部に固定） */}
            {!showAddFrozen ? (
              <button onClick={() => setShowAddFrozen(true)}
                style={{ width: '100%', minHeight: '48px', backgroundColor: '#C0E8FF', color: '#1A70A0', borderRadius: '16px', fontWeight: 700, fontSize: '15px', border: '1.5px solid #A0D4F0', cursor: 'pointer' }}
                className="active:scale-95 transition-transform">
                ＋ 冷凍・作り置きを追加
              </button>
            ) : (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1.5px solid #C0E8FF' }}>
                <h3 style={{ fontWeight: 700, color: '#2F2F3A', marginBottom: '12px', fontSize: '15px' }}>冷凍・作り置きを追加</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input style={inputStyle} placeholder="名前（例：冷凍ごはん）" value={newFrozen.name} onChange={e => setNewFrozen(p => ({ ...p, name: e.target.value }))} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" style={{ ...inputStyle, flex: 1 }} placeholder="数量" value={newFrozen.quantity} onChange={e => setNewFrozen(p => ({ ...p, quantity: Number(e.target.value) }))} />
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="単位（個・食分など）" value={newFrozen.unit} onChange={e => setNewFrozen(p => ({ ...p, unit: e.target.value }))} />
                  </div>
                  <input style={inputStyle} placeholder="メモ（任意）" value={newFrozen.memo} onChange={e => setNewFrozen(p => ({ ...p, memo: e.target.value }))} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        if (!newFrozen.name.trim()) return;
                        stock.addFrozenItem({ name: newFrozen.name.trim(), emoji: newFrozen.emoji, quantity: newFrozen.quantity, unit: newFrozen.unit, location: '冷凍', createdAt: '2026-05-07', memo: newFrozen.memo });
                        setNewFrozen({ name: '', emoji: '🍱', quantity: 1, unit: '個', memo: '' });
                        setShowAddFrozen(false);
                      }}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: '#7EC8F0', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                      className="active:scale-95">追加する</button>
                    <button onClick={() => setShowAddFrozen(false)}
                      style={{ flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                      className="active:scale-95">キャンセル</button>
                  </div>
                </div>
              </div>
            )}
            {/* 空状態 */}
            {stock.frozenItems.length === 0 && !showAddFrozen && (
              <EmptyState {...EMPTY_STATE.frozen} />
            )}
            {/* アイテム一覧 */}
            {stock.frozenItems.map(item => (
              <FrozenCard key={item.id} item={item}
                onQtyChange={d => stock.updateFrozenQuantity(item.id, d)}
                onDelete={() => handleDeleteFrozen(item.id, item.name)}
              />
            ))}
          </>
        )}
      </div>

      {showGuide && (
        <MiniGuide
          emoji="📦"
          title="在庫タブへようこそ"
          desc="食品・日用品・子ども用品の残量をここで管理できます。「追加」ボタンで在庫を登録しましょう。"
          tip="数量の「+」「-」で残量をラクに更新できます"
          onClose={() => { markTabGuideSeen('inventory'); setShowGuide(false); }}
        />
      )}
    </div>
  );
}
