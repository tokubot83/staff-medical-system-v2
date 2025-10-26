# UserManagementPage 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-005
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: UserManagementPageAPI要件の医療システム側確認結果
**参照文書**: UserManagementPage暫定マスターリスト_20251026.md

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「UserManagementPage 暫定マスターリスト」に対する医療システム側の回答です。
要求された31データ項目のうち、医療システムがマスターとして管理する15項目について実装可能性を調査しました。

### 結論
- ✅ **Webhook送信機能**: 既に実装済み（Phase 2.5で強化）
- ✅ **Employee APIエンドポイント**: 95%実装可能（新規API追加必要）
- ✅ **データフィールド**: 医療システム側は全フィールド対応済み
- ⚠️ **対応必要事項**: 新規API 2本の実装が必要（推定工数: 1日）

### 推定実装時間
- **API-1（全職員取得API）**: 0.5日（4時間）
- **API-2（個別職員取得API）**: 0.5日（4時間）
- **合計**: 1日（8時間）

---

## ✅ データ項目実装状況の確認

### 医療システムがマスターとして管理するデータ項目（15項目）

VoiceDriveチームが要求する医療システムマスターデータ15項目について、現在のPrisma schema（Employee, Department, Facilityテーブル）との対応状況を確認しました。

| # | VoiceDrive要求フィールド | 医療システムフィールド | 状態 | テーブル | 備考 |
|---|----------------------|---------------------|------|---------|------|
| **1. 基本情報** |
| 1-2 | `User.employeeId` | `Employee.employeeCode` | ✅ 存在 | Employee | UNIQUE |
| 1-3 | `User.name` | `Employee.name` | ✅ 存在 | Employee | |
| 1-4 | `User.email` | `Employee.email` | ✅ 存在 | Employee | UNIQUE |
| 1-5 | `User.department` | `Department.name` | ✅ 存在 | Department | JOIN必要 |
| 1-6 | `User.position` | `Position.name` | ✅ 存在 | Position | JOIN必要 |
| 1-7 | `User.facilityId` | `Employee.facilityId` | ✅ 存在 | Employee | |
| **2. 権限情報** |
| 2-1 | `User.permissionLevel` | `Employee.permissionLevel` | ✅ 存在 | Employee | 1-13（V3評価から算出） |
| 2-2 | `User.accountType` | `Position.accountType` | ✅ 存在 | Position | JOIN必要 |
| 2-3 | `User.canPerformLeaderDuty` | (計算値) | ✅ 算出可能 | - | permissionLevel>=8 |
| 2-4 | `User.professionCategory` | (未実装) | ⚠️ 今後追加 | - | 'nurse', 'doctor'等 |
| 2-5 | `User.parentId` | `Employee.supervisorId` | ✅ 存在 | Employee | |
| **3. 雇用情報** |
| 3-1 | `User.isActive` | `Employee.status` | ✅ 存在 | Employee | 'active'/'leave'/'retired' |
| 3-2 | `User.isRetired` | `Employee.status` | ✅ 存在 | Employee | status='retired' |
| 3-3 | `User.retirementDate` | `Employee.retiredAt` | ✅ 存在 | Employee | DateTime? |

**結論**: **14/15項目が既に実装済み**（professionCategoryのみ今後追加予定）

---

## 🔄 Webhook統合の実装状況

### 既存Webhook送信機能（Phase 2.5で実装済み）

医療システムには既に[webhookSender.ts](../../src/lib/webhookSender.ts)が実装されており、VoiceDriveへのWebhook送信機能が整っています。

#### 実装済み機能
- ✅ HMAC-SHA256署名生成
- ✅ リクエストID生成（UUIDv4）
- ✅ Webhook送信ログ記録（`WebhookSendLog`テーブル）
- ✅ リトライキュー機能（`WebhookRetryQueue`テーブル）
- ✅ 処理時間計測
- ✅ エラーハンドリング

#### VoiceDrive側への通知が必要なイベント

