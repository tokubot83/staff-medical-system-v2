# TeamLeaderDashboard統合実装 確認事項回答書

**作成日**: 2025年10月9日
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: Phase 8.5 TeamLeaderDashboard統合実装 確認事項への回答

---

## エグゼクティブサマリ

VoiceDriveチームから提示されたTeamLeaderDashboard統合実装に関する3つの確認事項について、医療システムチーム側の回答を以下に記載します。

**結論**:
- ✅ **Team概念なし（Option B）を採用** → DepartmentStation API-3流用
- ✅ **承認権限はVoiceDrive側でpermissionLevel判定** → 追加API不要
- ✅ **チーム統計はVoiceDrive側で集計** → 追加API不要

**医療システム側の追加実装**: **ゼロ**
**開発コスト削減**: **¥225,000**（Option Aとの差額）
**実装方式**: DepartmentStation成果物の完全流用

---

## 確認-1: 「Team（チーム）」概念の存在

### 質問1: 医療システムのデータベースに「Team」または「チーム」概念は存在しますか？

**回答**: ❌ **NO（Option B: Team概念なし）** 【推奨シナリオ採用】

#### 現在の組織構造

医療システムのデータベースには、以下の階層構造のみが定義されています：

```
施設（Facility）
  └─ 部門（Department）
      └─ 個人（Employee）
```

**Employeeテーブルスキーマ**:
```prisma
model Employee {
  id              String   @id @default(cuid())
  employeeId      String   @unique
  name            String
  position        String
  department      String   // 部門コード（例: "medical_care_ward"）
  facilityId      String   // 施設ID（例: "tategami_hospital"）
  permissionLevel Decimal  // 1.0〜18.0（25レベル体系）
  accountType     String   // NEW_STAFF, EXPERIENCED_STAFF, MANAGER, etc.
  isRetired       Boolean  @default(false)

  // Team関連のフィールドは存在しない
  // teamId         String?  ← 存在しません
  // isTeamLeader   Boolean? ← 存在しません
}
```

#### Team概念の不在理由

1. **組織構造のシンプル性**: 医療施設では「部門（Department）」が最小の組織単位
2. **権限レベル体系**: permissionLevel（1.0〜18.0）で役職・権限を管理
3. **リーダー識別**: `permissionLevel >= 2.0`（中堅職員以上）がリーダー相当
4. **既存システムとの整合性**: 過去10年間、部門ベースで運用中

#### TeamLeaderDashboardの実装方針

**採用シナリオ**: **Team = Department のエイリアス**

| 概念 | 医療システム | VoiceDrive表示 |
|------|------------|---------------|
| Team | Department（部門） | "チーム"として表示 |
| TeamLeader | permissionLevel >= 2.0 | "チームリーダー"として表示 |
| チームメンバー | 同じDepartmentのEmployee | API-3で取得 |

**具体例**:
```typescript
// VoiceDrive側の実装イメージ
const userDepartment = "medical_care_ward"; // User.department
const teamMembers = await fetch(`/api/employees/department/${userDepartment}`);
// → DepartmentStation API-3を流用

// TeamLeaderDashboard表示
<h1>チームリーダーダッシュボード</h1>
<p>あなたのチーム: 医療療養病棟</p> {/* departmentNameを表示 */}
```

### 影響

- ✅ **医療システム側**: 追加実装ゼロ（API-3をそのまま流用）
- ✅ **VoiceDrive側**: DepartmentStationコンポーネント流用、表示名のみ変更
- ✅ **開発工数削減**: 5人日削減（API-5実装不要）
- ✅ **開発コスト削減**: ¥225,000削減

---

## 確認-2: 承認ワークフローの権限管理

### 質問1: 医療システム側で承認権限を管理していますか？

**回答**: ❌ **NO（Option B）** 【推奨シナリオ採用】

#### 承認権限の管理方針

医療システムでは、承認権限を個別に管理するテーブルやフィールドは存在しません。
代わりに、**permissionLevel**（権限レベル）を基準に承認可否を判定する運用を推奨します。

**承認権限の判定基準**:

| permissionLevel | 役職例 | 承認可能範囲 |
|----------------|-------|------------|
| 1.0 | 新人職員 | ❌ 承認権限なし |
| 2.0〜4.0 | 中堅職員、主任 | ✅ 部門内の一部承認（休暇申請等） |
| 5.0〜9.0 | 統括主任、副課長 | ✅ 部門内の全承認 + 経費精算 |
| 10.0〜18.0 | 課長以上、施設管理者 | ✅ 施設全体の承認 |

