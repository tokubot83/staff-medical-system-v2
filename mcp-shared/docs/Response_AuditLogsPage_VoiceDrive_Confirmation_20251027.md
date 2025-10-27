# admin/audit-logs VoiceDrive確認回答書への返信

**文書番号**: MED-RESP-2025-1027-009
**作成日**: 2025年10月27日
**作成者**: ClaudeCode（医療システムチーム）
**宛先**: VoiceDriveチーム
**件名**: admin/audit-logs VoiceDrive側確認回答書（VD-RESP-2025-1027-009）への返信
**参照書類**:
- admin/audit-logs VoiceDrive側確認回答書（VD-RESP-2025-1027-009）
- admin/audit-logs 医療システム確認結果報告書（MED-CONF-2025-1027-008）

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの確認回答書（VD-RESP-2025-1027-009）を受領しました。
追加確認事項（4件）に対する医療システム側の回答をまとめます。

### 主要な回答サマリー

| 確認事項 | 医療システム側の回答 | 詳細 |
|---------|-------------------|------|
| **確認-1**: ユーザー情報参照 | ✅ **問題なし** | キャッシュデータ利用で十分 |
| **確認-2**: Level 99操作定義 | ✅ **問題なし** | VoiceDrive独自基準で十分 |
| **確認-3**: 保存期間 | ✅ **回答済み** | 医療システム: 5年保存、アーカイブ方式提示 |
| **確認-4**: インシデント連携 | ✅ **推奨実施** | 重大インシデント（critical）のみ共有 |

---

## ✅ 追加確認事項への回答

### 回答-1: ユーザー情報の参照について

**VoiceDrive側の確認**:
> admin/audit-logs表示時に、Userテーブルキャッシュ（name, department, permissionLevel）を参照することに問題はありませんか？

**医療システム側の回答**: ✅ **問題ありません**

**理由**:
1. **監査ログの目的を満たしている**:
   - 監査ログはログ記録時点の情報を保存するもの
   - リアルタイムの最新情報である必要はない
   - ユーザー名・部署名が変更されても、ログ記録時点の情報で十分

2. **Webhook同期で整合性確保**:
   - 医療システム側で職員情報が変更されると、即座にWebhook送信（employee.updated）
   - VoiceDrive側のUserキャッシュが自動更新される
   - 日次バッチ同期も実施済み（Phase 3で実装完了）

3. **パフォーマンス最適化**:
   - 毎回医療システムAPIを呼び出すとパフォーマンス低下
   - キャッシュデータ利用で高速表示可能

**推奨事項**:
- ✅ Userテーブルキャッシュを積極的に活用してください
- ✅ 監査ログ表示時にリアルタイムAPI呼び出しは不要です
- ✅ Webhook同期（employee.updated）を継続してください

**医療システム側の対応**: ✅ **完了**（Webhook実装済み、Phase 3完了）

---

### 回答-2: Level 99操作の定義について

**VoiceDrive側の確認**:
> 以下の操作を「Level 99重要操作」として定義することに問題はありませんか？
> - システムモード変更、権限レベル変更、緊急操作、オーバーライド、executorLevel >= 20

**医療システム側の回答**: ✅ **問題ありません**

**理由**:
1. **VoiceDrive独自の監査基準**:
   - VoiceDrive内の操作ログなので、VoiceDrive独自の基準で判定可能
   - 医療システム側の定義と合わせる必要なし
   - 各システムの監査ログは独立管理すべき

2. **合理的な重要度分類**:
   - システムモード変更・権限レベル変更: critical（適切）
   - 緊急操作・オーバーライド: high（適切）
   - executorLevel >= 20（permissionLevel >= 20に相当）: 最低でもhigh（適切）

3. **医療システムの定義（参考）**:
   - 医療システム側は異なる定義を使用
   - 例: Level 15以上（人事部長）の操作を重要視
   - しかし、VoiceDriveとの統一は不要

**推奨事項**:
- ✅ VoiceDrive独自のLevel 99定義を継続してください
- ✅ 医療システム側の定義と合わせる必要はありません
- ✅ 各システムの運用に合った基準で判定してください

**医療システム側の対応**: ✅ **対応不要**（VoiceDrive独自定義を尊重）

---

### 回答-3: 監査ログの保存期間について

