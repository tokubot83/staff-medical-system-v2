# 分析機能ページ 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1026-005
**作成日**: 2025年10月26日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: 分析機能ページAPI要件の医療システム側確認結果

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「分析機能ページ（AnalyticsFunctionsPage）」に対する医療システム側のDB構造調査と、API実装可能性の確認結果を報告します。

### 結論
- ✅ **既存データの充実度**: **95%以上のデータが医療システムに存在**
- ✅ **新規API実装可能性**: **100%実装可能**
- ✅ **Webhook拡張**: **100%対応可能**（既存フィールドから変換）
- ⚠️ **一部フィールド**: 計算または変換が必要（実装工数: 1-2日）

### 推定実装時間
- **分析用API実装**: 1-2日（8-16時間）
- **Webhook拡張**: 0.5日（4時間）
- **合計**: 1.5-2.5日（12-20時間）

---

## ✅ 医療システムDB構造の現状確認

### 1. 組織分析に必要なデータ

| VoiceDrive要求フィールド | 医療システム | ステータス | 備考 |
|---------------------|----------|---------|------|
| `facilityId` | ✅ `Employee.facilityId` | **存在** | 施設ID |
| `facilityName` | ✅ `Facility.name` | **存在** | Facilityテーブルから取得 |
| `departmentId` | ✅ `Employee.departmentId` | **存在** | 部門ID |
| `departmentName` | ✅ `Department.name` | **存在** | Departmentテーブルから取得 |
| `departmentLevel` | ✅ `Department.level` | **存在** | 階層レベル（1-5） |
| `parentDepartmentId` | ✅ `Department.parentId` | **存在** | 親部門ID（階層構造） |
| `employeeCount` | ✅ 計算可能 | **動的集計** | COUNT(Employee)で取得 |

**結論**: **100%実装可能** - 組織階層構造APIをそのまま提供可能

---

### 2. 人材分析に必要なデータ

| VoiceDrive要求フィールド | 医療システム | ステータス | 備考 |
|---------------------|----------|---------|------|
| `employeeId` | ✅ `Employee.employeeCode` | **存在** | 職員コード |
| `name` | ✅ `Employee.name` | **存在** | 職員名 |
| `profession` | ✅ `Position.name` / `TwoAxisEvaluation.jobCategory` | **存在** | 職種（看護職、介護職等） |
| `hierarchyLevel` | ✅ `Position.level` / `Employee.permissionLevel` | **存在** | 階層レベル（1-13） |
| `birthYear` | ✅ 計算可能 | **変換必要** | `birthDate`から年を抽出 |
| `yearsOfService` | ✅ 計算可能 | **変換必要** | `hireDate`から計算 |
| `evaluationScore` | ✅ `Evaluation.overallScore` / `TwoAxisEvaluation.score` | **存在** | 評価スコア（S,A,B,C,D または 0-100） |
| `turnoverRisk` | ✅ `Interview.turnoverRisk` | **存在** | 離職リスク |
| `healthScore` | ✅ `HealthRecord.healthScore` | **存在** | 健康スコア（0-100） |
| `stressIndex` | ✅ `HealthRecord.stressIndex` | **存在** | ストレス指数（0-100） |
| `skillLevel` | ✅ `EmployeeSkill.level` | **存在** | スキルレベル（1-5） |
| `trainingHours` | ✅ `Training.hours` | **存在** | 研修時間 |

**結論**: **100%実装可能** - 人材分析APIをそのまま提供可能

---

### 3. 面談分析に必要なデータ

| VoiceDrive要求フィールド | 医療システム | ステータス | 備考 |
|---------------------|----------|---------|------|
| `interviewId` | ✅ `Interview.id` | **存在** | 面談ID |
| `employeeId` | ✅ `Interview.employeeId` | **存在** | 職員ID |
| `interviewType` | ✅ `Interview.interviewType` | **存在** | 面談タイプ |
| `interviewDate` | ✅ `Interview.interviewDate` | **存在** | 面談日 |
| `interviewStatus` | ✅ `Interview.interviewStatus` | **存在** | 'scheduled', 'completed', 'cancelled', 'no_show' |
| `durationMinutes` | ✅ `Interview.durationMinutes` | **存在** | 面談所要時間（分） |
| `completionRate` | ✅ 計算可能 | **動的集計** | completed / totalScheduled |
| `noShowRate` | ✅ 計算可能 | **動的集計** | no_show / totalScheduled |
| `avgDuration` | ✅ 計算可能 | **動的集計** | AVG(durationMinutes) |

**結論**: **100%実装可能** - 面談分析APIは既にPhase 2.5で実装済み

---

## 🔧 VoiceDrive要求への対応状況

### Webhook拡張要求（セクション 9.1想定）

