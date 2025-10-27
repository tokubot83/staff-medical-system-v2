# IdeaVoiceTrackingPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-006
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: IdeaVoiceTrackingPage暫定マスターリストの医療システム側確認結果
**参照文書**:
- [IdeaVoiceTrackingPage_暫定マスターリスト_20251026.md](./IdeaVoiceTrackingPage_暫定マスターリスト_20251026.md)
- [IdeaVoiceTrackingPage_DB要件分析_20251026.md](./IdeaVoiceTrackingPage_DB要件分析_20251026.md)
- [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md)

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「IdeaVoiceTrackingPage 暫定マスターリスト」（文書番号: MASTER-2025-1026-002）に対する医療システム側の確認結果を報告します。

### 結論

| 項目 | 状態 | 備考 |
|------|------|------|
| **新規API実装** | ❌ **不要** | VoiceDrive内部データのみで動作 |
| **新規テーブル追加** | ❌ **不要** | VoiceDrive側で完全管理 |
| **既存API変更** | ❌ **不要** | 既存の`/api/v2/users` APIで十分 |
| **追加実装必要** | ❌ **なし** | 医療システム側の対応は不要 |

### 重要な発見

✅ **医療システム側の対応は不要** - IdeaVoiceTrackingPageは100% VoiceDrive内部データで動作

1. ✅ **既存のDB構造で完全に動作可能** - 医療システムからの新規データ提供は不要
2. ✅ **データ管理責任**: VoiceDrive 100%（投稿データ、投票データ、スコア計算）
3. ✅ **医療システムAPIは不要** - 全てVoiceDrive内部で完結
4. 🟡 **推奨追加項目**（VoiceDrive側）: プロジェクト化履歴、レベル遷移履歴テーブル

### 医療システムへの影響

- **新規API実装**: 不要
- **新規テーブル追加**: 不要
- **既存API変更**: 不要
- **実装工数**: 0日（対応不要）

---

## 🔍 詳細分析

### 1. データ管理責任の確認

#### 1-1. IdeaVoiceTrackingPageで使用されるデータ

| データ項目 | データ管理責任 | 医療システムへの影響 |
|-----------|--------------|-------------------|
| アイデア投稿データ | VoiceDrive 100% | ❌ 不要 |
| 投票データ | VoiceDrive 100% | ❌ 不要 |
| スコア計算 | VoiceDrive 100% | ❌ 不要 |
| プロジェクトレベル判定 | VoiceDrive 100% | ❌ 不要 |
| 統計サマリー（総数、平均等） | VoiceDrive 100% | ❌ 不要 |
| プロジェクト化閾値 | VoiceDrive 100% | ❌ 不要 |

#### 1-2. ユーザー情報の扱い

| データ項目 | データ管理責任 | 医療システムへの影響 | 備考 |
|-----------|--------------|-------------------|------|
| ユーザー基本情報 | 医療システム 100% | ✅ **既存API利用** | `/api/v2/users` |
| 権限レベル | 医療システム 100% | ✅ **既存API利用** | User.permissionLevel |

**重要**: ユーザー情報は**既存のAPI**で提供済みのため、**新規実装は不要**です。

---

### 2. 必要なマスターデータの確認

VoiceDriveの暫定マスターリストに記載された5つのマスターデータについて確認しました。

#### 2-1. プロジェクトレベルマスター

| 項目 | 内容 |
|-----|------|
| **定義場所** | VoiceDrive: `IdeaVoiceTrackingPage.tsx` 76-107行目 |
| **管理責任** | VoiceDrive 100%（コード内定数） |
| **医療システムへの影響** | ❌ **不要** - VoiceDrive側で完全管理 |
| **データ形式** | TypeScript定数 |

**定義内容**:
```typescript
const levelConfig = {
  'PENDING': { label: 'アイデア検討中', icon: '💡', color: '...' },
  'TEAM': { label: 'チームプロジェクト', icon: '👥', color: '...' },
  'DEPARTMENT': { label: '部署プロジェクト', icon: '🏢', color: '...' },
  'FACILITY': { label: '施設プロジェクト', icon: '🏥', color: '...' },
  'ORGANIZATION': { label: '法人プロジェクト', icon: '🏛️', color: '...' },
  'STRATEGIC': { label: '戦略プロジェクト', icon: '⭐', color: '...' }
};
```

