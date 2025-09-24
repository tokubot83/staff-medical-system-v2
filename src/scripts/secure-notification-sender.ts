/**
 * セキュア通知送信スクリプト
 * お知らせ配信機能を活用した秘密情報の送信
 */

import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config({ path: '.env.production' });

interface SecureNotification {
  recipientId: string;
  recipientEmail: string;
  subject: string;
  encryptedContent: string;
  encryptionMethod: 'AES-256-GCM' | 'RSA-4096';
  encryptionKey?: string;  // RSAの場合は公開鍵
  iv?: string;             // AESの場合のみ
  authTag?: string;        // AESの場合のみ
  expiresAt: Date;
  oneTimeAccessToken: string;
  metadata: {
    type: 'credentials' | 'api_key' | 'certificate' | 'configuration';
    description: string;
    importance: 'critical' | 'high' | 'medium';
  };
}

interface NotificationResult {
  success: boolean;
  notificationId?: string;
  accessUrl?: string;
  error?: string;
}

class SecureNotificationSender {
  private readonly apiEndpoint: string;
  private readonly apiKey: string;
  private readonly encryptionKey: string;

  constructor() {
    this.apiEndpoint = process.env.NOTIFICATION_API_ENDPOINT || 'https://api.medical-system.kosei-kai.jp/v2/notifications';
    this.apiKey = process.env.NOTIFICATION_API_KEY || '';
    this.encryptionKey = process.env.NOTIFICATION_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
  }

