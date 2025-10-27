# ProjectDetailPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-007
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: ProjectDetailPage DB要件分析に対する医療システム側確認結果
**参照文書**:
- ProjectDetailPage暫定マスターリスト_20251026（VoiceDrive提供）
- ProjectDetailPage_DB要件分析_20251026（VoiceDrive提供）
- [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md)
- [ProjectListPage_医療システム確認結果_20251026.md](./ProjectListPage_医療システム確認結果_20251026.md)

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「ProjectDetailPage DB要件分析」に対する医療システム側の確認結果です。

### 結論: ❌ **医療システム側の追加対応は不要**

ProjectDetailPageはVoiceDrive独自のプロジェクト管理機能であり、医療システムからは**職員マスターデータのみを提供**します。
プロジェクト管理データ（承認フロー、メンバー管理、投票機能等）は**VoiceDrive独自の責任範囲**です。

| 項目 | 医療システム対応 | 備考 |
|------|----------------|------|
| **職員マスターAPI** | ✅ **実装済み** | GET /api/v2/employees |
| **施設マスターAPI** | ✅ **実装済み** | GET /api/v2/facilities |
| **部署マスターAPI** | ✅ **実装済み** | GET /api/v2/departments |
| **Webhook通知** | ✅ **実装済み** | Phase 3完了（2025年10月2日） |
| **プロジェクト管理機能** | ❌ **対応不要** | VoiceDrive独自機能 |
| **追加実装必要** | ❌ **なし** | 全API実装完了 |

---

## 🔍 データ管理責任分界点の確認

### 医療システムが管理するマスターデータ

| データ種別 | 提供方法 | 実装状況 |
|----------|---------|---------|
| **職員マスター** | API + Webhook | ✅ 実装済み |
| **施設マスター** | API | ✅ 実装済み |
| **部署マスター** | API | ✅ 実装済み |

### VoiceDriveが管理するプロジェクトデータ

| データ種別 | 医療システムAPI必要性 |
|----------|-------------------|
| プロジェクト基本情報 | ❌ 不要 |
| 承認フロー | ❌ 不要 |
| プロジェクトメンバー | ❌ 不要 |
| 投票・合意形成 | ❌ 不要 |
| プロジェクトステータス | ❌ 不要 |
| タイムライン | ❌ 不要 |

**重要**: VoiceDriveの`ProjectApproval`テーブル・`ProjectTeamMember`テーブル・`VoteHistory`テーブルは**VoiceDrive独自のDB**であり、医療システムとは無関係です。

---

## ✅ ProjectDetailPage で必要な医療システムデータの確認

### 1. 著者情報（Author）

#### VoiceDrive要件
```typescript
author: {
  name: string;        // 職員名
  department: string;  // 部署名
  avatar?: string;     // アバター画像
}
```

#### 医療システム提供API

✅ **GET /api/v2/employees/:employeeId**

```json
{
  "data": {
    "employeeId": "emp-001",
    "name": "山田 太郎",
    "department": {
      "departmentName": "リハビリテーション科"
    },
    "avatar": "https://example.com/avatars/emp-001.jpg"
  }
}
```

**対応状況**: ✅ **100%対応済み**

---

### 2. 承認者情報（Approver）

#### VoiceDrive要件
```typescript
approver: {
  name: string;      // 承認者名
  position: string;  // 役職
}
```

#### 医療システム提供API

✅ **GET /api/v2/employees/:employeeId**

```json
{
  "data": {
    "employeeId": "emp-002",
    "name": "佐藤 部長",
    "position": "部門長"
  }
}
```

**対応状況**: ✅ **100%対応済み**

---

### 3. プロジェクトメンバー情報

#### VoiceDrive要件
```typescript
member: {
  name: string;       // メンバー名
  department: string; // 部署名
}
```

#### 医療システム提供API

✅ **GET /api/v2/employees/:employeeId**

