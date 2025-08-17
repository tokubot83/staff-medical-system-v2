/**
 * 統一面談バンクサービス
 * 定期、サポート、特別面談の3つのバンクシステムを統合管理
 */

import { 
  BankGenerationParams, 
  GeneratedBankSheet, 
  StaffBankProfile, 
  InterviewType,
  BankInterviewResult
} from '../types';

import { generateInterviewSheet } from './generator';
import { generateSupportInterviewFromVoiceDrive, SupportGenerationParams } from './support-generator';
import { generateSpecialInterview, SpecialGenerationParams, SpecialInterviewType } from './special-generator';
import { InterviewBankService } from './bank-service';
import { VoiceDriveInterviewRequest } from '@/services/voicedriveIntegrationService';

// 統一面談パラメータ
export interface UnifiedInterviewParams {
  bankType: 'regular' | 'support' | 'special';
  staffProfile: StaffBankProfile;
  baseParams: BankGenerationParams;
  
  // 定期面談用
  regularParams?: {
    focusAreas?: string[];
    customSections?: any[];
  };
  
  // サポート面談用
  supportParams?: {
    voiceDriveRequest?: VoiceDriveInterviewRequest;
    category: string;
    urgency: 'urgent' | 'high' | 'medium' | 'low';
    consultationTopic: string;
    consultationDetails: string;
  };
  
  // 特別面談用
  specialParams?: {
    specialType: SpecialInterviewType;
    subType?: string;
    reason?: string;
    confidentialLevel?: 'normal' | 'high' | 'critical';
  };
}

// 面談バンク統計
export interface BankStatistics {
  regular: {
    total: number;
    completed: number;
    pending: number;
    averageCompletionRate: number;
  };
  support: {
    total: number;
    byCategory: Record<string, number>;
    averageResponseTime: number;
    resolutionRate: number;
  };
  special: {
    total: number;
    byType: Record<SpecialInterviewType, number>;
    criticalCases: number;
    followUpRequired: number;
  };
  overall: {
    totalInterviews: number;
    activeInterviews: number;
    completionRate: number;
    averageDuration: number;
  };
}

/**
 * 統一面談バンクサービスクラス
 */
export class UnifiedBankService {
  private static instance: UnifiedBankService;
  private interviewService: InterviewBankService;
  
  private constructor() {
    this.interviewService = InterviewBankService.getInstance();
  }
  
  /**
   * インスタンス取得
   */
  static getInstance(): UnifiedBankService {
    if (!UnifiedBankService.instance) {
      UnifiedBankService.instance = new UnifiedBankService();
    }
    return UnifiedBankService.instance;
  }
  
  /**
   * 面談タイプを自動判定
   */
  detectBankType(context: {
    source?: string;
    urgency?: string;
    specialEvent?: string;
    voiceDriveRequest?: boolean;
  }): 'regular' | 'support' | 'special' {
    // VoiceDriveからの申込はサポート面談
    if (context.voiceDriveRequest || context.source === 'voicedrive') {
      return 'support';
    }
    
    // 特別なイベントがある場合は特別面談
    if (context.specialEvent) {
      const specialEvents = ['exit', 'transfer', 'return', 'promotion', 'disciplinary'];
      if (specialEvents.includes(context.specialEvent)) {
        return 'special';
      }
    }
    
    // 緊急度が高い場合はサポート面談
    if (context.urgency === 'urgent' || context.urgency === 'high') {
      return 'support';
    }
    
    // デフォルトは定期面談
    return 'regular';
  }
  
  /**
   * 統一面談生成
   */
  async generateUnifiedInterview(params: UnifiedInterviewParams): Promise<{
    sheet: GeneratedBankSheet;
    interviewId: string;
    bankType: string;
  }> {
    let sheet: GeneratedBankSheet;
    
    // バンクタイプ別の生成処理
    switch (params.bankType) {
      case 'regular':
        sheet = this.generateRegularInterview(params);
        break;
        
      case 'support':
        sheet = this.generateSupportInterview(params);
        break;
        
      case 'special':
        sheet = this.generateSpecialInterview(params);
        break;
        
      default:
        throw new Error(`Unknown bank type: ${params.bankType}`);
    }
    
    // データベースに保存
    const { interviewId } = await this.interviewService.generateAndStartInterview(
      params.staffProfile,
      {
        ...params.baseParams,
        bankType: params.bankType,
        metadata: {
          ...params.baseParams.metadata,
          unifiedParams: params
        }
      }
    );
    
    return {
      sheet,
      interviewId,
      bankType: params.bankType
    };
  }
  
