import { useState, useRef } from 'react';
import ItemIcon from './ItemIcon';
import { useRecentIcons } from '../hooks/useRecentIcons';

interface Props {
  currentEmoji: string;
  currentIconData?: string;
  currentShape?: 'circle' | 'square';
  onConfirm: (emoji: string, iconData: string | undefined, shape: 'circle' | 'square') => void;
  onClose: () => void;
}

type Tab = 'emoji' | 'original' | 'recent';

const EMOJI_GROUPS = [
  {
    label: '食品',
    emojis: ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍅', '🧅', '🥕', '🥔', '🥦', '🥬', '🌽', '🥒', '🍆', '🧄', '🌿', '🍄', '🥚', '🧀', '🥛', '🍞', '🥩', '🍗', '🐟', '🦐', '🫙', '🧂', '🍯', '🫘'],
  },
  {
    label: '料理',
    emojis: ['🍚', '🍜', '🍛', '🍱', '🥗', '🍳', '🥘', '🫕', '🍲', '🥪', '🌮', '🍕', '🍝', '🍣', '🥟', '🧆'],
  },
  {
    label: '日用品',
    emojis: ['🧴', '🧽', '🧻', '🪥', '🗑️', '🧺', '🫧', '🧹', '🪣', '🧼', '🪒', '🪮', '🔦', '🧲'],
  },
  {
    label: '子ども',
    emojis: ['👶', '🍼', '🧸', '🎀', '🛁', '🎒', '🧩', '🖍️', '✏️', '📚', '🎠', '🌻'],
  },
  {
    label: 'マーク',
    emojis: ['⭐', '🌟', '✨', '❤️', '💚', '💛', '💜', '🧡', '💙', '🔥', '💧', '🌸', '🌈', '🌙', '🌞', '🏷️', '🎁', '📦', '🛒', '💫'],
  },
];

function resizeImageToBase64(file: File, targetSize = 128): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas error')); return; }
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function IconPickerModal({ currentEmoji, currentIconData, currentShape = 'square', onConfirm, onClose }: Props) {
  const [activeTab, setActiveTab]   = useState<Tab>(currentIconData ? 'original' : 'emoji');
  const [draftEmoji, setDraftEmoji] = useState(currentEmoji);
  const [draftIconData, setDraftIconData] = useState<string | undefined>(currentIconData);
  const [draftShape, setDraftShape] = useState<'circle' | 'square'>(currentShape);
  const [activeGroup, setActiveGroup] = useState(0);
  const [uploading, setUploading]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { recentIcons } = useRecentIcons();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await resizeImageToBase64(file);
      setDraftIconData(data);
      setActiveTab('original');
    } catch {
      // ignore upload errors
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    onConfirm(draftEmoji, draftIconData, draftShape);
  };

  const selectEmoji = (e: string) => {
    setDraftEmoji(e);
    setDraftIconData(undefined);
  };

  const selectRecent = (emoji: string, iconData: string | undefined, shape: 'circle' | 'square') => {
    setDraftEmoji(emoji);
    setDraftIconData(iconData);
    setDraftShape(shape);
  };

  const previewSize = 64;

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 200 }}
      />

      {/* シート */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff',
        borderRadius: '24px 24px 0 0',
        zIndex: 201,
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
      }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px', borderBottom: '1px solid #F0E8E4', flexShrink: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#2F2F3A', margin: 0 }}>アイコンを変更</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#A09890', cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>

        {/* スクロール領域 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
          {/* プレビュー */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: previewSize, height: previewSize,
              borderRadius: draftShape === 'circle' ? '50%' : '14px',
              backgroundColor: draftIconData ? 'transparent' : '#F0EDF8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              border: '2px solid #E8E0F8',
            }}>
              <ItemIcon emoji={draftEmoji} customIconData={draftIconData} iconShape={draftShape} size={previewSize} />
            </div>
            {/* 形状 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['circle', 'square'] as const).map(shape => (
                <button
                  key={shape}
                  onClick={() => setDraftShape(shape)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: draftShape === shape ? '#EDE8FA' : '#F0E8E4',
                    color: draftShape === shape ? '#7C5FB5' : '#8C7068',
                  }}
                  className="active:scale-95"
                >
                  {shape === 'circle' ? '🔵 丸形' : '⬜ 角形'}
                </button>
              ))}
            </div>
          </div>

          {/* タブ */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {([['emoji', '絵文字'], ['original', 'オリジナル'], ['recent', '最近使った']] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === t ? '#EDE8FA' : '#F0E8E4',
                  color: activeTab === t ? '#7C5FB5' : '#8C7068',
                }}
                className="active:scale-95"
              >
                {label}
              </button>
            ))}
          </div>

          {/* 絵文字タブ */}
          {activeTab === 'emoji' && (
            <>
              {/* グループチップ */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
                {EMOJI_GROUPS.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGroup(i)}
                    style={{
                      flexShrink: 0,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: activeGroup === i ? '#EDE8FA' : '#F0E8E4',
                      color: activeGroup === i ? '#7C5FB5' : '#8C7068',
                    }}
                    className="active:scale-95"
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                {EMOJI_GROUPS[activeGroup].emojis.map(e => (
                  <button
                    key={e}
                    onClick={() => selectEmoji(e)}
                    style={{
                      aspectRatio: '1',
                      fontSize: '24px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '12px',
                      border: draftEmoji === e && !draftIconData ? '2.5px solid #7C5FB5' : '2.5px solid transparent',
                      backgroundColor: draftEmoji === e && !draftIconData ? '#EDE8FA' : '#FAFAFA',
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                    className="active:scale-95"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* オリジナル画像タブ */}
          {activeTab === 'original' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              {draftIconData ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={draftIconData}
                    alt="uploaded"
                    style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: '16px', border: '2px solid #E8E0F8' }}
                  />
                  <button
                    onClick={() => setDraftIconData(undefined)}
                    style={{ fontSize: '12px', color: '#B84030', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                  >
                    画像を削除して絵文字に戻す
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#B0A098' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🖼️</div>
                  <p style={{ fontSize: '13px', marginBottom: '4px' }}>オリジナル画像を使用できます</p>
                  <p style={{ fontSize: '11px', color: '#C0A898' }}>128×128pxに縮小して保存されます</p>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: '12px 28px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: uploading ? 'default' : 'pointer',
                  backgroundColor: '#EDE8FA',
                  color: '#7C5FB5',
                  opacity: uploading ? 0.6 : 1,
                }}
                className="active:scale-95"
              >
                {uploading ? '処理中...' : '📷 画像を選択'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* 最近使ったタブ */}
          {activeTab === 'recent' && (
            <>
              {recentIcons.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#C0A898', padding: '24px 0' }}>
                  まだ履歴がありません
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {recentIcons.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => selectRecent(r.emoji, r.customIconData, r.iconShape)}
                      style={{
                        aspectRatio: '1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '12px',
                        border: '2.5px solid transparent',
                        backgroundColor: '#FAFAFA',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        padding: '6px',
                      }}
                      className="active:scale-95"
                    >
                      <ItemIcon emoji={r.emoji} customIconData={r.customIconData} iconShape={r.iconShape} size={36} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* フッター */}
        <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', borderTop: '1px solid #F0E8E4', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, minHeight: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', backgroundColor: '#F0E8E4', color: '#8C7068' }}
            className="active:scale-95"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            style={{ flex: 2, minHeight: '48px', borderRadius: '14px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', backgroundColor: '#EDE8FA', color: '#7C5FB5' }}
            className="active:scale-95"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}
