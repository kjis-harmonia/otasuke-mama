import { useState } from 'react';
import { useShoppingSets } from '../hooks/useShoppingSets';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { ShoppingSetItem } from '../types';
import { quickAddCategories } from '../data/quickAddCategories';

const ALL_QUICK_ITEMS = quickAddCategories.flatMap(cat => cat.items);

interface Props {
  shopping: UseShoppingListReturn;
}

export default function ShoppingSetsPanel({ shopping }: Props) {
  const { sets, canCreate, createSet, deleteSet, FREE_LIMIT } = useShoppingSets();
  const [showCreate, setShowCreate] = useState(false);
  const [setName, setSetName] = useState('');
  const [setEmoji, setSetEmoji] = useState('🛍️');
  const [selectedItems, setSelectedItems] = useState<ShoppingSetItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleItem = (item: ShoppingSetItem) => {
    setSelectedItems(prev => {
      const exists = prev.some(i => i.name === item.name);
      return exists ? prev.filter(i => i.name !== item.name) : [...prev, item];
    });
  };

  const handleCreate = () => {
    if (!setName.trim() || selectedItems.length === 0) return;
    const name = setName.trim();
    createSet(name, setEmoji, selectedItems);
    setShowCreate(false);
    setSetName('');
    setSetEmoji('🛍️');
    setSelectedItems([]);
    setSearchQuery('');
    showToast(`「${name}」を作成しました`);
  };

  const handleAddAll = (set: ReturnType<typeof useShoppingSets>['sets'][0]) => {
    let added = 0;
    set.items.forEach(item => {
      let ok = false;
      if (item.masterItemId) {
        ok = shopping.addByMasterItemId(item.masterItemId);
      } else {
        ok = shopping.addByName(item.name, item.emoji, item.category);
      }
      if (ok) added++;
    });
    showToast(`${set.name}の${added}品をリストに追加しました`);
  };

  const filteredItems = searchQuery
    ? ALL_QUICK_ITEMS.filter(item => item.name.includes(searchQuery))
    : ALL_QUICK_ITEMS.slice(0, 30);

  return (
    <div style={{ marginBottom: '20px' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1A8A56', color: '#fff', padding: '10px 20px',
          borderRadius: '24px', fontSize: '13px', fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: 100, whiteSpace: 'nowrap',
        }}>
          ✓ {toast}
        </div>
      )}

      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#2F2F3A', margin: 0 }}>🛍️ よく買うものセット</p>
          <p style={{ fontSize: '11px', color: '#A09890', margin: '2px 0 0' }}>ワンタップでまとめてリストに追加</p>
        </div>
        {canCreate ? (
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              fontSize: '12px', fontWeight: 700, padding: '7px 12px',
              borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: showCreate ? '#F0E8E4' : '#F48A7A',
              color: showCreate ? '#8C7068' : '#fff',
            }}
            className="active:scale-95"
          >
            {showCreate ? '閉じる' : '+ セット作成'}
          </button>
        ) : (
          <span style={{ fontSize: '11px', color: '#A09890' }}>無料版 {FREE_LIMIT}セットまで</span>
        )}
      </div>

      {/* 既存セット */}
      {sets.length === 0 && !showCreate && (
        <div style={{
          backgroundColor: '#FFFAF7', borderRadius: '12px', padding: '18px',
          textAlign: 'center', border: '1.5px dashed #EDD5C8',
        }}>
          <p style={{ fontSize: '14px', color: '#B0A098', margin: 0 }}>セットがまだありません</p>
          <p style={{ fontSize: '12px', color: '#C0B0A8', margin: '4px 0 0' }}>よく一緒に買うものをセットにしよう</p>
        </div>
      )}

      {sets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: showCreate ? '12px' : '0' }}>
          {sets.map(set => (
            <div key={set.id} style={{
              backgroundColor: '#fff', borderRadius: '14px', padding: '12px 14px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{set.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#2F2F3A', margin: 0 }}>{set.name}</p>
                <p style={{ fontSize: '11px', color: '#A09890', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {set.items.map(i => `${i.emoji}${i.name}`).join('・')}
                </p>
              </div>
              <button
                onClick={() => handleAddAll(set)}
                style={{
                  flexShrink: 0, fontSize: '12px', fontWeight: 700,
                  backgroundColor: '#FFE3D5', color: '#B85A28',
                  border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer',
                }}
                className="active:scale-95"
              >
                全部追加
              </button>
              <button
                onClick={() => { if (window.confirm(`「${set.name}」を削除しますか？`)) deleteSet(set.id); }}
                style={{ flexShrink: 0, fontSize: '16px', color: '#D0B8B0', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* セット作成フォーム */}
      {showCreate && (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#2F2F3A', marginBottom: '12px' }}>新しいセットを作成</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              style={{ flex: 1, border: '1.5px solid #EDD5C8', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', backgroundColor: '#FFFAF7', outline: 'none', color: '#2F2F3A' }}
              placeholder="セット名（例：週末の買い出し）"
              value={setName}
              onChange={e => setSetName(e.target.value)}
            />
            <input
              style={{ width: '52px', flex: 'none', border: '1.5px solid #EDD5C8', borderRadius: '12px', padding: '10px 6px', fontSize: '20px', backgroundColor: '#FFFAF7', outline: 'none', textAlign: 'center' }}
              value={setEmoji}
              onChange={e => setSetEmoji(e.target.value)}
            />
          </div>
          <input
            style={{ width: '100%', border: '1.5px solid #EDD5C8', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', backgroundColor: '#FFFAF7', outline: 'none', color: '#2F2F3A', marginBottom: '10px', boxSizing: 'border-box' }}
            placeholder="商品を検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '150px', overflowY: 'auto', marginBottom: '12px', paddingRight: '2px' }}>
            {filteredItems.map(item => {
              const selected = selectedItems.some(i => i.name === item.name);
              return (
                <button
                  key={item.masterItemId}
                  onClick={() => toggleItem({ masterItemId: item.masterItemId, name: item.name, emoji: item.emoji, category: 'food' })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '6px 10px', borderRadius: '20px',
                    border: selected ? '2px solid #F48A7A' : '1.5px solid #EDD5C8',
                    backgroundColor: selected ? '#FFF0EC' : '#FFFAF7',
                    cursor: 'pointer', fontSize: '13px',
                    fontWeight: selected ? 700 : 500,
                    color: selected ? '#B85A28' : '#5A4A44',
                  }}
                  className="active:scale-95"
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                  {selected && <span style={{ color: '#F48A7A' }}>✓</span>}
                </button>
              );
            })}
          </div>
          {selectedItems.length > 0 && (
            <p style={{ fontSize: '12px', color: '#A09890', marginBottom: '10px' }}>
              選択中: {selectedItems.map(i => `${i.emoji}${i.name}`).join('・')}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCreate}
              disabled={!setName.trim() || selectedItems.length === 0}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                backgroundColor: setName.trim() && selectedItems.length > 0 ? '#F48A7A' : '#F0E8E4',
                color: setName.trim() && selectedItems.length > 0 ? '#fff' : '#B0A098',
                fontSize: '14px', fontWeight: 700,
                cursor: setName.trim() && selectedItems.length > 0 ? 'pointer' : 'default',
              }}
            >
              作成する
            </button>
            <button
              onClick={() => { setShowCreate(false); setSetName(''); setSelectedItems([]); setSearchQuery(''); }}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#F0E8E4', color: '#8C7068', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              className="active:scale-95"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
