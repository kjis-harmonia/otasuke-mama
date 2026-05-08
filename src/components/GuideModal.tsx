import { useState } from 'react';

interface Props {
  onClose: () => void;
}

const STEPS = [
  {
    emoji: '👋',
    title: 'お助けママへようこそ！',
    desc: '在庫・買い物・家計簿・うちレシピの4つを使うと、毎日の管理がかなり楽になります。',
    tip: 'このガイドでアプリの使い方をかんたんに紹介します',
    color: '#F9C06A',
    lightColor: '#FFFAE8',
  },
  {
    emoji: '📦',
    title: '在庫を記録しよう',
    desc: '食品・日用品・子ども用品の残量をアプリで管理できます。「少ない」「ない」になるとホームにアラートが表示されます。',
    tip: 'クイック追加グリッドで素早く在庫登録できます！',
    color: '#A8CFF0',
    lightColor: '#EAF4FF',
  },
  {
    emoji: '🛒',
    title: '買い物リストに追加',
    desc: 'よく買うものをタップするだけでリストに追加できます。お店でチェックしながら使うと便利です。',
    tip: '「わが家の商品」に登録すると毎回ラクに追加できます',
    color: '#A9DCC4',
    lightColor: '#E8F7EE',
  },
  {
    emoji: '💰',
    title: '予算を管理しよう',
    desc: '週の食費・日用品費をまとめて記録。残り予算と1日あたりの使える金額がひと目でわかります。',
    tip: '月曜スタートの週ごとに予算がリセットされます',
    color: '#F4B8A8',
    lightColor: '#FFF0EC',
  },
  {
    emoji: '🍳',
    title: 'うちレシピで献立を決めよう',
    desc: '在庫データをもとに「今すぐ作れる」料理を自動で提案。賞味期限が近い食材の使い切りメニューも見られます。',
    tip: '「作った！」をタップすると在庫が自動で減ります',
    color: '#FFD9A8',
    lightColor: '#FFF5E8',
  },
] as const;

export default function GuideModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.50)',
        display: 'flex', alignItems: 'flex-end', zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '430px', margin: '0 auto',
          backgroundColor: '#FFF8F1', borderRadius: '24px 24px 0 0',
          padding: '0 0 32px',
          maxHeight: '85svh', display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ハンドル */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#EDD5C8' }} />
        </div>

        {/* ヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 0' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#2F2F3A' }}>📖 使い方ガイド</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#A09890' }}>
              {step + 1} / {STEPS.length}
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '22px', color: '#A09890', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{
            backgroundColor: current.lightColor,
            borderRadius: '20px', padding: '28px 20px 24px',
            border: `2px solid ${current.color}40`,
            marginBottom: '20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              backgroundColor: current.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', marginBottom: '16px',
              boxShadow: `0 4px 12px ${current.color}60`,
            }}>
              {current.emoji}
            </div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#2F2F3A', marginBottom: '12px', lineHeight: 1.3 }}>
              {current.title}
            </p>
            <p style={{ fontSize: '14px', color: '#4A3A34', lineHeight: 1.8, marginBottom: '16px' }}>
              {current.desc}
            </p>
            <div style={{
              backgroundColor: `${current.color}30`,
              borderRadius: '10px', padding: '10px 14px',
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              width: '100%', textAlign: 'left',
            }}>
              <span style={{ fontSize: '14px', flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: '12px', color: '#5A4A44', lineHeight: 1.6, fontWeight: 600 }}>
                {current.tip}
              </p>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div style={{ padding: '0 20px' }}>
          {/* ページドット */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: i === step ? '28px' : '8px', height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  backgroundColor: i === step ? '#F48A7A' : '#EDD5C8',
                  transition: 'width 0.2s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none',
                  backgroundColor: '#EDD5C8', color: '#5A4A44',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                }}
              >
                ← 前へ
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none',
                  backgroundColor: '#F0E8E4', color: '#A09890',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                }}
              >
                スキップ
              </button>
            )}
            <button
              onClick={isLast ? onClose : () => setStep(s => s + 1)}
              style={{
                flex: 2, minHeight: '48px', borderRadius: '14px', border: 'none',
                backgroundColor: '#F48A7A', color: '#fff',
                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
              }}
              className="active:scale-95"
            >
              {isLast ? 'はじめてみる ✨' : '次へ →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
