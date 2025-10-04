# アカウントレベル定義の統一依頼書

**作成日**: 2025年10月4日（最終更新: 2025年10月4日）
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: アカウントレベル体系の統一実装依頼（特別権限レベル97-99追加）
**優先度**: 🔴 高（共通DB構築前に確定必須）

---

## 📋 エグゼクティブサマリー

医療システムとVoiceDrive間でアカウントレベル定義に不整合が発見されました。また、健康管理システムのコンプライアンス対応のため、**特別権限レベル（97-99）** を新たに追加しました。両システムで統一した権限レベル体系を採用することで、アクセス権限設定の一元管理が可能になります。

**現状**：
- VoiceDrive側設計書（2025年8月31日）: **13レベル**
- 医療システム側実装（2025年9月25日）: **18レベル + 看護職専用4レベル + Xレベル（23種類）**
- **NEW**: 健康管理特別権限（2025年10月4日）: **レベル97-99（3種類追加）**

**提案**：
- 両システムで **18レベル + 看護職専用4レベル + 特別権限3レベル（合計25種類）** に統一

---

## 🎯 統一提案の背景

### 1. 不整合の発見経緯

**時系列**：
1. **2025年8月31日**: VoiceDriveチームが13レベル設計書を作成（`VoiceDrive_DB_Integration_Plan_20250831.md`）
2. **2025年9月25日**: 医療システムチームが18レベルで実装完了（`accountLevelCalculator.ts`）
3. **2025年10月4日**: 医療チーム内部確認で不整合を発見

**原因分析**：
- チーム間のレベル数に関する事前合意が不十分
- VoiceDrive側設計時点で医療組織の複雑性を十分に把握できていなかった可能性
- 医療システム側実装時に現場ヒアリングを実施し、より詳細な18レベル体系が必要と判断

### 2. 統一の必要性

**理由1: アクセス権限設定の一元管理**
- 両システムで同じレベル定義を使用することで、権限設定ロジックを統一可能
- VoiceDrive側でユーザー作成時に設定した権限レベルを、医療システムでそのまま使用可能

**理由2: 施設別権限調整への対応**
- 立神リハビリテーション温泉病院の**統括主任Level 7**（医療チーム承認済み）
- 13レベル体系では表現不可

**理由3: 看護職のリーダー業務管理**
- 医療現場では看護職のリーダー業務可否が重要な権限区分
- 0.5刻みレベル（1.5, 2.5, 3.5, 4.5）で表現

**理由4: システム管理者の特別権限**
- 一般的な権限階層とは別の特別権限が必要
- Level 99（Xレベル）で分離管理

---

## 📊 提案する統一アカウントレベル体系

### 完全定義（25種類）

#### 【基本18レベル】全職種共通

| Level | 役職名 | カテゴリー | 対応するVoiceDrive ENUM |
|-------|--------|-----------|------------------------|
| **1** | 新人（1年目） | 一般職員層 | NEW_STAFF |
| **2** | 若手（2-3年目） | 一般職員層 | JUNIOR_STAFF |
| **3** | 中堅（4-10年目） | 一般職員層 | MIDLEVEL_STAFF |
| **4** | ベテラン（11年以上） | 一般職員層 | VETERAN_STAFF |
| **5** | 副主任 | 役職層 | DEPUTY_CHIEF |
| **6** | 主任 | 役職層 | CHIEF |
| **7** | 副師長・副科長・**統括主任** | 役職層 | DEPUTY_MANAGER |
| **8** | 師長・科長・課長 | 役職層 | MANAGER |
| **9** | 副部長 | 役職層 | DEPUTY_DIRECTOR |
| **10** | 部長・医局長 | 役職層 | DIRECTOR |
| **11** | 事務長 | 役職層 | ADMINISTRATIVE_DIRECTOR |
| **12** | 副院長 | 施設経営層 | VICE_PRESIDENT |
| **13** | 院長・施設長 | 施設経営層 | PRESIDENT |
| **14** | 人事部門員 | 法人人事部 | HR_STAFF |
| **15** | 人事各部門長 | 法人人事部 | HR_MANAGER |
| **16** | 戦略企画部門員 | 法人人事部 | STRATEGIC_PLANNING_STAFF |
| **17** | 戦略企画部門長 | 法人人事部 | STRATEGIC_PLANNING_MANAGER |
| **18** | 理事長・法人事務局長 | 最高経営層 | BOARD_MEMBER |

