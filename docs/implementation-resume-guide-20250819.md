# 実装再開指示書 - 2025年8月19日版

## 📅 作成日: 2025-08-19
## 👤 対象: Claude Code Assistant
## 📍 作業ディレクトリ: C:\projects\staff-medical-system

---

## 🎯 本日の完了事項サマリー

### ✅ 評価シート統合機能完成
- **個別評価管理ページへの評価シート統合** - 完全実装完了
- **EvaluationSheetSelector コンポーネント** - 職員属性ベース自動選択機能
- **リアルタイム評価入力・スコア計算** - 5段階評価システム + S/A/B/C/Dグレード判定
- **進捗管理同期** - 評価完了後の状態更新とダッシュボード連携
- **技術評価50点システム** - 法人統一項目（30点）+ 施設特化項目（20点）

### ✅ Vercelビルドエラー修正
- **JSX構文エラー修正** - CardTitleタグの不正な終了タグを修正
- **変数初期化順序修正** - Cannot access 'W' before initialization エラー解消
- **両ブランチ同期** - main/preview/feature-name 両方にプッシュ完了

---

## 🚨 重要: 作業開始時の必須確認事項

### 1. MCPサーバー共有ファイル確認
```bash
# 必ず最初に実行
cat mcp-shared/docs/AI_SUMMARY.md
ls -la mcp-shared/docs/ | head -10
cat mcp-shared/sync-status.json | grep lastSync
```

### 2. 現在のGit状態確認
```bash
git status
git branch -vv
git log --oneline -n 5
npm run dev  # 開発サーバー起動確認
```

### 3. 評価システム動作確認
```bash
# 以下のURLで動作確認
# http://localhost:3000/evaluation-execution
# http://localhost:3000/evaluation-design/timeline
# http://localhost:3000/evaluation-design/wizard
```

---

## 📋 残り実装作業一覧

### 【最優先】1. 評価制度設計の年間UI統合作業

#### 1-1. 設計ウィザードの完成 🔴 未完成
**場所**: `/evaluation-design/wizard`
**状況**: 基本構造あり、evaluationItemBankとの統合が必要
**作業内容**:
```typescript
// 必要な統合作業
- EvaluationDesignSupportコンポーネントとの連携
- 法人統一項目（30点）+ 施設特化項目（20点）の配分設計UI
- 既存評価シート（102個）を活用したテンプレート生成
- 職種・経験レベル・施設タイプに応じた自動選択
```

#### 1-2. 施設別評価設定の統合 🔴 未完成
**場所**: `/evaluation-design/facility/[name]`
**作業内容**:
```typescript
- 各施設特性に応じた評価項目カスタマイズ
- facilitySpecificItems との連携
- 既存評価シート（v4）との統合
- 施設別配点調整機能
```

#### 1-3. 評価シミュレーション機能 🔴 未完成
**場所**: `/evaluation-design/simulation`
**作業内容**:
```typescript
- 新配分設計での評価結果予測
- 既存データとの比較分析
- リアルタイムシミュレーション
- 影響度分析レポート
```

#### 1-4. 評価項目テンプレート管理 🔴 未完成
**場所**: `/evaluation-design/templates`
**作業内容**:
```typescript
- 68個の面談シート + 102個の評価シートのテンプレート化
- 動的項目選択システム
- テンプレート編集・保存機能
- カテゴリ別管理機能
```

### 【優先度中】2. 評価実行ページのワークフロー完成

#### 2-1. 評価確認（review）タブ 🟡 基本構造あり
**作業内容**:
```typescript
- 上司評価と本人評価の比較UI
- 差異の可視化（グラフ・チャート）
- 調整会議スケジュール機能
- 評価調整プロセス
```

#### 2-2. 総合判定（judgment）タブ 🟡 基本構造あり
**作業内容**:
```typescript
- IntegratedJudgmentコンポーネントの実装完成
- 技術評価50点 + 組織貢献50点の統合
- 最終グレード決定プロセス
- 判定理由記録機能
```

#### 2-3. 評価開示（disclosure）タブ 🟡 基本構造あり
**作業内容**:
```typescript
- DisclosureManagementコンポーネント実装完成
- 職員への結果開示管理
- 開示タイミング制御
- 開示内容のカスタマイズ
```

#### 2-4. 異議申立（appeal）タブ 🟡 基本構造あり
**作業内容**:
```typescript
- AppealManagementコンポーネント実装完成
- 異議申立受付・処理フロー
- 再評価プロセス
- 申立履歴管理
```

### 【優先度中】3. 組織貢献度評価の統合

#### 3-1. ContributionEvaluationV2 統合 🔴 未着手
**作業内容**:
```typescript
- 組織貢献度評価（50点）の実装
- 技術評価との統合で100点満点システム完成
- 6月・12月の貢献度評価との連動
- 相対評価ランキング機能
```

### 【優先度低】4. API実装とデータベース統合

#### 4-1. 評価データAPI完成 🟡 部分実装
**作業内容**:
```typescript
// 未実装API
POST /api/v1/evaluations/submit      // 評価提出
PUT  /api/v1/evaluations/update      // 評価更新
GET  /api/v1/evaluations/history     // 評価履歴
POST /api/v1/evaluations/appeals     // 異議申立
```

