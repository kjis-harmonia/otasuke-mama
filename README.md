# お助けママ

育児中のママ向け家庭管理アプリ。在庫管理・買い物リスト・献立提案・家計簿をひとつにまとめたオールインワンツール。

## 技術スタック

- React 18 + Vite + TypeScript
- Tailwind CSS v3
- localStorage（端末内完結・外部サーバー不要）

## バージョン履歴

| バージョン | 主な変更 |
|-----------|----------|
| v0.6.0 | 今日やることカード・よく買うものセット・わが家のレシピ帳・通知設定UI |
| v0.5.0 | 初回ガイドモーダル・各タブMiniGuide |
| v0.4.0 | 在庫管理・冷凍アイテム・うちレシピ登録 |

## ローカル起動

```bash
npm install
npm run dev
```

## iOS アプリ化に向けた設計メモ

### 通知機能

`src/hooks/useNotificationPrefs.ts` で設定値を localStorage に保存済み（キー: `otasuke_notification_prefs_v1`）。

iOS/Android ネイティブ化時は以下を実装予定:

| 設定フラグ | 通知タイミング | 実装方法（予定） |
|-----------|--------------|-----------------|
| `expiryAlert` | 賞味期限 `expiryDaysBefore` 日前 | `UNUserNotificationCenter` で毎朝 8:00 に在庫をスキャン |
| `shoppingReminder` | 買い物リストがある日の午前 9:00 | `BGAppRefreshTask` + ローカル通知 |
| `weeklyBudgetReview` | 毎週月曜 7:00 | 曜日指定の `UNCalendarNotificationTrigger` |
| `recipeReminder` | 毎日 17:00 | `UNTimeIntervalNotificationTrigger` |

> 通知権限リクエストは初回起動セットアップの最後のステップで行う予定。

### Capacitor / PWA 移行

- `public/manifest.json` と `public/service-worker.js` を追加するだけで PWA 化可能
- Capacitor を使う場合は `@capacitor/local-notifications` で上記通知をそのまま実装できる
- データは localStorage のため、Capacitor の `@capacitor/preferences` への差し替えのみで完結

### ストレージキー一覧

| キー | 用途 |
|------|------|
| `otasuke_stock_v2` | 在庫アイテム |
| `otasuke_frozen_v2` | 冷凍・作り置き |
| `otasuke_shopping_v2` | 買い物リスト |
| `otasuke_budget_v2` | 支出履歴 |
| `otasuke_custom_recipes_v1` | わが家のレシピ |
| `otasuke_shopping_sets_v1` | よく買うものセット |
| `otasuke_notification_prefs_v1` | 通知設定 |
| `otasuke_guide_v1` | ガイド表示履歴 |