#### 【看護職専用+4レベル】0.5刻み

| Level | 役職名 | 条件 |
|-------|--------|------|
| **1.5** | 新人（リーダー可） | 看護職 + `canPerformLeaderDuty = true` |
| **2.5** | 若手（リーダー可） | 看護職 + `canPerformLeaderDuty = true` |
| **3.5** | 中堅（リーダー可） | 看護職 + `canPerformLeaderDuty = true` |
| **4.5** | ベテラン（リーダー可） | 看護職 + `canPerformLeaderDuty = true` |

**リーダー業務とは**：
- 夜勤帯でのリーダー業務（患者急変時の判断権限）
- スタッフの指示・指導権限
- 勤務表作成への関与

#### 【特別権限レベル（健康管理・システム管理）】

| Level | 役職名 | 特別権限 | 法的根拠 |
|-------|--------|----------|----------|
| **97** | 健診担当者（ストレスチェック実施者） | 健康診断・ストレスチェック管理、集計データ閲覧、同意ベース個別結果閲覧 | 労働安全衛生法第66条の10 |
| **98** | 産業医 | 全職員の健康データ閲覧（同意不要）、産業医面談、医学的意見書発行、就業制限措置 | 労働安全衛生法第13条 |
| **99** | システム管理者（X レベル） | 全職員データアクセス、システム設定変更、バックアップ・リストア | システム管理権限 |

**特別権限レベルの特徴**:
- 一般的な組織階層とは独立した権限体系
- 健康データへのアクセスは法的根拠に基づき厳格に制限
- レベル97-98は健康管理専用、給与・人事・評価データへのアクセス不可
- 全アクセスが監査ログに記録され、不正アクセス検出機能あり

---

## 🔧 VoiceDrive側で必要な実装変更

### 1. データベース設計変更

#### 現在の設計（13レベル）

```sql
-- VoiceDrive_DB_Integration_Plan_20250831.md より
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,

    -- 13段階権限システム（医療組織階層対応）
    account_type ENUM('CHAIRMAN', 'GENERAL_ADMINISTRATIVE_DIRECTOR', 'HR_GENERAL_MANAGER',
                     'HR_DEPARTMENT_HEAD', 'CAREER_SUPPORT_STAFF', 'HR_ADMIN_STAFF',
                     'HOSPITAL_DIRECTOR', 'VICE_DIRECTOR', 'ADMINISTRATIVE_DIRECTOR',
                     'DEPARTMENT_HEAD', 'HEAD_NURSE', 'SUPERVISOR', 'STAFF') NOT NULL,
    permission_level INT NOT NULL CHECK (permission_level BETWEEN 1 AND 13),
    ...
);
```

#### 提案する新設計（18レベル + 0.5刻み + 特別権限レベル）

```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,

    -- 18段階権限システム + 看護職0.5刻み + 特別権限（25種類）
    account_type ENUM(
        -- 一般職員層（1-4）
        'NEW_STAFF', 'JUNIOR_STAFF', 'MIDLEVEL_STAFF', 'VETERAN_STAFF',

        -- 役職層（5-11）
        'DEPUTY_CHIEF', 'CHIEF', 'DEPUTY_MANAGER', 'MANAGER',
        'DEPUTY_DIRECTOR', 'DIRECTOR', 'ADMINISTRATIVE_DIRECTOR',

        -- 施設経営層（12-13）
        'VICE_PRESIDENT', 'PRESIDENT',

        -- 法人人事部（14-17）
        'HR_STAFF', 'HR_MANAGER', 'STRATEGIC_PLANNING_STAFF', 'STRATEGIC_PLANNING_MANAGER',

        -- 最高経営層（18）
        'BOARD_MEMBER',

        -- 特別権限（97-99）
        'HEALTH_CHECKUP_STAFF',      -- 健診担当者
        'OCCUPATIONAL_PHYSICIAN',    -- 産業医
        'SYSTEM_ADMIN'               -- システム管理者
    ) NOT NULL,

    -- permission_levelをDECIMAL型に変更（0.5刻み対応）
    permission_level DECIMAL(4,1) NOT NULL
        CHECK (
            (permission_level BETWEEN 1 AND 18) OR        -- 基本18レベル
            permission_level IN (1.5, 2.5, 3.5, 4.5) OR  -- 看護職専用4レベル
            permission_level IN (97, 98, 99)             -- 特別権限3レベル
        ),

    -- 看護職のリーダー業務可否フラグ（新規追加）
    can_perform_leader_duty BOOLEAN DEFAULT FALSE
        COMMENT '看護職のリーダー業務可否（0.5レベル加算条件）',

    -- 職種情報（リーダー業務判定用）
    profession_category VARCHAR(50)
        COMMENT 'nursing, medical, administrative, etc.',

    ...
);
```

