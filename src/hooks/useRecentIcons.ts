import { useLocalStorage } from './useLocalStorage';

const RECENT_KEY = 'otasuke_recent_icons_v1';
const MAX_RECENT = 16;

export interface RecentIcon {
  emoji: string;
  customIconData?: string;
  iconShape: 'circle' | 'square';
}

export function useRecentIcons() {
  const [recent, setRecent] = useLocalStorage<RecentIcon[]>(RECENT_KEY, []);

  const addRecentIcon = (icon: RecentIcon) => {
    setRecent(prev => {
      const filtered = prev.filter(r =>
        !(r.emoji === icon.emoji && r.customIconData === icon.customIconData)
      );
      return [icon, ...filtered].slice(0, MAX_RECENT);
    });
  };

  return { recentIcons: recent, addRecentIcon };
}