**医療システムの対応**: 不要（VoiceDrive内部定数）

---

#### 2-2. スコア閾値マスター

| 項目 | 内容 |
|-----|------|
| **定義場所** | VoiceDrive: `IdeaVoiceTrackingPage.tsx` 56-73行目 |
| **管理責任** | VoiceDrive 100%（コード内定数） |
| **医療システムへの影響** | ❌ **不要** - VoiceDrive側で完全管理 |
| **データ形式** | TypeScript配列 |

**定義内容**:
```typescript
const thresholds = [
  { level: 'TEAM', score: 100 },       // プロジェクト化開始
  { level: 'DEPARTMENT', score: 200 },
  { level: 'FACILITY', score: 400 },
  { level: 'ORGANIZATION', score: 800 }
];
```

**医療システムの対応**: 不要（VoiceDrive内部定数）

---

#### 2-3. 投票オプションマスター

| 項目 | 内容 |
|-----|------|
| **定義場所** | VoiceDrive: `src/types/index.ts` |
| **管理責任** | VoiceDrive 100%（型定義） |
| **医療システムへの影響** | ❌ **不要** - VoiceDrive側で完全管理 |
| **データ形式** | TypeScript Union型 |

**定義内容**:
```typescript
type VoteOption =
  | 'strongly-support'  // 強く支持 (+2.0)
  | 'support'           // 支持 (+1.0)
  | 'neutral'           // 中立 (0.0)
  | 'oppose'            // 反対 (-1.0)
  | 'strongly-oppose';  // 強く反対 (-2.0)
```

**医療システムの対応**: 不要（VoiceDrive型定義）

---

#### 2-4. 提案タイプマスター

| 項目 | 内容 |
|-----|------|
| **定義場所** | VoiceDrive: `src/types/index.ts` |
| **管理責任** | VoiceDrive 100%（型定義） |
| **医療システムへの影響** | ❌ **不要** - VoiceDrive側で完全管理 |
| **データ形式** | TypeScript Union型 |

**定義内容**:
```typescript
type ProposalType =
  | 'operational'      // 業務改善
  | 'communication'    // コミュニケーション
  | 'innovation'       // イノベーション
  | 'strategy';        // 戦略提案
```

**医療システムの対応**: 不要（VoiceDrive型定義）

---

#### 2-5. 投稿タイプマスター

| 項目 | 内容 |
|-----|------|
| **定義場所** | VoiceDrive: `src/types/index.ts` |
| **管理責任** | VoiceDrive 100%（型定義） |
| **医療システムへの影響** | ❌ **不要** - VoiceDrive側で完全管理 |
| **データ形式** | TypeScript Union型 |

**定義内容**:
```typescript
type PostType =
  | 'improvement'  // アイデアボイス投稿（IdeaVoiceTrackingPageの対象）
  | 'community'    // コミュニティ投稿
  | 'report';      // 報告投稿
```

**医療システムの対応**: 不要（VoiceDrive型定義）

---

### 3. データベーステーブルの確認

VoiceDriveの暫定マスターリストに記載された「既存テーブル」と「推奨追加テーブル」について確認しました。

#### 3-1. 既存テーブル（VoiceDrive側）

| テーブル名 | 管理システム | 医療システムへの影響 |
|-----------|------------|-------------------|
| `Post` | VoiceDrive | ❌ 不要 |
| `Vote` | VoiceDrive | ❌ 不要 |
| `User` | 医療システム | ✅ **既存API利用** |
| `VoteHistory` | VoiceDrive | ❌ 不要 |

**重要**: `User`テーブルは医療システム管理ですが、**既存の`/api/v2/users` API**で提供済みのため、新規実装は不要です。

---

#### 3-2. 推奨追加テーブル（VoiceDrive側）

VoiceDriveの暫定マスターリストでは、以下の2テーブルが**推奨追加項目**としてリストアップされています。

**A. ProjectizedHistory（プロジェクト化履歴）**

| 項目 | 内容 |
|-----|------|
| **目的** | プロジェクト化達成の履歴記録 |
| **管理責任** | VoiceDrive 100% |
| **医療システムへの影響** | ❌ **不要** - VoiceDrive側で実装 |
| **優先度** | 🟡 中（機能強化） |

