import { useState } from 'react';

interface Props {
  onClose: () => void;
}

const GUIDES = [
  {
    emoji: '📦',
    title: '在庫管理',
    subtitle: '冷蔵庫・食品棚の状態を記録',
    desc: '食品・日用品・子ども用品の残量をアプリで管理。「少ない」「ない」になるとアラートが出ます。',
    tips: [
      '追加ボタンで在庫を登録しよう',
      '「+1 / -1」で数量を手軽に更新',
      '「使い切った」で一気にゼロにできる',
      'クイック追加グリッドで素早く登録',
    ],
    color: '#A8CFF0',
    lightColor: '#EAF4FF',
  },
  {
    emoji: '🛒',
    title: '買い物リスト',
    subtitle: '必要なものをまとめてリスト化',
    desc: 'タップするだけで買い物リストに追加できます。お店でチェックしながら使うと便利です。',
    tips: [
      'よく買うものはクイック追加で一発登録',
      'チェックした項目はまとめて削除できる',
      'レシピ画面から「不足食材を追加」も可能',
      'カテゴリ別に整理して見やすく管理',
    ],
    color: '#A9DCC4',
    lightColor: '#E8F7EE',
  },
  {
    emoji: '🍳',
    title: 'レシピ提案',
    subtitle: '今ある材料から作れる料理を提案',
    desc: '在庫データをもとに「今すぐ作れる」料理を自動で提案。買い足しが必要なレシピも確認できます。',
    tips: [
      '「今作れる」タブで手間なく献立決め',
      '「あと1品」でちょっとの買い足しで完成',
      '節約メニュータブでコスパよく献立を選ぶ',
      '「作った！」で在庫が自動で減ります',
    ],
    color: '#FFD9A8',
    lightColor: '#FFF5E8',
  },
  {
    emoji: '💰',
    title: '予算管理',
    subtitle: '週の食費をぱっと把握',
    desc: '週の食費・日用品費をまとめて記録。残り予算と1日あたりの使える金額がひと目でわかります。',
    tips: [
      'ホーム画面で今週の残り予算をチェック',
      'お店ごとにレシートを記録しよう',
      'カテゴリ別で何に使ったか振り返れる',
      '節約モード：予算が少ないとレシピが節約向けに',
    ],
    color: '#F4B8A8',
    lightColor: '#FFF0EC',
  },
] as const;

export default function GuideModal({ onClose }: Props) {
  const [page, setPage] = useState(0);
  const guide = GUIDES[page];

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
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '22px', color: '#A09890', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* カード */}
          <div style={{
            backgroundColor: guide.lightColor,
            borderRadius: '20px', padding: '24px 20px',
            border: `2px solid ${guide.color}30`,
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                backgroundColor: guide.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', flexShrink: 0,
              }}>
                {guide.emoji}
              </div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#2F2F3A', marginBottom: '2px' }}>{guide.title}</p>
                <p style={{ fontSize: '12px', color: '#7A6860' }}>{guide.subtitle}</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#4A3A34', lineHeight: 1.7, marginBottom: '16px' }}>
              {guide.desc}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {guide.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700,
                    backgroundColor: guide.color, color: '#fff',
                    borderRadius: '50%', minWidth: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: '13px', color: '#4A3A34', lineHeight: 1.5 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div style={{ padding: '0 20px' }}>
          {/* ページドット */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
            {GUIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  width: i === page ? '28px' : '8px', height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  backgroundColor: i === page ? '#F48A7A' : '#EDD5C8',
                  transition: 'width 0.2s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
          {/* 前後ボタン */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none',
                backgroundColor: page === 0 ? '#F0E8E4' : '#EDD5C8',
                color: page === 0 ? '#C0A898' : '#5A4A44',
                fontWeight: 600, fontSize: '14px', cursor: page === 0 ? 'default' : 'pointer',
              }}
            >
              ← 前へ
            </button>
            {page < GUIDES.length - 1 ? (
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none',
                  backgroundColor: '#F48A7A', color: '#fff',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                }}
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none',
                  backgroundColor: '#F48A7A', color: '#fff',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                }}
              >
                閉じる ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
