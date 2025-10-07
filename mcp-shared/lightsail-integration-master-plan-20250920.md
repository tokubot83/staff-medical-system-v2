# 🏗️ Lightsail統合環境構築・システム統合マスタープラン

**発信**: 医療システムチーム
**宛先**: VoiceDriveチーム
**日付**: 2025年9月20日
**件名**: Lightsail統合環境構築に向けた共同実装計画書

---

## 📋 実行優先順位と全体フロー

### 🎯 Phase 0: 組織設計・権限設計（最優先・Lightsail構築前）
### 🏗️ Phase 1: Lightsail + MySQL共通DB構築
### 🔗 Phase 2: アカウント統合・自動作成機能
### 🎨 Phase 3: SSO・シームレス統合
### 📊 Phase 4: 統合レポート・統計分析

---

## 🏥 Phase 0: 組織設計確定（最優先事項）

### ⚠️ **重要**: Lightsail構築前に必ず完了すべき事項

この設計が不完全だと、後からの大規模な権限変更・DB構造変更が必要になり、システム停止リスクが発生します。

### 📊 医療法人厚生会組織図確定事項

#### **1. 施設階層の明確化**
```
医療法人厚生会
├─ 本部（理事長・事務局）
├─ 病院A（院長・各部署）
├─ 病院B（院長・各部署）
├─ クリニックC（院長・スタッフ）
├─ 介護施設D（施設長・スタッフ）
└─ その他関連施設
```

**VoiceDriveチームへの確認事項**:
- 施設間の通知配信はどのように制御すべきか？
- 本部からの全施設一斉配信の仕様は？
- 施設固有の通知配信ルールは？

#### **2. 職階・職種の詳細定義**
```
理事長・院長レベル（Level 1）:
├─ 全施設統括権限
├─ 全データアクセス権
├─ 組織変更権限
└─ 監査・コンプライアンス管理

部長・科長・師長レベル（Level 2）:
├─ 担当部署完全管理権限
├─ 部下の評価・面談権限
├─ 部署統計・レポート権限
└─ 部署内通知配信権限

主任・副主任レベル（Level 3）:
├─ チーム管理権限
├─ 限定的評価権限（指導のみ）
├─ チーム統計閲覧権限
└─ チーム内連絡権限

一般職員レベル（Level 4）:
├─ 自身のデータ閲覧
├─ 面談予約・受信
├─ 研修参加・お知らせ受信
└─ 基本機能利用
```

**VoiceDriveチームへの確認事項**:
- VoiceDrive側での職階管理方法は？
- 面談予約時の階層制限ルールは？
- 権限昇格・降格時の処理方法は？

#### **3. 部署間権限・データ共有ルール**
```
医局:
├─ 医師の評価・面談データ
├─ 医療安全関連情報
└─ 学術・研修情報

看護部:
├─ 看護職員の評価・面談データ
├─ 看護ケア改善情報
└─ 看護研修・教育情報

薬剤科・リハビリ科・その他医療技術部門:
├─ 各専門職の評価・面談データ
├─ 専門技術向上情報
└─ 部門間連携情報

事務部:
├─ 事務職員の評価・面談データ
├─ 運営・管理情報
└─ 総務・人事情報

医療安全管理室:
├─ 全部署の安全関連データ（読み取り専用）
├─ インシデント・アクシデント報告
└─ 改善指導・教育実施権限
```

**VoiceDriveチームへの確認事項**:
- 部署横断的な面談（例：医療安全管理室→各部署）の実装方法は？
- データ閲覧権限の制御方法は？
- 部署異動時のデータ移行ルールは？

---

## 🔐 Phase 0: アクセス権限・機能振り分け設計

### 📋 権限マトリックス（要VoiceDriveチーム確認）

| 機能 | Level 1<br>(理事長・院長) | Level 2<br>(部科長・師長) | Level 3<br>(主任・副主任) | Level 4<br>(一般職員) |
|------|---------------------------|----------------------------|---------------------------|------------------------|
| **職員登録・編集** | ✅ 全施設 | ✅ 担当部署のみ | ❌ | ❌ |
| **面談実施・記録** | ✅ 全職員 | ✅ 部下のみ | ✅ チームのみ | ❌（受ける側のみ） |
| **評価入力・編集** | ✅ 全職員 | ✅ 部下のみ | ⚠️ 指導記録のみ | ❌ |
| **統計・レポート閲覧** | ✅ 全施設統計 | ✅ 担当部署統計 | ✅ チーム統計 | ✅ 個人データのみ |
| **通知配信** | ✅ 全施設配信 | ✅ 部署内配信 | ✅ チーム内配信 | ❌ |
| **面談予約** | ✅ 任意の職員と | ✅ 部下・同僚と | ✅ チーム内・同僚と | ✅ 上司・指定者と |
| **組織変更** | ✅ 全権限 | ⚠️ 提案のみ | ❌ | ❌ |
| **システム管理** | ✅ 全権限 | ❌ | ❌ | ❌ |

