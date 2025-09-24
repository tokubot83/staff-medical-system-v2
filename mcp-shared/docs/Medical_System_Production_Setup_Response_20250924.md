# 医療システムチーム - 本番環境設定情報提供書

**発信**: 医療システムチーム  
**宛先**: VoiceDriveチーム  
**日時**: 2025年9月25日 00:10  
**報告者**: 医療法人厚生会システム開発チーム  
**重要度**: 🔴 **本番環境設定**

---

## 📋 エグゼクティブサマリー

VoiceDriveチームの統合完了報告を受け、本番環境への移行に必要な設定情報とアクセス情報を提供いたします。すべての設定は医療法人厚生会のセキュリティポリシーに準拠しています。

---

## 🔐 本番環境API設定

### 1. エンドポイント情報

#### 本番環境URL
```bash
# プライマリエンドポイント
API_BASE_URL="https://api.medical-system.kosei-kai.jp/v2"
COMPLIANCE_ENDPOINT="/compliance/voicedrive"
WEBHOOK_ENDPOINT="/compliance/webhook"

# フェイルオーバーエンドポイント（バックアップ）
FAILOVER_API_URL="https://api-backup.medical-system.kosei-kai.jp/v2"
```

#### API仕様
```javascript
{
  "version": "2.0.0",
  "protocol": "HTTPS",
  "tls_version": "1.3",
  "timeout": 30000,  // ミリ秒
  "rate_limit": {
    "requests_per_minute": 60,
    "burst_limit": 100
  },
  "retry_policy": {
    "max_retries": 3,
    "backoff_type": "exponential",
    "initial_delay": 1000,
    "max_delay": 10000
  }
}
```

### 2. 認証設定（Bearer Token）

#### Token発行エンドポイント
```bash
TOKEN_ENDPOINT="https://auth.medical-system.kosei-kai.jp/oauth/token"
```

#### Token取得方法
```javascript
// POST /oauth/token
{
  "grant_type": "client_credentials",
  "client_id": "voicedrive_production_2025",
  "client_secret": "${CLIENT_SECRET}",  // 別途セキュアチャネルで提供
  "scope": "compliance:write compliance:read audit:write"
}

// レスポンス
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "scope": "compliance:write compliance:read audit:write"
}
```

#### Token更新スクリプト
```typescript
// src/scripts/token-refresh.ts
import axios from 'axios';
import * as fs from 'fs';

const refreshToken = async () => {
  try {
    const response = await axios.post(
      process.env.TOKEN_ENDPOINT!,
      {
        grant_type: 'refresh_token',
        refresh_token: process.env.REFRESH_TOKEN,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      }
    );
    
    // 新しいトークンを環境変数に保存
    process.env.ACCESS_TOKEN = response.data.access_token;
    process.env.REFRESH_TOKEN = response.data.refresh_token;
    
    // セキュアストレージに保存
    fs.writeFileSync(
      '/secure/tokens/bearer.json',
      JSON.stringify({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_at: Date.now() + (response.data.expires_in * 1000)
      }),
      { mode: 0o600 }
    );
    
    console.log('Token refreshed successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// 50分ごとに自動更新
setInterval(refreshToken, 50 * 60 * 1000);

export { refreshToken };
```

---

## 👥 テストアカウント情報

### 統合テスト用アカウント

#### 管理者アカウント
```json
{
  "username": "voicedrive_test_admin",
  "email": "voicedrive-test-admin@medical-system.kosei-kai.jp",
  "password": "TestAdmin2025!@#",  // 初回ログイン後要変更
  "role": "compliance_admin",
  "permissions": [
    "compliance.create",
    "compliance.read",
    "compliance.update",
    "compliance.delete",
    "audit.read",
    "committee.manage"
  ],
  "test_mode": true
}
```

#### 一般テストアカウント
```json
{
  "username": "voicedrive_test_user",
  "email": "voicedrive-test-user@medical-system.kosei-kai.jp",
  "password": "TestUser2025!@#",  // 初回ログイン後要変更
  "role": "compliance_user",
  "permissions": [
    "compliance.create",
    "compliance.read"
  ],
  "test_mode": true
}
```

#### WebhookテストURL
```bash
# テスト環境Webhook受信エンドポイント
TEST_WEBHOOK_URL="https://test-api.medical-system.kosei-kai.jp/v2/compliance/webhook/test"
TEST_WEBHOOK_SECRET="test_webhook_secret_2025"  # HMAC-SHA256署名検証用
```

---

## 🗄️ データベース接続設定

### PostgreSQL本番環境

#### 接続情報
```bash
# プライマリデータベース
DB_HOST="db-primary.medical-system.kosei-kai.jp"
DB_PORT="5432"
DB_NAME="compliance_production"
DB_USER="voicedrive_prod"
DB_PASSWORD="${DB_PASSWORD}"  # セキュアチャネルで別途提供
DB_SSL_MODE="require"
DB_SSL_CERT="/secure/certs/postgresql-ca.crt"

# レプリカ（読み取り専用）
DB_REPLICA_HOST="db-replica.medical-system.kosei-kai.jp"
DB_REPLICA_PORT="5432"
```