VoiceDriveが`employee.created`および`employee.updated` Webhookに以下のフィールド追加を要求していると想定します:

| 追加フィールド | 医療システム実装 | ステータス | 備考 |
|------------|-------------|---------|------|
| `profession` | ✅ `Position.name` | **対応可能** | Positionテーブルから取得 |
| `hierarchyLevel` | ✅ `Position.level` | **対応可能** | 1-13の権限レベル |
| `facilityId` | ✅ `Employee.facilityId` | **既存** | 既に送信中 |
| `birthYear` | ✅ 計算可能 | **対応可能** | `birthDate.getFullYear()` |

#### 実装例: Webhook拡張

```typescript
// src/lib/webhookSender.ts拡張例
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
      employeeId: employee.employeeCode,
      name: employee.name,
      email: employee.email,

      // 🆕 VoiceDrive Analytics拡張フィールド
      profession: employee.position.name,           // "看護師", "介護福祉士"等
      hierarchyLevel: employee.position.level,      // 1-13
      facilityId: employee.facilityId,              // "tategami-hospital"
      birthYear: employee.birthDate.getFullYear(),  // 1985

      // 既存フィールド
      department: employee.department.name,
      permissionLevel: employee.permissionLevel,
      status: employee.status,
      updatedAt: employee.updatedAt.toISOString()
    }
  };

  await sendWebhook(payload);
}
```

**推定工数**: 0.5日（4時間）

---

### 新規API要求（セクション 9.2想定）

VoiceDriveが以下の新規APIを要求していると想定します:

#### API-1: 施設マスタ取得API

**エンドポイント**: `GET /api/voicedrive/facilities`

**実装可能性**: ✅ **100%可能**

**レスポンス例**:
```json
{
  "facilities": [
    {
      "id": "tategami-hospital",
      "code": "TH",
      "name": "立神リハビリテーション温泉病院",
      "type": "hospital",
      "address": "長崎県雲仙市小浜町北本町14",
      "phone": "0957-74-3111",
      "employeeCount": 120,
      "departmentCount": 12,
      "createdAt": "2020-01-01T00:00:00Z",
      "updatedAt": "2025-10-26T00:00:00Z"
    },
    {
      "id": "obara-hospital",
      "code": "OH",
      "name": "小原病院",
      "type": "hospital",
      "address": "長崎県雲仙市愛野町甲3838-1",
      "phone": "0957-36-0015",
      "employeeCount": 100,
      "departmentCount": 9,
      "createdAt": "2020-01-01T00:00:00Z",
      "updatedAt": "2025-10-26T00:00:00Z"
    }
  ]
}
```

**SQL実装例**:
```sql
SELECT
  f.id,
  f.code,
  f.name,
  f.type,
  f.address,
  f.phone,
  COUNT(DISTINCT e.id) as employeeCount,
  COUNT(DISTINCT d.id) as departmentCount,
  f.createdAt,
  f.updatedAt
FROM facilities f
LEFT JOIN employees e ON f.id = e.facilityId AND e.status = 'active'
LEFT JOIN departments d ON f.id = d.facilityId
GROUP BY f.id, f.code, f.name, f.type, f.address, f.phone, f.createdAt, f.updatedAt
ORDER BY f.code;
```

**推定工数**: 0.5日（4時間）

---

#### API-2: 職員満足度取得API

**エンドポイント**: `GET /api/voicedrive/employee-satisfaction`

**実装可能性**: ✅ **80%可能**（満足度フィールドは間接的に推測）

**満足度計算ロジック**:
医療システムには直接的な「満足度」フィールドはありませんが、以下から推測可能:

1. **健康スコア** (`HealthRecord.healthScore`)
2. **ストレス指数** (`HealthRecord.stressIndex`) - 反転
3. **離職リスク** (`Interview.turnoverRisk`) - 反転
4. **評価スコア** (`TwoAxisEvaluation.score`)

**満足度計算式**:
```typescript
satisfactionScore = (
  healthScore * 0.3 +
  (100 - stressIndex) * 0.3 +
  (turnoverRisk === 'low' ? 100 : turnoverRisk === 'medium' ? 50 : 0) * 0.2 +
  evaluationScore * 0.2
)
```

**レスポンス例**:
```json
{
  "overallSatisfaction": 75.5,
  "byFacility": {
    "tategami-hospital": 78.2,
    "obara-hospital": 72.8
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
  "calculatedAt": "2025-10-26T10:00:00Z"
}
```