### 2. アカウント作成ロジックの変更

#### 現在のロジック（推測）

```typescript
// 13レベル体系
function createUserAccount(employeeData) {
  const permissionLevel = calculatePermissionLevel(employeeData.position);
  // permissionLevel: 1-13

  return {
    account_type: mapPositionToAccountType(employeeData.position),
    permission_level: permissionLevel
  };
}
```

#### 提案する新ロジック（18レベル + 0.5刻み + 特別権限レベル）

```typescript
// 医療システムAPIを活用
async function createUserAccount(employeeData) {
  // 医療システムの権限計算APIを呼び出し
  const response = await fetch('http://medical-system/api/v1/calculate-level', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      staffId: employeeData.employee_id,
      position: employeeData.position,
      experienceYears: employeeData.experience_years,
      canPerformLeaderDuty: employeeData.can_perform_leader_duty || false,
      facilityId: employeeData.facility_id,
      // 特別権限レベル用（該当する場合のみ）
      isHealthCheckupStaff: employeeData.is_health_checkup_staff || false,
      isOccupationalPhysician: employeeData.is_occupational_physician || false,
      isSystemAdmin: employeeData.is_system_admin || false
    })
  });

  const { accountLevel } = await response.json();
  // accountLevel: 1-18, 1.5-4.5, 97-99

  return {
    account_type: mapLevelToAccountType(accountLevel),
    permission_level: accountLevel,
    can_perform_leader_duty: employeeData.can_perform_leader_duty || false,
    profession_category: employeeData.profession_category
  };
}

// レベルからENUMへのマッピング
function mapLevelToAccountType(level: number): string {
  const mapping = {
    1: 'NEW_STAFF',
    1.5: 'NEW_STAFF',  // リーダー可フラグで区別
    2: 'JUNIOR_STAFF',
    2.5: 'JUNIOR_STAFF',
    3: 'MIDLEVEL_STAFF',
    3.5: 'MIDLEVEL_STAFF',
    4: 'VETERAN_STAFF',
    4.5: 'VETERAN_STAFF',
    5: 'DEPUTY_CHIEF',
    6: 'CHIEF',
    7: 'DEPUTY_MANAGER',
    8: 'MANAGER',
    9: 'DEPUTY_DIRECTOR',
    10: 'DIRECTOR',
    11: 'ADMINISTRATIVE_DIRECTOR',
    12: 'VICE_PRESIDENT',
    13: 'PRESIDENT',
    14: 'HR_STAFF',
    15: 'HR_MANAGER',
    16: 'STRATEGIC_PLANNING_STAFF',
    17: 'STRATEGIC_PLANNING_MANAGER',
    18: 'BOARD_MEMBER',
    // 特別権限レベル
    97: 'HEALTH_CHECKUP_STAFF',
    98: 'OCCUPATIONAL_PHYSICIAN',
    99: 'SYSTEM_ADMIN'
  };

  return mapping[level] || 'STAFF';
}
```

### 3. 医療システムAPIとの連携

医療システム側では既に実装済みのAPI：

**エンドポイント**: `POST /api/v1/calculate-level`

**リクエスト**:
```json
{
  "staffId": "STAFF_001",
  "position": "統括主任",
  "experienceYears": 15,
  "canPerformLeaderDuty": true,
  "facilityId": "tategami-rehabilitation"
}
```

**レスポンス**:
```json
{
  "accountLevel": 7,
  "baseLevel": 7,
  "leaderDutyAdjustment": 0,
  "facilityAdjustment": 0,
  "breakdown": {
    "position": "統括主任",
    "facility": "立神リハビリテーション温泉病院",
    "isProfession": "medical"
  }
}
```

**看護職リーダー可の場合**:
```json
{
  "staffId": "STAFF_002",
  "position": "なし",
  "experienceYears": 3,
  "canPerformLeaderDuty": true,
  "profession": "看護師"
}
```

