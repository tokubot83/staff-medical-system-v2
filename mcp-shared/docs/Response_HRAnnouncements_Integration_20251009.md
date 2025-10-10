# HRAnnouncements統合要件に対する医療システムチームからの回答

**文書番号**: MS-RESPONSE-HRANNOUNCEMENTS-2025-1009-001
**作成日**: 2025年10月9日
**差出人**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: HRAnnouncements暫定マスターリスト・DB要件分析に対する回答

---

## 📋 受領文書の確認

以下のVoiceDriveチームからの文書を受領し、確認いたしました：

| 文書番号 | 文書名 | 受領日 | 確認状況 |
|---------|--------|--------|---------|
| VD-MASTER-HRANNOUNCEMENTS-2025-1009-001 | HRAnnouncements暫定マスターリスト | 2025-10-09 | ✅ 確認完了 |
| VD-DB-HRANNOUNCEMENTS-2025-1009-001 | HRAnnouncements DB要件分析 | 2025-10-09 | ✅ 確認完了 |

---

## ✅ 確認事項に対する回答

### 確認-1: お知らせ作成権限について

**質問**:
> 人事お知らせを作成できるのは以下のどちらでしょうか？
> - **A**: Level 4（課長）以上のみ
> - **B**: Level 5（部長）以上のみ
> - **C**: 人事部門の特定役職のみ
> - **D**: その他（医療システム側で定義する権限）

**医療システムチームの回答**:
**✅ D: その他（医療システム側で定義する権限）**

**詳細**:
- **人事お知らせ作成権限**は、`permissionLevel`ではなく**専用の機能権限**で管理します
- 権限名: `HR_ANNOUNCEMENT_CREATE`（仮称）
- この権限を持つユーザーのみが人事お知らせを作成可能
- 通常、以下の役職に付与される想定です：
  - 人事部長（Level 6）
  - 人事課長（Level 5）
  - 人事担当主任（Level 4）
  - 総務部門の特定管理職

**実装への影響**:
- API-7（お知らせ配信API）のリクエスト送信前に、医療システム側で`HR_ANNOUNCEMENT_CREATE`権限をチェック
- 権限がない場合は配信を拒否し、エラーを返す

---

### 確認-2: 配信対象の粒度について

**質問**:
> 配信対象として以下の粒度が必要でしょうか？
> - **全体配信**: 全従業員
> - **部署配信**: 特定の部署
> - **施設配信**: 特定の施設
> - **個人配信**: 特定の個人
> - **役職配信**: 特定の役職レベル

**医療システムチームの回答**:
**✅ 全て必要です（5つの配信パターン全てサポート）**

**詳細**:
| 配信タイプ | 必要性 | 使用例 | API要件 |
|-----------|--------|--------|---------|
| **全体配信** | ✅ 必須 | 全社方針変更、就業規則改定 | `targetType: "global"` |
| **部署配信** | ✅ 必須 | 看護部のみ、医事課のみの通知 | `targetType: "departments"`, API-8使用 |
| **施設配信** | ✅ 必須 | 小原病院のみ、立神病院のみの通知 | `targetType: "facilities"`, API-9使用 |
| **個人配信** | ✅ 必須 | 個別の異動通知、評価面談通知 | `targetType: "individuals"` |
| **役職配信** | ✅ 必須 | 管理職のみへの研修案内 | `targetType: "positions"`, API-10使用 |

**実装への影響**:
- API-7のリクエストボディで`targetType`と`targetIds[]`を指定
- VoiceDrive側で配信先を解決し、AnnouncementDeliveryテーブルに記録

---

### 確認-3: DepartmentStation API-3の流用可能性（API-8）

**質問**:
> API-8（部署メンバー取得）は、DepartmentStation API-3を流用できますか？

**医療システムチームの回答**:
**✅ 流用可能です（部分的に調整が必要）**

**詳細**:
```typescript
// DepartmentStation API-3（既存）
GET /api/departments/:departmentId/members
Response: {
  department: { id, name, facilityId },
  members: Array<{
    id, name, position, permissionLevel, performance
  }>
}

// HRAnnouncements API-8（必要な形式）
GET /api/departments/:departmentId/members
Response: {
  departmentId: string,
  memberIds: string[]  // シンプルなID配列
}
```

