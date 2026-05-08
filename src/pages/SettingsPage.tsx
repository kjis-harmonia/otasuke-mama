import { useState } from 'react';
import type { UseBudgetReturn } from '../hooks/useBudget';
import { useFamilySettings } from '../hooks/useFamilySettings';
import { useHiddenItems } from '../hooks/useHiddenItems';
import { masterItems } from '../data/masterItems';
import type { EatingTendency, TastePreference } from '../types';
import Card from '../components/Card';
import GuideModal from '../components/GuideModal';

interface Props {
  budget: UseBudgetReturn;
  onReset: () => void;
  onResetSetup?: () => void;
}

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
          style={{ backgroundColor: '#F48A7A' }}
        >
          ＋
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage({ budget, onReset, onResetSetup }: Props) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSetupConfirm, setShowSetupConfirm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const { settings: familySettings, updateSettings: updateFamily } = useFamilySettings();
  const { hidden, restoreItem, restoreAll } = useHiddenItems();

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
      <div className="pt-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">⚙️ 設定</h1>
        {/* 使い方ガイドボタン */}
        <button
          onClick={() => setShowGuide(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '20px', border: 'none',
            backgroundColor: '#FFE3D5', color: '#B85A28',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}
        >
          📖 使い方ガイド
        </button>
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
                  ? { backgroundColor: '#F48A7A', color: '#fff' }
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
                  ? { backgroundColor: '#A8CFF0', color: '#1A507A' }
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
          <div className="flex-1 rounded-xl px-4 py-3" style={{ backgroundColor: '#FFF3EC' }}>
            <p className="text-xs text-gray-500">現在の設定</p>
            <p className="text-xl font-bold" style={{ color: '#D4503A' }}>¥{budget.weeklyBudget.amount.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="新しい予算額を入力"
            value={budgetInput}
            onChange={e => setBudgetInput(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
          <button
            onClick={handleBudgetSave}
            className="px-4 py-2 rounded-xl text-white font-medium text-sm"
            style={{ backgroundColor: '#F48A7A' }}
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
                  ? { backgroundColor: '#F48A7A', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#6B7280' }
              }
            >
              ¥{amount.toLocaleString()}
            </button>
          ))}
        </div>
      </Card>

      {/* アプリについて */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-3">📱 アプリについて</h2>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <span>バージョン</span>
            <span className="font-bold text-gray-700">v0.3.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span>データ保存先</span>
            <span className="font-medium text-gray-600">この端末のみ</span>
          </div>
          <div className="flex items-center justify-between">
            <span>外部サーバー</span>
            <span className="font-medium text-green-600">使用なし</span>
          </div>
          <div className="flex items-center justify-between">
            <span>AI・OCR</span>
            <span className="font-medium text-green-600">使用なし</span>
          </div>
        </div>
        {/* ガイドボタン（カード内にも） */}
        <button
          onClick={() => setShowGuide(true)}
          className="w-full mt-4 py-3 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: '#FFE3D5', color: '#B85A28' }}
        >
          📖 使い方ガイドを見る
        </button>
      </Card>

      {/* 非表示アイテムの管理 */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-3">👁️ 非表示アイテムの管理</h2>
        {hidden.length === 0 ? (
          <p className="text-sm text-gray-400">非表示にしているアイテムはありません</p>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">買い物グリッドで非表示にしたアイテムを元に戻せます</p>
            <div className="space-y-2">
              {hidden.map(id => {
                const item = masterItems.find(m => m.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <button
                      onClick={() => restoreItem(id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: '#E8F8F0', color: '#1A8A56' }}
                    >
                      表示に戻す
                    </button>
                  </div>
                );
              })}
            </div>
            {hidden.length >= 2 && (
              <button
                onClick={restoreAll}
                className="w-full mt-3 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#F0E8E4', color: '#8C7068' }}
              >
                すべて表示に戻す
              </button>
            )}
          </>
        )}
      </Card>

      {/* データの管理 */}
      <Card>
        <h2 className="font-bold text-gray-800 text-base mb-3">🗑️ データの管理</h2>

        {/* セットアップやり直し */}
        {onResetSetup && (
          <div className="mb-3">
            {!showSetupConfirm ? (
              <button
                onClick={() => setShowSetupConfirm(true)}
                className="w-full py-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#FFF0EC', color: '#B85A28', border: '1.5px solid #F4C4A8' }}
              >
                🔄 初回セットアップをやり直す
              </button>
            ) : (
              <div style={{ backgroundColor: '#FFF3EC', borderRadius: '12px', padding: '14px 16px', marginBottom: '4px' }}>
                <p className="text-sm font-bold mb-2" style={{ color: '#B85A28' }}>セットアップ画面に戻りますか？</p>
                <p className="text-xs mb-3" style={{ color: '#8C5A44' }}>現在の在庫・買い物・家計データは残ります</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onResetSetup(); setShowSetupConfirm(false); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: '#F48A7A', color: '#fff' }}
                  >
                    やり直す
                  </button>
                  <button
                    onClick={() => setShowSetupConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 全データリセット */}
        <div className="pt-2 border-t border-gray-100 mt-2">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-xl border-2 border-red-200 text-red-500 font-medium text-sm"
            >
              全データをリセット（初期化）
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-sm font-bold text-red-700">⚠️ 本当にリセットしますか？</p>
                <p className="text-xs text-red-500 mt-1">在庫・買い物リスト・支出データ・設定がすべて削除され、アプリが再起動します</p>
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
        </div>
      </Card>

      <div className="h-4" />

      {/* 使い方ガイドモーダル */}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}