**レスポンス**:
```json
{
  "accountLevel": 2.5,
  "baseLevel": 2,
  "leaderDutyAdjustment": 0.5,
  "facilityAdjustment": 0,
  "breakdown": {
    "position": "なし",
    "experienceYears": 3,
    "isProfession": "nursing",
    "canPerformLeaderDuty": true
  }
}
```

---

## 📋 移行作業の詳細

### Phase 1: DB設計変更（優先度：最高）

**作業項目**:
1. `users`テーブルの`permission_level`カラムをINT→DECIMAL(4,1)に変更
2. `account_type` ENUMを13種類→21種類に拡張
3. `can_perform_leader_duty`カラムを追加
4. `profession_category`カラムを追加（既存の場合はスキップ）

**マイグレーションSQL**:
```sql
-- Step 1: permission_levelの型変更
ALTER TABLE users
MODIFY COLUMN permission_level DECIMAL(4,1) NOT NULL
CHECK (
    (permission_level BETWEEN 1 AND 18) OR
    permission_level IN (1.5, 2.5, 3.5, 4.5) OR
    permission_level IN (97, 98, 99)
);

-- Step 2: account_type ENUMの拡張
ALTER TABLE users
MODIFY COLUMN account_type ENUM(
    'NEW_STAFF', 'JUNIOR_STAFF', 'MIDLEVEL_STAFF', 'VETERAN_STAFF',
    'DEPUTY_CHIEF', 'CHIEF', 'DEPUTY_MANAGER', 'MANAGER',
    'DEPUTY_DIRECTOR', 'DIRECTOR', 'ADMINISTRATIVE_DIRECTOR',
    'VICE_PRESIDENT', 'PRESIDENT',
    'HR_STAFF', 'HR_MANAGER', 'STRATEGIC_PLANNING_STAFF', 'STRATEGIC_PLANNING_MANAGER',
    'BOARD_MEMBER',
    'HEALTH_CHECKUP_STAFF', 'OCCUPATIONAL_PHYSICIAN', 'SYSTEM_ADMIN'
) NOT NULL;

-- Step 3: 新規カラム追加
ALTER TABLE users
ADD COLUMN can_perform_leader_duty BOOLEAN DEFAULT FALSE
COMMENT '看護職のリーダー業務可否';

ALTER TABLE users
ADD COLUMN profession_category VARCHAR(50)
COMMENT 'nursing, medical, administrative, etc.';

-- Step 4: 既存データの移行（13レベル→18レベルマッピング）
UPDATE users SET
    permission_level = CASE account_type
        WHEN 'STAFF' THEN 1
        WHEN 'SUPERVISOR' THEN 6
        WHEN 'HEAD_NURSE' THEN 8
        WHEN 'DEPARTMENT_HEAD' THEN 10
        WHEN 'ADMINISTRATIVE_DIRECTOR' THEN 11
        WHEN 'VICE_DIRECTOR' THEN 12
        WHEN 'HOSPITAL_DIRECTOR' THEN 13
        WHEN 'HR_ADMIN_STAFF' THEN 14
        WHEN 'CAREER_SUPPORT_STAFF' THEN 14
        WHEN 'HR_DEPARTMENT_HEAD' THEN 15
        WHEN 'HR_GENERAL_MANAGER' THEN 17
        WHEN 'GENERAL_ADMINISTRATIVE_DIRECTOR' THEN 18
        WHEN 'CHAIRMAN' THEN 18
        ELSE permission_level
    END;
```

**注意事項**:
- 既存の13レベルデータは上記マッピングで18レベルに変換
- `STAFF`（旧Level 1-13）は経験年数不明のため暫定Level 1に設定
- 後日、医療システムAPIで正確なレベルを再計算して更新

### Phase 2: アプリケーションロジック変更（優先度：高）

**作業項目**:
1. アカウント作成時に医療システムAPIを呼び出すロジック追加
2. 18レベル + 0.5刻み + Xレベルの表示対応
3. 看護職リーダー業務フラグの入力UI追加
4. 既存の13レベル前提コードを18レベル対応に修正

**影響範囲の調査**:
```bash
# VoiceDrive側コードベースで13レベル前提箇所を検索
grep -r "permission_level.*13" .
grep -r "BETWEEN 1 AND 13" .
grep -r "account_type.*STAFF.*CHAIRMAN" .
```

### Phase 3: テストデータ作成（優先度：中）