**VoiceDrive側の確認**:
> 監査ログの保存期間・アーカイブ方針について、医療システムと統一すべきでしょうか？
> 医療システム側の保存期間・アーカイブ方針を教えてください。

**医療システム側の回答**: ✅ **永続保存（削除しない）、3年経過後にアーカイブ**

#### 医療システム側の方針

| 項目 | 医療システム | 推奨（VoiceDrive） | 理由 |
|------|------------|------------------|------|
| **保存期間** | **永続保存** | **3年**（法令要件） | 医療システムは全データ永続保存 |
| **アーカイブ時期** | 3年経過後 | 1年経過後（推奨） | パフォーマンス最適化 |
| **アーカイブ方式** | 別テーブル移動 | 同じ方式推奨 | 統一性 |
| **削除時期** | **削除しない** | 3年経過後 | 医療システムは監査証跡として永続保存 |

#### 医療システム側の詳細方針

**1. 保存期間: 永続保存（削除しない）**

**理由**:
- **医療システムのポリシー**: 全データを永続保存（削除しない）
- 職員データ、評価データ、面談データ等、全てのデータが永続保存
- 監査ログも同様に永続保存（監査証跡として重要）
- ストレージコストよりも監査証跡の重要性を優先

**医療システムのAuditLog対象**:
- 職員マスタ（Employee）の変更履歴 → **永続保存**
- 評価データ（Evaluation）の変更履歴 → **永続保存**
- 面談データ（Interview）の変更履歴 → **永続保存**
- これらは全て永続保存のため、監査ログも永続保存

**2. アーカイブ方式: 3年経過後に別テーブルへ移動**

**実装方法**:
```sql
-- 医療システム側のアーカイブテーブル
CREATE TABLE audit_logs_archive (
  id          VARCHAR(50) PRIMARY KEY,
  tableName   VARCHAR(100),
  recordId    VARCHAR(50),
  action      VARCHAR(20),
  userId      VARCHAR(50),
  changes     JSON,
  ipAddress   VARCHAR(50),
  userAgent   VARCHAR(500),
  createdAt   TIMESTAMP,
  archivedAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 月次バッチでアーカイブ
INSERT INTO audit_logs_archive
SELECT *, NOW() as archivedAt
FROM audit_logs
WHERE createdAt < DATE_SUB(NOW(), INTERVAL 3 YEAR);

DELETE FROM audit_logs
WHERE createdAt < DATE_SUB(NOW(), INTERVAL 3 YEAR);
```

**3. 削除ポリシー: 削除しない（永続保存）**

**理由**:
- 医療システムは全データを永続保存
- 監査ログも監査証跡として永続保存
- ストレージコストよりも監査証跡の重要性を優先

**実装方針**:
```sql
-- 削除バッチは実装しない
-- アーカイブテーブルに移動後も永続保存
-- ディスク容量監視のみ実施
-- 必要に応じてストレージ拡張
```

#### VoiceDrive側への推奨

**保存期間**: **3年**（VoiceDriveは法令要件に準拠）

**理由**:
- VoiceDriveのadmin/audit-logsはユーザー操作ログ（医療記録ではない）
- 電子帳簿保存法: 一般的なシステムログは3年保存で十分
- 医療システムと統一する必要なし

**アーカイブ方式**: **1年経過後にアーカイブ**（VoiceDrive推奨）

**理由**:
- VoiceDriveの監査ログは医療システムより参照頻度が低い
- 1年以上前のログは滅多にアクセスされない
- 早期アーカイブでパフォーマンス最適化

**実装例（VoiceDrive側）**:
```prisma
// VoiceDrive: schema.prisma
model AuditLogArchive {
  id          String   @id
  userId      String
  action      String
  entityType  String
  entityId    String
  oldValues   Json?
  newValues   Json?
  ipAddress   String?
  userAgent   String?
  severity    String?
  checksum    String?
  createdAt   DateTime
  archivedAt  DateTime @default(now())

  @@index([createdAt])
  @@index([userId])
  @@map("audit_logs_archive")
}
```

