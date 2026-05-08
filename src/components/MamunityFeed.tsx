import { useState } from 'react';
import { mamunityPosts } from '../data/mamunityPosts';
import type { UseMealPlanReturn } from '../hooks/useMealPlan';
import type { MealType } from '../types';
import { getCurrentWeekMonday } from '../utils/weekUtils';

const DAYS_JA = ['月', '火', '水', '木', '金', '土', '日'];
const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: '朝ごはん' },
  { id: 'lunch',     label: '昼ごはん' },
  { id: 'dinner',    label: '夜ごはん' },
];

interface AddModal {
  postId: string;
  dishName: string;
  dishEmoji: string;
  selectedDate: string;
  selectedMealType: MealType;
}

interface Props {
  mealPlan: UseMealPlanReturn;
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

export default function MamunityFeed({ mealPlan }: Props) {
  const todayStr = getTodayStr();
  const weekDays = getWeekDays();
  const [addModal, setAddModal] = useState<AddModal | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const openAddModal = (post: typeof mamunityPosts[0]) => {
    setAddModal({
      postId: post.id,
      dishName: post.dishName,
      dishEmoji: post.dishEmoji,
      selectedDate: todayStr,
      selectedMealType: 'dinner',
    });
  };

  const handleAdd = () => {
    if (!addModal) return;
    mealPlan.addEntry({
      date: addModal.selectedDate,
      mealType: addModal.selectedMealType,
      name: addModal.dishName,
      emoji: addModal.dishEmoji,
      source: 'mamunity',
    });
    setAddedIds(prev => new Set([...prev, addModal.postId]));
    setAddModal(null);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#FFF0EC', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px' }}>
        <p style={{ fontSize: '12px', color: '#B85A28', fontWeight: 600, margin: 0 }}>
          👥 全国のママたちの献立アイデアを参考にしよう！
        </p>
        <p style={{ fontSize: '11px', color: '#C0A898', margin: '3px 0 0' }}>
          ※ これはサンプルデータです
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {mamunityPosts.map(post => {
          const isAdded = addedIds.has(post.id);
          return (
            <div key={post.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              {/* ヘッダー */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '20px', width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#FFF0EC', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>{post.avatar}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#2F2F3A', margin: 0 }}>{post.author}</p>
                  <p style={{ fontSize: '11px', color: '#C0A898', margin: 0 }}>{post.postedAt}</p>
                </div>
                <span style={{ fontSize: '32px', lineHeight: 1 }}>{post.dishEmoji}</span>
              </div>

              {/* 料理名 */}
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#2F2F3A', margin: '0 0 6px' }}>{post.dishName}</p>

              {/* 本文 */}
              <p style={{ fontSize: '13px', color: '#5A4A44', margin: '0 0 8px', lineHeight: 1.6 }}>{post.text}</p>

              {/* タグ */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '11px', color: '#A09890', backgroundColor: '#F5F0EC', padding: '2px 8px', borderRadius: '8px' }}>{tag}</span>
                ))}
              </div>

              {/* フッター */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#C0A898' }}>♥ {post.likes}</span>
                <button
                  onClick={() => !isAdded && openAddModal(post)}
                  style={{
                    fontSize: '12px', fontWeight: 700, padding: '8px 14px',
                    borderRadius: '12px', border: 'none',
                    cursor: isAdded ? 'default' : 'pointer',
                    backgroundColor: isAdded ? '#E8F8F0' : '#FFF0EC',
                    color: isAdded ? '#1A8A56' : '#F48A7A',
                  }}
                  className={isAdded ? '' : 'active:scale-95'}
                >
                  {isAdded ? '✓ 追加済み' : '📅 献立に追加'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 日付・時間帯選択モーダル */}
      {addModal && (
        <>
          <div
            onClick={() => setAddModal(null)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100 }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: '#fff', borderRadius: '24px 24px 0 0',
            padding: '20px 16px 28px', zIndex: 101,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2F2F3A', margin: '0 0 4px' }}>
              {addModal.dishEmoji} {addModal.dishName}
            </h3>
            <p style={{ fontSize: '13px', color: '#A09890', margin: '0 0 16px' }}>献立に追加する日時を選択</p>

            {/* 日付選択 */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', margin: '0 0 8px' }}>日付</p>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
              {weekDays.map((date, i) => {
                const isToday = date === todayStr;
                const isSelected = addModal.selectedDate === date;
                return (
                  <button
                    key={date}
                    onClick={() => setAddModal(m => m ? { ...m, selectedDate: date } : m)}
                    style={{
                      flexShrink: 0, padding: '6px 12px', borderRadius: '12px',
                      fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
                      backgroundColor: isSelected ? '#F48A7A' : isToday ? '#FFF0EC' : '#F5F0EC',
                      color: isSelected ? '#fff' : isToday ? '#F48A7A' : '#8C7068',
                    }}
                  >
                    {parseInt(date.slice(8))}日({DAYS_JA[i]})
                  </button>
                );
              })}
            </div>

            {/* 時間帯選択 */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', margin: '0 0 8px' }}>時間帯</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {MEAL_TYPES.map(mt => (
                <button
                  key={mt.id}
                  onClick={() => setAddModal(m => m ? { ...m, selectedMealType: mt.id } : m)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px',
                    fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                    backgroundColor: addModal.selectedMealType === mt.id ? '#F48A7A' : '#F5F0EC',
                    color: addModal.selectedMealType === mt.id ? '#fff' : '#8C7068',
                  }}
                >{mt.label}</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setAddModal(null)}
                style={{ flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: '#F0E8E4', color: '#8C7068', fontWeight: 600, fontSize: '15px' }}
              >キャンセル</button>
              <button
                onClick={handleAdd}
                style={{ flex: 2, minHeight: '48px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: '#F48A7A', color: '#fff', fontWeight: 700, fontSize: '15px' }}
                className="active:scale-95"
              >献立に追加する</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