**推奨方針**:
- **Option A: API-3を直接流用** - VoiceDrive側で`members[].id`を抽出
- **Option B: 新規エンドポイント作成** - `/api/departments/:departmentId/member-ids`（軽量版）

**医療システムチームの推奨**: **Option A（API-3を直接流用）**
- 追加開発コスト: ¥0
- VoiceDrive側の実装: 1時間程度（IDの抽出処理追加）
- メリット: 既存のテスト済みAPIを利用、保守性が高い

---

### 確認-4: 施設メンバー取得API（API-9）の実装方針

**質問**:
> API-9（施設メンバー取得）は新規実装が必要ですか？

**医療システムチームの回答**:
**✅ 新規実装が必要です**

**詳細**:
```typescript
// API-9（新規）
GET /api/facilities/:facilityId/members
Response: {
  facilityId: string,
  facilityName: string,
  memberIds: string[]
}
```

**実装コスト**:
- 開発工数: 0.5人日（¥20,000）
- 既存の`User`モデルに`facilityId`フィールドが存在するため、単純なクエリで実装可能

**実装内容**:
```typescript
async getFacilityMembers(facilityId: string): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { facilityId },
    select: { id: true }
  });
  return users.map(u => u.id);
}
```

---

### 確認-5: 役職メンバー取得API（API-10）の実装方針

**質問**:
> API-10（役職メンバー取得）は新規実装が必要ですか？

**医療システムチームの回答**:
**✅ 新規実装が必要です**

**詳細**:
```typescript
// API-10（新規）
GET /api/positions/:positionId/members
// または
GET /api/permission-levels/:level/members

Response: {
  positionId: string,
  positionName: string,
  permissionLevel: number,
  memberIds: string[]
}
```

**実装方針の選択肢**:
- **Option A**: `positionId`ベース（役職名で検索、例: "看護師長"）
- **Option B**: `permissionLevel`ベース（レベルで検索、例: Level 5以上）

**医療システムチームの推奨**: **Option B（permissionLevelベース）**
- 理由: 役職名は施設間で微妙に異なる可能性があるが、permissionLevelは統一されている
- 実装コスト: 0.5人日（¥20,000）

**実装内容**:
```typescript
async getMembersByPermissionLevel(level: number): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { permissionLevel: { gte: level } },
    select: { id: true }
  });
  return users.map(u => u.id);
}
```

---

### 確認-6: HR統括指標API（API-11～API-16）の実装可能性

**質問**:
> HRManagementDashboard用の6つの統計APIは実装可能ですか？

**医療システムチームの回答**:
**⚠️ 一部実装可能、一部は将来実装**

**詳細**:

| API | 指標名 | 実装可能性 | 理由 |
|-----|--------|----------|------|
| **API-11** | 従業員数推移 | ✅ 即座に実装可能 | `User`テーブルから集計可能 |
| **API-12** | 離職率 | ✅ 即座に実装可能 | `User.employmentStatus`で判定可能 |
| **API-13** | 満足度スコア | ⚠️ 将来実装 | 現在、満足度データは収集していない<br/>**Phase 11で実装予定**（アンケート機能） |
| **API-14** | 研修受講率 | ⚠️ 将来実装 | 研修管理システムは未実装<br/>**Phase 12で実装予定** |
| **API-15** | タレントパイプライン | ⚠️ 将来実装 | 後継者計画機能は未実装<br/>**Phase 13で実装予定** |
| **API-16** | 採用状況 | ✅ 即座に実装可能 | 採用候補者データから集計可能 |

**フェーズ分け提案**:

**Phase 10（2026年1月～3月）**: 基本的なHRAnnouncements機能
- ✅ API-7: お知らせ配信API
- ✅ API-8: 部署メンバー取得（API-3流用）
- ✅ API-9: 施設メンバー取得
- ✅ API-10: 役職メンバー取得
- ✅ API-11: 従業員数推移
- ✅ API-12: 離職率
- ✅ API-16: 採用状況
- ✅ AnnouncementCache、AnnouncementDelivery、AnnouncementRead、AnnouncementAction、AnnouncementStatsテーブル（VoiceDrive側）
- ✅ 統計Webhook実装（VoiceDrive → 医療システム、02:00 JST）

**Phase 11（2026年4月～6月）**: 満足度調査機能
- ⚠️ API-13: 満足度スコア
- アンケート機能実装
- 満足度データ収集開始

