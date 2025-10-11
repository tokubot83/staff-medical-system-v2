# 組織分析ページ 医療システム確認結果報告書

**文書番号**: MED-CONF-2025-1010-004
**作成日**: 2025年10月10日
**作成者**: ClaudeCode（医療システムチーム）
**件名**: 組織分析ページAPI要件の医療システム側確認結果

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「組織分析ページ 医療システム連携要件確認書」（MED-REQ-2025-1010-003）に対する回答です。
医療システム側のDB構造を調査し、要求されたAPI（2件）の実装可能性と、確認事項（2件）への回答をまとめました。

### 結論
- ✅ **API-1（部門マスタAPI）**: 95%実装可能（一部フィールド要調整）
- ⚠️ **API-2（職員総数API）**: 80%実装可能（雇用形態フィールド不足）
- ✅ **確認-1（部門マスタ構造）**: 回答済み
- ⚠️ **確認-2（職員総数計算）**: 一部制約あり（雇用形態区別不可）

### 推定実装時間
- **API-1**: 0.5日（4時間）
- **API-2**: 0.5日（4時間）
- **合計**: 1日（8時間）

---

## ✅ 確認-1への回答: 部門マスタのデータ構造

### 質問
医療システムの`DepartmentMaster`テーブルには、以下のフィールドが存在しますか？

### 回答: ⚠️ 一部不足あり（代替手段あり）

医療システムには**Departmentテーブル**が存在します（`DepartmentMaster`という名称ではなく`Department`テーブルです）。

#### 存在するフィールド

| フィールド | 型 | 状態 | 備考 |
|----------|-----|------|------|
| `id` | String | ✅ **存在** | cuid()で一意識別 |
| `code` | String | ✅ **存在** | 部門コード（unique） |
| `name` | String | ✅ **存在** | 部門名 |
| `facilityId` | String | ✅ **存在** | 施設ID |
| `parentId` | String? | ✅ **存在** | 親部門ID（階層構造） |
| `level` | Int | ✅ **存在** | 階層レベル（追加情報） |
| `createdAt` | DateTime | ✅ **存在** | 作成日時 |
| `updatedAt` | DateTime | ✅ **存在** | 更新日時 |

#### 不足しているフィールド

| VoiceDrive要求フィールド | 状態 | 代替手段 |
|----------------------|------|---------|
| `facilityName` | ❌ **不足** | ✅ **FacilityテーブルとJOINして取得可能** |
| `employeeCount` | ❌ **不足** | ✅ **Employeeテーブルから動的集計可能** |
| `isActive` | ❌ **不足** | ⚠️ **全部門を有効とみなす or フィールド追加** |

#### テーブル構造（schema.prisma 30-47行目）

```prisma
model Department {
  id         String   @id @default(cuid())
  code       String   @unique
  name       String
  facilityId String
  parentId   String?  // 親部署ID（階層構造）
  level      Int      // 階層レベル
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  facility   Facility     @relation(fields: [facilityId], references: [id])
  parent     Department?  @relation("DepartmentHierarchy", ...)
  children   Department[] @relation("DepartmentHierarchy")
  employees  Employee[]   // 所属職員リスト
}
```

#### Facilityテーブル（施設情報取得用）

```prisma
model Facility {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String   // ← facilityName取得可能
  type      String
  address   String
  phone     String
  // ...
}
```

### 実装方針

#### API-1のレスポンス実装（推奨）

```json
{
  "departments": [
    {
      "id": "dept-001",
      "name": "医療療養病棟",
      "facilityId": "tategami-hospital",
      "facilityName": "立神リハビリテーション温泉病院",  // ← Facilityテーブルから取得
      "employeeCount": 45,                              // ← COUNT(Employee)で集計
      "departmentCode": "MTB",
      "isActive": true,                                 // ← 常にtrue（全部門有効とみなす）
      "parentDepartmentId": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2025-10-01T00:00:00Z"
    }
  ]
}
```

#### SQL実装例

