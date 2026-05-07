import { useState } from 'react';
import type { UseRecipesReturn } from '../hooks/useRecipes';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { UseStockReturn } from '../hooks/useStock';
import type { RecipeMatch, MissingIngredient, PortionFeedback, TasteFeedback } from '../types';
import { substitutions } from '../data/substitutions';

interface Props {
  recipes: UseRecipesReturn;
  shopping: UseShoppingListReturn;
  stock: UseStockReturn;
}

type RecipeTab = 'can_cook' | 'one_more' | 'two_more' | 'savings';

const portionFeedbackOptions: { value: PortionFeedback; label: string }[] = [
  { value: 'much_less',     label: 'かなり少なかった' },
  { value: 'slightly_less', label: '少し少なかった' },
  { value: 'just_right',    label: 'ちょうどよかった' },
  { value: 'slightly_more', label: '少し多かった' },
  { value: 'much_more',     label: 'たくさん余った' },
];

const tasteFeedbackOptions: { value: TasteFeedback; label: string }[] = [
  { value: 'slightly_bland', label: '少し薄かった' },
  { value: 'just_right',     label: 'ちょうどよかった' },
  { value: 'slightly_salty', label: '少し濃かった' },
  { value: 'sweeter',        label: 'もう少し甘め' },
  { value: 'too_sweet',      label: '甘すぎた' },
];

