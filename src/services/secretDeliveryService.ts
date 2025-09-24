/**
 * 秘密情報配信サービス
 * お知らせ配信機能を活用した安全な秘密情報共有
 */

import * as crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { sendSlackNotification } from '@/lib/slack';
import { auditLog } from '@/lib/audit';

interface SecretDelivery {
  deliveryId: string;
  recipient: string;
  environment: string;
  secrets: EncryptedSecret[];
  oneTimeToken: string;
  encryptionKeyId: string;
  expiresAt: Date;
  requiresMFA: boolean;
  notification?: {
    email?: string;
    slack?: string;
  };
}

interface EncryptedSecret {
  id: string;
  encrypted: string;
  iv: string;
  authTag: string;
  metadata: {
    name: string;
    type: string;
  };
}

interface RetrieveRequest {
  deliveryId: string;
  mfaCode?: string;
  clientFingerprint: string;
}

export class SecretDeliveryService {
  private readonly encryptionKeys: Map<string, string>;

  constructor() {
    this.encryptionKeys = new Map([
      ['production-2025', process.env.SECRET_DELIVERY_KEY || crypto.randomBytes(32).toString('hex')]
    ]);
  }

  /**
   * 秘密情報の配信
   */
  async deliverSecrets(delivery: SecretDelivery): Promise<{ success: boolean; accessUrl: string }> {
    try {
      // 配信データの保存
      await prisma.secretDelivery.create({
        data: {
          deliveryId: delivery.deliveryId,
          recipient: delivery.recipient,
          environment: delivery.environment,
          secretsData: JSON.stringify(delivery.secrets),
          oneTimeTokenHash: this.hashToken(delivery.oneTimeToken),
          encryptionKeyId: delivery.encryptionKeyId,
          expiresAt: delivery.expiresAt,
          requiresMFA: delivery.requiresMFA,
          retrieved: false,
          createdAt: new Date()
        }
      });

      // 通知の送信
      const accessUrl = `https://secure.medical-system.kosei-kai.jp/secrets/${delivery.deliveryId}`;

      // Email通知
      if (delivery.notification?.email) {
        await this.sendEmailNotification(
          delivery.notification.email,
          delivery.deliveryId,
          accessUrl,
          delivery.expiresAt
        );
      }

      // Slack通知
      if (delivery.notification?.slack) {
        await this.sendSlackNotification(
          delivery.notification.slack,
          delivery.deliveryId,
          accessUrl,
          delivery.expiresAt
        );
      }

      // 監査ログ
      await auditLog('SECRET_DELIVERED', {
        deliveryId: delivery.deliveryId,
        recipient: delivery.recipient,
        environment: delivery.environment,
        secretCount: delivery.secrets.length,
        expiresAt: delivery.expiresAt
      });

      // 自動削除のスケジューリング
      this.scheduleAutoDeletion(delivery.deliveryId, delivery.expiresAt);

      return {
        success: true,
        accessUrl
      };
    } catch (error) {
      console.error('Failed to deliver secrets:', error);
      throw error;
    }
  }

  /**
   * 秘密情報の取得
   */
  async retrieveSecrets(
    request: RetrieveRequest,
    oneTimeToken: string
  ): Promise<{ secrets: EncryptedSecret[]; encryptionKey: string }> {
    try {
      // 配信データの取得
      const delivery = await prisma.secretDelivery.findUnique({
        where: { deliveryId: request.deliveryId }
      });

      if (!delivery) {
        throw new Error('Delivery not found');
      }

      // 有効期限チェック
      if (new Date() > delivery.expiresAt) {
        throw new Error('Delivery has expired');
      }

      // 既に取得済みチェック
      if (delivery.retrieved) {
        throw new Error('Secrets have already been retrieved');
      }

      // トークン検証
      if (!this.verifyToken(oneTimeToken, delivery.oneTimeTokenHash)) {
        throw new Error('Invalid one-time token');
      }

      // MFA検証（必要な場合）
      if (delivery.requiresMFA && !request.mfaCode) {
        throw new Error('MFA code required');
      }

      if (delivery.requiresMFA) {
        const mfaValid = await this.verifyMFA(delivery.recipient, request.mfaCode!);
        if (!mfaValid) {
          throw new Error('Invalid MFA code');
        }
      }

      // 秘密情報の取得
      const secrets = JSON.parse(delivery.secretsData) as EncryptedSecret[];
      const encryptionKey = this.encryptionKeys.get(delivery.encryptionKeyId);

      if (!encryptionKey) {
        throw new Error('Encryption key not found');
      }

      // 取得済みフラグを設定
      await prisma.secretDelivery.update({
        where: { deliveryId: request.deliveryId },
        data: {
          retrieved: true,
          retrievedAt: new Date(),
          retrievedBy: request.clientFingerprint
        }
      });

      // 監査ログ
      await auditLog('SECRET_RETRIEVED', {
        deliveryId: request.deliveryId,
        recipient: delivery.recipient,
        clientFingerprint: request.clientFingerprint
      });

      // 即座に削除
      await this.deleteDelivery(request.deliveryId);

      return {
        secrets,
        encryptionKey
      };
    } catch (error) {
      console.error('Failed to retrieve secrets:', error);
      throw error;
    }
  }

