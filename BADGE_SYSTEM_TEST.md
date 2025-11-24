# バッジシステム テストガイド

## 修正内容

### 問題点
1. レッスン1のクリア時の挙動が他と異なる（疑い）
2. mypage.htmlでリセットボタンを押した後、各レッスンで動画を最後まで見てもクリア判定が起きない

### 解決策
1. **mypage.htmlのリセット処理を修正**
   - `aiLearningCompletedVideos`をクリア（動画完了記録）
   - `aiLearningBadges`をクリア（バッジ獲得記録）
   - `aiLearningCompletedLessons`をクリア（レッスン完了記録）

2. **全てのレッスンページのコードを統一**
   - 全19レッスンが同じロジックで動画完了を検知
   - `trackVideoCompletion(LESSON_NUMBER)`を呼び出し

## システムの動作フロー

```
┌─────────────────────────────────────────────┐
│ 1. ユーザーがレッスンページで動画を視聴   │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 2. YouTube IFrame APIが動画終了を検知      │
│    (YT.PlayerState.ENDED)                   │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 3. trackVideoCompletion(LESSON_NUMBER)     │
│    が呼び出される                           │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 4. VideoCompletionTracker                   │
│    - aiLearningCompletedVideos に保存      │
│    - 重複チェック（既に完了済みならスキップ）│
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 5. BadgeManager.completeLesson()            │
│    - aiLearningCompletedLessons に保存     │
│    - バッジ獲得条件をチェック               │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 6. 動画完了メッセージを表示                 │
│    "動画視聴完了！"                         │
└─────────────────────────────────────────────┘
```

## リセット処理の動作フロー

```
┌─────────────────────────────────────────────┐
│ 1. mypage.htmlでリセットボタンをクリック   │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 2. 確認ダイアログを表示                     │
│    「今までのバッジが全て消えてしまいます！」│
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 3. ユーザーが「はい」をクリック             │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 4. localStorageから3つのキーを削除          │
│    - aiLearningCompletedLessons            │
│    - aiLearningCompletedVideos             │
│    - aiLearningBadges                       │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 5. mypage.htmlの表示を更新                  │
│    - 全バッジがロック状態に戻る             │
│    - 獲得バッジ数が0になる                  │
└─────────────────┬───────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│ 6. レッスンページで再度動画を見ると         │
│    新たにクリア判定が行われる               │
└─────────────────────────────────────────────┘
```

## テスト手順

### テスト1: 通常のバッジ獲得

1. **準備**: 全ての進捗をクリア
   ```javascript
   // ブラウザのコンソールで実行
   localStorage.clear();
   ```

2. **実行**:
   - `howtoAI/01_ai-basics.html`を開く
   - YouTube動画を最後まで再生（またはシークバーで最後に飛ばす）
   - 動画終了時に完了メッセージが表示されることを確認

3. **確認**:
   - `mypage.html`を開く
   - レッスン01のバッジが解放されていることを確認
   - 獲得バッジ数が「1 / 19」になっていることを確認

4. **ブラウザコンソールで確認**:
   ```javascript
   // 完了済みレッスンを確認
   JSON.parse(localStorage.getItem('aiLearningCompletedLessons'));
   // 結果: [1]

   // 完了済み動画を確認
   JSON.parse(localStorage.getItem('aiLearningCompletedVideos'));
   // 結果: [1]
   ```

### テスト2: リセット機能

1. **準備**: テスト1を完了し、レッスン01のバッジを獲得しておく

2. **実行**:
   - `mypage.html`を開く
   - 「リセット」ボタンをクリック
   - 確認ダイアログで「はい」をクリック

3. **確認**:
   - mypage.html上で全てのバッジがロック状態に戻ることを確認
   - 獲得バッジ数が「0 / 19」になることを確認

4. **ブラウザコンソールで確認**:
   ```javascript
   // 全て null または空配列になっているはず
   localStorage.getItem('aiLearningCompletedLessons');    // null
   localStorage.getItem('aiLearningCompletedVideos');     // null
   localStorage.getItem('aiLearningBadges');              // null
   ```

### テスト3: リセット後の再獲得

1. **準備**: テスト2を完了し、全ての進捗をリセット

2. **実行**:
   - `howtoAI/01_ai-basics.html`を開く
   - 再度YouTube動画を最後まで再生
   - 動画終了時に完了メッセージが表示されることを確認

3. **確認**:
   - `mypage.html`を開く
   - レッスン01のバッジが再度解放されていることを確認
   - 獲得バッジ数が「1 / 19」になっていることを確認

4. **期待される結果**:
   - リセット後も通常通りバッジが獲得できる
   - 動画完了メッセージが表示される
   - mypage.htmlで正しく反映される

### テスト4: 複数レッスンのテスト

1. **実行**:
   - レッスン01, 08, 14, 19を順番に完了
   - それぞれの完了メッセージを確認

2. **確認**:
   - `mypage.html`で4つのバッジが解放されていることを確認
   - 各カテゴリで正しいバッジが表示されることを確認:
     - AI全般: レッスン01
     - 起業・ビジコン: レッスン08
     - クリエイティブ: レッスン14
     - コミュニティ: レッスン19

### テスト5: 「ふっかつのじゅもん」機能

1. **準備**: 全ての進捗をリセット

2. **実行**:
   - `mypage.html`を開く
   - 「ふっかつのじゅもん」ボタンをクリック
   - 以下のじゅもんを試す:
     - `あかいもも` → AI全般（レッスン1-7）を全て解放
     - `あおいはすかっぷ` → 起業・ビジコン（レッスン8-13）を全て解放
     - `みどりのみかん` → クリエイティブ（レッスン14-18）を全て解放
     - `むらさきのぶどう` → コミュニティ（レッスン19）を解放