**VoiceDriveチームへの確認事項**:
- VoiceDrive側でのこれらの権限制御実装可能性は？
- 面談予約時の階層制限をどう実装するか？
- 権限変更時のリアルタイム反映方法は？

---

## 🏗️ Phase 1: Lightsail + MySQL共通DB構築

### 📊 共通データベース設計

#### **統合ユーザーテーブル設計**
```sql
-- 統合職員マスターテーブル
CREATE TABLE unified_staff (
    id UUID PRIMARY KEY,
    medical_system_id VARCHAR(50) UNIQUE,
    voicedrive_id VARCHAR(50) UNIQUE,

    -- 基本情報
    employee_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_kana VARCHAR(100),

    -- 組織情報
    facility_id UUID NOT NULL,
    department_id UUID NOT NULL,
    position_id UUID NOT NULL,
    level INTEGER NOT NULL, -- 1:理事長院長, 2:部科長師長, 3:主任副主任, 4:一般

    -- 権限情報
    permissions JSON NOT NULL,
    access_scope TEXT NOT NULL, -- 'all', 'facility', 'department', 'team', 'self'

    -- 認証情報
    medical_system_hash VARCHAR(255),
    voicedrive_hash VARCHAR(255),
    last_login_medical TIMESTAMP,
    last_login_voicedrive TIMESTAMP,

    -- ステータス
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (facility_id) REFERENCES facilities(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
);

-- 施設マスター
CREATE TABLE facilities (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('hospital', 'clinic', 'care_facility', 'other') NOT NULL,
    parent_facility_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 部署マスター
CREATE TABLE departments (
    id UUID PRIMARY KEY,
    facility_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('medical', 'nursing', 'pharmacy', 'rehabilitation', 'administration', 'safety', 'other') NOT NULL,
    parent_department_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- 職位マスター
CREATE TABLE positions (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    department_type ENUM('medical', 'nursing', 'pharmacy', 'rehabilitation', 'administration', 'safety', 'all') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**VoiceDriveチームへの確認事項**:
- VoiceDrive側のユーザーテーブル構造との適合性は？
- 追加で必要なフィールドはあるか？
- データ同期の頻度・方法は？

### 🔄 自動同期システム設計

#### **職員登録→VoiceDriveアカウント自動作成フロー**
```typescript
// 医療システム側：職員登録API
async function registerStaff(staffData) {
    // 1. 医療システムでの職員登録
    const medicalAccount = await createMedicalStaff({
        ...staffData,
        medical_system_id: generateId()
    });

    // 2. VoiceDrive API呼び出し（アカウント自動作成）
    const voiceDriveResponse = await voiceDriveAPI.createAccount({
        medical_system_ref_id: medicalAccount.id,
        email: staffData.email,
        name: staffData.name,
        facility: staffData.facility,
        department: staffData.department,
        position: staffData.position,
        level: staffData.level,
        permissions: calculatePermissions(staffData),
        initial_password: generateSecurePassword()
    });

    // 3. 統合ユーザーテーブルへの登録
    await createUnifiedStaff({
        medical_system_id: medicalAccount.id,
        voicedrive_id: voiceDriveResponse.user_id,
        ...staffData,
        permissions: mergePermissions(medicalAccount.permissions, voiceDriveResponse.permissions)
    });

    // 4. 認証情報の安全な配布
    await sendWelcomeEmail({
        email: staffData.email,
        medical_system_url: process.env.MEDICAL_SYSTEM_URL,
        voicedrive_url: process.env.VOICEDRIVE_URL,
        temporary_password: voiceDriveResponse.temporary_password,
        force_password_change: true
    });

    return {
        success: true,
        medical_account_id: medicalAccount.id,
        voicedrive_account_id: voiceDriveResponse.user_id
    };
}
```

**VoiceDriveチームに実装要求するAPI**:
```typescript
// VoiceDrive側で実装が必要なAPI
interface VoiceDriveAccountAPI {
    // アカウント作成
    createAccount(data: {
        medical_system_ref_id: string;
        email: string;
        name: string;
        facility: string;
        department: string;
        position: string;
        level: number;
        permissions: Permission[];
        initial_password?: string;
    }): Promise<{
        user_id: string;
        temporary_password: string;
        permissions: Permission[];
    }>;

    // アカウント更新（組織変更時）
    updateAccount(user_id: string, updates: Partial<AccountData>): Promise<void>;

    // アカウント無効化（退職時）
    deactivateAccount(user_id: string, reason: string): Promise<void>;

    // 権限同期
    syncPermissions(user_id: string, permissions: Permission[]): Promise<void>;
}
```

---

## 🔗 Phase 2: アカウント統合・自動作成機能

### 🎯 実装機能詳細

#### **1. 職員ライフサイクル管理**
```typescript
// 新規採用時
async function onStaffHired(staffData) {
    await registerStaff(staffData);
    await scheduleOrientationInterview(staffData);
    await enrollInMandatoryTraining(staffData);
}

