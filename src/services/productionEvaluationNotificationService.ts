/**
 * 本番用評価通知送信サービス
 * Phase 2本番環境対応・高負荷対応
 */

import { VoiceDriveNotificationService } from './voiceDriveNotificationService';
import { ProductionBatchNotificationService } from './productionBatchNotificationService';
import { EvaluationNotification } from '../../mcp-shared/interfaces/evaluation-notification.interface';

export interface ProductionEvaluationConfig {
  environment: 'production';
  apiKey: string;
  batchSize: number;
  maxConcurrentBatches: number;
  retryAttempts: number;
  monitoringEnabled: boolean;
  emergencyStopEnabled: boolean;
}

export class ProductionEvaluationNotificationService {
  private static readonly PRODUCTION_CONFIG: ProductionEvaluationConfig = {
    environment: 'production',
    apiKey: process.env.VOICEDRIVE_API_KEY || '',
    batchSize: 100,
    maxConcurrentBatches: 5,
    retryAttempts: 3,
    monitoringEnabled: true,
    emergencyStopEnabled: true
  };

  /**
   * 本番用夏季評価通知一括送信
   */
  static async sendProductionSummerNotifications(
    staffEvaluations: Array<{
      staffId: string;
      staffName: string;
      department: string;
      facilityScore: number;
      facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      corporateScore: number;
      corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    }>
  ) {
    console.log(`🌞 本番夏季評価通知開始: ${staffEvaluations.length}名`);
    
    // 本番環境事前チェック
    const validationResult = await this.validateProductionEnvironment();
    if (!validationResult.valid) {
      throw new Error(`Production validation failed: ${validationResult.errors.join(', ')}`);
    }

    // 評価通知データ生成
    const notifications: EvaluationNotification[] = staffEvaluations.map(staff => ({
      id: `summer_prod_${staff.staffId}_${Date.now()}`,
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
            min: staff.facilityScore + staff.corporateScore + 45,
            max: staff.facilityScore + staff.corporateScore + 55,
            current: staff.facilityScore + staff.corporateScore + 50
          },
          confidence: 'medium'
        }
      },
      message: {
        title: '【本番】夏季評価結果（暫定）のお知らせ',
        body: `上半期の組織貢献度評価結果（暫定）をお知らせします。\n\n施設内評価: ${staff.facilityGrade}グレード（暫定）\n法人内評価: ${staff.corporateGrade}グレード（暫定）\n\n※この評価は暫定です。最終評価は3月の技術評価後に確定します。\n\n異議申し立ては通知から2週間以内にお願いします。`,
        actionText: 'フィードバック面談を予約',
        actionUrl: '/interviews/book/feedback'
      },
      deliveryStatus: 'pending',
      metadata: {
        appealDeadline: this.calculateAppealDeadline(),
        feedbackInterviewAvailable: true,
        productionEnvironment: true
      }
    }));

    // 本番用バッチ送信実行
    return await ProductionBatchNotificationService.sendBulkEvaluationNotifications(
      notifications,
      {
        batchSize: this.PRODUCTION_CONFIG.batchSize,
        delayBetweenBatches: 2500, // 本番は2.5秒間隔
        maxRetries: this.PRODUCTION_CONFIG.retryAttempts,
        enableMonitoring: true,
        enableFailureRecovery: true
      }
    );
  }

  /**
   * 本番用冬季評価通知一括送信
   */
  static async sendProductionWinterNotifications(
    staffEvaluations: Array<{
      staffId: string;
      staffName: string;
      department: string;
      organizationalScore: number;
      facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      cumulativeScore: number;
    }>
  ) {
    console.log(`❄️ 本番冬季評価通知開始: ${staffEvaluations.length}名`);

    const validationResult = await this.validateProductionEnvironment();
    if (!validationResult.valid) {
      throw new Error(`Production validation failed: ${validationResult.errors.join(', ')}`);
    }

    const notifications: EvaluationNotification[] = staffEvaluations.map(staff => ({
      id: `winter_prod_${staff.staffId}_${Date.now()}`,
      staffId: staff.staffId,
      staffName: staff.staffName,
      department: staff.department,
      notificationType: 'winter_provisional',
      evaluationYear: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
      evaluationData: {
        facilityContribution: {
          points: staff.organizationalScore / 2,
          maxPoints: 25,
          grade: staff.facilityGrade
        },
        corporateContribution: {
          points: staff.organizationalScore / 2,
          maxPoints: 25,
          grade: staff.corporateGrade
        },
        provisionalData: {
          estimatedTotalScore: {
            min: staff.cumulativeScore + 40,
            max: staff.cumulativeScore + 60,
            current: staff.cumulativeScore + 50
          },
          confidence: 'high'
        }
      },
      message: {
        title: '【本番】冬季評価結果（暫定）のお知らせ',
        body: `年末の組織貢献度評価結果（暫定）をお知らせします。\n\n施設内評価: ${staff.facilityGrade}グレード（暫定）\n法人内評価: ${staff.corporateGrade}グレード（暫定）\n累積スコア: ${staff.cumulativeScore}点\n\n※最終評価は3月の技術評価完了後に確定します。`,
        actionText: 'フィードバック面談を予約',
        actionUrl: '/interviews/book/feedback'
      },
      deliveryStatus: 'pending',
      metadata: {
        appealDeadline: this.calculateAppealDeadline(),
        feedbackInterviewAvailable: true,
        productionEnvironment: true
      }
    }));

    return await ProductionBatchNotificationService.sendBulkEvaluationNotifications(
      notifications,
      {
        batchSize: this.PRODUCTION_CONFIG.batchSize,
        delayBetweenBatches: 2500,
        maxRetries: this.PRODUCTION_CONFIG.retryAttempts,
        enableMonitoring: true,
        enableFailureRecovery: true
      }
    );
  }

  /**
   * 本番用最終評価通知一括送信
   */
  static async sendProductionFinalNotifications(
    staffEvaluations: Array<{
      staffId: string;
      staffName: string;
      department: string;
      totalScore: number;
      finalGrade: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
      technicalScore: number;
      organizationalScore: number;
      facilityRank: number;
      corporateRank: number;
      totalRank: number;
    }>
  ) {
    console.log(`🎯 本番最終評価通知開始: ${staffEvaluations.length}名`);

    const validationResult = await this.validateProductionEnvironment();
    if (!validationResult.valid) {
      throw new Error(`Production validation failed: ${validationResult.errors.join(', ')}`);
    }

    const notifications: EvaluationNotification[] = staffEvaluations.map(staff => ({
      id: `final_prod_${staff.staffId}_${Date.now()}`,
      staffId: staff.staffId,
      staffName: staff.staffName,
      department: staff.department,
      notificationType: 'annual_final',
      evaluationYear: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
      evaluationData: {
        finalEvaluation: {
          totalPoints: staff.totalScore,
          finalGrade: staff.finalGrade,
          technicalScore: staff.technicalScore,
          organizationalScore: staff.organizationalScore,
          facilityRank: staff.facilityRank,
          corporateRank: staff.corporateRank,
          overallRank: staff.totalRank
        }
      },
      message: {
        title: '【本番】2025年度最終評価結果のお知らせ',
        body: `2025年度の最終評価結果をお知らせします。\n\n最終グレード: ${staff.finalGrade}\n総合得点: ${staff.totalScore}/100点\n技術評価: ${staff.technicalScore}/50点\n組織貢献: ${staff.organizationalScore}/50点\n\n施設内順位: ${staff.facilityRank}位\n法人内順位: ${staff.corporateRank}位\n\n詳細は面談にてご説明いたします。`,
        actionText: '結果説明面談を予約',
        actionUrl: '/interviews/book/final-result'
      },
      deliveryStatus: 'pending',
      metadata: {
        appealDeadline: this.calculateAppealDeadline(),
        feedbackInterviewAvailable: true,
        finalEvaluation: true,
        productionEnvironment: true
      }
    }));

    return await ProductionBatchNotificationService.sendBulkEvaluationNotifications(
      notifications,
      {
        batchSize: this.PRODUCTION_CONFIG.batchSize,
        delayBetweenBatches: 2000, // 最終評価は2秒間隔
        maxRetries: this.PRODUCTION_CONFIG.retryAttempts,
        enableMonitoring: true,
        enableFailureRecovery: true
      }
    );
  }

  /**
   * 本番環境検証
   */
  private static async validateProductionEnvironment(): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // API Key検証
    if (!this.PRODUCTION_CONFIG.apiKey) {
      errors.push('VOICEDRIVE_API_KEY not configured');
    }

    // データベース接続検証
    if (!process.env.DATABASE_URL) {
      errors.push('DATABASE_URL not configured');
    }

    // 監視システム接続検証
    if (this.PRODUCTION_CONFIG.monitoringEnabled && !process.env.MONITORING_ENABLED) {
      errors.push('Monitoring system not properly configured');
    }

    // VoiceDrive API接続テスト
    try {
      const testResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://api.voicedrive.medical.local'}/health`, {
        headers: {
          'Authorization': `Bearer ${this.PRODUCTION_CONFIG.apiKey}`
        }
      });

      if (!testResponse.ok) {
        errors.push('VoiceDrive API connection test failed');
      }
    } catch (error) {
      errors.push(`VoiceDrive API unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 異議申し立て期限計算
   */
  private static calculateAppealDeadline(): string {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14); // 本番は2週間
    return deadline.toISOString();
  }

  /**
   * 緊急停止チェック
   */
  static async checkEmergencyStop(): Promise<boolean> {
    try {
      // 本番では実際の緊急停止フラグチェック
      const emergencyFlag = process.env.EMERGENCY_STOP_ENABLED === 'true';
      
      if (emergencyFlag) {
        console.error('🚨 EMERGENCY STOP ACTIVATED - All notifications halted');
        // 緊急アラート送信
        await this.sendEmergencyAlert('Notification system emergency stop activated');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Emergency stop check failed:', error);
      return false;
    }
  }

  /**
   * 緊急アラート送信
   */
  private static async sendEmergencyAlert(message: string): Promise<void> {
    console.error(`🚨 EMERGENCY ALERT: ${message}`);
    
    // 本番では実際のアラートシステムに送信
    // await alertService.sendCriticalAlert({
    //   level: 'critical',
    //   service: 'evaluation-notification',
    //   message,
    //   timestamp: new Date().toISOString()
    // });
  }
}