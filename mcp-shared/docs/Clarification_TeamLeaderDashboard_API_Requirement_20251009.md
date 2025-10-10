# TeamLeaderDashboard API要求に関する確認事項

**文書番号**: MS-2025-1009-002
**作成日**: 2025年10月9日
**作成者**: 医療職員管理システムチーム
**宛先**: VoiceDriveチーム
**件名**: TeamLeaderDashboard暫定マスターリスト（VD-MASTER-TEAMLEADER-2025-1009-001）に関する確認

---

## 📢 確認の背景

VoiceDriveチームから受領した以下の2つの文書に矛盾が見られるため、確認をお願いします。

### 文書A: Response_TeamLeaderDashboard_Confirmation_20251009.md（既存）

**作成日**: 2025年10月9日
**ステータス**: ✅ 医療システムチームから回答済み

**確認-1の回答**: ❌ **Team概念なし（Option B採用）**

**決定内容**:
- ✅ Team = Department のエイリアス
- ✅ DepartmentStation API-3を流用（`GET /api/employees/department/{departmentId}`）
- ✅ 医療システム側の追加実装: **ゼロ**
- ✅ 開発コスト削減: **¥225,000**

**マスタープランへの反映状況**:
- ✅ Phase 8.5にOption B採用を反映済み（Version 2.7、10月10日）

---

### 文書B: TeamLeaderDashboard暫定マスターリスト（新規）

**文書番号**: VD-MASTER-TEAMLEADER-2025-1009-001
**作成日**: 2025年10月9日
**ステータス**: 🆕 本日受領

**API要求**:
- **API-5**: `GET /api/teams/{leaderId}/members` （新規実装要求）
- **API-6**: `GET /api/teams/{leaderId}/morale` （新規実装要求）

**優先度**: 🔴 HIGH
**納期希望**: 2週間以内

---

## ⚠️ 矛盾の詳細

### 文書Aでの決定事項（Option B）

```markdown
**採用シナリオ**: Team = Department のエイリアス

| 概念 | 医療システム | VoiceDrive表示 |
|------|------------|---------------|
| Team | Department（部門） | "チーム"として表示 |
| TeamLeader | permissionLevel >= 2.0 | "チームリーダー"として表示 |
| チームメンバー | 同じDepartmentのEmployee | **API-3で取得** |

**影響**:
- ✅ 医療システム側: 追加実装ゼロ（API-3をそのまま流用）
- ✅ VoiceDrive側: DepartmentStationコンポーネント流用、表示名のみ変更
- ✅ 開発工数削減: 5人日削減（API-5実装不要）
- ✅ 開発コスト削減: ¥225,000削減
```

### 文書Bでの要求（新規API実装）

```markdown
### API-5: チームメンバー情報取得API（新規）

**エンドポイント**: `GET /api/teams/{leaderId}/members`
**現状**: ❌ 未実装
**優先度**: 🔴 HIGH
**納期希望**: 2週間以内

### API-6: チームモラル情報取得API（新規）

**エンドポイント**: `GET /api/teams/{leaderId}/morale`
**現状**: ❌ 未実装
**優先度**: 🟡 MEDIUM
**納期希望**: 1ヶ月以内
```

---

## 🤔 矛盾の分析

### Option Bを採用した場合（既に回答済み）

| 項目 | Option B（採用済み） | 文書Bの要求 |
|------|------------------|-----------|
| **API** | DepartmentStation API-3流用 | API-5、API-6新規実装 |
| **エンドポイント** | `GET /api/employees/department/{departmentId}` | `GET /api/teams/{leaderId}/members` |
| **医療システム実装** | ゼロ | 2つの新規API実装 |
| **開発工数** | 0人日 | 約5人日 |
| **開発コスト** | ¥0 | 約¥250,000 |
| **コスト削減効果** | **+¥225,000削減** | **-¥225,000増加** |

---

## 📋 確認事項

VoiceDriveチームに以下の点を確認させてください：

### 確認-1: Option B採用の再確認

**質問**: 10月9日に医療システムチームから回答した**Option B（Team = Department、API-3流用）**の採用決定は有効ですか？

**選択肢**:
- **A**: ✅ 有効 → API-5、API-6の実装は不要（DepartmentStation API-3を流用）
- **B**: ❌ 無効 → API-5、API-6の新規実装が必要

