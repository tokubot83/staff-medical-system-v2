# Phase 2 CloudFront Distribution 設定手順書

**文書番号**: MED-TECH-CLOUDFRONT-2025-1021-001
**作成日**: 2025年10月21日
**対象**: 医療システムチーム（インフラ担当者）
**目的**: 職員顔写真配信用CloudFront Distributionの設定

---

## 📋 概要

Phase 2顔写真統合において、AWS S3に保存された職員顔写真をCloudFront CDN経由で高速配信するための設定手順書です。

### 設定する内容
- ✅ CloudFront Distribution作成
- ✅ Origin Access Control (OAC)設定
- ✅ CORS設定（VoiceDrive向け）
- ✅ S3バケットポリシー更新
- ✅ キャッシュポリシー設定

---

## 🎯 前提条件

### 既存のリソース
- AWS S3バケット: `medical-system-profile-photos`
- リージョン: `ap-northeast-1`（東京）
- 既存の顔写真: 約300件（各200KB、JPEG）

### 必要な権限
- AWS IAM: CloudFront管理権限
- AWS IAM: S3バケットポリシー編集権限

### 使用するツール
- AWS Management Console（推奨）
- または AWS CLI

---

## 📝 設定手順

### Step 1: Origin Access Control (OAC) 作成

OACを使用して、CloudFrontからS3バケットへのアクセスを保護します。

#### 1.1 AWS Management Consoleでの作成

1. **AWS Management Console** にログイン
2. **CloudFront** サービスに移動
3. 左サイドバーから **Origin access** > **Control settings** をクリック
4. **Create control setting** ボタンをクリック

#### 1.2 OAC設定値

| 項目 | 設定値 |
|------|--------|
| **Name** | `medical-system-s3-oac` |
| **Description** | `OAC for medical-system-profile-photos S3 bucket` |
| **Origin type** | `S3` |
| **Signing behavior** | `Sign requests (recommended)` |

5. **Create** をクリック

#### 1.3 OAC ID取得

作成後、OAC IDをメモしておく（例: `E2QWRTYUIOP3M4`）

---

### Step 2: Response Headers Policy 作成（CORS設定）

VoiceDriveからCloudFront経由で画像を読み込むためのCORS設定を行います。

#### 2.1 Response Headers Policy作成

1. CloudFrontサービスで **Policies** > **Response headers** に移動
2. **Create response headers policy** をクリック

#### 2.2 CORS設定値

**General settings**:
| 項目 | 設定値 |
|------|--------|
| **Name** | `MedicalSystem-VoiceDrive-CORS-Policy` |
| **Description** | `CORS policy for VoiceDrive to access profile photos` |

**CORS configuration**:

| 項目 | 設定値 |
|------|--------|
| **Access-Control-Allow-Origins** | `https://voicedrive.example.com`, `http://localhost:3001` |
| **Access-Control-Allow-Methods** | `GET`, `HEAD` |
| **Access-Control-Allow-Headers** | `*` |
| **Access-Control-Max-Age** | `3600` |
| **Origin override** | `Yes` |

3. **Create** をクリック

#### 2.3 Policy ID取得

作成後、Policy IDをメモしておく（例: `5c2f4a6b-8d9e-1a2b-3c4d-5e6f7g8h9i0j`）

---

### Step 3: CloudFront Distribution 作成

#### 3.1 Distribution作成開始

1. CloudFrontサービスで **Distributions** に移動
2. **Create distribution** をクリック

#### 3.2 Origin設定

**Origin**:

| 項目 | 設定値 |
|------|--------|
| **Origin domain** | `medical-system-profile-photos.s3.ap-northeast-1.amazonaws.com` |
| **Origin path** | （空欄） |
| **Name** | `S3-medical-system-profile-photos` |
| **Origin access** | `Origin access control settings (recommended)` |
| **Origin access control** | 先ほど作成した `medical-system-s3-oac` を選択 |

#### 3.3 Default cache behavior設定

**Cache policy and origin requests**:

| 項目 | 設定値 |
|------|--------|
| **Cache policy** | `CachingOptimized` |
| **Origin request policy** | なし |
| **Response headers policy** | 先ほど作成した `MedicalSystem-VoiceDrive-CORS-Policy` |

**Viewer protocol policy**:
- `Redirect HTTP to HTTPS` を選択

**Allowed HTTP methods**:
- `GET, HEAD` を選択

**Restrict viewer access**:
- `No` を選択

#### 3.4 Settings（その他の設定）

