import { useState } from 'react';
import type { UseMealPlanReturn } from '../hooks/useMealPlan';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { MealEntry, MealType } from '../types';
import { getCurrentWeekMonday, formatWeekRange } from '../utils/weekUtils';

const DAYS_JA = ['月', '火', '水', '木', '金', '土', '日'];
const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: '朝' },
  { id: 'lunch',     label: '昼' },
  { id: 'dinner',    label: '夜' },
];
const QUICK_EMOJIS = ['🍚', '🥗', '🍜', '🍳', '🥘', '🍱', '🍛', '🥩', '🐟', '🥕', '🍲', '🧆'];

interface AddModal {
  date: string;
  mealType: MealType;
  editId?: string;
  name: string;
  emoji: string;
  note: string;
}

interface Props {
  mealPlan: UseMealPlanReturn;
  shopping: UseShoppingListReturn;
}

function getTodayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

function getWeekDays(): string[] {
  const monday = getCurrentWeekMonday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
}

export default function WeeklyMealPlan({ mealPlan, shopping }: Props) {
  const todayStr = getTodayStr();
  const [activeDay, setActiveDay] = useState<string>(todayStr);
  const [modal, setModal] = useState<AddModal | null>(null);

  const weekDays = getWeekDays();
  const { entries, addEntry, updateEntry, deleteEntry } = mealPlan;

  const openAdd = (date: string, mealType: MealType) => {
    setModal({ date, mealType, name: '', emoji: '🍚', note: '' });
  };

  const openEdit = (entry: MealEntry) => {
    setModal({
      date: entry.date,
      mealType: entry.mealType,
      editId: entry.id,
      name: entry.name,
      emoji: entry.emoji,
      note: entry.note ?? '',
    });
  };

  const handleSave = () => {
    if (!modal || !modal.name.trim()) return;
    if (modal.editId) {
      updateEntry(modal.editId, {
        name: modal.name.trim(),
        emoji: modal.emoji,
        note: modal.note.trim() || undefined,
      });
    } else {
      addEntry({
        date: modal.date,
        mealType: modal.mealType,
        name: modal.name.trim(),
        emoji: modal.emoji,
        note: modal.note.trim() || undefined,
        source: 'manual',
      });
    }
    setModal(null);
  };

  const getSlotEntries = (date: string, mealType: MealType) =>
    entries.filter(e => e.date === date && e.mealType === mealType);

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#A09890', marginBottom: '12px', textAlign: 'center' }}>
        📅 {formatWeekRange()}
      </p>

      {weekDays.map((date, i) => {
        const isToday = date === todayStr;
        const isExpanded = activeDay === date;
        const dayEntries = entries.filter(e => e.date === date);

        return (
          <div key={date} style={{ marginBottom: '8px' }}>
            {/* 日付ヘッダー */}
            <button
              onClick={() => setActiveDay(isExpanded ? '' : date)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: isToday ? '#FFF0EC' : '#fff',
                borderRadius: isExpanded ? '14px 14px 0 0' : '14px',
                border: isToday ? '2px solid #F48A7A' : '1px solid #F0E8E4',
                borderBottom: isExpanded ? 'none' : undefined,
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: isExpanded ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: i === 5 ? '#2563EB' : i === 6 ? '#DC2626' : '#2F2F3A',
                minWidth: '60px',
              }}>
                {parseInt(date.slice(8))}日（{DAYS_JA[i]}）
              </span>
              {isToday && (
                <span style={{ fontSize: '10px', backgroundColor: '#F48A7A', color: '#fff', padding: '2px 6px', borderRadius: '8px', fontWeight: 700, flexShrink: 0 }}>今日</span>
              )}
              <div style={{ flex: 1, display: 'flex', gap: '6px', overflow: 'hidden' }}>
                {dayEntries.length > 0 ? dayEntries.slice(0, 2).map(e => (
                  <span key={e.id} style={{ fontSize: '12px', color: '#5A4A44', whiteSpace: 'nowrap' }}>
                    {e.emoji} {e.name}
                  </span>
                )) : (
                  <span style={{ fontSize: '12px', color: '#C0A898' }}>未登録</span>
                )}
                {dayEntries.length > 2 && (
                  <span style={{ fontSize: '11px', color: '#A09890' }}>+{dayEntries.length - 2}</span>
                )}
              </div>
              <span style={{ color: '#C0A898', fontSize: '11px', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
            </button>

            {/* 展開コンテンツ */}
            {isExpanded && (
              <div style={{
                backgroundColor: '#FFFAF7',
                borderRadius: '0 0 14px 14px',
                padding: '12px 14px',
                border: isToday ? '2px solid #F48A7A' : '1px solid #F0E8E4',
                borderTop: 'none',
              }}>
                {MEAL_TYPES.map(mt => {
                  const slotEntries = getSlotEntries(date, mt.id);
                  return (
                    <div key={mt.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#A09890', minWidth: '20px', paddingTop: '6px' }}>{mt.label}</span>
                      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        {slotEntries.map(entry => (
                          <div
                            key={entry.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#fff',
                              border: '1.5px solid #E8E0D8',
                              borderRadius: '10px',
                              padding: '5px 8px',
                            }}
                          >
                            <span style={{ fontSize: '14px' }}>{entry.emoji}</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#2F2F3A' }}>{entry.name}</span>
                            {entry.ingredients && entry.ingredients.length > 0 && (
                              <button
                                onClick={() => entry.ingredients?.forEach(ing => shopping.addByName(ing.name, ing.emoji, 'food'))}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '0 1px', lineHeight: 1 }}
                                title="材料を買い物リストへ"
                              >🛒</button>
                            )}
                            <button
                              onClick={() => openEdit(entry)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#A09890', padding: '0 1px', lineHeight: 1 }}
                            >✏️</button>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#C0A898', padding: '0 1px', lineHeight: 1 }}
                            >✕</button>
                          </div>
                        ))}
                        <button
                          onClick={() => openAdd(date, mt.id)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '2px',
                            fontSize: '12px', color: '#B0A098',
                            backgroundColor: '#F5F0EC', border: '1.5px dashed #D8D0C8',
                            borderRadius: '10px', padding: '5px 10px', cursor: 'pointer',
                          }}
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* 追加/編集モーダル */}
      {modal && (
        <>
          <div
            onClick={() => setModal(null)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100 }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: '#fff',
            borderRadius: '24px 24px 0 0',
            padding: '20px 16px 28px',
            zIndex: 101,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2F2F3A', margin: '0 0 14px' }}>
              {modal.editId ? '献立を編集' : `${DAYS_JA[weekDays.indexOf(modal.date)]}曜日・${MEAL_TYPES.find(m => m.id === modal.mealType)?.label}ごはん`}
            </h3>

            {/* 絵文字クイック選択 */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {QUICK_EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setModal(m => m ? { ...m, emoji: e } : m)}
                  style={{
                    fontSize: '22px', width: '40px', height: '40px',
                    borderRadius: '10px',
                    border: modal.emoji === e ? '2.5px solid #F48A7A' : '2.5px solid transparent',
                    backgroundColor: modal.emoji === e ? '#FFF0EC' : '#F5F0EC',
                    cursor: 'pointer', lineHeight: 1,
                  }}
                >{e}</button>
              ))}
            </div>

            {/* 料理名 */}
            <input
              type="text"
              placeholder="料理名を入力"
              value={modal.name}
              onChange={e => setModal(m => m ? { ...m, name: e.target.value } : m)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1.5px solid #E8E0D8', fontSize: '15px',
                backgroundColor: '#FFFAF7', outline: 'none',
                marginBottom: '10px', boxSizing: 'border-box',
              }}
              autoFocus
            />

            {/* メモ */}
            <input
              type="text"
              placeholder="メモ（任意）"
              value={modal.note}
              onChange={e => setModal(m => m ? { ...m, note: e.target.value } : m)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '12px',
                border: '1.5px solid #E8E0D8', fontSize: '13px',
                backgroundColor: '#FFFAF7', outline: 'none',
                marginBottom: '16px', boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              {modal.editId && (
                <button
                  onClick={() => { deleteEntry(modal.editId!); setModal(null); }}
                  style={{ padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer', backgroundColor: '#FFF0EC', color: '#D04030', fontWeight: 600, fontSize: '13px' }}
                >削除</button>
              )}
              <button
                onClick={() => setModal(null)}
                style={{ flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: '#F0E8E4', color: '#8C7068', fontWeight: 600, fontSize: '15px' }}
              >キャンセル</button>
              <button
                onClick={handleSave}
                disabled={!modal.name.trim()}
                style={{
                  flex: 2, minHeight: '48px', borderRadius: '14px', border: 'none',
                  cursor: modal.name.trim() ? 'pointer' : 'default',
                  backgroundColor: modal.name.trim() ? '#F48A7A' : '#E0D4CE',
                  color: '#fff', fontWeight: 700, fontSize: '15px',
                }}
                className="active:scale-95"
              >保存</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