```sql
SELECT
  d.id,
  d.code AS departmentCode,
  d.name,
  d.facilityId,
  f.name AS facilityName,
  COUNT(e.id) AS employeeCount,
  TRUE AS isActive,  -- 全部門を有効とみなす
  d.parentId AS parentDepartmentId,
  d.createdAt,
  d.updatedAt
FROM departments d
LEFT JOIN facilities f ON d.facilityId = f.id
LEFT JOIN employees e ON d.id = e.departmentId AND e.status = 'active'
WHERE d.facilityId = ?
GROUP BY d.id, d.code, d.name, d.facilityId, f.name, d.parentId, d.createdAt, d.updatedAt
ORDER BY d.code
```

### 補足事項

1. **isActiveフィールドについて**:
   - 現状、部門の有効/無効を管理するフィールドが存在しません
   - **提案**: 当面は全部門を`isActive: true`として返す
   - **将来**: 必要に応じて`Department`テーブルに`isActive`フィールドを追加

2. **employeeCountの精度**:
   - `COUNT(Employee)`で動的集計するため、リアルタイムで正確
   - パフォーマンス考慮で、キャッシュ化も検討可能

3. **階層構造**:
   - `parentId`と`level`で階層構造を表現可能
   - VoiceDrive側で階層表示する場合に利用可能

---

## ⚠️ 確認-2への回答: 職員総数の計算方法

### 質問
職員総数の計算において、以下の職員区分を**含めるか/除外するか**を確認させてください。

### 回答: ⚠️ 一部制約あり（雇用形態フィールド不足）

#### Employeeテーブルの職員区分フィールド

医療システムのEmployeeテーブルには、以下のフィールドが存在します：

| フィールド | 型 | 説明 |
|----------|-----|------|
| `status` | String | 'active', 'leave', 'retired' |
| `retiredAt` | DateTime? | 退職日 |
| `hireDate` | DateTime | 入社日 |
| `permissionLevel` | Int | 1-13の権限レベル |

#### 重要な発見: 雇用形態フィールドが存在しない ❌

医療システムには**雇用形態（employmentType）フィールドが存在しません**。
そのため、正社員/パート/派遣/外部委託等を区別できません。

#### 職員総数計算方法（現状の制約内での回答）

| 職員区分 | 判定方法 | 含める/除外 | 実装可能性 |
|---------|---------|-----------|----------|
| **退職済み職員** | `status = 'retired'` | ❌ **除外** | ✅ 可能 |
| **休職中職員** | `status = 'leave'` | ✅ **含める** | ✅ 可能 |
| **試用期間中職員** | `hireDate`から3ヶ月以内 | ✅ **含める** | ✅ 可能 |
| **パート・アルバイト** | - | ✅ **含める** | ⚠️ **区別不可** |
| **派遣職員** | - | ❓ **要議論** | ❌ **区別不可** |
| **外部委託職員** | - | ❌ **除外** | ❌ **区別不可** |
| **役員** | - | ✅ **含める** | ⚠️ **区別不可** |
| **研修生・実習生** | - | ❓ **要議論** | ❌ **区別不可** |

### 推奨する職員総数計算方法

#### パターンA: シンプル版（現状のDB構造で実装可能）

```sql
-- 職員総数: active + leave（退職者除外）
SELECT COUNT(*) as totalEmployees
FROM employees
WHERE status IN ('active', 'leave')
```

**この方法の制約**:
- ✅ 退職者を除外可能
- ✅ 休職中職員を含める
- ❌ 雇用形態を区別できない（全員をカウント）

#### パターンB: 雇用形態フィールド追加版（将来実装）

```sql
-- Employeeテーブルに employmentType フィールドを追加
ALTER TABLE employees ADD COLUMN employmentType VARCHAR(50);

-- 職員総数: 正社員 + パート（派遣・外部委託除外）
SELECT COUNT(*) as totalEmployees
FROM employees
WHERE status IN ('active', 'leave')
  AND employmentType IN ('full_time', 'part_time', 'contract')
  AND employmentType NOT IN ('dispatch', 'external_contractor', 'intern')
```

### API-2のレスポンス実装（現状の制約内）

#### 実装可能なレスポンス

