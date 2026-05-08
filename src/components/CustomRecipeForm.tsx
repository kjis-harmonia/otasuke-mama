import { useState } from 'react';
import type { Recipe, CustomIngredient, CustomSeasoning } from '../types';
import { masterItems } from '../data/masterItems';
import { QUANTITY_GROUPS } from '../data/quantityOptions';
import type { CustomRecipeInput } from '../hooks/useCustomRecipes';

interface Props {
  onSave: (recipe: CustomRecipeInput) => void;
  onClose: () => void;
}

const CATEGORIES = ['ご飯もの', '麺', '肉料理', '魚料理', '野菜', '汁物', '副菜', '子ども向け', '節約'];
const TIME_PRESETS = [10, 15, 20, 30, 40, 60];
const DIFFICULTIES: Recipe['difficulty'][] = ['簡単', '普通', '少し手間'];
const EMOJI_SUGGESTIONS = ['🍚', '🍜', '🍳', '🥘', '🍲', '🥗', '🍱', '🍗', '🥩', '🐟', '🫘', '🥚', '🥬', '🧅', '🥔'];

const FOOD_ITEMS = masterItems.filter(m => m.category === 'food');
const FOOD_SUB_CATS = [...new Set(FOOD_ITEMS.map(m => m.subCategory))];

// ── 材料行の下書き型 ─────────────────────────────────────────────
type IngredientDraft = {
  masterItemId?: string;
  name: string;
  amountLabel: string;
  fractionValue: number;
  unit: string;
  required: boolean;
  manual: boolean;
};

const DEFAULT_INGREDIENT: IngredientDraft = {
  name: '',
  amountLabel: '1個',
  fractionValue: 1,
  unit: '個',
  required: true,
  manual: false,
};

type SeasoningDraft = { name: string; amountLabel: string };

type FormState = {
  name: string;
  emoji: string;
  category: string;
  timeMinutes: number;
  difficulty: Recipe['difficulty'];
  isSavingsMenu: boolean;
  ingredients: IngredientDraft[];
  seasonings: SeasoningDraft[];
  stepsMemo: string;
  familyMemo: string;
};

const INITIAL_FORM: FormState = {
  name: '',
  emoji: '🍳',
  category: 'ご飯もの',
  timeMinutes: 20,
  difficulty: '簡単',
  isSavingsMenu: false,
  ingredients: [],
  seasonings: [],
  stepsMemo: '',
  familyMemo: '',
};