**VoiceDrive側の実装例**:
```typescript
// ApprovalService.ts
function canApprove(user: User, task: ApprovalTask): boolean {
  const level = user.permissionLevel;

  switch (task.taskType) {
    case 'leave_request':
      return level >= 2.0; // 主任以上
    case 'expense_report':
      return level >= 5.0; // 統括主任以上
    case 'interview_sheet':
      return level >= 2.0; // 主任以上
    default:
      return level >= 5.0; // デフォルト: 統括主任以上
  }
}
```

### 質問3: 承認履歴を医療システム側で管理する必要がありますか？

**回答**: ❌ **NO（Option B）** 【推奨シナリオ採用】

#### 承認履歴の管理方針

承認履歴は**VoiceDrive内部のApprovalTaskテーブルのみで管理**します。

**理由**:
1. **データ管理責任分界点**: 承認フローはVoiceDrive固有機能（医療システムには存在しない）
2. **リアルタイム性**: 医療システムへのWebhook送信は不要（VoiceDrive内で完結）
3. **個人情報保護**: 承認内容に個人の機微情報が含まれる可能性あり（医療システムに送信しない）

**例外ケース（将来拡張）**:
- 医療システムの「面談シート承認」と連携する場合のみ、Webhook送信を検討
- 現時点では実装不要

### 影響

- ✅ **医療システム側**: 追加実装ゼロ（承認権限API不要、Webhook受信不要）
- ✅ **VoiceDrive側**: permissionLevelベースの判定ロジック実装（約50行）
- ✅ **セキュリティ**: 個人情報を医療システムに送信しない設計

---

## 確認-3: チーム統計の計算方法

### 質問1: 「チームのアクティブメンバー数」の定義は？

**回答**: **Option A: 退職していない職員（isRetired=false）** 【推奨】

#### アクティブメンバーの定義

```typescript
// 医療システムの定義
activeMembers = employees.filter(e => e.isRetired === false).length;
```

**理由**:
- 医療システムの`Employee.isRetired`フィールドが信頼できる唯一の情報源
- ログイン履歴は医療システムで管理していない（VoiceDrive側のデータ）
- 組織図・配置計画の基準として使用されている実績あり

**VoiceDrive側の実装**:
```typescript
// TeamStatsService.ts
async function getTeamActiveMembers(department: string): Promise<number> {
  // DepartmentStation API-3のレスポンスに含まれる
  const response = await fetch(`/api/employees/department/${department}`);
  return response.activeMembers; // API-3が返す値を使用
}
```

### 質問2: チーム統計は医療システム側で計算しますか、VoiceDrive側で計算しますか？

**回答**: **Option B（推奨）: VoiceDrive側で計算** → 追加API不要

#### チーム統計の計算方針

**医療システムから取得するデータ**（既存API-3、API-4で取得済み）:
- 部門メンバー一覧（API-3）
- 部門統計（総メンバー数、アクティブメンバー数、権限レベル分布）（API-4）

**VoiceDrive側で計算する統計**:
- チームプロジェクト数（VoiceDrive Projectテーブルから集計）
- 今月の投稿数（VoiceDrive Postテーブルから集計）
- 承認待ちタスク数（VoiceDrive ApprovalTaskテーブルから集計）
- 今月の承認数（VoiceDrive ApprovalTaskテーブルから集計）

**TeamStatsService実装例**:
```typescript
// src/services/TeamStatsService.ts
export async function getTeamStats(department: string): Promise<TeamStats> {
  // 医療システムから取得（API-4）
  const deptStats = await fetch(`/api/departments/${department}/statistics`);

  // VoiceDrive内部から集計
  const projectCount = await prisma.project.count({
    where: { department, status: 'active' }
  });

  const postCount = await prisma.post.count({
    where: {
      department,
      createdAt: { gte: startOfMonth(new Date()) }
    }
  });

  return {
    totalMembers: deptStats.totalMembers,        // API-4から
    activeMembers: deptStats.activeMembers,      // API-4から
    activeProjects: projectCount,                // VoiceDrive集計
    monthlyPosts: postCount,                     // VoiceDrive集計
    permissionLevelDistribution: deptStats.permissionLevelDistribution, // API-4から
  };
}
```

### 質問3: チームプロジェクトの紐付けは？

**回答**: **Option B（推奨）: VoiceDriveで管理** → プロジェクトテーブル拡張不要

#### チームプロジェクトの管理方針

**VoiceDrive Projectテーブル**に`department`フィールドを使用:

```prisma
model Project {
  id              String    @id @default(cuid())
  title           String
  description     String?   @db.Text
  department      String    // 部門コード（Team = Department）
  leaderId        String    // プロジェクトリーダーのuserId
  status          String    // active, completed, on_hold
  createdAt       DateTime  @default(now())

  // teamId は不要（department がチームID）

  @@index([department])
}
```

