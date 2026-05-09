import { useState } from 'react';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { UseStockReturn } from '../hooks/useStock';
import type { ShoppingItem, ItemCategory } from '../types';
import ItemQuickAddGrid from '../components/ItemQuickAddGrid';
import { useFamilySettings } from '../hooks/useFamilySettings';
import { quickAddCategories } from '../data/quickAddCategories';
import { useCustomItems } from '../hooks/useCustomItems';
import MiniGuide from '../components/MiniGuide';
import ShoppingSetsPanel from '../components/ShoppingSetsPanel';
import { isTabGuideSeen, markTabGuideSeen } from '../hooks/useGuide';
import ItemIcon from '../components/ItemIcon';

const ALL_QUICK_ITEMS = quickAddCategories.flatMap(cat => cat.items);

// food の値は ItemQuickAddGrid の FOOD_SUB_CATS と完全一致させること
const SUB_CATEGORIES: Record<ItemCategory, string[]> = {
  food:  ['主食・米', '卵・乳製品', '豆腐・大豆', '根菜・いも', '葉もの', '実野菜', 'きのこ', '肉', '魚・海鮮', '果物', '調味料', '冷凍'],
  daily: ['洗濯', '食器・キッチン', '紙類', 'お風呂・洗面', '掃除', '衛生用品', 'その他日用品'],
  baby:  ['おむつ', 'おしりふき', 'ミルク', 'おやつ', 'ベビー衛生', '保育園・学校用品', 'その他子ども用品'],
};

interface Props {
  shopping: UseShoppingListReturn;
  stock: UseStockReturn;
}

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