| 項目 | 設定値 |
|------|--------|
| **Price class** | `Use all edge locations (best performance)` |
| **Alternate domain name (CNAME)** | （空欄でOK） |
| **Custom SSL certificate** | （不要） |
| **Supported HTTP versions** | `HTTP/2 and HTTP/3` |
| **Default root object** | （空欄） |
| **Standard logging** | `Off`（本番環境では`On`推奨） |
| **IPv6** | `On` |

#### 3.5 Distribution作成

**Create distribution** をクリック

#### 3.6 Distribution IDとドメイン名取得

作成後、以下の情報をメモ：

- **Distribution ID**: 例 `E1A2B3C4D5E6F7`
- **Distribution domain name**: 例 `d2k8x5j9m1n4p7.cloudfront.net`

**重要**: Distribution domain nameを`.env`ファイルの`CLOUDFRONT_DOMAIN`に設定します。

```bash
CLOUDFRONT_DOMAIN="https://d2k8x5j9m1n4p7.cloudfront.net"
```

---

### Step 4: S3バケットポリシー更新

CloudFrontからのアクセスを許可するため、S3バケットポリシーを更新します。

#### 4.1 Distribution作成後の指示に従う

CloudFront Distribution作成後、以下のような青いバナーが表示されます：

> **The S3 bucket policy needs to be updated**
> CloudFront needs permission to access your S3 bucket. Copy the policy to update your S3 bucket permissions.

**Copy policy** ボタンをクリックしてポリシーをコピー

#### 4.2 S3バケットポリシー適用

1. **S3サービス** に移動
2. `medical-system-profile-photos` バケットを選択
3. **Permissions** タブをクリック
4. **Bucket policy** セクションで **Edit** をクリック
5. 既存のポリシーを削除し、コピーしたポリシーを貼り付け

**ポリシー例**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::medical-system-profile-photos/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::<Account ID>:distribution/<Distribution ID>"
        }
      }
    }
  ]
}
```

**注意**: `<Account ID>` と `<Distribution ID>` は自動的に置き換えられます。

6. **Save changes** をクリック

---

### Step 5: 動作確認

#### 5.1 テスト画像アップロード

```bash
# AWS CLIでテスト画像をアップロード
aws s3 cp test-image.jpg s3://medical-system-profile-photos/employees/TEST-001.jpg \
  --region ap-northeast-1 \
  --content-type image/jpeg
```

#### 5.2 CloudFront経由でアクセス確認

```bash
# curlで画像取得テスト
curl -I https://d2k8x5j9m1n4p7.cloudfront.net/employees/TEST-001.jpg
```

**期待されるレスポンス**:
```
HTTP/2 200
content-type: image/jpeg
content-length: 180000
access-control-allow-origin: https://voicedrive.example.com
access-control-allow-methods: GET, HEAD
access-control-max-age: 3600
x-cache: Hit from cloudfront
```

#### 5.3 S3直接アクセスの拒否確認

```bash
# S3直接アクセスは拒否されるべき
curl -I https://medical-system-profile-photos.s3.ap-northeast-1.amazonaws.com/employees/TEST-001.jpg
```

**期待されるレスポンス**:
```
HTTP/1.1 403 Forbidden
```

---

### Step 6: CORS動作確認

#### 6.1 CORS Preflightリクエストテスト

```bash
curl -X OPTIONS \
  -H "Origin: https://voicedrive.example.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: content-type" \
  https://d2k8x5j9m1n4p7.cloudfront.net/employees/TEST-001.jpg \
  -i
```

**期待されるレスポンス**:
```
HTTP/2 200
access-control-allow-origin: https://voicedrive.example.com
access-control-allow-methods: GET, HEAD
access-control-allow-headers: content-type
access-control-max-age: 3600
```

#### 6.2 ブラウザでの確認

**HTMLテストページ** (`test-cors.html`):
```html
<!DOCTYPE html>
<html>
<head>
  <title>CloudFront CORS Test</title>
</head>
<body>
  <h1>CloudFront CORS動作確認</h1>
  <img id="test-image" src="https://d2k8x5j9m1n4p7.cloudfront.net/employees/TEST-001.jpg" />
  <p id="status">画像読み込み中...</p>

  <script>
    const img = document.getElementById('test-image');
    const status = document.getElementById('status');

    img.onload = () => {
      status.textContent = '✅ CORS動作確認成功！画像が読み込まれました。';
      status.style.color = 'green';
    };

    img.onerror = () => {
      status.textContent = '❌ CORS動作確認失敗。画像が読み込めませんでした。';
      status.style.color = 'red';
    };
  </script>
</body>
</html>
```

`http://localhost:3001`でこのHTMLを開き、画像が表示されることを確認。