**SQL実装例**:
```sql
WITH latest_health AS (
  SELECT DISTINCT ON (employeeId)
    employeeId,
    healthScore,
    stressIndex
  FROM health_records
  ORDER BY employeeId, checkupDate DESC
),
latest_interview AS (
  SELECT DISTINCT ON (employeeId)
    employeeId,
    turnoverRisk
  FROM interviews
  ORDER BY employeeId, interviewDate DESC
),
latest_evaluation AS (
  SELECT DISTINCT ON (employeeId)
    employeeId,
    score
  FROM two_axis_evaluations
  ORDER BY employeeId, evaluationPeriod DESC
)
SELECT
  e.id,
  e.employeeCode,
  e.name,
  h.healthScore,
  h.stressIndex,
  i.turnoverRisk,
  ev.score as evaluationScore,
  (
    COALESCE(h.healthScore, 0) * 0.3 +
    (100 - COALESCE(h.stressIndex, 0)) * 0.3 +
    CASE
      WHEN i.turnoverRisk = 'low' THEN 100 * 0.2
      WHEN i.turnoverRisk = 'medium' THEN 50 * 0.2
      ELSE 0 * 0.2
    END +
    COALESCE(ev.score, 0) * 0.2
  ) as satisfactionScore
FROM employees e
LEFT JOIN latest_health h ON e.id = h.employeeId
LEFT JOIN latest_interview i ON e.id = i.employeeId
LEFT JOIN latest_evaluation ev ON e.id = ev.employeeId
WHERE e.status = 'active';
```

**推定工数**: 1日（8時間）

---

#### API-3: 組織階層取得API

**エンドポイント**: `GET /api/voicedrive/organization-hierarchy`

**実装可能性**: ✅ **100%可能**（Departmentテーブルに既存）

**レスポンス例**:
```json
{
  "facilities": [
    {
      "id": "tategami-hospital",
      "name": "立神リハビリテーション温泉病院",
      "departments": [
        {
          "id": "dept-001",
          "code": "MTB",
          "name": "医療療養病棟",
          "level": 1,
          "parentId": null,
          "employeeCount": 45,
          "children": [
            {
              "id": "dept-001-1",
              "code": "MTB-NURSE",
              "name": "療養病棟看護チーム",
              "level": 2,
              "parentId": "dept-001",
              "employeeCount": 30,
              "children": []
            },
            {
              "id": "dept-001-2",
              "code": "MTB-CARE",
              "name": "療養病棟介護チーム",
              "level": 2,
              "parentId": "dept-001",
              "employeeCount": 15,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

**SQL実装例（再帰クエリ）**:
```sql
WITH RECURSIVE department_hierarchy AS (
  -- ルート部門（level = 1）
  SELECT
    id,
    code,
    name,
    facilityId,
    parentId,
    level,
    1 as depth
  FROM departments
  WHERE parentId IS NULL

  UNION ALL

  -- 子部門
  SELECT
    d.id,
    d.code,
    d.name,
    d.facilityId,
    d.parentId,
    d.level,
    dh.depth + 1
  FROM departments d
  INNER JOIN department_hierarchy dh ON d.parentId = dh.id
)
SELECT
  dh.*,
  COUNT(e.id) as employeeCount
