# 教育研修・人事評価連動システム 実装作業再開指示書 V3
**作成日**: 2025年1月13日  
**前回作業日**: 2025年1月13日  
**システム名**: 教育研修・人事評価連動システム  
**作業ステータス**: 最終フェーズ（85%完了）

---

## 🎯 本日までの実装完了内容

### ✅ 完了済み機能一覧

#### 第1フェーズ（100%完了）
1. **項目バンク機能** - `/training` ページ > 項目バンクタブ
2. **研修計画自動生成機能** - `/training` ページ > 研修計画タブ
3. **法定研修ガイド** - `/training` ページ > ガイドタブ

#### 第2フェーズ（100%完了）
1. **進捗ダッシュボード** - `/training` ページ > 進捗ダッシュボードタブ
   - ファイル: `src/components/training/ProgressDashboard.tsx`
   - 法人全体の研修進捗リアルタイム監視

2. **個人分析レポート機能** - `/staff-cards/[staffId]` > 評価分析レポートタブ
   - ファイル群:
     - `src/components/evaluation/PersonalAnalysisReport.tsx`
     - `src/components/evaluation/StrengthWeaknessRadar.tsx`
     - `src/components/evaluation/TrainingEffectAnalysis.tsx`

3. **評価統合ダッシュボード** - `/evaluation` ページ > ダッシュボードタブ
   - ファイル: `src/components/evaluation/EvaluationIntegratedDashboard.tsx`

#### 第3フェーズ（100%完了）- 2025年1月13日実装
1. **評価ワークフロー機能**
   - ファイル群:
     - `src/services/evaluationWorkflowService.ts`
     - `src/components/evaluation/EvaluationWorkflow.tsx`
     - `src/components/evaluation/ApprovalDashboard.tsx`
   - 承認フロー: draft → submitted → pending_approval → approved/rejected → confirmed

2. **通知・アラート機能**
   - ファイル群:
     - `src/services/notificationService.ts`
     - `src/components/notification/NotificationCenter.tsx`
   - 研修期限切れアラート（30日前、7日前、前日）

3. **部門別分析レポート**
   - ファイル群:
     - `src/services/departmentAnalysisService.ts`
     - `src/components/reports/DepartmentAnalysisReport.tsx`
     - `src/app/reports/department-analysis/page.tsx`
   - `/training` ページ > 部門別分析タブに統合済み
   - UI修正済み（プルダウン背景白色、12ヶ月トレンドグラフ改善）

4. **研修カレンダービュー**
   - ファイル群:
     - `src/components/training/TrainingCalendarView.tsx`
     - `src/app/training/calendar/page.tsx`
   - `/training` ページ > カレンダータブに統合済み
   - 月/週/日表示切り替え、ドラッグ&ドロップ対応

#### UI改善（2025年1月13日実装）
- 教育・研修管理ページのタブを2行表示に変更
- 新機能に「New」バッジを追加
- 部門別分析のSelectコンポーネント背景を白色に修正
- 12ヶ月トレンドグラフのレイアウト改善

---

## 🔧 明日以降の実装予定タスク

### 【優先度：低】データ管理・システム連携
**推定作業時間**: 4-5時間  
**推奨実装日**: 2025年1月14日～15日

#### 1. マスターデータ管理画面（2時間）
```typescript
// 実装予定ファイル
src/app/admin/
├── master-data/
│   ├── page.tsx              // マスターデータ管理メイン
│   ├── StaffMaster.tsx        // 職員マスター
│   ├── FacilityMaster.tsx    // 施設マスター
│   ├── TrainingMaster.tsx    // 研修マスター
│   └── EvaluationMaster.tsx  // 評価項目マスター

src/services/
└── masterDataService.ts      // マスターデータ管理サービス
```

**実装内容**:
- CRUD操作のUI実装
- データ検証とエラーハンドリング
- 一括インポート/エクスポート機能
- 変更履歴の記録

#### 2. バックアップ・リストア機能（1時間）
```typescript
// 実装予定ファイル
src/app/admin/backup/
├── page.tsx                  // バックアップ管理画面
└── BackupScheduler.tsx       // 定期バックアップ設定

src/services/
└── backupService.ts          // バックアップサービス
```

**実装内容**:
- JSON/CSV形式でのデータエクスポート
- データインポート機能
- 定期バックアップのスケジュール設定
- バックアップ履歴管理

#### 3. 外部システムAPI連携（1時間）
```typescript
// 実装予定ファイル
src/app/admin/integration/
├── page.tsx                  // 外部連携設定画面
├── ApiSettings.tsx           // API設定
└── WebhookConfig.tsx        // Webhook設定

src/services/
└── integrationService.ts     // 外部連携サービス
```

**実装内容**:
- API認証設定（APIキー管理）
- Webhook URL設定
- データマッピング設定
- 連携テスト機能

#### 4. 監査ログ機能（30分）
```typescript
// 実装予定ファイル
src/app/admin/audit-log/
├── page.tsx                  // 監査ログ画面
└── LogViewer.tsx            // ログビューアー

src/services/
└── auditLogService.ts        // 監査ログサービス
```

**実装内容**:
- 操作履歴の自動記録
- ログの検索・フィルタリング
- CSV出力機能
- ログ保持期間設定

#### 5. バッチ処理スケジューラー（30分）
```typescript
// 実装予定ファイル
src/app/admin/scheduler/
├── page.tsx                  // スケジューラー管理画面
└── JobConfig.tsx            // ジョブ設定

src/services/
└── schedulerService.ts       // スケジューラーサービス
```

**実装内容**:
- 定期処理ジョブの設定
- 実行履歴の表示
- エラー通知設定
- 手動実行機能

---