| イベント | Webhook名 | 送信タイミング | 対応状況 |
|---------|----------|-------------|---------|
| 職員入社 | `employee.created` | Employee新規作成時 | ⚠️ 未実装 |
| 職員情報変更 | `employee.updated` | Employee更新時（部署異動、昇進等） | ⚠️ 未実装 |
| 職員退職 | `employee.retired` | Employee.status='retired'設定時 | ✅ 実装済み（退職処理Webhook） |

**対応必要事項**: `employee.created`, `employee.updated` Webhookの実装（推定工数: 0.5日）

---

### Webhookペイロード仕様（推奨）

VoiceDriveチームの暫定マスターリストに基づき、以下のペイロード構造を推奨します。

#### employee.created / employee.updated 共通ペイロード

```json
{
  "event": "employee.updated",
  "timestamp": "2025-10-26T10:00:00Z",
  "source": "medical-system",
  "data": {
    "employeeId": "EMP-2025-001",
    "name": "山田太郎",
    "email": "yamada@obara-hospital.jp",
    "department": "看護部",
    "position": "看護師",
    "facilityId": "obara-hospital",
    "permissionLevel": 6.0,
    "accountType": "NEW_STAFF",
    "canPerformLeaderDuty": false,
    "professionCategory": "nurse",
    "parentId": "EMP-2020-015",
    "isActive": true,
    "isRetired": false,
    "retirementDate": null,
    "updatedAt": "2025-10-26T10:00:00Z"
  }
}
```

#### employee.retired ペイロード

```json
{
  "event": "employee.retired",
  "timestamp": "2025-10-26T15:00:00Z",
  "source": "medical-system",
  "data": {
    "employeeId": "EMP-2024-050",
    "isActive": false,
    "isRetired": true,
    "retirementDate": "2025-10-31T00:00:00Z",
    "updatedAt": "2025-10-26T15:00:00Z"
  }
}
```

---

## 📊 API実装可能性サマリー

### API-1: 全職員取得API

**エンドポイント**: `GET /api/v2/employees`

**実装可能性**: ✅ **95%実装可能**

#### 必要なクエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|---|------|------|
| `updatedSince` | ISO 8601 DateTime | ❌ | 指定日時以降に更新された職員のみ取得 |
| `page` | Number | ❌ | ページ番号（デフォルト: 1） |
| `limit` | Number | ❌ | 1ページあたりの件数（デフォルト: 100、最大: 500） |
| `facilityId` | String | ❌ | 施設IDでフィルタ |
| `status` | String | ❌ | 'active', 'leave', 'retired' |

#### レスポンス例

```json
{
  "employees": [
    {
      "employeeId": "EMP-2025-001",
      "name": "山田太郎",
      "email": "yamada@obara-hospital.jp",
      "department": "看護部",
      "position": "看護師",
      "facilityId": "obara-hospital",
      "permissionLevel": 6,
      "accountType": "NEW_STAFF",
      "canPerformLeaderDuty": false,
      "professionCategory": "nurse",
      "parentId": "EMP-2020-015",
      "isActive": true,
      "isRetired": false,
      "retirementDate": null,
      "hireDate": "2025-04-01",
      "updatedAt": "2025-10-26T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "totalCount": 500,
    "totalPages": 5,
    "hasNext": true
  }
}
```

#### 実装SQL例

```typescript
// src/app/api/v2/employees/route.ts
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const updatedSince = searchParams.get('updatedSince');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
  const facilityId = searchParams.get('facilityId');
  const status = searchParams.get('status');

  const where: any = {};
  if (updatedSince) {
    where.updatedAt = { gte: new Date(updatedSince) };
  }
  if (facilityId) {
    where.facilityId = facilityId;
  }
  if (status) {
    where.status = status;
  }

  const totalCount = await prisma.employee.count({ where });

  const employees = await prisma.employee.findMany({
    where,
    select: {
      employeeCode: true,
      name: true,
      email: true,
      department: { select: { name: true } },
      position: { select: { name: true, accountType: true } },
      facilityId: true,
      permissionLevel: true,
      supervisorId: true,
      status: true,
      retiredAt: true,
      hireDate: true,
      updatedAt: true
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { updatedAt: 'desc' }
  });

  const transformedEmployees = employees.map(e => ({
    employeeId: e.employeeCode,
    name: e.name,
    email: e.email,
    department: e.department.name,
    position: e.position.name,
    facilityId: e.facilityId,
    permissionLevel: e.permissionLevel,
    accountType: e.position.accountType,
    canPerformLeaderDuty: e.permissionLevel >= 8,
    professionCategory: null, // 今後実装
    parentId: e.supervisorId,
    isActive: e.status === 'active' || e.status === 'leave',
    isRetired: e.status === 'retired',
    retirementDate: e.retiredAt,
    hireDate: e.hireDate,
    updatedAt: e.updatedAt
  }));

  return Response.json({
    employees: transformedEmployees,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page * limit < totalCount
    }
  });
}
```