**チームプロジェクト取得**:
```typescript
// TeamLeaderDashboard
const userDepartment = currentUser.department; // "medical_care_ward"
const teamProjects = await prisma.project.findMany({
  where: { department: userDepartment }
});
```

### 影響

- ✅ **医療システム側**: 追加実装ゼロ（API-3、API-4で必要なデータ提供済み）
- ✅ **VoiceDrive側**: TeamStatsService実装（約200行、VoiceDrive内部集計のみ）
- ✅ **パフォーマンス**: VoiceDrive内部集計のため高速（< 100ms）

---

## 実装計画サマリ

### 医療システム側の実装

**新規実装**: **なし（ゼロ）**

**既存API流用**:
- ✅ API-3（部門メンバー一覧取得）→ TeamLeaderDashboardで流用
- ✅ API-4（部門統計情報取得）→ TeamStatsServiceで流用

**作業内容**:
- ⬜ 本回答書の確認・承認（10月10日）
- ⬜ VoiceDriveチームへの回答書送付（10月10日）

**開発工数**: **0人日**
**開発費**: **¥0**

---

### VoiceDrive側の実装

#### Phase 1実装（11月18日〜22日）

**新規テーブル作成**:
- ApprovalTaskテーブル（承認タスク管理）

**新規サービス実装**:
- ApprovalService.ts（約200行）
  - 承認待ちタスク取得
  - 承認・却下処理
  - 承認タスク統計
- TeamStatsService.ts（約200行）
  - チーム統計集計（VoiceDrive内部データから計算）
  - API-3、API-4のレスポンスを流用

**コンポーネント修正**:
- TeamLeaderDashboardPage.tsx
  - DepartmentStationPageのコンポーネントを流用
  - 表示名を「部門」→「チーム」に変更
  - ApprovalTaskセクション追加

**実装タスク**:

| 日付 | タスク | 成果物 | 工数 |
|------|--------|-------|------|
| 11月18日（月） | ApprovalTaskテーブル作成 | prisma/schema.prisma | 0.5人日 |
| 11月19日（火） | ApprovalService実装 | src/services/ApprovalService.ts | 2人日 |
| 11月20日（水） | TeamStatsService実装 | src/services/TeamStatsService.ts | 1人日 |
| 11月21日（木） | TeamLeaderDashboardPage修正 | src/pages/TeamLeaderDashboardPage.tsx | 1人日 |
| 11月22日（金） | ユニットテスト作成 | テストコード | 0.5人日 |

**開発工数**: **5人日**
**開発費**: **¥250,000**

#### 統合テスト（11月23日）

| テスト内容 | 期待結果 | 工数 |
|----------|---------|------|
| 承認タスク作成・承認・却下 | ApprovalTaskテーブルで正しく動作 | 0.5人日 |
| チームメンバー表示（API-3流用） | 部門メンバーが"チームメンバー"として表示 | 0.3人日 |
| チーム統計表示 | API-4 + VoiceDrive集計の統計が表示 | 0.2人日 |

**テスト工数**: **1人日**
**テスト費**: **¥50,000**

#### ドキュメント作成（11月24日〜25日）

- ApprovalTaskテーブル設計書
- ApprovalService仕様書
- TeamLeaderDashboard統合テスト報告書

**ドキュメント工数**: **0.5人日**
**ドキュメント費**: **¥25,000**

---

## コスト比較

### Option A（Team概念あり）vs Option B（Team概念なし）

| 項目 | Option A（Team概念あり） | Option B（Team概念なし、採用） | 差額 |
|-----|----------------------|--------------------------|------|
| **医療システム側** |
| API-5実装 | 3人日、¥150,000 | 0人日、¥0 | **-¥150,000** |
| 統合テスト | 1人日、¥50,000 | 0人日、¥0 | **-¥50,000** |
| ドキュメント | 0.5人日、¥25,000 | 0人日、¥0 | **-¥25,000** |
| **VoiceDrive側** |
| ApprovalTask実装 | 5人日、¥250,000 | 5人日、¥250,000 | ¥0 |
| 統合テスト | 1人日、¥50,000 | 1人日、¥50,000 | ¥0 |
| ドキュメント | 0.5人日、¥25,000 | 0.5人日、¥25,000 | ¥0 |
| **合計** | **11人日、¥550,000** | **6.5人日、¥325,000** | **-¥225,000** |

**コスト削減**: **¥225,000**（Option B採用により）

---

## 実装スケジュール

### 事前確認フェーズ（10月10日〜11月17日）

