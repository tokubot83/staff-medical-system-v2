# AnalyticsFunctionsPage 医療システム最終確認書

**文書番号**: MED-FINAL-2025-1026-006
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDrive開発チーム
**件名**: 分析機能ページVoiceDrive回答書（VD-RESP-2025-1026-005）への最終確認

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの回答書（VD-RESP-2025-1026-005）を受領しました。

### 医療システムチームの結論

✅ **全面合意・実装開始を承認します**

- ✅ **実装開始日**: 2025年11月4日（月）
- ✅ **実装完了目標**: 2025年11月8日（金）
- ✅ **統合テスト期間**: 2025年11月11日（月）〜 11月15日（金）
- ✅ **リリース予定日**: 2025年11月18日（月）

---

## ✅ VoiceDrive回答書への確認事項

### 1. 満足度計算ロジックの承認

**VoiceDrive回答**: ✅ 承認（健康スコア・ストレス指数からの推測でOK）

**医療システム確認**: ✅ **了承しました**

**実装内容**:
```typescript
// 満足度計算式（確定版）
satisfactionScore = (
  healthScore * 0.3 +                                           // 健康スコア（30%）
  (100 - stressIndex) * 0.3 +                                   // ストレス反転（30%）
  (turnoverRisk === 'low' ? 100 : 'medium' ? 50 : 0) * 0.2 +   // 離職リスク反転（20%）
  evaluationScore * 0.2                                         // 評価スコア（20%）
)
```

**レスポンス仕様**:
- ✅ `calculatedAt`タイムスタンプを含める
- ✅ 施設別・部門別・職種別の集計を提供
- ✅ 計算要素の内訳（factors）を含める

---

### 2. API優先度の確定

**VoiceDrive回答**:
- 🔴 最優先: API-1（施設マスタAPI）
- 🟡 次優先: API-3（組織階層API）
- 🟢 低優先: API-2（職員満足度API）

**医療システム確認**: ✅ **了承しました**

**実装スケジュール**:

| 日付 | API実装 | 推定工数 | 状態 |
|------|---------|---------|------|
| 11/4-11/5 | API-1: 施設マスタAPI | 0.5日 | ⏳ 待機中 |
| 11/5-11/6 | API-3: 組織階層API | 0.5日 | ⏳ 待機中 |
| 11/6-11/7 | API-2: 職員満足度API | 1日 | ⏳ 待機中 |
| 11/7 | Webhook拡張 | 0.5日 | ⏳ 待機中 |
| 11/8 | 単体テスト・API仕様書 | 1日 | ⏳ 待機中 |

**合計工数**: 3.5日（実作業2.5日 + テスト1日）

---

### 3. 階層構造の深さ

**VoiceDrive回答**: ✅ 5階層で十分（技術的には10階層まで対応歓迎）

**医療システム確認**: ✅ **了承しました**

**実装方針**:
- ✅ 再帰クエリで10階層まで対応（将来拡張性確保）
- ✅ UI上は5階層に最適化（VoiceDrive側で実装）
- ✅ 階層深度チェックを実装（11階層以上はエラー）

---

### 4. Webhook拡張の必須フィールド

**VoiceDrive回答**: ✅ 必須（profession, hierarchyLevel, birthYear）

**医療システム確認**: ✅ **了承しました**

**実装内容**:
```typescript
// src/lib/webhookSender.ts拡張版（確定）
async function sendEmployeeWebhook(employeeId: string, eventType: 'created' | 'updated') {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      position: true,
      facility: true,
      department: true
    }
  });

  const payload = {
    eventType: `employee.${eventType}`,
    timestamp: new Date().toISOString(),
    data: {
      // 既存フィールド（Phase 2.6）
      employeeId: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      department: employee.department.name,
      permissionLevel: employee.permissionLevel,
      status: employee.status,

      // 🆕 VoiceDrive Analytics拡張フィールド（Phase 2.8）
      profession: employee.position.name,           // "看護師", "介護福祉士"等
      hierarchyLevel: employee.position.level,      // 1-13
      facilityId: employee.facilityId,              // "tategami-hospital"
      birthYear: employee.birthDate.getFullYear(),  // 1985

      updatedAt: employee.updatedAt.toISOString()
    }
  };

  await sendWebhook(VOICEDRIVE_WEBHOOK_ENDPOINT, payload);
}
```

---

## 📞 VoiceDriveからの追加依頼への回答

### 1. API仕様書の提供

**VoiceDrive依頼**: OpenAPI 3.0形式のAPI仕様書提供（11/8まで）

