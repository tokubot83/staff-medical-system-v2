/**
 * 本番用評価通知バッチ送信サービス
 * 大量通知・障害復旧・性能最適化対応
 */

import { VoiceDriveNotificationService } from './voiceDriveNotificationService';
import { EvaluationNotification } from '../../mcp-shared/interfaces/evaluation-notification.interface';

export interface ProductionBatchConfig {
  batchSize: number;
  delayBetweenBatches: number; // ms
  maxRetries: number;
  retryDelay: number; // ms
  enableMonitoring: boolean;
  enableFailureRecovery: boolean;
}

export class ProductionBatchNotificationService {
  private static readonly DEFAULT_CONFIG: ProductionBatchConfig = {
    batchSize: 50,
    delayBetweenBatches: 2000,
    maxRetries: 3,
    retryDelay: 5000,
    enableMonitoring: true,
    enableFailureRecovery: true
  };

  /**
   * 本番用大量評価通知送信
   */
  static async sendBulkEvaluationNotifications(
    notifications: EvaluationNotification[],
    config: Partial<ProductionBatchConfig> = {}
  ): Promise<{
    success: boolean;
    totalSent: number;
    failed: number;
    results: Array<{ batchId: string; success: boolean; count: number; error?: string }>;
  }> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const results = [];
    let totalSent = 0;
    let failed = 0;

    console.log(`🚀 本番大量通知開始: ${notifications.length}件`);
    
    // バッチ分割
    const batches = this.createBatches(notifications, finalConfig.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchId = `BATCH_${Date.now()}_${i + 1}`;
      
      try {
        console.log(`📦 バッチ ${i + 1}/${batches.length} 送信中... (${batch.length}件)`);
        
        // バッチ送信
        const result = await this.sendBatchWithRetry(batch, batchId, finalConfig);
        
        if (result.success) {
          totalSent += batch.length;
          console.log(`✅ バッチ ${i + 1} 成功: ${batch.length}件`);
        } else {
          failed += batch.length;
          console.error(`❌ バッチ ${i + 1} 失敗: ${result.error}`);
        }
        
        results.push(result);
        
        // バッチ間の待機
        if (i < batches.length - 1) {
          await this.delay(finalConfig.delayBetweenBatches);
        }
        
      } catch (error) {
        console.error(`🚨 バッチ ${i + 1} 例外エラー:`, error);
        failed += batch.length;
        results.push({
          batchId,
          success: false,
          count: batch.length,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const finalResult = {
      success: failed === 0,
      totalSent,
      failed,
      results
    };

    // 結果ログ
    console.log(`🎯 本番大量通知完了:`, finalResult);
    
    // 監視データ送信
    if (finalConfig.enableMonitoring) {
      await this.sendMonitoringData(finalResult);
    }

    return finalResult;
  }

  /**
   * リトライ付きバッチ送信
   */
  private static async sendBatchWithRetry(
    batch: EvaluationNotification[],
    batchId: string,
    config: ProductionBatchConfig
  ): Promise<{ batchId: string; success: boolean; count: number; error?: string }> {
    let lastError: string | undefined;
    
    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        // VoiceDrive通知サービスで送信
        const response = await VoiceDriveNotificationService.sendEvaluationNotification({
          staffIds: batch.map(n => n.staffId),
          notificationType: batch[0]?.notificationType || 'summer_provisional',
          evaluationYear: new Date().getFullYear(),
          sendOptions: {
            immediate: true,
            batchSize: batch.length
          }
        });

        if (response.success) {
          return {
            batchId,
            success: true,
            count: batch.length
          };
        } else {
          lastError = `API Error: ${response.message}`;
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`⚠️ バッチ ${batchId} 試行 ${attempt} 失敗: ${lastError}`);
        
        if (attempt < config.maxRetries) {
          await this.delay(config.retryDelay);
        }
      }
    }

    return {
      batchId,
      success: false,
      count: batch.length,
      error: lastError
    };
  }

  /**
   * バッチ分割
   */
  private static createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    return batches;
  }

  /**
   * 待機
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 監視データ送信
   */
  private static async sendMonitoringData(result: any): Promise<void> {
    try {
      // 本番監視システムにメトリクスを送信
      const metrics = {
        timestamp: new Date().toISOString(),
        service: 'evaluation-notification',
        operation: 'bulk_send',
        total_notifications: result.totalSent + result.failed,
        successful_notifications: result.totalSent,
        failed_notifications: result.failed,
        success_rate: result.totalSent / (result.totalSent + result.failed) * 100,
        batch_count: result.results.length
      };

      console.log('📊 監視メトリクス:', metrics);
      
      // 実際の監視システム連携はここで実装
      // await monitoringService.sendMetrics(metrics);
      
    } catch (error) {
      console.warn('⚠️ 監視データ送信失敗:', error);
    }
  }

  /**
   * 夏季評価通知の本番一括送信
   */
  static async sendProductionSummerNotifications(
    staffList: Array<{
      staffId: string;
      staffName: string;
      department: string;
      facilityScore: number;
      corporateScore: number;
      facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    }>
  ) {
    console.log(`🌞 本番夏季評価通知開始: ${staffList.length}名`);
    
    const notifications: EvaluationNotification[] = staffList.map(staff => ({
      id: `summer_${staff.staffId}_${Date.now()}`,
      staffId: staff.staffId,
      staffName: staff.staffName,
      department: staff.department,
      notificationType: 'summer_provisional',
      evaluationYear: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
      evaluationData: {
        facilityContribution: {
          points: staff.facilityScore,
          maxPoints: 12.5,
          grade: staff.facilityGrade
        },
        corporateContribution: {
          points: staff.corporateScore,
          maxPoints: 12.5,
          grade: staff.corporateGrade
        },
        provisionalData: {
          estimatedTotalScore: {
            min: staff.facilityScore + staff.corporateScore + 40,
            max: staff.facilityScore + staff.corporateScore + 50,
            current: staff.facilityScore + staff.corporateScore + 45
          },
          confidence: 'medium'
        }
      },
      message: {
        title: '夏季評価結果（暫定）のお知らせ',
        body: `上半期の組織貢献度評価結果（暫定）をお知らせします。\n\n施設内評価: ${staff.facilityGrade}グレード（暫定）\n法人内評価: ${staff.corporateGrade}グレード（暫定）\n\n※この評価は暫定です。最終評価は3月の技術評価後に確定します。`,
        actionText: '面談を予約',
        actionUrl: '/interviews/book/feedback'
      },
      deliveryStatus: 'pending',
      metadata: {
        appealDeadline: this.calculateAppealDeadline(),
        feedbackInterviewAvailable: true
      }
    }));

    return this.sendBulkEvaluationNotifications(notifications, {
      batchSize: 100, // 夏季は大量のため100件バッチ
      delayBetweenBatches: 1500,
      enableMonitoring: true
    });
  }

  /**
   * 異議申し立て期限計算
   */
  private static calculateAppealDeadline(): string {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14); // 2週間後
    return deadline.toISOString();
  }
}