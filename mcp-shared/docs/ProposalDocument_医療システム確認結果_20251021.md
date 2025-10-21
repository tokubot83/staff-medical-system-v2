# 議題提案書編集ページ（ProposalDocument）医療システム確認結果

**文書番号**: PDE-MEDICAL-2025-1021-001
**作成日**: 2025年10月21日
**作成者**: 医療職員カルテシステムチーム
**参照**: PDE-DB-2025-1021-001（VoiceDrive側DB要件分析書）
**重要度**: 🟢 情報共有
**ステータス**: 確認完了

---

## 📋 エグゼクティブサマリー

### 確認結論

**医療システム側の追加実装は最小限（委員会マスタAPIのみ）** ✅

VoiceDrive側の議題提案書編集ページ（ProposalDocumentEditor）に関する詳細な分析書を確認しました。**データ管理責任分界点定義書（DM-DEF-2025-1008-001）**に基づき、議題提案書データは**VoiceDrive 100%管轄**であることを確認しました。

### 責任分界点

| データカテゴリ | VoiceDrive | 医療システム | 連携方法 |
|-------------|-----------|-------------|---------|
| **議題提案書** | ✅ 100%管轄 | ❌ | - |
| **投票・コメント分析** | ✅ 100%管轄 | ❌ | - |
| **委員会提出リクエスト** | ✅ 100%管轄 | ❌ | - |
| **監査ログ** | ✅ 100%管轄 | ❌ | - |
| **職員情報** | キャッシュ | ✅ マスタ | API提供 |
| **委員会マスタ** | キャッシュ | ✅ マスタ | API提供（新規実装必要） |
| **委員会決定** | 受信 | ✅ マスタ | Webhook（将来実装） |

---

## 🎯 医療システム側の対応要否

### A. DB実装：❌ **不要**

#### 理由

議題提案書関連のデータは全てVoiceDrive側で管理されます。

**VoiceDrive側で実装されるテーブル**:
- ✅ `ProposalDocument`（議題提案書）
- ✅ `ProposalAuditLog`（監査ログ）
- ✅ `SubmissionRequest`（委員会提出リクエスト）

**医療システム側の対応**:
- ❌ テーブル追加不要
- ❌ スキーマ変更不要
- ❌ マイグレーション不要

### B. API実装：🟡 **一部必要**

#### 必要なAPI（新規実装）

##### 1. 委員会マスタAPI（🟡 中優先度）

**エンドポイント**: `GET /api/v2/committees`

**目的**: VoiceDrive側で委員会一覧を取得し、提出先選択UIに使用

**実装時期**: Phase 3（11/8-11/15）

**Response例**:
```json
{
  "success": true,
  "committees": [
    {
      "id": "com-001",
      "name": "業務改善委員会",
      "type": "operational",
      "level": "facility",
      "facilityId": "obara-hospital",
      "facilityName": "小原病院",
      "description": "施設運営の業務改善に関する審議",
      "chairperson": {
        "id": "OH-NS-2024-030",
        "name": "山田事務長",
        "position": "事務長"
      },
      "members": [
        {
          "id": "OH-NS-2024-020",
          "name": "田中師長",
          "role": "委員"
        }
      ],
      "meetingCycle": "monthly",
      "nextMeetingDate": "2025-11-10T14:00:00Z"
    },
    {
      "id": "com-002",
      "name": "施設運営委員会",
      "type": "management",
      "level": "facility",
      "facilityId": "obara-hospital",
      "facilityName": "小原病院",
      "description": "施設全体の運営方針に関する審議",
      "chairperson": {
        "id": "OH-NS-2024-040",
        "name": "佐藤院長",
        "position": "院長"
      },
      "meetingCycle": "monthly",
      "nextMeetingDate": "2025-11-15T10:00:00Z"
    },
    {
      "id": "com-003",
      "name": "法人運営委員会",
      "type": "corporate",
      "level": "corporate",
      "description": "法人全体の運営方針に関する審議",
      "chairperson": {
        "id": "CORP-2024-001",
        "name": "理事長",
        "position": "理事長"
      },
      "meetingCycle": "quarterly",
      "nextMeetingDate": "2025-12-20T13:00:00Z"
    }
  ],
  "total": 3
}
```

