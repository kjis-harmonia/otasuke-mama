import { useState } from 'react';
import type { UseRecipesReturn } from '../hooks/useRecipes';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { UseStockReturn } from '../hooks/useStock';
import type { RecipeMatch, PortionFeedback, TasteFeedback } from '../types';
import { substitutions, getSubstitutionNote } from '../data/substitutions';

interface Props {
  recipes: UseRecipesReturn;
  shopping: UseShoppingListReturn;
  stock: UseStockReturn;
}

type RecipeTab = 'can_cook' | 'one_more' | 'two_more' | 'savings';

const portionFeedbackOptions: { value: PortionFeedback; label: string }[] = [
  { value: 'much_less',    label: 'かなり少なかった' },
  { value: 'slightly_less', label: '少し少なかった' },
  { value: 'just_right',   label: 'ちょうどよかった' },
  { value: 'slightly_more', label: '少し多かった' },
  { value: 'much_more',    label: 'たくさん余った' },
];

const tasteFeedbackOptions: { value: TasteFeedback; label: string }[] = [
  { value: 'slightly_bland',  label: '少し薄かった' },
  { value: 'just_right',      label: 'ちょうどよかった' },
  { value: 'slightly_salty',  label: '少し濃かった' },
  { value: 'sweeter',         label: 'もう少し甘め' },
  { value: 'too_sweet',       label: '甘すぎた' },
];

