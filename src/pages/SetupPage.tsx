import { useState } from 'react';
import { useFamilySettings } from '../hooks/useFamilySettings';
import type { DataMode, EatingTendency, TastePreference } from '../types';
import { quickAddCategories } from '../data/quickAddCategories';

interface Props {
  onComplete: (dataMode: DataMode) => void;
  defaultBudget: number;
  onBudgetChange: (amount: number) => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;
const TOTAL_STEPS = 5;

const BUDGET_PRESETS = [8000, 10000, 12000, 15000, 20000];
const EATING_OPTIONS: EatingTendency[] = ['少なめ', 'ふつう', 'よく食べる', '肉多め', '節約重視'];
const TASTE_OPTIONS: TastePreference[] = ['標準', '甘め', 'しっかり甘め', 'あっさり', '濃いめ', '出汁強め'];

const ALL_ITEMS = quickAddCategories.flatMap(cat =>
  cat.items.map(item => ({ ...item, catLabel: cat.label, catEmoji: cat.emoji }))
);

// ──────────────── 小部品 ─────────────────────────────────────

function ProgressDots({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '28px' }}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          style={{
            height: '8px',
            width: i + 1 <= step ? '28px' : '8px',
            borderRadius: '4px',
            backgroundColor: i + 1 <= step ? '#F48A7A' : '#EDD5C8',
            transition: 'width 0.25s ease, background-color 0.25s ease',
          }}
        />
      ))}
    </div>
  );
}

function CounterRow({
  emoji, label, value, onDec, onInc,
}: { emoji: string; label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>{emoji}</span>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#2F2F3A' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onDec}
          disabled={value === 0}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: 'none',
            backgroundColor: value === 0 ? '#F0E8E4' : '#EDD5C8',
            color: value === 0 ? '#C0A898' : '#8C5A44',
            fontSize: '22px', fontWeight: 700, cursor: value === 0 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >−</button>
        <span style={{ fontSize: '22px', fontWeight: 700, color: '#2F2F3A', minWidth: '28px', textAlign: 'center' }}>
          {value}
        </span>
        <button
          onClick={onInc}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: 'none',
            backgroundColor: '#F48A7A', color: '#fff',
            fontSize: '22px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >＋</button>
      </div>
    </div>
  );
}

function ChipButton({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px', borderRadius: '20px', border: 'none',
        fontWeight: selected ? 700 : 500, fontSize: '13px', cursor: 'pointer',
        backgroundColor: selected ? '#F48A7A' : '#F0E8E4',
        color: selected ? '#fff' : '#5A4A44',
        transition: 'background-color 0.15s',
      }}
    >
      {label}
    </button>
  );
}

// ──────────────── メイン ─────────────────────────────────────