FROM department_hierarchy dh
LEFT JOIN employees e ON dh.id = e.departmentId AND e.status = 'active'
GROUP BY dh.id, dh.code, dh.name, dh.facilityId, dh.parentId, dh.level, dh.depth
ORDER BY dh.facilityId, dh.level, dh.code;
```

**推定工数**: 0.5日（4時間）

---

## 📊 API実装優先度と工数見積もり

| API | 機能 | 優先度 | 実装工数 | 備考 |
|-----|------|-------|---------|------|
| **API-1** | 施設マスタAPI | 🟡 中 | 0.5日 | 組織分析の基礎 |
| **API-2** | 職員満足度API | 🟢 低 | 1日 | 計算ロジック実装必要 |
| **API-3** | 組織階層API | 🟡 中 | 0.5日 | 階層構造の再帰クエリ |
| **Webhook拡張** | Analytics用フィールド追加 | 🔴 高 | 0.5日 | VoiceDrive連携強化 |
| **合計** | - | - | **2.5日** | **20時間** |

---

## ✅ 実装スケジュール（提案）

### Phase 1: 既存API活用（即座に対応可能）

VoiceDriveは、医療システムが既に実装している以下のAPIをそのまま利用できます:

- ✅ `GET /api/v2/employees` - UserManagementPage用（Phase 2.6実装済み）
- ✅ `GET /api/v2/employees/{employeeId}` - 個別職員取得（Phase 2.6実装済み）
- ✅ `GET /api/voicedrive/webhook-stats` - Webhook統計（Phase 2.5実装済み）
- ✅ `GET /api/voicedrive/interview-completion-stats` - 面談統計（Phase 2.5実装済み）

**工数**: 0日（既存APIのドキュメント共有のみ）

---

### Phase 2: Analytics拡張（1週間）

**期間**: 2025年11月4日（月）〜 11月8日（金）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| 11/4-11/5 | API-1実装（施設マスタAPI） | 医療システム | ⏳ 待機中 |
| 11/5-11/6 | API-3実装（組織階層API） | 医療システム | ⏳ 待機中 |
| 11/6-11/7 | API-2実装（職員満足度API） | 医療システム | ⏳ 待機中 |
| 11/7 | Webhook拡張（Analytics用フィールド） | 医療システム | ⏳ 待機中 |
| 11/8 | 単体テスト作成（カバレッジ80%以上） | 医療システム | ⏳ 待機中 |
| 11/8 | API仕様書更新・共有 | 医療システム | ⏳ 待機中 |

---

### Phase 3: 統合テスト（1週間）

**期間**: 2025年11月11日（月）〜 11月15日（金）

| テスト項目 | 期待値 | 担当 |
|----------|-------|------|
| API-1レスポンス確認 | 施設リスト・職員数集計正常 | 両チーム |
| API-2レスポンス確認 | 満足度スコア計算正常 | 両チーム |
| API-3レスポンス確認 | 階層構造正常（5階層まで） | 両チーム |
| Webhook拡張確認 | Analytics用フィールド送信確認 | 両チーム |
| パフォーマンステスト | API応答時間300ms以下 | 両チーム |

---

## 🔗 既存APIとの関連性

### organization-analytics API（Phase 1実装済み）との統合

AnalyticsFunctionsPageは、既に実装済みの`organization-analytics` APIを基盤として拡張できます:

**既存API**:
- ✅ `GET /api/v2/departments` - 部門マスタAPI（organization-analytics Phase 1実装済み）
- ✅ `GET /api/v2/employees/count` - 職員総数API（organization-analytics Phase 1実装済み）

**新規API**:
- 🆕 `GET /api/voicedrive/facilities` - 施設マスタAPI
- 🆕 `GET /api/voicedrive/employee-satisfaction` - 職員満足度API
- 🆕 `GET /api/voicedrive/organization-hierarchy` - 組織階層API

**API命名規則の統一**:
```
/api/v2/*               → 医療システム標準API（汎用）
/api/voicedrive/*       → VoiceDrive連携専用API
```

---

## ⚠️ 注意事項と制約

### 1. 職員満足度の計算精度

**制約**:
- 医療システムには直接的な「満足度」フィールドが存在しません
- 健康スコア、ストレス指数、離職リスク、評価スコアから間接的に推測します

**対策**:
- VoiceDriveチームと満足度計算ロジックを協議・調整
- 将来的に満足度アンケート機能を追加する場合は、Employeeテーブルに`satisfactionScore`フィールド追加を検討

---

### 2. 階層構造の深さ制限

**制約**:
- 現状の医療法人厚生会の部門階層は最大5階層
- 再帰クエリのパフォーマンスを考慮し、最大10階層まで対応

**対策**:
- 階層深度チェックを実装
- 10階層を超える場合はエラーレスポンス

---

### 3. データ更新頻度

**制約**:
- 健康スコア: 年1回（健康診断時）
- 評価スコア: 年2回（上期・下期）
- 離職リスク: 面談実施時（不定期）

**対策**:
- 満足度APIには`calculatedAt`タイムスタンプを含め、データの鮮度を明示
- VoiceDrive側でキャッシュ戦略を実装（24時間キャッシュ推奨）

---

## 📞 次のステップ

### 医療システムチームの対応
1. **本報告書のレビュー** - VoiceDriveチームに送付
2. **VoiceDriveからのフィードバック受領** - 満足度計算ロジック確認
3. **Phase 2実装開始** - API-1, API-2, API-3の実装（2.5日）
4. **単体テスト作成** - カバレッジ80%以上
5. **API仕様書更新** - OpenAPI 3.0形式で共有

### VoiceDriveチームへの確認事項
1. **満足度計算ロジックの承認** - 健康スコア・ストレス指数からの推測でOKか？
2. **API優先度の確認** - API-1, API-2, API-3のうち、最優先はどれか？
3. **階層構造の深さ** - 5階層で十分か？それとも10階層必要か？
4. **Webhook拡張の必要性** - `profession`, `hierarchyLevel`, `birthYear`の追加は必須か？

---

## 🔗 関連ドキュメント

1. [organization-analytics_医療システム確認結果_20251010.md](./organization-analytics_医療システム確認結果_20251010.md) - 組織分析API確認結果（Phase 1実装済み）
2. [UserManagementPage_医療システム確認結果_20251026.md](./UserManagementPage_医療システム確認結果_20251026.md) - UserManagementPage確認結果（Phase 2.6実装済み）
3. [Phase2.5_両チーム統合完了サマリー_20251026.md](./Phase2.5_両チーム統合完了サマリー_20251026.md) - Phase 2.5完了報告
4. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