**Phase 12（2026年7月～9月）**: 研修管理機能
- ⚠️ API-14: 研修受講率
- 研修管理システム実装

**Phase 13（2026年10月～12月）**: タレントマネジメント機能
- ⚠️ API-15: タレントパイプライン
- 後継者計画機能実装

**Phase 10の開発コスト見積もり**:
- 医療システム側: 15人日（¥600,000）
  - API-7実装: 3人日
  - API-9、API-10実装: 1人日
  - API-11、API-12、API-16実装: 6人日
  - 統計Webhook受信処理: 3人日
  - テスト: 2人日
- VoiceDrive側: 34人日（¥1,360,000）（元の見積もりから変更なし）
- **合計**: 49人日（¥1,960,000）

---

### 確認-7: 統計データの用途について

**質問**:
> VoiceDriveから医療システムへ送信される統計データは、どのように活用されますか？

**医療システムチームの回答**:
**✅ HR管理ダッシュボードでの可視化とアラート生成**

**詳細**:
```typescript
// 統計Webhook（VoiceDrive → 医療システム、02:00 JST）
POST /api/webhooks/announcement-stats
Request: {
  date: "2025-10-09",
  announcements: [
    {
      announcementId: "ann_123",
      deliveredCount: 150,
      readCount: 120,
      readRate: 0.80,
      actionCount: 30,
      actionRate: 0.25
    }
  ],
  summary: {
    totalDelivered: 500,
    totalRead: 400,
    averageReadRate: 0.80,
    totalActions: 100
  }
}
```

**活用方法**:
1. **HRManagementDashboard**: 各お知らせの既読率・アクション率を可視化
2. **アラート生成**: 既読率が50%未満の重要なお知らせについて、人事部門に再配信を提案
3. **効果測定**: お知らせの配信パターン（全体 vs 部署別）の効果を分析
4. **監査ログ**: コンプライアンス関連のお知らせ（就業規則変更等）の既読状況を記録

**データ保存先**:
- 医療システム側で新規テーブル`AnnouncementStatistics`を作成（Phase 10で実装）
- VoiceDrive側の`AnnouncementStats`テーブルはキャッシュ、医療システム側が正式な記録

---

### 確認-8: アクション通知の緊急度について

**質問**:
> アクション実行時の通知（VoiceDrive → 医療システム）はリアルタイムで必要ですか？

**医療システムチームの回答**:
**✅ リアルタイム通知が必要です（一部のアクションタイプのみ）**

**詳細**:
| アクションタイプ | 緊急度 | 通知方式 | 理由 |
|---------------|--------|---------|------|
| **confirm**: 確認済み | ⏱️ 低（日次バッチで十分） | 02:00 JST統計Webhookに含める | 緊急性なし |
| **apply**: 応募 | 🚨 高（リアルタイム必須） | 即座にWebhook送信 | 人事部門が迅速に対応する必要がある |
| **contact**: 問い合わせ | 🚨 高（リアルタイム必須） | 即座にWebhook送信 | 従業員からの質問に迅速に回答する必要がある |
| **download**: ダウンロード | ⏱️ 低（日次バッチで十分） | 02:00 JST統計Webhookに含める | 緊急性なし |

**実装方針**:
```typescript
// リアルタイム通知（apply、contactのみ）
POST /api/webhooks/announcement-action
Request: {
  announcementId: "ann_123",
  userId: "user_456",
  actionType: "apply",
  timestamp: "2025-10-09T10:30:00Z",
  metadata: {
    applicationDetails: "..."
  }
}

// 日次バッチ通知（confirm、downloadを含む全体統計）
POST /api/webhooks/announcement-stats
Request: {
  // 確認-7の形式
}
```

**実装コスト**:
- リアルタイムWebhook実装: 2人日（¥80,000）（Phase 10の見積もりに含まれています）

---

### 確認-9: データ保持期間について

**質問**:
> VoiceDrive側の各テーブルのデータ保持期間はどのように設定すべきですか？

**医療システムチームの回答**:
**✅ 以下の保持期間を推奨します**