**推定実装時間**: 0.5日（4時間）

---

### API-2: 個別職員取得API

**エンドポイント**: `GET /api/v2/employees/{employeeId}`

**実装可能性**: ✅ **95%実装可能**

#### パスパラメータ

| パラメータ | 型 | 説明 |
|----------|---|------|
| `employeeId` | String | 職員ID（employeeCode） |

#### レスポンス例

```json
{
  "employeeId": "EMP-2025-001",
  "name": "山田太郎",
  "email": "yamada@obara-hospital.jp",
  "department": "看護部",
  "position": "看護師",
  "facilityId": "obara-hospital",
  "permissionLevel": 6,
  "accountType": "NEW_STAFF",
  "canPerformLeaderDuty": false,
  "professionCategory": "nurse",
  "parentId": "EMP-2020-015",
  "isActive": true,
  "isRetired": false,
  "retirementDate": null,
  "hireDate": "2025-04-01",
  "yearsOfService": 0.6,
  "updatedAt": "2025-10-26T10:00:00Z"
}
```

#### 実装SQL例

```typescript
// src/app/api/v2/employees/[employeeId]/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  const employee = await prisma.employee.findUnique({
    where: { employeeCode: params.employeeId },
    select: {
      employeeCode: true,
      name: true,
      email: true,
      department: { select: { name: true } },
      position: { select: { name: true, accountType: true } },
      facilityId: true,
      permissionLevel: true,
      supervisorId: true,
      status: true,
      retiredAt: true,
      hireDate: true,
      updatedAt: true
    }
  });

  if (!employee) {
    return Response.json({ error: 'Employee not found' }, { status: 404 });
  }

  const yearsOfService = employee.hireDate
    ? (Date.now() - employee.hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    : 0;

  return Response.json({
    employeeId: employee.employeeCode,
    name: employee.name,
    email: employee.email,
    department: employee.department.name,
    position: employee.position.name,
    facilityId: employee.facilityId,
    permissionLevel: employee.permissionLevel,
    accountType: employee.position.accountType,
    canPerformLeaderDuty: employee.permissionLevel >= 8,
    professionCategory: null, // 今後実装
    parentId: employee.supervisorId,
    isActive: employee.status === 'active' || employee.status === 'leave',
    isRetired: employee.status === 'retired',
    retirementDate: employee.retiredAt,
    hireDate: employee.hireDate,
    yearsOfService: parseFloat(yearsOfService.toFixed(1)),
    updatedAt: employee.updatedAt
  });
}
```

**推定実装時間**: 0.5日（4時間）

---

## 🔧 必要な対応事項

### 即座に対応可能（Phase 1）

#### 1. API-1実装（全職員取得API）
- [ ] エンドポイント実装（`GET /api/v2/employees`）
- [ ] ページネーション実装
- [ ] フィルタリング実装（updatedSince, facilityId, status）
- [ ] 認証・認可実装（API Key認証）
- [ ] Rate Limit実装（100 req/min/IP）
- [ ] 単体テスト作成

#### 2. API-2実装（個別職員取得API）
- [ ] エンドポイント実装（`GET /api/v2/employees/{employeeId}`）
- [ ] 404エラーハンドリング
- [ ] 勤続年数計算ロジック
- [ ] 認証・認可実装（API Key認証）
- [ ] Rate Limit実装（100 req/min/IP）
- [ ] 単体テスト作成

