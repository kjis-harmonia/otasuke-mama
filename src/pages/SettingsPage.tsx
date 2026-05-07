import { useState } from 'react';
import type { UseBudgetReturn } from '../hooks/useBudget';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { FamilySettings, EatingTendency, TastePreference } from '../types';
import Card from '../components/Card';

interface Props {
  budget: UseBudgetReturn;
  onReset: () => void;
}

const defaultFamilySettings: FamilySettings = {
  adults: 2,
  children: 1,
  toddlers: 1,
  eatingTendency: 'ふつう',
  tastePreference: '標準',
};

const FAMILY_KEY = 'otasuke_family_v2';

const eatingTendencies: EatingTendency[] = ['少なめ', 'ふつう', 'よく食べる', '肉多め', '節約重視'];
const tastePreferences: TastePreference[] = ['標準', '甘め', 'しっかり甘め', 'あっさり', '濃いめ', '出汁強め'];

interface CounterRowProps {
  label: string;
  emoji: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function CounterRow({ label, emoji, value, onDecrement, onIncrement }: CounterRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          disabled={value === 0}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg disabled:opacity-40"
        >
          −
        </button>
        <span className="text-xl font-bold text-gray-800 min-w-[2rem] text-center">{value}</span>
        <button
          onClick={onIncrement}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: '#F97316' }}
        >
          ＋
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage({ budget, onReset }: Props) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [familySettings, setFamilySettings] = useLocalStorage<FamilySettings>(FAMILY_KEY, defaultFamilySettings);

  const updateFamily = (patch: Partial<FamilySettings>) => {
    setFamilySettings(prev => ({ ...prev, ...patch }));
  };

  const handleCountChange = (field: 'adults' | 'children' | 'toddlers', delta: number) => {
    const current = familySettings[field];
    const newVal = Math.max(0, current + delta);
    updateFamily({ [field]: newVal });
  };

  const handleBudgetSave = () => {
    if (!budgetInput) return;
    budget.updateBudget(parseInt(budgetInput, 10));
    setBudgetInput('');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-xl font-bold text-gray-800">⚙️ 設定</h1>
      </div>

      {/* 家族構成 */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-4">👨‍👩‍👧 家族構成</h2>
        <div className="space-y-4">
          <CounterRow
            label="大人"
            emoji="🧑"
            value={familySettings.adults}
            onDecrement={() => handleCountChange('adults', -1)}
            onIncrement={() => handleCountChange('adults', 1)}
          />
          <CounterRow
            label="子ども（学齢期）"
            emoji="🧒"
            value={familySettings.children}
            onDecrement={() => handleCountChange('children', -1)}
            onIncrement={() => handleCountChange('children', 1)}
          />
          <CounterRow
            label="幼児・乳幼児"
            emoji="👶"
            value={familySettings.toddlers}
            onDecrement={() => handleCountChange('toddlers', -1)}
            onIncrement={() => handleCountChange('toddlers', 1)}
          />
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              合計: <span className="font-bold text-gray-700">{familySettings.adults + familySettings.children + familySettings.toddlers}人家族</span>
            </p>
          </div>
        </div>
      </Card>

      {/* 食べる量の傾向 */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-3">🍽️ 食べる量の傾向</h2>
        <div className="flex flex-wrap gap-2">
          {eatingTendencies.map(tendency => (
            <button
              key={tendency}
              onClick={() => updateFamily({ eatingTendency: tendency })}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={
                familySettings.eatingTendency === tendency
                  ? { backgroundColor: '#F97316', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#6B7280' }
              }
            >
              {tendency}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">レシピの目安分量に反映されます</p>
      </Card>

      {/* 味の好み */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-3">🧂 味の好み</h2>
        <div className="flex flex-wrap gap-2">
          {tastePreferences.map(pref => (
            <button
              key={pref}
              onClick={() => updateFamily({ tastePreference: pref })}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={
                familySettings.tastePreference === pref
                  ? { backgroundColor: '#60A5FA', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#6B7280' }
              }
            >
              {pref}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">レシピの調味料目安に反映されます</p>
      </Card>

      {/* 週の食費予算 */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-3">💰 週の食費予算</h2>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500">現在の設定</p>
            <p className="text-xl font-bold text-gray-800">¥{budget.weeklyBudget.amount.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="新しい予算額"
            value={budgetInput}
            onChange={e => setBudgetInput(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
          <button
            onClick={handleBudgetSave}
            className="px-4 py-2 rounded-xl text-white font-medium text-sm"
            style={{ backgroundColor: '#F97316' }}
          >更新</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[8000, 10000, 12000, 15000, 20000].map(amount => (
            <button
              key={amount}
              onClick={() => budget.updateBudget(amount)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={
                budget.weeklyBudget.amount === amount
                  ? { backgroundColor: '#F97316', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#6B7280' }
              }
            >
              ¥{amount.toLocaleString()}
            </button>
          ))}
        </div>
      </Card>

      {/* アプリ情報 */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-2">📱 アプリについて</h2>
        <div className="space-y-1 text-sm text-gray-500">
          <p>お助けママ v2.0.0</p>
          <p>データはこの端末に保存されます</p>
          <p>外部サーバー・AI・OCRは使用していません</p>
        </div>
      </Card>

      {/* データリセット */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-3">🗑️ データの管理</h2>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl border-2 border-red-200 text-red-500 font-medium text-sm active:scale-95 transition-transform"
          >
            全データをリセット
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-sm font-bold text-red-700">⚠️ 本当にリセットしますか？</p>
              <p className="text-xs text-red-500 mt-1">在庫・買い物リスト・支出データがすべて削除されます</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { onReset(); setShowResetConfirm(false); }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm"
              >
                リセットする
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium text-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </Card>

      <div className="h-4" />
    </div>
  );
}
