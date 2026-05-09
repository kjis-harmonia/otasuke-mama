import { useState } from 'react';
import type { UseFriendRecipesReturn } from '../hooks/useFriendRecipes';
import type { UseMealPlanReturn } from '../hooks/useMealPlan';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { RecipeGenre, RecipeTag, SavedFriendRecipe, MealType } from '../types';
import { getCurrentWeekMonday } from '../utils/weekUtils';

const DAYS_JA = ['月', '火', '水', '木', '金', '土', '日'];
const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: '朝ごはん' },
  { id: 'lunch',     label: '昼ごはん' },
  { id: 'dinner',    label: '夜ごはん' },
];
const RECIPE_GENRES: RecipeGenre[] = ['主菜', '副菜', '汁物', '主食', '丼もの', '麺類', '作り置き', 'お弁当', 'おやつ'];

type FilterChip = 'all' | RecipeGenre | RecipeTag;

const FILTER_CHIPS: { id: FilterChip; label: string }[] = [
  { id: 'all',    label: 'すべて' },
  { id: '主菜',   label: '主菜' },
  { id: '副菜',   label: '副菜' },
  { id: '汁物',   label: '汁物' },
  { id: '主食',   label: '主食' },
  { id: '作り置き', label: '作り置き' },
  { id: '子どもOK', label: '子どもOK' },
  { id: '時短',   label: '時短' },
  { id: '節約',   label: '節約' },
  { id: '野菜たっぷり', label: '野菜たっぷり' },
  { id: '使い切り', label: '使い切り' },
];

const GENRE_BADGE_COLOR: Record<RecipeGenre, { bg: string; color: string }> = {
  '主菜':   { bg: '#FFE3D5', color: '#B85A28' },
  '副菜':   { bg: '#E8F4E8', color: '#2D7A2D' },
  '汁物':   { bg: '#E3F0FF', color: '#1A507A' },
  '主食':   { bg: '#FFF9E3', color: '#8A6A00' },
  '丼もの': { bg: '#FFF0EC', color: '#D04030' },
  '麺類':   { bg: '#F0E8FF', color: '#7C5FB5' },
  '作り置き': { bg: '#E8FAFF', color: '#1A7A8A' },
  'お弁当': { bg: '#FFE8F8', color: '#A0408A' },
  'おやつ': { bg: '#F5F0FF', color: '#6040A0' },
};

interface AddModal {
  recipeId: string;
  recipeName: string;
  recipeEmoji: string;
  selectedDate: string;
  selectedMealType: MealType;
}

