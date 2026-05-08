import { useState, useEffect } from 'react';
import type { UseRecipesReturn } from '../hooks/useRecipes';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { UseStockReturn } from '../hooks/useStock';
import type { RecipeMatch, MissingIngredient, PortionFeedback, TasteFeedback } from '../types';
import { substitutions } from '../data/substitutions';
import { formatFractionalQuantity } from '../data/quantityOptions';
import CustomRecipeForm from '../components/CustomRecipeForm';
import { getExpiryInfo, isAlertExpiry } from '../utils/expiryUtils';
import MiniGuide from '../components/MiniGuide';
import { isTabGuideSeen, markTabGuideSeen } from '../hooks/useGuide';

interface Props {
  recipes: UseRecipesReturn;
  shopping: UseShoppingListReturn;
  stock: UseStockReturn;
  expiryTabTrigger?: number;
}

type RecipeTab = 'can_cook' | 'one_more' | 'two_more' | 'savings' | 'expiry' | 'my_recipes';

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

function RecipeCard({ match, onCook, onDelete, onAddMissingToShopping }: {
  match: RecipeMatch;
  onCook: () => void;
  onDelete?: () => void;
  onAddMissingToShopping: (primaryId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { recipe, status, missing, usesLowStock } = match;
  const isCustom = recipe.isCustomRecipe === true;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <button
        style={{ width: '100%', padding: '16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '32px', lineHeight: 1 }}>{recipe.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, color: '#2F2F3A', fontSize: '16px' }}>{recipe.name}</span>
              {isCustom && (
                <span style={{ fontSize: '11px', backgroundColor: '#EAF4FF', color: '#1A507A', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>🏠 うちレシピ</span>
              )}
              {recipe.isSavingsMenu && (
                <span style={{ fontSize: '11px', backgroundColor: '#FEF9C3', color: '#92400E', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>💰 節約</span>
              )}
              {usesLowStock && (
                <span style={{ fontSize: '11px', backgroundColor: '#FFE3D5', color: '#B85A28', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>在庫消費</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#A09890', marginBottom: '6px' }}>
              <span>⏱ {recipe.timeMinutes}分</span>
              <span>👨‍🍳 {recipe.difficulty}</span>
            </div>
            {status === 'can_cook' && (
              <p style={{ fontSize: '13px', color: '#1A8A56', fontWeight: 600 }}>✅ 材料がそろっています</p>
            )}
            {status === 'one_more' && missing.length > 0 && (
              <div>
                <p style={{ fontSize: '12px', color: '#C87430', fontWeight: 600, marginBottom: '4px' }}>あと1品で作れます：</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {missing.map((m: MissingIngredient) => {
                    const hasSub = substitutions.some(s => m.allIds.includes(s.originalId));
                    return (
                      <span key={m.primaryId} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#FFE8C4', color: '#B86820', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
                          {m.emoji} {m.label}
                        </span>
                        {hasSub && <span style={{ fontSize: '11px', color: '#A09890' }}>（代用可）</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {status === 'two_more' && missing.length > 0 && (
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

            {/* 家族メモ（うちレシピのみ） */}
            {isCustom && recipe.familyMemo && (
              <div style={{ backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px', border: '1.5px solid #FFE3D5' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#B85A28', marginBottom: '4px' }}>💬 家族メモ</p>
                <p style={{ fontSize: '14px', color: '#2F2F3A', margin: 0 }}>{recipe.familyMemo}</p>
              </div>
            )}

            {/* 材料 */}
            {isCustom && recipe.ingredients && recipe.ingredients.length > 0 ? (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '6px' }}>材料</p>
                <div style={{ backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2F2F3A' }}>
                      <span>
                        {ing.name}
                        {!ing.required && <span style={{ fontSize: '11px', color: '#A09890', marginLeft: '4px' }}>（あれば）</span>}
                      </span>
                      <span style={{ fontWeight: 600, color: '#5A4A44' }}>{ing.amountLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : !isCustom ? (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>材料</p>
                <pre style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                  {recipe.ingredientsSimple}
                </pre>
              </div>
            ) : null}

            {/* 調味料 */}
            {isCustom && recipe.seasonings && recipe.seasonings.length > 0 ? (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '6px' }}>調味料</p>
                <div style={{ backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {recipe.seasonings.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2F2F3A' }}>
                      <span>{s.name}</span>
                      <span style={{ fontWeight: 600, color: '#5A4A44' }}>{s.amountLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : !isCustom && recipe.seasoningSimple ? (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>調味料</p>
                <pre style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFF8F1', borderRadius: '12px', padding: '10px 14px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                  {recipe.seasoningSimple}
                </pre>
              </div>
            ) : null}

            {/* 作り方 / コツ */}
            {isCustom && recipe.stepsMemo ? (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>作り方メモ</p>
                <p style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFFBF0', borderRadius: '12px', padding: '10px 14px', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {recipe.stepsMemo}
                </p>
              </div>
            ) : !isCustom && recipe.tips ? (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '4px' }}>コツ</p>
                <p style={{ fontSize: '14px', color: '#2F2F3A', backgroundColor: '#FFFBF0', borderRadius: '12px', padding: '10px 14px', margin: 0 }}>
                  {recipe.tips}
                </p>
              </div>
            ) : null}

            {/* 不足食材を追加 */}
            {missing.length > 0 && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '6px' }}>不足食材を買い物リストへ追加</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {missing.map((m: MissingIngredient) => (
                    <button key={m.primaryId} onClick={() => onAddMissingToShopping(m.primaryId)}
                      style={{ fontSize: '13px', padding: '8px 14px', borderRadius: '12px', backgroundColor: '#FFE3D5', color: '#B85A28', border: '1.5px solid #F4C4A8', cursor: 'pointer', fontWeight: 600 }}
                      className="active:scale-95">
                      🛒 {m.emoji} {m.label}を追加
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 作ったボタン */}
            {status === 'can_cook' && (
              <button onClick={onCook}
                style={{ width: '100%', minHeight: '48px', backgroundColor: '#F48A7A', color: '#fff', borderRadius: '14px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
                className="active:scale-95 transition-transform">
                🍳 作った！在庫を減らす
              </button>
            )}

            {/* 削除ボタン（うちレシピのみ） */}
            {isCustom && onDelete && (
              <div>
                {!confirmDelete ? (
                  <button onClick={() => setConfirmDelete(true)}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px solid #F0E8E4', backgroundColor: '#fff', fontSize: '13px', color: '#A09890', cursor: 'pointer' }}>
                    🗑️ このレシピを削除
                  </button>
                ) : (
                  <div style={{ backgroundColor: '#FFF0EC', borderRadius: '12px', padding: '12px 14px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#B85A28', marginBottom: '10px' }}>本当に削除しますか？</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={onDelete}
                        style={{ flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: '#F48A7A', color: '#fff', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                        削除する
                      </button>
                      <button onClick={() => setConfirmDelete(false)}
                        style={{ flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: '#F0E8E4', color: '#5A4A44', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipesPage({ recipes, shopping, stock, expiryTabTrigger }: Props) {
  const [activeTab, setActiveTab] = useState<RecipeTab>('can_cook');
  const [showGuide, setShowGuide] = useState(() => !isTabGuideSeen('recipes'));
  const [feedbackMode, setFeedbackMode] = useState<string | null>(null);
  const [feedbackSummary, setFeedbackSummary] = useState<string>('');
  const [portionFeedback, setPortionFeedback] = useState<PortionFeedback>('just_right');
  const [tasteFeedback, setTasteFeedback] = useState<TasteFeedback>('just_right');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (expiryTabTrigger && expiryTabTrigger > 0) setActiveTab('expiry');
  }, [expiryTabTrigger]);

  const expiringIds = new Set(
    stock.stock
      .filter(item => isAlertExpiry(getExpiryInfo(item.expiryDate).status))
      .map(item => item.masterItemId)
  );

  const expiryMatches = [...recipes.canCook, ...recipes.oneMissing, ...recipes.twoMissing]
    .filter(m =>
      m.recipe.requiredItemIds.some(id => expiringIds.has(id)) ||
      (m.recipe.requiredGroups ?? []).some(g => g.itemIds.some(id => expiringIds.has(id)))
    )
    .filter((m, i, arr) => arr.findIndex(x => x.recipe.id === m.recipe.id) === i);

  const handleCook = (match: RecipeMatch) => {
    if (match.recipe.isCustomRecipe && match.recipe.ingredients) {
      // うちレシピ：fractionValue で分数減算
      const deducted: string[] = [];
      match.recipe.ingredients
        .filter(i => i.required && i.masterItemId && (i.fractionValue ?? 0) > 0)
        .forEach(i => {
          const fv = i.fractionValue!;
          const item = stock.stock.find(s => s.masterItemId === i.masterItemId);
          if (item) {
            stock.decrementByMasterItemId(i.masterItemId!, fv);
            const newQty = Math.max(0, item.quantity - fv);
            deducted.push(`${i.name} → ${formatFractionalQuantity(newQty, item.unit)}`);
          }
        });
      setFeedbackSummary(deducted.length > 0 ? deducted.join('、') : '');
    } else {
      // 定番レシピ：整数で減算
      match.recipe.requiredItemIds.forEach(id => stock.decrementByMasterItemId(id, 1));
      (match.recipe.requiredGroups ?? []).forEach(group => {
        const available = group.itemIds.find(id =>
          stock.stock.some(s => s.masterItemId === id && s.stockStatus !== 'empty')
        );
        if (available) stock.decrementByMasterItemId(available, 1);
      });
      setFeedbackSummary('');
    }
    setFeedbackMode(match.recipe.id);
  };

  const handleSubmitFeedback = (recipeId: string) => {
    recipes.addFeedback(recipeId, portionFeedback, tasteFeedback);
    setFeedbackMode(null);
    setFeedbackSummary('');
    setPortionFeedback('just_right');
    setTasteFeedback('just_right');
  };

  const tabs: { id: RecipeTab; label: string; emoji: string; count: number }[] = [
    { id: 'can_cook',    label: '今作れる',    emoji: '✅', count: recipes.canCook.length },
    { id: 'one_more',    label: 'あと1品',     emoji: '🛒', count: recipes.oneMissing.length },
    { id: 'two_more',    label: 'あと2品',     emoji: '📋', count: recipes.twoMissing.length },
    { id: 'savings',     label: '節約メニュー', emoji: '💰', count: recipes.savingsMenu.length },
    { id: 'expiry',      label: '期限近い',     emoji: '⏰', count: expiryMatches.length },
    { id: 'my_recipes',  label: 'わが家',       emoji: '🏠', count: recipes.customRecipes.length },
  ];

  const myRecipesMatches: RecipeMatch[] = recipes.customRecipes.map(recipe => {
    const found = [...recipes.canCook, ...recipes.oneMissing, ...recipes.twoMissing].find(m => m.recipe.id === recipe.id);
    return found ?? { recipe, status: 'can_cook', missing: [], usesLowStock: false, usesFridge: false };
  });

  const displayMatches =
    activeTab === 'can_cook'   ? recipes.canCook :
    activeTab === 'one_more'   ? recipes.oneMissing :
    activeTab === 'two_more'   ? recipes.twoMissing :
    activeTab === 'savings'    ? recipes.savingsMenu :
    activeTab === 'my_recipes' ? myRecipesMatches :
    expiryMatches;

  return (
    <div style={{ padding: '16px 16px 8px' }}>

      {/* うちのレシピ登録フォーム */}
      {showForm && (
        <CustomRecipeForm
          onSave={input => { recipes.addCustomRecipe(input); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* ヘッダー */}
      <div style={{ paddingTop: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#2F2F3A', margin: 0 }}>🍳 うちレシピ</h1>
          <p style={{ fontSize: '13px', color: '#A09890', margin: '4px 0 0' }}>在庫から作れるメニューを提案</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '10px 14px', borderRadius: '12px', border: 'none',
            backgroundColor: '#F48A7A', color: '#fff',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          }}
          className="active:scale-95 transition-transform"
        >
          ＋ うちのレシピ
        </button>
      </div>

      {/* 登録済みバッジ */}
      {recipes.customRecipes.length > 0 && (
        <div style={{ backgroundColor: '#EAF4FF', borderRadius: '10px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#1A507A', fontWeight: 600 }}>
          🏠 うちのレシピ {recipes.customRecipes.length}品 登録済み
        </div>
      )}

      {/* タブ */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
                padding: '8px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                backgroundColor: isActive ? '#F48A7A' : '#F0E8E4',
                color: isActive ? '#fff' : '#8C7068',
              }}
              className="active:scale-95">
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '1px 6px', borderRadius: '10px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#E0D4CE',
                color: isActive ? '#fff' : '#8C7068',
              }}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* フィードバックモーダル */}
      {feedbackMode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}
          onClick={() => setFeedbackMode(null)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '24px', width: '100%', maxWidth: '430px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, color: '#2F2F3A', fontSize: '18px', margin: 0 }}>料理しました！</h3>
            {feedbackSummary && (
              <div style={{ backgroundColor: '#EDFAF3', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1A7A46', margin: '0 0 4px' }}>✓ 在庫を更新しました</p>
                <p style={{ fontSize: '12px', color: '#2F6A40', margin: 0 }}>{feedbackSummary}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#2F2F3A', marginBottom: '8px' }}>量はどうでしたか？</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {portionFeedbackOptions.map(opt => (
                  <button key={opt.value} onClick={() => setPortionFeedback(opt.value)}
                    style={{ fontSize: '13px', padding: '8px 14px', borderRadius: '12px', border: '1.5px solid', fontWeight: 500, cursor: 'pointer',
                      backgroundColor: portionFeedback === opt.value ? '#F48A7A' : '#fff',
                      borderColor:     portionFeedback === opt.value ? '#F48A7A' : '#EDD5C8',
                      color:           portionFeedback === opt.value ? '#fff' : '#5A4A44' }}
                    className="active:scale-95">{opt.label}</button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#2F2F3A', marginBottom: '8px' }}>味はどうでしたか？</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tasteFeedbackOptions.map(opt => (
                  <button key={opt.value} onClick={() => setTasteFeedback(opt.value)}
                    style={{ fontSize: '13px', padding: '8px 14px', borderRadius: '12px', border: '1.5px solid', fontWeight: 500, cursor: 'pointer',
                      backgroundColor: tasteFeedback === opt.value ? '#A8CFF0' : '#fff',
                      borderColor:     tasteFeedback === opt.value ? '#A8CFF0' : '#EDD5C8',
                      color:           tasteFeedback === opt.value ? '#1A507A' : '#5A4A44' }}
                    className="active:scale-95">{opt.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              <button onClick={() => handleSubmitFeedback(feedbackMode)}
                style={{ flex: 1, minHeight: '48px', backgroundColor: '#F48A7A', color: '#fff', borderRadius: '14px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
                className="active:scale-95">送信する</button>
              <button onClick={() => setFeedbackMode(null)}
                style={{ flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4', color: '#8C7068', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                className="active:scale-95">スキップ</button>
            </div>
          </div>
        </div>
      )}

      {/* レシピ一覧 */}
      {displayMatches.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', textAlign: 'center' }}>
          <p style={{ fontSize: '28px', marginBottom: '8px' }}>🤔</p>
          <p style={{ color: '#A09890', fontSize: '14px' }}>
            {activeTab === 'can_cook'   && '今すぐ作れるレシピがありません'}
            {activeTab === 'one_more'   && 'あと1品で作れるレシピがありません'}
            {activeTab === 'two_more'   && 'あと2品で作れるレシピがありません'}
            {activeTab === 'savings'    && '節約メニューがありません'}
            {activeTab === 'expiry'     && '期限が近い食材を使ったレシピがありません'}
            {activeTab === 'my_recipes' && 'うちのレシピがまだありません'}
          </p>
          {activeTab === 'can_cook' && (
            <p style={{ fontSize: '12px', color: '#C0A898', marginTop: '4px' }}>在庫を増やすと提案が増えます</p>
          )}
          {activeTab === 'my_recipes' && (
            <p style={{ fontSize: '12px', color: '#C0A898', marginTop: '4px' }}>右上の「＋ うちのレシピ」から登録しましょう</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayMatches.map(match => (
            <RecipeCard
              key={match.recipe.id}
              match={match}
              onCook={() => handleCook(match)}
              onDelete={match.recipe.isCustomRecipe
                ? () => recipes.deleteCustomRecipe(match.recipe.id)
                : undefined}
              onAddMissingToShopping={id => shopping.addByMasterItemId(id)}
            />
          ))}
        </div>
      )}

      {showGuide && (
        <MiniGuide
          emoji="🍳"
          title="うちレシピタブへようこそ"
          desc="在庫データをもとに「今すぐ作れる」料理を自動で提案します。使い切りメニューも見られます。"
          tip="「作った！」をタップすると在庫が自動で減ります"
          onClose={() => { markTabGuideSeen('recipes'); setShowGuide(false); }}
        />
      )}
    </div>
  );
}