export default function SetupPage({ onComplete, defaultBudget, onBudgetChange }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [selectedBudget, setSelectedBudget] = useState(defaultBudget);
  const [customBudget, setCustomBudget] = useState('');
  const [confirmReal, setConfirmReal] = useState(false);
  const [freqCatFilter, setFreqCatFilter] = useState<string>('全て');

  const { settings, updateSettings, toggleFrequentItem } = useFamilySettings();

  const effectiveBudget = customBudget ? parseInt(customBudget, 10) || selectedBudget : selectedBudget;
  const frequentItems = settings.frequentItems ?? [];

  const handleNext = () => {
    if (step === 2) onBudgetChange(effectiveBudget);
    if (step < 5) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 0) {
      setConfirmReal(false);
      setStep((step - 1) as Step);
    }
  };

  const handleComplete = (mode: DataMode) => {
    onBudgetChange(effectiveBudget);
    onComplete(mode);
  };

  const filteredItems = freqCatFilter === '全て'
    ? ALL_ITEMS
    : ALL_ITEMS.filter(i => i.catLabel === freqCatFilter);

  // ── Step 0: ウェルカム ──────────────────────────────────────
  if (step === 0) {
    return (
      <div style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', backgroundColor: '#FFF8F1',
      }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>👩‍👧‍👦</div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#2F2F3A', marginBottom: '12px', textAlign: 'center' }}>
          お助けママへようこそ！
        </h1>
        <p style={{ fontSize: '15px', color: '#7A6860', lineHeight: 1.7, textAlign: 'center', maxWidth: '300px', marginBottom: '40px' }}>
          在庫管理・買い物・家計・レシピを<br />ぜんぶまとめてサポートします。
        </p>
        <div style={{
          backgroundColor: '#fff', borderRadius: '16px', padding: '16px 20px',
          marginBottom: '40px', maxWidth: '320px', width: '100%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        }}>
          <p style={{ fontSize: '13px', color: '#A09890', marginBottom: '10px', fontWeight: 600 }}>5つのかんたんな質問</p>
          {['👨‍👩‍👧 家族構成を教えてください', '💰 食費予算を設定しましょう', '🍽️ 食の好みを教えてください', '🛒 よく買うものを選びましょう', '🚀 どこから始めますか？'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', backgroundColor: '#FFE3D5', color: '#B85A28', borderRadius: '50%', minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{i + 1}</span>
              <span style={{ fontSize: '13px', color: '#5A4A44' }}>{item}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setStep(1)}
          style={{
            width: '100%', maxWidth: '320px', minHeight: '56px',
            backgroundColor: '#F48A7A', color: '#fff', border: 'none',
            borderRadius: '16px', fontSize: '17px', fontWeight: 700, cursor: 'pointer',
          }}
        >
          はじめる →
        </button>
        <p style={{ fontSize: '12px', color: '#C0A898', marginTop: '16px' }}>約2〜3分で完了します</p>
      </div>
    );
  }

  // ── Step 1〜5 共通ラッパー ────────────────────────────────────
  return (
    <div style={{ height: '100svh', overflow: 'hidden', backgroundColor: '#FFF8F1', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダーナビ */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={handleBack}
          style={{ background: 'none', border: 'none', color: '#A09890', fontSize: '14px', cursor: 'pointer', padding: '4px 0' }}
        >
          ← もどる
        </button>
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, padding: '16px 20px 32px', overflowY: 'auto' }}>
        <ProgressDots step={step} />

        {/* ── Step 1: 家族構成 ────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2F2F3A', marginBottom: '6px' }}>👨‍👩‍👧 家族構成</h2>
            <p style={{ fontSize: '13px', color: '#A09890', marginBottom: '24px' }}>
              レシピの分量や買い物量の目安に使います
            </p>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '8px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
              <CounterRow emoji="🧑" label="大人" value={settings.adults}
                onDec={() => updateSettings({ adults: Math.max(0, settings.adults - 1) })}
                onInc={() => updateSettings({ adults: settings.adults + 1 })} />
              <div style={{ height: '1px', backgroundColor: '#F5EDE8' }} />
              <CounterRow emoji="🧒" label="子ども（小学生以上）" value={settings.children}
                onDec={() => updateSettings({ children: Math.max(0, settings.children - 1) })}
                onInc={() => updateSettings({ children: settings.children + 1 })} />
              <div style={{ height: '1px', backgroundColor: '#F5EDE8' }} />
              <CounterRow emoji="👶" label="幼児・赤ちゃん" value={settings.toddlers}
                onDec={() => updateSettings({ toddlers: Math.max(0, settings.toddlers - 1) })}
                onInc={() => updateSettings({ toddlers: settings.toddlers + 1 })} />
            </div>
            <div style={{ backgroundColor: '#FFF3EC', borderRadius: '12px', padding: '12px 16px' }}>
              <p style={{ fontSize: '13px', color: '#8C5A44' }}>
                合計 <strong style={{ fontSize: '16px' }}>{settings.adults + settings.children + settings.toddlers}人</strong> 家族
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: 週の食費予算 ─────────────────────────── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2F2F3A', marginBottom: '6px' }}>💰 週の食費予算</h2>
            <p style={{ fontSize: '13px', color: '#A09890', marginBottom: '24px' }}>
              日用品・外食を含めても大丈夫です。あとで変更できます
            </p>
            {/* 現在の選択 */}
            <div style={{
              backgroundColor: '#F48A7A', color: '#fff', borderRadius: '16px',
              padding: '20px', textAlign: 'center', marginBottom: '20px',
            }}>
              <p style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>選択中の予算</p>
              <p style={{ fontSize: '36px', fontWeight: 800 }}>¥{effectiveBudget.toLocaleString()}</p>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>1日あたり約 ¥{Math.round(effectiveBudget / 7).toLocaleString()}</p>
            </div>
            {/* プリセット */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {BUDGET_PRESETS.map(amount => (
                <button
                  key={amount}
                  onClick={() => { setSelectedBudget(amount); setCustomBudget(''); }}
                  style={{
                    padding: '14px 8px', borderRadius: '12px', border: '2px solid',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    borderColor: selectedBudget === amount && !customBudget ? '#F48A7A' : '#EDD5C8',
                    backgroundColor: selectedBudget === amount && !customBudget ? '#FFF0EC' : '#fff',
                    color: selectedBudget === amount && !customBudget ? '#D4503A' : '#5A4A44',
                  }}
                >
                  ¥{(amount / 10000).toFixed(amount % 10000 === 0 ? 0 : 1)}万
                </button>
              ))}
            </div>
            {/* カスタム入力 */}
            <div>
              <p style={{ fontSize: '12px', color: '#A09890', marginBottom: '6px' }}>または直接入力</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="例：13000"
                  value={customBudget}
                  onChange={e => setCustomBudget(e.target.value)}
                  style={{
                    flex: 1, border: '2px solid', borderColor: customBudget ? '#F48A7A' : '#EDD5C8',
                    borderRadius: '12px', padding: '12px 14px', fontSize: '15px',
                    backgroundColor: '#fff', outline: 'none', color: '#2F2F3A',
                  }}
                />
                <span style={{ fontSize: '15px', color: '#7A6860', fontWeight: 600 }}>円 / 週</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: 食の好み ─────────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2F2F3A', marginBottom: '6px' }}>🍽️ 食の好み</h2>
            <p style={{ fontSize: '13px', color: '#A09890', marginBottom: '24px' }}>
              レシピの分量・調味料の目安に反映されます
            </p>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#2F2F3A', marginBottom: '12px' }}>食べる量の傾向</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {EATING_OPTIONS.map(opt => (
                  <ChipButton
                    key={opt} label={opt}
                    selected={settings.eatingTendency === opt}
                    onClick={() => updateSettings({ eatingTendency: opt })}
                  />
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#2F2F3A', marginBottom: '12px' }}>味の好み</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TASTE_OPTIONS.map(opt => (
                  <ChipButton
                    key={opt} label={opt}
                    selected={settings.tastePreference === opt}
                    onClick={() => updateSettings({ tastePreference: opt })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: よく買うもの ─────────────────────────── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2F2F3A', marginBottom: '6px' }}>🛒 よく買うもの</h2>
            <p style={{ fontSize: '13px', color: '#A09890', marginBottom: '16px' }}>
              タップして選んでください。買い物画面のクイック追加に反映されます
            </p>
            {/* カテゴリタブ */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
              {['全て', ...quickAddCategories.map(c => c.label)].map(label => (
                <button
                  key={label}
                  onClick={() => setFreqCatFilter(label)}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: '20px', border: 'none',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    backgroundColor: freqCatFilter === label ? '#F48A7A' : '#F0E8E4',
                    color: freqCatFilter === label ? '#fff' : '#8C7068',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* アイテムグリッド */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {filteredItems.map(item => {
                const selected = frequentItems.includes(item.masterItemId);
                return (
                  <button
                    key={item.masterItemId}
                    onClick={() => toggleFrequentItem(item.masterItemId)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: '4px', padding: '10px 4px', borderRadius: '12px',
                      border: '2px solid',
                      borderColor: selected ? '#F48A7A' : 'transparent',
                      backgroundColor: selected ? '#FFF0EC' : '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                    <span style={{ fontSize: '10px', color: selected ? '#D4503A' : '#5A4A44', fontWeight: selected ? 700 : 400, lineHeight: 1.2, textAlign: 'center' }}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {frequentItems.length > 0 && (
              <p style={{ fontSize: '12px', color: '#F48A7A', fontWeight: 600, textAlign: 'center', marginTop: '16px' }}>
                {frequentItems.length}個 選択中
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#C0A898', textAlign: 'center', marginTop: '6px' }}>
              あとから設定で変更できます
            </p>
          </div>
        )}

        {/* ── Step 5: データ選択 ───────────────────────────── */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2F2F3A', marginBottom: '6px' }}>🚀 どこから始めますか？</h2>
            <p style={{ fontSize: '13px', color: '#A09890', marginBottom: '24px' }}>
              あとから設定でデータをリセットすることもできます
            </p>

            {/* デモデータカード */}
            <button
              onClick={() => handleComplete('demo')}
              style={{
                width: '100%', textAlign: 'left', padding: '20px',
                backgroundColor: '#fff', borderRadius: '20px', border: '2px solid #EDD5C8',
                boxShadow: '0 2px 10px rgba(0,0,0,0.07)', cursor: 'pointer', marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '36px' }}>🎮</span>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#2F2F3A', marginBottom: '6px' }}>
                    サンプルデータで試す
                  </p>
                  <p style={{ fontSize: '13px', color: '#7A6860', lineHeight: 1.6 }}>
                    デモデータが入った状態でスタート。<br />使い方を確認してから始めたい方におすすめです。
                  </p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['在庫データあり', '買い物リストあり', '家計サンプルあり'].map(tag => (
                      <span key={tag} style={{ fontSize: '11px', backgroundColor: '#FFF0EC', color: '#D4503A', padding: '3px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px', backgroundColor: '#F48A7A', color: '#fff', borderRadius: '12px', padding: '12px', textAlign: 'center', fontWeight: 700, fontSize: '15px' }}>
                この設定で始める →
              </div>
            </button>

            {/* 自分の家用カード */}
            {!confirmReal ? (
              <button
                onClick={() => setConfirmReal(true)}
                style={{
                  width: '100%', textAlign: 'left', padding: '20px',
                  backgroundColor: '#fff', borderRadius: '20px', border: '2px solid #EDD5C8',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.07)', cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <span style={{ fontSize: '36px' }}>🏠</span>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 800, color: '#2F2F3A', marginBottom: '6px' }}>
                      自分の家用に始める
                    </p>
                    <p style={{ fontSize: '13px', color: '#7A6860', lineHeight: 1.6 }}>
                      在庫・買い物リスト・家計簿が空の状態でスタート。<br />今すぐ本格的に使いたい方向けです。
                    </p>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['設定内容は保持', '在庫は空からスタート', '自分のペースで入力'].map(tag => (
                        <span key={tag} style={{ fontSize: '11px', backgroundColor: '#E8F5EC', color: '#1A7A46', padding: '3px 8px', borderRadius: '10px', fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', backgroundColor: '#F0E8E4', color: '#5A4A44', borderRadius: '12px', padding: '12px', textAlign: 'center', fontWeight: 700, fontSize: '15px' }}>
                  こちらで始める →
                </div>
              </button>
            ) : (
              /* 確認ダイアログ（インライン） */
              <div style={{
                backgroundColor: '#fff', borderRadius: '20px', border: '2px solid #F4C4A8',
                padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              }}>
                <div style={{ backgroundColor: '#FFF3EC', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#B85A28', marginBottom: '4px' }}>⚠️ 確認してください</p>
                  <p style={{ fontSize: '13px', color: '#7A5A40', lineHeight: 1.6 }}>
                    登録済みの在庫・買い物リスト・家計データは<strong>削除されます</strong>。<br />
                    設定した家族構成・予算・好みは保持されます。
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleComplete('real')}
                    style={{
                      flex: 1, minHeight: '48px', backgroundColor: '#5A9E7A',
                      color: '#fff', border: 'none', borderRadius: '12px',
                      fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    はい、空から始める
                  </button>
                  <button
                    onClick={() => setConfirmReal(false)}
                    style={{
                      flex: 1, minHeight: '48px', backgroundColor: '#F0E8E4',
                      color: '#5A4A44', border: 'none', borderRadius: '12px',
                      fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    もどる
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 次へボタン（Step 1〜4） */}
      {step >= 1 && step <= 4 && (
        <div style={{ padding: '16px 20px 32px', backgroundColor: '#FFF8F1' }}>
          <button
            onClick={handleNext}
            style={{
              width: '100%', minHeight: '56px', backgroundColor: '#F48A7A',
              color: '#fff', border: 'none', borderRadius: '16px',
              fontSize: '16px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            次へ → （{step}/{TOTAL_STEPS}）
          </button>
        </div>
      )}
    </div>
  );
}