**医療システムの対応**: 不要（VoiceDrive側で実装）

---

**B. ProjectLevelTransitionHistory（レベル遷移履歴）**

| 項目 | 内容 |
|-----|------|
| **目的** | プロジェクトレベルの遷移追跡 |
| **管理責任** | VoiceDrive 100% |
| **医療システムへの影響** | ❌ **不要** - VoiceDrive側で実装 |
| **優先度** | 🟡 中（機能強化） |

**医療システムの対応**: 不要（VoiceDrive側で実装）

---

### 4. データ同期要件の確認

#### 4-1. VoiceDrive内部データ（同期不要）

| データ項目 | 管理システム | 同期方法 | 医療システムへの影響 |
|-----------|------------|---------|-------------------|
| 投稿データ | VoiceDrive | - | ❌ 不要 |
| 投票データ | VoiceDrive | - | ❌ 不要 |
| スコア計算 | VoiceDrive | - | ❌ 不要 |
| プロジェクトレベル | VoiceDrive | - | ❌ 不要 |

---

#### 4-2. 医療システムからのデータ（既存同期）

| データ項目 | 管理システム | 同期方法 | 医療システムへの影響 |
|-----------|------------|---------|-------------------|
| ユーザー基本情報 | 医療システム | API/Webhook | ✅ **既存API利用** |
| 権限レベル | 医療システム | API/Webhook | ✅ **既存API利用** |

**重要**: VoiceDriveの暫定マスターリストでは、以下のように明記されています：

> **重要**: IdeaVoiceTrackingPageは **医療システムからの新規データ提供は不要**

**医療システムの対応**: 既存の`/api/v2/users` APIで提供済みのため、新規実装は不要です。

---

## ✅ 確認結果サマリー

### 医療システム側の対応要否

| 対応項目 | 状態 | 理由 |
|---------|------|------|
| **新規API実装** | ❌ **不要** | VoiceDrive内部データのみで動作 |
| **新規テーブル追加** | ❌ **不要** | VoiceDrive側で完全管理 |
| **既存API変更** | ❌ **不要** | 既存の`/api/v2/users` APIで十分 |
| **マスターデータ提供** | ❌ **不要** | VoiceDrive側でコード内定数管理 |
| **データ同期設定** | ❌ **不要** | 既存のUser情報同期で十分 |

---

### VoiceDrive側の推奨実装

VoiceDriveの暫定マスターリストに記載された以下の項目は、VoiceDrive側での実装が推奨されます。

| 項目 | 優先度 | 推定工数 | 備考 |
|-----|-------|---------|------|
| ProjectizedHistoryテーブル | 🟡 中 | 1-2日 | プロジェクト化達成の記録 |
| ProjectLevelTransitionHistoryテーブル | 🟡 中 | 2-3日 | レベル遷移の追跡 |
| VoteHistoryテーブル活用 | 🟡 中 | 2-3日 | PersonalStation Phase 2と統合 |

**これらは全てVoiceDrive側の実装であり、医療システムへの影響はありません。**

---

## 📊 データフロー図

### 現在の状態（Phase 1）- 医療システムの関与

```
IdeaVoiceTrackingPage（VoiceDrive）
  ↓
自分のアイデア投稿 ← Post（VoiceDrive DB）
  ↓
投票データ ← Post.votes（VoiceDrive DB）
  ↓
スコア計算 ← useProjectScoring（VoiceDrive ローカル計算）
  ↓
プロジェクトレベル判定 ← getProjectLevel（VoiceDrive ローカル計算）
  ↓
統計サマリー ← VoiceDrive リアルタイム集計

----- 医療システムの関与（既存APIのみ） -----

ユーザー情報取得 ← GET /api/v2/users（医療システム既存API）
  ↓
User.name, User.department, User.permissionLevel
```

**重要**: 医療システムは**既存のUser情報API**のみを提供し、IdeaVoiceTrackingPage固有の新規APIは不要です。

---

## 📝 参考: organization-analytics との比較

VoiceDriveの他のページ（organization-analyticsページ）との比較を行いました。

### organization-analyticsページ（2025年10月10日分析済み）

