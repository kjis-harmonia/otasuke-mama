import { useState } from 'react';
import type { UseBudgetReturn } from '../hooks/useBudget';
import type { BudgetEntry, ExpenseCategory } from '../types';
import Card from '../components/Card';

interface Props {
  budget: UseBudgetReturn;
}

const categories: ExpenseCategory[] = ['食費', '日用品', '子ども用品', '外食', 'その他'];

const categoryColors: Record<ExpenseCategory, { bg: string; text: string }> = {
  '食費':     { bg: '#DCFCE7', text: '#16A34A' },
  '日用品':   { bg: '#DBEAFE', text: '#2563EB' },
  '子ども用品': { bg: '#FCE7F3', text: '#9D174D' },
  '外食':     { bg: '#FFEDD5', text: '#EA580C' },
  'その他':   { bg: '#F3F4F6', text: '#4B5563' },
};

const categoryEmojis: Record<ExpenseCategory, string> = {
  '食費':     '🥦',
  '日用品':   '🧴',
  '子ども用品': '👶',
  '外食':     '🍽️',
  'その他':   '📋',
};

function EntryRow({ entry, onDelete }: { entry: BudgetEntry; onDelete: () => void }) {
  const [showDelete, setShowDelete] = useState(false);
  const colors = categoryColors[entry.category];

  return (
    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl">{categoryEmojis[entry.category]}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-800">{entry.storeName}</p>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {entry.category}
            </span>
          </div>
          <p className="text-xs text-gray-400">{entry.date}{entry.memo ? ` • ${entry.memo}` : ''}</p>
        </div>
        <p className="font-bold text-gray-800">¥{entry.amount.toLocaleString()}</p>
        <button onClick={() => setShowDelete(!showDelete)} className="text-gray-300 text-lg pl-1">⋮</button>
      </div>
      {showDelete && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
          <button onClick={onDelete} className="text-xs text-red-400 py-1 px-3">削除する</button>
        </div>
      )}
    </div>
  );
}

