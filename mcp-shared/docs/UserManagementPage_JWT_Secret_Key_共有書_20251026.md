# UserManagementPage JWT Secret Key 共有書

**文書番号**: SEC-2025-1026-001
**作成日**: 2025年10月26日
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**重要度**: 🔴 **機密情報 - 安全な経路で共有**

---

## 📋 JWT認証の概要

VoiceDriveのUserManagementPageと医療システムAPI（`/api/v2/employees`）の認証にJWT（JSON Web Token）を使用します。

### 認証フロー

```
1. VoiceDrive → 医療システム: JWTトークン取得リクエスト
2. 医療システム → VoiceDrive: JWTトークン発行（有効期限: 1時間）
3. VoiceDrive → 医療システム: API呼び出し（Bearer Token）
4. 医療システム: JWT検証 → レスポンス返却
```

---

## 🔑 JWT Secret Key

### 開発環境用 Secret Key

**環境**: ローカル開発環境、統合テスト環境

**Secret Key**:
```
dev_jwt_secret_medical_voicedrive_integration_2025_phase26
```

**使用方法**:
- 医療システム側: `.env`ファイルの`JWT_SECRET`に設定
- VoiceDrive側: `.env`ファイルの`MEDICAL_JWT_SECRET`に設定

**有効期限**: なし（開発環境専用）

---

### ステージング環境用 Secret Key

**環境**: ステージング環境（将来実装時）

**Secret Key**: （ステージング環境構築時に生成）

**生成コマンド**:
```bash
openssl rand -base64 32
```

---

### 本番環境用 Secret Key

**環境**: 本番環境（Lightsail）

**Secret Key**: 🔴 **本番環境構築時に別途発行**

**生成コマンド**:
```bash
openssl rand -base64 64
```

**セキュリティ要件**:
- 64バイト以上のランダム文字列
- 定期的なローテーション（6ヶ月ごと）
- 安全な保管（AWS Secrets Manager等）

---

## 🔐 JWTトークン仕様

### アクセストークン

**ペイロード**:
```json
{
  "userId": "admin-001",
  "employeeId": "EMP-2025-001",
  "permissionLevel": 99,
  "iat": 1730000000,
  "exp": 1730003600
}
```

**有効期限**: 1時間

**発行条件**:
- `permissionLevel` = 99（システム管理者のみ）

---

### リフレッシュトークン

**ペイロード**:
```json
{
  "userId": "admin-001",
  "type": "refresh",
  "iat": 1730000000,
  "exp": 1730604800
}
```

**有効期限**: 7日間

**使用方法**: アクセストークンの有効期限切れ時に再発行

---

## 🛠️ 実装例

### 医療システム側（JWT発行）

```typescript
// src/app/api/auth/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateJWT } from '@/lib/middleware/jwt-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { employeeId, password } = await request.json();

  // 認証チェック（実装は省略）
  const employee = await prisma.employee.findUnique({
    where: { employeeCode: employeeId },
    select: {
      id: true,
      employeeCode: true,
      permissionLevel: true
    }
  });

  if (!employee || employee.permissionLevel !== 99) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // JWTトークン発行
  const accessToken = generateJWT({
    userId: employee.id,
    employeeId: employee.employeeCode,
    permissionLevel: employee.permissionLevel
  }, '1h');

  const refreshToken = generateJWT({
    userId: employee.id,
    employeeId: employee.employeeCode,
    permissionLevel: employee.permissionLevel
  }, '7d');

  return NextResponse.json({
    accessToken,
    refreshToken,
    expiresIn: 3600
  });
}
```

---

### VoiceDrive側（JWT使用）