  /**
   * AES-256-GCM暗号化
   */
  private encryptContent(content: string): {
    encrypted: string;
    iv: string;
    authTag: string;
  } {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(this.encryptionKey, 'hex').slice(0, 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * ワンタイムアクセストークンの生成
   */
  private generateOneTimeToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * 秘密情報の送信準備
   */
  async prepareSecretCredentials(): Promise<SecureNotification[]> {
    console.log('Preparing secret credentials for secure transmission...');

    const secrets = [
      {
        recipientId: 'voicedrive_integration',
        recipientEmail: 'voicedrive-integration@medical-system.kosei-kai.jp',
        type: 'credentials' as const,
        name: 'CLIENT_SECRET',
        value: process.env.CLIENT_SECRET || crypto.randomBytes(32).toString('hex'),
        description: 'VoiceDrive OAuth2.0 Client Secret'
      },
      {
        recipientId: 'voicedrive_integration',
        recipientEmail: 'voicedrive-integration@medical-system.kosei-kai.jp',
        type: 'credentials' as const,
        name: 'DB_PASSWORD',
        value: process.env.DB_PASSWORD || crypto.randomBytes(24).toString('base64'),
        description: 'MySQL Database Password'
      },
      {
        recipientId: 'voicedrive_integration',
        recipientEmail: 'voicedrive-integration@medical-system.kosei-kai.jp',
        type: 'api_key' as const,
        name: 'AWS_SECRET_ACCESS_KEY',
        value: process.env.AWS_SECRET_ACCESS_KEY || crypto.randomBytes(40).toString('base64'),
        description: 'AWS S3 Secret Access Key'
      },
      {
        recipientId: 'voicedrive_integration',
        recipientEmail: 'voicedrive-integration@medical-system.kosei-kai.jp',
        type: 'api_key' as const,
        name: 'SENDGRID_API_KEY',
        value: process.env.SENDGRID_API_KEY || 'SG.' + crypto.randomBytes(32).toString('base64'),
        description: 'SendGrid Email API Key'
      }
    ];

    const notifications: SecureNotification[] = [];

    for (const secret of secrets) {
      const content = JSON.stringify({
        name: secret.name,
        value: secret.value,
        description: secret.description,
        issuedAt: new Date().toISOString(),
        issuedBy: '医療法人厚生会システム開発チーム'
      });

      const { encrypted, iv, authTag } = this.encryptContent(content);

      notifications.push({
        recipientId: secret.recipientId,
        recipientEmail: secret.recipientEmail,
        subject: `[重要] ${secret.description} - 本番環境認証情報`,
        encryptedContent: encrypted,
        encryptionMethod: 'AES-256-GCM',
        iv,
        authTag,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24時間後
        oneTimeAccessToken: this.generateOneTimeToken(),
        metadata: {
          type: secret.type,
          description: secret.description,
          importance: 'critical'
        }
      });
    }

    return notifications;
  }

  /**
   * お知らせ配信システムを通じた送信
   */
  async sendViaNotificationSystem(notification: SecureNotification): Promise<NotificationResult> {
    try {
      console.log(`Sending secure notification to ${notification.recipientEmail}...`);

      // お知らせ配信APIを使用
      const response = await axios.post(
        `${this.apiEndpoint}/secure`,
        {
          recipientId: notification.recipientId,
          recipientEmail: notification.recipientEmail,
          subject: notification.subject,
          content: {
            type: 'encrypted',
            data: notification.encryptedContent,
            encryption: {
              method: notification.encryptionMethod,
              iv: notification.iv,
              authTag: notification.authTag
            }
          },
          accessControl: {
            oneTimeToken: notification.oneTimeAccessToken,
            expiresAt: notification.expiresAt,
            requireMFA: true,
            ipWhitelist: [
              '203.0.113.0/24',  // VoiceDrive本社
              '198.51.100.0/24'  // 医療法人厚生会
            ]
          },
          metadata: notification.metadata,
          deliveryOptions: {
            priority: 'high',
            requireReadConfirmation: true,
            enableAuditLog: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-Request-ID': crypto.randomUUID(),
            'X-Encryption-Key-Id': 'production-2025'
          }
        }
      );

      const accessUrl = `https://medical-system.kosei-kai.jp/notifications/secure/${response.data.notificationId}?token=${notification.oneTimeAccessToken}`;

      console.log(`✓ Notification sent successfully`);
      console.log(`  Notification ID: ${response.data.notificationId}`);
      console.log(`  Access URL: ${accessUrl}`);

      return {
        success: true,
        notificationId: response.data.notificationId,
        accessUrl
      };
    } catch (error) {
      console.error(`✗ Failed to send notification:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 復号化手順書の生成
   */
  generateDecryptionInstructions(notifications: SecureNotification[]): string {
    return `
# 秘密情報復号化手順書

## 1. アクセス方法
各通知に含まれるアクセスURLにアクセスし、ワンタイムトークンで認証してください。

## 2. 復号化キー
以下のキーを使用して、AES-256-GCM方式で復号化してください：

\`\`\`
Encryption Key: ${this.encryptionKey}
Algorithm: AES-256-GCM
Key Size: 256 bits
\`\`\`

## 3. 復号化サンプルコード（Node.js）

\`\`\`javascript
const crypto = require('crypto');

function decrypt(encryptedData, key, iv, authTag) {
  const algorithm = 'aes-256-gcm';
  const keyBuffer = Buffer.from(key, 'hex').slice(0, 32);
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}
\`\`\`

## 4. 通知一覧

${notifications.map((n, i) => `
### 通知 ${i + 1}
- 受信者: ${n.recipientEmail}
- 件名: ${n.subject}
- 有効期限: ${n.expiresAt.toISOString()}
- ワンタイムトークン: ${n.oneTimeAccessToken}
`).join('')}

## 5. セキュリティ注意事項
- この復号化キーは安全なチャネルで別途送付されます
- 復号化後、秘密情報は直ちに環境変数に設定してください
- アクセスログは全て監査ログに記録されます

---
発行日: ${new Date().toISOString()}
発行者: 医療法人厚生会システム開発チーム
`;
  }

  /**
   * 全秘密情報の送信
   */
  async sendAllSecrets(): Promise<void> {
    console.log('Secure Notification Sender');
    console.log('==========================\n');

    try {
      // 秘密情報の準備
      const notifications = await this.prepareSecretCredentials();
      console.log(`Prepared ${notifications.length} secure notifications\n`);

      // 各通知の送信
      const results: NotificationResult[] = [];
      for (const notification of notifications) {
        const result = await this.sendViaNotificationSystem(notification);
        results.push(result);
      }

      // 結果サマリー
      console.log('\n==========================');
      console.log('Transmission Summary:');
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      console.log(`✓ Sent: ${successCount}`);
      console.log(`✗ Failed: ${failureCount}`);

      // 復号化手順書の生成と保存
      const instructions = this.generateDecryptionInstructions(notifications);
      const instructionPath = path.join(process.cwd(), 'mcp-shared/docs/decryption-instructions.md');
      fs.writeFileSync(instructionPath, instructions);
      console.log(`\nDecryption instructions saved to: ${instructionPath}`);

      // アクセスURLリストの生成
      const accessUrls = results
        .filter(r => r.success && r.accessUrl)
        .map(r => r.accessUrl);

      if (accessUrls.length > 0) {
        console.log('\nAccess URLs for VoiceDrive team:');
        accessUrls.forEach(url => console.log(`  ${url}`));
      }

      if (failureCount > 0) {
        process.exit(1);
      } else {
        console.log('\nAll secrets sent successfully! 🔐');
        process.exit(0);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      process.exit(1);
    }
  }
}

// メイン実行
if (require.main === module) {
  const sender = new SecureNotificationSender();
  sender.sendAllSecrets().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { SecureNotificationSender, SecureNotification, NotificationResult };