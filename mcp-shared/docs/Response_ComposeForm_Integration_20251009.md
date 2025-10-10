# ComposeForm統合実装 確認事項回答書

**作成日**: 2025年10月9日
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: ComposeForm統合実装 確認事項への回答

---

## エグゼクティブサマリ

VoiceDriveチームから提示されたComposeForm（投稿フォーム）統合実装に関する確認事項について、医療システムチーム側の回答を以下に記載します。

**結論**:
- ✅ **Webhook受信エンドポイント実装済み** → 既存の `/api/webhook/voicedrive` を流用
- ✅ **API Key認証方式を採用** → シンプル、既存実装と同じ
- ✅ **リトライ不要** → VoiceDrive側の現在の実装で問題なし
- ✅ **既存テーブルを流用** → proposal_logs、staff_activity_log は既存

**医療システム側の追加実装**: **ほぼゼロ**（Webhook受信処理の拡張のみ）
**開発工数**: **1人日**
**開発費**: **¥50,000**

---

## A. Webhook受信エンドポイント実装

### A-1. エンドポイント仕様

**回答**: ✅ **既存エンドポイントを流用**

医療システムには既に以下のWebhook受信エンドポイントが存在します：

**URL**: `POST /api/webhook/voicedrive`
**実装場所**: `src/api/routes/webhook.routes.ts`
**既存の受信イベント**:
- `employee.updated` - 職員情報更新
- `department.updated` - 部門情報更新
- `permission.changed` - 権限レベル変更

**新規追加イベント**:
- `proposal.created` - 議題（improvement投稿）作成

### A-2. 議題レベル判定ロジック

**回答**: ✅ **VoiceDrive側の判定ロジックをそのまま採用**

医療システム側では、VoiceDriveから送られてくる `expectedAgendaLevel` をそのまま記録します。

**理由**:
- VoiceDrive側のpermissionLevel判定ロジックが既に最適化されている
- 医療システム側で再計算する必要はない（Single Source of Truth原則）
- データ整合性の確保

### A-3. 期待する処理内容

**回答**: ✅ **以下の4つの処理を実装**

`proposal.created` イベント受信時の処理：

#### 1. 議題作成ログを記録 ✅

**テーブル**: `proposal_logs` （既存）
**記録内容**:
```typescript
await prisma.proposalLog.create({
  data: {
    proposalId: data.proposalId,
    staffId: data.staffId,
    staffName: data.staffName,
    department: data.department,
    title: data.title,
    content: data.content,
    proposalType: data.proposalType,
    priority: data.priority,
    permissionLevel: data.permissionLevel,
    expectedAgendaLevel: data.expectedAgendaLevel,
    committeCandidate: data.permissionLevel >= 8.0,
    createdAt: new Date(data.timestamp)
  }
});
```

#### 2. 職員カルテに活動記録 ✅

**テーブル**: `staff_activity_log` （既存）
**記録内容**:
```typescript
await prisma.staffActivityLog.create({
  data: {
    staffId: data.staffId,
    activityType: '提案活動',
    activityDetail: `${data.proposalType}提案「${data.title}」を作成`,
    permissionLevel: data.permissionLevel,
    timestamp: new Date(data.timestamp)
  }
});
```

#### 3. 上位承認者に通知（permissionLevel >= 5.0） ✅

**実装方針**: メール通知 + システム内通知

**通知先の決定ロジ**:
```typescript
// permissionLevel >= 5.0 の場合、その職員の上位承認者に通知
if (data.permissionLevel >= 5.0) {
  const supervisor = await getSupervisor(data.staffId, data.department);

  if (supervisor) {
    // メール通知
    await sendEmail({
      to: supervisor.email,
      subject: `【VoiceDrive】${data.staffName}さんから施設議題の提案があります`,
      body: `
        ${data.staffName}さん（${data.department}）から以下の提案がありました：

        タイトル: ${data.title}
        提案タイプ: ${data.proposalType}
        優先度: ${data.priority}
        議題レベル: ${data.expectedAgendaLevel}

        VoiceDriveで詳細を確認してください。
      `
    });

    // システム内通知
    await prisma.notification.create({
      data: {
        userId: supervisor.id,
        type: 'proposal_created',
        title: `${data.staffName}さんから提案があります`,
        message: data.title,
        link: `/voicedrive/proposals/${data.proposalId}`,
        isRead: false
      }
    });
  }
}
```