// ── 材料行コンポーネント ──────────────────────────────────────────
function IngredientRow({
  ingredient,
  onChange,
  onRemove,
}: {
  ingredient: IngredientDraft;
  onChange: (u: IngredientDraft) => void;
  onRemove: () => void;
}) {
  const handleMasterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === '__manual__') {
      onChange({ ...ingredient, masterItemId: undefined, manual: true, name: '' });
    } else if (id === '') {
      onChange({ ...ingredient, masterItemId: undefined, name: '' });
    } else {
      const m = FOOD_ITEMS.find(x => x.id === id);
      if (m) onChange({ ...ingredient, masterItemId: id, name: m.name, manual: false });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parts = e.target.value.split('|||');
    onChange({
      ...ingredient,
      amountLabel: parts[0],
      fractionValue: parseFloat(parts[1]),
      unit: parts[2],
    });
  };

  const amountValue = `${ingredient.amountLabel}|||${ingredient.fractionValue}|||${ingredient.unit}`;

  const rowStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '10px 12px',
    border: '1.5px solid #F0E8E4',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const selectStyle: React.CSSProperties = {
    flex: 1,
    border: '1.5px solid #EDD5C8',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '14px',
    color: '#2F2F3A',
    backgroundColor: '#fff',
    outline: 'none',
  };

  return (
    <div style={rowStyle}>
      {/* 行1: 食材名 */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {ingredient.manual ? (
          <input
            style={{ ...selectStyle, flex: 1 }}
            placeholder="食材名を入力（例：長ねぎ）"
            value={ingredient.name}
            onChange={e => onChange({ ...ingredient, name: e.target.value })}
          />
        ) : (
          <select style={selectStyle} value={ingredient.masterItemId ?? ''} onChange={handleMasterChange}>
            <option value="">食材を選ぶ…</option>
            <option value="__manual__">── 手入力する ──</option>
            {FOOD_SUB_CATS.map(sub => (
              <optgroup key={sub} label={sub}>
                {FOOD_ITEMS.filter(m => m.subCategory === sub).map(m => (
                  <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
        <button
          onClick={onRemove}
          style={{ color: '#C0A898', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0 4px', lineHeight: 1, flexShrink: 0 }}
        >
          ✕
        </button>
      </div>

      {/* 行2: 使用量 + 必須切替 */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {ingredient.manual && (
          <button
            onClick={() => onChange({ ...ingredient, manual: false, masterItemId: undefined })}
            style={{ fontSize: '11px', color: '#A8CFF0', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            リストから選ぶ
          </button>
        )}
        <select style={{ ...selectStyle, flex: 1, fontSize: '13px' }} value={amountValue} onChange={handleAmountChange}>
          {QUANTITY_GROUPS.map(group => (
            <optgroup key={group.groupLabel} label={group.groupLabel}>
              {group.options.map(opt => (
                <option key={`${opt.label}-${opt.fractionValue}`} value={`${opt.label}|||${opt.fractionValue}|||${opt.unit}`}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button
          onClick={() => onChange({ ...ingredient, required: !ingredient.required })}
          style={{
            flexShrink: 0,
            padding: '8px 10px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: ingredient.required ? '#FFE3D5' : '#F0E8E4',
            color: ingredient.required ? '#B85A28' : '#A09890',
          }}
        >
          {ingredient.required ? '必須' : '任意'}
        </button>
      </div>
    </div>
  );
}

// ── メインフォーム ────────────────────────────────────────────────
export default function CustomRecipeForm({ onSave, onClose }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [showDetails, setShowDetails] = useState(false);
  const [nameError, setNameError] = useState(false);

  const update = (patch: Partial<FormState>) => setForm(prev => ({ ...prev, ...patch }));

  const addIngredient = () =>
    update({ ingredients: [...form.ingredients, { ...DEFAULT_INGREDIENT }] });

  const updateIngredient = (i: number, u: IngredientDraft) =>
    update({ ingredients: form.ingredients.map((x, idx) => idx === i ? u : x) });

  const removeIngredient = (i: number) =>
    update({ ingredients: form.ingredients.filter((_, idx) => idx !== i) });

  const addSeasoning = () =>
    update({ seasonings: [...form.seasonings, { name: '', amountLabel: '大さじ1' }] });

  const updateSeasoning = (i: number, s: SeasoningDraft) =>
    update({ seasonings: form.seasonings.map((x, idx) => idx === i ? s : x) });

  const removeSeasoning = (i: number) =>
    update({ seasonings: form.seasonings.filter((_, idx) => idx !== i) });

  const handleSave = () => {
    if (!form.name.trim()) { setNameError(true); return; }
    setNameError(false);

    const ingredients: CustomIngredient[] = form.ingredients
      .filter(i => i.name.trim() || i.masterItemId)
      .map(i => ({
        masterItemId: i.masterItemId,
        name: i.masterItemId
          ? (FOOD_ITEMS.find(m => m.id === i.masterItemId)?.name ?? i.name)
          : i.name,
        amountLabel: i.amountLabel,
        fractionValue: i.fractionValue,
        unit: i.unit,
        required: i.required,
      }));

    const seasonings: CustomSeasoning[] = form.seasonings
      .filter(s => s.name.trim())
      .map(s => ({ name: s.name, amountLabel: s.amountLabel }));

    const ingredientsSimple = ingredients
      .map(i => `${i.name}：${i.amountLabel}${i.required ? '' : '（あれば）'}`)
      .join('\n') || '（材料未登録）';

    const seasoningSimple = seasonings
      .map(s => `${s.name}：${s.amountLabel}`)
      .join('\n') || '（調味料未登録）';

    onSave({
      name: form.name.trim(),
      emoji: form.emoji || '🍳',
      category: form.category,
      difficulty: form.difficulty,
      timeMinutes: form.timeMinutes,
      portionNote: '',
      ingredientsSimple,
      seasoningSimple,
      tips: form.stepsMemo || '',
      isSavingsMenu: form.isSavingsMenu,
      isCustomRecipe: true,
      ingredients,
      seasonings,
      familyMemo: form.familyMemo.trim() || undefined,
      stepsMemo: form.stepsMemo.trim() || undefined,
    });
  };

  // ── スタイルヘルパー ─────────────────────────────────────────────
  const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '13px',
    fontWeight: selected ? 700 : 500,
    cursor: 'pointer',
    backgroundColor: selected ? '#F48A7A' : '#F0E8E4',
    color: selected ? '#fff' : '#5A4A44',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #EDD5C8',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    backgroundColor: '#FFFAF7',
    outline: 'none',
    color: '#2F2F3A',
    boxSizing: 'border-box',
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#A09890',
    marginBottom: '12px',
  };

  const fieldLabel: React.CSSProperties = {
    fontSize: '13px',
    color: '#7A6860',
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      height: '100svh',
      backgroundColor: '#FFF8F1',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ヘッダー */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0E8E4', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#A09890', cursor: 'pointer', padding: '2px 6px', lineHeight: 1 }}>✕</button>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#2F2F3A', margin: 0 }}>いつもの味を登録しましょう</h2>
          <p style={{ fontSize: '12px', color: '#A09890', margin: '2px 0 0' }}>ざっくりでOK。あとから何度でも直せます</p>
        </div>
      </div>

      {/* スクロール本文 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

        {/* ── 基本情報 ── */}
        <section style={{ marginBottom: '24px' }}>
          <p style={sectionLabel}>📝 基本情報</p>

          {/* レシピ名 */}
          <div style={{ marginBottom: '14px' }}>
            <label style={fieldLabel}>レシピ名 <span style={{ color: '#F48A7A' }}>*</span></label>
            <input
              style={{ ...inputStyle, borderColor: nameError ? '#F48A7A' : '#EDD5C8' }}
              placeholder="例：ママのカレー、子ども向け肉じゃが"
              value={form.name}
              onChange={e => { update({ name: e.target.value }); setNameError(false); }}
            />
            {nameError && <p style={{ fontSize: '12px', color: '#F48A7A', marginTop: '4px' }}>レシピ名を入力してください</p>}
          </div>

          {/* 絵文字 */}
          <div style={{ marginBottom: '14px' }}>
            <label style={fieldLabel}>絵文字</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, width: '56px', flex: 'none', textAlign: 'center', fontSize: '22px', padding: '8px' }}
                value={form.emoji}
                onChange={e => update({ emoji: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {EMOJI_SUGGESTIONS.map(em => (
                  <button key={em} onClick={() => update({ emoji: em })}
                    style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 1 }}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* カテゴリ */}
          <div style={{ marginBottom: '14px' }}>
            <label style={fieldLabel}>カテゴリ</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} style={chipStyle(form.category === cat)} onClick={() => update({ category: cat })}>{cat}</button>
              ))}
            </div>
          </div>

          {/* 調理時間 */}
          <div style={{ marginBottom: '14px' }}>
            <label style={fieldLabel}>調理時間</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TIME_PRESETS.map(t => (
                <button key={t} style={chipStyle(form.timeMinutes === t)} onClick={() => update({ timeMinutes: t })}>
                  {t === 60 ? '60分以上' : `${t}分`}
                </button>
              ))}
            </div>
          </div>

          {/* 難易度 */}
          <div>
            <label style={fieldLabel}>難易度</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {DIFFICULTIES.map(d => (
                <button key={d} style={chipStyle(form.difficulty === d)} onClick={() => update({ difficulty: d })}>{d}</button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 材料 ── */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ ...sectionLabel, margin: 0 }}>🥕 材料</p>
            <p style={{ fontSize: '11px', color: '#C0A898', margin: 0 }}>必須材料が揃うと「今作れる」に出ます</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            {form.ingredients.map((ing, i) => (
              <IngredientRow
                key={i}
                ingredient={ing}
                onChange={u => updateIngredient(i, u)}
                onRemove={() => removeIngredient(i)}
              />
            ))}
          </div>
          <button
            onClick={addIngredient}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1.5px dashed #EDD5C8',
              backgroundColor: '#FFFAF7',
              fontSize: '14px',
              color: '#B85A28',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ＋ 材料を追加
          </button>
        </section>

        {/* ── 詳細（折りたたみ） ── */}
        <section style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#F0E8E4',
              borderRadius: '12px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#8C7068',
              cursor: 'pointer',
              marginBottom: showDetails ? '16px' : '0',
            }}
          >
            {showDetails ? '▲ 詳細を閉じる' : '▼ 調味料・作り方メモ・家族メモを追加（任意）'}
          </button>

          {showDetails && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* 調味料 */}
              <div>
                <p style={sectionLabel}>🧂 調味料</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                  {form.seasonings.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder="例：しょうゆ"
                        value={s.name}
                        onChange={e => updateSeasoning(i, { ...s, name: e.target.value })}
                      />
                      <select
                        style={{ ...inputStyle, flex: 'none', width: '110px', padding: '10px 8px' }}
                        value={s.amountLabel}
                        onChange={e => updateSeasoning(i, { ...s, amountLabel: e.target.value })}
                      >
                        {(QUANTITY_GROUPS.find(g => g.groupLabel === '調味料')?.options ?? []).map(opt => (
                          <option key={opt.label} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                      <button onClick={() => removeSeasoning(i)}
                        style={{ color: '#C0A898', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '0 2px', lineHeight: 1 }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addSeasoning}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px dashed #EDD5C8', backgroundColor: '#FFFAF7', fontSize: '13px', color: '#B85A28', fontWeight: 600, cursor: 'pointer' }}>
                  ＋ 調味料を追加
                </button>
              </div>

              {/* 作り方メモ */}
              <div>
                <label style={fieldLabel}>📋 作り方メモ</label>
                <textarea
                  style={{ ...inputStyle, height: '100px', resize: 'vertical' } as React.CSSProperties}
                  placeholder="例：玉ねぎを炒めてから卵を加える。半熟で仕上げる。"
                  value={form.stepsMemo}
                  onChange={e => update({ stepsMemo: e.target.value })}
                />
              </div>

              {/* 家族メモ */}
              <div>
                <label style={fieldLabel}>💬 家族メモ</label>
                <input
                  style={inputStyle}
                  placeholder="例：子どもは甘め、旦那は肉多め"
                  value={form.familyMemo}
                  onChange={e => update({ familyMemo: e.target.value })}
                />
              </div>

              {/* 節約フラグ */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: form.isSavingsMenu ? '#FFFCE8' : '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
                border: `1.5px solid ${form.isSavingsMenu ? '#F0D060' : '#EDD5C8'}`,
              }}>
                <span style={{ fontSize: '22px' }}>💰</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2F2F3A', margin: 0 }}>節約メニュー</p>
                  <p style={{ fontSize: '11px', color: '#A09890', margin: '2px 0 0' }}>節約メニュータブに表示されます</p>
                </div>
                <button
                  onClick={() => update({ isSavingsMenu: !form.isSavingsMenu })}
                  style={{
                    width: '44px',
                    height: '26px',
                    borderRadius: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: form.isSavingsMenu ? '#F4D03F' : '#D0C8C4',
                    position: 'relative',
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    left: form.isSavingsMenu ? '21px' : '3px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                    transition: 'left 0.15s',
                  }} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* フッター：保存ボタン */}
      <div style={{ padding: '16px 20px 32px', borderTop: '1px solid #F0E8E4', backgroundColor: '#FFF8F1', flexShrink: 0 }}>
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            minHeight: '52px',
            backgroundColor: '#F48A7A',
            color: '#fff',
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
          }}
          className="active:scale-95 transition-transform"
        >
          ✓ このレシピを登録する
        </button>
      </div>
    </div>
  );
}
