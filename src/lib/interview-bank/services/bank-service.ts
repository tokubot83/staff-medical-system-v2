/**
 * 面談バンクサービス - データ永続化機能を統合した面談管理サービス
 * 面談の生成、保存、取得、分析を一元管理
 */

import {
  InterviewBankRepository,
  InterviewBankRepositoryFactory,
  InterviewStatistics,
  StatsCriteria
} from '../repositories/bank-repository';

import {
  BankInterviewResult,
  StaffBankProfile,
  InterviewType,
  MotivationType,
  BankGenerationParams,
  BankQuestion,
  BankSection,
  GeneratedBankSheet
} from '../types';

import { InterviewBankGenerator } from './generator';
import { VoiceDriveIntegrationService, VoiceDriveInterviewRequest } from '@/services/voicedriveIntegrationService';

// 面談バンクサービス設定
export interface BankServiceConfig {
  repositoryType: 'local' | 'api' | 'mock';
  autoSave: boolean;
  autoSync: boolean;
  syncInterval: number; // ミリ秒
  maxRetries: number;
}

// 面談予約データ
export interface InterviewBooking {
  id?: string;
  staffId: string;
  staffName: string;
  interviewType: InterviewType;
  scheduledDate: Date;
  duration: number;
  location: 'online' | 'face-to-face';
  generationParams: BankGenerationParams;
  status: 'pending' | 'confirmed' | 'cancelled';
  voiceDriveRequestId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 面談進行状態
export interface InterviewProgress {
  interviewId: string;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  completedSections: string[];
  totalSections: number;
  totalQuestions: number;
  answeredQuestions: number;
  startedAt: Date;
  lastActivityAt: Date;
  estimatedTimeRemaining: number; // 分
  autoSaveEnabled: boolean;
}

/**
 * 面談バンクサービス - シングルトンパターン
 */
export class InterviewBankService {
  private static instance: InterviewBankService;
  private repository: InterviewBankRepository;
  private generator: InterviewBankGenerator;
  private config: BankServiceConfig;
  private syncTimer?: NodeJS.Timeout;
  private progressMap: Map<string, InterviewProgress> = new Map();
  
  private constructor(config?: Partial<BankServiceConfig>) {
    this.config = {
      repositoryType: 'local',
      autoSave: true,
      autoSync: false,
      syncInterval: 60000, // 1分
      maxRetries: 3,
      ...config
    };
    
    // リポジトリとジェネレーターの初期化
    this.repository = InterviewBankRepositoryFactory.getInstance(this.config.repositoryType);
    this.generator = new InterviewBankGenerator();
    
    // 自動同期の設定
    if (this.config.autoSync) {
      this.startAutoSync();
    }
  }
  
  /**
   * サービスインスタンスを取得
   */
  static getInstance(config?: Partial<BankServiceConfig>): InterviewBankService {
    if (!InterviewBankService.instance) {
      InterviewBankService.instance = new InterviewBankService(config);
    }
    return InterviewBankService.instance;
  }
  
  // === 面談生成・開始 ===
  