  /**
   * 定期面談生成
   */
  private generateRegularInterview(params: UnifiedInterviewParams): GeneratedBankSheet {
    return generateInterviewSheet({
      staff: params.staffProfile,
      duration: params.baseParams.duration || 30,
      interviewType: params.baseParams.interviewType || 'regular',
      interviewDate: params.baseParams.interviewDate || new Date(),
      interviewerId: params.baseParams.interviewerId,
      interviewerName: params.baseParams.interviewerName,
      focusAreas: params.regularParams?.focusAreas,
      customSections: params.regularParams?.customSections
    });
  }
  
  /**
   * サポート面談生成
   */
  private generateSupportInterview(params: UnifiedInterviewParams): GeneratedBankSheet {
    if (!params.supportParams) {
      throw new Error('Support params required for support interview');
    }
    
    // VoiceDriveリクエストがある場合
    if (params.supportParams.voiceDriveRequest) {
      return generateSupportInterviewFromVoiceDrive(
        params.supportParams.voiceDriveRequest,
        params.staffProfile,
        params.baseParams.duration || 30
      );
    }
    
    // 手動作成の場合
    const supportGenParams: SupportGenerationParams = {
      interviewType: 'support',
      category: params.supportParams.category,
      urgency: params.supportParams.urgency,
      consultationTopic: params.supportParams.consultationTopic,
      consultationDetails: params.supportParams.consultationDetails,
      duration: params.baseParams.duration || 30,
      interviewDate: params.baseParams.interviewDate || new Date()
    };
    
    return generateSupportInterview(supportGenParams, params.staffProfile);
  }
  
  /**
   * 特別面談生成
   */
  private generateSpecialInterview(params: UnifiedInterviewParams): GeneratedBankSheet {
    if (!params.specialParams) {
      throw new Error('Special params required for special interview');
    }
    
    const specialGenParams: SpecialGenerationParams = {
      interviewType: 'special',
      specialType: params.specialParams.specialType,
      subType: params.specialParams.subType,
      reason: params.specialParams.reason,
      confidentialLevel: params.specialParams.confidentialLevel,
      duration: params.baseParams.duration,
      interviewDate: params.baseParams.interviewDate || new Date()
    };
    
    return generateSpecialInterview(specialGenParams, params.staffProfile);
  }
  