**Query Parameters**:
```
?level=facility | department | corporate
&facilityId=obara-hospital
&type=operational | management | corporate
```

**実装場所**: `src/app/api/v2/committees/route.ts`（新規作成）

**必要なテーブル**:
- 🔴 **Committee（委員会マスタ）** - 新規テーブル作成が必要
- 🔴 **CommitteeMember（委員会メンバー）** - 新規テーブル作成が必要

**Prisma Schema案**:
```prisma
// 委員会マスタ
model Committee {
  id              String   @id @default(cuid())
  code            String   @unique
  name            String
  type            String   // operational, management, corporate
  level           String   // department, facility, corporate
  facilityId      String?  // 施設レベルの場合
  description     String?
  chairpersonId   String   // 委員長のemployeeId
  meetingCycle    String   // monthly, quarterly, yearly
  nextMeetingDate DateTime?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  facility        Facility? @relation(fields: [facilityId], references: [id])
  members         CommitteeMember[]

  @@index([facilityId])
  @@index([level])
  @@index([type])
  @@map("committees")
}

// 委員会メンバー
model CommitteeMember {
  id          String   @id @default(cuid())
  committeeId String
  employeeId  String
  role        String   // chairperson, vice_chairperson, member, secretary
  joinedDate  DateTime @default(now())
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  committee   Committee @relation(fields: [committeeId], references: [id])

  @@unique([committeeId, employeeId])
  @@index([employeeId])
  @@map("committee_members")
}
```

**実装優先度**: 🟡 **中**（Phase 3で実装推奨）

##### 2. 委員会決定Webhook（🟢 低優先度）

**エンドポイント**: `POST /webhook/committee-decision`（受信側はVoiceDrive）

**目的**: 委員会で決定された内容をVoiceDrive側に通知

**実装時期**: 将来（Phase 4以降）

**Request例**:
```json
{
  "documentId": "doc-789",
  "committeeId": "com-001",
  "committeeName": "業務改善委員会",
  "decisionDate": "2025-11-10T15:30:00Z",
  "status": "approved",
  "reason": "業務効率化に有益であると判断",
  "nextSteps": "12月1日より試験導入開始",
  "decidedBy": {
    "id": "OH-NS-2024-030",
    "name": "山田事務長",
    "position": "委員長"
  },
  "signature": "HMAC-SHA256署名"
}
```

**実装場所**: `src/services/webhook/committeeDecisionSender.ts`（新規作成）

**実装優先度**: 🟢 **低**（将来実装）

### C. 既存API拡張：✅ **不要**

#### 職員情報API：既存で十分

VoiceDrive側では職員名、権限レベルをキャッシュとして保持しますが、最新情報は既存の職員APIから取得可能です。

**既存API**:
- ✅ `GET /api/v2/employees/:employeeId`（既存）
- ✅ `GET /api/v2/employees`（既存）

**追加実装**: ❌ 不要

---

## 📊 実装スケジュール提案

### Phase 1: 基本機能実装（10/22-10/30）

**医療システム側**:
- ❌ 実装不要
- ✅ VoiceDrive側実装完了待機

### Phase 2: 委員会提出フロー（10/31-11/7）

**医療システム側**:
- ❌ 実装不要
- ✅ VoiceDrive側実装完了待機

### Phase 3: 委員会マスタAPI実装（11/8-11/15）

**医療システム側**:
- ✅ Committeeテーブル作成
- ✅ CommitteeMemberテーブル作成
- ✅ `GET /api/v2/committees` API実装
- ✅ テストデータ投入
- ✅ VoiceDrive側との統合テスト

**スケジュール**:

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| **11/8（金）** | DB設計レビュー | 医療チーム | ⏳ 提案中 |
| **11/11（月）** | Prismaマイグレーション実施 | 医療チーム | ⏳ 提案中 |
| **11/12（火）** | API実装 | 医療チーム | ⏳ 提案中 |
| **11/13（水）** | テストデータ投入 | 医療チーム | ⏳ 提案中 |
| **11/14（木）** | 単体テスト | 医療チーム | ⏳ 提案中 |
| **11/15（金）** | VoiceDrive統合テスト | 両チーム | ⏳ 提案中 |

### Phase 4: 委員会決定Webhook（将来）