**月次バッチ（VoiceDrive側）**:
```typescript
// src/jobs/archiveAuditLogs.ts

export async function archiveOldAuditLogs() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // 1年以上前のログをアーカイブ
  const oldLogs = await prisma.auditLog.findMany({
    where: {
      createdAt: { lt: oneYearAgo }
    }
  });

  // アーカイブテーブルに移動
  await prisma.auditLogArchive.createMany({
    data: oldLogs.map(log => ({
      ...log,
      archivedAt: new Date()
    }))
  });

  // 元のテーブルから削除
  await prisma.auditLog.deleteMany({
    where: {
      createdAt: { lt: oneYearAgo }
    }
  });

  console.log(`Archived ${oldLogs.length} audit logs`);
}

// cron設定（毎月1日午前2時）
cron.schedule('0 2 1 * *', async () => {
  await archiveOldAuditLogs();
});
```

**削除バッチ（VoiceDrive側）**:
```typescript
// src/jobs/deleteOldArchivedLogs.ts

export async function deleteOldArchivedLogs() {
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  // 3年以上前のアーカイブログを削除
  const result = await prisma.auditLogArchive.deleteMany({
    where: {
      createdAt: { lt: threeYearsAgo }
    }
  });

  console.log(`Deleted ${result.count} archived logs (older than 3 years)`);
}

// cron設定（毎月1日午前3時）
cron.schedule('0 3 1 * *', async () => {
  await deleteOldArchivedLogs();
});
```

**医療システム側の対応**: ✅ **情報提供完了**（VoiceDrive側で実装）

---

### 回答-4: セキュリティインシデント時の連携について

**VoiceDrive側の確認**:
> VoiceDrive側で重大なセキュリティインシデントが発生した場合、医療システムチームに通知すべきでしょうか？

**医療システム側の回答**: ✅ **推奨実施**（重大インシデント（critical）のみ）

**理由**:
1. **同一職員が両システムにアクセス**:
   - VoiceDriveで不正アクセスが検知された場合、同じ職員が医療システムにもアクセスしている可能性
   - 医療システム側でも同様の不正アクセスが発生している可能性

2. **早期対応でリスク低減**:
   - VoiceDriveからの通知により、医療システム側でも調査開始
   - アカウント停止・パスワードリセット等の対応を迅速化

3. **セキュリティ体制の統一**:
   - 両システムのセキュリティチームが連携することで、より強固なセキュリティ体制

#### 通知対象のインシデント

| インシデントタイプ | 重要度 | 通知要否 | 理由 |
|----------------|-------|---------|------|
| **ログ改ざん検知** | critical | ✅ **通知必須** | システム全体のセキュリティリスク |
| **深夜の大量操作** | high | ✅ **通知推奨** | 不正アクセスの可能性 |
| **Level 99権限の不正使用** | critical | ✅ **通知必須** | システム管理者権限の濫用 |
| **短時間の大量操作** | medium | 🟡 **通知任意** | 医療システム側で判断 |
| **通常の操作ログ** | low | ❌ **通知不要** | 通常運用の範囲内 |

#### 通知方法の推奨

**方法1: Slackチャンネル通知（推奨）**

#### Slack通知の設定手順

**ステップ1: Incoming Webhookの作成**（医療システム側で実施）

1. Slackワークスペースにログイン
2. https://api.slack.com/messaging/webhooks にアクセス
3. 「Create your Slack app」をクリック
4. 「Incoming Webhooks」を有効化
5. 通知先チャンネルを選択（例: `#security-alerts`）
6. Webhook URLを取得
   ```
   https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
   ```
7. このURLをVoiceDriveチームへ共有

**ステップ2: VoiceDrive側の環境変数設定**

```env
# .env ファイルに追加
MEDICAL_SYSTEM_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
SLACK_ALERT_CHANNEL=#security-alerts
SECURITY_EMAIL=security-team@medical-system.example.com
```

**ステップ3: VoiceDrive側実装例**

```typescript
// src/services/SecurityAlertService.ts

export async function notifyMedicalSystemTeam(alert: AuditAlert) {
  if (alert.severity !== 'critical' && alert.severity !== 'high') {
    return; // critical, highのみ通知
  }

  const slackWebhookUrl = process.env.MEDICAL_SYSTEM_SLACK_WEBHOOK_URL;

  await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: process.env.SLACK_ALERT_CHANNEL,
      username: "VoiceDrive Security Bot",
      icon_emoji: ":rotating_light:",
      attachments: [
        {
          color: alert.severity === 'critical' ? 'danger' : 'warning',
          title: `🚨 ${alert.type}`,
          fields: [
            { title: '発生時刻', value: alert.detectedAt.toLocaleString('ja-JP'), short: true },
            { title: '重要度', value: alert.severity, short: true },
            { title: 'ユーザー', value: alert.userName || '不明', short: true },
            { title: '施設', value: alert.facilityName || '不明', short: true },
            { title: '詳細', value: alert.description, short: false }
          ],
          footer: 'VoiceDrive 監査ログシステム',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    })
  });
}
```

