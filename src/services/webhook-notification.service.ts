/**
 * VoiceDrive向けWebhook通知サービス
 * 職員情報の変更をリアルタイムで通知
 * 作成日: 2025年9月26日
 */

import { StaffUpdateEvent } from '../types/facility-authority';

export class WebhookNotificationService {
  private webhookUrl: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // ミリ秒
  private timeout: number = 5000; // 5秒タイムアウト

  constructor() {
    this.webhookUrl = process.env.VOICEDRIVE_WEBHOOK_URL ||
      'https://voicedrive.example.com/api/webhook/staff-update';
  }

  /**
   * 職員更新イベントを送信
   */
  async sendStaffUpdateEvent(event: StaffUpdateEvent): Promise<boolean> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.maxRetries) {
      try {
        const response = await this.sendWebhook(event);

        if (response.ok) {
          await this.logSuccess(event);
          return true;
        }

        // HTTPステータスが4xxの場合はリトライしない
        if (response.status >= 400 && response.status < 500) {
          await this.logError(event, `Client error: ${response.status}`);
          return false;
        }

        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
      }

      attempt++;
      if (attempt < this.maxRetries) {
        await this.delay(this.retryDelay * attempt); // 指数バックオフ
      }
    }

    // 全てのリトライが失敗した場合
    await this.logError(event, lastError?.message || 'Unknown error');
    return false;
  }

  /**
   * Webhookを送信
   */
  private async sendWebhook(event: StaffUpdateEvent): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WEBHOOK_API_KEY}`,
          'X-Webhook-Version': '1.0',
          'X-Event-Type': event.eventType
        },
        body: JSON.stringify(event),
        signal: controller.signal
      });

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * バッチ更新イベントを送信
   */
  async sendBatchUpdateEvents(events: StaffUpdateEvent[]): Promise<{
    successful: string[];
    failed: string[];
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as string[]
    };

    // 並列処理（最大10件同時）
    const batchSize = 10;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      const promises = batch.map(event =>
        this.sendStaffUpdateEvent(event)
          .then(success => {
            if (success) {
              results.successful.push(event.data.staffId);
            } else {
              results.failed.push(event.data.staffId);
            }
          })
      );

      await Promise.all(promises);
    }

    return results;
  }

  /**
   * 職員作成イベント
   */
  async notifyStaffCreated(
    staffId: string,
    facilityId: string,
    position?: string,
    accountLevel?: number
  ): Promise<boolean> {
    const event: StaffUpdateEvent = {
      eventType: 'staff.created',
      timestamp: new Date(),
      data: {
        staffId,
        facilityId,
        changes: {
          position,
          accountLevel,
          effectiveDate: new Date()
        }
      }
    };

    return this.sendStaffUpdateEvent(event);
  }

  /**
   * 職員更新イベント
   */
  async notifyStaffUpdated(
    staffId: string,
    facilityId: string,
    changes: {
      position?: string;
      accountLevel?: number;
      effectiveDate?: Date;
    },
    previousState?: {
      facilityId?: string;
      position?: string;
      accountLevel?: number;
    }
  ): Promise<boolean> {
    const event: StaffUpdateEvent = {
      eventType: 'staff.updated',
      timestamp: new Date(),
      data: {
        staffId,
        facilityId,
        changes,
        previousState
      }
    };

    return this.sendStaffUpdateEvent(event);
  }

  /**
   * 施設間異動イベント
   */
  async notifyStaffTransferred(
    staffId: string,
    fromFacility: string,
    toFacility: string,
    newPosition?: string,
    newLevel?: number
  ): Promise<boolean> {
    const event: StaffUpdateEvent = {
      eventType: 'staff.transferred',
      timestamp: new Date(),
      data: {
        staffId,
        facilityId: toFacility,
        changes: {
          position: newPosition,
          accountLevel: newLevel,
          effectiveDate: new Date()
        },
        previousState: {
          facilityId: fromFacility
        }
      }
    };

    return this.sendStaffUpdateEvent(event);
  }

  /**
   * 職員削除イベント
   */
  async notifyStaffDeleted(
    staffId: string,
    facilityId: string
  ): Promise<boolean> {
    const event: StaffUpdateEvent = {
      eventType: 'staff.deleted',
      timestamp: new Date(),
      data: {
        staffId,
        facilityId
      }
    };

    return this.sendStaffUpdateEvent(event);
  }

  /**
   * 遅延処理
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 成功ログ記録
   */
  private async logSuccess(event: StaffUpdateEvent): Promise<void> {
    console.log('Webhook sent successfully:', {
      eventType: event.eventType,
      staffId: event.data.staffId,
      timestamp: event.timestamp
    });

    // TODO: データベースに成功ログを記録
  }

  /**
   * エラーログ記録
   */
  private async logError(event: StaffUpdateEvent, error: string): Promise<void> {
    console.error('Webhook failed:', {
      eventType: event.eventType,
      staffId: event.data.staffId,
      error,
      timestamp: event.timestamp
    });

    // TODO: データベースにエラーログを記録
    // TODO: 管理者への通知
  }

  /**
   * Webhookエンドポイントのヘルスチェック
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.webhookUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.WEBHOOK_API_KEY}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Webhook health check failed:', error);
      return false;
    }
  }
}

// シングルトンインスタンス
export const webhookNotificationService = new WebhookNotificationService();