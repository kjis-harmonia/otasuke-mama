import { useState, useMemo } from 'react';
import type { UseStockReturn } from '../hooks/useStock';
import type { ExpiryType, Location, ItemCategory, MasterItem } from '../types';
import { masterItems } from '../data/masterItems';
import { useCustomItems } from '../hooks/useCustomItems';

type BigCat = 'food' | 'daily' | 'baby' | 'frozen';

interface GridItem extends MasterItem {
  isCustom?: boolean;
}

interface Props {
  initialBigCat: BigCat;
  stock: UseStockReturn;
  onClose: () => void;
}

const FOOD_SUBCATS = ['よく買う', '主食・米', '卵・乳製品', '豆腐・大豆', '根菜・いも', '葉もの', '実野菜', 'きのこ', '肉', '魚・海鮮', '果物', '調味料'];
const DAILY_SUBCATS = ['洗濯', '台所', 'トイレ', '入浴', '洗面', 'その他'];
const BABY_SUBCATS = ['ケア', '食品'];

const UNITS = ['個', '本', 'パック', '袋', '枚', '食分', 'g', 'ml', '切れ', '杯分', '合', '缶', '箱', '玉', 'ロール'];
const QTY_PRESETS = [1, 2, 3, 0.5];

const DEFAULT_LOC: Record<BigCat, Location> = {
  food: '冷蔵',
  daily: '日用品棚',
  baby: '子ども用品',
  frozen: '冷凍',
};

const LOCS_BY_CAT: Record<BigCat, string[]> = {
  food:   ['冷蔵', '常温', '冷凍'],
  daily:  ['日用品棚'],
  baby:   ['子ども用品'],
  frozen: ['冷凍', '冷蔵'],
};

const CAT_STYLE: Record<BigCat, { label: string; accent: string; bg: string; border: string }> = {
  food:   { label: '食品',       accent: '#1A8A56', bg: '#D4F0E3', border: '#A9DCC4' },
  daily:  { label: '日用品',     accent: '#1A507A', bg: '#D8EEFF', border: '#A8CFF0' },
  baby:   { label: '子ども用品', accent: '#8B2252', bg: '#FFE3F4', border: '#FFB8D8' },
  frozen: { label: '冷凍',       accent: '#1A70A0', bg: '#C0E8FF', border: '#A0D4F0' },
};

function initSubCat(cat: BigCat): string {
  if (cat === 'food')  return 'よく買う';
  if (cat === 'daily') return DAILY_SUBCATS[0];
  if (cat === 'baby')  return BABY_SUBCATS[0];
  return '';
}

