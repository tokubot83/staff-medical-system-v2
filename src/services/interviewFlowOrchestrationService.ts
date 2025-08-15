// 面談フロー統合オーケストレーションサービス
// 面談の準備から実施、データ反映まで一連のフローを管理

import { InterviewManualGenerationService, ManualGenerationRequest, GeneratedInterviewManual } from './interviewManualGenerationService';
import { DynamicInterviewGenerationService, StaffContext, DynamicInterviewSheet } from './dynamicInterviewGenerationService';
import { InterviewDataService, InterviewData } from './interview/interviewDataService';

// 面談実施マスタ - 1回の面談情報を集約
export interface InterviewSessionMaster {
  id: string;
  sessionDate: Date;
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  
  // 面談基本情報
  interviewInfo: {
    type: string;
    category?: string;
    duration: number;
    interviewer: {
      id: string;
      name: string;
      position: string;
    };
    location: string;
    mode: 'face-to-face' | 'online' | 'hybrid';
  };
  
  // 使用した面談マニュアル/シート
  manual: {
    manualId: string;
    version: string;
    generatedAt: Date;
    customizations?: string[];
  };
  
  // 面談実施内容
  content: {
    sections: InterviewSectionResult[];
    overallSummary: string;
    keyFindings: string[];
    concerns: string[];
    positivePoints: string[];
  };
  
  // 評価・スコア
  evaluations: {
    performanceScore?: number;
    motivationLevel?: number;
    stressLevel?: number;
    engagementScore?: number;
    skillAssessments?: {
      skillName: string;
      level: number;
      comment?: string;
    }[];
  };
  
  // アクションアイテム
  actionItems: {
    forStaff: ActionItem[];
    forOrganization: ActionItem[];
    followUpRequired: boolean;
    nextInterviewDate?: Date;
  };
  
  // データ配信先
  dataDistribution: {
    toStaffProfile: boolean;
    toPerformanceSystem: boolean;
    toTrainingSystem: boolean;
    toHealthManagement: boolean;
    customTargets?: string[];
  };
  
  // メタデータ
  metadata: {
    createdAt: Date;
    completedAt?: Date;
    lastModified: Date;
    status: 'draft' | 'in-progress' | 'completed' | 'approved';
    approvedBy?: string;
    approvedAt?: Date;
    tags?: string[];
  };
}

// 面談セクション結果
export interface InterviewSectionResult {
  sectionId: string;
  sectionTitle: string;
  plannedDuration: number;
  actualDuration?: number;
  questions: QuestionResult[];
  sectionSummary?: string;
  importantNotes?: string[];
}

// 質問結果
export interface QuestionResult {
  questionId: string;
  question: string;
  questionType: string;
  response: any; // 回答内容（テキスト、数値、選択肢など）
  responseTime?: Date;
  followUpNotes?: string;
  flaggedForReview?: boolean;
  attachments?: {
    type: 'image' | 'document' | 'audio';
    url: string;
    description?: string;
  }[];
}

// アクションアイテム
export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
  relatedSkill?: string;
}

// 職員カルテ反映データ
export interface StaffProfileUpdate {
  staffId: string;
  updateType: 'interview_result';
  updateDate: Date;
  interviewSessionId: string;
  
  // 更新項目
  updates: {
    // 基本情報更新
    motivationType?: string;
    currentMotivationLevel?: number;
    
    // スキル・能力更新
    skillUpdates?: {
      skillId: string;
      newLevel: number;
      evidence: string;
    }[];
    
    // 健康・メンタル情報
    healthStatus?: {
      stressLevel: number;
      workLifeBalance: number;
      physicalCondition: string;
      mentalCondition: string;
    };
    
    // キャリア情報
    careerAspiration?: {
      shortTermGoals: string[];
      longTermGoals: string[];
      desiredTraining: string[];
      transferRequest?: string;
    };
    
    // 組織への要望
    organizationalFeedback?: {
      workEnvironment: string;
      teamRelations: string;
      suggestions: string[];
    };
  };
  