**医療システムへの影響**:
- ✅ **API-1（部門マスタAPI）**: 95%実装可能（一部フィールド要調整）
- ⚠️ **API-2（職員総数API）**: 80%実装可能（雇用形態フィールド不足）
- 📅 **推定実装時間**: 1日（8時間）

**参照文書**: [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md)

---

### IdeaVoiceTrackingPage（本文書）

**医療システムへの影響**:
- ❌ **新規API実装**: 不要
- ❌ **新規テーブル追加**: 不要
- ❌ **既存API変更**: 不要
- 📅 **推定実装時間**: 0日（対応不要）

---

### 比較結果

| 項目 | organization-analytics | IdeaVoiceTrackingPage |
|-----|----------------------|---------------------|
| **データ管理責任** | 医療システム 50% + VoiceDrive 50% | VoiceDrive 100% |
| **新規API実装** | ✅ 必要（2件） | ❌ 不要 |
| **医療システム実装工数** | 1日（8時間） | 0日（不要） |
| **医療システムへの影響** | 🟡 中程度 | ✅ なし |

**結論**: IdeaVoiceTrackingPageは、organization-analyticsページと異なり、**医療システムからの新規データ提供は一切不要**です。

---

## 🔗 関連ドキュメント

### VoiceDrive側ドキュメント
1. [IdeaVoiceTrackingPage_暫定マスターリスト_20251026.md](./IdeaVoiceTrackingPage_暫定マスターリスト_20251026.md) - 本分析の元文書
2. [IdeaVoiceTrackingPage_DB要件分析_20251026.md](./IdeaVoiceTrackingPage_DB要件分析_20251026.md) - DB要件詳細
3. [データ管理責任分界点定義書_20251008.md](./データ管理責任分界点定義書_20251008.md) - データ責任定義

### 医療システム側ドキュメント（参考）
1. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 他ページの比較参考
2. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ

### マスタープラン
1. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - 統合実装マスタープラン

---

## 📞 次のステップ

### 医療システムチームの対応

✅ **対応不要** - IdeaVoiceTrackingPageは医療システムからの新規データ提供は不要です。

以下の既存APIの安定稼働を継続してください：
1. ✅ **User情報API**（`GET /api/v2/users`）- 既存実装で対応済み
2. ✅ **権限レベル情報**（`User.permissionLevel`）- 既存実装で対応済み

---

### VoiceDriveチームの対応

VoiceDriveチームは、暫定マスターリストに記載された以下のPhaseを実装してください：

1. **Phase 1（既に完了）**: 基本機能動作確認
2. **Phase 2（推奨）**: ProjectizedHistoryテーブル追加（1-2日）
3. **Phase 3（推奨）**: ProjectLevelTransitionHistoryテーブル追加（2-3日）
4. **Phase 4（推奨）**: VoteHistoryテーブル活用（2-3日）

**VoiceDriveチームへの確認事項**:
- ✅ Phase 1で基本機能が動作していることを確認
- 🟡 Phase 2-4の実装スケジュールの策定
- 🟡 PersonalStation Phase 2（VoteHistoryテーブル）との統合タイミング確認

---

## ✅ チェックリスト

### 医療システムチームのチェックリスト

- [x] 暫定マスターリスト受領確認
- [x] データ管理責任の確認（VoiceDrive 100%）
- [x] 必要なAPIの確認（既存APIのみ、新規不要）
- [x] 必要なテーブルの確認（医療システム側不要）
- [x] マスターデータ要件の確認（VoiceDrive側で完全管理）
- [x] データ同期要件の確認（既存同期で十分）
- [x] 医療システム確認結果文書作成（本文書）
- [ ] マスタープラン更新

---

### VoiceDriveチームのチェックリスト（参考）

- [ ] Phase 1基本機能動作確認
- [ ] ProjectizedHistoryテーブル実装検討（Phase 2）
- [ ] ProjectLevelTransitionHistoryテーブル実装検討（Phase 3）
- [ ] VoteHistoryテーブル活用検討（Phase 4）
- [ ] PersonalStation Phase 2との統合タイミング確認
- [ ] 実装スケジュール策定

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後

---

**🎉 結論: 医療システム側の対応は不要。VoiceDriveチームは独立して実装可能です。**