**ステップ4: 実際にSlackに届く通知の例**

```
🚨 ログ改ざん検知

発生時刻: 2025年10月27日 2:34:12
重要度: critical
ユーザー: 田中太郎（Level 7）
施設: 小原病院
詳細: 監査ログID #12345 のチェックサムが一致しません。
      データベースが直接操作された可能性があります。

VoiceDrive 監査ログシステム | 2:34 AM
```

**通知トリガーの詳細説明**

この通知システムは以下のセキュリティインシデントを検知します：

1. **ログ改ざん検知**（critical）
   - トリガー: ログのチェックサムが一致しない
   - 意味: 誰かがDBを直接操作してログを改ざんした可能性
   ```typescript
   if (log.checksum !== calculateChecksum(log)) {
     sendAlert("ログ改ざん検知", "critical");
   }
   ```

2. **深夜の大量操作**（high）
   - トリガー: 22:00-06:00の間に10件以上の操作
   - 意味: 通常は誰もいない時間に大量の操作 = 不正アクセスの可能性
   ```typescript
   if (isLateNight(timestamp) && operationCount >= 10) {
     sendAlert("深夜の大量操作", "high");
   }
   ```

3. **Level 99権限の不正使用**（critical）
   - トリガー: 管理者権限で通常ありえない操作
   - 意味: システム管理者権限の濫用
   ```typescript
   if (userLevel === 99 && isSuspiciousOperation(action)) {
     sendAlert("Level 99権限の不正使用", "critical");
   }
   ```

**注意**: この通知は「ログイン後の不正な操作」を検知するものです。ログイン失敗自体は別の認証システムで検知されます。

**医療システム側準備**:
- Slackワークスペース: `medical-system-security`
- チャンネル: `#security-alerts`（作成済み想定）
- Webhook URL: 医療システム側で発行（VoiceDriveチームへ共有）
- 担当者: セキュリティチームメンバー全員をチャンネルに追加

**方法2: メール通知（バックアップ）**

#### メール通知の設定手順

**ステップ1: メーリングリストの作成**（医療システム側で実施）

1. メールサーバーで専用アドレスを作成
   ```
   security-team@medical-system.example.com
   ```
2. メーリングリストにセキュリティチームメンバーを登録
   - セキュリティ責任者
   - システム管理者
   - インフラ担当者
3. このメールアドレスをVoiceDriveチームへ共有

**ステップ2: VoiceDrive側の環境変数設定**

```env
# .env ファイルに追加（Slackに加えて）
SECURITY_EMAIL=security-team@medical-system.example.com

# SMTP設定（Gmail, SendGrid, AWS SES等）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
```

**ステップ3: VoiceDrive側実装例（nodemailer使用）**

```typescript
// src/services/EmailAlertService.ts
import nodemailer from "nodemailer";

export async function sendSecurityAlertEmail(alert: AuditAlert) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // TLS使用
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const emailConfig = {
    to: process.env.SECURITY_EMAIL,
    from: 'VoiceDrive Security <noreply@voicedrive.example.com>',
    subject: `🚨 [VoiceDrive] セキュリティアラート (${alert.severity})`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .alert-box { border: 2px solid ${alert.severity === 'critical' ? '#dc3545' : '#ffc107'};
                       padding: 20px; margin: 20px 0; border-radius: 5px; }
          .critical { background-color: #f8d7da; }
          .high { background-color: #fff3cd; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="alert-box ${alert.severity}">
          <h2>🚨 VoiceDrive セキュリティアラート</h2>

          <table>
            <tr><th>アラートタイプ</th><td>${alert.type}</td></tr>
            <tr><th>重要度</th><td><strong>${alert.severity.toUpperCase()}</strong></td></tr>
            <tr><th>発生時刻</th><td>${alert.detectedAt.toLocaleString('ja-JP')}</td></tr>
            <tr><th>ユーザー</th><td>${alert.userName || '不明'}</td></tr>
            <tr><th>施設</th><td>${alert.facilityName || '不明'}</td></tr>
            <tr><th>詳細</th><td>${alert.description}</td></tr>
            <tr><th>関連ログ数</th><td>${alert.relatedLogs?.length || 0}件</td></tr>
          </table>

          <hr>

          <p><strong>推奨対応:</strong></p>
          <ul>
            <li>VoiceDrive admin/audit-logs ページで詳細を確認</li>
            <li>医療システム側でも同様のアクセスがないか確認</li>
            <li>必要に応じてアカウント停止・パスワードリセットを実施</li>
          </ul>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            このメールはVoiceDrive監査ログシステムから自動送信されています。<br>
            返信不要です。
          </p>
        </div>
      </body>
      </html>
    `
  };

  // メール送信
  await transporter.sendMail(emailConfig);
}
```

**ステップ4: 統合通知サービス（Slack + メール）**

```typescript
// src/services/SecurityNotificationService.ts

