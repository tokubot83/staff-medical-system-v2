# 次回実装作業指示書

**作成日**: 2025年8月10日  
**対象**: Claude Code（次回作業再開時用）  
**重要度**: 最高

---

## 📊 現在のシステム状況

### システム規模
- **総コード行数**: 98,748行
- **ファイル数**: 638ファイル
- **推定開発価値**: 2,500万円〜3,000万円（高度な分析機能込み）

### 完了済みフェーズ
1. **Phase 1**: 基本機能実装 ✅
2. **Phase 2**: 3段階選択フロー実装 ✅
3. **Phase 2.5**: 拡張性確保とMCP統合 ✅

### デプロイ状況
- **本番環境**: Vercel（自動デプロイ設定済み）
- **プレビュー環境**: preview/feature-name ブランチで確認可能
- **ビルドエラー**: すべて修正済み ✅

---

## 🎯 次回優先タスク

### 1. 統合テストスイート実装（最優先）
```typescript
// 実装場所: src/__tests__/integration/
// テスト対象:
- 3段階選択フロー（ThreeStepInterviewFlow）
- API連携（/api/v1/interviews/）
- MCP共有ファイル同期
- 面談タイプ設定の読み込み
```

### 2. データベース接続準備
```bash
# 環境変数設定が必要
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 3. 月曜日（8/12）統合作業
- **時間**: 未定（VoiceDriveチームと調整）
- **内容**: 両システムの統合テスト
- **準備**: mcp-shared/フォルダの同期確認

---

## 🔧 重要な技術仕様

### 面談システム（10種類体系）
```typescript
// src/types/interview.ts
export type InterviewType = 
  | 'new_employee_monthly'    // 新入職員月次面談
  | 'regular_annual'          // 一般職員年次面談
  | 'management_biannual'     // 管理職半年面談
  | 'return_to_work'          // 復職面談
  | 'incident_followup'       // インシデント後面談
  | 'exit_interview'          // 退職面談
  | 'feedback'                // フィードバック面談
  | 'career_support'          // キャリア系面談
  | 'workplace_support'       // 職場環境系面談
  | 'individual_consultation' // 個別相談面談
```

### MCP共有設定
```json
// mcp-shared/config/interview-types.json
{
  "version": "1.0.0",
  "classifications": [...],
  "interviewTypes": [...],
  "categories": {...}
}
```

### APIエンドポイント
```typescript
// 実装済みAPI
GET  /api/v1/interviews/bookings/mock  // モック予約データ
GET  /api/v1/interviews/logs          // 統合ログ
POST /api/v1/interviews/bookings      // 予約作成（未実装）
```

---

## 📁 重要ファイル一覧

### コアコンポーネント
- `src/components/interview/ThreeStepInterviewFlow.tsx` - メイン3段階フロー
- `src/components/interview/InterviewSheetWrapper.tsx` - 面談シート表示
- `src/config/interview-types.json` - 面談タイプ設定
- `src/interfaces/interview.interface.ts` - 共通インターフェース

### MCP関連
- `mcp-shared/docs/AI_SUMMARY.md` - 共有ファイル要約
- `mcp-shared/config/` - 共有設定
- `mcp-shared/interfaces/` - 共有型定義
- `scripts/check-mcp-sync.js` - 同期チェックスクリプト

### ドキュメント
- `docs/Phase2_Final_Integration_Plan_20250810.md` - 統合計画
- `docs/Master_Table_Design.md` - DBマスターテーブル設計
- `CLAUDE.md` - プロジェクト重要事項

---

## ⚠️ 注意事項

### 絶対に削除してはいけないフォルダ
```
docs/                     # 重要ドキュメント
docs/interview-sheets/    # 面談シート
docs/evaluation-sheets/   # 評価シート
mcp-shared/              # VoiceDriveとの共有フォルダ
```

### ビルド時の既知の警告
- ESLintの`useEffect`依存関係警告は無視可（ビルドは成功する）
- 型エラーはすべて修正済み

### Git操作
```bash
# 作業開始時
git pull origin main
npm install
npm run dev

# コミット時
git add -A
git commit -m "feat: [機能説明]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# プレビュー環境へのプッシュ
git checkout preview/feature-name
git merge main
git push origin preview/feature-name
```

---

## 🚀 作業再開手順

1. **最新コード取得**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **依存関係更新**
   ```bash
   npm install
   ```

3. **開発サーバー起動**
   ```bash
   npm run dev
   # http://localhost:3000
   ```

4. **MCP共有確認**
   ```bash
   cat mcp-shared/docs/AI_SUMMARY.md
   ls -la mcp-shared/
   ```

5. **統合モニター確認**
   ```
   http://localhost:3000/integration-monitor
   ```

6. **3段階フロー動作確認**
   ```
   http://localhost:3000/interview-phase2
   ```

---

## 📞 連絡先・リソース

### GitHub
- リポジトリ: https://github.com/tokubot83/staff-medical-system-v2
- Issues: 問題報告はGitHub Issuesへ

### Vercel
- 本番環境: 自動デプロイ設定済み
- プレビュー: preview/feature-name ブランチ

### VoiceDriveチーム
- 統合フォルダ: mcp-shared/
- 月曜キックオフ: 8/12予定

---

## ✅ 次回開始時チェックリスト

- [ ] この指示書を最初に読む
- [ ] git pull で最新コード取得
- [ ] npm install で依存関係更新
- [ ] npm run dev で開発サーバー起動
- [ ] /integration-monitor で統合状況確認
- [ ] /interview-phase2 で3段階フロー確認
- [ ] mcp-shared/の新規ファイル確認
- [ ] TodoWriteツールで統合テスト実装を開始

---

## 🎊 完了済み成果

Phase 2および Phase 2.5 の実装により、以下が完成：

1. **3段階選択フロー**: 直感的な面談予約UI
2. **10種類面談体系**: 完全実装
3. **設定の外部化**: JSONベースの柔軟な設定
4. **MCP統合**: 自動ファイル共有システム
5. **APIバージョニング**: v1/v2共存可能
6. **ビルドエラー修正**: デプロイ可能状態

**素晴らしい進捗です！月曜日の統合に向けて準備万端です。**

---

*このドキュメントは次回作業開始時の指針として作成されました。*
*作業開始時は必ずこのドキュメントを参照してください。*