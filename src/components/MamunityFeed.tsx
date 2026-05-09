import { useState } from 'react';
import { mamunityPosts } from '../data/mamunityPosts';
import type { UseMealPlanReturn } from '../hooks/useMealPlan';
import type { UseFriendRecipesReturn } from '../hooks/useFriendRecipes';
import type { UseShoppingListReturn } from '../hooks/useShoppingList';
import type { MealType, RecipeGenre, RecipeTag, MamunityPost } from '../types';
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
  { id: '子どもOK', label: '子どもOK' },
  { id: '時短',   label: '時短' },
  { id: '節約',   label: '節約' },
  { id: '使い切り', label: '使い切り' },
  { id: '作り置き', label: '作り置き' },
  { id: '野菜たっぷり', label: '野菜たっぷり' },
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
  friendRecipes: UseFriendRecipesReturn;
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

function PostCard({
  post,
  isSaved,
  isAddedToMealPlan,
  onOpenAddModal,
  onSaveRecipe,
  onAddToShopping,
}: {
  post: MamunityPost;
  isSaved: boolean;
  isAddedToMealPlan: boolean;
  onOpenAddModal: () => void;
  onSaveRecipe: () => void;
  onAddToShopping: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      {/* ヘッダー */}
      <div style={{ padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '20px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {post.avatar}
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#2F2F3A', margin: 0 }}>{post.author}</p>
            <p style={{ fontSize: '11px', color: '#C0A898', margin: 0 }}>{post.postedAt}</p>
          </div>
          <span style={{ fontSize: '30px', lineHeight: 1 }}>{post.dishEmoji}</span>
        </div>

        <p style={{ fontSize: '15px', fontWeight: 700, color: '#2F2F3A', margin: '0 0 4px' }}>{post.dishName}</p>
        <p style={{ fontSize: '13px', color: '#5A4A44', margin: '0 0 8px', lineHeight: 1.6 }}>{post.text}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ fontSize: '11px', color: '#A09890', backgroundColor: '#F5F0EC', padding: '2px 8px', borderRadius: '8px' }}>
              {tag}
            </span>
          ))}
        </div>

        {post.ingredients && post.ingredients.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ fontSize: '12px', color: '#A09890', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>🥕 材料を{expanded ? '隠す' : '見る'}</span>
            <span>{expanded ? '▲' : '▼'}</span>
          </button>
        )}

        {expanded && post.ingredients && (
          <div style={{ backgroundColor: '#FFFAF7', borderRadius: '10px', padding: '8px 12px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {post.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#2F2F3A' }}>
                <span>{ing.emoji} {ing.name}</span>
                {ing.amountLabel && <span style={{ color: '#8C7068' }}>{ing.amountLabel}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* アクションフッター */}
      <div style={{ borderTop: '1px solid #F5F0EC', padding: '10px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#C0A898', marginRight: 'auto' }}>♥ {post.likes}</span>
        <button
          onClick={onAddToShopping}
          style={{ fontSize: '11px', fontWeight: 600, padding: '7px 10px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: '#E8F4FF', color: '#1A507A' }}
          className="active:scale-95"
        >🛒 買い物へ</button>
        <button
          onClick={isSaved ? undefined : onSaveRecipe}
          style={{ fontSize: '11px', fontWeight: 600, padding: '7px 10px', borderRadius: '10px', border: 'none', cursor: isSaved ? 'default' : 'pointer', backgroundColor: isSaved ? '#E8F8F0' : '#EDE8FA', color: isSaved ? '#1A8A56' : '#7C5FB5' }}
          className={isSaved ? '' : 'active:scale-95'}
        >{isSaved ? '✓ 保存済み' : '💾 保存'}</button>
        <button
          onClick={isAddedToMealPlan ? undefined : onOpenAddModal}
          style={{ fontSize: '11px', fontWeight: 700, padding: '7px 10px', borderRadius: '10px', border: 'none', cursor: isAddedToMealPlan ? 'default' : 'pointer', backgroundColor: isAddedToMealPlan ? '#E8F8F0' : '#FFF0EC', color: isAddedToMealPlan ? '#1A8A56' : '#F48A7A' }}
          className={isAddedToMealPlan ? '' : 'active:scale-95'}
        >{isAddedToMealPlan ? '✓ 献立済み' : '📅 献立に追加'}</button>
      </div>
    </div>
  );
}

export default function MamunityFeed({ mealPlan, friendRecipes, shopping }: Props) {
  const todayStr = getTodayStr();
  const weekDays = getWeekDays();
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all');
  const [addModal, setAddModal] = useState<AddModal | null>(null);
  const [addedToMealPlanIds, setAddedToMealPlanIds] = useState<Set<string>>(new Set());

  const filteredPosts = mamunityPosts.filter(post => {
    if (activeFilter === 'all') return true;
    if (RECIPE_GENRES.includes(activeFilter as RecipeGenre)) return post.genre === activeFilter;
    return post.tags.includes(activeFilter as RecipeTag);
  });

  const handleSaveRecipe = (post: MamunityPost) => {
    friendRecipes.saveRecipe({
      sourcePostId: post.id,
      sourceType: 'mamunity',
      sourcePrefectureLabel: post.author,
      title: post.dishName,
      emoji: post.dishEmoji,
      genre: post.genre,
      tags: post.tags,
      ingredients: post.ingredients ?? [],
      seasonings: post.seasonings,
      steps: post.steps,
    });
  };

  const handleAddToShopping = (post: MamunityPost) => {
    post.ingredients?.forEach(ing => shopping.addByName(ing.name, ing.emoji, 'food'));
  };

  const handleConfirmAdd = () => {
    if (!addModal) return;
    const post = mamunityPosts.find(p => p.id === addModal.postId);
    if (!post) return;

    // ママ友レシピに自動保存（重複なし）
    const recipeId = friendRecipes.saveRecipe({
      sourcePostId: post.id,
      sourceType: 'mamunity',
      sourcePrefectureLabel: post.author,
      title: post.dishName,
      emoji: post.dishEmoji,
      genre: post.genre,
      tags: post.tags,
      ingredients: post.ingredients ?? [],
      seasonings: post.seasonings,
      steps: post.steps,
    });

    mealPlan.addEntry({
      date: addModal.selectedDate,
      mealType: addModal.selectedMealType,
      name: addModal.dishName,
      emoji: addModal.dishEmoji,
      source: 'mamunity',
      recipeSource: 'friend',
      recipeId,
    });

    setAddedToMealPlanIds(prev => new Set([...prev, addModal.postId]));
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

      <div style={{ backgroundColor: '#FFF0EC', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px' }}>
        <p style={{ fontSize: '12px', color: '#B85A28', fontWeight: 600, margin: 0 }}>
          👥 全国のママたちの献立アイデアを参考にしよう！
        </p>
        <p style={{ fontSize: '11px', color: '#C0A898', margin: '3px 0 0' }}>
          ※ これはサンプルデータです
        </p>
      </div>

      {filteredPosts.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px 16px', textAlign: 'center' }}>
          <p style={{ color: '#A09890', fontSize: '13px' }}>このカテゴリの投稿はありません</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              isSaved={friendRecipes.isSaved(post.id)}
              isAddedToMealPlan={addedToMealPlanIds.has(post.id)}
              onOpenAddModal={() => setAddModal({
                postId: post.id,
                dishName: post.dishName,
                dishEmoji: post.dishEmoji,
                selectedDate: todayStr,
                selectedMealType: 'dinner',
              })}
              onSaveRecipe={() => handleSaveRecipe(post)}
              onAddToShopping={() => handleAddToShopping(post)}
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
              {addModal.dishEmoji} {addModal.dishName}
            </h3>
            <p style={{ fontSize: '13px', color: '#A09890', margin: '0 0 16px' }}>献立に追加する日時を選択（レシピも自動保存）</p>

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
