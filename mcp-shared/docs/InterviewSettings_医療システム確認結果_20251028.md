# InterviewSettingsPage 医療システム確認結果書

**作成日**: 2025-10-28
**対象ページ**: InterviewSettingsPage（VoiceDrive側）
**分析者**: 医療職員カルテシステム開発チーム
**確認結果**: ✅ **医療システム側対応不要（マスター管理のみ）**

---

## 📋 目次

1. [確認概要](#確認概要)
2. [分析結果](#分析結果)
3. [責任分界点の確認](#責任分界点の確認)
4. [医療システム側の役割](#医療システム側の役割)
5. [VoiceDrive側の実装要件](#voicedrive側の実装要件)
6. [連携仕様](#連携仕様)
7. [マスタープラン更新](#マスタープラン更新)

---

## 1. 確認概要

### VoiceDrive側からの依頼内容

VoiceDriveチームがInterviewSettingsPage（面談設定ページ）のDB構築を計画しており、医療システム側で対応が必要か確認要請を受けました。

**依頼書類**:
- `InterviewSettingsPage暫定マスターリスト_20251028.md`
- `InterviewSettingsPage_DB要件分析_20251028.md`

### 確認結論

✅ **医療システム側で追加実装は不要**

**理由**:
1. 面談タイプマスターは既に医療システムが管理中（`mcp-shared/config/interview-types.json`）
2. スケジュール設定・予約制限設定はVoiceDrive独自の運用ルール（VoiceDrive完全管理）
3. 医療システムは**読み取り専用の参照元**として機能（変更・追加不要）

---

## 2. 分析結果

### 2-1. 既存ファイルの確認

医療システム側で既に管理している面談タイプマスター:

| ファイル | 場所 | 内容 | 最終更新 |
|---------|------|------|---------|
| `interview-types.json` | `mcp-shared/config/` | 面談タイプマスター（共有） | 2025-08-10 |
| `interview-types.json` | `src/config/` | 面談タイプマスター（医療システム内部） | 2025-08-10 |

**内容**:
- 面談分類（classifications）: 3種類（定期・特別・サポート）
- 面談タイプ（interviewTypes）: 10種類
- 面談カテゴリ（categories）: 3カテゴリ×計12サブカテゴリ

### 2-2. VoiceDrive側の要件

| データ種別 | 内容 | 管理責任 | 医療システム対応 |
|-----------|------|---------|----------------|
| **面談タイプマスター** | 10種類の面談タイプ定義 | 🔴 **医療システム** | ✅ **対応済み** |
| **面談分類** | 定期・特別・サポート | 🔴 **医療システム** | ✅ **対応済み** |
| **面談カテゴリ** | キャリア・職場環境・個別相談 | 🔴 **医療システム** | ✅ **対応済み** |
| **面談タイプ有効化設定** | VoiceDrive側でON/OFF管理 | 🟦 **VoiceDrive** | ❌ **不要** |
| **スケジュール設定** | 開始時刻、終了時刻、枠数等 | 🟦 **VoiceDrive** | ❌ **不要** |
| **予約制限設定** | 予約上限、キャンセル期限等 | 🟦 **VoiceDrive** | ❌ **不要** |

---

## 3. 責任分界点の確認

### 3-1. データ管理責任

```
┌─────────────────────────────────────────────────────────────┐
│                   医療システム管理範囲                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 面談タイプマスター（interview-types.json）               │   │
│  │  - 面談分類（3種類）                                    │   │
│  │  - 面談タイプ（10種類）                                 │   │
│  │  - 面談カテゴリ（12サブカテゴリ）                       │   │
│  │  - 各タイプの基本属性（頻度、対象、トリガー等）          │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓ 参照（READ ONLY）                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   VoiceDrive管理範囲                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 面談タイプ有効化設定（InterviewTypeConfig）             │   │
│  │  - enabled（有効/無効フラグ）                          │   │
│  │  - displayOrder（表示順序）                           │   │
│  │  - customName（独自呼称、オプション）                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ スケジュール設定（InterviewSystemSetting: schedule）    │   │
│  │  - startTime（開始時刻）                               │   │
│  │  - endTime（終了時刻）                                 │   │
│  │  - slotDuration（1回の時間）                          │   │
│  │  - maxSlotsPerDay（1日の枠数）                        │   │
│  │  - nightShiftSlots（夜勤者特別時間帯）                 │   │
│  │  - advanceBookingDays（予約可能期間）                  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 予約制限設定（InterviewSystemSetting: restriction）     │   │
│  │  - newEmployeeRequired（新入職員面談必須）              │   │
│  │  - 各種予約上限（月間・年間）                           │   │
│  │  - cancellationDeadlineHours（キャンセル期限）         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3-2. 更新権限

| データ項目 | 更新権限 | 更新頻度 | 更新手段 |
|-----------|---------|---------|---------|
| **面談タイプマスター** | 医療システム管理者 | 低頻度（年1-2回） | JSONファイル直接編集 |
| **有効化設定** | VoiceDrive Level 99 | 月1回程度 | InterviewSettingsPage |
| **スケジュール設定** | VoiceDrive Level 99 | 週1回程度 | InterviewSettingsPage |
| **予約制限設定** | VoiceDrive Level 99 | 月1回程度 | InterviewSettingsPage |

---

## 4. 医療システム側の役割

### 4-1. 現状の役割

✅ **面談タイプマスター管理**（対応済み）

**場所**: `mcp-shared/config/interview-types.json`

**内容**:
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-08-10",
  "classifications": [...],
  "interviewTypes": [...],
  "categories": {...}
}
```

### 4-2. 今回の対応

✅ **追加実装不要**

**理由**:
1. 既に必要なマスターデータが存在
2. VoiceDrive側の要件を100%満たしている
3. ファイル形式・データ構造が仕様に合致
4. `mcp-shared/config/`経由でVoiceDrive側から参照可能

### 4-3. 将来的な役割（オプション）

**Phase 2以降で検討可能な拡張機能**:

1. **面談タイプマスターAPI提供**（優先度: 低）
   ```
   GET /api/medical/interview-types
   ```
   - 現在: VoiceDriveがJSONファイル直接読み込み
   - 将来: API経由で取得（バージョン管理、履歴管理）

2. **面談タイプ変更通知Webhook**（優先度: 低）
   ```
   POST /api/webhooks/interview-type-updated
   ```
   - VoiceDrive側のキャッシュ無効化
   - 設定変更の自動反映

**重要**: 現時点では**不要**（VoiceDrive側の要件に含まれていない）

---

## 5. VoiceDrive側の実装要件

### 5-1. 新規テーブル（2個）

#### テーブル1: InterviewTypeConfig

```prisma
model InterviewTypeConfig {
  id             String   @id @default(cuid())
  interviewTypeId String  @unique @map("interview_type_id")  // 医療システムのID参照
  enabled        Boolean  @default(true)
  displayOrder   Int?     @default(0) @map("display_order")
  customName     String?  @map("custom_name")
  notes          String?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  @@map("interview_type_configs")
}
```

**初期データ**: 10件（面談タイプIDを医療システムから参照）

#### テーブル2: InterviewSystemSetting

```prisma
model InterviewSystemSetting {
  id           String   @id @default(cuid())
  category     String                                     // 'schedule' or 'restriction'
  settingKey   String   @map("setting_key")
  settingValue String   @map("setting_value")
  valueType    String   @map("value_type")                // 'string', 'number', 'boolean', 'time'
  description  String
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@unique([category, settingKey])
  @@map("interview_system_settings")
}
```

**初期データ**: 12件（スケジュール6件 + 予約制限6件）

### 5-2. 新規API（6個）

| エンドポイント | メソッド | 用途 |
|--------------|---------|------|
| `/api/interview/settings/types` | GET | 面談タイプ設定一覧取得（医療マスター+VoiceDrive設定マージ） |
| `/api/interview/settings/types` | PUT | 面談タイプ有効化設定更新 |
| `/api/interview/settings/schedule` | GET | スケジュール設定取得 |
| `/api/interview/settings/schedule` | PUT | スケジュール設定更新 |
| `/api/interview/settings/restrictions` | GET | 予約制限設定取得 |
| `/api/interview/settings/restrictions` | PUT | 予約制限設定更新 |

### 5-3. 実装スケジュール（VoiceDrive側）

| Phase | 作業内容 | 工数 | 状態 |
|-------|---------|------|------|
| **Phase 1** | DB設計・テーブル作成 | 4.5時間 | ⏳ 提案中 |
| **Phase 2** | API実装（6エンドポイント） | 8時間 | ⏳ 提案中 |
| **Phase 3** | フロントエンド統合 | 5時間 | ⏳ 提案中 |
| **合計** | - | **17.5時間** | ⏳ 提案中 |

---

## 6. 連携仕様

### 6-1. データ取得方法

#### 方式A: mcp-shared/config/interview-types.json 直接読み込み（推奨）

**VoiceDrive側実装例**:
```typescript
// VoiceDrive側: src/lib/medical-interview-types.ts
import interviewConfig from '../../../mcp-shared/config/interview-types.json';

export function getMedicalInterviewTypes() {
  return interviewConfig.interviewTypes;
}

export function getMedicalClassifications() {
  return interviewConfig.classifications;
}

export function getMedicalCategories() {
  return interviewConfig.categories;
}
```

**メリット**:
- ✅ シンプル（ファイル読み込みのみ）
- ✅ リアルタイム反映（ファイル更新時）
- ✅ API不要（医療システム側の負担ゼロ）

**デメリット**:
- ⚠️ バージョン管理が弱い
- ⚠️ 履歴管理なし

#### 方式B: 医療システムAPIから取得（将来実装オプション）

**医療システム側API**（現時点では不要）:
```typescript
// GET /api/medical/interview-types
{
  "version": "1.0.0",
  "lastUpdated": "2025-08-10",
  "interviewTypes": [...],
  "classifications": [...],
  "categories": {...}
}
```

**VoiceDrive側実装例**:
```typescript
const response = await fetch('/api/medical/interview-types');
const data = await response.json();
```

**メリット**:
- ✅ バージョン管理可能
- ✅ 履歴管理可能
- ✅ キャッシュ制御可能

**デメリット**:
- ❌ API実装が必要（医療システム側）
- ❌ 複雑性が増す

**結論**: 現時点では**方式A（直接読み込み）を推奨**

### 6-2. データマージロジック（VoiceDrive側実装）

```typescript
// VoiceDrive側: src/app/api/interview/settings/types/route.ts
import { getMedicalInterviewTypes } from '@/lib/medical-interview-types';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // 1. 医療システムのマスターを取得
  const medicalTypes = getMedicalInterviewTypes();

  // 2. VoiceDriveの有効化設定を取得
  const configs = await prisma.interviewTypeConfig.findMany();

  // 3. マージ
  const mergedTypes = medicalTypes.map((type) => {
    const config = configs.find((c) => c.interviewTypeId === type.id);
    return {
      ...type,
      enabled: config?.enabled ?? true,
      displayOrder: config?.displayOrder ?? type.sortOrder,
      customName: config?.customName,
    };
  });

  return Response.json({ types: mergedTypes });
}
```

### 6-3. 更新フロー

```
┌─────────────────────────────────────────────────────────────┐
│ Level 99がInterviewSettingsPageで「退職面談」を無効化          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ VoiceDrive: InterviewTypeConfigテーブル更新                    │
│  UPDATE interview_type_configs                               │
│  SET enabled = false                                         │
│  WHERE interview_type_id = 'exit_interview'                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ VoiceDrive: 面談予約画面で「退職面談」が選択不可になる         │
└─────────────────────────────────────────────────────────────┘

※ 医療システム側では何も起きない（マスターは変更なし）
```

---

## 7. マスタープラン更新

### 7-1. 更新の必要性

❌ **マスタープラン更新は不要**

**理由**:
1. 医療システム側で新規実装なし
2. 既存のマスター管理のみ継続
3. VoiceDrive側の独自実装（医療システムは関与しない）

### 7-2. 関連する既存Phase

InterviewSettingsPageは以下の既存Phaseと関連がありますが、新規Phaseの追加は不要です。

| Phase | 内容 | 関連性 | 状態 |
|-------|------|--------|------|
| **Phase 2.6** | UserManagementPage API実装 | 面談機能の基盤 | ✅ 完了 |
| **Phase 2.7** | SettingsPage API実装 | 設定ページ | ✅ 完了 |
| **Phase 3** | 施設別権限レベル管理 | 面談予約権限 | ✅ 完了 |

### 7-3. AI_SUMMARY.md更新

VoiceDriveチームへの情報共有として、`mcp-shared/docs/AI_SUMMARY.md`に追記を推奨します。

**追記内容**:
```markdown
## 🆕 最新：InterviewSettingsPage DB構築準備完了（10/28）

### ✅ **医療システム確認完了 - 追加実装不要**

**確認日時**: 2025年10月28日
**対象機能**: InterviewSettingsPage（面談設定ページ）
**確認結果**: **医療システム側の追加実装は不要** ✅

#### 確認結論サマリー

| 項目 | VoiceDrive | 医療システム |
|------|-----------|------------|
| 面談タイプマスター | 参照のみ | ✅ マスタ管理済み |
| 面談分類・カテゴリ | 参照のみ | ✅ マスタ管理済み |
| タイプ有効化設定 | ✅ 100%管理 | ❌ 関与なし |
| スケジュール設定 | ✅ 100%管理 | ❌ 関与なし |
| 予約制限設定 | ✅ 100%管理 | ❌ 関与なし |

#### データ連携方式

**推奨方式**: mcp-shared/config/interview-types.json 直接読み込み

```typescript
// VoiceDrive側実装例
import interviewConfig from '../../../mcp-shared/config/interview-types.json';
const types = interviewConfig.interviewTypes;
```

**医療システム側**:
- ✅ マスターファイル管理継続（mcp-shared/config/interview-types.json）
- ❌ 新規API実装不要
- ❌ 新規テーブル不要

#### VoiceDrive側実装要件（4日間の実装計画）

**新規テーブル（2個）**:
- `InterviewTypeConfig`（面談タイプ有効化設定）
- `InterviewSystemSetting`（スケジュール・予約制限設定）

**API実装（6個）**:
1. GET /api/interview/settings/types - 面談タイプ設定取得
2. PUT /api/interview/settings/types - 面談タイプ有効化更新
3. GET /api/interview/settings/schedule - スケジュール設定取得
4. PUT /api/interview/settings/schedule - スケジュール設定更新
5. GET /api/interview/settings/restrictions - 予約制限設定取得
6. PUT /api/interview/settings/restrictions - 予約制限設定更新

**推定工数**: 17.5時間（Phase 1: 4.5時間、Phase 2: 8時間、Phase 3: 5時間）

#### 関連ドキュメント（NEW）

1. **医療システム確認結果** ⭐⭐⭐ **LATEST (10/28)**
   - `mcp-shared/docs/InterviewSettings_医療システム確認結果_20251028.md`
   - 確認結論、責任分界点、連携仕様

2. **暫定マスターリスト（VoiceDrive側）**
   - `mcp-shared/docs/InterviewSettingsPage暫定マスターリスト_20251028.md`
   - 全22データ項目の詳細仕様

3. **DB要件分析書（VoiceDrive側）**
   - `mcp-shared/docs/InterviewSettingsPage_DB要件分析_20251028.md`
   - DB設計詳細、テーブル定義、インデックス設計

#### 次のアクション

**医療システムチーム（本チーム）**:
- [x] ✅ DB要件分析確認
- [x] ✅ 医療システム確認結果作成
- [x] ✅ マスター管理継続（追加実装なし）

**VoiceDriveチーム**:
- [ ] 医療システム確認結果のレビュー
- [ ] DB実装開始（2テーブル）
- [ ] API実装（6エンドポイント）
- [ ] フロントエンド統合
```

---

## 📝 まとめ

### 医療システム側

✅ **追加実装不要**

**現状維持**:
- 面談タイプマスター管理（`mcp-shared/config/interview-types.json`）
- VoiceDrive側からの参照を許可（READ ONLY）

**今後の対応**:
- なし（現状のマスター管理継続のみ）

### VoiceDrive側

⏳ **実装が必要**（17.5時間）

**実装内容**:
- DB設計・テーブル作成（2テーブル）
- API実装（6エンドポイント）
- フロントエンド統合（InterviewSettingsPage）

### データ連携

✅ **方式決定**

**推奨方式**: mcp-shared/config/interview-types.json 直接読み込み

**メリット**:
- シンプル
- リアルタイム反映
- API実装不要

### マスタープラン

❌ **更新不要**

**理由**:
- 医療システム側で新規実装なし
- 既存のマスター管理継続のみ

### 重要な確認事項

⚠️ **VoiceDriveチームへの確認依頼**

1. ✅ 医療システム確認結果のレビュー・承認
2. ✅ データ連携方式の確認（mcp-shared/config/直接読み込みでOK？）
3. ✅ 実装スケジュールの確認（17.5時間で実装可能？）
4. ✅ API Key設定の確認（不要の確認）

---

## 📊 データサマリー

### 医療システム管理データ

| データ種別 | 件数 | 場所 | 更新頻度 |
|-----------|------|------|---------|
| **面談分類** | 3件 | `mcp-shared/config/interview-types.json` | 年1-2回 |
| **面談タイプ** | 10件 | 同上 | 年1-2回 |
| **面談カテゴリ** | 3カテゴリ×12サブカテゴリ | 同上 | 年1-2回 |

### VoiceDrive管理データ（予定）

| データ種別 | 件数 | テーブル | 更新頻度 |
|-----------|------|---------|---------|
| **タイプ有効化設定** | 10件 | `interview_type_configs` | 月1回 |
| **スケジュール設定** | 6件 | `interview_system_settings` | 週1回 |
| **予約制限設定** | 6件 | `interview_system_settings` | 月1回 |

---

## 🔄 連絡履歴

### 2025-10-28

- **受領**: VoiceDrive側からInterviewSettingsPage DB構築依頼書2件受領
- **分析**: 医療システム側対応必要性を分析
- **結論**: 医療システム側追加実装不要と判断
- **作成**: 本確認結果書を作成
- **共有**: mcp-shared/docs/へ配置（VoiceDriveチーム参照可能）

---

**作成日**: 2025-10-28
**最終更新**: 2025-10-28
**次のステップ**: VoiceDriveチームからの確認・承認待ち

---

**医療職員カルテシステム開発チーム**
**2025年10月28日**
