# ログ監視体制構築ガイド

## 1. ログ収集設定

### 1.1 アプリケーションログ

#### Winston設定（Node.js）
```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // ファイル出力
    new winston.transports.File({
      filename: '/var/log/medical-system/error.log',
      level: 'error',
      maxsize: 104857600, // 100MB
      maxFiles: 30
    }),
    new winston.transports.File({
      filename: '/var/log/medical-system/combined.log',
      maxsize: 104857600,
      maxFiles: 30
    })
  ]
});
```

### 1.2 V3異議申立専用ログ

```javascript
// 異議申立の全操作を記録
const appealLogger = {
  logSubmission: (appealId, data) => {
    logger.info('APPEAL_SUBMITTED', {
      appealId,
      employeeId: data.employeeId,
      conversationId: data.conversationId,
      timestamp: new Date().toISOString(),
      source: 'VoiceDrive'
    });
  },
  
  logStatusChange: (appealId, oldStatus, newStatus, reviewer) => {
    logger.info('APPEAL_STATUS_CHANGED', {
      appealId,
      oldStatus,
      newStatus,
      reviewer,
      timestamp: new Date().toISOString()
    });
  },
  
  logError: (appealId, error, context) => {
    logger.error('APPEAL_ERROR', {
      appealId,
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
};
```

## 2. 監視項目と閾値

### 2.1 システムメトリクス

| 監視項目 | 閾値 | アラートレベル | 対応 |
|---------|------|--------------|------|
| CPU使用率 | > 80% | Warning | スケールアウト検討 |
| メモリ使用率 | > 85% | Warning | メモリリーク調査 |
| ディスク使用率 | > 90% | Critical | ログローテーション確認 |
| レスポンス時間 | > 3秒 | Warning | パフォーマンス調査 |
| エラー率 | > 5% | Critical | 即時調査 |

### 2.2 V3異議申立専用メトリクス

| 監視項目 | 閾値 | アラートレベル | 対応 |
|---------|------|--------------|------|
| 申立受信失敗 | > 3回/時 | Warning | API接続確認 |
| 処理時間超過 | > 5秒 | Warning | 負荷状況確認 |
| 認証エラー率 | > 10% | Critical | トークン確認 |
| VoiceDrive通信エラー | > 5回/日 | Warning | 連携確認 |

## 3. アラート設定

### 3.1 Slack通知設定

```javascript
// config/alerts.js
const sendSlackAlert = async (level, message, details) => {
  const color = {
    'critical': 'danger',
    'warning': 'warning',
    'info': 'good'
  }[level];
  
  await slack.send({
    channel: '#medical-system-alerts',
    attachments: [{
      color,
      title: `[${level.toUpperCase()}] ${message}`,
      fields: [
        { title: '発生時刻', value: new Date().toISOString(), short: true },
        { title: '環境', value: 'Production', short: true },
        { title: '詳細', value: JSON.stringify(details), short: false }
      ]
    }]
  });
};
```

### 3.2 メール通知設定

```javascript
// 重大エラー時のメール通知
const sendEmailAlert = async (subject, body, recipients) => {
  await mailer.send({
    to: recipients || ['system-admin@example.com'],
    subject: `[Medical System Alert] ${subject}`,
    html: `
      <h2>システムアラート</h2>
      <p><strong>発生時刻:</strong> ${new Date().toISOString()}</p>
      <p><strong>内容:</strong></p>
      <pre>${body}</pre>
    `
  });
};
```

## 4. ダッシュボード構成

### 4.1 Grafanaダッシュボード

#### メインダッシュボード
- システム全体の健全性
- リアルタイムメトリクス
- エラー発生状況
- トラフィック分析

#### V3異議申立専用ダッシュボード
- 申立受信数（時間別）
- ステータス別件数
- 平均処理時間
- VoiceDrive連携状況

### 4.2 監視クエリ例

```sql
-- 直近1時間の異議申立数
SELECT COUNT(*) as appeal_count
FROM appeals
WHERE created_at > NOW() - INTERVAL '1 hour'
  AND source = 'voicedrive';

-- エラー率の計算
SELECT 
  COUNT(CASE WHEN status = 'error' THEN 1 END)::float / COUNT(*) * 100 as error_rate
FROM api_logs
WHERE endpoint LIKE '/api/v3/appeals%'
  AND created_at > NOW() - INTERVAL '5 minutes';

-- 平均レスポンス時間
SELECT 
  AVG(response_time) as avg_response_time,
  MAX(response_time) as max_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95_response_time
FROM api_logs
WHERE endpoint LIKE '/api/v3/appeals%'
  AND created_at > NOW() - INTERVAL '1 hour';
```

## 5. ログローテーション設定

### 5.1 logrotate設定

```bash
# /etc/logrotate.d/medical-system
/var/log/medical-system/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload medical-system
    endscript
}
```

### 5.2 S3バックアップ

```bash
#!/bin/bash
# backup-logs.sh

DATE=$(date +%Y%m%d)
BUCKET="medical-system-logs"

# ログファイルをS3にアップロード
aws s3 cp /var/log/medical-system/ s3://${BUCKET}/${DATE}/ --recursive --exclude "*.gz"

# 30日以上前のログを削除
find /var/log/medical-system/ -name "*.gz" -mtime +30 -delete
```

## 6. インシデント対応フロー

### 6.1 エスカレーションマトリクス

| レベル | 条件 | 通知先 | 対応時間 |
|--------|------|--------|----------|
| Level 1 | 軽微な警告 | Slack通知のみ | 営業時間内 |
| Level 2 | 機能影響あり | Slack + メール | 2時間以内 |
| Level 3 | サービス停止 | 全関係者 + 電話 | 即時対応 |

### 6.2 対応手順

1. **アラート受信**
   - Slack/メールでアラート受信
   - ダッシュボードで状況確認

2. **初期調査**
   - ログ確認（最新のエラーログ）
   - メトリクス確認（CPU/メモリ/ディスク）
   - 外部サービス状態確認

3. **対応実施**
   - 問題の特定と対処
   - 必要に応じてロールバック
   - 関係者への連絡

4. **事後対応**
   - インシデントレポート作成
   - 再発防止策の検討
   - モニタリング強化

## 7. 定期レビュー

### 月次レビュー項目
- [ ] エラー発生傾向の分析
- [ ] パフォーマンス劣化の確認
- [ ] ログ容量の確認
- [ ] アラート設定の見直し
- [ ] インシデント対応の振り返り

### 四半期レビュー項目
- [ ] 監視項目の見直し
- [ ] 閾値の調整
- [ ] ダッシュボードの改善
- [ ] ログ保持期間の見直し

---

**作成日**: 2025-08-22  
**最終更新**: 2025-08-22  
**次回レビュー**: 2025-09-22