  // 次回アクション
  nextActions: {
    scheduledInterviews?: Date[];
    requiredTraining?: string[];
    followUpItems: string[];
  };
}

// フロー実行オプション
export interface FlowExecutionOptions {
  mode: 'full-digital' | 'hybrid' | 'paper-based';
  realTimeSync: boolean;
  autoApproval: boolean;
  notifyStaff: boolean;
  generateReport: boolean;
}

export class InterviewFlowOrchestrationService {
  
  /**
   * Step 1: 面談準備 - マニュアル生成
   */
  static async prepareInterview(
    staffId: string,
    interviewType: string,
    options?: {
      duration?: number;
      customTopics?: string[];
      includeEvaluation?: boolean;
    }
  ): Promise<{
    manual: GeneratedInterviewManual;
    sheet: DynamicInterviewSheet;
    sessionId: string;
  }> {
    // 職員情報の取得
    const staffInfo = await this.getStaffInformation(staffId);
    
    // マニュアル生成リクエストの作成
    const manualRequest: ManualGenerationRequest = {
      staffLevel: this.determineStaffLevel(staffInfo),
      jobRole: staffInfo.jobRole,
      facilityType: staffInfo.facilityType,
      interviewType: interviewType as any,
      duration: options?.duration || 30,
      motivationType: staffInfo.motivationType,
      includeEvaluation: options?.includeEvaluation,
      customTopics: options?.customTopics
    };
    
    // マニュアル生成
    const manual = await InterviewManualGenerationService.generateManual(manualRequest);
    
    // 動的面談シート生成
    const sheet = await DynamicInterviewGenerationService.generateInterviewSheet(
      staffInfo,
      interviewType as any
    );
    
    // セッションID生成と初期データ保存
    const sessionId = this.createInterviewSession(staffId, manual, sheet);
    
    return { manual, sheet, sessionId };
  }
  
  /**
   * Step 2: 面談実施 - データ収集
   */
  static async conductInterview(
    sessionId: string,
    responses: Map<string, any>,
    options?: FlowExecutionOptions
  ): Promise<InterviewSessionMaster> {
    // セッションデータの取得
    const session = await this.getSession(sessionId);
    
    // 回答データの処理
    const processedContent = this.processResponses(session, responses);
    
    // 面談実施マスタの生成
    const masterRecord: InterviewSessionMaster = {
      id: sessionId,
      sessionDate: new Date(),
      staffId: session.staffId,
      staffName: session.staffName,
      department: session.department,
      position: session.position,
      
      interviewInfo: {
        type: session.interviewType,
        category: session.interviewCategory,
        duration: session.actualDuration || session.plannedDuration,
        interviewer: session.interviewer,
        location: session.location,
        mode: options?.mode === 'full-digital' ? 'online' : 'face-to-face'
      },
      
      manual: {
        manualId: session.manualId,
        version: session.manualVersion,
        generatedAt: session.manualGeneratedAt,
        customizations: session.customizations
      },
      
      content: processedContent,
      
      evaluations: this.extractEvaluations(processedContent),
      
      actionItems: this.generateActionItems(processedContent),
      
      dataDistribution: {
        toStaffProfile: true,
        toPerformanceSystem: true,
        toTrainingSystem: true,
        toHealthManagement: true
      },
      
      metadata: {
        createdAt: session.createdAt,
        completedAt: new Date(),
        lastModified: new Date(),
        status: options?.autoApproval ? 'approved' : 'completed'
      }
    };
    
    // リアルタイム同期が有効な場合
    if (options?.realTimeSync) {
      await this.syncToSystems(masterRecord);
    }
    
    // データ保存
    await this.saveMasterRecord(masterRecord);
    
    return masterRecord;
  }
  