**作業項目**:
1. 18レベル全パターンのテストユーザー作成
2. 0.5刻みレベルのテストケース作成
3. Xレベル（システム管理者）のテスト
4. 施設別権限調整のテスト（統括主任Level 7等）

**テストデータ例**:
```json
[
  {
    "employee_id": "TEST_001",
    "position": "なし",
    "experience_years": 1,
    "can_perform_leader_duty": false,
    "profession": "看護師",
    "expected_level": 1
  },
  {
    "employee_id": "TEST_002",
    "position": "なし",
    "experience_years": 1,
    "can_perform_leader_duty": true,
    "profession": "看護師",
    "expected_level": 1.5
  },
  {
    "employee_id": "TEST_003",
    "position": "統括主任",
    "facility_id": "tategami-rehabilitation",
    "expected_level": 7
  },
  {
    "employee_id": "TEST_097",
    "position": "健診担当者",
    "is_health_checkup_staff": true,
    "expected_level": 97
  },
  {
    "employee_id": "TEST_098",
    "position": "産業医",
    "is_occupational_physician": true,
    "expected_level": 98
  },
  {
    "employee_id": "TEST_099",
    "position": "システム管理者",
    "is_system_admin": true,
    "expected_level": 99
  }
]
```

### Phase 4: 統合テスト（優先度：高）

**テストケース**:
1. **基本18レベルの計算確認**（18ケース）
2. **看護職0.5刻みレベルの計算確認**（4ケース）
3. **特別権限レベルの確認**（3ケース: 97健診担当者、98産業医、99システム管理者）
4. **健康データアクセス権限の確認**（レベル97-99の健康データ閲覧権限テスト）
5. **施設別調整の確認**（統括主任Level 7等）
6. **医療システムAPI連携の正常動作確認**
7. **既存13レベルデータの互換性確認**

---

## 📊 医療システム側の実装状況（参考）

### 既に実装完了している機能

#### 1. 権限レベル計算ロジック

**ファイル**: `src/services/accountLevelCalculator.ts`

```typescript
export enum AccountLevel {
  // 基本18レベル
  NEW_STAFF = 1,
  JUNIOR_STAFF = 2,
  MIDLEVEL_STAFF = 3,
  VETERAN_STAFF = 4,
  DEPUTY_CHIEF = 5,
  CHIEF = 6,
  DEPUTY_MANAGER = 7,
  MANAGER = 8,
  DEPUTY_DIRECTOR = 9,
  DIRECTOR = 10,
  ADMINISTRATIVE_DIRECTOR = 11,
  VICE_PRESIDENT = 12,
  PRESIDENT = 13,
  HR_STAFF = 14,
  HR_MANAGER = 15,
  STRATEGIC_PLANNING_STAFF = 16,
  STRATEGIC_PLANNING_MANAGER = 17,
  BOARD_MEMBER = 18,

  // 看護職専用+0.5レベル
  NEW_STAFF_LEADER = 1.5,
  JUNIOR_STAFF_LEADER = 2.5,
  MIDLEVEL_STAFF_LEADER = 3.5,
  VETERAN_STAFF_LEADER = 4.5,

  // 特別権限レベル（健康管理専用）
  HEALTH_CHECKUP_STAFF = 97,        // 健診担当者（ストレスチェック実施者）
  OCCUPATIONAL_PHYSICIAN = 98,      // 産業医

  // システム管理者（特別権限）
  SYSTEM_ADMIN = 99                 // システム管理者（X レベル）
}
```

#### 2. 役職マスター（25役職）

**ファイル**: `src/data/seeds/positionSeeds.ts`

25役職のレベルマッピング完了：
- なし（Level 1）
- 副主任（Level 5）
- 主任（Level 6）
- 副師長（Level 7）
- 師長（Level 8）
- ... （省略）
- 理事長（Level 18）
- **健診担当者（Level 97）** ← NEW
- **産業医（Level 98）** ← NEW

#### 3. 施設別権限調整

**ファイル**: `src/lib/facility-position-mapping.ts`

5施設の役職マッピング完了：
- 小原病院: 9役職
- 立神リハビリテーション温泉病院: 12役職（**統括主任Level 7調整済み**）
- エスポワール立神: 33役職
- グループホーム宝寿庵: 7役職
- 訪問看護ステーション立神: 7役職

**統括主任Level 7の実装**:
```typescript
{
  positionName: '統括主任',
  baseLevel: 7,
  managementScope: 30,
  facilitySpecificAdjustment: 0  // Phase 3で7に調整済み
}
```