#### 接続プール設定
```javascript
{
  "min": 2,
  "max": 10,
  "idleTimeoutMillis": 30000,
  "connectionTimeoutMillis": 2000,
  "statement_timeout": 30000,
  "query_timeout": 30000,
  "ssl": {
    "rejectUnauthorized": true,
    "ca": "./certs/postgresql-ca.crt",
    "cert": "./certs/client-cert.crt",
    "key": "./certs/client-key.key"
  }
}
```

### 長期保存ストレージ（7年保存）

#### AWS S3設定
```bash
# S3バケット設定
S3_BUCKET="kosei-kai-compliance-archive"
S3_REGION="ap-northeast-1"
S3_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
S3_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
S3_ENCRYPTION="AES256"
S3_STORAGE_CLASS="GLACIER"  # コスト最適化

# ライフサイクルポリシー
LIFECYCLE_RULES={
  "transition_to_glacier": "90_days",
  "transition_to_deep_archive": "365_days",
  "expiration": "2555_days"  # 7年
}
```

---

## 📧 通知チャネル設定

### Email設定（SendGrid）
```javascript
{
  "provider": "sendgrid",
  "api_key": "${SENDGRID_API_KEY}",
  "from_email": "compliance@medical-system.kosei-kai.jp",
  "from_name": "医療法人厚生会コンプライアンス窓口",
  "templates": {
    "critical_alert": "d-abc123def456",
    "case_assigned": "d-ghi789jkl012",
    "investigation_complete": "d-mno345pqr678"
  }
}
```

### Teams設定
```javascript
{
  "webhook_url": "https://koseikai.webhook.office.com/webhookb2/...",
  "channel": "コンプライアンス通知",
  "mention_users": [
    "compliance-admin@kosei-kai.jp"
  ]
}
```

### Slack設定
```javascript
{
  "webhook_url": "https://hooks.slack.com/services/T00000000/B00000000/...",
  "channel": "#compliance-alerts",
  "username": "Compliance Bot",
  "icon_emoji": ":shield:"
}
```

---

## 🚀 本番デプロイ手順

### 1. 環境変数設定
```bash
# .env.production ファイルを作成
cp .env.example .env.production

# 本番環境変数を設定
nano .env.production
```

### 2. SSL証明書配置
```bash
# 証明書ディレクトリ作成
mkdir -p /secure/certs

# 証明書を配置（別途提供）
cp postgresql-ca.crt /secure/certs/
cp client-cert.crt /secure/certs/
cp client-key.key /secure/certs/

# 権限設定
chmod 600 /secure/certs/*
```

### 3. データベースマイグレーション
```bash
# 本番データベースに接続
export DATABASE_URL="postgresql://voicedrive_prod:${DB_PASSWORD}@db-primary.medical-system.kosei-kai.jp:5432/compliance_production?sslmode=require"

# マイグレーション実行
npm run migrate:production
```

### 4. 初期データ投入
```bash
# シードデータ投入
npm run seed:production
```

### 5. ヘルスチェック
```bash
# APIヘルスチェック
curl https://api.medical-system.kosei-kai.jp/v2/health

# データベース接続確認
npm run test:db:connection
```

---

## 📊 監視・アラート設定

### CloudWatch設定
```javascript
{
  "metrics": [
    {
      "name": "API_Response_Time",
      "threshold": 1000,  // ms
      "alarm_action": "SNS"
    },
    {
      "name": "Error_Rate",
      "threshold": 0.01,  // 1%
      "alarm_action": "PagerDuty"
    },
    {
      "name": "Database_Connection_Pool",
      "threshold": 8,  // 80%使用率
      "alarm_action": "Email"
    }
  ],
  "log_groups": [
    "/aws/lambda/compliance-api",
    "/aws/rds/compliance-db",
    "/aws/s3/compliance-archive"
  ]
}
```

---

## 🔒 セキュリティ注意事項

### 重要な秘密情報の取り扱い

以下の情報は別途セキュアチャネル（暗号化メール）で送付します：
- CLIENT_SECRET
- DB_PASSWORD
- AWS_SECRET_ACCESS_KEY
- SENDGRID_API_KEY
- 各種Webhook URL

### アクセス制限

本番環境へのアクセスは以下のIPアドレスからのみ許可されています：
```
# VoiceDrive本社
203.0.113.0/24

# 医療法人厚生会
198.51.100.0/24

# AWS NAT Gateway
52.68.xxx.xxx/32  # 動的IP（事前登録必要）
```

---

## 📞 緊急連絡先

### 医療システムチーム
- **通常対応**: support@medical-system.kosei-kai.jp
- **緊急対応**: emergency@medical-system.kosei-kai.jp
- **オンコール**: 090-xxxx-xxxx（24時間対応）

### エスカレーション
1. L1: システム運用チーム（5分以内）
2. L2: 開発チームリーダー（15分以内）
3. L3: CTO（30分以内）

---

## 📅 次のステップ

1. **～9/25 12:00**: 秘密情報の送付（暗号化メール）
2. **～9/25 18:00**: VoiceDriveチーム側での設定完了
3. **9/26 10:00**: 本番環境での接続テスト
4. **9/26 15:00**: 負荷テスト実施
5. **9/27 10:00**: 本番サービス開始

---

**文書作成日**: 2025年9月25日  
**承認者**: 医療システム開発責任者  
**次回更新**: 設定完了後  

---

*本文書は医療法人厚生会システム開発チームにより作成されました。*