export default function BudgetPage({ budget }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [formDate, setFormDate] = useState('2026-05-07');
  const [formStore, setFormStore] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('食費');
  const [formMemo, setFormMemo] = useState('');

  const { entries, weeklyBudget, weekTotal, remaining, daysLeft, dailyBudget, categoryTotals, addEntry, deleteEntry, updateBudget } = budget;

  const isOver = remaining < 0;
  const usagePercent = Math.min(100, Math.round((weekTotal / weeklyBudget.amount) * 100));
  const weekAllTotal = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);

  const handleAddEntry = () => {
    if (!formAmount || !formStore.trim()) return;
    addEntry({
      date: formDate,
      storeName: formStore.trim(),
      amount: parseInt(formAmount, 10),
      category: formCategory,
      memo: formMemo,
    });
    setFormStore('');
    setFormAmount('');
    setFormMemo('');
    setShowAddForm(false);
  };

  const handleUpdateBudget = () => {
    if (!newBudgetAmount) return;
    updateBudget(parseInt(newBudgetAmount, 10));
    setNewBudgetAmount('');
    setShowBudgetEdit(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-xl font-bold text-gray-800">💰 家計簿</h1>
      </div>

      {/* 今週の食費カード */}
      <div
        className="rounded-2xl p-4 shadow-sm text-white"
        style={{ background: isOver ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #FFB38A 0%, #F97316 100%)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium opacity-90">今週の食費</p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ backgroundColor: isOver ? 'rgba(153,27,27,0.4)' : 'rgba(255,255,255,0.3)', color: '#fff' }}
          >
            {isOver ? '予算オーバー！' : '予算内'}
          </span>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-3xl font-bold">{isOver ? '-' : ''}¥{Math.abs(remaining).toLocaleString()}</p>
            <p className="text-sm opacity-80">{isOver ? 'オーバー' : '残り'}</p>
          </div>
          <div className="text-right text-sm opacity-90 space-y-0.5">
            <p>予算 ¥{weeklyBudget.amount.toLocaleString()}</p>
            <p>食費 ¥{weekTotal.toLocaleString()}</p>
          </div>
        </div>
        {/* プログレスバー */}
        <div className="mt-3 bg-white/30 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all bg-white"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs opacity-80 mt-1">
          <span>{usagePercent}% 使用</span>
          {daysLeft > 0 && !isOver && (
            <span>1日あたり ¥{dailyBudget.toLocaleString()} 使えます</span>
          )}
        </div>
      </div>

      {/* 予算設定 */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800">週の予算設定</p>
            <p className="text-sm text-gray-500">現在: ¥{weeklyBudget.amount.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setShowBudgetEdit(!showBudgetEdit)}
            className="text-sm font-medium px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
          >
            変更
          </button>
        </div>
        {showBudgetEdit && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="新しい予算額"
                value={newBudgetAmount}
                onChange={e => setNewBudgetAmount(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <button
                onClick={handleUpdateBudget}
                className="px-4 py-2 rounded-xl text-white font-medium text-sm"
                style={{ backgroundColor: '#F97316' }}
              >保存</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[8000, 10000, 12000, 15000, 20000].map(amount => (
                <button
                  key={amount}
                  onClick={() => { updateBudget(amount); setShowBudgetEdit(false); }}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{
                    backgroundColor: weeklyBudget.amount === amount ? '#F97316' : '#F3F4F6',
                    color: weeklyBudget.amount === amount ? '#fff' : '#6B7280',
                  }}
                >
                  ¥{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* カテゴリ別集計 */}
      <Card>
        <p className="font-bold text-gray-800 mb-3">今週の支出内訳</p>
        <div className="space-y-2">
          {categories.map(cat => {
            const total = categoryTotals[cat] ?? 0;
            if (total === 0) return null;
            const percent = weekAllTotal > 0 ? Math.round((total / weekAllTotal) * 100) : 0;
            const colors = categoryColors[cat];
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{categoryEmojis[cat]} {cat}</span>
                  <span className="text-sm font-bold text-gray-800">¥{total.toLocaleString()}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${percent}%`, backgroundColor: colors.text }}
                  />
                </div>
              </div>
            );
          })}
          {weekAllTotal > 0 && (
            <div className="pt-2 border-t border-gray-100 flex justify-between">
              <span className="text-sm font-bold text-gray-700">合計</span>
              <span className="text-sm font-bold text-gray-800">¥{weekAllTotal.toLocaleString()}</span>
            </div>
          )}
          {weekAllTotal === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">今週の支出データがありません</p>
          )}
        </div>
      </Card>

      {/* 支出登録ボタン */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:scale-95 transition-transform"
        style={{ backgroundColor: '#F97316' }}
      >
        + 支出を記録する
      </button>

      {/* 支出登録フォーム */}
      {showAddForm && (
        <Card>
          <p className="font-bold text-gray-800 mb-3">支出を追加</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">日付</label>
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">お店の名前</label>
              <input
                type="text"
                placeholder="例：イオン、スーパーなど"
                value={formStore}
                onChange={e => setFormStore(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">金額（円）</label>
              <input
                type="number"
                placeholder="例：3200"
                value={formAmount}
                onChange={e => setFormAmount(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">カテゴリ</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => {
                  const colors = categoryColors[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={
                        formCategory === cat
                          ? { backgroundColor: '#F97316', color: '#fff' }
                          : { backgroundColor: colors.bg, color: colors.text }
                      }
                    >
                      {categoryEmojis[cat]} {cat}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">メモ（任意）</label>
              <input
                type="text"
                placeholder="メモを入力..."
                value={formMemo}
                onChange={e => setFormMemo(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddEntry}
                className="flex-1 py-3 rounded-xl text-white font-bold"
                style={{ backgroundColor: '#F97316' }}
              >記録する</button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium"
              >キャンセル</button>
            </div>
          </div>
        </Card>
      )}

      {/* 支出履歴 */}
      <div className="space-y-2">
        <p className="font-bold text-gray-800">支出履歴</p>
        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-400">支出の記録がありません</p>
          </div>
        ) : (
          entries.slice(0, 20).map(entry => (
            <EntryRow
              key={entry.id}
              entry={entry}
              onDelete={() => deleteEntry(entry.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