**医療システム側**:
- ⏳ 委員会決定システム実装後に検討
- ⏳ VoiceDrive側との仕様調整

---

## 🗂️ データフロー図

### 議題提案書作成フロー

```
VoiceDrive側:
  投稿データ
    ↓
  投票・コメント分析（自動）
    ↓
  議題提案書自動生成
    ↓
  ProposalDocumentテーブルに保存
    ↓
  管理職が編集（補足説明、推奨レベル）
    ↓
  提出準備完了マーク（draft → ready）
    ↓
  Level 7+が委員会提出リクエスト作成
    ↓
  Level 8+が承認
    ↓
  委員会に提出（ready → submitted）

医療システム側:
  - 職員情報API提供（既存）
  - 委員会マスタAPI提供（Phase 3で実装） ← 🟡 NEW
```

### 委員会決定フロー（将来）

```
医療システム側:
  委員会で審議
    ↓
  決定（承認/却下/保留）
    ↓
  Webhook送信（VoiceDriveへ）
    ↓
VoiceDrive側:
  ProposalDocumentのcommitteeDecision更新
    ↓
  ステータス更新（submitted → approved/rejected）
```

---

## 🔍 セキュリティ考慮事項

### 1. 委員会マスタAPIの権限制御

**アクセス制御**:
- ✅ Level 5+: 自分が所属する委員会情報のみ閲覧可能
- ✅ Level 10+: 所属施設の全委員会情報閲覧可能
- ✅ Level 14+: 法人全体の委員会情報閲覧可能

**実装例**:
```typescript
// src/app/api/v2/committees/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const userLevel = parseInt(searchParams.get('userLevel') || '1');

  // 権限チェック
  if (userLevel < 5) {
    return Response.json({
      success: false,
      error: '委員会情報の閲覧には Level 5 以上の権限が必要です'
    }, { status: 403 });
  }

  // Level別フィルタリング
  let committees;
  if (userLevel >= 14) {
    // Level 14+: 法人全体
    committees = await prisma.committee.findMany({ where: { isActive: true } });
  } else if (userLevel >= 10) {
    // Level 10+: 所属施設のみ
    const user = await prisma.employee.findUnique({ where: { id: userId } });
    committees = await prisma.committee.findMany({
      where: { facilityId: user.facilityId, isActive: true }
    });
  } else {
    // Level 5-9: 自分が所属する委員会のみ
    committees = await prisma.committee.findMany({
      where: {
        members: { some: { employeeId: userId, isActive: true } },
        isActive: true
      }
    });
  }

  return Response.json({ success: true, committees });
}
```

### 2. Webhook署名検証

**HMAC-SHA256署名**:
```typescript
// 医療システム側の送信処理
import crypto from 'crypto';

const payload = JSON.stringify(decisionData);
const signature = crypto
  .createHmac('sha256', process.env.VOICEDRIVE_WEBHOOK_SECRET!)
  .update(payload)
  .digest('hex');

await fetch('https://voicedrive.example.com/webhook/committee-decision', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature
  },
  body: payload
});
```

---

## 📋 テスト要件

### Phase 3実装時のテスト項目

#### 単体テスト

- ✅ `GET /api/v2/committees` - 正常系
- ✅ `GET /api/v2/committees?level=facility` - フィルタリング
- ✅ `GET /api/v2/committees?facilityId=obara-hospital` - 施設別フィルタ
- ✅ Level 5-9: 所属委員会のみ表示
- ✅ Level 10-13: 所属施設の全委員会表示
- ✅ Level 14+: 法人全体の委員会表示
- ✅ Level 4以下: 403エラー

#### 統合テスト（VoiceDrive連携）

- ✅ VoiceDrive側から委員会一覧取得
- ✅ 提出先委員会の選択UIに表示
- ✅ 委員長・メンバー情報の表示
- ✅ 次回開催日の表示

#### テストデータ

