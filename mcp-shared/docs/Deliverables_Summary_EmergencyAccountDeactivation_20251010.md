# アカウント緊急無効化機能 成果物サマリー

**作成日**: 2025年10月10日
**プロジェクト**: アカウント緊急無効化機能の実装
**優先度**: 🔴 **CRITICAL（グループ0: 緊急機能）**

---

## 📋 成果物一覧

本日（2025年10月10日）、アカウント緊急無効化機能に関する以下の3つのドキュメントを作成しました。

| No | ドキュメント名 | ファイル名 | 目的 | 対象読者 |
|----|-------------|-----------|------|---------|
| 1 | **医療システムへの回答書・確認書** | `Response_EmergencyAccountDeactivation_Requirements_20251010.md` | 医療システムチームへの連携要件確認と実装依頼 | 医療システムチーム |
| 2 | **VoiceDrive側マスタープラン** | `EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md` | VoiceDrive側の実装計画（Phase 1-4） | VoiceDriveチーム |
| 3 | **schema.prisma更新提案書** | `Schema_Update_Proposal_EmergencyAccountDeactivation_20251010.md` | DB実装の詳細（テーブル3件） | VoiceDriveチーム（開発者） |

---

## 📄 ドキュメント1: 医療システムへの回答書・確認書

**ファイル**: `mcp-shared/docs/Response_EmergencyAccountDeactivation_Requirements_20251010.md`

### 目的
医療システムチームに対して、アカウント緊急無効化機能の連携要件を明確に伝え、実装依頼と確認事項を提示する。

### 主な内容

#### ✅ VoiceDrive側の対応（説明）
1. DB実装移行（LocalStorage → Prisma）
2. テーブル追加（EmergencyDeactivation、StaffSystemSyncQueue、AuditLog拡張）
3. Webhook送受信実装
4. 自動同期機能実装

#### 🔴 医療システムへの依頼（3件）

| No | 依頼内容 | 優先度 | 所要時間（推定） |
|----|---------|--------|----------------|
| 1 | Webhook受信エンドポイント実装<br>`POST /api/webhooks/voicedrive-emergency-deactivation` | 🔴 HIGH | 2-3日 |
| 2 | 確認Webhook送信実装<br>`POST https://voicedrive.ai/api/webhooks/account-deactivation-confirmed` | 🔴 HIGH | 1-2日 |
| 3 | ヘルスチェックAPI実装<br>`GET /api/health/status` | 🟡 MEDIUM | 1日 |

#### ❓ 医療システムへの確認事項（3件）

| No | 確認内容 | 選択肢 |
|----|---------|--------|
| 1 | アカウント無効化の処理方針 | Option A: `accountStatus`のみ更新（推奨）<br>Option B: `accountStatus` + `isRetired`更新<br>Option C: カスタム処理 |
| 2 | Webhookリトライポリシー | リトライ回数、間隔、タイムアウトの確認 |
| 3 | HMAC署名仕様 | アルゴリズム、シークレットキー管理方法 |

#### 📊 データフロー図
VoiceDrive → 医療システム → VoiceDrive の双方向Webhook連携フローを詳細に説明

#### 📅 想定スケジュール
- 医療システム側の実装期間: 約1-2週間
- VoiceDrive側の実装期間: 約2-3週間（並行実施）

### 次のアクション
- [ ] 医療システムチームへの送付（2025年10月11日）
- [ ] 確認事項への回答受領（2025年10月24日まで）

---

## 📄 ドキュメント2: VoiceDrive側マスタープラン

**ファイル**: `mcp-shared/docs/EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md`

### 目的
VoiceDriveチーム内で、アカウント緊急無効化機能の実装を段階的に進めるための詳細な計画書。

### 主な内容

#### Phase別実装計画

| Phase | 内容 | 期間 | 主要成果物 |
|-------|------|------|----------|
| **Phase 1** | DB実装移行 | 2-3日 | テーブル3件、Service修正、テスト |
| **Phase 2** | Webhook連携 | 3-5日 | Webhook送受信、HMAC署名 |
| **Phase 3** | 自動同期機能 | 2-3日 | ヘルスチェック、SyncQueue処理 |
| **Phase 4** | 統合テスト・リリース | 1週間 | ドキュメント、本番デプロイ |

#### Phase 1: DB実装移行（最優先）

**目標**: LocalStorageからPrisma DBへの移行完了