| テーブル | 保持期間 | 理由 | 削除方針 |
|---------|---------|------|---------|
| **AnnouncementCache** | 1年 | お知らせの有効期限は最長1年 | 作成日から1年経過後、自動削除 |
| **AnnouncementDelivery** | 3年 | 労働基準法に基づく記録保持義務 | 配信日から3年経過後、削除 |
| **AnnouncementRead** | 3年 | コンプライアンス監査のため | 既読日から3年経過後、削除 |
| **AnnouncementAction** | 3年 | 応募・問い合わせの記録保持 | アクション日から3年経過後、削除 |
| **AnnouncementStats** | 無制限 | 統計データは長期分析に使用 | 削除しない（サマリーのみ） |

**削除処理の実装**:
- VoiceDrive側で日次バッチ処理（03:00 JST）を実装
- Prisma ORMの`deleteMany`を使用して期限切れレコードを削除
- 削除前に医療システム側へ統計を送信済みであることを確認

---

### 確認-10: 認証方式の確認

**質問**:
> API-7～API-16の認証方式は、既存のJWT Bearer Token認証でよろしいですか？

**医療システムチームの回答**:
**✅ 以下の認証方式を使用します**

| 通信方向 | 認証方式 | 詳細 |
|---------|---------|------|
| **VoiceDrive → 医療システム**<br/>（API-8, API-9, API-10, API-11, API-12, API-16） | JWT Bearer Token | 既存のPersonalStation APIと同じ方式 |
| **医療システム → VoiceDrive**<br/>（API-7: お知らせ配信） | API Key（推奨）または<br/>HMAC-SHA256 | ComposeForm Webhookと同じ方式 |
| **VoiceDrive → 医療システム**<br/>（統計Webhook、アクションWebhook） | HMAC-SHA256（推奨）または<br/>API Key | 既存のWebhookと同じ方式 |

**推奨方針**:
- **VoiceDrive → 医療システム（API呼び出し）**: JWT Bearer Token（既存のトークン発行システムを流用）
- **医療システム → VoiceDrive（Webhook）**: HMAC-SHA256署名（ComposeForm Webhookと同じ実装を流用）

**セキュリティ要件**:
- 全ての通信でHTTPS/TLS 1.3を使用
- JWT有効期限: 1時間
- API Key/HMAC-SHA256シークレットの定期ローテーション（3ヶ月ごと）

---

## 📊 実装スコープの整理

### Phase 10（2026年1月～3月）: HRAnnouncements基本機能

**医療システム側実装**:
| 項目 | 工数 | コスト |
|------|------|--------|
| API-7実装（お知らせ配信Webhook送信） | 3人日 | ¥120,000 |
| API-9実装（施設メンバー取得） | 0.5人日 | ¥20,000 |
| API-10実装（役職メンバー取得） | 0.5人日 | ¥20,000 |
| API-11実装（従業員数推移） | 2人日 | ¥80,000 |
| API-12実装（離職率） | 2人日 | ¥80,000 |
| API-16実装（採用状況） | 2人日 | ¥80,000 |
| 統計Webhook受信処理 | 3人日 | ¥120,000 |
| アクションWebhook受信処理 | 1人日 | ¥40,000 |
| AnnouncementStatisticsテーブル実装 | 0.5人日 | ¥20,000 |
| テスト・統合テスト | 2人日 | ¥80,000 |
| **小計** | **15人日** | **¥600,000** |

**VoiceDrive側実装**:
| 項目 | 工数 | コスト |
|------|------|--------|
| AnnouncementCache等5テーブル実装 | 10人日 | ¥400,000 |
| API-7受信処理（お知らせ配信） | 5人日 | ¥200,000 |
| HRAnnouncements画面実装 | 8人日 | ¥320,000 |
| HRManagementDashboard画面実装 | 6人日 | ¥240,000 |
| 統計Webhook送信（日次バッチ） | 3人日 | ¥120,000 |
| アクションWebhook送信（リアルタイム） | 2人日 | ¥80,000 |
| テスト・統合テスト | 3人日 | ¥120,000 |
| **小計** | **37人日** | **¥1,480,000** |

**Phase 10合計**: 52人日、**¥2,080,000**

（元の見積もり49人日、¥1,960,000から若干増加 - API-10の実装方針変更とリアルタイムWebhook追加のため）

---

### Phase 11～13（2026年4月～12月）: 高度なHR統計機能

**Phase 11（2026年4月～6月）**: 満足度調査
- API-13実装: 8人日（¥320,000）
- アンケート機能実装: 15人日（¥600,000）
- **小計**: 23人日、¥920,000