**医療システム回答**: ✅ **対応します**

**提供予定**:
- ✅ OpenAPI 3.0形式YAML（`AnalyticsFunctionsPage_API仕様書_20251108.yaml`）
- ✅ Postmanコレクション（`AnalyticsFunctionsPage_Postman_Collection.json`）
- ✅ curlサンプル集（`AnalyticsFunctionsPage_curl_samples.sh`）

**納期**: 2025年11月8日（金）17:00まで

---

### 2. ステージング環境のエンドポイント

**VoiceDrive依頼**: ステージング環境のAPIエンドポイントURL・APIキー

**医療システム回答**: ✅ **対応します**

**提供情報**:

#### エンドポイントURL
```
https://staging-medical-system.kousei-kai.jp
```

#### APIキー（JWT Bearer Token）

**開発環境用トークン** (有効期限: 30日):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzeXN0ZW0tYWRtaW4iLCJlbXBsb3llZUlkIjoiU1lTVEVNLUFETUlOIiwicGVybWlzc2lvbkxldmVsIjo5OSwiaWF0IjoxNzMwMDAwMDAwLCJleHAiOjE3MzI1OTIwMDB9.STAGING_SECRET_KEY_PLACEHOLDER
```

**本番環境用トークン** (統合テスト後に発行):
```
統合テスト完了後（11/15以降）に発行します
```

#### トークン発行エンドポイント

**開発用認証API**:
```bash
POST https://staging-medical-system.kousei-kai.jp/api/auth/token
Content-Type: application/json

{
  "username": "voicedrive-system",
  "password": "STAGING_PASSWORD_20251026"
}