```json
{
  "totalEmployees": 245,
  "byFacility": {
    "tategami-hospital": 120,
    "obara-hospital": 100,
    "headquarters": 25
  },
  "byDepartment": {
    "医療療養病棟": 45,
    "回復期リハ病棟": 38,
    "外来・健診センター": 28
  },
  "activeOnly": true,
  "excludeRetired": true,
  "calculatedAt": "2025-10-10T10:30:00Z",

  // 🆕 制約事項を明示
  "limitations": {
    "employmentTypeDistinction": false,  // 雇用形態の区別不可
    "note": "全職員を同一カウント（雇用形態フィールド未実装）"
  }
}
```

#### SQL実装例

```sql
-- 総職員数
SELECT COUNT(*) as totalEmployees
FROM employees
WHERE status IN ('active', 'leave')

-- 施設別
SELECT
  f.code as facilityId,
  f.name as facilityName,
  COUNT(e.id) as count
FROM employees e
JOIN facilities f ON e.facilityId = f.id
WHERE e.status IN ('active', 'leave')
GROUP BY f.code, f.name

-- 部門別
SELECT
  d.name as department,
  COUNT(e.id) as count
FROM employees e
JOIN departments d ON e.departmentId = d.id
WHERE e.status IN ('active', 'leave')
GROUP BY d.name
```

### 提案: 段階的実装

#### Phase 1（即座に実装可能）
- ✅ `status`ベースの職員総数API実装
- ✅ 退職者除外、休職者含める
- ⚠️ 雇用形態は区別しない（全員カウント）

#### Phase 2（将来実装）
- 🔴 `Employee`テーブルに`employmentType`フィールド追加
- 🔴 マイグレーション実行
- 🔴 API-2に雇用形態フィルタ追加

---

## 📊 API実装可能性サマリー

### API-1: 部門マスタ取得API

**実装可能性**: ✅ **95%実装可能**

| 機能 | 状態 | 備考 |
|------|------|------|
| 部門リスト取得 | ✅ 可能 | Departmentテーブルから取得 |
| 施設情報付与 | ✅ 可能 | FacilityテーブルとJOIN |
| 職員数集計 | ✅ 可能 | COUNT(Employee)で動的集計 |
| 有効/無効判定 | ⚠️ 制約あり | 全部門を有効とみなす |
| 階層構造対応 | ✅ 可能 | parentId, levelフィールド利用 |

**推定実装時間**: 0.5日（4時間）

---

### API-2: 職員総数取得API

**実装可能性**: ⚠️ **80%実装可能**（雇用形態区別不可）

| 機能 | 状態 | 備考 |
|------|------|------|
| 総職員数取得 | ✅ 可能 | status='active'/'leave'でカウント |
| 施設別集計 | ✅ 可能 | GROUP BY facilityId |
| 部門別集計 | ✅ 可能 | GROUP BY departmentId |
| 退職者除外 | ✅ 可能 | WHERE status != 'retired' |
| 休職者判定 | ✅ 可能 | WHERE status = 'leave' |
| 雇用形態区別 | ❌ **不可** | employmentTypeフィールド不足 |

**推定実装時間**: 0.5日（4時間）

---

## 🔧 必要な対応事項

### 即座に対応可能（Phase 1）

#### 1. API-1実装（部門マスタ取得API）
- [x] SQL実装（JOIN + GROUP BY）
- [ ] エンドポイント実装（GET /api/v2/departments）
- [ ] 認証・認可実装（Level 15以上）
- [ ] Rate Limit実装（100 req/min/IP）
- [ ] 単体テスト作成

#### 2. API-2実装（職員総数取得API）
- [x] SQL実装（COUNT + GROUP BY）
- [ ] エンドポイント実装（GET /api/v2/employees/count）
- [ ] 認証・認可実装（Level 15以上）
- [ ] Rate Limit実装（100 req/min/IP）
- [ ] 単体テスト作成

**推定工数**: 1日（8時間）

---

### 将来対応検討（Phase 2）

#### 3. Employeeテーブル拡張
- [ ] `employmentType`フィールド追加
  - 'full_time' | 'part_time' | 'contract' | 'dispatch' | 'external_contractor' | 'intern'