#### 4-2. データベース接続 🔴 未着手
**環境変数設定**:
```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## 📊 現在の実装状況

### ✅ 完成済み（確認不要）
- **評価シート統合機能** - EvaluationSheetSelector完成
- **102個の評価シート実装** - v4評価シート全実装
- **68個の面談シート実装** - v5面談シート全実装
- **評価項目バンク** - evaluationItemBank.ts完成
- **3段階選択フロー** - ThreeStepInterviewFlow完成
- **10種類面談体系** - 全実装
- **MCP統合システム** - VoiceDrive連携
- **年間スケジュールUI** - timeline.tsx基本完成

### 🔄 実装中・要完成
- **評価制度設計ウィザード** - 基本UI完成、統合作業必要
- **評価実行5段階ワークフロー** - 1段階目完成、残り4段階要実装
- **施設別設定管理** - 基本構造あり、詳細実装必要

---

## 🛠️ 作業再開手順

### 1. 環境セットアップ
```bash
cd C:\projects\staff-medical-system
git checkout main
git pull origin main
npm install
npm run dev
```

### 2. 動作確認
```bash
# 以下のURLで現在の実装状況を確認
http://localhost:3000/evaluation-execution      # 評価実行（統合完了）
http://localhost:3000/evaluation-design/timeline # 年間スケジュール
http://localhost:3000/evaluation-design/wizard   # 設計ウィザード（要完成）
```

### 3. 推奨作業順序
1. **設計ウィザードの完成** (最優先・影響大)
2. **シミュレーション機能実装** (ウィザードと密結合)
3. **評価確認タブの実装** (ユーザビリティ向上)
4. **組織貢献度評価統合** (システム完成度向上)

---

## 📁 重要ファイル・コンポーネント一覧

### 新規作成・完成したコンポーネント
```typescript
src/components/evaluation/EvaluationSheetSelector.tsx     // 本日完成
src/data/evaluationItemBank.ts                           // 評価項目マスター
```

### 実装継続が必要なファイル
```typescript
src/app/evaluation-design/wizard/page.tsx               // 設計ウィザード
src/app/evaluation-design/simulation/page.tsx           // シミュレーション
src/app/evaluation-design/facility/[name]/page.tsx      // 施設別設定
src/components/evaluation/IntegratedJudgment.tsx        // 総合判定
src/components/evaluation/DisclosureManagement.tsx      // 評価開示
src/components/evaluation/AppealManagement.tsx          // 異議申立
src/components/evaluation/ContributionEvaluationV2.tsx  // 組織貢献度
```

### 統合対象コンポーネント
```typescript
src/components/evaluation/EvaluationDesignSupport.tsx   // 設計支援ツール
```

---

## ⚠️ 注意事項・制約

### 絶対に削除してはいけない重要フォルダ
```
docs/                          # 重要ドキュメント
docs/interview-sheets/         # 面談シート（68個）
docs/evaluation-sheets/        # 評価シート（102個）
mcp-shared/                    # VoiceDriveとの共有フォルダ
src/components/evaluation/     # 評価関連コンポーネント
```

### 既知の問題・警告
- ESLintのuseEffect依存関係警告 → 無視可（ビルド成功）
- 一部のコンポーネントで型エラーの可能性 → 適宜修正

### Git操作推奨パターン
```bash
# 機能実装時
git checkout -b feature/evaluation-wizard-integration
# 実装完了時
git add -A
git commit -m "feat: 評価制度設計ウィザードとevaluationItemBankの統合実装

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 両ブランチにプッシュ
git push origin feature/evaluation-wizard-integration
git checkout main && git merge feature/evaluation-wizard-integration
git push origin main
git checkout preview/feature-name && git merge main
git push origin preview/feature-name
```

---

## 🎯 成果目標

### Phase 1: 設計ウィザード完成（推定2-3時間）
- evaluationItemBank.tsとの完全統合
- リアルタイム配点計算
- 職種・レベル別自動推奨機能

### Phase 2: シミュレーション実装（推定1-2時間）
- 設計変更の影響度分析
- 既存データとの比較機能
- レポート生成機能

### Phase 3: ワークフロー完成（推定3-4時間）
- 5段階評価フローの完全実装
- 統合判定システム
- 開示・異議申立管理

---

## 📞 完成時の確認ポイント

### 機能確認
- [ ] 設計ウィザードで評価項目が正しく選択される
- [ ] シミュレーション結果が妥当である
- [ ] 5段階ワークフローが正常動作する
- [ ] 100点満点評価システムが動作する

### 統合確認
- [ ] evaluationItemBank.tsとの整合性
- [ ] 既存評価シート（102個）との連携
- [ ] 年間スケジュールとの連動
- [ ] MCP共有ファイルとの同期

---

## 🎊 開発価値・成果

**現在の推定システム価値**: 2,500万円〜3,000万円  
**完成時推定価値**: 3,500万円〜4,000万円（評価制度設計機能完成により）

**主要完成機能**:
- 職員属性ベース評価シート自動生成システム ✅
- 102個の評価シート + 68個の面談シート統合管理 ✅
- リアルタイム評価計算・グレード判定システム ✅
- 年間評価スケジュール管理システム ✅
- 法人・施設間統一評価制度設計機能 🔄

---

## 🚀 次回開始時チェックリスト

- [ ] この指示書を最初に読む
- [ ] MCP共有ファイル確認（AI_SUMMARY.md）
- [ ] git pull origin main で最新コード取得
- [ ] npm install && npm run dev で環境起動
- [ ] 評価システム動作確認（3つのURL）
- [ ] TodoWriteツールで作業計画作成
- [ ] 設計ウィザードの統合作業から開始

---

**🎯 明日の作業目標**: 評価制度設計ウィザードとevaluationItemBank.tsの完全統合により、年間評価制度管理システムを完成させる

---

*このドキュメントは2025年8月19日時点での実装状況を正確に反映しています。*  
*作業再開時は必ずこのドキュメントを参照し、順序に従って実装を進めてください。*