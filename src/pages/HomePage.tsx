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

// ──────────────── 次アクションカード ──────────────────────────

interface ActionCardData {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  ctaLabel: string;
  bgColor: string;
  ctaBg: string;
  ctaText: string;
  onCta: () => void;
}

function ActionCard({ card }: { card: ActionCardData }) {
  return (
    <div style={{
      backgroundColor: card.bgColor,
      borderRadius: '16px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    }}>
      {/* 絵文字バッジ */}
      <div style={{
        width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
        backgroundColor: card.ctaBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px',
      }}>
        {card.emoji}
      </div>

      {/* テキスト + CTA */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#2F2F3A', marginBottom: '3px', lineHeight: 1.3 }}>
          {card.title}
        </p>
        <p style={{ fontSize: '12px', color: '#7A6860', lineHeight: 1.55, marginBottom: '10px' }}>
          {card.desc}
        </p>
        <button
          onClick={card.onCta}
          style={{
            fontSize: '12px', fontWeight: 700,
            backgroundColor: card.ctaBg, color: card.ctaText,
            border: 'none', borderRadius: '10px',
            padding: '7px 14px', cursor: 'pointer',
          }}
        >
          {card.ctaLabel} →
        </button>
      </div>
    </div>
  );
}

function NextActionSection({
  cards,
}: { cards: ActionCardData[] }) {
  if (cards.length === 0) return null;

  return (
    <div>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '8px', letterSpacing: '0.03em' }}>
        ✨ 次にやること
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {cards.map(card => (
          <ActionCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

// ──────────────── メインコンポーネント ────────────────────────

export default function HomePage({ stock, shopping, budget, recipes, onTabChange }: Props) {
  const lowStock    = stock.stock.filter(s => s.stockStatus === 'low' || s.stockStatus === 'empty');
  const activeStock = stock.stock.filter(s => s.stockStatus !== 'empty');
  const unchecked   = shopping.uncheckedItems;
  const canCookCount = recipes.canCook.length;
  const todayMenus  = recipes.canCook.slice(0, 3);

  // ── 次アクションカードを条件ごとにビルド ──────────────────
  const actionCards: ActionCardData[] = [];

  // 在庫が少ない・未登録（5品未満を「少ない」と判断）
  if (activeStock.length < 5) {
    actionCards.push({
      id: 'stock',
      emoji: '📦',
      title: '在庫を登録してみましょう',
      desc: '食材を登録すると、今ある材料で作れるメニューを自動で提案します。',
      ctaLabel: '在庫を追加する',
      bgColor: '#EDFAF3',
      ctaBg: '#C8EED9',
      ctaText: '#1A7A46',
      onCta: () => onTabChange('inventory'),
    });
  }

  // 買い物リストが空
  if (unchecked.length === 0) {
    actionCards.push({
      id: 'shopping',
      emoji: '🛒',
      title: '買い物リストを作りましょう',
      desc: 'よく買うものをタップするだけで、かんたんに買い物リストが作れます。',
      ctaLabel: 'クイック追加で追加する',
      bgColor: '#FFF3EE',
      ctaBg: '#FFE3D5',
      ctaText: '#B85A28',
      onCta: () => onTabChange('shopping'),
    });
  }

  // 今週の家計が未入力
  if (budget.weekTotal === 0) {
    actionCards.push({
      id: 'budget',
      emoji: '💰',
      title: '今週の食費を記録しよう',
      desc: '使った金額を入力すると、残り予算が毎日ひと目でわかります。',
      ctaLabel: '支出を入力する',
      bgColor: '#FFFCEB',
      ctaBg: '#FEF3C7',
      ctaText: '#92500E',
      onCta: () => onTabChange('budget'),
    });
  }

  // 作れるレシピがある（おすすめ）
  if (canCookCount > 0) {
    actionCards.push({
      id: 'recipes',
      emoji: '🍳',
      title: '今日の献立、決まってますか？',
      desc: `今ある材料で${canCookCount}品作れます。メニューを選ぶだけで献立が完成！`,
      ctaLabel: 'レシピを見る',
      bgColor: '#EAF4FF',
      ctaBg: '#C8E4F8',
      ctaText: '#1A507A',
      onCta: () => onTabChange('recipes'),
    });
  }

  // 表示は最大2枚
  const displayCards = actionCards.slice(0, 2);

  return (
    <div className="p-4 space-y-4">
      {/* ヘッダー */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">お助けママ 👩‍👧‍👦</h1>
          <p className="text-sm text-gray-400 mt-0.5">2026年5月7日（木）</p>
        </div>
      </div>

      {/* 今週の食費カード */}
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

      {/* クイック情報（3列） */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => onTabChange('shopping')} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl">🛒</span>
          <span className="text-xl font-bold text-gray-800 mt-1">{unchecked.length}</span>
          <span className="text-xs text-gray-500 text-center mt-0.5">買い物リスト</span>
        </button>
        <button onClick={() => onTabChange('inventory')} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl">⚠️</span>
          <span className="text-xl font-bold mt-1" style={{ color: lowStock.length > 0 ? '#D4603A' : '#A0A0A0' }}>
            {lowStock.length}
          </span>
          <span className="text-xs text-gray-500 text-center mt-0.5">在庫注意</span>
        </button>
        <button onClick={() => onTabChange('recipes')} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl">🍳</span>
          <span className="text-xl font-bold mt-1" style={{ color: canCookCount > 0 ? '#1A8A56' : '#A0A0A0' }}>
            {canCookCount}
          </span>
          <span className="text-xs text-gray-500 text-center mt-0.5">作れるメニュー</span>
        </button>
      </div>

      {/* ✨ 次アクションカード */}
      <NextActionSection cards={displayCards} />

      {/* 冷凍・作り置き */}
      {stock.frozenItems.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800">❄️ 冷凍・作り置き</h2>
            <button onClick={() => onTabChange('inventory')} className="text-xs font-medium" style={{ color: '#F48A7A' }}>もっと見る →</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {stock.frozenItems.map(item => (
              <div key={item.id} className="flex items-center gap-1 rounded-xl px-3 py-1.5" style={{ backgroundColor: '#EAF4FF' }}>
                <span>{item.emoji}</span>
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-xs font-medium" style={{ color: '#1A507A' }}>{item.quantity}{item.unit}</span>
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
            <button onClick={() => onTabChange('recipes')} className="text-xs font-medium" style={{ color: '#F48A7A' }}>もっと見る →</button>
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
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFE3D5', color: '#B85A28' }}>在庫消費</span>
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
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#F48A7A' }} />
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