#### 4. VoiceDrive連携API

**ファイル**: `src/pages/api/v1/calculate-level.ts`

**エンドポイント**: `POST /api/v1/calculate-level`
**実装完了日**: 2025年9月26日
**テスト状況**: Phase 3統合テスト完了（15/15成功）

---

## ⚠️ リスクと対策

### リスク1: 既存データの互換性

**リスク**:
- VoiceDrive側に既に13レベルで登録されたユーザーが存在する場合、移行が必要

**対策**:
1. 既存データの棚卸し（件数確認）
2. 13レベル→18レベルマッピング表を作成
3. マイグレーションスクリプトで一括変換
4. 変換後、医療システムAPIで再計算して正確なレベルに更新

**マッピング表（暫定）**:
| 旧13レベル | 旧account_type | 新18レベル | 新account_type |
|-----------|---------------|-----------|---------------|
| 1 | STAFF | 1 | NEW_STAFF |
| 6 | SUPERVISOR | 6 | CHIEF |
| 8 | HEAD_NURSE | 8 | MANAGER |
| 10 | DEPARTMENT_HEAD | 10 | DIRECTOR |
| 11 | ADMINISTRATIVE_DIRECTOR | 11 | ADMINISTRATIVE_DIRECTOR |
| 12 | VICE_DIRECTOR | 12 | VICE_PRESIDENT |
| 13 | HOSPITAL_DIRECTOR | 13 | PRESIDENT |
| 13 | CHAIRMAN | 18 | BOARD_MEMBER |

### リスク2: API連携の失敗

**リスク**:
- 医療システムAPIが応答しない場合、アカウント作成が失敗

**対策**:
1. **Fallback機能の実装**:
   ```typescript
   async function createUserAccountWithFallback(employeeData) {
     try {
       // 医療システムAPIを呼び出し
       const level = await fetchLevelFromMedicalSystem(employeeData);
       return { permission_level: level };
     } catch (error) {
       console.warn('Medical API failed, using fallback calculation');
       // Fallback: 役職ベースの簡易計算
       return { permission_level: fallbackLevelCalculation(employeeData.position) };
     }
   }
   ```

2. **リトライ機構**:
   - 3回リトライ（5秒間隔）
   - すべて失敗した場合はFallbackに切り替え

3. **非同期更新**:
   - アカウント作成時はFallbackレベルで作成
   - バックグラウンドで医療システムAPIを呼び出し、正確なレベルに更新

### リスク3: 0.5刻みレベルの表示

**リスク**:
- VoiceDrive側UIで小数点レベル（1.5, 2.5等）の表示が崩れる可能性

**対策**:
1. **表示フォーマット関数の実装**:
   ```typescript
   function formatPermissionLevel(level: number): string {
     if (level === 99) return 'X (システム管理者)';
     if (Number.isInteger(level)) return `Level ${level}`;
     return `Level ${Math.floor(level)} (リーダー可)`;
   }

   // 表示例
   formatPermissionLevel(1)    // "Level 1"
   formatPermissionLevel(1.5)  // "Level 1 (リーダー可)"
   formatPermissionLevel(99)   // "X (システム管理者)"
   ```

2. **ソート対応**:
   - `ORDER BY permission_level ASC`で1→1.5→2→2.5の順に正しくソート

### リスク4: 統括主任Level 7の特殊ケース

**リスク**:
- 統括主任は立神リハビリのみLevel 7、他施設には存在しない特殊ケース

**対策**:
1. 施設IDを必ず含めて医療システムAPIを呼び出す
2. APIレスポンスに施設情報を含める
3. VoiceDrive側で施設別の権限レベルを記録

---

## 📅 実装スケジュール提案

### 緊急度：🔴 高（共通DB構築前に確定必須）

| フェーズ | 作業内容 | 担当 | 期日 | 状態 |
|---------|---------|------|------|------|
| **確認** | 本依頼書の内容確認・合意 | VoiceDrive | 10/5（土） | 📋 待機中 |
| **Phase 1** | DB設計変更・マイグレーション | VoiceDrive | 10/7（月） | 📋 待機中 |
| **Phase 2** | アプリケーションロジック変更 | VoiceDrive | 10/8（火） | 📋 待機中 |
| **Phase 3** | テストデータ作成 | 両チーム | 10/9（水） | 📋 待機中 |
| **Phase 4** | 統合テスト | 両チーム | 10/10（木） | 📋 待機中 |
| **確認** | 最終確認・本番展開準備 | 両チーム | 10/11（金） | 📋 待機中 |
| **展開** | 共通DB構築時に本番展開 | インフラ | 10/12以降 | 📋 待機中 |