**医療システムチームの推奨**: **Option A（有効）**

**理由**:
1. **既に回答済み**: Response_TeamLeaderDashboard_Confirmation_20251009.md（10月9日作成）
2. **マスタープラン反映済み**: Phase 8.5にOption B採用を反映（Version 2.7）
3. **コスト削減効果**: ¥225,000削減を達成
4. **技術的合理性**: Team = Departmentで機能要件を満たす

---

### 確認-2: API-5とAPI-3の関係

**質問**: もし新規API-5が必要な場合、DepartmentStation API-3との違いは何ですか？

**API-3のレスポンス** （既存、DepartmentStation用）:
```json
GET /api/employees/department/{departmentId}

{
  "department": {
    "departmentId": "medical_care_ward",
    "departmentName": "医療療養病棟",
    "memberCount": 12
  },
  "members": [
    {
      "employeeId": "OH-NS-2024-001",
      "name": "山田 太郎",
      "position": "主任",
      "permissionLevel": 2.0,
      "accountType": "MANAGER",
      "status": "active"
    },
    // ... 他のメンバー
  ]
}
```

**API-5のレスポンス** （文書Bで要求）:
```json
GET /api/teams/{leaderId}/members

{
  "leaderId": "OH-NS-2020-015",
  "teamMembers": [
    {
      "employeeId": "OH-NS-2024-001",
      "name": "山田 太郎",
      "role": "シニアエンジニア",
      "status": "active",
      "performance": 92.0
    }
  ],
  "totalMembers": 12,
  "teamEfficiency": 84.5
}
```

**分析**: API-3とAPI-5はほぼ同じデータを返します。

**違い**:
- パラメータ: `{departmentId}` vs `{leaderId}`
- フィールド名: `members` vs `teamMembers`、`position` vs `role`
- 追加フィールド: `performance`（評価スコア）、`teamEfficiency`（チーム効率）

**提案**: API-3を拡張してperformance、teamEfficiencyを追加する方が効率的

---

### 確認-3: API-6（チームモラル）の必要性

**質問**: API-6（チームモラル情報）は必須ですか？それとも将来実装でも問題ありませんか？

**API-6のレスポンス** （文書Bで要求）:
```json
GET /api/teams/{leaderId}/morale

{
  "moraleScore": 78.0,
  "breakdown": {
    "satisfactionRate": 78.0,
    "goalAchievementRate": 92.0,
    "communicationQuality": "good"
  }
}
```

**データソース**:
- `Interview.satisfactionScore` → 満足度
- `Goal.achievementRate` → 目標達成率

**医療システムチームの見解**:
- 🟡 **MEDIUM優先度**: チームモラル表示は有用だが、TeamLeaderDashboardの必須機能ではない
- 📅 **将来実装推奨**: Phase 8.5では承認タスク管理を優先し、モラル機能はPhase 8.6で実装

---

## 💡 医療システムチームの提案

### 提案-1: Option B採用の継続（推奨）

**理由**:
- ✅ 既に回答済み（Response_TeamLeaderDashboard_Confirmation_20251009.md）
- ✅ マスタープラン反映済み（Phase 8.5、Version 2.7）
- ✅ コスト削減効果: ¥225,000
- ✅ 技術的合理性: Team = Departmentで機能要件を満たす

**実装方針**:
| 機能 | 使用API | ステータス |
|------|---------|----------|
| チームメンバー一覧 | DepartmentStation API-3 | ✅ 既存流用 |
| チーム統計 | VoiceDrive側で集計 | 🟡 新規実装 |
| 承認待ちタスク | ApprovalTask集計 | 🟡 新規実装 |
| チームモラル | 将来実装（Phase 8.6） | ⏸️ 保留 |

**医療システム側の実装**: **ゼロ**
**VoiceDrive側の実装**: TeamLeaderService.ts（承認タスク集計のみ）

---

### 提案-2: API-3拡張（代替案）

もしAPI-5が必要な場合、新規APIではなく**既存のAPI-3を拡張**することを提案します。