export default function AddStockForm({ initialBigCat, stock, onClose }: Props) {
  const [bigCat, setBigCat]         = useState<BigCat>(initialBigCat);
  const [subCat, setSubCat]         = useState(() => initSubCat(initialBigCat));
  const [picked, setPicked]         = useState<GridItem | null>(null);
  const [qty, setQty]               = useState(1);
  const [manualQty, setManualQty]   = useState('');
  const [unit, setUnit]             = useState('個');
  const [location, setLocation]     = useState<Location>(DEFAULT_LOC[initialBigCat]);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryType, setExpiryType] = useState<ExpiryType>('賞味期限');
  const [showExpiry, setShowExpiry] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualEmoji, setManualEmoji] = useState('');
  const [saveToCustom, setSaveToCustom] = useState(true);
  const [frozenMemo, setFrozenMemo] = useState('');

  const { visibleItems: customItems, addCustomItem } = useCustomItems();

  const handleBigCatChange = (cat: BigCat) => {
    setBigCat(cat);
    setSubCat(initSubCat(cat));
    setLocation(DEFAULT_LOC[cat]);
    setPicked(null);
    setUnit('個');
    setQty(1);
    setManualQty('');
  };

  const subCats = useMemo(() => {
    if (bigCat === 'food')  return FOOD_SUBCATS;
    if (bigCat === 'daily') return DAILY_SUBCATS;
    if (bigCat === 'baby')  return BABY_SUBCATS;
    return [];
  }, [bigCat]);

  const gridItems = useMemo((): GridItem[] => {
    let base: MasterItem[] = [];
    if (bigCat === 'frozen') {
      base = masterItems.filter(m => m.subCategory === '冷凍');
    } else {
      const cat = bigCat as ItemCategory;
      base = subCat === 'よく買う'
        ? masterItems.filter(m => m.category === cat && m.isQuickAdd)
        : masterItems.filter(m => m.category === cat && m.subCategory === subCat);
    }

    const customs: GridItem[] = customItems
      .filter(c => {
        if (bigCat === 'frozen') return c.category === 'food' && c.subCategory === '冷凍';
        return c.category === bigCat && (subCat === 'よく買う' || c.subCategory === subCat);
      })
      .map(c => ({
        id: c.id,
        name: c.name,
        emoji: c.emoji,
        category: c.category,
        subCategory: c.subCategory,
        defaultUnit: '個',
        defaultLocation: DEFAULT_LOC[bigCat],
        isQuickAdd: false,
        isCustom: true,
      }));

    return [...base, ...customs];
  }, [bigCat, subCat, customItems]);

  const isAlreadyInStock = (item: GridItem): boolean => {
    if (bigCat === 'frozen') {
      return stock.frozenItems.some(f => (item.isCustom ? f.name === item.name : f.masterItemId === item.id) || f.name === item.name);
    }
    if (item.isCustom) {
      return stock.stock.some(s => s.name === item.name && s.category === item.category);
    }
    return stock.stock.some(s => s.masterItemId === item.id);
  };

  const handlePickItem = (item: GridItem) => {
    if (picked?.id === item.id) {
      setPicked(null);
      return;
    }
    setPicked(item);
    setUnit(item.defaultUnit || '個');
    setLocation(item.defaultLocation || DEFAULT_LOC[bigCat]);
  };

  const actualQty = manualQty !== '' ? (parseFloat(manualQty) || 1) : qty;

  const handleSubmit = () => {
    if (picked) {
      if (bigCat === 'frozen') {
        const existing = stock.frozenItems.find(f =>
          (!picked.isCustom && f.masterItemId === picked.id) || f.name === picked.name
        );
        if (existing) {
          stock.updateFrozenQuantity(existing.id, actualQty);
        } else {
          stock.addFrozenItem({
            ...(picked.isCustom ? {} : { masterItemId: picked.id }),
            name: picked.name,
            emoji: picked.emoji,
            quantity: actualQty,
            unit,
            location: location as '冷凍' | '冷蔵',
            createdAt: '2026-05-07',
            memo: '',
          });
        }
      } else {
        const expiryFields = (bigCat === 'food' && expiryDate)
          ? { expiryDate, expiryType }
          : {};
        if (picked.isCustom) {
          const existing = stock.stock.find(s => s.name === picked.name && s.category === picked.category);
          if (existing) {
            stock.updateQuantity(existing.id, actualQty);
          } else {
            stock.addCustomStockItem({
              name: picked.name,
              emoji: picked.emoji,
              category: picked.category,
              location,
              unit,
              quantity: actualQty,
              subCategory: picked.subCategory,
              ...expiryFields,
            });
          }
        } else {
          const existing = stock.stock.find(s => s.masterItemId === picked.id);
          if (existing) {
            stock.updateQuantity(existing.id, actualQty);
          } else {
            stock.addStockItem(picked.id, { quantity: actualQty, unit, location, ...expiryFields });
          }
        }
      }
      onClose();
      return;
    }

    if (showManual && manualName.trim()) {
      const cat: ItemCategory = bigCat === 'frozen' ? 'food' : bigCat as ItemCategory;
      const defaultEmoji = bigCat === 'frozen' ? '🍱' : bigCat === 'food' ? '🥦' : bigCat === 'daily' ? '🧴' : '👶';
      const emoji = manualEmoji.trim() || defaultEmoji;

      if (saveToCustom) {
        addCustomItem({
          name: manualName.trim(),
          emoji,
          category: cat,
          subCategory: bigCat === 'frozen' ? '冷凍' : (subCat === 'よく買う' ? '' : subCat),
        });
      }

      if (bigCat === 'frozen') {
        stock.addFrozenItem({
          name: manualName.trim(),
          emoji,
          quantity: actualQty,
          unit,
          location: location as '冷凍' | '冷蔵',
          createdAt: '2026-05-07',
          memo: frozenMemo,
        });
      } else {
        const existing = stock.stock.find(s => s.name === manualName.trim() && s.category === cat);
        const expiryFields = (bigCat === 'food' && expiryDate) ? { expiryDate, expiryType } : {};
        if (existing) {
          stock.updateQuantity(existing.id, actualQty);
        } else {
          stock.addCustomStockItem({
            name: manualName.trim(),
            emoji,
            category: cat,
            location,
            unit,
            quantity: actualQty,
            subCategory: subCat === 'よく買う' ? '' : subCat,
            ...expiryFields,
          });
        }
      }
      onClose();
    }
  };

  const st = CAT_STYLE[bigCat];
  const canSubmit = picked !== null || (showManual && manualName.trim().length > 0);
  const submitLabel = picked && isAlreadyInStock(picked) ? '数量を追加する' : '在庫に追加する';

  const chipBtn = (active: boolean, label: string, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '5px 12px',
        borderRadius: '14px',
        fontSize: '12px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        backgroundColor: active ? st.bg : '#F0E8E4',
        color: active ? st.accent : '#8C7068',
        transition: 'all 0.12s',
      }}
      className="active:scale-95"
    >
      {label}
    </button>
  );

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      border: `1.5px solid ${st.border}`,
    }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontWeight: 700, color: '#2F2F3A', fontSize: '16px', margin: 0 }}>在庫を追加</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A09890', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '0 4px' }}>✕</button>
      </div>

      {/* 大カテゴリタブ */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '2px' }}>
        {(Object.keys(CAT_STYLE) as BigCat[]).map(cat => {
          const cs = CAT_STYLE[cat];
          return (
            <button
              key={cat}
              onClick={() => handleBigCatChange(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '18px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: bigCat === cat ? cs.bg : '#F0E8E4',
                color: bigCat === cat ? cs.accent : '#8C7068',
                transition: 'all 0.12s',
              }}
              className="active:scale-95"
            >
              {cs.label}
            </button>
          );
        })}
      </div>

      {/* 中カテゴリチップ */}
      {subCats.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '2px' }}>
          {subCats.map(sc => chipBtn(subCat === sc, sc, () => { setSubCat(sc); setPicked(null); }))}
        </div>
      )}

      {/* 商品グリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px', maxHeight: '220px', overflowY: 'auto' }}>
        {gridItems.map(item => {
          const inStock = isAlreadyInStock(item);
          const isSelected = picked?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handlePickItem(item)}
              style={{
                padding: '8px 4px',
                borderRadius: '12px',
                border: isSelected ? `2px solid ${st.accent}` : '2px solid transparent',
                cursor: 'pointer',
                backgroundColor: isSelected ? st.bg : inStock ? '#F5F2F0' : '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                position: 'relative',
              }}
              className="active:scale-95"
            >
              {inStock && !isSelected && (
                <span style={{ position: 'absolute', top: '3px', right: '4px', fontSize: '9px', color: '#1A8A56', fontWeight: 700 }}>✓</span>
              )}
              <span style={{ fontSize: '20px' }}>{item.emoji}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: isSelected ? st.accent : '#5C4C44', textAlign: 'center', lineHeight: 1.3, wordBreak: 'break-all' }}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 数量・単位・保存場所コントロール */}
      <div style={{ backgroundColor: '#FAFAFA', borderRadius: '14px', padding: '12px', marginBottom: '10px' }}>
        {picked && (
          <p style={{ fontSize: '12px', fontWeight: 700, color: st.accent, marginBottom: '8px' }}>
            {picked.emoji} {picked.name} を追加
          </p>
        )}

        {/* 数量プリセット */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
          {QTY_PRESETS.map(q => (
            <button
              key={q}
              onClick={() => { setQty(q); setManualQty(''); }}
              style={{
                flex: 1,
                minHeight: '38px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '14px',
                backgroundColor: qty === q && manualQty === '' ? st.bg : '#EDEDEA',
                color: qty === q && manualQty === '' ? st.accent : '#6C6060',
              }}
              className="active:scale-95"
            >
              {q === 0.5 ? '½' : q}
            </button>
          ))}
          <input
            type="number"
            min="0.1"
            step="0.1"
            placeholder="他"
            value={manualQty}
            onChange={e => { setManualQty(e.target.value); if (e.target.value) setQty(0); }}
            style={{
              flex: 1,
              minHeight: '38px',
              borderRadius: '10px',
              border: `1.5px solid ${manualQty ? st.border : '#DDD8D4'}`,
              textAlign: 'center',
              fontSize: '13px',
              backgroundColor: manualQty ? st.bg : '#fff',
              color: '#2F2F3A',
              outline: 'none',
            }}
          />
        </div>

        {/* 単位チップ */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {UNITS.map(u => chipBtn(unit === u, u, () => setUnit(u)))}
        </div>

        {/* 保存場所チップ */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {LOCS_BY_CAT[bigCat].map(loc => chipBtn(location === loc, loc, () => setLocation(loc as Location)))}
        </div>
      </div>

      {/* 賞味期限（食品のみ・任意） */}
      {bigCat === 'food' && (
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={() => setShowExpiry(!showExpiry)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#A09890', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
          >
            <span>{showExpiry ? '▾' : '▸'}</span>
            <span>📅 賞味期限を入力する（任意）</span>
          </button>
          {showExpiry && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #EDD5C8', borderRadius: '10px', padding: '8px 12px', fontSize: '14px', backgroundColor: '#FFFAF7', outline: 'none', color: '#2F2F3A', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['賞味期限', '消費期限', 'なし'] as ExpiryType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setExpiryType(t)}
                    style={{ flex: 1, padding: '7px 4px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: expiryType === t ? '#F48A7A' : '#F0E8E4', color: expiryType === t ? '#fff' : '#8C7068' }}
                  >{t}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 一覧にない商品を手入力 */}
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={() => setShowManual(!showManual)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#A09890', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
        >
          <span>{showManual ? '▾' : '▸'}</span>
          <span>一覧にない商品を手入力する</span>
        </button>
        {showManual && (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                style={{ width: '56px', textAlign: 'center', fontSize: '22px', padding: '8px 4px', border: '1.5px solid #EDD5C8', borderRadius: '10px', backgroundColor: '#FFFAF7', outline: 'none', flexShrink: 0 }}
                value={manualEmoji}
                maxLength={2}
                placeholder="📦"
                onChange={e => setManualEmoji(e.target.value)}
              />
              <input
                style={{ flex: 1, border: '1.5px solid #EDD5C8', borderRadius: '10px', padding: '8px 12px', fontSize: '14px', backgroundColor: '#FFFAF7', outline: 'none', color: '#2F2F3A' }}
                placeholder="商品名を入力"
                value={manualName}
                onChange={e => setManualName(e.target.value)}
              />
            </div>
            {bigCat === 'frozen' && (
              <input
                style={{ width: '100%', border: '1.5px solid #EDD5C8', borderRadius: '10px', padding: '8px 12px', fontSize: '14px', backgroundColor: '#FFFAF7', outline: 'none', color: '#2F2F3A', boxSizing: 'border-box' }}
                placeholder="メモ（任意）"
                value={frozenMemo}
                onChange={e => setFrozenMemo(e.target.value)}
              />
            )}
            <button
              onClick={() => setSaveToCustom(!saveToCustom)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', textAlign: 'left' }}
            >
              <div style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: saveToCustom ? '#1A8A56' : '#D0C8C4', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: saveToCustom ? '19px' : '3px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#8C7068' }}>次回から候補に表示する</span>
            </button>
          </div>
        )}
      </div>

      {/* 追加ボタン */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: '100%',
          minHeight: '52px',
          borderRadius: '16px',
          fontWeight: 700,
          fontSize: '15px',
          border: 'none',
          cursor: canSubmit ? 'pointer' : 'default',
          backgroundColor: canSubmit ? st.bg : '#EDEDEA',
          color: canSubmit ? st.accent : '#C0A898',
          transition: 'all 0.15s',
        }}
        className="active:scale-95"
      >
        {submitLabel}
      </button>
    </div>
  );
}