interface Props {
  friendRecipes: UseFriendRecipesReturn;
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

function RecipeCard({
  recipe,
  onAddToMealPlan,
  onAddToShopping,
  onDelete,
}: {
  recipe: SavedFriendRecipe;
  onAddToMealPlan: () => void;
  onAddToShopping: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const badge = GENRE_BADGE_COLOR[recipe.genre] ?? { bg: '#F0E8E4', color: '#8C7068' };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <button
        style={{ width: '100%', padding: '14px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '32px', lineHeight: 1, flexShrink: 0 }}>{recipe.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, color: '#2F2F3A', fontSize: '15px' }}>{recipe.title}</span>
              <span style={{ fontSize: '11px', backgroundColor: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
                {recipe.genre}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#A09890', margin: '0 0 4px' }}>
              👩 {recipe.sourcePrefectureLabel}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {recipe.tags.map(tag => (
                <span key={tag} style={{ fontSize: '11px', backgroundColor: '#F5F0EC', color: '#8C7068', padding: '2px 8px', borderRadius: '8px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span style={{ color: '#C0A898', fontSize: '12px', flexShrink: 0 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid #F0E8E4' }}>
          <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {recipe.comment && (
              <div style={{ backgroundColor: '#FFF8F1', borderRadius: '10px', padding: '8px 12px', border: '1px solid #FFE3D5' }}>
                <p style={{ fontSize: '12px', color: '#B85A28', fontWeight: 600, margin: '0 0 2px' }}>💬 ひとこと</p>
                <p style={{ fontSize: '13px', color: '#2F2F3A', margin: 0 }}>{recipe.comment}</p>
              </div>
            )}

            {recipe.ingredients.length > 0 && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', margin: '0 0 6px' }}>材料</p>
                <div style={{ backgroundColor: '#FFFAF7', borderRadius: '10px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#2F2F3A' }}>
                      <span>{ing.emoji} {ing.name}</span>
                      {ing.amountLabel && <span style={{ color: '#8C7068' }}>{ing.amountLabel}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recipe.seasonings && recipe.seasonings.length > 0 && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', margin: '0 0 6px' }}>調味料</p>
                <div style={{ backgroundColor: '#FFFAF7', borderRadius: '10px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {recipe.seasonings.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#2F2F3A' }}>
                      <span>{s.name}</span>
                      <span style={{ color: '#8C7068' }}>{s.amountLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recipe.steps && recipe.steps.length > 0 && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', margin: '0 0 6px' }}>作り方</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {recipe.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#2F2F3A' }}>
                      <span style={{ flexShrink: 0, width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#F48A7A', color: '#fff', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i + 1}
                      </span>
                      <span style={{ lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
              <button
                onClick={onAddToMealPlan}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', backgroundColor: '#FFF0EC', color: '#F48A7A', fontWeight: 700, fontSize: '12px' }}
                className="active:scale-95"
              >📅 献立に追加</button>
              <button
                onClick={onAddToShopping}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', backgroundColor: '#E8F4FF', color: '#1A507A', fontWeight: 700, fontSize: '12px' }}
                className="active:scale-95"
              >🛒 買い物へ</button>
            </div>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #F0E8E4', backgroundColor: '#fff', fontSize: '12px', color: '#C0A898', cursor: 'pointer' }}
              >🗑️ 削除</button>
            ) : (
              <div style={{ backgroundColor: '#FFF0EC', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#B85A28', margin: '0 0 8px' }}>削除しますか？</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={onDelete} style={{ flex: 1, padding: '8px', borderRadius: '8px', backgroundColor: '#F48A7A', color: '#fff', border: 'none', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>削除する</button>
                  <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', backgroundColor: '#F0E8E4', color: '#5A4A44', border: 'none', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>キャンセル</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FriendRecipesTab({ friendRecipes, mealPlan, shopping }: Props) {
  const todayStr = getTodayStr();
  const weekDays = getWeekDays();
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all');
  const [addModal, setAddModal] = useState<AddModal | null>(null);

  const filtered = friendRecipes.friendRecipes.filter(r => {
    if (activeFilter === 'all') return true;
    if (RECIPE_GENRES.includes(activeFilter as RecipeGenre)) return r.genre === activeFilter;
    return r.tags.includes(activeFilter as RecipeTag);
  });

  const handleAddToShopping = (recipe: SavedFriendRecipe) => {
    recipe.ingredients.forEach(ing => shopping.addByName(ing.name, ing.emoji, 'food'));
  };

  const handleConfirmAdd = () => {
    if (!addModal) return;
    mealPlan.addEntry({
      date: addModal.selectedDate,
      mealType: addModal.selectedMealType,
      name: addModal.recipeName,
      emoji: addModal.recipeEmoji,
      source: 'mamunity',
      recipeSource: 'friend',
      recipeId: addModal.recipeId,
    });
    setAddModal(null);
  };

  return (
    <div>
      {/* フィルターチップ */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '12px', scrollbarWidth: 'none' }}>
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: '20px',
              fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
              backgroundColor: activeFilter === chip.id ? '#F48A7A' : '#F0E8E4',
              color: activeFilter === chip.id ? '#fff' : '#8C7068',
            }}
          >{chip.label}</button>
        ))}
      </div>

      {friendRecipes.friendRecipes.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px 16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <p style={{ fontSize: '28px', marginBottom: '8px' }}>👩‍🍳</p>
          <p style={{ color: '#A09890', fontSize: '14px' }}>まだ保存したレシピがありません</p>
          <p style={{ fontSize: '12px', color: '#C0A898', marginTop: '4px' }}>ママニティから「ママ友レシピに保存」してみましょう</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <p style={{ color: '#A09890', fontSize: '13px' }}>このカテゴリのレシピはありません</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onAddToMealPlan={() => setAddModal({
                recipeId: recipe.id,
                recipeName: recipe.title,
                recipeEmoji: recipe.emoji,
                selectedDate: todayStr,
                selectedMealType: 'dinner',
              })}
              onAddToShopping={() => handleAddToShopping(recipe)}
              onDelete={() => friendRecipes.deleteRecipe(recipe.id)}
            />
          ))}
        </div>
      )}

      {/* 献立追加モーダル */}
      {addModal && (
        <>
          <div onClick={() => setAddModal(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderRadius: '24px 24px 0 0', padding: '20px 16px 28px', zIndex: 101, boxShadow: '0 -4px 24px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2F2F3A', margin: '0 0 4px' }}>
              {addModal.recipeEmoji} {addModal.recipeName}
            </h3>
            <p style={{ fontSize: '13px', color: '#A09890', margin: '0 0 16px' }}>献立に追加する日時を選択</p>

            <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', margin: '0 0 8px' }}>日付</p>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
              {weekDays.map((date, i) => (
                <button key={date} onClick={() => setAddModal(m => m ? { ...m, selectedDate: date } : m)}
                  style={{ flexShrink: 0, padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
                    backgroundColor: addModal.selectedDate === date ? '#F48A7A' : date === todayStr ? '#FFF0EC' : '#F5F0EC',
                    color: addModal.selectedDate === date ? '#fff' : date === todayStr ? '#F48A7A' : '#8C7068' }}>
                  {parseInt(date.slice(8))}日({DAYS_JA[i]})
                </button>
              ))}
            </div>

            <p style={{ fontSize: '12px', fontWeight: 700, color: '#A09890', margin: '0 0 8px' }}>時間帯</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {MEAL_TYPES.map(mt => (
                <button key={mt.id} onClick={() => setAddModal(m => m ? { ...m, selectedMealType: mt.id } : m)}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                    backgroundColor: addModal.selectedMealType === mt.id ? '#F48A7A' : '#F5F0EC',
                    color: addModal.selectedMealType === mt.id ? '#fff' : '#8C7068' }}>
                  {mt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setAddModal(null)} style={{ flex: 1, minHeight: '48px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: '#F0E8E4', color: '#8C7068', fontWeight: 600, fontSize: '15px' }}>キャンセル</button>
              <button onClick={handleConfirmAdd} style={{ flex: 2, minHeight: '48px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: '#F48A7A', color: '#fff', fontWeight: 700, fontSize: '15px' }} className="active:scale-95">献立に追加する</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