  /**
   * Step 3: データ配信 - 各システムへの反映
   */
  static async distributeInterviewData(
    sessionMaster: InterviewSessionMaster
  ): Promise<{
    profileUpdate: boolean;
    performanceUpdate: boolean;
    trainingUpdate: boolean;
    healthUpdate: boolean;
    notifications: string[];
  }> {
    const results = {
      profileUpdate: false,
      performanceUpdate: false,
      trainingUpdate: false,
      healthUpdate: false,
      notifications: [] as string[]
    };
    
    // 1. 職員カルテへの反映
    if (sessionMaster.dataDistribution.toStaffProfile) {
      const profileUpdate = this.createProfileUpdate(sessionMaster);
      results.profileUpdate = await this.updateStaffProfile(profileUpdate);
      if (results.profileUpdate) {
        results.notifications.push('職員カルテを更新しました');
      }
    }
    
    // 2. 人事評価システムへの反映
    if (sessionMaster.dataDistribution.toPerformanceSystem && sessionMaster.evaluations.performanceScore) {
      results.performanceUpdate = await this.updatePerformanceSystem({
        staffId: sessionMaster.staffId,
        evaluations: sessionMaster.evaluations,
        interviewDate: sessionMaster.sessionDate,
        interviewId: sessionMaster.id
      });
      if (results.performanceUpdate) {
        results.notifications.push('人事評価システムに反映しました');
      }
    }
    
    // 3. 研修管理システムへの反映
    if (sessionMaster.dataDistribution.toTrainingSystem) {
      const trainingNeeds = this.extractTrainingNeeds(sessionMaster);
      if (trainingNeeds.length > 0) {
        results.trainingUpdate = await this.updateTrainingSystem({
          staffId: sessionMaster.staffId,
          recommendedTraining: trainingNeeds,
          basedOnInterview: sessionMaster.id
        });
        if (results.trainingUpdate) {
          results.notifications.push(`${trainingNeeds.length}件の研修を推奨登録しました`);
        }
      }
    }
    
    // 4. 健康管理システムへの反映
    if (sessionMaster.dataDistribution.toHealthManagement) {
      const healthData = this.extractHealthData(sessionMaster);
      if (healthData) {
        results.healthUpdate = await this.updateHealthSystem(healthData);
        if (results.healthUpdate) {
          results.notifications.push('健康管理情報を更新しました');
        }
      }
    }
    
    // 5. 通知の送信
    await this.sendNotifications(sessionMaster, results.notifications);
    
    return results;
  }
  
  /**
   * Step 4: レポート生成
   */
  static async generateInterviewReport(
    sessionMaster: InterviewSessionMaster
  ): Promise<{
    summary: string;
    detailedReport: any;
    exportFormats: ('pdf' | 'excel' | 'word')[];
  }> {
    // サマリー生成
    const summary = this.generateExecutiveSummary(sessionMaster);
    
    // 詳細レポート生成
    const detailedReport = {
      基本情報: {
        実施日: sessionMaster.sessionDate,
        対象者: sessionMaster.staffName,
        所属: sessionMaster.department,
        面談種別: sessionMaster.interviewInfo.type,
        所要時間: `${sessionMaster.interviewInfo.duration}分`
      },
      
      評価結果: {
        業務遂行: sessionMaster.evaluations.performanceScore,
        モチベーション: sessionMaster.evaluations.motivationLevel,
        ストレスレベル: sessionMaster.evaluations.stressLevel,
        エンゲージメント: sessionMaster.evaluations.engagementScore
      },
      
      主要な発見事項: sessionMaster.content.keyFindings,
      
      懸念事項: sessionMaster.content.concerns,
      
      ポジティブな点: sessionMaster.content.positivePoints,
      
      アクションプラン: {
        職員側: sessionMaster.actionItems.forStaff.map(item => ({
          内容: item.description,
          期限: item.dueDate,
          優先度: item.priority
        })),
        組織側: sessionMaster.actionItems.forOrganization.map(item => ({
          内容: item.description,
          担当: item.assignee,
          期限: item.dueDate
        }))
      },
      
      次回フォローアップ: sessionMaster.actionItems.nextInterviewDate
    };
    
    return {
      summary,
      detailedReport,
      exportFormats: ['pdf', 'excel', 'word']
    };
  }
  
  // ===== ヘルパーメソッド =====
  