// 組織変更時
async function onOrganizationChange(staffId, changes) {
    await updateMedicalSystemRole(staffId, changes);
    await voiceDriveAPI.updateAccount(staffId, changes);
    await updateUnifiedStaff(staffId, changes);
    await notifyStaffOfChanges(staffId, changes);
}

// 退職時
async function onStaffDeparture(staffId, departureDate) {
    await scheduleExitInterview(staffId, departureDate);
    await deactivateMedicalAccount(staffId, departureDate);
    await voiceDriveAPI.deactivateAccount(staffId, 'resignation');
    await archiveStaffData(staffId);
}
```

#### **2. 自動権限計算システム**
```typescript
function calculatePermissions(staffData): Permission[] {
    const basePermissions = getBasePermissions(staffData.level);
    const departmentPermissions = getDepartmentPermissions(staffData.department);
    const positionPermissions = getPositionPermissions(staffData.position);

    return mergePermissions([
        basePermissions,
        departmentPermissions,
        positionPermissions
    ]);
}

function getBasePermissions(level: number): Permission[] {
    switch(level) {
        case 1: // 理事長・院長
            return [
                'view_all_facilities',
                'manage_all_staff',
                'view_all_statistics',
                'send_all_notifications',
                'interview_any_staff',
                'evaluate_any_staff'
            ];
        case 2: // 部科長・師長
            return [
                'view_department_data',
                'manage_department_staff',
                'view_department_statistics',
                'send_department_notifications',
                'interview_subordinates',
                'evaluate_subordinates'
            ];
        case 3: // 主任・副主任
            return [
                'view_team_data',
                'guide_team_members',
                'view_team_statistics',
                'send_team_notifications',
                'interview_team_members'
            ];
        case 4: // 一般職員
            return [
                'view_own_data',
                'book_interviews',
                'receive_notifications',
                'participate_training'
            ];
        default:
            return ['view_own_data'];
    }
}
```

#### **3. セキュリティ・認証強化**
```typescript
// 初期パスワード配布
async function sendWelcomeEmail(userData) {
    const emailTemplate = `
職員番号: ${userData.employee_number}
お名前: ${userData.name}様

医療職員管理システムへようこそ。

【システムアクセス情報】
医療システムURL: ${userData.medical_system_url}
面談予約システムURL: ${userData.voicedrive_url}

【初回ログイン情報】
メールアドレス: ${userData.email}
仮パスワード: ${userData.temporary_password}

※セキュリティのため、初回ログイン時にパスワード変更が必要です。
※このメールは機密情報を含みます。適切に管理してください。
`;

    await sendSecureEmail(userData.email, '【重要】システムアクセス情報', emailTemplate);
}

// 2要素認証設定
async function setupTwoFactorAuth(userId) {
    await sendSMSVerification(userId);
    await enableEmailVerification(userId);
    await logSecurityEvent(userId, 'two_factor_enabled');
}
```

---

## 🎨 Phase 3: SSO・シームレス統合

### 🔐 Single Sign-On実装

#### **JWT トークンベース認証**
```typescript
// 統合認証サービス
class UnifiedAuthService {
    async login(email: string, password: string) {
        // 1. 統合ユーザーテーブルでの認証
        const user = await authenticateUser(email, password);

        // 2. JWT トークン生成
        const token = jwt.sign({
            user_id: user.id,
            medical_system_id: user.medical_system_id,
            voicedrive_id: user.voicedrive_id,
            permissions: user.permissions,
            level: user.level,
            facility_id: user.facility_id,
            department_id: user.department_id
        }, JWT_SECRET, { expiresIn: '24h' });

        // 3. 両システムでのセッション開始
        await Promise.all([
            startMedicalSystemSession(user.medical_system_id, token),
            startVoiceDriveSession(user.voicedrive_id, token)
        ]);

        return { token, user };
    }

    async verifyToken(token: string) {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await getUnifiedUser(decoded.user_id);
        return user;
    }
}
```

#### **シームレス画面遷移**
```typescript
// 医療システム→VoiceDrive遷移
function navigateToVoiceDrive(action: string, params?: any) {
    const token = getAuthToken();
    const voiceDriveUrl = `${VOICEDRIVE_URL}/${action}?token=${token}&params=${encodeURIComponent(JSON.stringify(params))}`;

    // 新しいタブで開く or 同一タブで遷移
    window.open(voiceDriveUrl, '_blank');
}

