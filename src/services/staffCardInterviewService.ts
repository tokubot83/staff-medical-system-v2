/**
 * 職員カルテ面談・指導タブ専用サービス
 * 面談管理システムとの連動とデータ統合を管理
 */

import { InterviewReservationService, ReservationFilters } from './interviewReservationService';
import { InterviewType, InterviewCategory, InterviewStatus } from '@/types/interview';

// 面談カテゴリマッピング
export const INTERVIEW_CATEGORY_MAPPING = {
  // 定期面談（3種類）
  regular: ['new_employee_monthly', 'regular_annual', 'management_biannual'],
  // 特別面談（3種類）
  special: ['return_to_work', 'incident_followup', 'exit_interview'],
  // サポート面談（4種類）
  support: ['feedback', 'career_support', 'workplace_support', 'individual_consultation']
} as const;

export type InterviewTabCategory = keyof typeof INTERVIEW_CATEGORY_MAPPING;

// 面談サマリーデータ型定義
export interface InterviewSummaryData {
  criticalStatus: {
    overdueInterviews: {
      count: number;
      oldestDays: number;
      urgentType: string;
    };
    upcomingMandatory: {
      dueDate?: Date;
      interviewType?: string;
      daysUntilDue?: number;
    };
  };
  lastInterview: {
    date?: Date;
    type?: InterviewType;
    typeLabel?: string;
    interviewer?: string;
    hrFeedback?: string;
    actionItems?: string[];
    followupRequired?: boolean;
    followupDate?: Date;
  };
  categoryStats: {
    regular: { completed: number; scheduled: number; overdue: number };
    special: { completed: number; scheduled: number; overdue: number };
    support: { completed: number; scheduled: number; overdue: number };
  };
  urgencyAlerts: string[];
}

// カテゴリ別サマリーデータ型定義
export interface CategorySummaryData {
  // 定期面談専用
  regular?: {
    monthlyCompletionRate: number;
    annualCompletionRate: number;
    responseCompletionRate: number;
    concernResponses: string[];
    nextMandatoryDue?: {
      type: string;
      dueDate: Date;
      daysOverdue: number;
    };
  };
  // 特別面談専用
  special?: {
    pendingIncidentFollowups: number;
    returnToWorkScheduled?: Date;
    exitInterviewScheduled?: Date;
  };
  // サポート面談専用
  support?: {
    feedbackEffectiveness: {
      improvementScore: number;
      beforeScore: number;
      afterScore: number;
    };
    careerSupportProgress: {
      skillDevelopmentProgress: number;
      promotionReadiness: number;
    };
  };
}

// 面談回答推移データ
export interface ResponseTrendData {
  questionId: string;
  questionText: string;
  responseHistory: Array<{
    date: Date;
    score: number;
    comment?: string;
    interviewId: string;
  }>;
}

export class StaffCardInterviewService {
  
