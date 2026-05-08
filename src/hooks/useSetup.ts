import { useLocalStorage } from './useLocalStorage';
import type { SetupState, DataMode } from '../types';

const SETUP_KEY = 'otasuke_setup_v2';

// モジュールロード時に1度だけ判定（既存ユーザーはセットアップをスキップ）
const IS_EXISTING_USER: boolean = (() => {
  try {
    return typeof window !== 'undefined'
      && window.localStorage.getItem('otasuke_stock_v2') !== null;
  } catch {
    return false;
  }
})();

const defaultSetupState: SetupState = {
  isComplete: IS_EXISTING_USER,
  dataMode: 'demo',
};

export function useSetup() {
  const [state, setState] = useLocalStorage<SetupState>(SETUP_KEY, defaultSetupState);

  /** セットアップ完了（SetupPage から呼ぶ） */
  const completeSetup = (dataMode: DataMode) => {
    setState({ isComplete: true, dataMode });
  };

  /** 設定画面の「セットアップをやり直す」用 */
  const resetSetup = () => {
    setState({ isComplete: false, dataMode: 'demo' });
  };

  return {
    isSetupComplete: state.isComplete,
    dataMode: state.dataMode,
    completeSetup,
    resetSetup,
  };
}

export type UseSetupReturn = ReturnType<typeof useSetup>;