**実装内容**:
1. EmergencyDeactivationテーブル追加
2. StaffSystemSyncQueueテーブル追加
3. AuditLog拡張
4. EmergencyAccountService.ts修正（3箇所）
   - `saveDeactivationRecord()`
   - `logAuditAction()`
   - `notifyStaffSystemWhenAvailable()`
5. 単体テスト・E2Eテスト作成

**成果物**:
- schema.prisma（更新）
- EmergencyAccountService.ts（修正）
- テストファイル2件（新規）
- マイグレーションファイル3件（自動生成）

#### Phase 2: Webhook連携

**目標**: 医療システムとの双方向Webhook連携

**前提条件**:
- ✅ Phase 1完了
- ⏳ 医療システム側のWebhook実装完了

**実装内容**:
1. MedicalSystemWebhookService.ts実装（送信）
2. /api/webhooks/account-deactivation-confirmed.ts実装（受信）
3. HMAC署名生成・検証
4. リトライロジック（3回、1分・5分・15分間隔）
5. 統合テスト（モック使用）

**成果物**:
- MedicalSystemWebhookService.ts（新規）
- /api/webhooks/account-deactivation-confirmed.ts（新規）
- 統合テストファイル（新規）

#### Phase 3: 自動同期機能

**目標**: 医療システム復旧後の自動データ送信

**実装内容**:
1. checkMedicalSystemHealth.ts実装（5分ごと）
2. processSyncQueue.ts実装（キュー処理）
3. Cronジョブ設定
4. リトライロジック実装

**成果物**:
- medicalSystemHealthCheck.ts（新規）
- processSyncQueue.ts（新規）
- jobs/index.ts（新規）

#### Phase 4: 統合テスト・リリース

**目標**: 本番環境デプロイ

**実装内容**:
1. 障害シミュレーションテスト
2. 復旧シミュレーションテスト
3. 負荷テスト（100件同期）
4. ドキュメント整備
   - API仕様書（OpenAPI 3.0）
   - 運用手順書
   - トラブルシューティングガイド
5. 段階的ロールアウト

**成果物**:
- 統合テストファイル（新規）
- API仕様書（OpenAPI YAML）
- 運用ドキュメント3件

#### 全体スケジュール（4週間）

```
Week 1: Phase 1 (DB実装)          ⏳ 準備中
Week 2: Phase 2 (Webhook連携)     ⏳ 医療チーム実装待ち
Week 3: Phase 3 (自動同期)        ⏳ Phase 2後
Week 4: Phase 4 (統合テスト)      ⏳ Phase 3後
```

### 次のアクション
- [ ] Phase 1開始（2025年10月11日）
- [ ] schema.prisma更新
- [ ] EmergencyAccountService.ts修正

---

## 📄 ドキュメント3: schema.prisma更新提案書

**ファイル**: `mcp-shared/docs/Schema_Update_Proposal_EmergencyAccountDeactivation_20251010.md`

### 目的
アカウント緊急無効化機能に必要なDB変更の詳細仕様を提供し、マイグレーション手順を明確化する。

### 主な内容

#### 追加・変更内容

| No | 種別 | テーブル名 | 優先度 | 主な用途 |
|----|------|-----------|--------|---------|
| 1 | 新規追加 | EmergencyDeactivation | 🔴 CRITICAL | 緊急停止記録の永続化 |
| 2 | 新規追加 | StaffSystemSyncQueue | 🔴 CRITICAL | 医療システム同期キュー |
| 3 | 既存拡張 | AuditLog | 🟡 RECOMMENDED | 緊急操作の追跡強化 |

#### Table 1: EmergencyDeactivation

**フィールド数**: 16フィールド

**主要フィールド**:
- `targetUserId`: 対象ユーザーID
- `executedBy`: 実行者ID
- `reason`: 停止理由（TEXT、必須）
- `syncToStaffSystem`: 医療システム同期済みフラグ
- `status`: 同期ステータス（'pending' | 'synced' | 'failed'）

**インデックス**: 5件
- `targetUserId`（ユーザー別検索）
- `executedBy`（実行者別検索）
- `timestamp`（日時順ソート）
- `status`（ステータス別フィルタ）
- `syncToStaffSystem`（未同期検索）

#### Table 2: StaffSystemSyncQueue

**フィールド数**: 17フィールド