3. **確認**:
   - 各じゅもん実行後、対応するバッジが全て解放されることを確認
   - 成功メッセージが表示されることを確認

### テスト6: test-badge-system.htmlを使用

1. **実行**:
   - `test-badge-system.html`を開く
   - 「レッスン01完了をシミュレート」ボタンをクリック
   - 「状態を更新」ボタンをクリック

2. **確認**:
   - 完了済みレッスン数が増えることを確認
   - バッジ01が黄色（completed）になることを確認

3. **リセットテスト**:
   - 「全ての進捗をクリア」ボタンをクリック
   - 確認ダイアログで「OK」をクリック
   - 全てのバッジが緑（未完了）に戻ることを確認

4. **再獲得テスト**:
   - 再度「レッスン01完了をシミュレート」ボタンをクリック
   - バッジ01が再び黄色になることを確認

## 使用するlocalStorageキー

| キー | 用途 | データ形式 | 管理者 |
|------|------|-----------|--------|
| `aiLearningCompletedLessons` | 完了済みレッスンのリスト | `[1, 2, 3, ...]` | BadgeManager + MyPageBadgeManager |
| `aiLearningCompletedVideos` | 完了済み動画のリスト | `[1, 2, 3, ...]` | VideoCompletionTracker |
| `aiLearningBadges` | 獲得済みバッジのリスト | `[{id, name, ...}, ...]` | BadgeManager |

## トラブルシューティング

### 問題: リセット後も動画完了が検知されない

**原因**: ブラウザのキャッシュが古いページを表示している

**解決策**:
1. ブラウザでハードリフレッシュ（Cmd+Shift+R / Ctrl+Shift+R）
2. ブラウザのキャッシュをクリア
3. プライベートブラウジングモードで再テスト

### 問題: mypage.htmlでバッジが表示されない

**原因**: localStorageのデータが破損している

**解決策**:
```javascript
// ブラウザのコンソールで実行
localStorage.clear();
location.reload();
```

### 問題: 動画完了メッセージが表示されない

**原因**: script.jsが正しく読み込まれていない

**解決策**:
1. ブラウザのコンソールでエラーを確認
2. `trackVideoCompletion`関数が定義されているか確認:
   ```javascript
   typeof trackVideoCompletion
   // 結果: "function" であるべき
   ```
3. script.jsのパスが正しいか確認

## 開発者向けデバッグ

### ブラウザコンソールでの確認コマンド

```javascript
// 1. 完了済みレッスンを確認
console.log('Completed Lessons:',
  JSON.parse(localStorage.getItem('aiLearningCompletedLessons') || '[]')
);

// 2. 完了済み動画を確認
console.log('Completed Videos:',
  JSON.parse(localStorage.getItem('aiLearningCompletedVideos') || '[]')
);

// 3. 獲得済みバッジを確認
console.log('Earned Badges:',
  JSON.parse(localStorage.getItem('aiLearningBadges') || '[]')
);

// 4. VideoCompletionTrackerの状態を確認
console.log('VideoCompletionTracker:', videoCompletionTracker);

// 5. BadgeManagerの状態を確認
console.log('BadgeManager:', badgeManager);

// 6. 手動でレッスン完了をトリガー
trackVideoCompletion(1);

// 7. 手動で全てをクリア
localStorage.removeItem('aiLearningCompletedLessons');
localStorage.removeItem('aiLearningCompletedVideos');
localStorage.removeItem('aiLearningBadges');
console.log('All progress cleared');
```

## ファイル構成

```
AIDojo/
├── index.html                          # トップページ
├── mypage.html                          # マイページ（バッジ表示・管理）
├── script.js                            # メインスクリプト（BadgeManager, VideoCompletionTracker）
├── test-badge-system.html               # テストページ
├── BADGE_SYSTEM_TEST.md                 # このファイル
│
├── howtoAI/                             # AI全般カテゴリ
│   ├── 01_ai-basics.html               # レッスン1
│   ├── 02_prompt-engineering.html       # レッスン2
│   └── ... (07まで)
│
├── business/                            # 起業・ビジコンカテゴリ
│   ├── 08_startup-basics.html          # レッスン8
│   └── ... (13まで)
│
├── creative/                            # クリエイティブカテゴリ
│   ├── 14_creative-intro.html          # レッスン14
│   └── ... (18まで)
│
└── community/                           # コミュニティカテゴリ
    └── 19_discord-community.html       # レッスン19
```

## 修正ファイル一覧

1. **mypage.html** (修正済み)
   - `resetAllBadges()`関数を修正
   - `aiLearningCompletedVideos`と`aiLearningBadges`のクリアを追加

2. **script.js** (修正済み)
   - 総レッスン数を22から19に変更
   - セクション構成を実際のレッスン構造に合わせて更新

3. **test-badge-system.html** (作成)
   - バッジシステムのテストページ
   - シミュレーション機能付き

## まとめ

### 修正前の問題
- リセット後、`aiLearningCompletedVideos`が残っていたため、VideoCompletionTrackerが「既に完了済み」と判断
- そのため、`badgeManager.completeLesson()`が呼び出されず、バッジが獲得できなかった

### 修正後の動作
- リセット時に`aiLearningCompletedVideos`もクリアするため、VideoCompletionTrackerが正しくリセットされる
- リセット後、レッスンページで動画を見ると、再度クリア判定が行われる
- mypage.htmlで正しくバッジが表示される

### 推奨されるテストフロー
1. test-badge-system.htmlで基本動作を確認
2. 実際のレッスンページで動画完了を確認
3. mypage.htmlでバッジ表示を確認
4. リセット機能をテスト
5. リセット後の再獲得を確認