```json
{
  "data": {
    "employeeId": "emp-003",
    "name": "田中 花子",
    "department": {
      "departmentName": "看護部"
    }
  }
}
```

**対応状況**: ✅ **100%対応済み**

---

## 📊 VoiceDrive側の実装範囲（医療システム対応不要）

### 1. プロジェクト基本情報

**VoiceDrive独自管理データ**:
- `projectId`, `title`, `content`, `category`, `status`
- `createdAt`, `consensusLevel`, `upvotes`, `downvotes`

**医療システム連携**:
- `author.employeeId` → 医療システムAPI経由で職員情報取得

**結論**: ❌ **医療システム側の対応不要**

---

### 2. 承認フロー詳細

**VoiceDrive独自管理データ**:
- `ProjectApproval`テーブル（VoiceDrive DB）
  - `approvalLevel`, `status`, `approvedAt`, `comments`

**医療システム連携**:
- `approverId` → 医療システムAPI経由で承認者情報取得

**結論**: ❌ **医療システム側の対応不要**

---

### 3. プロジェクトメンバー管理

**VoiceDrive独自管理データ**:
- `ProjectTeamMember`テーブル（VoiceDrive DB）
  - `role`, `status`, `joinedAt`

**医療システム連携**:
- `userId` → 医療システムAPI経由でメンバー情報取得

**結論**: ❌ **医療システム側の対応不要**

---

### 4. 投票・合意形成

**VoiceDrive独自管理データ**:
- `VoteHistory`テーブル（VoiceDrive DB）
  - `voteOption`, `votedAt`, `voteWeight`
- `ProjectSummary`テーブル（VoiceDrive DB）
  - `upvotes`, `downvotes`, `consensusLevel`

**医療システム連携**:
- なし（完全にVoiceDrive独自機能）

**結論**: ❌ **医療システム側の対応不要**

---

## 🎯 医療システム側の対応結論

### ✅ 既に実装済み

1. ✅ **職員マスターAPI** - GET /api/v2/employees
   - 個別取得・リスト取得対応
   - 施設別・部署別フィルタリング対応
   - 部署・施設情報付与
   - API Key認証・Rate Limit実装済み
   - **実装日**: 2025年10月10日完了

2. ✅ **施設マスターAPI** - GET /api/v2/facilities
   - 個別取得・リスト取得対応
   - 施設コード検索対応
   - API Key認証・Rate Limit実装済み
   - **実装日**: 2025年10月10日完了

3. ✅ **部署マスターAPI** - GET /api/v2/departments
   - 個別取得・リスト取得対応
   - 施設別フィルタリング対応
   - 施設情報付与
   - API Key認証・Rate Limit実装済み
   - **実装日**: 2025年10月10日完了

4. ✅ **Webhook通知システム**
   - 職員情報変更イベント通知
   - リトライ機構付き
   - **実装日**: Phase 3完了（2025年10月2日）

### ❌ 追加実装不要

**理由**:
- ProjectDetailPageで必要な医療システムのデータは**職員・施設・部署情報のみ**
- プロジェクト管理データは**VoiceDrive独自の責任範囲**
- 既存API + Webhookで全ての要件を満たしている

### 🔴 医療システムにプロジェクト管理機能は実装しない

医療システムは**職員マスターデータの提供のみ**を担当します。
以下の機能は医療システムでは実装しません：

- ❌ `Project`テーブルの作成
- ❌ `ProjectApproval`テーブルの作成
- ❌ `ProjectTeamMember`テーブルの作成
- ❌ `VoteHistory`テーブルの作成
- ❌ `ProjectSummary`テーブルの作成
- ❌ 承認フローAPI
- ❌ プロジェクトメンバー管理API
- ❌ 投票機能API

これらは全て**VoiceDrive側で実装・管理**してください。

---

## 📋 VoiceDriveチームへの推奨事項

### 1. 職員情報の取得実装