# レスポンス
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h"
}
```

**提供予定日**: 2025年11月4日（月）9:00

---

### 3. テストデータの準備

**VoiceDrive依頼**: 統合テスト用テストデータ（11/10まで）

**医療システム回答**: ✅ **対応します**

#### テストデータ仕様

**施設マスタAPI用テストデータ**:
```json
{
  "facilities": [
    {
      "id": "tategami-hospital",
      "code": "TH",
      "name": "立神リハビリテーション温泉病院",
      "type": "hospital",
      "employeeCount": 120,
      "departmentCount": 12
    },
    {
      "id": "obara-hospital",
      "code": "OH",
      "name": "小原病院",
      "type": "hospital",
      "employeeCount": 100,
      "departmentCount": 9
    },
    {
      "id": "headquarters",
      "code": "HQ",
      "name": "法人本部",
      "type": "headquarters",
      "employeeCount": 25,
      "departmentCount": 5
    }
  ]
}
```

**組織階層API用テストデータ**:
- ✅ 5階層の部門構造（立神病院: 医療療養病棟 → 看護チーム → 看護師グループA → 夜勤シフトA → 個別担当）
- ✅ 各階層に10-50名の職員配置
- ✅ parentId, levelフィールド完備

**職員満足度API用テストデータ**:
```json
{
  "overallSatisfaction": 75.5,
  "byFacility": {
    "tategami-hospital": 78.2,
    "obara-hospital": 72.8,
    "headquarters": 80.1
  },
  "byDepartment": {
    "医療療養病棟": 80.1,
    "回復期リハ病棟": 76.3,
    "外来・健診センター": 74.5
  },
  "byProfession": {
    "看護職": 77.2,
    "介護職": 73.8,
    "リハビリ職": 76.5,
    "事務職": 74.2
  },
  "factors": {
    "healthScore": 82.3,
    "stressIndex": 32.1,
    "turnoverRiskLowPercent": 85.0,
    "evaluationScore": 76.8
  },
  "calculatedAt": "2025-11-10T10:00:00Z"
}
```

**テストデータ生成スクリプト**:
```bash
# tests/integration/analytics-seed-test-data.ts
npx ts-node tests/integration/analytics-seed-test-data.ts
```

**提供予定日**: 2025年11月10日（日）17:00まで

---

## 🔧 医療システム側の実装計画（詳細版）

### Week 1: API実装（11/4-11/8）

#### Day 1-2（11/4-11/5）: API-1実装

**ファイル**: `src/app/api/voicedrive/facilities/route.ts`

**実装内容**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authenticateAndAuthorize } from '@/lib/middleware/jwt-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // JWT認証（Level 99必須）
  const authResult = authenticateAndAuthorize(request, 99);
  if (!authResult.success) {
    return authResult.response!;
  }

  try {
    const facilities = await prisma.facility.findMany({
      include: {
        _count: {
          select: {
            employees: { where: { status: 'active' } },
            departments: true
          }
        }
      },
      orderBy: { code: 'asc' }
    });

    const response = {
      facilities: facilities.map(f => ({
        id: f.code,
        code: f.code,
        name: f.name,
        type: f.type,
        address: f.address,
        phone: f.phone,
        employeeCount: f._count.employees,
        departmentCount: f._count.departments,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString()
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**単体テスト**:
```typescript
// tests/api/voicedrive/facilities.test.ts
describe('GET /api/voicedrive/facilities', () => {
  it('should return all facilities with employee/department counts', async () => {
    const response = await fetch('/api/voicedrive/facilities', {
      headers: { Authorization: `Bearer ${validToken}` }
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.facilities).toHaveLength(3);
    expect(data.facilities[0]).toHaveProperty('employeeCount');
  });

  it('should require authentication', async () => {
    const response = await fetch('/api/voicedrive/facilities');
    expect(response.status).toBe(401);
  });
});
```

**推定工数**: 0.5日（4時間）

---

#### Day 2-3（11/5-11/6）: API-3実装

**ファイル**: `src/app/api/voicedrive/organization-hierarchy/route.ts`

**実装内容**:
```typescript
export async function GET(request: NextRequest) {
  const authResult = authenticateAndAuthorize(request, 99);
  if (!authResult.success) {
    return authResult.response!;
  }

  try {
    // 再帰クエリで階層構造を取得
    const facilities = await prisma.facility.findMany({
      include: {
        departments: {
          where: { parentId: null }, // ルート部門のみ
          include: {
            _count: { select: { employees: { where: { status: 'active' } } } }
          }
        }
      }
    });

    // 子部門を再帰的に取得
    async function getDepartmentChildren(departmentId: string) {
      const children = await prisma.department.findMany({
        where: { parentId: departmentId },
        include: {
          _count: { select: { employees: { where: { status: 'active' } } } }
        }
      });

      return Promise.all(
        children.map(async (child) => ({
          id: child.id,
          code: child.code,
          name: child.name,
          level: child.level,
          parentId: child.parentId,
          employeeCount: child._count.employees,
          children: await getDepartmentChildren(child.id)
        }))
      );
    }

    const hierarchy = await Promise.all(
      facilities.map(async (facility) => ({
        id: facility.code,
        name: facility.name,
        departments: await Promise.all(
          facility.departments.map(async (dept) => ({
            id: dept.id,
            code: dept.code,
            name: dept.name,
            level: dept.level,
            parentId: dept.parentId,
            employeeCount: dept._count.employees,
            children: await getDepartmentChildren(dept.id)
          }))
        )
      }))
    );

    return NextResponse.json({ facilities: hierarchy });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**推定工数**: 0.5日（4時間）

---

#### Day 3-4（11/6-11/7）: API-2実装

**ファイル**: `src/app/api/voicedrive/employee-satisfaction/route.ts`

**実装内容**:
```typescript
export async function GET(request: NextRequest) {
  const authResult = authenticateAndAuthorize(request, 99);
  if (!authResult.success) {
    return authResult.response!;
  }

  try {
    // 最新の健康スコア、ストレス指数、離職リスク、評価スコアを取得
    const employees = await prisma.employee.findMany({
      where: { status: 'active' },
      include: {
        facility: true,
        department: true,
        position: true
      }
    });

    const satisfactionData = await Promise.all(
      employees.map(async (emp) => {
        // 最新の健康記録
        const health = await prisma.healthRecord.findFirst({
          where: { employeeId: emp.id },
          orderBy: { checkupDate: 'desc' }
        });

        // 最新の面談（離職リスク）
        const interview = await prisma.interview.findFirst({
          where: { employeeId: emp.id },
          orderBy: { interviewDate: 'desc' }
        });

        // 最新の評価
        const evaluation = await prisma.twoAxisEvaluation.findFirst({
          where: { employeeId: emp.id },
          orderBy: { evaluationPeriod: 'desc' }
        });

        // 満足度計算
        const healthScore = health?.healthScore || 0;
        const stressIndex = health?.stressIndex || 0;
        const turnoverScore =
          interview?.turnoverRisk === 'low' ? 100 :
          interview?.turnoverRisk === 'medium' ? 50 : 0;
        const evalScore = evaluation?.score || 0;

        const satisfaction = (
          healthScore * 0.3 +
          (100 - stressIndex) * 0.3 +
          turnoverScore * 0.2 +
          evalScore * 0.2
        );

        return {
          employeeId: emp.employeeCode,
          facilityId: emp.facility.code,
          department: emp.department.name,
          profession: emp.position.name,
          satisfaction,
          healthScore,
          stressIndex,
          turnoverRisk: interview?.turnoverRisk || 'unknown',
          evaluationScore: evalScore
        };
      })
    );

    // 集計
    const overall = satisfactionData.reduce((sum, e) => sum + e.satisfaction, 0) / satisfactionData.length;

    const byFacility = Object.fromEntries(
      [...new Set(satisfactionData.map(e => e.facilityId))].map(facilityId => {
        const facilityData = satisfactionData.filter(e => e.facilityId === facilityId);
        const avg = facilityData.reduce((sum, e) => sum + e.satisfaction, 0) / facilityData.length;
        return [facilityId, Math.round(avg * 10) / 10];
      })
    );

    const byDepartment = Object.fromEntries(
      [...new Set(satisfactionData.map(e => e.department))].map(dept => {
        const deptData = satisfactionData.filter(e => e.department === dept);
        const avg = deptData.reduce((sum, e) => sum + e.satisfaction, 0) / deptData.length;
        return [dept, Math.round(avg * 10) / 10];
      })
    );

    const byProfession = Object.fromEntries(
      [...new Set(satisfactionData.map(e => e.profession))].map(prof => {
        const profData = satisfactionData.filter(e => e.profession === prof);
        const avg = profData.reduce((sum, e) => sum + e.satisfaction, 0) / profData.length;
        return [prof, Math.round(avg * 10) / 10];
      })
    );

    const factors = {
      healthScore: Math.round(satisfactionData.reduce((sum, e) => sum + e.healthScore, 0) / satisfactionData.length * 10) / 10,
      stressIndex: Math.round(satisfactionData.reduce((sum, e) => sum + e.stressIndex, 0) / satisfactionData.length * 10) / 10,
      turnoverRiskLowPercent: Math.round(satisfactionData.filter(e => e.turnoverRisk === 'low').length / satisfactionData.length * 1000) / 10,
      evaluationScore: Math.round(satisfactionData.reduce((sum, e) => sum + e.evaluationScore, 0) / satisfactionData.length * 10) / 10
    };

    return NextResponse.json({
      overallSatisfaction: Math.round(overall * 10) / 10,
      byFacility,
      byDepartment,
      byProfession,
      factors,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**推定工数**: 1日（8時間）

---

#### Day 4（11/7）: Webhook拡張

**ファイル**: `src/lib/webhookSender.ts`

**拡張内容**:
```typescript
// 既存のsendEmployeeWebhook関数を拡張
export async function sendEmployeeWebhook(
  employeeId: string,
  eventType: 'created' | 'updated'
): Promise<void> {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      position: true,
      facility: true,
      department: true
    }
  });

  if (!employee) {
    throw new Error(`Employee not found: ${employeeId}`);
  }

  const payload = {
    eventType: `employee.${eventType}`,
    timestamp: new Date().toISOString(),
    data: {
      // 既存フィールド
      employeeId: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      department: employee.department.name,
      permissionLevel: employee.permissionLevel,
      status: employee.status,

      // 🆕 Phase 2.8 Analytics拡張フィールド
      profession: employee.position.name,
      hierarchyLevel: employee.position.level,
      facilityId: employee.facilityId,
      birthYear: employee.birthDate.getFullYear(),

      updatedAt: employee.updatedAt.toISOString()
    }
  };

  await sendWebhook(process.env.VOICEDRIVE_WEBHOOK_ENDPOINT!, payload);
}
```

**推定工数**: 0.5日（4時間）

---

#### Day 5（11/8）: 単体テスト・API仕様書

**単体テストカバレッジ目標**: 80%以上

**テストファイル**:
- `tests/api/voicedrive/facilities.test.ts`
- `tests/api/voicedrive/organization-hierarchy.test.ts`
- `tests/api/voicedrive/employee-satisfaction.test.ts`
- `tests/lib/webhookSender-analytics.test.ts`

**API仕様書**:
- `AnalyticsFunctionsPage_API仕様書_20251108.yaml` (OpenAPI 3.0)
- `AnalyticsFunctionsPage_Postman_Collection.json`
- `AnalyticsFunctionsPage_curl_samples.sh`

**推定工数**: 1日（8時間）

---

### Week 2: 統合テスト（11/11-11/15）

| 日付 | テスト項目 | 担当 | 状態 |
|------|----------|------|------|
| 11/11 | API-1接続確認・レスポンス検証 | 両チーム | ⏳ 待機中 |
| 11/12 | API-3接続確認・階層構造検証 | 両チーム | ⏳ 待機中 |
| 11/13 | API-2接続確認・満足度計算検証 | 両チーム | ⏳ 待機中 |
| 11/14 | Webhook拡張確認・Analytics用フィールド検証 | 両チーム | ⏳ 待機中 |
| 11/15 | パフォーマンステスト・完了報告書作成 | 両チーム | ⏳ 待機中 |

---

## 📅 マイルストーン（最終確定版）

| 日付 | マイルストーン | 医療システム担当 | VoiceDrive担当 | 状態 |
|------|--------------|----------------|---------------|------|
| **2025-11-01 (金)** | 最終確認書送付 | ✅ 本ドキュメント作成 | - | ⏳ 待機中 |
| **2025-11-04 (月)** | Phase 2実装開始 | API-1実装開始 | ユーティリティ実装開始 | ⏳ 待機中 |
| **2025-11-04 (月) 9:00** | ステージング環境情報共有 | APIキー発行・共有 | 環境設定 | ⏳ 待機中 |
| **2025-11-08 (金) 17:00** | Phase 2実装完了 | API仕様書共有 | Analytics API実装完了 | ⏳ 待機中 |
| **2025-11-10 (日) 17:00** | テストデータ提供 | テストデータ生成 | テストシナリオ準備 | ⏳ 待機中 |
| **2025-11-11 (月)** | Phase 3統合テスト開始 | 接続確認サポート | API接続テスト | ⏳ 待機中 |
| **2025-11-15 (金)** | Phase 3統合テスト完了 | 完了報告書作成 | UI統合確認 | ⏳ 待機中 |
| **2025-11-18 (月)** | AnalyticsFunctionsPage リリース | 本番環境APIキー発行 | 本番リリース | ⏳ 待機中 |

---

## ✅ 医療システムチームの最終承認事項

### 承認事項サマリー

1. ✅ **満足度計算ロジック**: 健康スコア・ストレス指数からの推測で実装
2. ✅ **API優先度**: API-1 → API-3 → API-2の順で実装
3. ✅ **階層構造**: 5階層に最適化、技術的には10階層まで対応
4. ✅ **Webhook拡張**: profession, hierarchyLevel, birthYear, facilityIdを追加
5. ✅ **実装スケジュール**: 11/4-11/15（2週間）で実装・テスト完了
6. ✅ **追加依頼対応**: API仕様書・ステージング環境・テストデータを提供

### VoiceDriveチームへの確認依頼

1. ⏳ **統合テスト日程の最終確認**: 11/11-11/15で問題ないか？
2. ⏳ **本番環境リリース日の最終確認**: 11/18（月）で問題ないか？
3. ⏳ **API仕様書レビュー**: 11/8送付後、2営業日以内にフィードバック可能か？

---

## 📞 次のアクション

### 医療システムチームの対応（即座に実施）

1. ✅ **本最終確認書をVoiceDriveチームへ送付** - 2025年11月1日（金）
2. ⏳ **ステージング環境準備** - 11/3（日）までに完了
3. ⏳ **実装開始** - 11/4（月）9:00から開始

### VoiceDriveチームへの期待

1. ⏳ **本最終確認書のレビュー** - 11/1（金）受領後、確認
2. ⏳ **統合テスト日程の最終承認** - 11/2（土）までに回答
3. ⏳ **実装開始** - 11/4（月）から並行実装開始

---

## 🔗 関連ドキュメント

1. [AnalyticsFunctionsPage_医療システム確認結果_20251026.md](./AnalyticsFunctionsPage_医療システム確認結果_20251026.md) - 医療システム側の初回確認結果
2. [VoiceDrive回答書](VD-RESP-2025-1026-005) - VoiceDriveからの回答書
3. [UserManagementPage_医療システム最終確認書_20251026.md](./UserManagementPage_医療システム最終確認書_20251026.md) - Phase 2.6最終確認書（参考）
4. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - マスタープラン（Phase 2.8追加済み）

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 医療システムチーム承認済み
次回レビュー: VoiceDriveチームからの最終承認受領後

---

**医療システムチーム一同、VoiceDriveチームの迅速かつ詳細な回答に感謝申し上げます。**

引き続き、Phase 2.8 AnalyticsFunctionsPage連携の成功に向けて全力で取り組みます。

---

**連絡先**:
- Slack: #phase2-integration
- Email: medical-system-dev@kousei-kai.jp
- 担当: 医療システム開発チーム