// 使用例：面談予約画面への直接遷移
function bookInterview(intervieweeId: string) {
    navigateToVoiceDrive('interview/book', {
        interviewee_id: intervieweeId,
        return_url: window.location.href
    });
}
```

---

## 📊 Phase 4: 統合レポート・統計分析

### 📈 統合ダッシュボード機能

#### **管理者向け統合レポート**
```typescript
// 統合統計データ取得
async function getIntegratedStatistics(userId: string, scope: string) {
    const user = await getUnifiedUser(userId);
    const permissions = user.permissions;

    const statistics = {
        // 医療システム統計
        medical_stats: await getMedicalSystemStats(user, scope),

        // VoiceDrive統計
        voicedrive_stats: await getVoiceDriveStats(user, scope),

        // 統合統計
        integration_stats: {
            total_staff: await getTotalStaffCount(scope),
            interview_completion_rate: await getInterviewCompletionRate(scope),
            evaluation_completion_rate: await getEvaluationCompletionRate(scope),
            notification_delivery_rate: await getNotificationDeliveryRate(scope),
            system_usage_rate: await getSystemUsageRate(scope)
        }
    };

    return filterByPermissions(statistics, permissions);
}
```

---

## 🎯 VoiceDriveチームへの実装要求事項

### 🔧 必須実装API

1. **アカウント管理API**
   - `POST /api/accounts` - アカウント作成
   - `PUT /api/accounts/{id}` - アカウント更新
   - `DELETE /api/accounts/{id}` - アカウント削除/無効化

2. **権限管理API**
   - `PUT /api/accounts/{id}/permissions` - 権限更新
   - `GET /api/permissions/validate` - 権限検証

3. **統合認証API**
   - `POST /api/auth/sso` - SSO認証
   - `POST /api/auth/verify` - トークン検証

4. **統計データAPI**
   - `GET /api/statistics/interviews` - 面談統計
   - `GET /api/statistics/notifications` - 通知統計

### 📋 連携仕様確認事項

1. **データ形式統一**
   - ユーザーID形式（UUID推奨）
   - 日時形式（ISO 8601推奨）
   - 権限表現形式

2. **セキュリティ要件**
   - API認証方式（Bearer Token推奨）
   - 通信暗号化（TLS 1.3）
   - データ暗号化要件

3. **パフォーマンス要件**
   - API応答時間目標（<100ms）
   - 同期処理の頻度
   - バッチ処理の実装

---

## 📅 実装スケジュール提案

### 📋 Phase 0: 組織設計（最優先・2週間）
- **Week 1**: 医療法人厚生会組織図確定
- **Week 2**: 権限設計・VoiceDriveチームとの仕様統一

### 🏗️ Phase 1: インフラ構築（4週間）
- **Week 1-2**: Lightsail環境構築・MySQL設定
- **Week 3-4**: 統合DB設計・実装・テスト

### 🔗 Phase 2: アカウント統合（6週間）
- **Week 1-2**: API設計・基本実装
- **Week 3-4**: 自動作成機能・権限同期
- **Week 5-6**: セキュリティ強化・テスト

### 🎨 Phase 3: SSO統合（4週間）
- **Week 1-2**: JWT認証・セッション管理
- **Week 3-4**: シームレス遷移・統合テスト

### 📊 Phase 4: 統合レポート（4週間）
- **Week 1-2**: 統計API・ダッシュボード
- **Week 3-4**: 最終テスト・本格運用開始

**総期間**: 約20週間（5ヶ月）

---

## 💬 医療システムチームからのメッセージ

VoiceDriveチームの皆様

統合テスト100%成功という素晴らしい成果を踏まえ、次の段階として真の「統合システム」実現に向けた詳細計画を共有いたします。

特に**Phase 0の組織設計は最優先事項**です。ここが不十分だと後からの大規模な変更が必要になり、システム停止リスクが発生します。

VoiceDriveチームのご意見・フィードバックをお聞かせください。共に医療現場に最適な統合システムを構築しましょう！

---

## 📣 Phase 7: 人事お知らせ統合（2025年10月追加）

### 🎯 目的

VoiceDrive（法人SNS）との人事お知らせ統合機能を実装し、双方向の通知・統計管理を実現する。

### 📊 実装スコープ

```
[職員カルテシステム]
  ↓ ① 人事お知らせ送信
[VoiceDrive]
  ↓ ② 職員への通知表示
  ↓ ③ アクション実行
  ↓ ④ 統計集計
  ↓ ⑤ Webhook送信（統計情報）
[職員カルテシステム]
  ↓ ⑥ 統計DB保存
  ↓ ⑦ ダッシュボード表示