export async function notifySecurityIncident(alert: AuditAlert) {
  // critical, highのみ通知
  if (alert.severity !== 'critical' && alert.severity !== 'high') {
    return;
  }

  // Slack通知（優先）
  try {
    await notifyMedicalSystemTeam(alert);
    console.log(`✅ Slack通知送信成功: ${alert.type}`);
  } catch (error) {
    console.error(`❌ Slack通知送信失敗: ${error}`);
    // Slack失敗時はメールで通知
    await sendSecurityAlertEmail(alert);
  }

  // criticalの場合はメールも送信（二重通知）
  if (alert.severity === 'critical') {
    try {
      await sendSecurityAlertEmail(alert);
      console.log(`✅ メール通知送信成功: ${alert.type}`);
    } catch (error) {
      console.error(`❌ メール通知送信失敗: ${error}`);
    }
  }
}
```

**ステップ5: 施設別通知設定（オプション）**

```typescript
// config/facility-notifications.ts

export const FACILITY_NOTIFICATION_CONFIG = {
  'obara-hospital': {
    slack: {
      enabled: true,
      webhookUrl: process.env.OBARA_SLACK_WEBHOOK_URL,
      channel: '#obara-security'
    },
    email: {
      enabled: true,
      recipients: ['security@obara-hospital.jp']
    }
  },
  'tategami-rehabilitation': {
    slack: {
      enabled: true,
      webhookUrl: process.env.TATEGAMI_SLACK_WEBHOOK_URL,
      channel: '#tategami-security'
    },
    email: {
      enabled: true,
      recipients: ['security@tategami-rehab.jp']
    }
  }
};