**主要フィールド**:
- `type`: 同期タイプ（'ACCOUNT_DEACTIVATION' 等）
- `payload`: 同期データ（JSON）
- `status`: 処理ステータス（'queued' | 'processing' | 'completed' | 'failed'）
- `retryCount`: リトライ回数（デフォルト0、最大3）
- `nextRetryAt`: 次回リトライ日時

**インデックス**: 5件
- `status`（ステータス別フィルタ）
- `type`（タイプ別フィルタ）
- `queuedAt`（日時順ソート）
- `nextRetryAt`（リトライ対象検索）
- `targetUserId`（ユーザー別検索）

#### Table 3: AuditLog拡張

**追加フィールド**: 5フィールド
- `executorLevel`: 実行者の権限レベル
- `targetUserId`: 対象ユーザーID
- `reason`: 操作理由
- `isEmergencyAction`: 緊急操作フラグ
- `syncPending`: 同期待ちフラグ

**追加インデックス**: 2件
- `(action, isEmergencyAction)`（緊急操作フィルタ）
- `targetUserId`（対象ユーザー別検索）

#### マイグレーション手順

**開発環境（SQLite）**:
```bash
# schema.prisma更新後
npx prisma migrate dev --name add_emergency_deactivation_tables
npx prisma generate
```

**本番環境（MySQL）**:
```bash
# バックアップ作成
mysqldump -u root -p voicedrive_production > backup_20251010.sql

# マイグレーション適用
export DATABASE_URL="mysql://user:password@host:3306/voicedrive_production"
npx prisma migrate deploy
```

#### ロールバック手順

開発環境とMySQL本番環境それぞれのロールバック手順を詳細に記載。

### 次のアクション
- [ ] schema.prisma更新（2025年10月11日）
- [ ] マイグレーション実行（development）
- [ ] テーブル作成確認

---

## 🎯 優先順位と次のステップ

### 🔴 最優先（今週中）

#### 1. 医療システムチームへの送付（2025年10月11日）
- [ ] `Response_EmergencyAccountDeactivation_Requirements_20251010.md`をMCP共有フォルダに配置
- [ ] Slackで医療システムチームに通知
- [ ] 確認事項の回答期限設定（2025年10月24日）

#### 2. VoiceDrive Phase 1開始（2025年10月11日-14日）
- [ ] schema.prisma更新（ドキュメント3参照）
- [ ] マイグレーション実行
- [ ] EmergencyAccountService.ts修正
- [ ] 単体テスト・E2Eテスト作成

### 🟡 中優先（来週）

#### 3. Phase 2準備（医療チーム実装待ち）
- [ ] 医療システムチームからの回答確認
- [ ] HMAC共有シークレットキーの生成・共有
- [ ] 環境変数設定（.env.production、.env.development）

#### 4. Phase 2実装開始（2025年10月15日-21日）
- [ ] MedicalSystemWebhookService.ts実装
- [ ] Webhook受信エンドポイント実装
- [ ] 統合テスト（モック使用）

### 🟢 低優先（再来週以降）

#### 5. Phase 3実装（2025年10月22日-25日）
- [ ] ヘルスチェック機能実装
- [ ] 同期キュー処理実装
- [ ] Cronジョブ設定

#### 6. Phase 4統合テスト・リリース（2025年10月28日-11月4日）
- [ ] 障害・復旧シミュレーションテスト
- [ ] ドキュメント整備
- [ ] 段階的ロールアウト

---

## 📊 全体像の可視化

### データフロー

```
┌─────────────────────────────────────────────────────────────┐
│                      VoiceDrive                              │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │  EmergencyAccountDeactivation.tsx          │             │
│  │  （レベル14-17のみアクセス可能）            │             │
│  └────────────────────────────────────────────┘             │
│         │ ①停止実行                                          │
│         ▼                                                     │
│  ┌────────────────────────────────────────────┐             │
│  │  EmergencyAccountService.ts                │             │
│  └────────────────────────────────────────────┘             │
│         │                                                     │
│         ├─ ②Prisma保存（Phase 1）                          │
│         │  ├─ EmergencyDeactivation                        │
│         │  ├─ AuditLog                                     │
│         │  └─ StaffSystemSyncQueue                         │
│         │                                                     │
│         └─ ③Webhook送信（Phase 2）                          │
│            POST /api/webhooks/voicedrive-emergency-deactivation
└─────────────────────────────────────────────────────────────┘
               │ HTTPS + HMAC-SHA256
               ▼
┌─────────────────────────────────────────────────────────────┐
│                  医療職員管理システム                         │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │  Webhook受信（医療チーム実装）              │             │
│  └────────────────────────────────────────────┘             │
│         │                                                     │
│         ├─ ④Employee.accountStatus更新                      │
│         ├─ ⑤EmployeeAccountStatusHistory記録               │
│         └─ ⑥確認Webhook送信                                │
└─────────────────────────────────────────────────────────────┘
               │ HTTPS + HMAC-SHA256
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      VoiceDrive                              │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │  Webhook受信（Phase 2）                    │             │
│  └────────────────────────────────────────────┘             │
│         │                                                     │
│         ├─ ⑦EmergencyDeactivation更新                       │
│         ├─ ⑧SyncQueue完了                                   │
│         └─ ⑨User.isRetired更新                             │
└─────────────────────────────────────────────────────────────┘
```