  /**
   * 面談履歴の統合検索
   */
  async searchInterviews(criteria: {
    staffId?: string;
    bankType?: 'regular' | 'support' | 'special';
    dateFrom?: Date;
    dateTo?: Date;
    status?: 'pending' | 'in_progress' | 'completed';
    keyword?: string;
    department?: string;
    urgency?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    results: BankInterviewResult[];
    total: number;
    facets: {
      byBankType: Record<string, number>;
      byStatus: Record<string, number>;
      byDepartment: Record<string, number>;
    };
  }> {
    // 全面談履歴を取得（実際はデータベースクエリ）
    const allResults = await this.interviewService.getStaffInterviewHistory(
      criteria.staffId || '',
      { limit: 1000 }
    );
    
    // フィルタリング
    let filtered = allResults.results;
    
    if (criteria.bankType) {
      filtered = filtered.filter(r => 
        r.generationParams?.bankType === criteria.bankType
      );
    }
    
    if (criteria.status) {
      filtered = filtered.filter(r => r.status === criteria.status);
    }
    
    if (criteria.dateFrom) {
      filtered = filtered.filter(r => 
        new Date(r.conductedAt) >= criteria.dateFrom!
      );
    }
    
    if (criteria.dateTo) {
      filtered = filtered.filter(r => 
        new Date(r.conductedAt) <= criteria.dateTo!
      );
    }
    
    if (criteria.department) {
      filtered = filtered.filter(r => 
        r.staffProfile.department === criteria.department
      );
    }
    
    if (criteria.keyword) {
      const keyword = criteria.keyword.toLowerCase();
      filtered = filtered.filter(r => 
        r.summary?.toLowerCase().includes(keyword) ||
        r.staffProfile.name.toLowerCase().includes(keyword) ||
        r.generationParams?.consultationTopic?.toLowerCase().includes(keyword)
      );
    }
    
    // ファセット集計
    const facets = {
      byBankType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byDepartment: {} as Record<string, number>
    };
    
    filtered.forEach(result => {
      // バンクタイプ別
      const bankType = result.generationParams?.bankType || 'regular';
      facets.byBankType[bankType] = (facets.byBankType[bankType] || 0) + 1;
      
      // ステータス別
      facets.byStatus[result.status] = (facets.byStatus[result.status] || 0) + 1;
      
      // 部署別
      const dept = result.staffProfile.department;
      facets.byDepartment[dept] = (facets.byDepartment[dept] || 0) + 1;
    });
    
    // ページネーション
    const start = criteria.offset || 0;
    const limit = criteria.limit || 20;
    const paged = filtered.slice(start, start + limit);
    
    return {
      results: paged,
      total: filtered.length,
      facets
    };
  }
  
  /**
   * 統合統計取得
   */
  /**
   * 統計情報取得（エイリアス）
   */
  async getStatistics(period?: { start?: Date; end?: Date } = {}): Promise<BankStatistics> {
    return this.getUnifiedStatistics(period as any);
  }
  
  async getUnifiedStatistics(period?: { start: Date; end: Date }): Promise<BankStatistics> {
    const stats = await this.interviewService.getStatistics({
      dateFrom: period?.start,
      dateTo: period?.end
    });
    
    // 全面談を取得して詳細集計
    const allInterviews = await this.searchInterviews({
      dateFrom: period?.start,
      dateTo: period?.end,
      limit: 10000
    });
    
    // バンクタイプ別集計
    const regularInterviews = allInterviews.results.filter(r => 
      r.generationParams?.bankType === 'regular'
    );
    const supportInterviews = allInterviews.results.filter(r => 
      r.generationParams?.bankType === 'support'
    );
    const specialInterviews = allInterviews.results.filter(r => 
      r.generationParams?.bankType === 'special'
    );
    
    // サポート面談のカテゴリ別集計
    const supportByCategory: Record<string, number> = {};
    supportInterviews.forEach(interview => {
      const category = interview.generationParams?.category || 'other';
      supportByCategory[category] = (supportByCategory[category] || 0) + 1;
    });
    
    // 特別面談のタイプ別集計
    const specialByType: Record<string, number> = {};
    specialInterviews.forEach(interview => {
      const specialType = interview.generationParams?.specialType || 'other';
      specialByType[specialType] = (specialByType[specialType] || 0) + 1;
    });
    
    // 解決率の計算
    const resolvedSupport = supportInterviews.filter(i => 
      i.status === 'completed' && !i.actionItems?.length
    ).length;
    const resolutionRate = supportInterviews.length > 0 
      ? (resolvedSupport / supportInterviews.length) * 100 
      : 0;
    
    // クリティカルケースの集計
    const criticalCases = specialInterviews.filter(i => 
      i.generationParams?.confidentialLevel === 'critical'
    ).length;
    
    // フォローアップ必要数
    const followUpRequired = allInterviews.results.filter(i => 
      i.actionItems && i.actionItems.length > 0
    ).length;
    
    return {
      regular: {
        total: regularInterviews.length,
        completed: regularInterviews.filter(i => i.status === 'completed').length,
        pending: regularInterviews.filter(i => i.status === 'pending').length,
        averageCompletionRate: stats.averageCompletionRate
      },
      support: {
        total: supportInterviews.length,
        byCategory: supportByCategory,
        averageResponseTime: 24, // 仮の値（実際は計算が必要）
        resolutionRate
      },
      special: {
        total: specialInterviews.length,
        byType: specialByType,
        criticalCases,
        followUpRequired
      },
      overall: {
        totalInterviews: allInterviews.total,
        activeInterviews: allInterviews.results.filter(i => 
          i.status === 'in_progress'
        ).length,
        completionRate: stats.averageCompletionRate,
        averageDuration: stats.averageDuration
      }
    };
  }
  
  /**
   * 推奨面談タイプを取得
   */
  async getRecommendedInterviewType(
    staffId: string
  ): Promise<{
    recommendedType: 'regular' | 'support' | 'special';
    reason: string;
    urgency: 'low' | 'medium' | 'high';
    suggestedDate: Date;
  }> {
    const profile = await this.interviewService.getStaffProfile(staffId);
    const history = await this.interviewService.getStaffInterviewHistory(staffId);
    
    // 最新の面談から経過日数を計算
    const latestInterview = history.results[0];
    const daysSinceLastInterview = latestInterview 
      ? Math.floor((Date.now() - new Date(latestInterview.conductedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    // 推奨ロジック
    if (daysSinceLastInterview > 180) {
      return {
        recommendedType: 'regular',
        reason: '前回面談から6ヶ月以上経過',
        urgency: 'high',
        suggestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    }
    
    if (daysSinceLastInterview > 90) {
      return {
        recommendedType: 'regular',
        reason: '定期面談の推奨時期',
        urgency: 'medium',
        suggestedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      };
    }
    
    return {
      recommendedType: 'support',
      reason: '必要に応じてサポート面談を実施',
      urgency: 'low',
      suggestedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }
}

// デフォルトエクスポート
export default UnifiedBankService;