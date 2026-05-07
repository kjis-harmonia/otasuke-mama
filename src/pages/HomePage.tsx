import type { TabName } from '../App';
import type { UseStockReturn } from '../hooks/useStock';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { UseBudgetReturn } from '../hooks/useBudget';
import type { UseRecipesReturn } from '../hooks/useRecipes';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

interface Props {
  stock: UseStockReturn;
  shopping: UseShoppingListReturn;
  budget: UseBudgetReturn;
  recipes: UseRecipesReturn;
  onTabChange: (tab: TabName) => void;
}

export default function HomePage({ stock, shopping, budget, recipes, onTabChange }: Props) {
  const lowStock = stock.stock.filter(s => s.stockStatus === 'low' || s.stockStatus === 'empty');
  const unchecked = shopping.uncheckedItems;
  const canCookCount = recipes.canCook.length;
  const todayMenus = recipes.canCook.slice(0, 3);

  return (
    <div className="p-4 space-y-4">
      {/* ヘッダー */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">お助けママ 👩‍👧‍👦</h1>
          <p className="text-sm text-gray-400 mt-0.5">2026年5月7日（木）</p>
        </div>
      </div>

      {/* 今週の食費カード（グラデーション） */}
      <div className="rounded-2xl p-5 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #FFB38A 0%, #F97316 100%)' }}>
        <p className="text-sm font-medium opacity-90 mb-1">今週の食費</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-4xl font-bold">¥{budget.remaining.toLocaleString()}</span>
            <span className="text-sm opacity-80 ml-2">残り</span>
          </div>
          <div className="text-right text-sm opacity-90 leading-relaxed">
            <div>予算 ¥{budget.weeklyBudget.amount.toLocaleString()}</div>
            <div>使用 ¥{budget.weekTotal.toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/30">
          {budget.daysLeft > 0 ? (
            <p className="text-sm">
              あと{budget.daysLeft}日・1日あたり <strong className="text-base">¥{budget.dailyBudget.toLocaleString()}</strong> 使えます
            </p>
          ) : (
            <p className="text-sm">今週の集計が終わりました</p>
          )}
        </div>
      </div>

      {/* クイック情報 */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => onTabChange('shopping')} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl">🛒</span>
          <span className="text-xl font-bold text-gray-800 mt-1">{unchecked.length}</span>
          <span className="text-xs text-gray-500 text-center mt-0.5">買い物リスト</span>
        </button>
        <button onClick={() => onTabChange('inventory')} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl">⚠️</span>
          <span className="text-xl font-bold text-orange-500 mt-1">{lowStock.length}</span>
          <span className="text-xs text-gray-500 text-center mt-0.5">在庫注意</span>
        </button>
        <button onClick={() => onTabChange('recipes')} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl">🍳</span>
          <span className="text-xl font-bold text-green-500 mt-1">{canCookCount}</span>
          <span className="text-xs text-gray-500 text-center mt-0.5">作れるメニュー</span>
        </button>
      </div>

      {/* 冷凍・作り置き */}
      {stock.frozenItems.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800">❄️ 冷凍・作り置き</h2>
            <button onClick={() => onTabChange('inventory')} className="text-xs text-orange-400 font-medium">もっと見る →</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {stock.frozenItems.map(item => (
              <div key={item.id} className="flex items-center gap-1 bg-blue-50 rounded-xl px-3 py-1.5">
                <span>{item.emoji}</span>
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-xs text-blue-600 font-medium">{item.quantity}{item.unit}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 今日作れそうなメニュー */}
      {todayMenus.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">🍽️ 今日作れそう</h2>
            <button onClick={() => onTabChange('recipes')} className="text-xs text-orange-400 font-medium">もっと見る →</button>
          </div>
          <div className="space-y-2">
            {todayMenus.map(match => (
              <div key={match.recipe.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ backgroundColor: '#FFF8F0' }}>
                <span className="text-2xl">{match.recipe.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{match.recipe.name}</p>
                  <p className="text-xs text-gray-400">{match.recipe.timeMinutes}分・{match.recipe.difficulty}</p>
                </div>
                {match.usesLowStock && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">在庫消費</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* アクションボタン */}
      <div className="space-y-3">
        <PrimaryButton size="lg" className="w-full" onClick={() => onTabChange('shopping')}>
          🛒 買い物リストを見る（{unchecked.length}件）
        </PrimaryButton>
        <PrimaryButton size="lg" variant="blue" className="w-full" onClick={() => onTabChange('shopping')}>
          📸 写真タップで追加する
        </PrimaryButton>
      </div>

      {/* ウィジェット風プレビュー */}
      <div className="rounded-3xl p-4 shadow-md" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.9)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-700">🛒 お買い物リスト</span>
          <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">ウィジェット</span>
        </div>
        {unchecked.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-2">買い物リストは空です 🎉</p>
        ) : (
          <>
            {unchecked.slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center gap-2 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item.emoji} {item.name}</span>
              </div>
            ))}
            {unchecked.length > 4 && (
              <p className="text-xs text-gray-400 mt-2 text-right">他 {unchecked.length - 4}件</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