**拡張内容**:
```json
GET /api/employees/department/{departmentId}?includePerformance=true

{
  "department": {
    "departmentId": "medical_care_ward",
    "departmentName": "医療療養病棟",
    "memberCount": 12,
    "teamEfficiency": 84.5  // 🆕 追加
  },
  "members": [
    {
      "employeeId": "OH-NS-2024-001",
      "name": "山田 太郎",
      "position": "主任",
      "permissionLevel": 2.0,
      "accountType": "MANAGER",
      "status": "active",
      "performance": 92.0  // 🆕 追加（includePerformance=true時のみ）
    }
  ]
}
```

**メリット**:
- ✅ 既存APIの拡張（新規API不要）
- ✅ DepartmentStationとTeamLeaderDashboardで同じAPIを使用
- ✅ 実装コスト削減（約2人日削減）

**デメリット**:
- 🟡 API-3のレスポンスが少し肥大化

---

### 提案-3: API-6（チームモラル）の将来実装

**理由**:
- 🟡 チームモラル機能は有用だが、TeamLeaderDashboardの必須機能ではない
- 📅 Phase 8.5では承認タスク管理を優先
- 📅 Phase 8.6でチームモラル機能を実装

**実装スケジュール案**:
| Phase | 実施期間 | 実装内容 |
|-------|---------|---------|
| Phase 8.5 | 11月18日〜26日 | 承認タスク管理、チームメンバー表示（API-3流用） |
| Phase 8.6 | 12月1日〜15日 | チームモラル機能（API-6実装） |

---

## 📅 次のアクション

### VoiceDriveチーム（即時回答お願いします）

1. **確認-1**: Option B（Team = Department、API-3流用）の採用決定は有効ですか？
   - ⬜ A: 有効（API-5、API-6不要）
   - ⬜ B: 無効（API-5、API-6必要）

2. **確認-2**: もしAPI-5が必要な場合、API-3拡張（提案-2）で問題ありませんか？
   - ⬜ はい（API-3拡張で対応）
   - ⬜ いいえ（新規API-5が必須）

3. **確認-3**: API-6（チームモラル）は将来実装（Phase 8.6）で問題ありませんか？
   - ⬜ はい（Phase 8.6で実装）
   - ⬜ いいえ（Phase 8.5で実装必須）

### 医療システムチーム（VoiceDriveチームの回答待ち）

- ⬜ VoiceDriveチームからの回答受領
- ⬜ 回答に基づくマスタープラン更新
- ⬜ Phase 8.5実装計画の最終確定

---

## 📎 関連ドキュメント

### 既存ドキュメント

| ドキュメント | 作成日 | ステータス |
|------------|--------|----------|
| Response_TeamLeaderDashboard_Confirmation_20251009.md | 10月9日 | ✅ 回答済み |
| TeamLeaderDashboard_DB要件分析_20251009.md | 10月9日 | ✅ 受領済み |
| TeamLeaderDashboard暫定マスタープラン_20251009.md | 10月9日 | ✅ 受領済み（本文書で確認中） |
| lightsail-integration-master-plan-20251005-updated.md（Phase 8.5） | 10月10日 | ✅ Option B反映済み |

### 作成予定ドキュメント

| ドキュメント | 作成予定日 | 内容 |
|------------|----------|------|
| VoiceDriveチームからの回答書 | 10月10日 | 本確認事項への回答 |
| Phase 8.5最終実装計画書 | 10月11日 | 回答に基づく最終計画 |

---

## 🙏 お願い

VoiceDriveチームの皆様

TeamLeaderDashboard暫定マスターリストのご提出、ありがとうございます。

ただし、既に10月9日に医療システムチームから回答済みの**Option B（Team = Department、API-3流用）**と矛盾が見られるため、上記の確認事項への回答をお願いいたします。

**医療システムチームとしては、既に回答済みのOption B採用を継続することを強く推奨します**（コスト削減¥225,000、実装工数削減5人日）。

ご確認のほど、よろしくお願いいたします。

---

## 📝 承認

### 医療システムチーム

- **作成者**: 医療システムプロジェクトリーダー
- **作成日**: 2025年10月10日
- **署名**: _____________________

### VoiceDriveチーム

- **確認者**: VoiceDriveプロジェクトリーダー
- **回答予定日**: 2025年10月10日
- **署名**: _____________________

---

**文書終了**

*本確認事項は両チームの円滑な連携のため、速やかな回答をお願いいたします。*