## 🚀 実装再開時の手順

### 1. 環境セットアップ（5分）
```bash
# プロジェクトディレクトリへ移動
cd C:\projects\staff-medical-system

# 最新のコードを取得
git checkout preview/feature-name
git pull origin preview/feature-name

# 依存関係の確認
npm install

# 開発サーバー起動
npm run dev
```

### 2. 動作確認チェックリスト（10分）
- [ ] http://localhost:3000/training - 教育・研修管理ページ
  - [ ] カレンダータブが表示される
  - [ ] 部門別分析タブが表示される
  - [ ] プルダウンの背景が白色
  - [ ] 12ヶ月トレンドグラフが正常表示

- [ ] http://localhost:3000/evaluation - 評価管理ページ
  - [ ] 評価ワークフローが動作
  - [ ] 承認ダッシュボードが表示

- [ ] 通知センターの確認
  - [ ] 通知の作成・表示が正常
  - [ ] フィルタリング機能が動作

### 3. 実装開始前の準備
```bash
# 新しいファイルを作成する場合のディレクトリ作成
mkdir -p src/app/admin/master-data
mkdir -p src/app/admin/backup
mkdir -p src/app/admin/integration
mkdir -p src/app/admin/audit-log
mkdir -p src/app/admin/scheduler
```

### 4. 実装の進め方
1. **TodoWriteツールで細分化**
   ```
   - マスターデータ管理UIの作成
   - マスターデータサービスの実装
   - バックアップ機能の実装
   - API連携設定画面の作成
   - 監査ログビューアーの実装
   - スケジューラー設定画面の作成
   ```

2. **各機能の実装順序**
   - マスターデータ管理を最初に実装（基盤となるため）
   - バックアップ機能（データ保護の観点から2番目）
   - その他は並行して実装可能

3. **テストの実施**
   - 各機能実装後にビルドテスト
   - 既存機能への影響確認
   - UI/UXの一貫性チェック

---

## 📝 技術的な注意事項

### 使用技術スタック
- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Charts**: Chart.js, Recharts
- **Validation**: Zod
- **Styling**: Tailwind CSS, CSS Modules

### コーディング規約
1. **コンポーネント**
   - 'use client'ディレクティブを使用
   - React.FCは使用しない（型推論のため）
   - コンポーネントは単一責任の原則に従う

2. **スタイル**
   - Tailwind CSSクラスを優先
   - CSS Modulesは既存部分のみ
   - bg-whiteなど背景色を明示的に指定

3. **データ管理**
   - 現在はモックデータ使用
   - サービス層でデータロジックを管理
   - 将来的なAPI移行を考慮した設計

### Git運用
```bash
# 作業開始時
git checkout preview/feature-name
git pull origin preview/feature-name

# コミット
git add -A
git commit -m "feat: [機能名] の実装

詳細な説明...

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# プッシュ（両ブランチへ）
git push origin preview/feature-name
git checkout main
git merge preview/feature-name --no-edit
git push origin main
git checkout preview/feature-name
```

---

## 🔗 重要なリソース

### デプロイ環境
- **本番URL**: https://staff-medical-system-v2.vercel.app
- **GitHub**: https://github.com/tokubot83/staff-medical-system-v2
- **ブランチ**: main, preview/feature-name

### 主要ディレクトリ構造
```
src/
├── app/                     # Next.js App Router
│   ├── training/           # 教育・研修管理
│   ├── evaluation/         # 評価管理
│   ├── admin/              # 管理者機能（明日実装予定）
│   └── api/                # APIルート
├── components/             # Reactコンポーネント
│   ├── ui/                # shadcn/ui components
│   ├── evaluation/        # 評価関連
│   ├── training/          # 研修関連
│   ├── notification/      # 通知関連
│   └── reports/           # レポート関連
├── services/              # ビジネスロジック
└── lib/                   # ユーティリティ
```

### 関連ドキュメント
- `/docs/implementation-resume-guide.md` - 初回指示書
- `/docs/implementation-resume-guide-v2.md` - 第2版指示書
- `/docs/implementation-resume-guide-v3-20250113.md` - 本ファイル（最新版）
- `/CLAUDE.md` - Claude Code用プロジェクト設定
- `/mcp-shared/docs/` - MCP共有ドキュメント

---

## 🎉 プロジェクト完成に向けて

### 残りの作業
- **データ管理・システム連携機能**（4-5時間）のみ

### 完成後の確認事項
1. 全機能の統合テスト
2. パフォーマンステスト
3. ユーザビリティテスト
4. ドキュメント整備
5. 本番環境へのデプロイ

### 予想完成日
- **2025年1月14日～15日**（データ管理機能実装）
- **2025年1月15日**（最終テスト・調整）

---

## 💡 申し送り事項

### 本日の成果
1. 評価ワークフロー機能の完全実装
2. 通知システムの構築
3. 部門別分析レポートの実装とUI改善
4. 研修カレンダービューの実装
5. 教育・研修管理ページのUI改善（2行タブ化）

### 技術的な改善点
- Radix UI Checkboxコンポーネントの実装
- Zodによる入力検証の追加
- 12ヶ月トレンドグラフの視認性向上
- Selectコンポーネントの背景色問題解決

### 次回への推奨事項
1. **admin配下のページ構成を先に設計**
2. **マスターデータのスキーマ定義を明確化**
3. **バックアップデータの形式を決定**
4. **監査ログの記録項目を定義**

---

**📅 次回作業予定日: 2025年1月14日**  
**📧 連絡事項: 本ファイルを参照して、データ管理・システム連携機能から実装を開始してください**

---

*実装作業再開指示書 V3 - 2025年1月13日作成*  
*作成者: Claude Code Assistant*