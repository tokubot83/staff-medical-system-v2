/**
 * VoiceDrive評価通知サービス
 * 評価結果をVoiceDriveに送信する機能
 */

import { 
  EvaluationNotification, 
  EvaluationNotificationRequest, 
  EvaluationNotificationResponse 
} from '../../mcp-shared/interfaces/evaluation-notification.interface';

export class VoiceDriveNotificationService {
  private static readonly API_ENDPOINT = '/api/voicedrive/notifications';
  private static readonly MCP_SHARED_ENDPOINT = '/api/mcp-shared/evaluation-notifications';
  
  /**
   * 評価通知をVoiceDriveに送信
   */
  static async sendEvaluationNotification(
    request: EvaluationNotificationRequest
  ): Promise<EvaluationNotificationResponse> {
    try {
      // 1. 通知データを準備
      const notifications = await this.prepareNotifications(request);
      
      // 2. mcp-shared経由でVoiceDriveに送信
      const response = await fetch(this.MCP_SHARED_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source-System': 'medical-staff-system',
          'X-Target-System': 'voicedrive',
          'X-API-Version': 'v3'
        },
        body: JSON.stringify({
          notifications,
          sendOptions: request.sendOptions
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // 3. 送信ログを記録
      await this.logNotificationActivity(notifications, result);
      
      return result;
      
    } catch (error) {
      console.error('VoiceDrive通知送信エラー:', error);
      throw error;
    }
  }
  
  /**
   * 夏季組織貢献度評価の通知送信
   */
  static async sendSummerEvaluationNotifications(
    staffEvaluations: Array<{
      staffId: string;
      staffName: string;
      department: string;
      facilityPoints: number;
      facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      corporatePoints: number;
      corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      ranking?: { facility: number; corporate: number; total: number };
    }>
  ): Promise<EvaluationNotificationResponse> {
    const request: EvaluationNotificationRequest = {
      staffIds: staffEvaluations.map(e => e.staffId),
      notificationType: 'summer_provisional',
      evaluationYear: new Date().getFullYear(),
      messageTemplate: {
        useDefaultTemplate: true
      },
      sendOptions: {
        immediate: false,
        batchSize: 50
      }
    };
    
    return this.sendEvaluationNotification(request);
  }
  
  /**
   * 冬季組織貢献度評価の通知送信
   */
  static async sendWinterEvaluationNotifications(
    staffEvaluations: Array<{
      staffId: string;
      staffName: string;
      department: string;
      facilityPoints: number;
      facilityGrade: 'S' | 'A' | 'B' | 'C' | 'D';
      corporatePoints: number;
      corporateGrade: 'S' | 'A' | 'B' | 'C' | 'D';
    }>
  ): Promise<EvaluationNotificationResponse> {
    const request: EvaluationNotificationRequest = {
      staffIds: staffEvaluations.map(e => e.staffId),
      notificationType: 'winter_provisional',
      evaluationYear: new Date().getFullYear(),
      messageTemplate: {
        useDefaultTemplate: true
      },
      sendOptions: {
        immediate: false,
        batchSize: 50
      }
    };
    
    return this.sendEvaluationNotification(request);
  }
  
  /**
   * 年間総合評価の通知送信
   */
  static async sendFinalEvaluationNotifications(
    staffEvaluations: Array<{
      staffId: string;
      staffName: string;
      department: string;
      totalPoints: number;
      finalGrade: string;
      technicalScore: number;
      comments?: string;
    }>
  ): Promise<EvaluationNotificationResponse> {
    const request: EvaluationNotificationRequest = {
      staffIds: staffEvaluations.map(e => e.staffId),
      notificationType: 'annual_final',
      evaluationYear: new Date().getFullYear(),
      messageTemplate: {
        useDefaultTemplate: true
      },
      sendOptions: {
        immediate: true, // 最終評価は即座に送信
        batchSize: 30
      }
    };
    
    return this.sendEvaluationNotification(request);
  }
  
  /**
   * 通知データを準備
   */
  private static async prepareNotifications(
    request: EvaluationNotificationRequest
  ): Promise<EvaluationNotification[]> {
    const notifications: EvaluationNotification[] = [];
    
    for (const staffId of request.staffIds) {
      // スタッフ情報と評価データを取得
      const staffInfo = await this.getStaffInfo(staffId);
      const evaluationData = await this.getEvaluationData(staffId, request.notificationType);
      
      if (!staffInfo || !evaluationData) {
        console.warn(`スタッフ情報または評価データが見つかりません: ${staffId}`);
        continue;
      }
      
      const notification: EvaluationNotification = {
        id: this.generateNotificationId(),
        staffId: staffInfo.id,
        staffName: staffInfo.name,
        department: staffInfo.department,
        notificationType: request.notificationType,
        evaluationYear: request.evaluationYear,
        createdAt: new Date().toISOString(),
        scheduledSendAt: request.scheduledSendAt,
        evaluationData,
        message: this.generateMessage(request.notificationType, evaluationData, request.messageTemplate),
        deliveryStatus: 'pending',
        metadata: {
          appealDeadline: this.calculateAppealDeadline(),
          feedbackInterviewAvailable: true
        }
      };
      
      notifications.push(notification);
    }
    
    return notifications;
  }
  
  /**
   * メッセージを生成
   */
  private static generateMessage(
    type: EvaluationNotification['notificationType'],
    evaluationData: any,
    template?: any
  ): EvaluationNotification['message'] {
    if (template?.useDefaultTemplate === false) {
      return {
        title: template.customTitle || '評価結果のお知らせ',
        body: template.customBody || '評価結果をご確認ください。',
        actionText: '詳細確認',
        actionUrl: '/interviews/book/feedback'
      };
    }
    
    // デフォルトテンプレート
    const templates = {
      summer_provisional: {
        title: '夏季評価結果（暫定）のお知らせ',
        body: `上半期の組織貢献度評価結果（暫定）をお知らせします。\n\n施設内評価: ${evaluationData.facilityContribution?.grade}グレード（暫定）\n法人内評価: ${evaluationData.corporateContribution?.grade}グレード（暫定）\n総合評価: ${evaluationData.provisionalData?.estimatedTotalScore?.current}点相当（暫定）\n\n※この評価は暫定です。最終評価は3月の技術評価後に確定します。\n\nご不明な点がございましたら、フィードバック面談をご予約ください。`,
        actionText: '面談を予約',
        actionUrl: '/interviews/book/feedback'
      },
      winter_provisional: {
        title: '冬季評価結果（暫定）のお知らせ',
        body: `年間の組織貢献度評価結果（暫定）をお知らせします。\n\n施設内評価: ${evaluationData.facilityContribution?.grade}グレード（暫定）\n法人内評価: ${evaluationData.corporateContribution?.grade}グレード（暫定）\n総合評価: ${evaluationData.provisionalData?.estimatedTotalScore?.current}点相当（暫定）\n\n※組織貢献度50点は確定しましたが、最終評価は3月の技術評価後に確定します。\n\nご不明な点がございましたら、フィードバック面談をご予約ください。`,
        actionText: '面談を予約',
        actionUrl: '/interviews/book/feedback'
      },
      annual_final: {
        title: '年間総合評価結果（確定）のお知らせ',
        body: `${evaluationData.finalEvaluation?.evaluationYear || new Date().getFullYear()}年度の最終評価結果（確定）をお知らせします。\n\n総合得点: ${evaluationData.finalEvaluation?.totalPoints}点（確定）\n最終グレード: ${evaluationData.finalEvaluation?.finalGrade}（確定）\n\n組織貢献度: ${(evaluationData.facilityContribution?.points || 0) + (evaluationData.corporateContribution?.points || 0)}点\n技術評価: ${evaluationData.finalEvaluation?.technicalScore}点\n\nお疲れ様でした。来年度もよろしくお願いします。`,
        actionText: '面談を予約',
        actionUrl: '/interviews/book/feedback'
      }
    };
    
    return templates[type];
  }
  
  /**
   * 通知IDを生成
   */
  private static generateNotificationId(): string {
    return `eval_notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * 異議申し立て期限を計算
   */
  private static calculateAppealDeadline(): string {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14); // 2週間後
    return deadline.toISOString();
  }
  
  /**
   * スタッフ情報を取得
   */
  private static async getStaffInfo(staffId: string): Promise<any> {
    // 実装: スタッフマスタからデータ取得
    return {
      id: staffId,
      name: 'サンプル太郎',
      department: 'サンプル部門'
    };
  }
  
  /**
   * 評価データを取得
   */
  private static async getEvaluationData(staffId: string, type: string): Promise<any> {
    // 実装: 評価データベースからデータ取得
    return {};
  }
  
  /**
   * 送信ログを記録
   */
  private static async logNotificationActivity(
    notifications: EvaluationNotification[],
    result: EvaluationNotificationResponse
  ): Promise<void> {
    console.log('VoiceDrive通知送信完了:', {
      count: notifications.length,
      success: result.success,
      timestamp: new Date().toISOString()
    });
  }
}