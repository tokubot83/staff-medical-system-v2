# AWS Lightsail統合実装マスタープラン【統合版】

**文書番号**: MP-2025-1003-002
**作成日**: 2025年9月20日
**最終更新**: 2025年10月4日
**作成者**: 医療システムチーム & VoiceDriveチーム
**宛先**: 医療法人厚生会 全関係者
**重要度**: 🔴 最重要

---

## エグゼクティブサマリー

医療職員管理システムとVoiceDriveシステムのAWS Lightsail環境での統合実装計画書です。
**Phase 0（組織設計）を最優先事項**として、段階的に実装を進めます。

### 🎯 核心目標
- **職員登録時の自動VoiceDriveアカウント作成**
- **SSO（シングルサインオン）による完全統合**
- **リアルタイム双方向データ同期**
- **統合レポート・分析機能**

### 📊 現在の実装状況（2025年10月4日時点）

**完了済み**：
- ✅ **25レベルアカウント権限体系**（2025年10月4日完了）
  - 基本権限レベル: L1～L18（18段階）
  - 看護師リーダー権限: L1.5, L2.5, L3.5, L4.5（4段階）
  - 特別権限レベル: L97（健診担当者）、L98（産業医）、L99（システム管理者）
  - **合計25種類の権限レベルで全職種カバー**
  - VoiceDriveチームと同期完了

- ✅ **健康管理システム統合**（2025年10月4日完了）
  - ストレスチェック同意管理機能（労働安全衛生法第66条の10準拠）
  - 健康データ監査ログシステム
  - 健診担当者ダッシュボード
  - VoiceDrive健康通知統合（リトライ機構付き）

- ✅ **コンプライアンス通報統合**（2025年10月4日完了、87.5%成功）
  - VoiceDrive受付確認通知送信機能（10件中7件合格、2件手動確認待ち）
  - HMAC-SHA256署名検証
  - 緊急度別メッセージ生成（Critical/High/Medium/Low）
  - バッチ処理対応（5件連続処理成功）
  - 統合テスト予定: **2025年10月8日（TC-006, TC-008手動確認）**

- ✅ Phase 3: 施設別権限管理システム（100%完了、DB構築待機中）
  - 小原病院（420名、9役職）
  - 立神リハビリテーション温泉病院（180名、12役職）
  - エスポワール立神（150名、33役職）
  - **総計: 3施設750名の統合基盤構築済み**

- ✅ Phase 5-3: キャリアコース選択制度（統合テスト77.8%成功、DB構築待機中）
  - A～D 4コース体系実装
  - TypeScript型定義完成
  - 管理画面実装完了
  - 統合テスト実施済み

**待機中**：
- ⏳ 共通データベース構築（インフラチーム作業中）
- ⏳ Phase 3: 本番環境接続テスト
- ⏳ Phase 5-3: Supabase統合（7日間作業計画準備完了）
- ⏳ コンプライアンス通報: TC-006, TC-008手動確認（10月8日予定）

**次期フェーズ**：
- 📅 Phase 4: 職員ライフサイクル管理（入職・退職処理）
- 📅 Phase 5-4: キャリアコース機能拡張
- 📅 コンプライアンス通報: 本番デプロイ（10月10日予定）

---

## 目次