```

### ✅ VoiceDrive側の準備状況（2025年10月7日）

| 項目 | 状況 | 備考 |
|------|------|------|
| **お知らせ受信API** | ✅ 実装完了 | `src/api/routes/hr-announcements.routes.ts` |
| **統計送信機能** | ✅ 実装完了 | Webhook + HMAC-SHA256署名 |
| **型定義** | ✅ 完成 | `src/types/hr-announcements.ts` |
| **技術ドキュメント** | ✅ 3件完成 | お知らせ受信仕様、統計送信仕様、回答文書 |
| **APIサーバー設定** | ✅ 完了 | レート制限、CORS、認証 |

### 🔧 職員カルテ側の実装タスク

| No | タスク | 工数 | 状況 |
|----|--------|------|------|
| 1 | お知らせ送信ペイロード仕様書確認 | 0.5日 | ⏳ |
| 2 | DB設計・マイグレーション | 0.5日 | ✅ 設計完了 |
| 3 | 型定義作成 | 0.5日 | ✅ 完了 |
| 4 | 人事お知らせ送信サービス実装 | 1.5日 | ⏳ |
| 5 | 統計受信Webhook API実装 | 1日 | ⏳ |
| 6 | 配信効果測定ダッシュボード実装 | 2日 | ⏳ |
| 7 | 統合テスト | 1日 | ⏳ |
| 8 | ドキュメント作成 | 0.5日 | ⏳ |

**合計：約7.5日（Phase 6完了後に実施）**

### 📋 主要成果物

| No | 成果物 | 形式 | 状況 |
|----|--------|------|------|
| 1 | 人事お知らせ送信機能 | TypeScript Service | ⏳ |
| 2 | 統計受信Webhook API | Next.js API Route | ⏳ |
| 3 | 統計DB設計 | PostgreSQL Schema | ✅ |
| 4 | 配信効果測定ダッシュボード | React Component | ⏳ |
| 5 | 統合テスト結果報告書 | Markdown | ⏳ |
| 6 | 運用手順書 | Markdown | ⏳ |

### 🔐 技術仕様

#### **エンドポイント**
```
職員カルテ → VoiceDrive: POST http://localhost:4000/api/hr-announcements
VoiceDrive → 職員カルテ: POST /api/voicedrive/stats (Webhook)
```

#### **認証**
- Bearer Token認証
- HMAC-SHA256署名検証（統計Webhook）
- `X-Source-System: medical-staff-system` ヘッダー必須

#### **レート制限**
- お知らせ送信: 100リクエスト/分
- 統計Webhook受信: 100リクエスト/分

#### **データモデル**
```typescript
// お知らせ送信
interface MedicalSystemAnnouncementRequest {
  title: string;                // 最大500文字
  content: string;             // 最大5000文字
  category: 'announcement' | 'interview' | 'training' | 'survey' | 'other';
  priority: 'low' | 'medium' | 'high';
  requireResponse: false;      // 固定値
  autoTrackResponse: true;     // 固定値
  // ...
}

// 統計受信
interface StatsWebhookPayload {
  event: 'stats.updated' | 'stats.hourly' | 'stats.daily';
  announcement: { id: string; title: string; category: string; };
  stats: {
    delivered: number;
    actions: number;
    completions: number;
  };
  // ...
}
```

### 📅 実装スケジュール

**前提条件**：Phase 6（共通DB構築）完了

| 期間 | タスク | 担当 |
|------|--------|------|
| **Week 1-1.5** | DB・API・サービス実装 | 職員カルテチーム |
| **Week 1.5-2** | ダッシュボード実装 | 職員カルテチーム |
| **Week 2** | 統合テスト | 両チーム合同 |
| **Week 2.5** | 本番デプロイ | 両チーム合同 |

**総期間**: 約2.5週間

### 🎯 成功基準

| 指標 | 目標 |
|------|------|
| 統合テスト成功率 | 100% |
| Webhook受信成功率 | 99%以上 |
| 平均レスポンス時間 | 500ms以下 |
| エラー率 | 1%以下 |
| ダッシュボード表示速度 | 3秒以内 |

### 📚 関連ドキュメント

**Phase 7実装計画**：
- `docs/Phase7_人事お知らせ統合実装計画.md`（完成）

**VoiceDrive側ドキュメント**（2025年10月7日受領）：
- `mcp-shared/specs/voicedrive-stats-webhook-spec-v1.0.0.md`
- `mcp-shared/docs/Response_VoiceDrive_Stats_Webhook_Spec_20251007.md`
- `mcp-shared/docs/Response_VoiceDrive_Implementation_Code_20251007.md`
- VoiceDrive型定義ファイル（`src/types/hr-announcements.ts`）
- VoiceDrive APIサーバー設定（`src/api/server.ts`）
- VoiceDrive実装コード（`src/api/routes/hr-announcements.routes.ts`）

**職員カルテ側成果物**：
- `mcp-shared/interfaces/hr-announcement-api.interface.ts`（型定義完成）

### 📝 備考

**VoiceDriveチームの評価**: ⭐⭐⭐⭐⭐
- 完璧な実装コード（400行）
- 詳細な技術ドキュメント（3件）
- HMAC-SHA256署名検証実装済み
- 統合テスト環境構築可能

**統合準備状況**: 🟢 **非常に良好**
- VoiceDrive側: 100%完了
- 職員カルテ側: 計画完成、実装待ち
- 依存: Phase 6完了のみ

**Phase 7実装の注意事項**（2025年10月7日 VoiceDrive回答に基づく）:
- **統計Webhook**: Phase 7では`stats.updated`（リアルタイム）のみ実装、`stats.hourly`/`stats.daily`はPhase 8以降
- **surveySubCategory**: Phase 7では実装不要（VoiceDrive内部用、API v2.0で検討）
- **認証情報共有**: 1Password共有Vault使用
- **統合テスト**: Day 6、Zoom、2-3時間

---

---

## 📊 Phase 7.5: VoiceDrive Analytics 統合（2025年10月追加）

### 🎯 目的

VoiceDrive（法人SNS）の職員投稿データを自動分析し、感情分析・トピック分析結果を双方向で連携する。

### 📊 実装スコープ

```
[VoiceDrive]
  ↓ ① 集計データ取得API（過去7日間）