  /**
   * 新しい面談を生成して開始
   */
  async generateAndStartInterview(
    staffProfile: StaffBankProfile,
    params: BankGenerationParams
  ): Promise<{
    sheet: GeneratedBankSheet;
    interviewId: string;
    progress: InterviewProgress;
  }> {
    // 面談シートを生成
    const sheet = await this.generator.generateInterviewSheet(staffProfile, params);
    
    // 面談結果の初期データを作成
    const result: BankInterviewResult = {
      id: this.generateId('interview'),
      staffProfile,
      interviewType: params.interviewType,
      generationParams: params,
      generatedSheet: sheet,
      responses: [],
      completionRate: 0,
      duration: 0,
      conductedAt: new Date(),
      interviewerId: params.interviewerId || 'system',
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // データベースに保存
    const interviewId = await this.repository.saveInterviewResult(result);
    
    // 進行状態を初期化
    const progress: InterviewProgress = {
      interviewId,
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      completedSections: [],
      totalSections: sheet.sections.length,
      totalQuestions: sheet.sections.reduce((sum, section) => sum + section.questions.length, 0),
      answeredQuestions: 0,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      estimatedTimeRemaining: params.duration,
      autoSaveEnabled: this.config.autoSave
    };
    
    this.progressMap.set(interviewId, progress);
    
    return {
      sheet,
      interviewId,
      progress
    };
  }
  
  /**
   * VoiceDriveからの申込を処理して面談を生成
   */
  async processVoiceDriveRequest(
    request: VoiceDriveInterviewRequest
  ): Promise<{
    sheet: GeneratedBankSheet;
    interviewId: string;
    booking: InterviewBooking;
  }> {
    // 職員プロファイルを取得または作成
    let staffProfile = await this.repository.getStaffProfile(request.employeeId);
    
    if (!staffProfile) {
      // プロファイルが存在しない場合は作成
      staffProfile = {
        id: request.employeeId,
        name: request.employeeName,
        email: request.employeeEmail,
        department: request.department,
        position: request.position,
        experienceLevel: 'junior', // デフォルト値
        experienceYears: 2,
        experienceMonths: 0,
        facility: '',
        facilityType: 'acute',
        hireDate: new Date(),
        lastInterviewDate: null,
        nextScheduledDate: null,
        interviewCount: 0
      };
      
      await this.repository.saveStaffProfile(staffProfile);
    }
    
    // 面談パラメータを設定
    const params: BankGenerationParams = {
      interviewType: 'support',
      duration: 30,
      topics: [request.consultationTopic],
      focusAreas: this.mapVoiceDriveCategory(request.category)
    };
    
    // 面談を生成
    const { sheet, interviewId, progress } = await this.generateAndStartInterview(
      staffProfile,
      params
    );
    
    // 予約データを作成
    const booking: InterviewBooking = {
      id: this.generateId('booking'),
      staffId: request.employeeId,
      staffName: request.employeeName,
      interviewType: 'support',
      scheduledDate: request.preferredDates[0] || new Date(),
      duration: 30,
      location: request.preferredLocation === 'online' ? 'online' : 'face-to-face',
      generationParams: params,
      status: 'confirmed',
      voiceDriveRequestId: request.requestId,
      createdAt: new Date()
    };
    
    return {
      sheet,
      interviewId,
      booking
    };
  }
  
  // === 面談実施・記録 ===
  
  /**
   * 質問への回答を保存
   */
  async saveResponse(
    interviewId: string,
    questionId: string,
    answer: string,
    notes?: string
  ): Promise<void> {
    const result = await this.repository.getInterviewResult(interviewId);
    
    if (!result) {
      throw new Error(`Interview not found: ${interviewId}`);
    }
    
    // 既存の回答を更新または新規追加
    const existingIndex = result.responses.findIndex(r => r.questionId === questionId);
    const response = {
      questionId,
      answer,
      notes,
      answeredAt: new Date()
    };
    
    if (existingIndex >= 0) {
      result.responses[existingIndex] = response;
    } else {
      result.responses.push(response);
    }
    
    // 完了率を更新
    const progress = this.progressMap.get(interviewId);
    if (progress) {
      progress.answeredQuestions = result.responses.length;
      progress.lastActivityAt = new Date();
      result.completionRate = (progress.answeredQuestions / progress.totalQuestions) * 100;
    }
    
    // データベースを更新
    await this.repository.updateInterviewResult(interviewId, {
      responses: result.responses,
      completionRate: result.completionRate,
      updatedAt: new Date()
    });
    
    // 質問使用を記録
    await this.repository.recordQuestionUsage(questionId, interviewId);
  }
  
  /**
   * 面談を完了
   */
  async completeInterview(
    interviewId: string,
    summary?: string,
    keyPoints?: string[],
    actionItems?: Array<{ description: string; dueDate?: Date }>
  ): Promise<BankInterviewResult> {
    const result = await this.repository.getInterviewResult(interviewId);
    
    if (!result) {
      throw new Error(`Interview not found: ${interviewId}`);
    }
    
    const progress = this.progressMap.get(interviewId);
    const duration = progress 
      ? Math.round((new Date().getTime() - progress.startedAt.getTime()) / 60000)
      : 0;
    
    // 動機タイプを分析（回答から推定）
    const motivationType = await this.analyzeMotivationType(result.responses);
    
    // 面談結果を更新
    const updates: Partial<BankInterviewResult> = {
      status: 'completed',
      completionRate: 100,
      duration,
      summary,
      keyPoints,
      actionItems,
      completedAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.repository.updateInterviewResult(interviewId, updates);
    
    // 職員プロファイルを更新
    if (motivationType) {
      await this.repository.updateMotivationType(
        result.staffProfile.id,
        motivationType.type,
        motivationType.confidence
      );
    }
    
    // 進行状態をクリア
    this.progressMap.delete(interviewId);
    
    // VoiceDriveに結果を送信
    if (result.generationParams.voiceDriveRequestId) {
      await this.sendResultToVoiceDrive(interviewId);
    }
    
    return { ...result, ...updates };
  }
  
  // === データ取得・検索 ===
  
  /**
   * 職員の面談履歴を取得
   */
  async getStaffInterviewHistory(
    staffId: string,
    options?: {
      type?: InterviewType;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    results: BankInterviewResult[];
    total: number;
    hasMore: boolean;
  }> {
    const allResults = await this.repository.getInterviewHistory(staffId, options?.type);
    
    const start = options?.offset || 0;
    const limit = options?.limit || 10;
    const results = allResults.slice(start, start + limit);
    
    return {
      results,
      total: allResults.length,
      hasMore: start + limit < allResults.length
    };
  }
  
  /**
   * 職員の次回推奨面談を取得
   */
  async getRecommendedNextInterview(staffId: string): Promise<{
    type: InterviewType;
    recommendedDate: Date;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const profile = await this.repository.getStaffProfile(staffId);
    const latestInterview = await this.repository.getLatestInterview(staffId);
    
    // 推奨ロジック
    let type: InterviewType = 'regular';
    let recommendedDate = new Date();
    let reason = '';
    let priority: 'high' | 'medium' | 'low' = 'medium';
    
    if (!latestInterview) {
      // 初回面談
      type = 'regular';
      reason = '初回の定期面談';
      priority = 'high';
    } else {
      const daysSinceLastInterview = Math.floor(
        (new Date().getTime() - new Date(latestInterview.conductedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastInterview > 180) {
        // 6ヶ月以上経過
        type = 'regular';
        reason = '前回面談から6ヶ月以上経過';
        priority = 'high';
        recommendedDate.setDate(recommendedDate.getDate() + 7);
      } else if (daysSinceLastInterview > 90) {
        // 3ヶ月以上経過
        type = 'regular';
        reason = '定期面談の推奨時期';
        priority = 'medium';
        recommendedDate.setDate(recommendedDate.getDate() + 14);
      } else {
        // 最近面談実施済み
        type = 'support';
        reason = '必要に応じてサポート面談を実施';
        priority = 'low';
        recommendedDate.setDate(recommendedDate.getDate() + 30);
      }
    }
    
    return {
      type,
      recommendedDate,
      reason,
      priority
    };
  }
  
  // === 統計・分析 ===
  
  /**
   * 面談統計を取得
   */
  async getStatistics(criteria: StatsCriteria): Promise<InterviewStatistics> {
    return await this.repository.getStatistics(criteria);
  }
  
  /**
   * 部署の面談実施状況を取得
   */
  async getDepartmentDashboard(
    departmentId: string,
    period: { start: Date; end: Date }
  ): Promise<{
    stats: any;
    upcomingInterviews: InterviewBooking[];
    recentCompletions: BankInterviewResult[];
    alerts: Array<{ type: string; message: string; priority: string }>;
  }> {
    // 統計データ
    const stats = await this.repository.getDepartmentStats(
      departmentId,
      period.start,
      period.end
    );
    
    // 今後の予定（ダミーデータ）
    const upcomingInterviews: InterviewBooking[] = [];
    
    // 最近の完了面談
    const allResults = await this.repository.getInterviewHistory('');
    const recentCompletions = allResults
      .filter(r => r.staffProfile.department === departmentId && r.status === 'completed')
      .slice(0, 5);
    
    // アラート生成
    const alerts: Array<{ type: string; message: string; priority: string }> = [];
    
    if (stats.averageCompletionRate < 70) {
      alerts.push({
        type: 'warning',
        message: '面談完了率が70%を下回っています',
        priority: 'high'
      });
    }
    
    const participationRate = stats.totalStaff > 0 
      ? (stats.interviewedStaff / stats.totalStaff) * 100 
      : 0;
    
    if (participationRate < 50) {
      alerts.push({
        type: 'info',
        message: '半数以上の職員が面談未実施です',
        priority: 'medium'
      });
    }
    
    return {
      stats,
      upcomingInterviews,
      recentCompletions,
      alerts
    };
  }
  
  // === 管理機能 ===
  
  /**
   * 質問を追加
   */
  async addQuestion(question: BankQuestion, tags?: string[]): Promise<string> {
    return await this.repository.addQuestion(question, tags);
  }
  
  /**
   * セクション定義を追加
   */
  async addSection(section: BankSection, applicableTo: any): Promise<string> {
    return await this.repository.addSectionDefinition(section, applicableTo);
  }
  
  /**
   * データをエクスポート
   */
  async exportData(format: 'json' | 'csv' = 'json'): Promise<string> {
    const jsonData = await this.repository.exportData();
    
    if (format === 'csv') {
      // CSV変換ロジック（簡易版）
      return this.convertToCSV(JSON.parse(jsonData));
    }
    
    return jsonData;
  }
  
  /**
   * データをインポート
   */
  async importData(data: string, options?: any): Promise<any> {
    return await this.repository.importData(data, options);
  }
  
  // === プライベートメソッド ===
  
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private startAutoSync(): void {
    this.syncTimer = setInterval(async () => {
      try {
        await this.syncWithVoiceDrive();
      } catch (error) {
        console.error('Auto sync failed:', error);
      }
    }, this.config.syncInterval);
  }
  
  private async syncWithVoiceDrive(): Promise<void> {
    // VoiceDriveとの同期処理
    const requests = await VoiceDriveIntegrationService.fetchInterviewRequests();
    
    for (const request of requests) {
      if (request.status === 'pending') {
        await this.processVoiceDriveRequest(request);
      }
    }
  }
  
  private async sendResultToVoiceDrive(interviewId: string): Promise<void> {
    const result = await this.repository.getInterviewResult(interviewId);
    
    if (!result || !result.generationParams.voiceDriveRequestId) {
      return;
    }
    
    // VoiceDriveに結果を送信
    const interviewData: any = {
      id: interviewId,
      staffId: result.staffProfile.id,
      staffName: result.staffProfile.name,
      actualDate: result.conductedAt,
      duration: result.duration,
      summary: result.summary,
      keyPoints: result.keyPoints,
      actionItems: result.actionItems,
      followUpRequired: result.actionItems && result.actionItems.length > 0
    };
    
    await VoiceDriveIntegrationService.sendInterviewResult(
      interviewData,
      result.generationParams.voiceDriveRequestId
    );
  }
  
  private mapVoiceDriveCategory(category: string): string[] {
    const mapping: Record<string, string[]> = {
      'career': ['キャリア開発', 'スキル向上'],
      'workplace': ['職場環境', 'チームワーク'],
      'relationships': ['人間関係', 'コミュニケーション'],
      'worklife': ['ワークライフバランス', '働き方'],
      'health': ['健康管理', 'メンタルヘルス']
    };
    
    return mapping[category] || ['その他'];
  }
  
  private async analyzeMotivationType(
    responses: Array<{ questionId: string; answer: string }>
  ): Promise<{ type: MotivationType; confidence: number } | null> {
    // 簡易的な動機タイプ分析
    const typeScores: Record<MotivationType, number> = {
      growth: 0,
      recognition: 0,
      stability: 0,
      teamwork: 0,
      efficiency: 0,
      compensation: 0,
      creativity: 0
    };
    
    // キーワードベースの分析
    responses.forEach(response => {
      const answer = response.answer.toLowerCase();
      
      if (answer.includes('成長') || answer.includes('学び')) {
        typeScores.growth += 1;
      }
      if (answer.includes('評価') || answer.includes('認め')) {
        typeScores.recognition += 1;
      }
      if (answer.includes('安定') || answer.includes('安心')) {
        typeScores.stability += 1;
      }
      if (answer.includes('チーム') || answer.includes('協力')) {
        typeScores.teamwork += 1;
      }
      if (answer.includes('効率') || answer.includes('改善')) {
        typeScores.efficiency += 1;
      }
      if (answer.includes('給与') || answer.includes('待遇')) {
        typeScores.compensation += 1;
      }
      if (answer.includes('創造') || answer.includes('新しい')) {
        typeScores.creativity += 1;
      }
    });
    
    // 最高スコアのタイプを選択
    let maxScore = 0;
    let selectedType: MotivationType = 'growth';
    
    Object.entries(typeScores).forEach(([type, score]) => {
      if (score > maxScore) {
        maxScore = score;
        selectedType = type as MotivationType;
      }
    });
    
    if (maxScore === 0) {
      return null;
    }
    
    // 信頼度の計算（回答数に対する割合）
    const confidence = Math.min(100, (maxScore / responses.length) * 100);
    
    return {
      type: selectedType,
      confidence
    };
  }
  
  private convertToCSV(data: any): string {
    // 簡易的なCSV変換
    const lines: string[] = [];
    
    // ヘッダー
    lines.push('ID,Staff Name,Date,Type,Completion Rate,Duration');
    
    // データ行
    if (data.data && data.data.results) {
      Object.values(data.data.results).forEach((result: any) => {
        lines.push([
          result.id,
          result.staffProfile.name,
          result.conductedAt,
          result.interviewType,
          result.completionRate,
          result.duration
        ].join(','));
      });
    }
    
    return lines.join('\n');
  }
  
  /**
   * サービスを停止
   */
  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.progressMap.clear();
  }
}