export default function ShoppingPage({ shopping, stock }: Props) {
  const [showManual, setShowManual] = useState(false);
  const [saveToMyItems, setSaveToMyItems] = useState(true);
  const [manual, setManual] = useState({
    name: '',
    emoji: '🛒',
    category: 'food' as ItemCategory,
    subCategory: SUB_CATEGORIES['food'][0],
  });
  const customItemsHook = useCustomItems();
  const [showGuide, setShowGuide] = useState(() => !isTabGuideSeen('shopping'));
  const [toast, setToast] = useState<string | null>(null);
  const { settings } = useFamilySettings();
  const pinnedItems = ALL_QUICK_ITEMS.filter(item =>
    (settings.frequentItems ?? []).includes(item.masterItemId)
  );

  const showToast = (name: string) => {
    setToast(name);
    setTimeout(() => setToast(null), 1800);
  };

  const handleAddToStock = (item: ShoppingItem) => {
    if (item.masterItemId) stock.addStockItem(item.masterItemId);
    shopping.remove(item.id);
  };

  const getItemIconProps = (item: ShoppingItem) => {
    const ci = customItemsHook.visibleItems.find(c => c.name === item.name);
    return { emoji: item.emoji, customIconData: ci?.customIconData, iconShape: ci?.iconShape };
  };

  const handleManualAdd = () => {
    if (!manual.name.trim()) return;
    const name = manual.name.trim();
    const added = shopping.addByName(name, manual.emoji, manual.category, manual.subCategory);
    if (added) {
      if (saveToMyItems) {
        customItemsHook.addCustomItem({
          name,
          emoji: manual.emoji,
          category: manual.category,
          subCategory: manual.subCategory,
        });
      }
      showToast(name);
      setManual({ name: '', emoji: '🛒', category: 'food', subCategory: SUB_CATEGORIES['food'][0] });
    }
  };

  return (
    <div style={{ padding: '16px 16px 8px' }}>

      {/* トースト通知 */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1A8A56',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '24px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}>
          ✓ {toast} をリストに追加しました
        </div>
      )}

      {/* ─── セクション1：タップで追加（主役） ─── */}
      <div style={{ marginBottom: '20px' }}>
        {/* セクションヘッダー */}
        <div style={{
          backgroundColor: '#F48A7A',
          borderRadius: '16px 16px 0 0',
          padding: '12px 16px 10px',
        }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: 0 }}>
            よく買うものをタップで追加
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', margin: '2px 0 0' }}>
            文字を打たずにポンポン追加できます
          </p>
        </div>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0 0 16px 16px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        }}>
          {pinnedItems.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '8px' }}>⭐ よく買うもの</p>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {pinnedItems.map(item => {
                  const inList = shopping.isAlreadyInList(item.masterItemId);
                  return (
                    <button
                      key={item.masterItemId}
                      onClick={() => {
                        const added = shopping.addByMasterItemId(item.masterItemId);
                        if (added) showToast(item.name);
                      }}
                      disabled={inList}
                      style={{
                        flexShrink: 0,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        padding: '10px 12px',
                        borderRadius: '14px',
                        border: inList ? '2px solid #A9DCC4' : '2px solid transparent',
                        backgroundColor: inList ? '#E8F8F0' : '#FFFAF7',
                        cursor: inList ? 'default' : 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        minWidth: '64px',
                      }}
                      className={inList ? '' : 'active:scale-95'}
                    >
                      <span style={{ fontSize: '26px', lineHeight: 1 }}>{item.emoji}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: inList ? '#1A8A56' : '#2F2F3A', textAlign: 'center', lineHeight: 1.2 }}>
                        {item.name}
                      </span>
                      {inList && <span style={{ fontSize: '10px', color: '#1A8A56', fontWeight: 700 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <ItemQuickAddGrid
            shopping={shopping}
            onAdded={showToast}
            customItems={customItemsHook.visibleItems}
            onHideCustom={customItemsHook.hideCustomItem}
          />
        </div>
      </div>

      {/* ─── セクション2：よく買うものセット ─── */}
      <ShoppingSetsPanel shopping={shopping} />

      {/* ─── セクション3：今日の買い物リスト ─── */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontWeight: 700, color: '#2F2F3A', fontSize: '15px', margin: 0 }}>
            📋 今日の買い物リスト
          </h2>
          <span style={{
            backgroundColor: shopping.uncheckedItems.length > 0 ? '#FFE3D5' : '#F0E8E4',
            color: shopping.uncheckedItems.length > 0 ? '#B85A28' : '#A09890',
            fontWeight: 700,
            fontSize: '13px',
            padding: '2px 10px',
            borderRadius: '20px',
          }}>
            {shopping.uncheckedItems.length}件
          </span>
        </div>

        {shopping.list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#B0A098', fontSize: '14px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
            <p style={{ margin: '0 0 12px' }}>上のグリッドからタップして追加してください</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ width: '100%', minHeight: '44px', borderRadius: '12px', border: 'none', backgroundColor: '#FFE3D5', color: '#B85A28', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              className="active:scale-95"
            >
              よく買うものから追加
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 未購入 */}
            {shopping.uncheckedItems.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#FFF8F1',
                  borderRadius: '12px',
                }}
              >
                <button
                  onClick={() => shopping.toggle(item.id)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2.5px solid #F48A7A',
                    backgroundColor: 'transparent',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                  className="active:scale-95"
                />
                <ItemIcon {...getItemIconProps(item)} size={20} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: '#2F2F3A' }}>{item.name}</span>
                <button
                  onClick={() => shopping.remove(item.id)}
                  style={{ color: '#D0B8B0', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* 購入済み */}
            {shopping.checkedItems.length > 0 && (
              <>
                <div style={{ padding: '8px 0 4px' }}>
                  <span style={{ fontSize: '12px', color: '#A09890', fontWeight: 600 }}>購入済み</span>
                </div>
                {shopping.checkedItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      backgroundColor: '#F4F0EE',
                      borderRadius: '12px',
                      opacity: 0.7,
                    }}
                  >
                    <button
                      onClick={() => shopping.toggle(item.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#A9DCC4',
                        border: 'none',
                        flexShrink: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0F5C3A',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                      className="active:scale-95"
                    >
                      ✓
                    </button>
                    <ItemIcon {...getItemIconProps(item)} size={20} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '14px', color: '#A09890', textDecoration: 'line-through' }}>{item.name}</span>
                    <button
                      onClick={() => handleAddToStock(item)}
                      style={{
                        fontSize: '12px',
                        backgroundColor: '#A8CFF0',
                        color: '#1A507A',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                      className="active:scale-95"
                    >
                      在庫へ
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => { if (window.confirm('購入済みをすべて削除しますか？')) shopping.clearChecked(); }}
                  style={{ width: '100%', padding: '8px', fontSize: '12px', color: '#A09890', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  購入済みを削除
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ─── セクション3：手入力（補助・折りたたみ） ─── */}
      <button
        onClick={() => setShowManual(!showManual)}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#F0E8E4',
          color: '#8C7068',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          marginBottom: showManual ? '8px' : '0',
        }}
        className="active:scale-95 transition-transform"
      >
        {showManual ? '▲ 閉じる' : '▼ 商品名を入力して追加'}
      </button>

      {showManual && (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="商品名を入力"
                value={manual.name}
                onChange={e => setManual(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') handleManualAdd(); }}
              />
              <input
                style={{ ...inputStyle, width: '52px', flex: 'none', textAlign: 'center', fontSize: '20px', padding: '10px 6px' }}
                value={manual.emoji}
                onChange={e => setManual(p => ({ ...p, emoji: e.target.value }))}
              />
            </div>
            {/* 大カテゴリ */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {([['food', '食品'], ['daily', '日用品'], ['baby', '子ども用品']] as [ItemCategory, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setManual(p => ({ ...p, category: val, subCategory: SUB_CATEGORIES[val][0] }))}
                  style={{
                    flex: 1, padding: '9px 4px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    backgroundColor: manual.category === val ? '#F48A7A' : '#F0E8E4',
                    color: manual.category === val ? '#fff' : '#8C7068',
                  }}
                  className="active:scale-95"
                >{label}</button>
              ))}
            </div>

            {/* 中カテゴリ */}
            <div>
              <p style={{ fontSize: '11px', color: '#A09890', fontWeight: 600, marginBottom: '6px' }}>中カテゴリ</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SUB_CATEGORIES[manual.category].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setManual(p => ({ ...p, subCategory: sub }))}
                    style={{
                      padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      backgroundColor: manual.subCategory === sub ? '#F48A7A' : '#F0E8E4',
                      color: manual.subCategory === sub ? '#fff' : '#8C7068',
                    }}
                    className="active:scale-95"
                  >{sub}</button>
                ))}
              </div>
            </div>

            {/* 次回から表示する トグル */}
            <button
              onClick={() => setSaveToMyItems(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', alignSelf: 'flex-start' }}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                border: `2px solid ${saveToMyItems ? '#F48A7A' : '#D0B8B0'}`,
                backgroundColor: saveToMyItems ? '#F48A7A' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {saveToMyItems && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: '13px', color: '#5A4A44', fontWeight: 500 }}>次回からこのカテゴリに表示する</span>
            </button>

            <button
              onClick={handleManualAdd}
              style={{ minHeight: '48px', backgroundColor: '#F48A7A', color: '#fff', borderRadius: '14px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
              className="active:scale-95 transition-transform"
            >
              追加する
            </button>
          </div>
        </div>
      )}

      {showGuide && (
        <MiniGuide
          emoji="🛒"
          title="買い物タブへようこそ"
          desc="よく買うものをタップするだけでリストに追加できます。お店でチェックしながら使いましょう。"
          tip="「わが家の商品」に登録すると毎回ラクに追加できます"
          onClose={() => { markTabGuideSeen('shopping'); setShowGuide(false); }}
        />
      )}
    </div>
  );
}