**推奨実装**:
```typescript
// VoiceDrive側: src/services/MedicalSystemService.ts

/**
 * 職員情報を取得（キャッシュ付き）
 */
export async function fetchEmployee(
  employeeId: string
): Promise<Employee | null> {
  // まずキャッシュを確認
  const cached = await db.employeeCache.findUnique({
    where: { employeeId }
  });

  if (cached && isCacheFresh(cached.updatedAt)) {
    return cached;
  }

  // APIから取得
  const response = await fetch(
    `${MEDICAL_SYSTEM_URL}/api/v2/employees/${employeeId}`,
    {
      headers: {
        'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY!,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    console.error(`Failed to fetch employee ${employeeId}`);
    return cached; // キャッシュをフォールバックとして使用
  }

  const result = await response.json();
  const employee = result.data;

  // キャッシュを更新
  await db.employeeCache.upsert({
    where: { employeeId },
    update: employee,
    create: employee
  });

  return employee;
}
```

### 2. ProjectDetailPageのデータ取得フロー

**推奨フロー**:

```typescript
// VoiceDrive側: src/services/ProjectDetailService.ts

export async function getProjectDetail(projectId: string) {
  // 1. VoiceDrive DBからプロジェクト情報取得
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      approvals: true,
      teamMembers: true,
      votes: true
    }
  });

  // 2. 医療システムAPIから著者情報取得
  const author = await MedicalSystemService.fetchEmployee(project.authorId);

  // 3. 医療システムAPIから承認者情報取得
  const approvers = await Promise.all(
    project.approvals.map(a =>
      MedicalSystemService.fetchEmployee(a.approverId)
    )
  );

  // 4. 医療システムAPIからメンバー情報取得
  const members = await Promise.all(
    project.teamMembers.map(m =>
      MedicalSystemService.fetchEmployee(m.userId)
    )
  );

  // 5. データ統合
  return {
    ...project,
    author: {
      name: author.name,
      department: author.department.departmentName,
      avatar: author.avatar
    },
    approvalFlow: project.approvals.map((approval, index) => ({
      ...approval,
      approver: approvers[index].name,
      approverPosition: approvers[index].position
    })),
    selectedMembers: project.teamMembers.map((member, index) => ({
      ...member,
      name: members[index].name,
      department: members[index].department.departmentName
    })),
    // 投票統計はVoiceDrive DBから計算
    consensusLevel: calculateConsensusLevel(project.votes),
    upvotes: project.votes.filter(v => v.voteOption.includes('support')).length,
    downvotes: project.votes.filter(v => v.voteOption.includes('oppose')).length
  };
}
```

### 3. Webhook受信による職員情報の即時更新