function RecipeCard({ match, onCook, onAddMissingToShopping }: {
  match: RecipeMatch;
  onCook: () => void;
  onAddMissingToShopping: (primaryId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { recipe, status, missing, usesLowStock } = match;

  const missingCount = missing.length;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <button
        style={{ width: '100%', padding: '16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '32px', lineHeight: 1 }}>{recipe.emoji}</span>
          <div style={{ flex: 1 }}>
            {/* タイトル行 */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, color: '#2F2F3A', fontSize: '16px' }}>{recipe.name}</span>
              {recipe.isSavingsMenu && (
                <span style={{ fontSize: '11px', backgroundColor: '#FEF9C3', color: '#92400E', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>💰 節約</span>
              )}
              {usesLowStock && (
                <span style={{ fontSize: '11px', backgroundColor: '#FFE3D5', color: '#B85A28', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>在庫消費</span>
              )}
            </div>

            {/* メタ情報 */}
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#A09890', marginBottom: '6px' }}>
              <span>⏱ {recipe.timeMinutes}分</span>
              <span>👨‍🍳 {recipe.difficulty}</span>
            </div>

            {/* ステータス表示 */}
            {status === 'can_cook' && (
              <p style={{ fontSize: '13px', color: '#1A8A56', fontWeight: 600 }}>✅ 材料がそろっています</p>
            )}
            {status === 'one_more' && missingCount > 0 && (
              <div>
                <p style={{ fontSize: '12px', color: '#C87430', fontWeight: 600, marginBottom: '4px' }}>
                  あと1品で作れます：
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {missing.map((m: MissingIngredient) => {
                    const hasSub = substitutions.some(s => m.allIds.includes(s.originalId));
                    return (
                      <span key={m.primaryId} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#FFE8C4', color: '#B86820', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
                          {m.emoji} {m.label}
                        </span>
                        {hasSub && (
                          <span style={{ fontSize: '11px', color: '#A09890' }}>（代用可）</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {status === 'two_more' && missingCount > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {missing.map((m: MissingIngredient) => (
                  <span key={m.primaryId} style={{ fontSize: '12px', backgroundColor: '#F0E8E4', color: '#8C7068', padding: '3px 10px', borderRadius: '20px' }}>
                    {m.emoji} {m.label} が必要
                  </span>
                ))}
              </div>
            )}
          </div>
          <span style={{ color: '#C0A898', fontSize: '13px', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #F0E8E4' }}>
          <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>目安の量</p>
              <p style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px' }}>
                {recipe.portionNote}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>材料</p>
              <pre style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                {recipe.ingredientsSimple}
              </pre>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>調味料</p>
              <pre style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                {recipe.seasoningSimple}
              </pre>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>コツ</p>
              <p style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFFBF0', borderRadius: '12px', padding: '10px 14px' }}>
                {recipe.tips}
              </p>
            </div>

            {/* 不足食材を買い物リストへ */}
            {missing.length > 0 && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '6px' }}>
                  不足食材を買い物リストへ追加
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {missing.map((m: MissingIngredient) => (
                    <button
                      key={m.primaryId}
                      onClick={() => onAddMissingToShopping(m.primaryId)}
                      style={{
                        fontSize: '13px',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        backgroundColor: '#FFE3D5',
                        color: '#B85A28',
                        border: '1.5px solid #F4C4A8',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                      className="active:scale-95"
                    >
                      🛒 {m.emoji} {m.label}を追加
                    </button>
                  ))}
                </div>
              </div>
            )}

            {status === 'can_cook' && (
              <button
                onClick={onCook}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  backgroundColor: '#F48A7A',
                  color: '#fff',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="active:scale-95 transition-transform"
              >
                🍳 作った！在庫を減らす
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipesPage({ recipes, shopping, stock }: Props) {
  const [activeTab, setActiveTab] = useState<RecipeTab>('can_cook');
  const [feedbackMode, setFeedbackMode] = useState<string | null>(null);
  const [portionFeedback, setPortionFeedback] = useState<PortionFeedback>('just_right');
  const [tasteFeedback, setTasteFeedback] = useState<TasteFeedback>('just_right');

  const handleCook = (match: RecipeMatch) => {
    // requiredItems の在庫を減らす
    match.recipe.requiredItemIds.forEach(masterItemId => {
      stock.decrementByMasterItemId(masterItemId, 1);
    });
    // requiredGroups の在庫を減らす（グループ内で在庫がある最初のものを1減）
    (match.recipe.requiredGroups ?? []).forEach(group => {
      const available = group.itemIds.find(id =>
        stock.stock.some(s => s.masterItemId === id && s.stockStatus !== 'empty')
      );
      if (available) stock.decrementByMasterItemId(available, 1);
    });
    setFeedbackMode(match.recipe.id);
  };

  const handleSubmitFeedback = (recipeId: string) => {
    recipes.addFeedback(recipeId, portionFeedback, tasteFeedback);
    setFeedbackMode(null);
    setPortionFeedback('just_right');
    setTasteFeedback('just_right');
  };

  const handleAddMissingToShopping = (primaryId: string) => {
    shopping.addByMasterItemId(primaryId);
  };

  const tabs: { id: RecipeTab; label: string; emoji: string; count: number }[] = [
    { id: 'can_cook', label: '今作れる',    emoji: '✅', count: recipes.canCook.length },
    { id: 'one_more', label: 'あと1品',     emoji: '🛒', count: recipes.oneMissing.length },
    { id: 'two_more', label: 'あと2品',     emoji: '📋', count: recipes.twoMissing.length },
    { id: 'savings',  label: '節約メニュー', emoji: '💰', count: recipes.savingsMenu.length },
  ];

  const displayMatches =
    activeTab === 'can_cook' ? recipes.canCook :
    activeTab === 'one_more' ? recipes.oneMissing :
    activeTab === 'two_more' ? recipes.twoMissing :
    recipes.savingsMenu;

  return (
    <div style={{ padding: '16px 16px 8px' }}>
      <div style={{ paddingTop: '8px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#2F2F3A', margin: 0 }}>🍳 うちレシピ</h1>
        <p style={{ fontSize: '13px', color: '#A09890', margin: '4px 0 0' }}>在庫から作れるメニューを提案</p>
      </div>

      {/* タブ */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? '#F48A7A' : '#F0E8E4',
                color: isActive ? '#fff' : '#8C7068',
              }}
              className="active:scale-95"
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#E0D4CE',
                color: isActive ? '#fff' : '#8C7068',
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* フィードバックモーダル */}
      {feedbackMode && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}
          onClick={() => setFeedbackMode(null)}
        >
          <div
            style={{ backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '24px', width: '100%', maxWidth: '430px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontWeight: 700, color: '#2F2F3A', fontSize: '18px', margin: 0 }}>料理しました！フィードバック</h3>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#2F2F3A', marginBottom: '8px' }}>量はどうでしたか？</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {portionFeedbackOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPortionFeedback(opt.value)}
                    style={{
                      fontSize: '13px',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid',
                      fontWeight: 500,
                      cursor: 'pointer',
                      backgroundColor: portionFeedback === opt.value ? '#F48A7A' : '#fff',
                      borderColor:     portionFeedback === opt.value ? '#F48A7A' : '#EDD5C8',
                      color:           portionFeedback === opt.value ? '#fff' : '#5A4A44',
                    }}
                    className="active:scale-95"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#2F2F3A', marginBottom: '8px' }}>味はどうでしたか？</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tasteFeedbackOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTasteFeedback(opt.value)}
                    style={{
                      fontSize: '13px',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid',
                      fontWeight: 500,
                      cursor: 'pointer',
                      backgroundColor: tasteFeedback === opt.value ? '#A8CFF0' : '#fff',
                      borderColor:     tasteFeedback === opt.value ? '#A8CFF0' : '#EDD5C8',
                      color:           tasteFeedback === opt.value ? '#1A507A' : '#5A4A44',
                    }}
                    className="active:scale-95"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              <button
                onClick={() => handleSubmitFeedback(feedbackMode)}
                style={{ flex: 1, minHeight: '48px', backgroundColor: '#F48A7A', color: '#fff', borderRadius: '14px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
                className="active:scale-95"
              >
                送信する
              </button>
              <button
                onClick={() => setFeedbackMode(null)}
                style={{ flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                className="active:scale-95"
              >
                スキップ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* レシピ一覧 */}
      {displayMatches.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', marginBottom: '8px' }}>🤔</p>
          <p style={{ color: '#A09890', fontSize: '14px' }}>
            {activeTab === 'can_cook' && '今すぐ作れるレシピがありません'}
            {activeTab === 'one_more' && 'あと1品で作れるレシピがありません'}
            {activeTab === 'two_more' && 'あと2品で作れるレシピがありません'}
            {activeTab === 'savings'  && '節約メニューがありません'}
          </p>
          {activeTab === 'can_cook' && (
            <p style={{ fontSize: '12px', color: '#C0A898', marginTop: '4px' }}>在庫を増やすと提案が増えます</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayMatches.map(match => (
            <RecipeCard
              key={match.recipe.id}
              match={match}
              onCook={() => handleCook(match)}
              onAddMissingToShopping={handleAddMissingToShopping}
            />
          ))}
        </div>
      )}
    </div>
  );
}