```json
[
  {
    "id": "com-001",
    "code": "OH-COM-001",
    "name": "業務改善委員会",
    "type": "operational",
    "level": "facility",
    "facilityId": "obara-hospital",
    "chairpersonId": "OH-NS-2024-030",
    "meetingCycle": "monthly",
    "nextMeetingDate": "2025-11-10T14:00:00Z",
    "members": [
      { "employeeId": "OH-NS-2024-020", "role": "member" },
      { "employeeId": "OH-NS-2024-015", "role": "member" }
    ]
  },
  {
    "id": "com-002",
    "code": "OH-COM-002",
    "name": "施設運営委員会",
    "type": "management",
    "level": "facility",
    "facilityId": "obara-hospital",
    "chairpersonId": "OH-NS-2024-040",
    "meetingCycle": "monthly",
    "nextMeetingDate": "2025-11-15T10:00:00Z"
  },
  {
    "id": "com-003",
    "code": "CORP-COM-001",
    "name": "法人運営委員会",
    "type": "corporate",
    "level": "corporate",
    "chairpersonId": "CORP-2024-001",
    "meetingCycle": "quarterly",
    "nextMeetingDate": "2025-12-20T13:00:00Z"
  }
]
```

---

## 🔗 関連ドキュメント

### VoiceDrive側

- **PDE-ML-2025-1021-001** - 議題提案書編集ページ暫定マスターリスト
- **PDE-DB-2025-1021-001** - DB要件分析書（本分析の元資料）
- **DM-DEF-2025-1008-001** - データ管理責任分界点定義書

### 医療システム側

- **organization-analytics_医療システム確認結果_20251010.md** - 参考文書
- **project-approval_医療システム確認結果_20251011.md** - 参考文書
- **共通DB構築後_作業再開指示書_20250928.md** - マスタープラン

---

## ✅ 確認事項チェックリスト

### VoiceDriveチーム確認事項

- [ ] データ管理責任分界点の確認（VoiceDrive 100%管轄で問題ないか）
- [ ] 委員会マスタAPI仕様の確認（必要なフィールド、Query Parameters）
- [ ] 委員会マスタAPIの実装時期（Phase 3: 11/8-11/15で問題ないか）
- [ ] 委員会決定Webhookの実装優先度（将来実装で問題ないか）

### 医療システムチーム確認事項

- [x] ✅ DB実装不要を確認
- [x] ✅ 既存API拡張不要を確認
- [ ] 委員会マスタテーブル設計の承認
- [ ] Phase 3実装スケジュールの承認（11/8-11/15）
- [ ] テストデータ準備の承認

---

## 🎯 次のアクション

### 医療システムチーム

1. ✅ **確認完了** - VoiceDrive側の分析書を確認
2. ✅ **確認結果作成** - 本文書の作成
3. ⏳ **VoiceDriveチーム承認待ち** - 委員会マスタAPI仕様の確認
4. ⏳ **Phase 3実装準備** - 11/8開始予定

### VoiceDriveチーム

1. ⏳ **本文書のレビュー** - 医療システム側の確認結果を確認
2. ⏳ **委員会マスタAPI仕様の確定** - 必要なフィールド、Query Parametersの確認
3. ⏳ **Phase 1-2実装開始** - 議題提案書基本機能の実装（10/22-11/7）
4. ⏳ **Phase 3統合テスト準備** - 委員会マスタAPI連携テスト（11/15）

---

## 📊 まとめ

### 医療システム側の対応範囲

| カテゴリ | 対応要否 | 優先度 | 実装時期 |
|---------|---------|-------|---------|
| **DB実装** | ❌ 不要 | - | - |
| **既存API拡張** | ❌ 不要 | - | - |
| **委員会マスタAPI** | ✅ 必要 | 🟡 中 | Phase 3（11/8-11/15） |
| **委員会決定Webhook** | ⏳ 将来 | 🟢 低 | Phase 4以降 |

### 結論

**VoiceDrive側の議題提案書編集ページ実装に対して、医療システム側の追加実装は最小限（委員会マスタAPIのみ）です。**

データ管理責任分界点定義書に基づき、議題提案書データは全てVoiceDrive側で管理されるため、医療システム側でのDB実装や既存API拡張は不要です。

Phase 3（11/8-11/15）で委員会マスタAPIを実装し、VoiceDrive側の委員会提出フロー統合に協力します。

---

**文書終了**

---

**次のステップ**:
1. VoiceDriveチームによる本文書のレビュー
2. 委員会マスタAPI仕様の最終確認
3. Phase 3実装スケジュールの承認
4. 統合テスト計画の策定

**連絡先**: 医療職員カルテシステムチーム
**最終更新**: 2025年10月21日