**推奨実装**:
```typescript
// VoiceDrive側: app/api/webhooks/medical-system/route.ts

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // 職員情報更新イベント
    if (payload.event === 'employee.updated') {
      const { employeeId, name, department, position, avatar } = payload.data;

      // キャッシュを即座に更新
      await db.employeeCache.upsert({
        where: { employeeId },
        update: {
          name,
          department: department.departmentName,
          position,
          avatar,
          updatedAt: new Date()
        },
        create: {
          employeeId,
          name,
          department: department.departmentName,
          position,
          avatar
        }
      });

      // ProjectDetailPageのキャッシュをクリア
      await clearProjectDetailCache(employeeId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4. VoiceDrive側のDB実装チェックリスト

#### Phase 1: 基本データ構造（必須）

- [ ] `Project`テーブル実装
  - [ ] `votingDeadline`フィールド追加
- [ ] `ProjectApproval`テーブル実装
- [ ] `ProjectTeamMember`テーブル実装
- [ ] `VoteHistory`テーブル追加
- [ ] `ProjectSummary`テーブル実装
  - [ ] 投票統計フィールド追加

#### Phase 2: API実装

- [ ] ProjectDetailService実装
- [ ] ProjectApprovalService実装
- [ ] ProjectTeamService実装
- [ ] ProjectVoteService実装

#### Phase 3: 医療システム連携

- [ ] MedicalSystemService実装
- [ ] 職員情報キャッシュ機能
- [ ] Webhook受信エンドポイント
- [ ] エラーハンドリング

---

## 🔗 既存APIドキュメント

### 1. 職員マスターAPI

**エンドポイント**: `GET /api/v2/employees/:employeeId`
**実装ファイル**: [src/app/api/v2/employees/[employeeId]/route.ts](../../src/app/api/v2/employees/[employeeId]/route.ts)
**OpenAPI仕様**: `organization-analytics_API仕様書_20251010.yaml`

**レスポンス例**:
```json
{
  "data": {
    "employeeId": "emp-001",
    "name": "山田 太郎",
    "email": "yamada@example.com",
    "department": {
      "departmentId": "dept-001",
      "departmentName": "リハビリテーション科"
    },
    "facility": {
      "facilityId": "fac-001",
      "facilityName": "立神リハビリテーション温泉病院"
    },
    "position": "理学療法士",
    "permissionLevel": 5,
    "avatar": "https://example.com/avatars/emp-001.jpg",
    "status": "active"
  }
}
```

### 2. Webhook通知システム

**実装報告書**: [Phase3_実装作業完了報告書_FINAL.md](../../docs/Phase3_実装作業完了報告書_FINAL.md)
**実装ファイル**: [src/lib/webhooks/notificationService.ts](../../src/lib/webhooks/notificationService.ts)

**対応イベント**:
- `employee.created` - 職員新規登録
- `employee.updated` - 職員情報更新
- `employee.deleted` - 職員退職
- `employee.transferred` - 異動
- `employee.permission_changed` - 権限変更

**Webhookペイロード例**:
```json
{
  "event": "employee.updated",
  "timestamp": "2025-10-26T10:30:00Z",
  "data": {
    "employeeId": "emp-001",
    "name": "山田 太郎",
    "department": {
      "departmentName": "リハビリテーション科"
    },
    "position": "主任理学療法士",
    "avatar": "https://example.com/avatars/emp-001.jpg"
  },
  "changes": {
    "position": {
      "from": "理学療法士",
      "to": "主任理学療法士"
    }
  }
}
```

---

## ✅ 確認事項チェックリスト

### 医療システム側

- [x] 職員マスターAPI実装済み
- [x] 施設マスターAPI実装済み
- [x] 部署マスターAPI実装済み
- [x] Webhook通知システム実装済み
- [x] API Key認証実装済み
- [x] Rate Limit実装済み
- [x] リトライ機構実装済み
- [x] 単体テスト実装済み
- [x] 統合テスト実装済み
- [x] プロジェクト管理機能は実装しない（VoiceDrive責任範囲）

### VoiceDriveチーム側（推奨）

#### データベース実装
- [ ] `Project`テーブルに`votingDeadline`追加
- [ ] `VoteHistory`テーブル追加
- [ ] `ProjectSummary`テーブル拡張（投票統計）
- [ ] マイグレーション実行

#### サービスレイヤー実装
- [ ] ProjectDetailService実装
- [ ] ProjectApprovalService拡張
- [ ] ProjectTeamService実装
- [ ] ProjectVoteService実装

#### 医療システム連携
- [ ] MedicalSystemService実装
- [ ] 職員情報キャッシュ実装
- [ ] Webhook受信エンドポイント実装
- [ ] エラーハンドリング実装
- [ ] API Key設定（環境変数）

#### フロントエンド
- [ ] ダミーデータ削除
- [ ] 実API接続
- [ ] 投票UI実装
- [ ] エラーハンドリング

---

## 📞 次のステップ

### 医療システムチーム

**対応**: ✅ **完了（追加実装不要）**

- 既存APIの提供準備完了
- Webhook通知システム稼働中
- API Key発行準備完了
- OpenAPI仕様書共有準備完了

**Webhook URL登録依頼待ち**:
- VoiceDriveチームからWebhook URLを受領次第、設定ファイルに登録

### VoiceDriveチーム

**推奨作業順序**:

1. **Phase 1: データベース実装**（1-2日）
   - `votingDeadline`フィールド追加
   - `VoteHistory`テーブル追加
   - `ProjectSummary`テーブル拡張

2. **Phase 2: サービスレイヤー実装**（2-3日）
   - ProjectDetailService実装
   - ProjectApprovalService拡張
   - ProjectTeamService実装
   - ProjectVoteService実装

3. **Phase 3: 医療システム連携**（2-3日）
   - MedicalSystemService実装
   - Webhook受信エンドポイント実装
   - キャッシュ戦略実装

4. **Phase 4: フロントエンド実装**（2-3日）
   - ダミーデータ削除
   - 実API接続
   - 投票UI実装

**推定工数**: 7-11日

---

## 🔗 関連ドキュメント

1. ProjectDetailPage暫定マスターリスト_20251026（本文書の参照元）
2. ProjectDetailPage_DB要件分析_20251026（本文書の参照元）
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 過去の組織分析API実装報告
4. [ProjectListPage_医療システム確認結果_20251026.md](./ProjectListPage_医療システム確認結果_20251026.md) - ProjectListPageの確認結果
5. [Phase3_実装作業完了報告書_FINAL.md](../../docs/Phase3_実装作業完了報告書_FINAL.md) - Webhook実装完了報告
6. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ

---

## 📝 備考

### 医療システム側の実装完了度

**総合評価**: ✅ **100%完了**

- ProjectDetailPageに必要な全APIが実装済み
- Webhook通知システム実装済み
- 認証・認可・Rate Limit全て実装済み
- リトライ機構実装済み
- 単体テスト・統合テスト実装済み
- OpenAPI仕様書作成済み

### データ管理責任の明確化

| データ種別 | 管理責任 | 理由 |
|----------|---------|------|
| 職員マスター | 医療システム | 人事システムの中核データ |
| 施設マスター | 医療システム | 組織マスターデータ |
| 部署マスター | 医療システム | 組織マスターデータ |
| プロジェクト管理 | VoiceDrive | 業務改善提案機能（VoiceDrive独自） |
| 承認フロー | VoiceDrive | プロジェクト管理の一部 |
| 投票機能 | VoiceDrive | 合意形成機能（VoiceDrive独自） |

### VoiceDrive側への助言

**重要**:
1. **医療システムはプロジェクト管理機能を持たない** - 全てVoiceDrive側で実装
2. **職員情報は医療システムAPIから取得** - キャッシュ戦略推奨
3. **Webhook受信エンドポイントの実装** - 職員情報変更の即時反映に必須
4. **エラーハンドリング** - API接続失敗時のフォールバック実装推奨
5. **データ同期の整合性** - 定期的に医療システムAPIから最新情報を取得

### API連携フロー図

```
ProjectDetailPage（VoiceDrive）
  ↓
ProjectDetailService.getProjectDetail(projectId)
  ↓
┌─ VoiceDrive DB ──────────────────────┐
│ - Project情報取得                    │
│ - ProjectApproval取得                │
│ - ProjectTeamMember取得              │
│ - VoteHistory集計                    │
└──────────────────────────────────────┘
  ↓
MedicalSystemService.fetchEmployee(employeeId)
  ↓
キャッシュ確認（24時間以内？）
  ↓ Yes: キャッシュ返却
  ↓ No: API呼び出し
GET https://staff-medical-system.example.com/api/v2/employees/:employeeId
  ↓ (Header: X-API-Key)
医療システム
  ↓
{ employeeId, name, department, position, avatar }
  ↓
VoiceDrive Cache更新
  ↓
ProjectDetailPage表示
```

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後

---

**🎉 結論: 医療システム側の対応は全て完了済み。ProjectDetailPageはVoiceDrive側のみで実装してください。**