  /**
   * 職員情報の取得
   */
  private static async getStaffInformation(staffId: string): Promise<StaffContext> {
    // 実際にはDBから取得
    // ここではモックデータを返す
    return {
      id: staffId,
      name: '山田太郎',
      employeeNumber: 'EMP001',
      department: '看護部',
      position: '看護師',
      hireDate: new Date('2020-04-01'),
      facilityId: 'FAC001',
      experienceMonths: 48,
      isManager: false,
      completedTrainings: [],
      previousInterviews: [],
      motivationType: 'achievement'
    } as StaffContext;
  }
  
  /**
   * 職員レベルの判定
   */
  private static determineStaffLevel(staff: StaffContext): any {
    const months = staff.experienceMonths;
    if (months < 12) return 'new';
    if (months < 24) return 'junior';
    if (months < 36) return 'general';
    if (months < 60) return 'midlevel';
    if (months < 84) return 'senior';
    if (months < 120) return 'veteran';
    return 'leader';
  }
  
  /**
   * セッションの作成
   */
  private static createInterviewSession(
    staffId: string,
    manual: GeneratedInterviewManual,
    sheet: DynamicInterviewSheet
  ): string {
    const sessionId = `session_${Date.now()}_${staffId}`;
    // セッションデータの保存処理
    return sessionId;
  }
  
  /**
   * セッションデータの取得
   */
  private static async getSession(sessionId: string): Promise<any> {
    // 実際にはDBから取得
    return {
      staffId: 'STAFF001',
      staffName: '山田太郎',
      department: '看護部',
      position: '看護師',
      interviewType: 'regular_annual',
      plannedDuration: 30,
      manualId: 'MANUAL001',
      manualVersion: '1.0.0',
      manualGeneratedAt: new Date(),
      interviewer: {
        id: 'INT001',
        name: '佐藤花子',
        position: '看護師長'
      },
      location: '面談室A',
      createdAt: new Date()
    };
  }
  
  /**
   * 回答データの処理
   */
  private static processResponses(
    session: any,
    responses: Map<string, any>
  ): any {
    const sections: InterviewSectionResult[] = [];
    
    // 回答データをセクションごとに整理
    responses.forEach((value, key) => {
      // セクションとして整理
    });
    
    return {
      sections,
      overallSummary: '面談は順調に実施されました',
      keyFindings: ['モチベーション向上', 'スキル習得順調'],
      concerns: ['業務負荷がやや高い'],
      positivePoints: ['チームワーク良好', '成長意欲高い']
    };
  }
  
  /**
   * 評価データの抽出
   */
  private static extractEvaluations(content: any): any {
    return {
      performanceScore: 4.2,
      motivationLevel: 8,
      stressLevel: 3,
      engagementScore: 4.5,
      skillAssessments: [
        { skillName: '看護技術', level: 4, comment: '順調に向上' },
        { skillName: 'コミュニケーション', level: 5, comment: '優秀' }
      ]
    };
  }
  
  /**
   * アクションアイテムの生成
   */
  private static generateActionItems(content: any): any {
    return {
      forStaff: [
        {
          id: 'ACT001',
          description: '採血技術の練習',
          assignee: '山田太郎',
          dueDate: new Date('2024-02-01'),
          priority: 'medium' as const,
          status: 'pending' as const,
          category: 'skill_development'
        }
      ],
      forOrganization: [
        {
          id: 'ACT002',
          description: '業務負荷の調整検討',
          assignee: '看護師長',
          dueDate: new Date('2024-01-20'),
          priority: 'high' as const,
          status: 'pending' as const,
          category: 'workload'
        }
      ],
      followUpRequired: true,
      nextInterviewDate: new Date('2024-03-01')
    };
  }
  
  /**
   * システムへの同期
   */
  private static async syncToSystems(master: InterviewSessionMaster): Promise<void> {
    // 各システムへのAPI呼び出し
    console.log('Syncing to systems...', master.id);
  }
  
  /**
   * マスタレコードの保存
   */
  private static async saveMasterRecord(master: InterviewSessionMaster): Promise<void> {
    // DBへの保存
    console.log('Saving master record...', master.id);
  }
  
