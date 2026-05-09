import type { TabName } from '../App';
import type { UseStockReturn } from '../hooks/useStock';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { UseBudgetReturn } from '../hooks/useBudget';
import type { UseRecipesReturn } from '../hooks/useRecipes';
import { getExpiryInfo, isAlertExpiry } from '../utils/expiryUtils';

interface Props {
  stock: UseStockReturn;
  shopping: UseShoppingListReturn;
  budget: UseBudgetReturn;
  recipes: UseRecipesReturn;
  onTabChange: (tab: TabName) => void;
  onNavigateToExpiryRecipes: () => void;
}

interface TaskItem {
  id: string;
  emoji: string;
  text: string;
  ctaLabel: string;
  ctaColor: string;
  onCta: () => void;
}

export default function TodayTasksCard({ stock, shopping, budget, recipes, onTabChange, onNavigateToExpiryRecipes }: Props) {
  const tasks: TaskItem[] = [];
  const foodItems = stock.stock.filter(s => s.category === 'food');
  const lowStockItems = stock.stock.filter(s => s.stockStatus === 'low' || s.stockStatus === 'empty');
  const isStockTooSmall = stock.stock.length === 0 || foodItems.length <= 2;

  // Priority 1: expiry alerts
  const expiringItems = stock.stock
    .filter(item => item.category === 'food' && isAlertExpiry(getExpiryInfo(item.expiryDate).status))
    .sort((a, b) => getExpiryInfo(a.expiryDate).daysUntil - getExpiryInfo(b.expiryDate).daysUntil);

  if (expiringItems.length > 0) {
    const first = expiringItems[0];
    const exp = getExpiryInfo(first.expiryDate);
    tasks.push({
      id: 'expiry',
      emoji: first.emoji,
      text: `${first.name}が${exp.label}`,
      ctaLabel: '使い切りレシピ',
      ctaColor: '#D4503A',
      onCta: onNavigateToExpiryRecipes,
    });
  }

  // Priority 2: shopping list
  if (shopping.uncheckedItems.length > 0) {
    tasks.push({
      id: 'shopping',
      emoji: '🛒',
      text: '買い物リストに未完了の商品があります',
      ctaLabel: 'リストを見る',
      ctaColor: '#B85A28',
      onCta: () => onTabChange('shopping'),
    });
  }

  // Priority 3: empty or very small stock
  if (isStockTooSmall) {
    tasks.push({
      id: 'stock-empty',
      emoji: '📦',
      text: stock.stock.length === 0
        ? '在庫がまだありません。よく買うものから追加してみましょう'
        : '在庫が少なめです。よく使うものを追加しておきましょう',
      ctaLabel: '在庫を追加',
      ctaColor: '#1A7A46',
      onCta: () => onTabChange('inventory'),
    });
  }

  // Priority 4: no recipes currently cookable
  if (recipes.canCook.length === 0) {
    tasks.push({
      id: 'no-recipe',
      emoji: '🍳',
      text: '今作れるメニューはまだありません。あと1品で作れる料理を見てみましょう',
      ctaLabel: '献立を見る',
      ctaColor: '#1A507A',
      onCta: () => onTabChange('recipes'),
    });
  }

  // Priority 5: expenses not recorded
  if (budget.weekTotal === 0) {
    tasks.push({
      id: 'budget',
      emoji: '💰',
      text: '今週の支出を記録すると、残り予算が分かります',
      ctaLabel: '記録する',
      ctaColor: '#92500E',
      onCta: () => onTabChange('budget'),
    });
  }

  // Priority 6: weekly budget status
  if (budget.weekTotal > 0) {
    tasks.push({
      id: budget.remaining < 0 ? 'budget-over' : 'budget-status',
      emoji: budget.remaining < 0 ? '⚠️' : '💰',
      text: budget.remaining < 0
        ? `今週の予算を¥${Math.abs(budget.remaining).toLocaleString()}オーバーしています`
        : `今週はあと¥${budget.remaining.toLocaleString()}使えます`,
      ctaLabel: '家計を確認',
      ctaColor: budget.remaining < 0 ? '#B91C1C' : '#92500E',
      onCta: () => onTabChange('budget'),
    });
  }

  if (lowStockItems.length > 0 && tasks.length < 3) {
    tasks.push({
      id: 'lowstock',
      emoji: '📦',
      text: `${lowStockItems[0].name}など${lowStockItems.length}品の在庫が少なめ`,
      ctaLabel: '在庫を確認',
      ctaColor: '#1A7A46',
      onCta: () => onTabChange('inventory'),
    });
  }

  const displayTasks = tasks.slice(0, 3);
  if (displayTasks.length === 0) return null;

  return (
    <div>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', marginBottom: '8px', letterSpacing: '0.03em' }}>
        📋 今日やること
      </p>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        {displayTasks.map((task, i) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderTop: i > 0 ? '1px solid #F4EDE8' : 'none',
            }}
          >
            <span style={{ fontSize: '22px', flexShrink: 0 }}>{task.emoji}</span>
            <p style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: '#2F2F3A', margin: 0, lineHeight: 1.4 }}>
              {task.text}
            </p>
            <button
              onClick={task.onCta}
              style={{
                flexShrink: 0,
                fontSize: '11px',
                fontWeight: 700,
                color: task.ctaColor,
                backgroundColor: 'transparent',
                border: `1.5px solid ${task.ctaColor}`,
                borderRadius: '20px',
                padding: '5px 10px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              className="active:scale-95"
            >
              {task.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