---

## 🤝 医療システムチームからのサポート

### 提供可能なサポート

1. **技術相談**:
   - 18レベル体系の詳細説明
   - 医療組織階層の解説
   - 施設別権限調整の背景説明

2. **API利用支援**:
   - `/api/v1/calculate-level`の使用方法説明
   - サンプルリクエスト・レスポンス提供
   - エラーハンドリングのベストプラクティス共有

3. **テストデータ提供**:
   - 18レベル全パターンのテストデータ
   - 施設別テストケース（統括主任Level 7含む）
   - 看護職リーダー可否のテストケース

4. **マイグレーション支援**:
   - 13レベル→18レベル変換ロジックの提供
   - マイグレーションSQLレビュー
   - データ整合性チェックツール提供

---

## 📝 VoiceDriveチームへの確認依頼事項

### 緊急確認が必要（10/5中）

1. **本依頼書の内容確認**
   - 18レベル + 看護職専用4レベル + Xレベルの統一に合意いただけるか
   - 実装スケジュールは実現可能か

2. **既存データの状況確認**
   - VoiceDrive側に既にユーザーデータが存在するか
   - 存在する場合、件数と現在のレベル分布

3. **技術的実現性の確認**
   - DB設計変更（INT→DECIMAL）の実施可否
   - 医療システムAPI連携の実装可否
   - 0.5刻みレベルの表示対応可否

4. **作業工数の見積もり**
   - Phase 1-4の所要時間（人日）
   - 追加で必要なリソース

### 回答方法

以下のいずれかの方法で回答をお願いします：

1. **返信ドキュメント作成**:
   - `mcp-shared/docs/VoiceDrive_Account_Level_Unification_Response_20251005.md`
   - 上記4項目への回答を記載

2. **技術ミーティング開催**:
   - 医療チーム + VoiceDriveチームで詳細議論
   - 10/5（土）または10/6（日）で調整希望

3. **緊急連絡**:
   - 重大な問題・懸念がある場合は即座に連絡
   - `mcp-shared/URGENT_CONTACT.md`に記載

---

## 🎯 期待される成果

### 統一後のメリット

1. **アクセス権限の一元管理**
   - VoiceDriveでユーザー作成 → 医療システムでそのまま権限レベルを使用
   - 権限変更時の同期が不要

2. **医療組織の実態に即した権限管理**
   - 18レベルで細かな権限区分
   - 施設別調整（統括主任Level 7等）に対応
   - 看護職のリーダー業務を正確に反映

3. **システム間連携の簡素化**
   - 権限レベルの変換ロジックが不要
   - データ同期時のマッピングエラーを防止

4. **将来の拡張性確保**
   - 新規施設追加時も統一レベル体系で対応可能
   - 新役職追加時も18レベル内で柔軟に設定可能

---

## 📎 関連ドキュメント

### 医療システム側

1. **実装ドキュメント**:
   - `src/services/accountLevelCalculator.ts` - 18レベル計算ロジック
   - `src/data/seeds/positionSeeds.ts` - 23役職マスター
   - `src/lib/facility-position-mapping.ts` - 施設別権限調整
   - `src/pages/api/v1/calculate-level.ts` - VoiceDrive連携API

2. **設計書**:
   - `mcp-shared/docs/response-to-voicedrive-20250925.md` - 18レベル体系の設計背景
   - `docs/Phase3_実装作業完了報告書_FINAL.md` - Phase 3実装完了報告
   - `mcp-shared/docs/DB構築前確認書_最終版_20251002.md` - 統括主任Level 7の記載

3. **マスターデータ強化**:
   - `mcp-shared/docs/master-data-enhancement-progress.md` - マスターデータ化進捗
   - `mcp-shared/docs/master-data-enhancement-plan.md` - マスターデータ化計画

### VoiceDrive側

1. **設計書**:
   - `mcp-shared/docs/VoiceDrive_DB_Integration_Plan_20250831.md` - 13レベル設計書