| 日付 | タスク | 担当 | 成果物 |
|------|--------|------|-------|
| 10月10日（木） | 本回答書の確認・承認 | 医療システムチーム | 承認済み回答書 |
| 10月10日（木） | VoiceDriveチームへ回答書送付 | 医療システムチーム | 送付完了通知 |
| 10月11日〜11月17日 | VoiceDrive側で設計準備 | VoiceDriveチーム | 設計書 |

### Phase 1実装（11月18日〜22日）

**VoiceDrive側のみ実装**:

| 日付 | タスク | 担当 | 成果物 |
|------|--------|------|-------|
| 11月18日（月） | ApprovalTaskテーブル作成 | VoiceDriveチーム | prisma/schema.prisma |
| 11月19日（火） | ApprovalService実装 | VoiceDriveチーム | ApprovalService.ts |
| 11月20日（水） | TeamStatsService実装 | VoiceDriveチーム | TeamStatsService.ts |
| 11月21日（木） | TeamLeaderDashboardPage修正 | VoiceDriveチーム | TeamLeaderDashboardPage.tsx |
| 11月22日（金） | ユニットテスト作成 | VoiceDriveチーム | テストコード |

**医療システム側**: 作業なし（待機のみ）

### 統合テスト（11月23日）

| 時間 | テスト内容 | 担当 |
|------|----------|------|
| 10:00〜11:00 | 承認タスク作成・承認・却下テスト | VoiceDriveチーム |
| 11:00〜12:00 | チームメンバー表示テスト（API-3流用確認） | 両チーム |
| 13:00〜14:00 | チーム統計表示テスト（API-4流用確認） | 両チーム |
| 14:00〜15:00 | 総合動作確認 | 両チーム |

### 本番リリース（11月26日）

| 時間 | タスク | 担当 |
|------|--------|------|
| 02:00〜03:00 | VoiceDrive本番環境デプロイ | VoiceDriveチーム |
| 03:00〜04:00 | 本番環境動作確認 | VoiceDriveチーム |
| 09:00〜10:00 | リリース完了報告書作成 | VoiceDriveチーム |

---

## リスク管理

### 想定リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| ApprovalTaskテーブル作成失敗 | 🔴 HIGH | 11月18日に優先実装、User外部キー制約を事前確認 |
| permissionLevel判定ロジックの複雑化 | 🟡 MEDIUM | 判定ルールを回答書に明記済み、実装前にVoiceDriveチームと確認 |
| API-3、API-4のパフォーマンス問題 | 🟡 MEDIUM | 既存DepartmentStation実装で問題なし、同様の実装でOK |
| チーム=部門の概念が利用者に伝わらない | 🟢 LOW | UI表示名で「チーム（部門）」のように併記 |

---

## 次のアクション

### 医療システム側（即時実行）

- ⬜ 本回答書の内部確認・承認（10月10日）
- ⬜ VoiceDriveチームへの回答書送付（10月10日）
- ⬜ 11月23日の統合テスト参加準備

### VoiceDrive側（即時実行）

- ⬜ 回答書の受領・確認（10月10日）
- ⬜ ApprovalTaskテーブルスキーマ最終設計（10月11日〜15日）
- ⬜ ApprovalService、TeamStatsService設計（10月16日〜31日）
- ⬜ マイグレーションファイル生成（11月1日〜17日）
- ⬜ Phase 1実装開始（11月18日）

---

## 関連ドキュメント

### 既存ドキュメント
- [TeamLeaderDashboard DB要件分析_20251009.md](./TeamLeaderDashboard_DB要件分析_20251009.md)
- [TeamLeaderDashboard暫定マスターリスト_20251009.md](./TeamLeaderDashboard暫定マスターリスト_20251009.md)
- [DepartmentStation暫定マスターリスト_20251009.md](./DepartmentStation暫定マスターリスト_20251009.md)（API-3、API-4仕様）
- [データ管理責任分界点定義書_20251008.md](./データ管理責任分界点定義書_20251008.md)
- [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md)（Phase 8.5）

### 作成予定ドキュメント
- [ ] ApprovalTaskテーブル設計書（VoiceDriveチーム、11月18日）
- [ ] ApprovalService仕様書（VoiceDriveチーム、11月19日）
- [ ] TeamStatsService仕様書（VoiceDriveチーム、11月20日）
- [ ] Phase 1統合テスト報告書（TeamLeaderDashboard）（両チーム、11月23日）

---

## 承認

### 医療システムチーム

- **承認者**: 医療システムプロジェクトリーダー
- **承認日**: 2025年10月10日（予定）
- **署名**: _____________________

### VoiceDriveチーム

- **確認者**: VoiceDriveプロジェクトリーダー
- **確認日**: 2025年10月10日（予定）
- **署名**: _____________________

---

**文書終了**

*本回答書は両チームの合意のもと、Phase 8.5実装の正式な仕様として扱われます。*