### スケジュール概要

| Week | VoiceDrive | 医療システム | マイルストーン |
|------|-----------|-------------|--------------|
| **Week 1**<br>10/11-10/14 | Phase 1実装<br>（DB移行） | 依頼内容確認 | DB実装完了 |
| **Week 2**<br>10/15-10/21 | Phase 2実装<br>（Webhook連携） | 🔴 Webhook実装 | Webhook連携完了 |
| **Week 3**<br>10/22-10/25 | Phase 3実装<br>（自動同期） | 統合テスト協力 | 自動同期完了 |
| **Week 4**<br>10/28-11/04 | Phase 4<br>（統合テスト・リリース） | 統合テスト協力 | 本番リリース |

---

## ✅ 総合チェックリスト

### ドキュメント作成（完了）

- [x] 医療システムへの回答書・確認書
- [x] VoiceDrive側マスタープラン
- [x] schema.prisma更新提案書
- [x] 成果物サマリー（本ドキュメント）

### 医療システムチームへの送付

- [ ] ドキュメント1を送付（2025年10月11日）
- [ ] 確認事項への回答受領（2025年10月24日まで）
- [ ] Webhook実装完了確認（2025年10月21日目標）

### VoiceDrive実装

#### Phase 1（DB実装）
- [ ] schema.prisma更新
- [ ] マイグレーション実行
- [ ] EmergencyAccountService.ts修正
- [ ] テスト作成・実行

#### Phase 2（Webhook連携）
- [ ] MedicalSystemWebhookService.ts実装
- [ ] Webhook受信エンドポイント実装
- [ ] 統合テスト

#### Phase 3（自動同期）
- [ ] ヘルスチェック実装
- [ ] SyncQueue処理実装
- [ ] Cronジョブ設定

#### Phase 4（統合テスト・リリース）
- [ ] 障害シミュレーションテスト
- [ ] ドキュメント整備
- [ ] 本番デプロイ

---

## 📝 参照ドキュメント

### 作成済みドキュメント

1. **医療システムへの回答書・確認書**
   - `mcp-shared/docs/Response_EmergencyAccountDeactivation_Requirements_20251010.md`
   - 文書番号: RES-2025-1010-001

2. **VoiceDrive側マスタープラン**
   - `mcp-shared/docs/EmergencyAccountDeactivation_Master_Plan_VoiceDrive_20251010.md`
   - 文書番号: PLAN-2025-1010-001

3. **schema.prisma更新提案書**
   - `mcp-shared/docs/Schema_Update_Proposal_EmergencyAccountDeactivation_20251010.md`
   - 文書番号: SCHEMA-2025-1010-001

### 既存ドキュメント

4. **データ管理責任分界点定義書**
   - `mcp-shared/docs/データ管理責任分界点定義書_20251008.md`

5. **PersonalStation DB要件分析**
   - `mcp-shared/docs/PersonalStation_DB要件分析_20251008.md`

6. **共通DB構築後統合作業再開計画書**
   - `mcp-shared/docs/共通DB構築後統合作業再開計画書_20251008.md`

---

## 🙏 謝辞

本日、アカウント緊急無効化機能の実装計画を完成させることができました。

医療システムチームの皆様には、今後の連携実装でご協力をお願いすることになります。また、VoiceDriveチームの皆様には、本マスタープランに基づいた段階的な実装をお願いいたします。

医療現場の業務継続性に直結する重要な機能です。両チームの協力により、安全で信頼性の高いシステムを実現できると確信しております。

引き続きよろしくお願いいたします。

---

**VoiceDriveチーム（職員カルテシステム）**
**作成日**: 2025年10月10日

---

**文書終了**