2. **確認事項**:
   - `docs/20250928_VoiceDriveチーム確認事項.md` - 統括主任レベル問題の指摘
   - `docs/20250928_VoiceDrive質問への回答書.md` - 医療チームからの回答

---

## 🏥 特別権限レベル（97-99）の追加背景

### 健康管理システムのコンプライアンス要件

**実装日**: 2025年10月4日
**法的根拠**: 労働安全衛生法第66条の10

#### 追加の経緯

ストレスチェック制度の実装において、以下の法的要件を満たす必要が判明：

1. **本人同意なしでのストレスチェック結果閲覧の禁止**
   - 人事部門（レベル14-17）は本人の同意がなければアクセス不可
   - 産業医のみ職務上必要により同意不要でアクセス可能

2. **健康データと人事データの分離**
   - 健診担当者・産業医は健康データにのみアクセス
   - 給与・評価・人事データへのアクセスは不可

3. **アクセス監査の厳格化**
   - 全健康データアクセスを監査ログに記録
   - 不正アクセスパターンの自動検出

#### 特別権限レベルの詳細

**レベル97: 健診担当者（ストレスチェック実施者）**
- 健康診断・ストレスチェックの実施管理
- 集計データの閲覧（個人特定不可）
- 本人同意がある場合のみ個別結果閲覧可能
- 人事データ・給与データへのアクセス不可

**レベル98: 産業医**
- 全職員の健康データ閲覧可能（同意不要、職務上必要）
- 産業医面談の実施・記録
- 医学的意見書の発行
- 就業制限措置の発動
- 人事データ・給与データへのアクセス不可

**レベル99: システム管理者（従来のXレベル）**
- 全データアクセス可能
- システム設定変更
- バックアップ・リストア

#### 実装済み機能

1. **動的アクセス制御**: 同意状況に基づくリアルタイムアクセス判定
2. **同意取得UI**: 職員向けストレスチェック結果共有同意フォーム
3. **人事部閲覧画面**: 同意ベースの制限付き閲覧機能
4. **監査ログ**: 全健康データアクセスの記録・不審パターン検出
5. **同意状況ダッシュボード**: 健診担当者向け全職員同意状況一覧
6. **VoiceDrive通知**: 同意状況変更・高ストレス検出等の自動通知

#### VoiceDrive側で必要な対応

1. **アカウント作成時の特別権限フラグ**
   - `is_health_checkup_staff`, `is_occupational_physician`, `is_system_admin`フラグを追加
   - 該当フラグがtrueの場合、レベル97-99を設定

2. **健康データ閲覧権限の実装**
   - レベル97-99のユーザーに健康管理画面へのアクセスを許可
   - ただし、レベル97-98は人事・給与画面へのアクセスを拒否

3. **監査ログとの連携**
   - VoiceDrive側でのアクセスも医療システムの監査ログに記録
   - Webhook経由で通知を受信

---

## 🔚 まとめ

### 依頼内容の要約

1. **VoiceDrive側のアカウントレベル体系を13レベル→25種類に変更**
   - 基本18レベル
   - 看護職専用4レベル（0.5刻み）
   - 特別権限3レベル（97-99）
2. **医療システムAPIを活用した権限レベル計算の実装**
3. **既存13レベルデータの18レベルへの移行**
4. **健康管理特別権限（97-99）への対応**
5. **10/11までに統合テスト完了、共通DB構築時に本番展開**

### 次のアクション

**VoiceDriveチームへのお願い**:
1. 本依頼書の内容を確認（10/5中）
2. 技術的実現性と作業工数を見積もり（10/5中）
3. 返信ドキュメント作成または技術ミーティング調整（10/6まで）

**医療システムチームの対応**:
1. VoiceDriveチームからの質問・相談に即座に対応
2. テストデータ・マイグレーション支援の準備
3. 統合テスト環境の整備

---

**作成者**: 医療システムチーム
**作成日時**: 2025年10月4日
**ドキュメントID**: ACCOUNT-LEVEL-UNIFICATION-REQUEST-20251004
**次回更新**: VoiceDriveチームからの回答受領後

---

🚀 **VoiceDriveチームの皆様へ**

本依頼書の内容についてご確認いただき、10/5（土）中にご回答いただけますと幸いです。
両システムの権限レベル統一により、より強固な連携基盤を構築できると確信しております。

何かご不明点・ご懸念点がございましたら、遠慮なくお知らせください。
医療システムチーム一同、全力でサポートさせていただきます。

よろしくお願いいたします。