[職員カルテシステム]
  ↓ ② LLM分析実行（感情分析 + トピック分析）
  ↓ ③ 分析結果送信API
[VoiceDrive]
  ↓ ④ 分析結果DB保存
  ↓ ⑤ ダッシュボード表示
[VoiceDrive（アカウントレベル99）]
  ↓ ⑥ システム通知受信（成功・エラー）
```

### ✅ 実装完了状況（2025年10月9日）

| 項目 | 状況 | 備考 |
|------|------|------|
| **VoiceDrive Analytics API** | ✅ 実装完了 | GET `/api/v1/analytics/aggregated-stats` |
| **VoiceDrive 分析受信API** | ✅ 実装完了 | POST `/api/v1/analytics/group-data` |
| **統合テスト** | ✅ 100%成功 | 17/17テスト成功（10/9 22:35） |
| **データ取得バッチ** | ✅ 実装完了 | `src/batch/voicedrive-analytics-fetch.ts` |
| **LLM分析パイプライン** | ✅ モック完了 | `src/services/VoiceDriveAnalyticsProcessor.ts` |
| **データ送信バッチ** | ✅ 実装完了 | `src/batch/voicedrive-analytics-send.ts` |
| **統合パイプライン** | ✅ 実装完了 | `src/batch/voicedrive-analytics-pipeline.ts` |
| **VoiceDrive通知システム** | ✅ 実装完了 | `src/utils/voicedrive-notifier.ts` |
| **型定義** | ✅ 完成 | `mcp-shared/interfaces/voicedrive-analytics-api.interface.ts` |

### 🔧 実装完了機能

#### **1. データ取得バッチ処理**
```bash
npm run analytics:fetch
```
- VoiceDriveから過去7日間の集計データ取得
- K-匿名性チェック（K≥5）
- HMAC-SHA256署名検証
- レート制限監視（100リクエスト/時間）
- データ保存先: `data/analytics/fetch-*.json`

#### **2. LLM分析パイプライン**
```typescript
// VoiceDriveAnalyticsProcessor.ts
export class VoiceDriveAnalyticsProcessor {
  // 感情分析（ポジティブ・ニュートラル・ネガティブ）
  async analyzeSentiment(data: AggregatedData): Promise<SentimentAnalysisData>

  // トピック分析（キーワード抽出・新出トピック検出）
  async analyzeTopics(data: AggregatedData): Promise<TopicAnalysisData>

  // 統合分析実行
  async processAnalytics(data: AggregatedData): Promise<GroupAnalyticsRequest>
}
```

**現在**: 統計ベースのモック実装
**将来**: Llama 3.2 8B Instruct 統合（共通DB構築後）

#### **3. データ送信バッチ処理**
```bash
npm run analytics:send
```
- 分析結果をVoiceDriveへ送信
- HMAC-SHA256署名付き
- メタデータ自動付与（sourceSystem, version, generatedBy, llmModel）
- 送信ログ保存: `logs/analytics/send-*.json`

#### **4. 統合エンドツーエンドパイプライン**
```bash
npm run analytics:pipeline
```
- Step 1: データ取得
- Step 2: LLM分析
- Step 3: データ送信
- Step 4: VoiceDrive通知送信（アカウントレベル99）
- 実行タイミング: 毎日 02:00 JST（予定）
- パイプラインログ: `logs/analytics/pipeline-log-*.json`

#### **5. VoiceDrive通知システム（NEW）**
```typescript
// voicedrive-notifier.ts
export async function sendVoiceDriveNotification(
  type: 'success' | 'error' | 'warning' | 'info',
  data: NotificationData
): Promise<NotificationResponse>