  /**
   * プロファイル更新データの作成
   */
  private static createProfileUpdate(master: InterviewSessionMaster): StaffProfileUpdate {
    return {
      staffId: master.staffId,
      updateType: 'interview_result',
      updateDate: new Date(),
      interviewSessionId: master.id,
      
      updates: {
        motivationType: 'achievement',
        currentMotivationLevel: master.evaluations.motivationLevel,
        
        skillUpdates: master.evaluations.skillAssessments?.map(skill => ({
          skillId: skill.skillName,
          newLevel: skill.level,
          evidence: skill.comment || ''
        })),
        
        healthStatus: {
          stressLevel: master.evaluations.stressLevel || 0,
          workLifeBalance: 3,
          physicalCondition: '良好',
          mentalCondition: '安定'
        }
      },
      
      nextActions: {
        scheduledInterviews: master.actionItems.nextInterviewDate ? [master.actionItems.nextInterviewDate] : [],
        requiredTraining: [],
        followUpItems: master.actionItems.forStaff.map(item => item.description)
      }
    };
  }
  
  /**
   * 職員プロファイルの更新
   */
  private static async updateStaffProfile(update: StaffProfileUpdate): Promise<boolean> {
    // 実際のAPI呼び出し
    console.log('Updating staff profile...', update.staffId);
    return true;
  }
  
  /**
   * パフォーマンスシステムの更新
   */
  private static async updatePerformanceSystem(data: any): Promise<boolean> {
    console.log('Updating performance system...', data.staffId);
    return true;
  }
  
  /**
   * 研修ニーズの抽出
   */
  private static extractTrainingNeeds(master: InterviewSessionMaster): string[] {
    const needs: string[] = [];
    
    // スキル評価から研修ニーズを判定
    master.evaluations.skillAssessments?.forEach(skill => {
      if (skill.level < 3) {
        needs.push(`${skill.skillName}向上研修`);
      }
    });
    
    return needs;
  }
  
  /**
   * 研修システムの更新
   */
  private static async updateTrainingSystem(data: any): Promise<boolean> {
    console.log('Updating training system...', data.staffId);
    return true;
  }
  
  /**
   * 健康データの抽出
   */
  private static extractHealthData(master: InterviewSessionMaster): any {
    if (master.evaluations.stressLevel && master.evaluations.stressLevel > 7) {
      return {
        staffId: master.staffId,
        alertLevel: 'high',
        stressLevel: master.evaluations.stressLevel,
        reportedIssues: master.content.concerns,
        recommendedActions: ['産業医面談', 'メンタルヘルスケア']
      };
    }
    return null;
  }
  
  /**
   * 健康システムの更新
   */
  private static async updateHealthSystem(data: any): Promise<boolean> {
    console.log('Updating health system...', data.staffId);
    return true;
  }
  
  /**
   * エグゼクティブサマリーの生成
   */
  private static generateExecutiveSummary(master: InterviewSessionMaster): string {
    return `
    【面談実施サマリー】
    実施日: ${master.sessionDate.toLocaleDateString('ja-JP')}
    対象者: ${master.staffName}（${master.department}・${master.position}）
    
    ■ 総合評価
    - パフォーマンス: ${master.evaluations.performanceScore}/5
    - モチベーション: ${master.evaluations.motivationLevel}/10
    - エンゲージメント: ${master.evaluations.engagementScore}/5
    
    ■ 主要な発見
    ${master.content.keyFindings.map(f => `・${f}`).join('\n')}
    
    ■ 次回アクション
    ${master.actionItems.forStaff.slice(0, 3).map(a => `・${a.description}`).join('\n')}
    
    ■ フォローアップ
    次回面談予定: ${master.actionItems.nextInterviewDate?.toLocaleDateString('ja-JP') || '未定'}
    `;
  }
  
  /**
   * 通知の送信
   */
  private static async sendNotifications(
    master: InterviewSessionMaster,
    notifications: string[]
  ): Promise<void> {
    // メール、システム通知などの送信
    console.log('Sending notifications...', notifications);
  }
}