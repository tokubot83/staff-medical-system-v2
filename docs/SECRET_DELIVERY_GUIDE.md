# 本番環境秘密情報配信ガイド

## 📅 実施日時
**2025年9月25日 09:00 JST**

---

## 📋 事前準備チェックリスト

### 1. 医療システムチーム側

- [ ] `.env.production.local` ファイルの作成
- [ ] 本番環境の秘密情報を設定
- [ ] medical-cli ツールの動作確認
- [ ] 通知チャネル（Email/Slack）の確認

### 2. VoiceDriveチーム側

- [ ] voicedrive-cli ツールの準備
- [ ] `.env.production.local` の受信準備
- [ ] MFA認証アプリの準備（Google Authenticator等）
- [ ] セキュアな通信チャネルの確立

---

## 🚀 配信手順

### Step 1: 秘密情報の準備（医療システムチーム）

```bash
# 1. プロジェクトディレクトリへ移動
cd /projects/staff-medical-system

# 2. 本番環境設定ファイルを作成
cp .env.production.local.example .env.production.local

# 3. 実際の秘密情報を設定
nano .env.production.local
```

### Step 2: 秘密情報の配信

```bash
# 配信スクリプトの実行
bash scripts/deliver-production-secrets.sh

# または直接CLIで実行
npm run medical-cli -- secrets deliver \
  --recipient voicedrive-production \
  --env production \
  --expires 24h \
  --mfa required
```

### Step 3: 配信確認

配信完了後、以下の情報が表示されます：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Secret Delivery Summary

Delivery ID: SEC-20250925-MED001
Recipient: voicedrive-production
Environment: production
Secrets Count: 10
Expires: 24h
MFA Required: Yes
Status: Delivered

🔑 One-Time Access Token:
[32バイトのトークンが表示されます]

🔗 Access URL:
https://secure.medical-system.kosei-kai.jp/secrets/SEC-20250925-MED001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4: VoiceDriveチームへの通知

#### 自動送信される通知

1. **Email通知**
   - 宛先: voicedrive-integration@medical-system.kosei-kai.jp
   - 件名: 【重要】本番環境秘密情報の配信通知
   - 内容: 配信ID、アクセスURL、有効期限

2. **Slack通知**
   - チャンネル: #compliance-integration
   - メンション: @voicedrive-team

#### 手動で共有する情報

**セキュアチャネル1（暗号化メール）で送信:**
- ワンタイムアクセストークン

**セキュアチャネル2（電話/SMS）で送信:**
- MFAコード: `123456`（例）

---

## 🔓 受信手順（VoiceDriveチーム）

### Step 1: CLIツールで秘密情報を取得

```bash
# voicedrive-cliを使用
npm run voicedrive-cli -- secrets retrieve SEC-20250925-MED001

# プロンプトが表示されたら入力
> Enter one-time access token: [受信したトークンを入力]
> Enter MFA code (6 digits): [受信したMFAコードを入力]
```

### Step 2: 取得完了確認

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔓 Retrieved Secrets

[1] CLIENT_SECRET
    Type: credential
    Description: OAuth2.0 Client Secret for VoiceDrive

[2] DB_PASSWORD
    Type: credential
    Description: MySQL Database Password

[3] AWS_SECRET_ACCESS_KEY
    Type: api_key
    Description: AWS S3 Secret Access Key

[4] SENDGRID_API_KEY
    Type: api_key
    Description: SendGrid Email API Key

[5] JWT_SECRET
    Type: token
    Description: JWT Signing Secret

[6] SESSION_SECRET
    Type: token
    Description: Session Encryption Secret

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Secrets saved to .env.production.local
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: 環境変数の確認

```bash
# 保存されたファイルの確認
cat .env.production.local

# アプリケーションの再起動
npm run build
npm run start
```

---

## 🔒 セキュリティ注意事項

### 重要
1. **ワンタイムトークンは1回のみ使用可能**
   - 使用後は自動的に無効化されます

2. **24時間で自動削除**
   - 期限切れ後はアクセス不可能

3. **監査ログ記録**
   - 全てのアクセスが記録されます

### 禁止事項
- ❌ トークンをチャットやメールに直接貼り付けない
- ❌ スクリーンショットで共有しない
- ❌ 公開リポジトリにコミットしない
- ❌ .env.production.localをGitに追加しない

---

## 🆘 トラブルシューティング

### Q: トークンが無効と表示される
A: 以下を確認してください：
- トークンが既に使用されていないか
- 24時間の有効期限が切れていないか
- 正確にコピー&ペーストしているか

### Q: MFA認証が失敗する
A: MFAコードは時間依存のため、30秒以内に入力してください

### Q: 秘密情報の取得後、アプリケーションが起動しない
A: 環境変数が正しく設定されているか確認：
```bash
# 環境変数の確認
grep CLIENT_SECRET .env.production.local
grep DB_PASSWORD .env.production.local
```

---

## 📞 緊急連絡先

### 配信に関する問題
- **医療システムチーム**: tech-support@medical-system.kosei-kai.jp
- **緊急ホットライン**: 090-XXXX-XXXX

### 受信に関する問題
- **VoiceDriveチーム**: dev@voicedrive.ai
- **Slack**: #voicedrive-integration

---

## 📅 タイムライン

| 時刻 | アクション | 担当 |
|------|-----------|------|
| 09:00 | 秘密情報の配信開始 | 医療システム |
| 09:15 | 通知確認・トークン受信 | VoiceDrive |
| 09:30 | MFAコード共有 | 医療システム |
| 09:45 | 秘密情報取得 | VoiceDrive |
| 10:00 | 取得完了確認 | 両チーム |
| 10:30 | 接続テスト開始 | 両チーム |

---

**ドキュメント作成日**: 2025年9月25日
**作成者**: 医療法人厚生会システム開発チーム
**バージョン**: 1.0.0