// ヘルパー関数
sendSuccessNotification(title, message, details)
sendErrorNotification(title, message, details)
sendWarningNotification(title, message, details)
sendInfoNotification(title, message, details)
```

**特徴**:
- **アカウントレベル99通知**: システム管理者へ直接通知
- **HMAC署名**: 改ざん防止
- **詳細メトリクス**: 期間、総投稿数、感情分析、トピック分析、パフォーマンス
- **エンドポイント**: `POST /api/webhook/analytics-notification`
- **統合済み**: 成功・エラー両方の通知をパイプラインに統合

**Slack通知から変更した理由**:
- システム内完結（外部サービス不要）
- 既存の権限システム活用
- セキュリティ向上（外部依存排除）
- 統一された通知管理

### 🔐 技術仕様

#### **エンドポイント**
```
GET  http://localhost:4000/api/v1/analytics/aggregated-stats
POST http://localhost:4000/api/v1/analytics/group-data
POST http://localhost:4000/api/webhook/analytics-notification (VoiceDrive側実装予定)
```

#### **認証**
- Bearer Token認証（JWT）
- アカウントレベル99権限
- HMAC-SHA256署名検証

#### **レート制限**
- GET `/aggregated-stats`: 100リクエスト/時間
- POST `/group-data`: レート制限なし（バッチ処理想定）
- POST `/analytics-notification`: 100リクエスト/分（予定）

#### **K-匿名性要件**
- **最小同意ユーザー数**: K ≥ 5
- **準拠チェック**: 全バッチ処理で自動実行
- **違反時**: データ取得中止・エラー通知送信

#### **データモデル**
```typescript
// 集計データ取得
interface AggregatedStatsRequest {
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
}

// 分析結果送信
interface GroupAnalyticsRequest {
  analysisDate: string;
  period: { startDate: string; endDate: string; };
  postingTrends: { totalPosts: number; totalUsers: number; participationRate: number; };
  sentimentAnalysis: { positive: number; neutral: number; negative: number; averageConfidence: number; };
  topicAnalysis: { topKeywords: Keyword[]; emergingTopics: Topic[]; byDepartment: DepartmentTopic[]; };
  privacyMetadata: { totalConsentedUsers: number; minimumGroupSize: number; kAnonymityCompliant: boolean; };
  metadata?: { sourceSystem: string; version: string; generatedBy: string; llmModel: string; };
}

// VoiceDrive通知
interface NotificationData {
  title: string;
  message: string;
  details?: {
    period?: { startDate: string; endDate: string; };
    summary?: { totalPosts: number; totalUsers: number; participationRate: string; };
    sentiment?: { positive: number; neutral: number; negative: number; confidence: number; };
    topics?: { topKeywords: string; emergingTopicsCount: number; };
    performance?: { processingTime: string; rateLimit?: { remaining: number; limit: number; }; };
    error?: { message: string; stack?: string; timestamp: string; };
  };
}
```

### 📋 統合テスト結果（2025年10月9日）

| テストフェーズ | テスト数 | 成功 | 成功率 |
|---------------|---------|------|--------|
| Phase 1: サーバー接続確認 | 1 | 1 | 100% |
| Phase 2: 認証テスト | 3 | 3 | 100% |
| Phase 3: データ取得API | 5 | 5 | 100% |
| Phase 4: データ送信API | 5 | 5 | 100% |
| Phase 5: エラーハンドリング | 3 | 3 | 100% |
| **合計** | **17** | **17** | **100%** ✅ |

**パフォーマンス**:
- 平均レスポンス時間: 17.3ms
- 最大レスポンス時間: 52ms
- データ取得成功: 342件（過去7日間）
- HMAC署名検証: 100%成功

**確認済み機能**:
- ✅ JWT Bearer Token認証
- ✅ HMAC-SHA256署名検証
- ✅ レート制限機能（100リクエスト/時間）
- ✅ K-匿名性準拠（13同意ユーザー ≥ 5）
- ✅ プライバシーメタデータ検証
- ✅ エラーハンドリング（401, 400, 500）

### 📅 実装スケジュール

| 期間 | タスク | 状況 |
|------|--------|------|
| **Week 1** | VoiceDrive Analytics API統合テスト | ✅ 完了（10/9） |
| **Week 2** | バッチ処理・LLM分析パイプライン実装 | ✅ 完了（10/9） |
| **Week 2.5** | VoiceDrive通知システム実装 | ✅ 完了（10/9） |
| **Phase 6完了後** | Llama 3.2 8B Instruct 統合 | ⏳ 待機中 |
| **Phase 6完了後** | データビジュアライゼーション実装 | ⏳ 待機中 |
| **Phase 6完了後** | 本番環境デプロイ・自動実行設定 | ⏳ 待機中 |

**総期間**: 約2.5週間（基本実装完了）

### 🎯 今後の実装予定

#### **1. Llama 3.2 8B Instruct 統合（Phase 6完了後）**
```typescript
// VoiceDriveAnalyticsProcessor.ts
// 現在: モック実装（統計ベース）
// 将来: Llama 3.2による実際のLLM分析

async analyzeSentiment(data: AggregatedData): Promise<SentimentAnalysisData> {
  // Llama 3.2でカテゴリー別投稿内容を分析
  // idea_voice, free_voice, question_voice, concern_voiceの感情傾向を高精度判定
  const llamaResponse = await llamaClient.analyze({
    model: 'llama-3.2-8b-instruct',
    task: 'sentiment-analysis',
    data: aggregatedData
  });

  return llamaResponse.sentimentAnalysis;
}