- [ ] マイグレーション作成
- [ ] 既存データへの初期値設定
- [ ] API-2の拡張（雇用形態フィルタ追加）

**推定工数**: 1日（8時間）

#### 4. Departmentテーブル拡張
- [ ] `isActive`フィールド追加（Boolean）
- [ ] マイグレーション作成
- [ ] 既存データへの初期値設定（true）
- [ ] API-1の拡張（isActiveフィルタ追加）

**推定工数**: 0.5日（4時間）

---

## 📅 実装スケジュール（提案）

### Phase 1: API実装（1週間）
**期間**: 2025年10月18日（金）〜 10月25日（金）

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| 10/18-10/21 | API-1実装（部門マスタAPI） | 医療システム | ⏳ 待機中 |
| 10/18-10/21 | API-2実装（職員総数API） | 医療システム | ⏳ 待機中 |
| 10/22-10/24 | 単体テスト作成 | 医療システム | ⏳ 待機中 |
| 10/25 | API仕様書更新・共有 | 医療システム | ⏳ 待機中 |

### Phase 2: テーブル拡張（将来実装）
**期間**: TBD（VoiceDriveチームと協議後）

| 作業内容 | 優先度 | 推定工数 |
|---------|-------|---------|
| employmentTypeフィールド追加 | 🟡 中 | 1日 |
| isActiveフィールド追加 | 🟢 低 | 0.5日 |

---

## ✅ VoiceDriveチームへの回答まとめ

### 確認-1: 部門マスタのデータ構造
**回答**: ⚠️ 一部不足あり（代替手段あり）

- ✅ 基本フィールドは全て存在
- ✅ facilityNameはFacilityテーブルとJOINして取得可能
- ✅ employeeCountはEmployeeテーブルから動的集計可能
- ⚠️ isActiveフィールドは不足（全部門を有効とみなす）

### 確認-2: 職員総数の計算方法
**回答**: ⚠️ 一部制約あり（雇用形態区別不可）

**含める職員**:
- ✅ 正社員（`status='active'`）
- ✅ 休職中職員（`status='leave'`）
- ✅ 試用期間中職員（全員含む）
- ⚠️ パート・アルバイト（区別不可、全員含む）
- ⚠️ 役員（区別不可、全員含む）

**除外する職員**:
- ✅ 退職済み職員（`status='retired'`）

**区別不可（employmentTypeフィールド不足）**:
- ❌ 派遣職員
- ❌ 外部委託職員
- ❌ 研修生・実習生

**SQL例**:
```sql
SELECT COUNT(*) FROM employees
WHERE status IN ('active', 'leave')
```

---

## 📞 次のステップ

### 医療システムチームの対応
1. **本報告書のレビュー** - VoiceDriveチームに送付
2. **Phase 1実装開始** - API-1, API-2の実装（1日）
3. **単体テスト作成** - カバレッジ80%以上
4. **API仕様書更新** - OpenAPI 3.0形式で共有

### VoiceDriveチームへの確認事項
1. **雇用形態区別の必要性** - Phase 2（employmentType追加）の優先度確認
2. **isActiveフィールドの必要性** - 全部門を有効とみなす方針でOKか確認
3. **API仕様の最終承認** - レスポンス構造の確認

---

## 🔗 関連ドキュメント

1. [organization-analytics_医療システム連携要件確認書_20251010.md](./organization-analytics_医療システム連携要件確認書_20251010.md) - VoiceDriveからの要件定義
2. [organization-analytics_DB要件分析_20251010.md](./organization-analytics_DB要件分析_20251010.md) - VoiceDrive側のDB分析
3. [organization-analytics暫定マスターリスト_20251010.md](./organization-analytics暫定マスターリスト_20251010.md) - 実装チェックリスト
4. [prisma/schema.prisma](../../prisma/schema.prisma) - 医療システムDBスキーマ

---

**文書終了**

最終更新: 2025年10月10日
バージョン: 1.0
承認: 未承認（VoiceDriveチームレビュー待ち）
次回レビュー: VoiceDriveチームからのフィードバック受領後