// 施設別通知
export async function notifyFacilitySecurity(facilityId: string, alert: AuditAlert) {
  const config = FACILITY_NOTIFICATION_CONFIG[facilityId];

  if (config?.slack.enabled) {
    await sendSlackToFacility(config.slack, alert);
  }

  if (config?.email.enabled) {
    await sendEmailToFacility(config.email, alert);
  }
}
```

**医療システム側準備**:
- メールアドレス: `security-team@medical-system.example.com`
- メーリングリスト登録: セキュリティチームメンバー全員
- メールフィルター設定: `[VoiceDrive]` を含むメールを優先表示

#### データ共有範囲（重要）

**共有する情報**:
- ✅ アラートタイプ（suspicious_activity, policy_violation等）
- ✅ 重要度（critical, high）
- ✅ 説明文（概要のみ）
- ✅ 検知日時
- ✅ 関連ログ数（件数のみ）

**共有しない情報**:
- ❌ 監査ログの詳細（action, entityId, oldValues等）
- ❌ ユーザーID・ユーザー名（個人情報保護）
- ❌ IPアドレス・User Agent（セキュリティ上の配慮）

**理由**: 監査ログ自体はシステム間で共有すべきではない（セキュリティリスク増大）

**医療システム側の対応**:
- ✅ Slack Webhook URL発行（VoiceDriveチームへ共有予定）
- ✅ メールアドレス設定（security-team@medical-system.example.com）
- ✅ セキュリティチーム体制構築（通知受信後の対応フロー策定）

---

## 📊 まとめ

### 追加確認事項への回答

| # | 確認事項 | 医療システム側の回答 | VoiceDrive側の対応 |
|---|---------|-------------------|------------------|
| 1 | ユーザー情報参照 | ✅ 問題なし | キャッシュデータ利用継続 |
| 2 | Level 99操作定義 | ✅ 問題なし | VoiceDrive独自基準継続 |
| 3 | 保存期間 | ✅ 回答済み（永続保存） | VoiceDrive: 3年保存推奨 |
| 4 | インシデント連携 | ✅ 推奨実施 | Slack通知実装推奨 |

### 医療システム側の対応完了事項

- ✅ 追加確認事項への回答完了（4件）
- ✅ 保存期間・アーカイブ方針の提示
- ✅ インシデント連携方法の推奨
- ✅ Webhook実装済み（employee.updated）

### VoiceDrive側の推奨実装

#### 優先度: 🔴 HIGH

1. **アーカイブ機能実装**:
   - AuditLogArchiveテーブル追加
   - 月次バッチ（1年経過後にアーカイブ）
   - 月次バッチ（3年経過後に削除）
   - cron設定（毎月1日午前2-3時）

2. **セキュリティアラート通知実装**:
   - Slack Webhook通知機能
   - メール通知機能（バックアップ）
   - 通知対象: critical, highのみ

#### 優先度: 🟡 MEDIUM

3. **パフォーマンス最適化**:
   - Phase 3の日次集計レポート実装
   - ページネーション機能追加
   - 100万ログ想定のパフォーマンステスト

---

## 🔗 次のステップ

### VoiceDrive側の対応

1. **Phase 2実装完了** - 2025年11月1日目標
2. **アーカイブ機能実装** - 2025年11月4日〜7日（Phase 3に含む）
3. **セキュリティアラート通知実装** - 2025年11月4日〜7日（Phase 3に含む）
4. **Slack Webhook URL受領** - 医療システムチームから共有待ち

### 医療システム側の対応

1. **Slack Webhook URL発行** - 2025年10月28日目標
2. **メールアドレス設定** - 2025年10月28日目標
3. **セキュリティチーム体制構築** - 2025年11月1日目標
4. **通知受信後の対応フロー策定** - 2025年11月1日目標

---

## 📞 連絡先

**医療システムチーム**:
- 連絡方法: `mcp-shared/logs/` 経由のファイルベース連絡
- Slack Webhook URL: 2025年10月28日までに共有予定
- メールアドレス: security-team@medical-system.example.com

**VoiceDriveチーム**:
- 連絡方法: `mcp-shared/logs/` 経由のファイルベース連絡
- Slack: #voicedrive-integration

---

---

## 📌 補足: Slack/メール通知の実装チェックリスト

### 医療システム側のタスク

- [ ] Slack Incoming Webhook URLの発行（#security-alerts）
- [ ] セキュリティチームメンバーをSlackチャンネルに招待
- [ ] セキュリティメーリングリスト作成（security-team@medical-system.example.com）
- [ ] Webhook URL・メールアドレスをVoiceDriveチームへ共有
- [ ] セキュリティインシデント対応フローの策定
- [ ] 通知受信後の対応手順書作成

### VoiceDrive側のタスク

- [ ] 環境変数設定（SLACK_WEBHOOK_URL, SECURITY_EMAIL, SMTP設定）
- [ ] SecurityAlertService実装
- [ ] EmailAlertService実装（nodemailer）
- [ ] SecurityNotificationService実装（統合）
- [ ] 監査ログ分析ロジック実装（チェックサム検証、異常パターン検知）
- [ ] テスト通知の送信確認（Slack + メール）
- [ ] 本番環境へのデプロイ
- [ ] 1週間の監視期間（誤検知チェック）

### 推奨実装スケジュール

| 日付 | タスク | 担当 |
|------|--------|------|
| 10/28 | Slack/メール設定完了 | 医療システム |
| 10/29-30 | 通知サービス実装 | VoiceDrive |
| 10/31 | テスト通知送信 | VoiceDrive |
| 11/1 | 本番環境デプロイ | VoiceDrive |
| 11/1-7 | 監視期間（誤検知調整） | 両チーム |

---

**文書終了**

最終更新: 2025年10月27日
バージョン: 2.0（Slack/メール通知設定詳細を追加）
次回レビュー: VoiceDrive側Phase 2-3実装完了後（2025年11月7日）