  /**
   * 配信ステータスの確認
   */
  async checkStatus(deliveryId: string): Promise<any> {
    try {
      const delivery = await prisma.secretDelivery.findUnique({
        where: { deliveryId },
        select: {
          deliveryId: true,
          recipient: true,
          environment: true,
          createdAt: true,
          expiresAt: true,
          requiresMFA: true,
          retrieved: true,
          retrievedAt: true,
          retrievedBy: true
        }
      });

      if (!delivery) {
        throw new Error('Delivery not found');
      }

      return delivery;
    } catch (error) {
      console.error('Failed to check status:', error);
      throw error;
    }
  }

  /**
   * トークンのハッシュ化
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * トークンの検証
   */
  private verifyToken(token: string, hash: string): boolean {
    return this.hashToken(token) === hash;
  }

  /**
   * MFA検証
   */
  private async verifyMFA(recipient: string, code: string): Promise<boolean> {
    // TODO: 実際のMFA検証ロジックを実装
    // 現在は開発用にダミー実装
    return code === '123456' || code.length === 6;
  }

  /**
   * Email通知の送信
   */
  private async sendEmailNotification(
    email: string,
    deliveryId: string,
    accessUrl: string,
    expiresAt: Date
  ): Promise<void> {
    const subject = '【重要】本番環境秘密情報の配信通知';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">🔒 秘密情報配信通知</h2>

        <p>VoiceDriveチーム様</p>

        <p>医療システムチームより本番環境の秘密情報が配信されました。</p>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>配信ID:</strong> ${deliveryId}</p>
          <p><strong>有効期限:</strong> ${expiresAt.toLocaleString('ja-JP')}</p>
          <p><strong>取得URL:</strong></p>
          <p style="word-break: break-all;">
            <a href="${accessUrl}" style="color: #1976d2;">${accessUrl}</a>
          </p>
        </div>

        <h3>取得方法</h3>
        <ol>
          <li>上記URLにアクセス</li>
          <li>MFA認証を完了</li>
          <li>ワンタイムトークンを入力</li>
          <li>秘密情報をダウンロード</li>
        </ol>

        <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #e65100; margin: 0;">
            <strong>⚠️ 注意事項</strong><br>
            • このURLは1回のみアクセス可能です<br>
            • ${Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}時間後に自動削除されます
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

        <p style="color: #666; font-size: 12px;">
          このメールは医療法人厚生会システムより自動送信されています。<br>
          お問い合わせ: support@medical-system.kosei-kai.jp
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject,
      html
    });
  }

  /**
   * Slack通知の送信
   */
  private async sendSlackNotification(
    channel: string,
    deliveryId: string,
    accessUrl: string,
    expiresAt: Date
  ): Promise<void> {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🔒 秘密情報配信通知'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '医療システムチームより本番環境の秘密情報が配信されました。'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*配信ID:*\n${deliveryId}`
          },
          {
            type: 'mrkdwn',
            text: `*有効期限:*\n${expiresAt.toLocaleString('ja-JP')}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*取得URL:*\n${accessUrl}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '⚠️ このURLは1回のみアクセス可能です'
          }
        ]
      }
    ];

    await sendSlackNotification({
      channel,
      blocks,
      text: `秘密情報配信通知: ${deliveryId}`
    });
  }

  /**
   * 自動削除のスケジューリング
   */
  private scheduleAutoDeletion(deliveryId: string, expiresAt: Date): void {
    const delay = expiresAt.getTime() - Date.now();

    if (delay > 0) {
      setTimeout(async () => {
        await this.deleteDelivery(deliveryId);
      }, delay);
    }
  }

  /**
   * 配信データの削除
   */
  private async deleteDelivery(deliveryId: string): Promise<void> {
    try {
      await prisma.secretDelivery.delete({
        where: { deliveryId }
      });

      await auditLog('SECRET_DELETED', {
        deliveryId,
        deletedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to delete delivery:', error);
    }
  }

  /**
   * 配信履歴の取得
   */
  async getDeliveryHistory(
    recipient?: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const where = recipient ? { recipient } : {};

      const deliveries = await prisma.secretDelivery.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          deliveryId: true,
          recipient: true,
          environment: true,
          createdAt: true,
          expiresAt: true,
          retrieved: true,
          retrievedAt: true
        }
      });

      return deliveries;
    } catch (error) {
      console.error('Failed to get delivery history:', error);
      throw error;
    }
  }
}

// シングルトンインスタンス
export const secretDeliveryService = new SecretDeliveryService();