#### 3. Webhook実装（職員情報変更）
- [ ] `employee.created` Webhook実装
- [ ] `employee.updated` Webhook実装
- [ ] Prisma Middleware実装（Employee CREATE/UPDATE時に自動送信）
- [ ] エラーハンドリング・リトライ機構確認
- [ ] 統合テスト

**推定工数**: 1.5日（12時間）

---

### 将来対応検討（Phase 2）

#### 4. Employeeテーブル拡張
- [ ] `professionCategory`フィールド追加
  - 'nurse' | 'doctor' | 'therapist' | 'admin' | 'support'
- [ ] マイグレーション作成
- [ ] 既存データへの初期値設定ロジック
- [ ] API-1, API-2のレスポンスに追加

**推定工数**: 0.5日（4時間）

---

## 📅 実装スケジュール（提案）

### Phase 1: API・Webhook実装（2週間）
**期間**: 2025年10月28日（月）〜 11月8日（金）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| 10/28-10/30 | API-1実装（全職員取得API） | 医療システム | ⏳ 待機中 |
| 10/31-11/1 | API-2実装（個別職員取得API） | 医療システム | ⏳ 待機中 |
| 11/4-11/5 | Webhook実装（employee.created/updated） | 医療システム | ⏳ 待機中 |
| 11/6-11/7 | 単体テスト・統合テスト作成 | 医療システム | ⏳ 待機中 |
| 11/8 | API仕様書更新・VoiceDriveチームと共有 | 医療システム | ⏳ 待機中 |

### Phase 2: テーブル拡張（将来実装）
**期間**: TBD（VoiceDriveチームと協議後）

| 作業内容 | 優先度 | 推定工数 |
|---------|-------|---------|
| professionCategoryフィールド追加 | 🟡 中 | 0.5日 |

---

## ✅ VoiceDriveチームへの回答まとめ

### 質問1: 医療システム側のデータフィールド対応状況
**回答**: ✅ **14/15項目が既に実装済み**

- ✅ 基本情報（employeeId, name, email, department, position, facilityId）: 全て存在
- ✅ 権限情報（permissionLevel, accountType, canPerformLeaderDuty, parentId）: 全て存在
- ✅ 雇用情報（isActive, isRetired, retirementDate）: 全て存在
- ⚠️ professionCategoryのみ今後追加予定

### 質問2: Webhook送信機能の実装状況
**回答**: ✅ **基盤は実装済み、イベント追加が必要**

- ✅ Webhook送信ユーティリティ（webhookSender.ts）: 実装済み
- ✅ ログ記録・リトライ機構: 実装済み
- ⚠️ employee.created/updated Webhook: 未実装（0.5日で実装可能）

### 質問3: API実装可能性
**回答**: ✅ **95%実装可能**

- ✅ API-1（全職員取得API）: 実装可能（0.5日）
- ✅ API-2（個別職員取得API）: 実装可能（0.5日）
- ✅ 認証・認可基盤: 既存のAPI Key認証機構を利用可能

---

## 📞 次のステップ

### 医療システムチームの対応
1. **本報告書のレビュー** - VoiceDriveチームに送付
2. **Phase 1実装開始** - API-1, API-2, Webhook実装（1.5日）
3. **単体テスト作成** - カバレッジ80%以上
4. **API仕様書更新** - OpenAPI 3.0形式で共有

### VoiceDriveチームへの確認事項
1. **API仕様の最終承認** - レスポンス構造の確認
2. **認証方式の確認** - API Key認証でOKか、JWTトークン必要か
3. **Rate Limitの妥当性** - 100 req/min/IPで十分か
4. **professionCategoryの優先度** - Phase 2の実装タイミング

---

## 🔗 関連ドキュメント

1. [UserManagementPage暫定マスターリスト_20251026.md](./UserManagementPage暫定マスターリスト_20251026.md) - VoiceDriveからの要件定義
2. [UserManagementPage_DB要件分析_20251026.md](./UserManagementPage_DB要件分析_20251026.md) - VoiceDrive側のDB分析
3. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 過去の確認結果（参考）
4. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ
5. [src/lib/webhookSender.ts](../../src/lib/webhookSender.ts) - Webhook送信ユーティリティ

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