---

## 📊 設定完了後の情報まとめ

### 環境変数設定

`.env`ファイルに以下を設定：

```bash
# CloudFront CDN設定
CLOUDFRONT_DOMAIN="https://d2k8x5j9m1n4p7.cloudfront.net"

# S3バケット設定
AWS_S3_BUCKET_NAME="medical-system-profile-photos"
AWS_S3_REGION="ap-northeast-1"

# AWS認証情報（必要に応じて）
AWS_ACCESS_KEY_ID="<IAM Access Key>"
AWS_SECRET_ACCESS_KEY="<IAM Secret Key>"
```

### VoiceDriveチームへの共有情報

以下の情報をSlackまたはメールでVoiceDriveチームに共有：

1. **CloudFront Domain**: `https://d2k8x5j9m1n4p7.cloudfront.net`
2. **テスト用URL**:
   - `https://d2k8x5j9m1n4p7.cloudfront.net/employees/TEST-001.jpg`
   - `https://d2k8x5j9m1n4p7.cloudfront.net/employees/TEST-002.jpg`
   - `https://d2k8x5j9m1n4p7.cloudfront.net/employees/TEST-003.jpg`
3. **URL形式**: `https://d2k8x5j9m1n4p7.cloudfront.net/employees/{staffId}.jpg`

---

## 🔧 トラブルシューティング

### 問題1: 403 Forbiddenエラーが返る

**原因**: S3バケットポリシーが正しく設定されていない

**解決策**:
1. S3バケットポリシーを再確認
2. Distribution IDが正しいか確認
3. CloudFront Distributionのステータスが`Deployed`になっているか確認

### 問題2: CORSエラーが発生する

**原因**: Response Headers Policyが正しく設定されていない

**解決策**:
1. Response Headers PolicyのCORS設定を再確認
2. `Access-Control-Allow-Origin`にVoiceDriveのドメインが含まれているか確認
3. `Origin override`が`Yes`になっているか確認

### 問題3: 画像が古いまま（キャッシュ問題）

**原因**: CloudFrontのキャッシュが残っている

**解決策**:
1. CloudFront Distributionで**Invalidations**を作成
2. Object paths: `/employees/*`
3. **Create invalidation**をクリック
4. 5-10分待つ

---

## 📅 作業スケジュール

| 日付 | 作業内容 | 所要時間 |
|------|---------|---------|
| 10/24（木） | CloudFront Distribution作成 | 30分 |
| 10/24（木） | CORS設定・OAC設定 | 30分 |
| 10/24（木） | S3バケットポリシー更新 | 15分 |
| 10/25（金） | 動作確認テスト | 1時間 |
| 10/25（金） | テスト画像アップロード | 30分 |
| 10/25（金） | VoiceDriveチームへ情報共有 | 15分 |
| **合計** | | **約3時間** |

---

## ✅ チェックリスト

完了したらチェックを入れてください：

- [ ] Origin Access Control (OAC)作成完了
- [ ] Response Headers Policy（CORS）作成完了
- [ ] CloudFront Distribution作成完了
- [ ] S3バケットポリシー更新完了
- [ ] CloudFront経由でのアクセス確認成功
- [ ] S3直接アクセスの拒否確認成功
- [ ] CORS Preflightリクエスト確認成功
- [ ] ブラウザでの画像表示確認成功
- [ ] `.env`ファイルに`CLOUDFRONT_DOMAIN`設定完了
- [ ] VoiceDriveチームへCloudFront Domain共有完了
- [ ] テスト用URL（TEST-001, TEST-002, TEST-003）共有完了

---

## 📞 サポート

設定中に問題が発生した場合：

- **Slack**: `#phase2-photo-integration`
- **担当者**: @medical-infra, @medical-backend-lead

---

## 📎 参考資料

### AWS公式ドキュメント

1. [CloudFront Developer Guide - Origin Access Control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
2. [CloudFront - Response Headers Policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-response-headers.html)
3. [S3 Bucket Policy Examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)

### プロジェクト関連ドキュメント

- [Response_Phase2_ProfilePhoto_Integration_20251021.md](./Response_Phase2_ProfilePhoto_Integration_20251021.md) - 医療システムからの回答書
- [Response_Phase2_VoiceDrive_Reply_20251021.md](./Response_Phase2_VoiceDrive_Reply_20251021.md) - VoiceDriveチームへの返信

---

**作成者**: 医療システムチーム（インフラ担当）
**作成日**: 2025年10月21日
**最終更新**: 2025年10月21日

---

**END OF DOCUMENT**