async analyzeTopics(data: AggregatedData): Promise<TopicAnalysisData> {
  // Llama 3.2でキーワード抽出・TF-IDF分析
  const llamaResponse = await llamaClient.analyze({
    model: 'llama-3.2-8b-instruct',
    task: 'topic-extraction',
    data: aggregatedData
  });

  return llamaResponse.topicAnalysis;
}
```

#### **2. データビジュアライゼーション実装（Phase 6完了後）**
```
新規ページ: /reports/voicedrive-analytics

表示内容:
- 期間別投稿トレンド（グラフ）
- 感情分析結果（円グラフ）
- トピックランキング（バーチャート）
- 部署別統計（テーブル）
- レベル別参加率（グラフ）
- 新出トピック検出（アラート）
```

#### **3. 自動実行設定（Phase 6完了後）**
```bash
# cron設定（Lightsail環境）
0 2 * * * cd /home/medical-system && npm run analytics:pipeline

# または
# AWS EventBridgeスケジューラ設定
# 毎日 02:00 JST（17:00 UTC前日）
```

### 📚 関連ドキュメント

**Phase 7.5実装成果物**:
- `mcp-shared/docs/Integration_Test_Completion_Report_20251009.md`（統合テスト完了報告書）
- `mcp-shared/docs/Integration_Test_Success_Acknowledgement_20251009.md`（VoiceDrive回答書）
- `mcp-shared/interfaces/voicedrive-analytics-api.interface.ts`（型定義）
- `src/services/VoiceDriveAnalyticsClient.ts`（APIクライアント）
- `src/services/VoiceDriveAnalyticsProcessor.ts`（LLM分析パイプライン）
- `src/batch/voicedrive-analytics-fetch.ts`（データ取得バッチ）
- `src/batch/voicedrive-analytics-send.ts`（データ送信バッチ）
- `src/batch/voicedrive-analytics-pipeline.ts`（統合パイプライン）
- `src/utils/voicedrive-notifier.ts`（VoiceDrive通知システム）
- `tests/voicedrive-analytics-integration-test.ts`（統合テスト）

**VoiceDrive側ドキュメント**（2025年10月7日受領）:
- `mcp-shared/docs/Integration_Test_Clarification_20251009.md`（VoiceDrive統合テスト説明書）
- `mcp-shared/docs/Integration_Test_Server_Ready_20251009.md`（VoiceDriveテストサーバー準備完了通知）

**実行ログサンプル**:
- `logs/analytics/pipeline-log-2025-10-07T14-19-13-950Z.json`
- `logs/analytics/pipeline-log-2025-10-07T14-02-43-997Z.json`

### 📝 備考

**VoiceDriveチームの評価**: ⭐⭐⭐⭐⭐
- 統合テスト100%成功（17/17テスト）
- 平均17.3msの高速レスポンス
- HMAC署名検証100%成功
- K-匿名性要件完全準拠
- 詳細なエラーハンドリング

**統合準備状況**: 🟢 **実装完了・待機中**
- VoiceDrive側: API完成・テストサーバー稼働中
- 職員カルテ側: バッチ処理・通知システム完成
- 依存: Phase 6（共通DB構築）完了
- 本番稼働: Phase 6完了後に自動実行設定

**Phase 7.5の重要変更**（2025年10月9日）:
- **通知方式変更**: Slack通知 → VoiceDrive アカウントレベル99通知
  - 理由: システム内完結、既存権限活用、セキュリティ向上、統一管理
  - 実装: `src/utils/voicedrive-notifier.ts`
  - エンドポイント: `POST /api/webhook/analytics-notification`（VoiceDrive側実装待ち）
  - 通知内容: 成功・エラー・警告・情報（詳細メトリクス付き）

**VoiceDriveチームへの実装依頼**:
- Webhook通知エンドポイント: `POST /api/webhook/analytics-notification`
- HMAC-SHA256署名検証
- アカウントレベル99ユーザーへの通知表示
- 通知データ構造: `NotificationData` インターフェース準拠
- 詳細仕様書: `mcp-shared/docs/VoiceDrive_Notification_Specification_20251009.md`（作成予定）

---

**📧 連絡先**: 医療システムチーム統合担当
**📋 関連ファイル**:
- `integration-test-completion-report-20250920.md`
- `phase3-perfect-success-report-20250920.md`
- `docs/Phase7_人事お知らせ統合実装計画.md`
- `mcp-shared/docs/Integration_Test_Completion_Report_20251009.md` (**NEW**)
- `mcp-shared/docs/Integration_Test_Success_Acknowledgement_20251009.md` (**NEW**)
**🎯 次のマイルストーン**: Phase 6完了 → Llama 3.2統合 → データビジュアライゼーション実装

**最終更新**: 2025年10月9日（Phase 7.5追加）