function RecipeCard({ match, onCook, onAddMissingToShopping }: {
  match: RecipeMatch;
  onCook: () => void;
  onAddMissingToShopping: (masterItemId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { recipe, status, missingItems, usesLowStock } = match;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button className="w-full p-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{recipe.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-gray-800">{recipe.name}</p>
              {recipe.isSavingsMenu && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">💰 節約</span>
              )}
              {usesLowStock && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">在庫消費</span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>⏱ {recipe.timeMinutes}分</span>
              <span>👨‍🍳 {recipe.difficulty}</span>
              <span>🍽️ {recipe.category}</span>
            </div>

            {/* ステータス表示 */}
            {status === 'can_cook' && (
              <p className="text-xs text-green-600 mt-1 font-medium">✓ 材料がそろっています</p>
            )}
            {status === 'one_more' && missingItems.length > 0 && (
              <div className="mt-1.5">
                <p className="text-xs text-orange-500 font-medium mb-1">あと1品で作れます：</p>
                <div className="flex flex-wrap gap-1">
                  {missingItems.map(item => {
                    // 代用候補を探す
                    const subEntry = substitutions.find(s => s.originalId === item.id);
                    return (
                      <div key={item.id} className="flex items-center gap-1">
                        <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                          {item.emoji} {item.name}
                        </span>
                        {subEntry && (
                          <span className="text-xs text-gray-400">
                            または {subEntry.substituteIds.map(sid => {
                              const note = getSubstitutionNote(item.id, sid, substitutions);
                              return note ? `(${note})` : '';
                            }).join('')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {status === 'two_more' && missingItems.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {missingItems.map(item => (
                  <span key={item.id} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {item.emoji} {item.name} が必要
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
          <div className="pt-3">
            <p className="text-xs font-bold text-gray-500 mb-1">目安の量</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">{recipe.portionNote}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">材料</p>
            <pre className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2 whitespace-pre-wrap font-sans">{recipe.ingredientsSimple}</pre>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">調味料</p>
            <pre className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2 whitespace-pre-wrap font-sans">{recipe.seasoningSimple}</pre>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">コツ</p>
            <p className="text-sm text-gray-700 bg-yellow-50 rounded-xl px-3 py-2">{recipe.tips}</p>
          </div>

          {/* 不足食材を買い物リストへ追加 */}
          {missingItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">不足食材を買い物リストへ追加</p>
              <div className="flex flex-wrap gap-2">
                {missingItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onAddMissingToShopping(item.id)}
                    className="text-xs px-3 py-2 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 active:scale-95 font-medium"
                  >
                    🛒 {item.emoji} {item.name}を追加
                  </button>
                ))}
              </div>
            </div>
          )}

          {status === 'can_cook' && (
            <button
              onClick={onCook}
              className="w-full py-3 rounded-xl text-white font-bold active:scale-95 transition-transform"
              style={{ backgroundColor: '#F97316' }}
            >
              🍳 作った！在庫を減らす
            </button>
          )}
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
    // 在庫を減らす
    match.recipe.requiredItemIds.forEach(masterItemId => {
      stock.decrementByMasterItemId(masterItemId, 1);
    });
    setFeedbackMode(match.recipe.id);
  };

  const handleSubmitFeedback = (recipeId: string) => {
    recipes.addFeedback(recipeId, portionFeedback, tasteFeedback);
    setFeedbackMode(null);
    setPortionFeedback('just_right');
    setTasteFeedback('just_right');
  };

  const handleAddMissingToShopping = (masterItemId: string) => {
    shopping.addByMasterItemId(masterItemId);
  };

  const tabs: { id: RecipeTab; label: string; emoji: string; count: number }[] = [
    { id: 'can_cook',  label: '今作れる',    emoji: '✅', count: recipes.canCook.length },
    { id: 'one_more',  label: 'あと1品',     emoji: '🛒', count: recipes.oneMissing.length },
    { id: 'two_more',  label: 'あと2品',     emoji: '📋', count: recipes.twoMissing.length },
    { id: 'savings',   label: '節約メニュー', emoji: '💰', count: recipes.savingsMenu.length },
  ];

  const displayMatches =
    activeTab === 'can_cook' ? recipes.canCook :
    activeTab === 'one_more' ? recipes.oneMissing :
    activeTab === 'two_more' ? recipes.twoMissing :
    recipes.savingsMenu;

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-xl font-bold text-gray-800">🍳 うちレシピ</h1>
        <p className="text-sm text-gray-500 mt-0.5">在庫から作れるメニューを提案</p>
      </div>

      {/* タブ */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
            style={activeTab === tab.id ? { backgroundColor: '#F97316', color: '#fff' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
            <span
              className="text-xs rounded-full px-1.5 font-bold ml-1"
              style={activeTab === tab.id ? { backgroundColor: '#fff', color: '#F97316' } : { backgroundColor: '#E5E7EB', color: '#6B7280' }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* フィードバックモーダル */}
      {feedbackMode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end z-50"
          onClick={() => setFeedbackMode(null)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 w-full max-w-lg mx-auto space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-800 text-lg">料理しました！フィードバック</h3>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">量はどうでしたか？</p>
              <div className="flex flex-wrap gap-2">
                {portionFeedbackOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPortionFeedback(opt.value)}
                    className="text-xs px-3 py-2 rounded-xl border font-medium"
                    style={portionFeedback === opt.value
                      ? { backgroundColor: '#F97316', color: '#fff', borderColor: 'transparent' }
                      : { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151' }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">味はどうでしたか？</p>
              <div className="flex flex-wrap gap-2">
                {tasteFeedbackOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTasteFeedback(opt.value)}
                    className="text-xs px-3 py-2 rounded-xl border font-medium"
                    style={tasteFeedback === opt.value
                      ? { backgroundColor: '#60A5FA', color: '#fff', borderColor: 'transparent' }
                      : { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151' }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSubmitFeedback(feedbackMode)}
                className="flex-1 py-3 rounded-xl text-white font-bold"
                style={{ backgroundColor: '#F97316' }}
              >送信する</button>
              <button
                onClick={() => setFeedbackMode(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium"
              >スキップ</button>
            </div>
          </div>
        </div>
      )}

      {/* レシピ一覧 */}
      {displayMatches.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-2xl mb-2">🤔</p>
          <p className="text-gray-500 text-sm">
            {activeTab === 'can_cook' && '今すぐ作れるレシピがありません'}
            {activeTab === 'one_more' && 'あと1品で作れるレシピがありません'}
            {activeTab === 'two_more' && 'あと2品で作れるレシピがありません'}
            {activeTab === 'savings' && '節約メニューがありません'}
          </p>
          {activeTab === 'can_cook' && (
            <p className="text-xs text-gray-400 mt-1">在庫を増やすと提案が増えます</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
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