```typescript
// src/services/MedicalSystemClient.ts
import axios from 'axios';

export class MedicalSystemClient {
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  static async getAccessToken(): Promise<string> {
    // トークンが有効期限内なら再利用
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // トークン取得
    const response = await axios.post(
      `${process.env.MEDICAL_API_BASE_URL}/api/auth/token`,
      {
        employeeId: process.env.MEDICAL_ADMIN_EMPLOYEE_ID,
        password: process.env.MEDICAL_ADMIN_PASSWORD
      }
    );

    this.accessToken = response.data.accessToken;
    this.tokenExpiry = Date.now() + response.data.expiresIn * 1000;

    return this.accessToken;
  }

  static async getAllEmployees(params?: any) {
    const token = await this.getAccessToken();

    const response = await axios.get(
      `${process.env.MEDICAL_API_BASE_URL}/api/v2/employees`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      }
    );

    return response.data;
  }
}
```

---

## 🔧 環境変数設定

### 医療システム側（.env）

```bash
# JWT Secret Key
JWT_SECRET="dev_jwt_secret_medical_voicedrive_integration_2025_phase26"

# VoiceDrive Webhook設定
VOICEDRIVE_WEBHOOK_ENDPOINT="http://localhost:5173/api/webhooks/medical-system/employee"
VOICEDRIVE_WEBHOOK_SECRET="shared_webhook_secret_phase25"
```

---

### VoiceDrive側（.env）

```bash
# 医療システムAPI設定
MEDICAL_API_BASE_URL="http://localhost:3000"
MEDICAL_JWT_SECRET="dev_jwt_secret_medical_voicedrive_integration_2025_phase26"

# 医療システム管理者認証情報（JWT取得用）
MEDICAL_ADMIN_EMPLOYEE_ID="ADMIN-001"
MEDICAL_ADMIN_PASSWORD="admin_password_dev"

# Webhook受信設定
MEDICAL_WEBHOOK_SECRET="shared_webhook_secret_phase25"
```

---

## ⚠️ セキュリティ注意事項

### 開発環境
- ✅ Gitにコミットしない（`.gitignore`に`.env`を追加）
- ✅ 開発チーム内でのみ共有（Slackダイレクトメッセージ等）
- ✅ 本番環境とは異なるSecret Keyを使用

### ステージング環境
- ✅ Secret Keyを開発環境と分離
- ✅ アクセス権限を制限
- ✅ ログに平文Secret Keyを出力しない

### 本番環境
- 🔴 **強力なSecret Keyを使用**（64バイト以上）
- 🔴 **AWS Secrets Manager等で管理**
- 🔴 **定期的なローテーション**（6ヶ月ごと）
- 🔴 **アクセスログの監視**
- 🔴 **異常なトークン発行を検知**

---

## 📅 Secret Key共有スケジュール

| 日付 | 作業内容 | 担当 | 状態 |
|------|---------|------|------|
| 10/26 | 開発環境用Secret Key共有（本文書） | 医療システム | ✅ 完了 |
| 10/28 | VoiceDrive側に環境変数設定確認 | VoiceDrive | ⏳ 待機中 |
| 11/8 | JWT認証統合テスト | 両チーム | ⏳ 待機中 |
| TBD | 本番環境用Secret Key発行（Lightsail構築後） | 医療システム | ⏳ 未定 |

---

## 🔗 関連ドキュメント

1. [UserManagementPage_医療システム確認結果_20251026.md](./UserManagementPage_医療システム確認結果_20251026.md) - 医療システム確認結果
2. [UserManagementPage暫定マスターリスト_20251026.md](./UserManagementPage暫定マスターリスト_20251026.md) - データ項目仕様
3. [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - マスタープラン

---

## 📞 問い合わせ先

**医療システムチーム**:
- JWT Secret Key再発行依頼
- トークン発行エラー調査

**VoiceDriveチーム**:
- API呼び出しエラー調査
- JWT検証エラー調査

---

**文書終了**

最終更新: 2025年10月26日
バージョン: 1.0
機密レベル: 🔴 **厳秘**（開発チーム内のみ共有）
次回レビュー: ステージング環境構築時