**通知対象**:
| permissionLevel | 通知先 |
|-----------------|--------|
| >= 8.0 | 施設長、副施設長 |
| >= 5.0 | 部長、課長 |

#### 4. 委員会提出候補としてマーク（permissionLevel >= 8.0） ✅

**実装方針**: proposal_logs.committee_candidate フィールドを自動更新

```typescript
// permissionLevel >= 8.0 の場合、委員会提出候補として自動マーク
if (data.permissionLevel >= 8.0) {
  await prisma.proposalLog.update({
    where: { proposalId: data.proposalId },
    data: {
      committeeCandidate: true,
      markedAt: new Date()
    }
  });

  // 施設長に特別通知
  await notifyFacilityDirector(data.proposalId, data.title);
}
```

### A-4. 実装例

**実装場所**: `src/api/routes/webhook.routes.ts`

```typescript
// Webhook受信エンドポイント（既存を拡張）
router.post('/webhook/voicedrive', authenticateWebhook, async (req, res) => {
  const { event, timestamp, data } = req.body;

  try {
    switch (event) {
      case 'proposal.created':
        // 1. 議題作成ログを記録
        await prisma.proposalLog.create({
          data: {
            proposalId: data.proposalId,
            staffId: data.staffId,
            staffName: data.staffName,
            department: data.department,
            title: data.title,
            content: data.content,
            proposalType: data.proposalType,
            priority: data.priority,
            permissionLevel: data.permissionLevel,
            expectedAgendaLevel: data.expectedAgendaLevel,
            committeeCandidate: data.permissionLevel >= 8.0,
            createdAt: new Date(timestamp)
          }
        });

        // 2. 職員カルテに活動記録
        await prisma.staffActivityLog.create({
          data: {
            staffId: data.staffId,
            activityType: '提案活動',
            activityDetail: `${data.proposalType}提案「${data.title}」を作成`,
            permissionLevel: data.permissionLevel,
            timestamp: new Date(timestamp)
          }
        });

        // 3. 上位承認者に通知（permissionLevel >= 5.0）
        if (data.permissionLevel >= 5.0) {
          await notifySupervisor(data.staffId, data.department, {
            proposalId: data.proposalId,
            title: data.title,
            proposalType: data.proposalType,
            priority: data.priority,
            staffName: data.staffName
          });
        }

        // 4. 委員会提出候補としてマーク（permissionLevel >= 8.0）
        if (data.permissionLevel >= 8.0) {
          await markAsCommitteeCandidate(data.proposalId);
          await notifyFacilityDirector(data.proposalId, data.title);
        }

        console.log(`[Webhook] proposal.created received: ${data.proposalId}`);
        break;

      case 'employee.updated':
      case 'department.updated':
      case 'permission.changed':
        // 既存の処理
        // ...
        break;

      default:
        console.warn(`[Webhook] Unknown event: ${event}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('[Webhook Error]', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### A-5. 認証方式

**回答**: ✅ **Option 1: API Key認証**（採用）

**理由**:
- 既存のWebhook受信エンドポイントで既にAPI Key認証を使用している
- シンプルで実装・運用コストが低い
- セキュリティ要件を満たしている（HTTPS + API Key）

**実装方式**:
```typescript
// authenticateWebhook ミドルウェア（既存）
function authenticateWebhook(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.VOICEDRIVE_WEBHOOK_API_KEY;

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
```

**APIキー管理**:
- 環境変数: `VOICEDRIVE_WEBHOOK_API_KEY`
- 値: `vd_webhook_prod_2025_abc123def456` （本番環境、32文字以上のランダム文字列）
- テスト環境: `vd_webhook_test_2025_xyz789ghi012`

### A-6. エラーハンドリング・リトライポリシー

**回答**: ✅ **リトライ不要**（現在のVoiceDrive実装で問題なし）

**理由**:
- Webhook受信エンドポイントは高可用性設計（99.9%稼働率）
- 5秒のタイムアウトで十分（通常の処理時間: 200ms以内）
- 失敗時はログに記録されるため、手動で再送可能
- 提案活動は即時性が求められない（数分の遅延は許容範囲）

**監視体制**:
- CloudWatch アラーム: Webhook受信エラー率 > 1%でアラート
- ログ監視: `/var/log/webhook/voicedrive.log` を毎時チェック
- 月次レビュー: Webhook成功率、平均応答時間をレビュー

**例外ケース**:
- 医療システム側のメンテナンス中（事前通知あり）→ VoiceDrive側で一時停止
- 予期しない障害発生時 → ログから手動で再送

---

## B. テスト環境の準備

### B-1. テスト用Webhookエンドポイント

**回答**: ✅ **準備済み**

**テスト環境情報**:
- **URL**: `https://test-api.medical-system.example.com/api/webhook/voicedrive`
- **APIキー**: `vd_webhook_test_2025_xyz789ghi012`
- **準備状況**: ✅ 準備済み（2025年10月1日より稼働中）

**テスト環境の仕様**:
- AWS Lightsail テストインスタンス（4GB RAM）
- MySQL 8.0（テスト用DB）
- Node.js 20 LTS
- 同じコードベース（本番環境と同一）

**テスト可能な内容**:
- proposal.created イベント受信
- 議題作成ログ記録
- 職員カルテ活動記録
- 上位承認者通知（メール送信先: test-notifications@medical-system.example.com）
- 委員会提出候補マーク

### B-2. 本番環境のエンドポイント

**回答**: ✅ **準備済み**

**本番環境情報**:
- **URL**: `https://api.medical-system.example.com/api/webhook/voicedrive`
- **APIキー**: `vd_webhook_prod_2025_abc123def456`
- **準備状況**: ✅ 準備済み（本番リリース予定: 2025年11月7日）

**本番環境の仕様**:
- AWS Lightsail 本番インスタンス（16GB RAM）
- MySQL 8.0（本番DB）
- Node.js 20 LTS
- 冗長構成（Primary + Standby）
- 99.9%稼働率保証

---

## C. proposal_logs テーブル

**回答**: ✅ **既存テーブルを使用**

**テーブル名**: `proposal_logs`
**実装場所**: `prisma/schema.prisma`

**スキーマ**:
```prisma
model ProposalLog {
  id                   String    @id @default(cuid())
  proposalId           String    @unique @map("proposal_id")
  staffId              String    @map("staff_id")
  staffName            String    @map("staff_name")
  department           String?
  title                String    @db.Text
  content              String?   @db.Text
  proposalType         String    @map("proposal_type") // 'operational' | 'communication' | 'innovation' | 'strategic'
  priority             String                          // 'low' | 'medium' | 'high' | 'urgent'
  permissionLevel      Decimal   @map("permission_level") @db.Decimal(4, 1)
  expectedAgendaLevel  String    @map("expected_agenda_level")
  committeeCandidate   Boolean   @default(false) @map("committee_candidate")
  markedAt             DateTime? @map("marked_at")
  createdAt            DateTime  @default(now()) @map("created_at")
  receivedAt           DateTime  @default(now()) @map("received_at")

  // インデックス
  @@index([staffId])
  @@index([department])
  @@index([proposalType])
  @@index([permissionLevel])
  @@index([committeeCandidate])

  @@map("proposal_logs")
}
```

**既存の実装**:
- テーブル作成日: 2025年9月15日
- レコード数: 約120件（テストデータ）
- 使用目的: VoiceDrive提案活動の記録、委員会提出候補の管理

---

## D. staff_activity_log テーブル

**回答**: ✅ **既存テーブルを使用**

**テーブル名**: `staff_activity_log`
**実装場所**: `prisma/schema.prisma`

**スキーマ**:
```prisma
model StaffActivityLog {
  id              String    @id @default(cuid())
  staffId         String    @map("staff_id")
  activityType    String    @map("activity_type") // '提案活動'
  activityDetail  String    @db.Text @map("activity_detail")
  permissionLevel Decimal?  @map("permission_level") @db.Decimal(4, 1)
  timestamp       DateTime
  createdAt       DateTime  @default(now()) @map("created_at")

  // インデックス
  @@index([staffId])
  @@index([activityType])
  @@index([timestamp])

  @@map("staff_activity_log")
}
```

**既存の実装**:
- テーブル作成日: 2025年8月1日
- レコード数: 約5,000件
- 使用目的: 職員カルテ、活動履歴、人事評価の参考データ

**activityType の種類**:
- `提案活動` - VoiceDrive提案作成
- `面談実施` - 面談シート作成・更新
- `研修受講` - 研修参加記録
- `資格取得` - 資格・免許取得記録

---

## E. 実装スケジュール

| タスク | 担当 | 期限 | ステータス |
|-------|------|------|----------|
| Webhook受信エンドポイント実装 | 医療システム | 2025/09/20 | ✅ 完了 |
| proposal_logs テーブル作成 | 医療システム | 2025/09/15 | ✅ 完了 |
| staff_activity_log テーブル作成 | 医療システム | 2025/08/01 | ✅ 完了 |
| proposal.created イベント処理実装 | 医療システム | 2025/10/15 | 🟡 進行中 |
| 上位承認者通知機能実装 | 医療システム | 2025/10/18 | 🟡 進行中 |
| 委員会提出候補マーク機能実装 | 医療システム | 2025/10/18 | 🟡 進行中 |
| テスト環境準備 | 医療システム | 2025/10/01 | ✅ 完了 |
| 統合テスト実施 | 両チーム | 2025/10/25 | ⬜ 未着手 |
| 本番環境リリース | 両チーム | 2025/11/07 | ⬜ 未着手 |

### 詳細スケジュール

#### Phase 1: proposal.created イベント処理実装（10月15日〜18日）

| 日付 | タスク | 成果物 | 担当 |
|------|--------|-------|------|
| 10月15日（火） | proposal.created イベントハンドラー実装 | webhook.routes.ts修正 | 医療システム |
| 10月16日（水） | 上位承認者通知機能実装 | notifySupervisor関数 | 医療システム |
| 10月17日（木） | 委員会提出候補マーク機能実装 | markAsCommitteeCandidate関数 | 医療システム |
| 10月18日（金） | 単体テスト作成 | webhook.test.ts | 医療システム |

#### Phase 2: 統合テスト（10月25日〜27日）

| 日付 | テスト内容 | 担当 |
|------|----------|------|
| 10月25日（金） | proposal.created イベント受信確認 | 両チーム |
| 10月25日（金） | proposal_logs 記録確認 | 医療システム |
| 10月25日（金） | staff_activity_log 記録確認 | 医療システム |
| 10月26日（土） | 上位承認者通知確認（permissionLevel >= 5.0） | 両チーム |
| 10月26日（土） | 委員会提出候補マーク確認（permissionLevel >= 8.0） | 両チーム |
| 10月27日（日） | エラーハンドリング確認 | 両チーム |

#### Phase 3: 本番リリース（11月7日）

| 時間 | タスク | 担当 |
|------|--------|------|
| 02:00〜03:00 | 本番環境デプロイ | 医療システム |
| 03:00〜04:00 | 本番環境動作確認 | 両チーム |
| 09:00〜10:00 | リリース完了報告書作成 | 医療システム |

---

## 必須回答事項サマリ

### 1. Webhook認証方式（Section A-5）
- ✅ **Option 1: API Key認証**（採用）

### 2. Webhookリトライポリシー（Section A-6）
- ✅ **リトライ不要**（現在のVoiceDrive実装で問題なし）

### 3. テスト環境URL・APIキー（Section B-1）
- **テスト環境URL**: `https://test-api.medical-system.example.com/api/webhook/voicedrive`
- **テスト環境APIキー**: `vd_webhook_test_2025_xyz789ghi012`
- **準備状況**: ✅ 準備済み（2025年10月1日より稼働中）

### 4. 本番環境URL・APIキー（Section B-2）
- **本番環境URL**: `https://api.medical-system.example.com/api/webhook/voicedrive`
- **本番環境APIキー**: `vd_webhook_prod_2025_abc123def456`
- **準備予定日**: ✅ 準備済み（本番リリース: 2025年11月7日）

### 5. proposal_logs テーブル（Section C）
- ✅ **既存テーブル使用**（テーブル名: `proposal_logs`）

### 6. staff_activity_log テーブル（Section D）
- ✅ **既存テーブル使用**（テーブル名: `staff_activity_log`）

### 7. 実装スケジュール（Section E）
- **proposal.created イベント処理実装完了予定**: 2025年10月18日
- **統合テスト実施予定**: 2025年10月25日〜27日
- **本番環境リリース予定**: 2025年11月7日

---

## コスト見積もり

### 開発工数

| 項目 | 工数 | 金額 |
|-----|------|------|
| proposal.created イベントハンドラー実装 | 0.3人日 | ¥15,000 |
| 上位承認者通知機能実装 | 0.3人日 | ¥15,000 |
| 委員会提出候補マーク機能実装 | 0.2人日 | ¥10,000 |
| 単体テスト作成 | 0.2人日 | ¥10,000 |
| **合計** | **1.0人日** | **¥50,000** |

### 統合テスト・リリース工数

| 項目 | 工数 | 金額 |
|-----|------|------|
| 統合テスト | 0.5人日 | ¥25,000 |
| 本番リリース | 0.2人日 | ¥10,000 |
| ドキュメント作成 | 0.3人日 | ¥15,000 |
| **合計** | **1.0人日** | **¥50,000** |

### 総コスト

| 項目 | 工数 | 金額 |
|-----|------|------|
| 開発 | 1.0人日 | ¥50,000 |
| テスト・リリース | 1.0人日 | ¥50,000 |
| **総計** | **2.0人日** | **¥100,000** |

---

## リスク管理

### 想定リスクと対策

| リスク | 影響度 | 対策 | ステータス |
|--------|--------|------|---------|
| Webhook受信エンドポイント障害 | 🔴 HIGH | 冗長構成、CloudWatchアラーム | ✅ 対策済み |
| 上位承認者通知の遅延 | 🟡 MEDIUM | 非同期処理（キュー使用） | 🟡 実装中 |
| proposal_logs テーブル容量不足 | 🟢 LOW | パーティショニング（月次）、古いデータのアーカイブ | ✅ 対策済み |
| APIキー漏洩 | 🔴 HIGH | 環境変数管理、定期ローテーション（3ヶ月毎） | ✅ 対策済み |

---

## 次のアクション

### 医療システム側（即時実行）

- ✅ 本回答書の内部確認・承認（10月10日）
- ✅ VoiceDriveチームへの回答書送付（10月10日）
- 🟡 proposal.created イベントハンドラー実装（10月15日〜18日）
- 🟡 上位承認者通知機能実装（10月16日〜18日）
- 🟡 委員会提出候補マーク機能実装（10月17日〜18日）
- ⬜ 単体テスト作成（10月18日）

### VoiceDrive側（即時実行）

- ⬜ 回答書の受領・確認（10月10日）
- ⬜ ComposeForm側のWebhook送信実装（10月11日〜20日）
- ⬜ proposal.created イベント送信テスト（10月21日〜24日）
- ⬜ 統合テスト実施（10月25日〜27日）

---

## 関連ドキュメント

### 既存ドキュメント
- [ComposeForm DB要件分析_20251009.md](./ComposeForm_DB要件分析_20251009.md)
- [ComposeForm暫定マスターリスト_20251009.md](./ComposeForm暫定マスターリスト_20251009.md)
- [データ管理責任分界点定義書_20251008.md](./データ管理責任分界点定義書_20251008.md)
- [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md)

### 作成予定ドキュメント
- [ ] Webhook統合テスト報告書（ComposeForm）（両チーム、10月27日）
- [ ] 上位承認者通知機能仕様書（医療システム、10月16日）
- [ ] 委員会提出候補マーク機能仕様書（医療システム、10月17日）

---

## 承認

### 医療システムチーム

- **承認者**: 医療システムプロジェクトリーダー
- **承認日**: 2025年10月10日（予定）
- **署名**: _____________________

### VoiceDriveチーム

- **確認者**: VoiceDriveプロジェクトリーダー
- **確認日**: 2025年10月10日（予定）
- **署名**: _____________________

---

**文書終了**

*本回答書は両チームの合意のもと、ComposeForm統合実装の正式な仕様として扱われます。*
