import { useLocalStorage } from './useLocalStorage';

const GUIDE_KEY = 'otasuke_guide_v1';

export type TabGuideKey = 'inventory' | 'shopping' | 'budget' | 'recipes';

interface GuideState {
  tourSeen: boolean;
  tabsSeen: Partial<Record<TabGuideKey, boolean>>;
}

const DEFAULT: GuideState = { tourSeen: false, tabsSeen: {} };

// 直接 localStorage を読む（React state 非依存）
// useState 初期化子の中で安全に呼べる
export function isTabGuideSeen(tab: TabGuideKey): boolean {
  try {
    const raw = localStorage.getItem(GUIDE_KEY);
    if (!raw) return false;
    return !!((JSON.parse(raw) as GuideState).tabsSeen?.[tab]);
  } catch {
    return false;
  }
}

export function markTabGuideSeen(tab: TabGuideKey): void {
  try {
    const raw = localStorage.getItem(GUIDE_KEY);
    const s: GuideState = raw ? JSON.parse(raw) : DEFAULT;
    localStorage.setItem(GUIDE_KEY, JSON.stringify({
      ...s,
      tabsSeen: { ...s.tabsSeen, [tab]: true },
    }));
  } catch {}
}

export function useGuide() {
  const [state, setState] = useLocalStorage<GuideState>(GUIDE_KEY, DEFAULT);

  const markTourSeen = () => setState(s => ({ ...s, tourSeen: true }));
  const resetTabGuides = () => setState(s => ({ ...s, tabsSeen: {} }));

  return {
    isTourSeen: state.tourSeen,
    markTourSeen,
    resetTabGuides,
  };
}