  /**
   * 特定職員の全面談データを取得
   */
  static async getAllInterviews(staffId: string) {
    const allInterviews = await InterviewReservationService.getReservations({
      staffId
    });
    return allInterviews.sort((a, b) => 
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
  }

  /**
   * カテゴリ別面談データ取得
   */
  static async getInterviewsByCategory(
    staffId: string, 
    category: InterviewTabCategory
  ) {
    const categoryTypes = INTERVIEW_CATEGORY_MAPPING[category];
    const allInterviews = await this.getAllInterviews(staffId);
    
    return allInterviews.filter(interview => 
      categoryTypes.includes(interview.type as any)
    );
  }

  /**
   * 面談・指導タブ概要用サマリーデータ生成
   */
  static async generateSummaryData(staffId: string): Promise<InterviewSummaryData> {
    const allInterviews = await this.getAllInterviews(staffId);
    
    // 緊急ステータス分析
    const criticalStatus = this.analyzeCriticalStatus(allInterviews, staffId);
    
    // 最新面談情報
    const lastInterview = this.getLatestInterview(allInterviews);
    
    // カテゴリ別統計
    const categoryStats = this.generateCategoryStats(allInterviews);
    
    // 緊急アラート
    const urgencyAlerts = this.checkUrgencyAlerts(allInterviews, staffId);
    
    return {
      criticalStatus,
      lastInterview,
      categoryStats,
      urgencyAlerts
    };
  }

  /**
   * カテゴリ専用サマリーデータ生成
   */
  static async generateCategorySummaryData(
    staffId: string,
    category: InterviewTabCategory
  ): Promise<CategorySummaryData> {
    const categoryInterviews = await this.getInterviewsByCategory(staffId, category);
    
    switch (category) {
      case 'regular':
        return { regular: await this.generateRegularSummary(categoryInterviews, staffId) };
      
      case 'special':
        return { special: await this.generateSpecialSummary(categoryInterviews, staffId) };
      
      case 'support':
        return { support: await this.generateSupportSummary(categoryInterviews, staffId) };
      
      default:
        return {};
    }
  }

  /**
   * 面談シート回答推移分析
   */
  static async analyzeResponseTrends(
    staffId: string, 
    questionId: string
  ): Promise<ResponseTrendData | null> {
    const allInterviews = await this.getAllInterviews(staffId);
    
    const responsesWithData = allInterviews
      .filter(interview => 
        interview.status === 'completed' && 
        interview.responses?.[questionId]
      )
      .map(interview => ({
        date: new Date(interview.conductedAt || interview.scheduledDate),
        score: interview.responses![questionId].score,
        comment: interview.responses![questionId].comment,
        interviewId: interview.id
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (responsesWithData.length === 0) {
      return null;
    }

    // 質問テキストを取得（最新の回答から）
    const latestResponse = responsesWithData[responsesWithData.length - 1];
    const questionText = await this.getQuestionText(questionId, latestResponse.interviewId);

    return {
      questionId,
      questionText: questionText || `質問ID: ${questionId}`,
      responseHistory: responsesWithData
    };
  }

  /**
   * 面談完了時の職員カルテ自動更新
   */
  static async handleInterviewCompletion(completedInterview: any) {
    const staffId = completedInterview.employeeId;
    
    try {
      // 面談履歴の更新
      await this.updateInterviewHistory(staffId, {
        id: completedInterview.id,
        date: new Date(completedInterview.conductedAt),
        type: completedInterview.interviewType,
        category: this.getInterviewCategory(completedInterview.interviewType),
        interviewer: completedInterview.interviewerName,
        hrFeedback: completedInterview.outcomeSummary,
        actionItems: completedInterview.outcomeActionItems || [],
        followupRequired: completedInterview.outcomeFollowupRequired || false,
        followupDate: completedInterview.outcomeFollowupDate ? 
          new Date(completedInterview.outcomeFollowupDate) : undefined,
        responses: completedInterview.responses || {}
      });

      // サマリーエリアの緊急度更新
      await this.updateUrgencyStatus(staffId);

      // 関連タブへの影響反映
      if (completedInterview.interviewType === 'feedback') {
        // 評価タブの「面談実施済み」フラグ更新
        // await EvaluationService.markInterviewCompleted(staffId);
        console.log(`Feedback interview completed for staff ${staffId}`);
      }

      console.log(`Interview completion handled successfully for staff ${staffId}`);
    } catch (error) {
      console.error('Failed to handle interview completion:', error);
      throw error;
    }
  }

  // === プライベートメソッド ===

  private static analyzeCriticalStatus(interviews: any[], staffId: string) {
    const now = new Date();
    const overdueInterviews = interviews.filter(interview => {
      if (interview.status !== 'scheduled') return false;
      const scheduledDate = new Date(interview.scheduledDate);
      return scheduledDate < now;
    });

    let oldestDays = 0;
    let urgentType = '';
    
    if (overdueInterviews.length > 0) {
      const oldest = overdueInterviews.reduce((oldest, current) => {
        const oldestDate = new Date(oldest.scheduledDate);
        const currentDate = new Date(current.scheduledDate);
        return currentDate < oldestDate ? current : oldest;
      });
      
      oldestDays = Math.floor((now.getTime() - new Date(oldest.scheduledDate).getTime()) / (1000 * 60 * 60 * 24));
      urgentType = this.getInterviewTypeLabel(oldest.type);
    }

    // 次回必須面談の算出（簡易版）
    const upcomingMandatory = this.calculateUpcomingMandatory(interviews, staffId);

    return {
      overdueInterviews: {
        count: overdueInterviews.length,
        oldestDays,
        urgentType
      },
      upcomingMandatory
    };
  }

  private static getLatestInterview(interviews: any[]) {
    const completedInterviews = interviews.filter(i => i.status === 'completed');
    
    if (completedInterviews.length === 0) {
      return {};
    }

    const latest = completedInterviews[0]; // 既にソート済み
    
    return {
      date: new Date(latest.conductedAt || latest.scheduledDate),
      type: latest.type,
      typeLabel: this.getInterviewTypeLabel(latest.type),
      interviewer: latest.interviewerName,
      hrFeedback: latest.outcomeSummary,
      actionItems: latest.outcomeActionItems || [],
      followupRequired: latest.outcomeFollowupRequired || false,
      followupDate: latest.outcomeFollowupDate ? new Date(latest.outcomeFollowupDate) : undefined
    };
  }

  private static generateCategoryStats(interviews: any[]) {
    const stats = {
      regular: { completed: 0, scheduled: 0, overdue: 0 },
      special: { completed: 0, scheduled: 0, overdue: 0 },
      support: { completed: 0, scheduled: 0, overdue: 0 }
    };

    const now = new Date();

    interviews.forEach(interview => {
      const category = this.getInterviewCategory(interview.type);
      
      if (interview.status === 'completed') {
        stats[category].completed++;
      } else if (interview.status === 'scheduled') {
        const scheduledDate = new Date(interview.scheduledDate);
        if (scheduledDate < now) {
          stats[category].overdue++;
        } else {
          stats[category].scheduled++;
        }
      }
    });

    return stats;
  }

  private static checkUrgencyAlerts(interviews: any[], staffId: string): string[] {
    const alerts: string[] = [];
    const now = new Date();

    // インシデント後面談の確認
    const pendingIncidents = interviews.filter(i => 
      i.type === 'incident_followup' && i.status === 'scheduled'
    );
    
    if (pendingIncidents.length > 0) {
      alerts.push(`インシデント後面談 ${pendingIncidents.length}件 要実施`);
    }

    // 期限切れ面談の確認
    const overdueCount = interviews.filter(i => 
      i.status === 'scheduled' && new Date(i.scheduledDate) < now
    ).length;
    
    if (overdueCount > 0) {
      alerts.push(`期限切れ面談 ${overdueCount}件`);
    }

    return alerts;
  }

  private static async generateRegularSummary(interviews: any[], staffId: string) {
    // 月次面談と年次面談の実施率を計算
    const monthlyInterviews = interviews.filter(i => i.type === 'new_employee_monthly');
    const annualInterviews = interviews.filter(i => i.type === 'regular_annual');
    
    const monthlyCompleted = monthlyInterviews.filter(i => i.status === 'completed');
    const annualCompleted = annualInterviews.filter(i => i.status === 'completed');
    
    // 今年度の目標実施回数（簡易計算）
    const monthlyTarget = 12; // 年間12回の月次面談
    const annualTarget = 1;   // 年間1回の年次面談
    
    const monthlyCompletionRate = Math.floor((monthlyCompleted.length / monthlyTarget) * 100);
    const annualCompletionRate = Math.floor((annualCompleted.length / annualTarget) * 100);
    
    // 面談シート回答完了率（サンプル）
    const responseCompletionRate = 92;
    
    // 懸念回答（サンプル）
    const concernResponses = ['時間管理', 'チームワーク'];
    
    // 次回必須面談（簡易版）
    const nextMandatory = this.calculateNextMandatoryInterview(staffId);
    
    return {
      monthlyCompletionRate,
      annualCompletionRate,
      responseCompletionRate,
      concernResponses,
      nextMandatoryDue: nextMandatory
    };
  }

  private static async generateSpecialSummary(interviews: any[], staffId: string) {
    const incidentFollowups = interviews.filter(i => 
      i.type === 'incident_followup' && i.status === 'scheduled'
    );
    
    const returnToWork = interviews.find(i => 
      i.type === 'return_to_work' && i.status === 'scheduled'
    );
    
    const exitInterview = interviews.find(i => 
      i.type === 'exit_interview' && i.status === 'scheduled'
    );
    
    return {
      pendingIncidentFollowups: incidentFollowups.length,
      returnToWorkScheduled: returnToWork ? new Date(returnToWork.scheduledDate) : undefined,
      exitInterviewScheduled: exitInterview ? new Date(exitInterview.scheduledDate) : undefined
    };
  }

  private static async generateSupportSummary(interviews: any[], staffId: string) {
    // フィードバック面談の効果分析（サンプル）
    const feedbackInterviews = interviews.filter(i => 
      i.type === 'feedback' && i.status === 'completed'
    );
    
    // サンプルデータ（実際は評価システムと連携）
    const improvementScore = 13; // +13点の改善
    const beforeScore = 75;
    const afterScore = 88;
    
    // キャリア支援進捗（サンプル）
    const skillDevelopmentProgress = 78;
    const promotionReadiness = 65;
    
    return {
      feedbackEffectiveness: {
        improvementScore,
        beforeScore,
        afterScore
      },
      careerSupportProgress: {
        skillDevelopmentProgress,
        promotionReadiness
      }
    };
  }

  private static getInterviewCategory(interviewType: InterviewType): InterviewTabCategory {
    for (const [category, types] of Object.entries(INTERVIEW_CATEGORY_MAPPING)) {
      if (types.includes(interviewType as any)) {
        return category as InterviewTabCategory;
      }
    }
    return 'support'; // デフォルト
  }

  private static getInterviewTypeLabel(interviewType: InterviewType): string {
    const labels: Record<InterviewType, string> = {
      new_employee_monthly: '新入職員月次面談',
      regular_annual: '一般職員年次面談',
      management_biannual: '管理職半年面談',
      return_to_work: '復職面談',
      incident_followup: 'インシデント後面談',
      exit_interview: '退職面談',
      feedback: 'フィードバック面談',
      career_support: 'キャリア支援面談',
      workplace_support: '職場環境支援面談',
      individual_consultation: '個別相談面談'
    };
    
    return labels[interviewType] || interviewType;
  }

  private static calculateUpcomingMandatory(interviews: any[], staffId: string) {
    // 簡易版：次回必須面談の計算ロジック
    // 実際の実装では職員の入職日、最終面談日等から算出
    return {
      dueDate: new Date('2025-03-15'),
      interviewType: '年次面談',
      daysUntilDue: 30
    };
  }

  private static calculateNextMandatoryInterview(staffId: string) {
    // 簡易版：次回必須面談の詳細計算
    return {
      type: '月次面談',
      dueDate: new Date('2025-03-01'),
      daysOverdue: 0
    };
  }

  private static async updateInterviewHistory(staffId: string, interviewData: any) {
    // 実際の実装では職員カルテDBの面談履歴を更新
    console.log(`Updating interview history for staff ${staffId}:`, interviewData);
  }

  private static async updateUrgencyStatus(staffId: string) {
    // 緊急度ステータスの再計算と更新
    console.log(`Updating urgency status for staff ${staffId}`);
  }

  private static async getQuestionText(questionId: string, interviewId: string): Promise<string | null> {
    // 面談シートから質問テキストを取得
    // 実際の実装では面談バンクシステムと連携
    return `質問テキスト（ID: ${questionId}）`;
  }
}