**Phase 12（2026年7月～9月）**: 研修管理
- API-14実装: 8人日（¥320,000）
- 研修管理システム実装: 20人日（¥800,000）
- **小計**: 28人日、¥1,120,000

**Phase 13（2026年10月～12月）**: タレントマネジメント
- API-15実装: 8人日（¥320,000）
- 後継者計画機能実装: 25人日（¥1,000,000）
- **小計**: 33人日、¥1,320,000

**HRAnnouncements全体合計**: 136人日、**¥5,440,000**

---

## ✅ 承認依頼事項

以下の方針について、VoiceDriveチームのご承認をお願いいたします：

### 1. API-8の実装方針
- ✅ **承認依頼**: DepartmentStation API-3を直接流用（追加開発コスト¥0）
- VoiceDrive側でレスポンスから`members[].id`を抽出

### 2. API-10の実装方針
- ✅ **承認依頼**: `permissionLevel`ベースで実装（`positionId`ベースではなく）
- 実装コスト: 0.5人日（¥20,000）

### 3. Phase 10の実装スコープ
- ✅ **承認依頼**: API-11、API-12、API-16のみ実装（API-13、API-14、API-15は将来実装）
- Phase 10コスト: ¥2,080,000（元の見積もり¥1,960,000から+¥120,000）

### 4. アクション通知の実装方針
- ✅ **承認依頼**: `apply`と`contact`のみリアルタイムWebhook、`confirm`と`download`は日次バッチ
- 追加コスト: Phase 10の見積もりに含まれています

### 5. データ保持期間
- ✅ **承認依頼**: AnnouncementCache（1年）、その他（3年）、Stats（無制限）
- 日次削除バッチ処理をVoiceDrive側で実装

---

## 📅 実装スケジュール（Phase 10）

| 週 | 医療システム側作業 | VoiceDrive側作業 |
|----|---------------|----------------|
| **Week 1-2** | API-9、API-10実装 | 5テーブルPrismaスキーマ実装、マイグレーション |
| **Week 3-4** | API-11、API-12、API-16実装 | API-7受信処理実装 |
| **Week 5-6** | API-7送信処理実装 | HRAnnouncements画面実装 |
| **Week 7-8** | 統計Webhook受信処理実装 | HRManagementDashboard画面実装 |
| **Week 9** | アクションWebhook受信処理実装 | 統計Webhook送信処理実装 |
| **Week 10** | AnnouncementStatisticsテーブル実装 | アクションWebhook送信処理実装 |
| **Week 11** | 単体テスト | 単体テスト |
| **Week 12** | **統合テスト（両チーム合同）** | **統合テスト（両チーム合同）** |

**Phase 10開始予定**: 2026年1月6日
**Phase 10完了予定**: 2026年3月27日
**実装期間**: 12週間（3ヶ月）

---

## 🔍 追加確認事項（オプション）

以下の点について、VoiceDriveチームのご意見をお聞かせください：

### 1. お知らせの優先度設定
- お知らせに優先度（高・中・低）を設定する機能は必要ですか？
- 高優先度のお知らせはVoiceDrive画面でハイライト表示する等

### 2. お知らせの有効期限設定
- お知らせに有効期限（例: 2週間後に自動非表示）を設定する機能は必要ですか？

### 3. お知らせのカテゴリ分類
- お知らせをカテゴリ分類（例: 採用、研修、福利厚生、就業規則）する機能は必要ですか？

### 4. 添付ファイル対応
- お知らせにPDF等の添付ファイルを追加する機能は必要ですか？
- 必要な場合、ファイル保存先（S3等）の調整が必要

---

## 📝 まとめ

### 承認待ち事項
1. ✅ API-8の実装方針（API-3流用）
2. ✅ API-10の実装方針（permissionLevelベース）
3. ✅ Phase 10の実装スコープ（API-11、12、16のみ）
4. ✅ アクション通知の実装方針（一部リアルタイム）
5. ✅ データ保持期間

### 次のステップ
1. **VoiceDriveチームからの承認**: 本文書の内容をご確認いただき、承認のご連絡をお願いいたします
2. **マスタープラン更新**: 承認後、ライトセイル統合マスタープランにPhase 10を追加
3. **Phase 10実装開始**: 2026年1月6日

---

**作成者**: 医療システムチーム
**最終更新**: 2025年10月9日
**次回アクション**: VoiceDriveチームからの承認待ち