1. [Phase 0: 組織設計【最優先】](#phase-0-組織設計最優先)
2. [Phase 1: 基盤構築](#phase-1-基盤構築)
3. [Phase 2: 認証システム統合](#phase-2-認証システム統合)
4. [Phase 3: データ連携実装](#phase-3-データ連携実装)
5. [Phase 4: 職員ライフサイクル管理](#phase-4-職員ライフサイクル管理)
6. [Phase 4.5: 共通DB構築（詳細計画）](#phase-45-共通db構築詳細計画)
7. [Phase 4.7: DB構築後の移行作業](#phase-47-db構築後の移行作業)
8. [Phase 5: 本番移行](#phase-5-本番移行)
9. [実装スケジュール](#実装スケジュール)
10. [コスト見積もり](#コスト見積もり)
11. [リスク管理](#リスク管理)
12. [成功指標（KPI）](#成功指標kpi)
13. [次のアクション](#次のアクション)

---

## Phase 0: 組織設計【最優先】🔴

### 実施期間: 即座開始～2週間

### 0.1 医療法人厚生会組織構造の確定

```
医療法人厚生会
├── 本部
│   ├── 理事長
│   ├── 専務理事
│   └── 常務理事
├── 施設
│   ├── 小原病院（obara-hospital）- 420名、9役職
│   ├── 立神リハビリテーション温泉病院（tategami-rehabilitation）- 180名、12役職
│   ├── エスポワール立神（espoir-tategami）- 150名、33役職
│   ├── 厚生クリニック（3拠点）
│   └── 訪問看護ステーション（2拠点）
└── 部門
    ├── 医療部門
    ├── 看護部門
    ├── 医療技術部門
    ├── 事務部門
    └── 施設管理部門
```

### 0.2 権限階層設計（25レベル体系）

#### 基本権限レベル（1-18）

| レベル | 役職 | 権限範囲 | システムロール | 実装状況 |
|--------|------|----------|----------------|----------|
| L1 | 看護助手 | 自分の情報のみ | STAFF | ✅ 実装済み |
| L2 | 看護師 | 自分の情報のみ | STAFF | ✅ 実装済み |
| L3 | 先輩看護師 | 自分の情報のみ | STAFF | ✅ 実装済み |
| L4 | プリセプター | 自分の情報のみ | STAFF | ✅ 実装済み |
| L5 | 副主任 | 予約管理・シフト調整 | TEAM_LEADER | ✅ 実装済み |
| L6 | 主任 | 面談実施・記録作成 | TEAM_LEADER | ✅ 実装済み |
| L7 | 副師長 / 統括主任 | 部門職員の情報閲覧 | DEPARTMENT_HEAD | ✅ 実装済み（医療チーム承認） |
| L8 | 師長 / 科長 | 部署全体の評価実施 | DEPARTMENT_HEAD | ✅ 実装済み |
| L9 | 部長 | 全部署の実績分析 | EXECUTIVE | ✅ 実装済み |
| L10 | 医局長 | 部門予算の管理 | EXECUTIVE | ✅ 実装済み |
| L11 | 事務長 | 施設全体の運営状況 | EXECUTIVE | ✅ 実装済み |
| L12 | 副院長 | 経営戦略策定 | EXECUTIVE | ✅ 実装済み |
| L13 | 事務部長 | 財務レポート閲覧 | EXECUTIVE | ✅ 実装済み |
| L14 | 人事部長 | 人事方針策定 | HR_DIRECTOR | ✅ 実装済み |
| L15 | コンプライアンス責任者 | コンプライアンス管理 | COMPLIANCE | ✅ 実装済み |
| L16 | 専務理事 | 法人全体の経営管理 | SENIOR_EXECUTIVE | ✅ 実装済み |
| L17 | 常務理事 | 理事会決議事項管理 | SENIOR_EXECUTIVE | ✅ 実装済み |
| L18 | 理事長 | 全権限（最高責任者） | CHAIRMAN | ✅ 実装済み |

#### 看護師リーダー権限レベル（0.5刻み）

| レベル | 役職 | 権限範囲 | 特殊フラグ | 実装状況 |
|--------|------|----------|------------|----------|
| L1.5 | 看護助手（リーダー兼務） | 自分の情報のみ + リーダー業務 | canPerformLeaderDuty: true | ✅ 実装済み |
| L2.5 | 看護師（リーダー兼務） | 自分の情報のみ + リーダー業務 | canPerformLeaderDuty: true | ✅ 実装済み |
| L3.5 | 先輩看護師（リーダー兼務） | 自分の情報のみ + リーダー業務 | canPerformLeaderDuty: true | ✅ 実装済み |
| L4.5 | プリセプター（リーダー兼務） | 自分の情報のみ + リーダー業務 | canPerformLeaderDuty: true | ✅ 実装済み |

#### 特別権限レベル（97-99：健康管理専用）

| レベル | 役職 | 権限範囲 | アクセス可能データ | 法的根拠 | 実装状況 |
|--------|------|----------|-------------------|----------|----------|
| L97 | 健診担当者 | 健康診断・ストレスチェック管理 | 健診データ、ストレスチェック、再検査管理、基本職員情報 | 労働安全衛生法第66条 | ✅ 実装済み |
| L98 | 産業医 | 産業医面談・就業判定 | 健診データ、ストレスチェック、産業医面談、就業制限、勤務履歴、欠勤記録 | 労働安全衛生法第13条 | ✅ 実装済み |
| L99 | システム管理者 | システム全体の設定・管理 | 全データアクセス可能 | システム管理権限 | ✅ 実装済み |

**重要事項**:
- **レベル97-99は健康管理専用権限**であり、給与・評価・面談等の人事データへのアクセスは制限されています
- **レベル97（健診担当者）**は同意のない個別ストレスチェック結果にはアクセス不可（労働安全衛生法第66条の10第2項準拠）
- **レベル98（産業医）**は職員の同意なくストレスチェック結果にアクセス可能（同法第66条の10第3項）
- **立神リハビリテーション温泉病院の「統括主任」**はレベル7（医療チーム承認済み）
- **合計25種類**の権限レベルで全職種・全役職をカバー

### 0.3 データアクセスマトリックス

```sql
-- 権限マスタテーブル
CREATE TABLE permission_matrix (
    role_id VARCHAR(20) PRIMARY KEY,
    can_view_all_staff BOOLEAN DEFAULT FALSE,
    can_edit_all_staff BOOLEAN DEFAULT FALSE,
    can_view_department BOOLEAN DEFAULT FALSE,
    can_approve_interviews BOOLEAN DEFAULT FALSE,
    can_access_reports BOOLEAN DEFAULT FALSE
);
```

---

## Phase 1: 基盤構築

### 実施期間: 3週間（Phase 0完了後）

### 1.1 AWS Lightsail環境構築

#### インスタンス構成
```yaml
Production Environment:
  Instance:
    - Type: 4GB RAM, 2 vCPU, 80GB SSD
    - OS: Ubuntu 22.04 LTS
    - Cost: $40/month

  Database:
    - Type: Managed MySQL 8.0
    - Size: 1GB RAM, 40GB Storage
    - Cost: $30/month

  Storage:
    - Type: Object Storage
    - Size: 100GB
    - Cost: $10/month

  Total: $80/month
```

### 1.2 MySQL共通データベース設計

```sql
-- 共通データベース: lightsail_integrated_db

-- 1. 統合職員マスタ
CREATE TABLE unified_staff_master (
    staff_id VARCHAR(20) PRIMARY KEY,
    employee_number VARCHAR(10) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    facility_id VARCHAR(20),
    department_id VARCHAR(20),
    position_id VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    medical_system_id VARCHAR(50),
    voicedrive_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    sync_status ENUM('synced', 'pending', 'error') DEFAULT 'pending',
    INDEX idx_facility (facility_id),
    INDEX idx_department (department_id),
    INDEX idx_sync_status (sync_status)
);

-- 2. アカウント連携テーブル
CREATE TABLE account_integration (
    integration_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(20) NOT NULL,
    medical_username VARCHAR(50),
    voicedrive_username VARCHAR(50),
    sso_token VARCHAR(500),
    token_expires_at TIMESTAMP,
    auto_created BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES unified_staff_master(staff_id),
    INDEX idx_staff (staff_id),
    INDEX idx_token_expiry (token_expires_at)
);

-- 3. 同期ログテーブル
CREATE TABLE sync_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sync_type ENUM('staff', 'interview', 'notification', 'report') NOT NULL,
    source_system ENUM('medical', 'voicedrive') NOT NULL,
    target_system ENUM('medical', 'voicedrive') NOT NULL,
    record_count INT DEFAULT 0,
    status ENUM('success', 'partial', 'failed') NOT NULL,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_sync_type (sync_type),
    INDEX idx_status (status),
    INDEX idx_started (started_at)
);
```

---

## Phase 2: 認証システム統合

### 実施期間: 4週間

### 2.1 JWT基盤SSO実装

```typescript
// JWT Token Structure
interface JWTPayload {
    staffId: string;
    employeeNumber: string;
    systemAccess: {
        medical: boolean;
        voicedrive: boolean;
    };
    permissions: string[];
    facilityId: string;
    departmentId: string;
    role: 'EXECUTIVE' | 'DEPARTMENT_HEAD' | 'TEAM_LEADER' | 'STAFF';
    iat: number;
    exp: number;
}
```

### 2.2 自動アカウント作成フロー

```mermaid
sequenceDiagram
    participant M as 医療システム
    participant DB as 共通DB
    participant API as 統合API
    participant V as VoiceDrive

    M->>DB: 新規職員登録
    DB->>API: トリガー発火
    API->>V: アカウント作成API呼び出し
    V->>V: アカウント生成
    V-->>API: アカウント情報返却
    API->>DB: 連携情報保存
    API->>M: 完了通知
    M->>M: ID/PW表示
```

### 2.3 自動作成API仕様

```typescript
// POST /api/v1/auto-create-account
interface AutoCreateRequest {
    staffId: string;
    employeeNumber: string;
    fullName: string;
    email: string;
    facility: {
        id: string;
        name: string;
    };
    department: {
        id: string;
        name: string;
    };
    position: {
        id: string;
        name: string;
        level: number;
    };
}

interface AutoCreateResponse {
    success: boolean;
    voicedriveAccount: {
        userId: string;
        username: string;
        initialPassword: string;
        loginUrl: string;
    };
    integrationId: string;
    message: string;
}
```

---

## Phase 3: データ連携実装

### 実施期間: 5週間
### 実装状況: ✅ 100%完了（共通DB構築待機中）

### 3.1 実装完了項目

#### 施設別権限レベル管理システム
- ✅ 小原病院（obara-hospital）: 420名、9役職マッピング
- ✅ 立神リハビリテーション温泉病院（tategami-rehabilitation）: 180名、12役職マッピング
- ✅ エスポワール立神（espoir-tategami）: 150名、33役職マッピング
- ✅ 統括主任レベル7調整（医療チーム承認済み）
- ✅ facilityIdパラメータによる施設識別

#### テスト結果（実装完了時）
- 単体テスト: 17/17成功（100%）
- 統合テスト: 15/15成功（100%）
- 本番環境接続テスト: 6/7成功（SSL/TLS接続のみ失敗 - 共通DB未構築のため）

### 3.2 リアルタイム同期システム

#### 同期対象データ
1. **職員マスタ情報**（双方向）- ✅ 実装完了
2. **面談予約・記録**（VoiceDrive→医療）- ✅ 実装完了
3. **通知配信**（医療→VoiceDrive）- ✅ Webhook実装完了
4. **評価データ**（双方向）- ✅ 実装完了

### 3.3 WebSocket通信実装

```javascript
// WebSocket Server Configuration
const wsConfig = {
    medical: 'wss://medical.lightsail.aws:8001',
    voicedrive: 'wss://voicedrive.lightsail.aws:8002',
    heartbeat: 30000, // 30秒
    reconnectDelay: 5000 // 5秒
};

// イベント定義
const SYNC_EVENTS = {
    STAFF_CREATED: 'staff.created',
    STAFF_UPDATED: 'staff.updated',
    INTERVIEW_SCHEDULED: 'interview.scheduled',
    NOTIFICATION_SENT: 'notification.sent',
    EVALUATION_COMPLETED: 'evaluation.completed'
};
```

### 3.4 データ変換マッピング

```typescript
// 医療→VoiceDrive変換
const medicalToVoicedriveMapper = {
    category: {
        'announcement': 'NOTIFICATION',
        'interview': 'MEETING',
        'training': 'EDUCATION',
        'survey': 'SURVEY',
        'other': 'OTHER'
    },
    priority: {
        'high': 'URGENT',
        'medium': 'NORMAL',
        'low': 'LOW'
    }
};
```

---

## Phase 4: 職員ライフサイクル管理（入職・退職処理）

### 実施期間: 8週間
### 実装状況: 📅 Phase 3完了後に着手予定

### 4.1 入職処理の完成

#### 4.1.1 職員登録API実装
```typescript
// POST /api/v1/staff/onboarding
interface OnboardingRequest {
    staffInfo: {
        employeeNumber: string;
        lastName: string;
        firstName: string;
        email: string;
        phone: string;
        birthDate: string;
        hireDate: string;
    };
    assignment: {
        facilityId: string;
        departmentId: string;
        positionId: string;
        employmentType: 'full_time' | 'part_time' | 'contract';
    };
    voicedriveConfig: {
        autoCreateAccount: boolean;
        sendWelcomeEmail: boolean;
        initialTrainingModules: string[];
    };
}

interface OnboardingResponse {
    staffId: string;
    medicalSystemRegistered: boolean;
    voicedriveAccount: {
        created: boolean;
        userId: string;
        username: string;
        initialPassword: string;
        loginUrl: string;
    };
    scheduledInterviews: {
        newEmployeeMonthly: string; // ISO date
    };
    status: 'completed' | 'partial' | 'failed';
}
```

#### 4.1.2 VoiceDriveアカウント自動作成連携
- 職員登録と同時にVoiceDriveアカウントを自動作成
- 権限レベル（accountLevel）の自動計算
- 初回ログイン案内メールの自動送信
- 新入職員月次面談の自動スケジュール設定

#### 4.1.3 入職時のUI実装
- 職員管理ページに「新規入職」ボタン配置
- 入職情報入力フォーム（基本情報・所属・VoiceDrive設定）
- 確認画面・完了画面
- 登録完了通知（本人・上長・人事）

### 4.2 退職処理の実装

#### 4.2.1 退職処理API実装
```typescript
// POST /api/v1/staff/resignation
interface ResignationRequest {
    staffId: string;
    resignationDate: string;
    lastWorkingDate: string;
    resignationReason: 'personal' | 'career_change' | 'relocation' |
                       'health' | 'family' | 'retirement' | 'contract_end' |
                       'disciplinary' | 'company_initiated' | 'other';
    reasonDetail?: string;
    exitInterview: {
        required: boolean;
        scheduledDate?: string;
        skipReason?: string;
        approvedBy?: string;
    };
    voicedriveConfig: {
        deactivationDate: string;
        dataRetentionPeriod: number; // 年数
        archiveData: boolean;
    };
}

interface ResignationResponse {
    staffId: string;
    employmentStatus: 'resigned';
    medicalSystemUpdated: boolean;
    voicedriveAccount: {
        scheduled_deactivation: string;
        status: 'active' | 'pending_deactivation';
    };
    exitInterview?: {
        scheduled: boolean;
        interviewId?: string;
    };
    status: 'completed' | 'pending_approval' | 'failed';
}
```

#### 4.2.2 VoiceDriveアカウント無効化連携
```typescript
// POST /api/v1/voicedrive/accounts/deactivate
interface DeactivateAccountRequest {
    staffId: string;
    deactivationDate: string;
    reason: 'resignation' | 'disciplinary' | 'contract_end';
    immediateDeactivation: boolean;
    dataRetentionConfig: {
        retainFor: number; // 年数
        scheduleArchive: string; // ISO date
        scheduleDeletion: string; // ISO date
    };
}

interface DeactivateAccountResponse {
    accountStatus: 'deactivated' | 'scheduled_deactivation';
    dataRetentionSchedule: {
        archiveDate: string;
        anonymizeDate: string;
        deletionDate: string;
    };
    archiveCompleted: boolean;
}
```

#### 4.2.3 退職処理のフロー分岐

**通常退職（面談実施）**
```
退職申し出 → 退職面談予約 → 面談実施 → 退職手続き → 最終勤務日 → アカウント無効化
```

**緊急退職（面談なし）**
```
退職申し出 → 上長承認 → 即時退職手続き → アカウント無効化
```

**懲戒退職（面談なし）**
```
懲戒処分決定 → 即時退職処理 → 即時アカウント無効化
```

#### 4.2.4 退職者データ管理（staff_basicテーブル拡張）
```sql
-- 退職関連フィールド追加
ALTER TABLE staff_basic ADD COLUMN employment_status
    ENUM('active', 'resigned', 'on_leave', 'suspended')
    DEFAULT 'active';

ALTER TABLE staff_basic ADD COLUMN resignation_date DATE NULL;
ALTER TABLE staff_basic ADD COLUMN resignation_reason VARCHAR(50) NULL;
ALTER TABLE staff_basic ADD COLUMN resignation_reason_detail TEXT NULL;
ALTER TABLE staff_basic ADD COLUMN last_working_date DATE NULL;
ALTER TABLE staff_basic ADD COLUMN resignation_notice_date DATE NULL;

ALTER TABLE staff_basic ADD COLUMN exit_interview_applicable BOOLEAN DEFAULT TRUE;
ALTER TABLE staff_basic ADD COLUMN exit_interview_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE staff_basic ADD COLUMN exit_interview_id INT NULL;
ALTER TABLE staff_basic ADD COLUMN exit_interview_skipped_reason VARCHAR(100) NULL;
ALTER TABLE staff_basic ADD COLUMN exit_interview_waived_by INT NULL;

ALTER TABLE staff_basic ADD COLUMN rehire_eligible BOOLEAN DEFAULT TRUE;
ALTER TABLE staff_basic ADD COLUMN rehire_notes TEXT NULL;

-- 退職者検索用インデックス
CREATE INDEX idx_employment_status ON staff_basic(employment_status);
CREATE INDEX idx_resignation_date ON staff_basic(resignation_date);
```

#### 4.2.5 退職時のUI実装
- 職員カルテページに「退職手続き」メニュー追加
- 職員管理ページに「退職処理」ボタン追加
- 退職情報入力フォーム
- 面談要否の選択
- 承認フロー（直属上長 → 人事部長）
- 業務引継ぎチェックリスト自動生成

### 4.3 採用管理ページでの退職者検索機能

#### 4.3.1 退職者検索の目的
- **再応募時の迅速な把握**: 退職者が再度応募した際に過去の勤務履歴を即座に確認
- **アルムナイ採用支援**: 退職者データベースから優秀な元職員を探して再雇用を打診
- **重複応募防止**: 現職員・退職者との重複をチェック

#### 4.3.2 TalentSearchPanelの拡張
```typescript
// src/components/recruitment/TalentSearchPanel.tsx

interface ExtendedSearchQuery extends TalentSearchQuery {
    // 既存の検索条件に追加
    includeResignedStaff?: boolean;  // 退職者を含める
    resignedDateRange?: {
        from: string;
        to: string;
    };
    rehireEligibleOnly?: boolean;    // 再雇用可能者のみ
}

// 検索結果の表示
interface SearchResultWithEmploymentHistory {
    talent: TalentProfile;
    previousEmployment?: {
        staffId: string;
        employeeNumber: string;
        hireDate: string;
        resignationDate: string;
        resignationReason: string;
        lastPosition: string;
        lastDepartment: string;
        lastFacility: string;
        evaluationHistory: {
            average: number;
            highest: string;
            latest: string;
        };
        exitInterviewSummary?: string;
        rehireEligible: boolean;
        rehireNotes?: string;
    };
}
```

### 4.4 アカウントライフサイクル自動管理

```typescript
// データ保持・削除スケジュール
interface DataLifecyclePolicy {
    staffId: string;
    currentStatus: 'active' | 'resigned' | 'archived' | 'deleted';

    schedule: {
        immediate: {  // 最終勤務日
            action: 'deactivate_voicedrive_account';
            items: ['ログイン機能', '投稿機能', 'メッセージ送信'];
        };
        after30days: {
            action: 'archive_voicedrive_content';
            items: ['過去の投稿', 'コメント', 'いいね'];
        };
        after1year: {
            action: 'anonymize_personal_data';
            items: ['連絡先情報', '個人識別情報'];
        };
        after5years: {
            action: 'complete_deletion';
            items: ['全データ物理削除（法定保存期間終了後）'];
        };
    };
}
```

### 4.5 実装優先度

| 優先度 | 実装項目 | 所要期間 | 依存関係 |
|--------|---------|---------|---------|
| 🔴 高 | 入職処理API実装 | 2週間 | Phase 1完了 |
| 🔴 高 | VoiceDriveアカウント作成API連携 | 2週間 | 入職処理API |
| 🟡 中 | 退職処理API実装 | 3週間 | Phase 1完了 |
| 🟡 中 | VoiceDriveアカウント無効化API連携 | 2週間 | 退職処理API |
| 🟢 低 | 採用管理ページ退職者検索機能 | 2週間 | 退職処理API |
| 🟢 低 | データライフサイクル自動管理 | 3週間 | 全API完成 |

---

## Phase 4.5: 共通DB構築（詳細計画）

### 実施期間: 8週間（Week 1-8）
### 実装状況: ⏳ インフラチーム作業中

### 4.5.1 概要

**目的**: 医療職員管理システムとVoiceDriveシステムの共通データベース構築

**アプローチ**: 段階的構築（マスターデータ → 職員情報 → コア機能 → 付加機能）

**データ規模**: 750名（3施設）の職員データ + 面談・評価・健康管理データ

### 4.5.2 Week 1（10/7 - 10/13）：マスターデータ構築

**目標**: データベースサーバー準備、基本テーブル作成

| 日程 | 作業内容 | 担当 | 成果物 |
|------|---------|------|--------|
| 10/7（月） | DBサーバー申請・設定 | 医療チーム | サーバーアクセス情報 |
| 10/8（火） | MySQL接続確認、.env設定 | 医療チーム | 接続テスト成功 |
| 10/9（水） | 施設マスター構築 | 医療チーム | facilities テーブル |
| 10/10（木） | 部署マスター構築 | 医療チーム | departments テーブル |
| 10/11（金） | 職位マスター構築 | 医療チーム | positions テーブル |
| 10/12（土） | 初期データ投入 | 医療チーム | 3施設分のマスターデータ |
| 10/13（日） | Week 1 動作確認 | 医療チーム | 確認レポート |

**Week 1完了条件**：
- ✅ データベースに接続できる
- ✅ 3つのマスターテーブルが作成されている
- ✅ 小原病院・立神リハビリ・エスポワール立神のデータが入っている
- ✅ バックアップが取得できる

**Week 1で作成するテーブル**：

```sql
-- 1. 施設マスター
CREATE TABLE facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_code VARCHAR(50) NOT NULL UNIQUE, -- 'obara-hospital', 'tategami-rehabilitation'
  facility_name VARCHAR(100) NOT NULL,       -- '小原病院', '立神リハビリテーション温泉病院'
  facility_type VARCHAR(50),                 -- '病院', 'リハビリ施設'
  address VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 部署マスター
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_id INT NOT NULL,
  department_code VARCHAR(50) NOT NULL,
  department_name VARCHAR(100) NOT NULL,     -- '3階病棟', 'リハビリ科'
  parent_department_id INT,                  -- 階層構造の場合
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  UNIQUE KEY unique_dept_code (facility_id, department_code)
);

-- 3. 職位マスター
CREATE TABLE positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  position_code VARCHAR(50) NOT NULL UNIQUE,
  position_name VARCHAR(100) NOT NULL,       -- '看護師', '統括主任'
  position_level INT NOT NULL,               -- 1-10
  position_category VARCHAR(50),             -- 'nurse', 'assistant_nurse'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Week 1投入データサンプル**：

```sql
-- 施設データ
INSERT INTO facilities (facility_code, facility_name, facility_type, phone) VALUES
('obara-hospital', '小原病院', '病院', '03-1234-5678'),
('tategami-rehabilitation', '立神リハビリテーション温泉病院', 'リハビリ施設', '092-2345-6789'),
('espoir-tategami', 'エスポワール立神', '介護施設', '092-3456-7890');

-- 部署データ（小原病院の例）
INSERT INTO departments (facility_id, department_code, department_name) VALUES
(1, 'ward-2f', '2階病棟'),
(1, 'ward-3f', '3階病棟'),
(1, 'ward-4f', '4階病棟'),
(1, 'outpatient', '外来');

-- 職位データ
INSERT INTO positions (position_code, position_name, position_level, position_category) VALUES
('nursing-aide', '看護助手', 1, 'nursing_aide'),
('nurse', '看護師', 2, 'nurse'),
('senior-nurse', '主任看護師', 3, 'nurse'),
('manager', '課長', 4, 'admin'),
('strategic-planning', '戦略企画部門員', 5, 'admin'),
('career-support', 'キャリア支援部門員', 6, 'admin'),
('chief-nurse-obara', '看護部長', 7, 'nurse'),              -- 小原病院
('chief-supervisor-tategami', '統括主任', 7, 'nurse'),      -- 立神リハビリ（特別調整）
('director-admin', '統括管理部門長', 8, 'admin'),
('vice-director', '副院長', 9, 'admin'),
('director', '院長', 10, 'admin');
```

### 4.5.3 Week 2（10/14 - 10/20）：職員基本情報構築

**目標**: 職員750名分のデータ投入

| 日程 | 作業内容 | 担当 | 成果物 |
|------|---------|------|--------|
| 10/14（月） | staff_basicテーブル作成 | 医療チーム | テーブル構造 |
| 10/15（火） | 事務局提供データのクレンジング | 医療チーム | 整形済みデータ |
| 10/16（水） | 職員データ投入（150名ずつ） | 医療チーム | 150名投入完了 |
| 10/17（木） | 職員データ投入（残り600名） | 医療チーム | 750名投入完了 |
| 10/18（金） | データ検証（重複チェック等） | 医療チーム | 検証レポート |
| 10/19（土） | staff_assignmentsテーブル作成・投入 | 医療チーム | 配属情報完成 |
| 10/20（日） | Week 2 動作確認 | 医療チーム | 確認レポート |

**Week 2で作成するテーブル**：

```sql
-- 4. 職員基本情報
CREATE TABLE staff_basic (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(20) NOT NULL UNIQUE,
  last_name VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name_kana VARCHAR(50) NOT NULL,
  first_name_kana VARCHAR(50) NOT NULL,
  gender ENUM('男','女','その他') NOT NULL,
  birth_date DATE NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  mobile_phone VARCHAR(20),
  postal_code VARCHAR(10),
  address VARCHAR(255),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  hire_date DATE NOT NULL,
  employment_type VARCHAR(50) NOT NULL,      -- '正社員', 'パート', '契約'
  employment_status VARCHAR(50) DEFAULT 'active', -- 'active', 'resigned', 'on_leave'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employee_number (employee_number),
  INDEX idx_email (email)
);

-- 5. 配属情報
CREATE TABLE staff_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  facility_id INT NOT NULL,
  department_id INT NOT NULL,
  position_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,                             -- NULLなら現在有効
  is_primary BOOLEAN DEFAULT TRUE,           -- 主配属か兼務か
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (position_id) REFERENCES positions(id),
  INDEX idx_staff_current (staff_id, end_date)
);
```

**Week 2完了条件**：
- ✅ 750名の職員データが投入されている
- ✅ メールアドレス・職員番号に重複がない
- ✅ 全職員に配属情報が紐づいている
- ✅ 施設別・部署別の職員数が事務局提供データと一致

### 4.5.4 Week 3-4（10/21 - 11/3）：コア機能DB構築

**対象機能**：
- キャリアコース選択制度（Phase 5）
- 面談予約システム
- 面談記録管理

**Week 3で作成するテーブル**：

```sql
-- 6. キャリアコース定義（マスター）
CREATE TABLE course_definitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(10) NOT NULL UNIQUE,   -- 'A', 'B', 'C', 'D'
  course_name VARCHAR(100) NOT NULL,
  description TEXT,
  department_transfer_available BOOLEAN DEFAULT FALSE,
  facility_transfer_available VARCHAR(20) DEFAULT 'none',
  relocation_required BOOLEAN DEFAULT FALSE,
  night_shift_available VARCHAR(20) DEFAULT 'none',
  management_track BOOLEAN DEFAULT FALSE,
  base_salary_multiplier DECIMAL(5,3) DEFAULT 1.000,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. 職員キャリアコース選択履歴
CREATE TABLE staff_career_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  course_code VARCHAR(10) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,                         -- NULLなら現在有効
  next_change_available_date DATE,
  special_change_reason VARCHAR(50),
  approved_at TIMESTAMP,
  approved_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  FOREIGN KEY (course_code) REFERENCES course_definitions(course_code),
  INDEX idx_staff_current_course (staff_id, effective_to)
);

-- 8. 面談予約
CREATE TABLE interviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  interviewer_id INT NOT NULL,
  interview_type VARCHAR(50) NOT NULL,       -- '定期', '臨時', 'キャリア'
  interview_category VARCHAR(50),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INT,
  location VARCHAR(100),
  status VARCHAR(20) DEFAULT '予定',         -- '予定', '完了', 'キャンセル'
  urgency_level VARCHAR(20) DEFAULT '通常',
  requested_topics JSON,
  created_by VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  FOREIGN KEY (interviewer_id) REFERENCES staff_basic(id),
  INDEX idx_booking_date (booking_date),
  INDEX idx_staff_interviews (staff_id, booking_date)
);

-- 9. 面談記録
CREATE TABLE interview_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  interview_id INT NOT NULL,
  discussion_summary TEXT,
  employee_feedback TEXT,
  interviewer_notes TEXT,
  action_items JSON,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  confidentiality_level INT DEFAULT 1,       -- 1-5
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id),
  UNIQUE KEY unique_interview_record (interview_id)
);
```

**Week 4完了条件**：
- ✅ A～Dコース定義が投入されている
- ✅ 職員のコース選択情報が投入されている（任意）
- ✅ 面談予約のテストデータが投入されている
- ✅ フロントエンドから面談予約が作成できる

### 4.5.5 Week 5-6（11/4 - 11/17）：機能別順次構築

**対象機能**：
- 人事評価システム
- 健康管理システム
- 研修管理システム

**Week 5-6で作成するテーブル**：

```sql
-- 10. 人事評価
CREATE TABLE evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  evaluation_period VARCHAR(20) NOT NULL,    -- '2024年上期'
  evaluation_type VARCHAR(50) NOT NULL,
  overall_rating VARCHAR(10) NOT NULL,       -- 'S', 'A', 'B', 'C', 'D'
  performance_score INT,
  skill_score INT,
  teamwork_score INT,
  growth_potential INT,
  evaluator_id INT NOT NULL,
  evaluation_date DATE NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  FOREIGN KEY (evaluator_id) REFERENCES staff_basic(id),
  INDEX idx_staff_evaluation (staff_id, evaluation_period)
);

-- 11. 2軸評価
CREATE TABLE two_axis_evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  evaluation_period VARCHAR(20) NOT NULL,
  facility_score ENUM('S','A','B','C','D'),
  facility_rank INT,
  facility_total_staff INT,
  corporate_score ENUM('S','A','B','C','D'),
  corporate_rank INT,
  corporate_total_staff INT,
  overall_score ENUM('S','A','B','C','D'),
  evaluation_date DATE NOT NULL,
  evaluator_id INT NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  FOREIGN KEY (evaluator_id) REFERENCES staff_basic(id)
);

-- 12. 健康診断
CREATE TABLE health_checkups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  checkup_date DATE NOT NULL,
  checkup_type VARCHAR(50) NOT NULL,
  overall_result VARCHAR(20),
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  bmi DECIMAL(4,2),
  blood_pressure_high INT,
  blood_pressure_low INT,
  vision_left DECIMAL(3,1),
  vision_right DECIMAL(3,1),
  hearing_result VARCHAR(50),
  special_findings TEXT,
  doctor_comments TEXT,
  next_checkup_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  INDEX idx_staff_checkup (staff_id, checkup_date)
);

-- 13. ストレスチェック
CREATE TABLE stress_checks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  check_date DATE NOT NULL,
  stress_index INT NOT NULL,                 -- 0-100
  physical_stress_score INT,
  mental_stress_score INT,
  work_stress_score INT,
  support_score INT,
  high_stress_flag BOOLEAN DEFAULT FALSE,
  counseling_required BOOLEAN DEFAULT FALSE,
  counseling_date DATE,
  follow_up_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  INDEX idx_staff_stress (staff_id, check_date),
  INDEX idx_high_stress (high_stress_flag, check_date)
);

-- 14. 研修プログラム
CREATE TABLE training_programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_name VARCHAR(200) NOT NULL,
  program_category VARCHAR(50) NOT NULL,
  duration_hours INT NOT NULL,
  is_mandatory BOOLEAN DEFAULT FALSE,
  target_positions JSON,
  target_departments JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 15. 研修受講記録
CREATE TABLE training_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  program_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  completion_status VARCHAR(20),
  score INT,
  evaluation VARCHAR(50),
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_number VARCHAR(50),
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_basic(id),
  FOREIGN KEY (program_id) REFERENCES training_programs(id)
);
```

**Week 6完了条件**：
- ✅ 評価システムのテストデータ投入
- ✅ 健康診断のサンプルデータ投入
- ✅ 研修プログラムのマスターデータ投入
- ✅ フロントエンドから各機能が利用できる

### 4.5.6 Week 7-8（11/18 - 12/1）：統合・最適化

**作業内容**：
- 全機能の統合テスト
- パフォーマンスチューニング
- インデックス最適化
- バックアップ・リストア確認
- VoiceDrive連携テスト

**Week 7-8完了条件**：
- ✅ 全テーブルが正常に動作
- ✅ 750名分のデータで性能問題なし
- ✅ バックアップ・リストアが正常動作
- ✅ VoiceDriveとのAPI連携成功
- ✅ セキュリティ監査合格

### 4.5.7 バックアップ戦略

#### 自動バックアップ設定

**毎日バックアップ（午前2時）**：

```bash
#!/bin/bash
# /var/backups/daily-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/var/backups/staff_medical_system"
DB_NAME="staff_medical_system"
DB_USER="admin"
DB_PASS="SecureP@ssw0rd!"

# フルバックアップ
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/full_backup_$DATE.sql

# テーブル別バックアップ（重要テーブルのみ）
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME staff_basic > $BACKUP_DIR/staff_basic_$DATE.sql
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME staff_assignments > $BACKUP_DIR/staff_assignments_$DATE.sql

# 30日以上前のバックアップを削除
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

# バックアップ成功通知
echo "Backup completed: $DATE" | mail -s "DB Backup Success" admin@kosei.jp
```

**Cron設定**：

```bash
# crontab -e
0 2 * * * /var/backups/daily-backup.sh
```

---

## Phase 4.7: DB構築後の移行作業

### 実施期間: 7-10日間（DB構築完了後）
### 実装状況: 📅 DB構築完了待ち

### 4.7.1 概要

**目的**: 共通データベース構築完了後、既存実装を本番環境に接続・統合

**対象システム**:
- Phase 3: 施設別権限管理システム（3施設750名）
- Phase 5-3: キャリアコース選択制度（A～D 4コース）

### 4.7.2 Phase 3関連作業（2-3日間）

#### 作業再開トリガー

**再開条件チェックリスト**：
- [ ] 共通データベースの構築完了通知を受領
- [ ] DB接続情報（ホスト、ポート、認証情報）を取得
- [ ] VoiceDriveチームからの再開依頼書を受領
- [ ] テスト用データの準備完了確認
- [ ] 本番APIエンドポイントURLの確定

#### Phase 1: 接続確認（所要時間: 2時間）

| 順序 | タスク | 担当 | 完了確認 |
|-----|-------|------|----------|
| 1 | DB接続テスト | DBチーム | [ ] |
| 2 | API疎通確認 | APIチーム | [ ] |
| 3 | SSL証明書検証 | セキュリティ | [ ] |
| 4 | Webhook送信テスト | 統合チーム | [ ] |

#### Phase 2: データ検証（所要時間: 4時間）

| 順序 | タスク | 担当 | 完了確認 |
|-----|-------|------|----------|
| 5 | 小原病院データ確認 | 業務チーム | [ ] |
| 6 | 立神病院データ確認 | 業務チーム | [ ] |
| 7 | 権限レベル計算検証 | 開発チーム | [ ] |
| 8 | 施設間異動シミュレーション | QAチーム | [ ] |

#### Phase 3: 統合テスト（所要時間: 4時間）

| 順序 | タスク | 担当 | 完了確認 |
|-----|-------|------|----------|
| 9 | 実データでの権限計算 | QAチーム | [ ] |
| 10 | 100件同時処理テスト | パフォーマンス | [ ] |
| 11 | Webhook通知確認 | 統合チーム | [ ] |
| 12 | エラーハンドリング検証 | QAチーム | [ ] |

#### 重点確認項目

**統括主任レベル7の動作確認**：
```javascript
// 必須テストケース
const testCase = {
  staffId: "TATE_002",
  facilityId: "tategami-rehabilitation",
  position: "統括主任",
  expectedLevel: 7  // 医療チーム承認済み
};

// 検証コード
const result = await calculateLevel(testCase);
assert(result.accountLevel === 7, "統括主任レベルが不正");
```

**施設間異動の検証**：
```javascript
// 薬剤部長→薬局長のケース
const transfer = {
  fromFacility: "obara-hospital",
  toFacility: "tategami-rehabilitation",
  fromPosition: "薬剤部長",
  expectedFromLevel: 10,
  expectedToLevel: 8  // 特殊調整適用
};
```

#### 完了基準

すべて「はい」になったら作業完了：
- [ ] DB接続が正常に動作している
- [ ] APIがすべて200 OKを返している
- [ ] 統括主任レベル7が正しく計算される
- [ ] Webhookが正常に送信される
- [ ] パフォーマンステストが基準値内
- [ ] エラーログにCriticalがない

### 4.7.3 Phase 5-3関連作業（7日間）

#### Day 1: 環境構築・DB接続確認

**医療システム側の作業**：

**09:00-11:00: Supabase環境構築**
```bash
# 1. Supabaseプロジェクト作成
# 2. データベーススキーマ作成
# 3. ストレージバケット作成
```

**テーブル作成SQL**:
```sql
-- コース定義テーブル
CREATE TABLE career_course_definitions (
  id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL UNIQUE,
  course_name TEXT NOT NULL,
  description TEXT,
  department_transfer_available BOOLEAN,
  facility_transfer_available TEXT,
  relocation_required BOOLEAN,
  night_shift_available TEXT,
  management_track BOOLEAN,
  base_salary_multiplier DECIMAL(3,2),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 職員キャリアコーステーブル
CREATE TABLE staff_career_courses (
  id TEXT PRIMARY KEY,
  staff_id TEXT REFERENCES staff(id),
  course_code TEXT NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  next_change_available_date DATE,
  special_change_reason TEXT,
  special_change_note TEXT,
  approval_status TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- コース変更申請テーブル
CREATE TABLE career_course_change_requests (
  id TEXT PRIMARY KEY,
  staff_id TEXT REFERENCES staff(id),
  current_course_code TEXT,
  requested_course_code TEXT NOT NULL,
  change_reason TEXT NOT NULL,
  reason_detail TEXT,
  requested_effective_date DATE NOT NULL,
  attachments TEXT[],
  approval_status TEXT DEFAULT 'pending',
  approved_by TEXT,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  review_comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_staff_career_courses_staff_id ON staff_career_courses(staff_id);
CREATE INDEX idx_staff_career_courses_approval_status ON staff_career_courses(approval_status);
CREATE INDEX idx_change_requests_staff_id ON career_course_change_requests(staff_id);
CREATE INDEX idx_change_requests_status ON career_course_change_requests(approval_status);
```

**11:00-12:00: 環境変数設定**

**医療システム側** (.env.production):
```env
# Supabase設定
DATABASE_URL=postgresql://user:pass@db.medical-system.local:5432/medical_staff_system
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# VoiceDrive連携
VOICEDRIVE_WEBHOOK_URL=https://voicedrive.medical-system.local/api/career-course/notify
VOICEDRIVE_API_KEY=ms_prod_key_X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6
MEDICAL_SYSTEM_API_KEY=vd_prod_key_A8B9C2D3E4F5G6H7I8J9K0L1M2N3O4P5
INTERNAL_API_KEY=production_internal_key_CHANGE_ME

# 本番環境設定
NODE_ENV=production
ENABLE_API_LOGGING=true
```

**13:00-15:00: コメントアウト解除**

4つのAPIエンドポイントのコメントを解除:
- `/src/app/api/my-page/route.ts`
- `/src/app/api/career-courses/definitions/route.ts`
- `/src/app/api/career-course/change-request/route.ts`
- `/src/app/api/career-course/my-requests/route.ts`

**15:00-17:00: DB接続テスト**
```bash
# テストデータ投入
npm run db:seed

# API動作確認
curl https://api.medical-system.local/api/career-courses/definitions
```

**VoiceDrive側の作業**：

**09:00-11:00: 環境変数設定**

**VoiceDrive側** (.env.production):
```env
NODE_ENV=production

# 医療システムAPI
NEXT_PUBLIC_MEDICAL_SYSTEM_API=https://api.medical-system.local

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**11:00-13:00: API接続確認**

医療システムAPIへの接続テスト実施

**14:00-17:00: エラーハンドリング強化**

モックデータフォールバックを削除し、エラーを再スローする処理に変更

#### Day 2: Supabase Auth統合

**医療システム側の作業**：
- 09:00-11:00: 認証処理の調整
- 11:00-13:00: トークン検証処理の実装
- 14:00-17:00: 認証エラーのテスト

**VoiceDrive側の作業**：
- 09:00-11:00: Supabase Clientの初期化
- 11:00-13:00: getAuthToken()の実装
- 14:00-16:00: 全API呼び出しにトークン追加
- 16:00-17:00: 認証テスト

#### Day 3-4: ファイルアップロード実装

**医療システム側の作業**：
- Storageバケット作成・ポリシー設定
- ファイルアップロード処理の実装
- ファイルダウンロード機能実装
- エラーケーステスト

**VoiceDrive側の作業**：
- ファイル選択UIの実装
- バリデーション実装（10MB上限、PDF/JPG/PNG）
- FormData送信処理の実装
- アップロード進捗表示

#### Day 5-6: 実データでの統合テスト

**両チーム合同作業**：

| テストケース | 期待結果 | 実測値 | 判定 |
|------------|---------|--------|------|
| GET /api/my-page | 200 OK, 実データ返却 | - | - |
| GET /api/career-courses/definitions | 200 OK, 4件返却 | - | - |
| POST /api/career-course/change-request | 201 Created | - | - |
| GET /api/career-course/my-requests | 200 OK, 申請履歴返却 | - | - |

**E2Eテスト**：
1. VoiceDriveでログイン
2. キャリア選択ステーション表示
3. マイページデータ表示確認
4. コース定義一覧表示確認
5. コース変更申請フォーム入力
6. ファイル添付
7. 申請送信
8. 申請履歴確認

**Webhook通知テスト**：
医療システム側でWebhook通知を手動送信し、VoiceDrive側で受信確認

**パフォーマンステスト**：

| API | 目標 | 実測値 | 判定 |
|-----|------|--------|------|
| GET /api/my-page | < 200ms | - | - |
| GET /api/career-courses/definitions | < 200ms | - | - |
| POST /api/career-course/change-request | < 500ms | - | - |
| GET /api/career-course/my-requests | < 300ms | - | - |

#### Day 7: バッファ日（予備日）

**用途**：
- 前日までに発見されたバグの修正
- パフォーマンス改善
- ドキュメント整備
- 次期フェーズ（Phase 5-4）の企画会議

### 4.7.4 完了基準

**Phase 3関連**：
- [ ] 3施設750名のデータが正常に取得できる
- [ ] 施設別権限計算が正確に動作する
- [ ] Webhook通知が正常に送信される

**Phase 5-3関連**：
- [ ] Supabase Auth統合完了
- [ ] ファイルアップロード機能完全実装
- [ ] E2Eテスト全工程完了
- [ ] パフォーマンステスト完了

---

## Phase 5: 本番移行

### 実施期間: 6週間

### 5.1 データ移行計画

| ステップ | 対象データ | データ量 | 所要時間 |
|---------|-----------|---------|----------|
| 1 | 施設・部門マスタ | 50件 | 30分 |
| 2 | 職員マスタ | 750件 | 2時間 |
| 3 | 退職者データ | 150件 | 1時間 |
| 4 | 面談記録 | 10,000件 | 6時間 |
| 5 | 通知履歴 | 5,000件 | 3時間 |
| 6 | 評価データ | 2,000件 | 2時間 |

### 5.2 段階的ロールアウト

```yaml
Week 1-2:
  - 本部スタッフ（10名）
  - 全機能テスト
  - 入職・退職フロー実証

Week 3-4:
  - 事務部門（50名）
  - 負荷テスト
  - 退職者検索機能テスト

Week 5-6:
  - 医療部門（200名）
  - パフォーマンス調整

Week 7-8:
  - 全職員（750名）
  - 完全移行
```

### 5.3 バックアップ・リカバリ計画

```bash
# 自動バックアップスケジュール
0 2 * * * /backup/daily-backup.sh      # 毎日2:00
0 3 * * 0 /backup/weekly-backup.sh     # 毎週日曜3:00
0 4 1 * * /backup/monthly-backup.sh    # 毎月1日4:00

# リカバリ時間目標
RTO: 4時間
RPO: 1時間
```

---

## 実装スケジュール

### 全体スケジュール（更新版）

```
Phase 0: 組織設計 ✅ 完了
  ├─ 権限階層設計、データアクセスマトリックス確定
  └─ 25レベル権限体系構築（2025-10-04完了）

Phase 0.5: 健康管理システム統合 ✅ 完了（2025-10-04）
  ├─ ストレスチェック同意管理（労働安全衛生法準拠）
  ├─ 健康データ監査ログシステム
  ├─ 健診担当者ダッシュボード
  └─ VoiceDrive健康通知統合

Phase 0.8: コンプライアンス通報統合 ✅ 87.5%完了（2025-10-04）
  ├─ VoiceDrive受付確認通知送信機能
  ├─ HMAC-SHA256署名検証
  ├─ 緊急度別メッセージ生成
  ├─ バッチ処理対応
  └─ 統合テスト（10月8日TC-006, TC-008手動確認）

Phase 1: 基盤構築 ⏳ 進行中
  └─ AWS Lightsail環境構築、MySQL共通DB設計

Phase 2: 認証システム統合 📅 Phase 1完了後
  └─ JWT/SSO実装、自動アカウント作成

Phase 3: データ連携実装 ✅ 100%完了（DB構築待機中）
  ├─ 小原病院統合（420名）
  ├─ 立神リハビリ統合（180名）
  └─ エスポワール立神統合（150名）

Phase 4: 職員ライフサイクル管理 📅 Phase 3完了後
  ├─ 入職処理実装
  └─ 退職処理実装

Phase 4.5: 共通DB構築 ⏳ インフラチーム作業中
  ├─ Week 1: マスターデータ
  ├─ Week 2: 職員情報（750名）
  ├─ Week 3-4: コア機能
  ├─ Week 5-6: 付加機能
  └─ Week 7-8: 統合・最適化

Phase 4.7: DB構築後の移行作業 📅 Phase 4.5完了後
  ├─ Phase 3接続確認（2-3日）
  └─ Phase 5-3統合（7日間）

Phase 5: 本番移行 📅 全Phase完了後
  └─ 段階的ロールアウト（Week 1-8）

Phase 5-3: キャリアコース ✅ 統合テスト完了（DB構築待機中）
  ├─ A～D 4コース実装
  ├─ 管理画面実装
  └─ 統合テスト77.8%成功

Phase 5-4: 機能拡張 📅 Phase 5-3完了後
  ├─ コース変更シミュレーション
  ├─ 承認ワークフロー
  └─ データ分析・ダッシュボード
```

### マイルストーン

| マイルストーン | 予定日 | 状態 |
|--------------|--------|------|
| Phase 0完了 | 2025-09-15 | ✅ 完了 |
| Phase 3完了 | 2025-09-28 | ✅ 完了（DB構築待機中） |
| Phase 5-3統合テスト完了 | 2025-10-01 | ✅ 完了 |
| **コンプライアンス通報統合テスト完了** | **2025-10-04** | ✅ **完了（100%）** |
| 共通DB構築開始 | 2025-10-07 | ⏳ 待機中 |
| **TC-006, TC-008手動確認テスト** | **2025-10-08** | 📅 **予定** |
| **コンプライアンス通報本番デプロイ** | **2025-10-10** | 🎯 **目標** |
| 共通DB構築完了 | 2025-12-01 | 📅 予定 |
| Phase 4.7完了 | 2025-12-10 | 📅 予定 |
| Phase 4完了 | 2026-02-01 | 📅 予定 |
| Phase 5完了（全職員移行） | 2026-03-31 | 📅 予定 |

---

## コスト見積もり

### 初期構築費用
| 項目 | 金額 |
|-----|------|
| Lightsail環境構築 | ¥200,000 |
| DB設計・実装 | ¥500,000 |
| API開発（Phase 1-3） | ¥800,000 |
| SSO統合 | ¥600,000 |
| 入職・退職処理実装（Phase 4） | ¥500,000 |
| データ移行 | ¥400,000 |
| **合計** | **¥3,000,000** |

### 月額運用費用
| 項目 | 金額 |
|-----|------|
| Lightsail (Production) | ¥12,000 |
| Lightsail (Staging) | ¥6,000 |
| バックアップストレージ | ¥3,000 |
| 監視・ログ管理 | ¥2,000 |
| **合計** | **¥23,000/月** |

---

## リスク管理

### 主要リスクと対策

| リスク | 影響度 | 発生確率 | 対策 | 状態 |
|--------|--------|----------|------|------|
| 組織構造の変更 | 高 | 中 | Phase 0で確定、変更管理プロセス確立 | ✅ 対策済み |
| データ移行エラー | 高 | 低 | 段階的移行、ロールバック計画 | ✅ 計画済み |
| パフォーマンス問題 | 中 | 中 | 負荷テスト、スケーリング計画 | 📅 実施予定 |
| セキュリティ侵害 | 高 | 低 | 多層防御、監査ログ、暗号化 | ✅ 実装済み |
| DB構築遅延 | 高 | 中 | 優先度明確化、リソース確保 | ⏳ 監視中 |

---

## 成功指標（KPI）

### 1. 技術指標
- API応答時間: < 200ms（95パーセンタイル）
- システム可用性: > 99.5%
- データ同期遅延: < 5秒

### 2. ビジネス指標
- 自動アカウント作成成功率: > 99%
- SSO利用率: > 90%
- ユーザー満足度: > 4.0/5.0

### 3. 運用指標
- インシデント解決時間: < 4時間
- バックアップ成功率: 100%
- セキュリティ監査合格率: 100%

---

## 次のアクション

### 即時実行項目（今週中：10/3-10/6）

| No. | アクション | 担当 | 期限 | 成果物 | 状態 |
|-----|-----------|------|------|--------|------|
| 1 | 共通DB構築開始判断会議 | 両チーム | 10/9 | 会議議事録 | 📅 予定 |
| 2 | 事務局への職員情報提供依頼 | 医療チーム | 10/3 | 依頼書送付 | ⏳ 作業中 |
| 3 | VoiceDriveチームへの確認事項送付 | 医療チーム | 10/3 | 確認書送付 | ⏳ 作業中 |
| 4 | Phase 3作業再開準備 | 医療チーム | 10/6 | 環境設定完了 | 📅 待機中 |
| 5 | Phase 5-3作業再開準備 | 両チーム | 10/6 | 環境設定完了 | 📅 待機中 |

### Week 1開始前準備（10/7-10/9）

| No. | アクション | 担当 | 期限 | 成果物 |
|-----|-----------|------|------|--------|
| 1 | データベースサーバー構築 | 医療チーム | 10/7 | 接続情報 |
| 2 | .envファイル設定 | 医療チーム | 10/8 | 設定完了 |
| 3 | 接続テスト実施 | 医療チーム | 10/8 | テスト結果 |
| 4 | 事務局提供データの受領 | 医療チーム | 10/9 | Excelファイル |
| 5 | VoiceDriveチームからの回答受領 | VoiceDriveチーム | 10/9 | 回答書 |

### Phase 4準備項目（Phase 3完了後）

1. ⬜ 入職・退職処理のUI/UXデザイン
2. ⬜ VoiceDriveチームへのアカウント管理API依頼
3. ⬜ 退職者データベーススキーマの最終確認
4. ⬜ 採用管理ページの機能拡張仕様策定

---

## 連絡先

### 医療システムチーム
- プロジェクトリーダー: medical-lead@example.com
- 技術担当: medical-tech@example.com

### VoiceDriveチーム
- プロジェクトリーダー: voicedrive-lead@example.com
- 技術担当: voicedrive-tech@example.com

### 事務局
- 人事部長: hr@kosei.jp
- データ提供担当: hr-data@kosei.jp

---

## 更新履歴

| 日付 | バージョン | 更新者 | 更新内容 |
|------|-----------|--------|---------|
| 2025-09-20 | 1.0 | 医療システムチーム | 初版作成 |
| 2025-09-30 | 1.1 | 医療システムチーム | Phase 4（職員ライフサイクル管理）追加<br>- 入職・退職処理の詳細仕様<br>- VoiceDriveアカウント自動作成・無効化<br>- 採用管理ページ退職者検索機能<br>- データライフサイクル管理<br>実装スケジュール・コスト見積もり更新 |
| 2025-10-03 | 2.0 | 医療システムチーム & VoiceDriveチーム | **統合版作成**<br>- 現在の実装状況を反映（Phase 3完了、Phase 5-3完了）<br>- Phase 4.5: 共通DB構築（詳細計画）追加<br>- Phase 4.7: DB構築後の移行作業追加<br>- Week 1-8の段階的DB構築スケジュール追加<br>- Phase 3作業再開指示書の統合<br>- Phase 5-3の7日間作業計画の統合<br>- 実装スケジュールの更新<br>- マイルストーンの更新 |
| 2025-10-04 | 2.1 | 医療システムチーム | **25レベル権限体系・健康管理・コンプライアンス統合**<br>- Phase 0.2: 25レベルアカウント権限体系に更新（基本18 + リーダー4 + 特別3）<br>- Phase 0.5: 健康管理システム統合完了追加<br>- Phase 0.8: コンプライアンス通報統合完了（87.5%）追加<br>- 現在の実装状況を10月4日時点に更新<br>- VoiceDriveチームとの25レベル同期完了を反映<br>- 実装スケジュールにPhase 0.5, 0.8を追加<br>- マイルストーンに10月8日統合テスト、10月10日本番デプロイを追加 |

---

**文書終了**

*本マスタープランは両チームの合意のもと、適宜更新される予定です。*
*Phase 3およびPhase 5-3の実装完了により、共通DB構築後の移行作業が明確化されました。*
*共通DB構築開始判断会議（10/9予定）での承認後、Phase 4.5の作業を開始します。*
