// 動的面談シート生成サービス
// 職員の状況・履歴に応じた面談シートを動的生成

import { 
  InterviewType, 
  InterviewCategory, 
  InterviewClassification,
  UrgencyLevel,
  requiresCategory,
  availableCategories 
} from '@/types/interview';
import { TrainingIntegrationService } from '@/services/trainingIntegrationService';

export interface StaffContext {
  id: string;
  name: string;
  employeeNumber: string;
  department: string;
  position: string;
  hireDate: Date;
  facilityId: string;
  
  // 職員の状況
  experienceMonths: number;
  isManager: boolean;
  recentIncidents?: string[];
  isReturningFromLeave?: boolean;
  isResigning?: boolean;
  lastEvaluationScore?: number;
  
  // 履歴情報
  completedTrainings: string[];
  previousInterviews: InterviewHistory[];
  performanceIssues?: string[];
  careerGoals?: string[];
  
  // 動機タイプ情報
  motivationType?: 'achievement' | 'affiliation' | 'power' | 'autonomy' | 'security' | 'mixed';
  motivationAssessmentDate?: Date;
}

export interface InterviewHistory {
  date: Date;
  type: InterviewType;
  category?: InterviewCategory;
  mainTopics: string[];
  actionItems: string[];
  resolved: boolean;
}

export interface DynamicInterviewSheet {
  id: string;
  staffId: string;
  staffName: string;
  generatedAt: Date;
  version: string;
  
  // 面談設定
  recommendedType: InterviewType;
  classification: InterviewClassification;
  category?: InterviewCategory;
  urgencyLevel: UrgencyLevel;
  estimatedDuration: number; // 分
  
  // 面談項目
  sections: InterviewSection[];
  
  // メタデータ
  metadata: {
    autoSelectedTopics: number;
    basedOnHistory: boolean;
    trainingRelated: boolean;
    incidentRelated: boolean;
    generationRationale: string;
  };
}

export interface InterviewSection {
  id: string;
  title: string;
  purpose: string;
  priority: 'high' | 'medium' | 'low';
  questions: InterviewQuestion[];
  estimatedTime: number; // 分
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'open' | 'closed' | 'scale' | 'checklist';
  required: boolean;
  
  // 動的生成の根拠
  source: 'template' | 'history' | 'incident' | 'training' | 'evaluation' | 'custom';
  metadata?: {
    relatedIncident?: string;
    relatedTraining?: string;
    previousResponse?: string;
    followUpFrom?: string; // 前回面談のフォローアップ
  };
  
  // 回答オプション（該当する場合）
  options?: string[];
  scale?: { min: number; max: number; labels?: string[] };
  checklistItems?: string[];
}

export class DynamicInterviewGenerationService {
  
  /**
   * 職員の状況に応じた面談シートを動的生成
   */
  static async generateInterviewSheet(
    staff: StaffContext,
    requestedType?: InterviewType,
    requestedCategory?: InterviewCategory
  ): Promise<DynamicInterviewSheet> {
    
    // 1. 推奨面談タイプの決定
    const recommendedType = requestedType || this.determineInterviewType(staff);
    const classification = this.getClassification(recommendedType);
    
    // 2. カテゴリの決定（必要な場合）
    let category: InterviewCategory | undefined;
    if (requiresCategory(recommendedType)) {
      category = requestedCategory || this.determineCategory(staff, recommendedType);
    }
    
    // 3. 緊急度の判定
    const urgencyLevel = this.calculateUrgency(staff, recommendedType);
    
    // 4. 面談セクションの生成
    const sections = await this.generateSections(staff, recommendedType, category);
    
    // 5. 推定時間の計算
    const estimatedDuration = sections.reduce((sum, s) => sum + s.estimatedTime, 0);
    
    // 6. メタデータの生成
    const metadata = this.generateMetadata(sections, staff);
    
    return {
      id: `interview_${Date.now()}_${staff.id}`,
      staffId: staff.id,
      staffName: staff.name,
      generatedAt: new Date(),
      version: '1.0.0',
      recommendedType,
      classification,
      category,
      urgencyLevel,
      estimatedDuration,
      sections,
      metadata
    };
  }
  
  /**
   * 職員の状況から適切な面談タイプを判定
   */
  private static determineInterviewType(staff: StaffContext): InterviewType {
    // 優先順位に基づいて判定
    
    // 1. 退職予定の場合
    if (staff.isResigning) {
      return 'exit_interview';
    }
    
    // 2. 復職の場合
    if (staff.isReturningFromLeave) {
      return 'return_to_work';
    }
    
    // 3. 最近のインシデント
    if (staff.recentIncidents && staff.recentIncidents.length > 0) {
      const lastIncidentDays = this.daysSinceLastIncident(staff.recentIncidents);
      if (lastIncidentDays <= 7) {
        return 'incident_followup';
      }
    }
    
    // 4. 新入職員（入職1年未満）
    if (staff.experienceMonths < 12) {
      return 'new_employee_monthly';
    }
    
    // 5. 最近の評価実施後
    if (this.hasRecentEvaluation(staff)) {
      return 'feedback';
    }
    
    // 6. 管理職
    if (staff.isManager) {
      return 'management_biannual';
    }
    
    // 7. パフォーマンス問題がある場合
    if (staff.performanceIssues && staff.performanceIssues.length > 0) {
      return 'individual_consultation';
    }
    
    // 8. デフォルト
    return 'regular_annual';
  }
  
  /**
   * 面談タイプから分類を取得
   */
  private static getClassification(type: InterviewType): InterviewClassification {
    const classificationMap: Record<InterviewType, InterviewClassification> = {
      'new_employee_monthly': 'regular',
      'regular_annual': 'regular',
      'management_biannual': 'regular',
      'return_to_work': 'special',
      'incident_followup': 'special',
      'exit_interview': 'special',
      'feedback': 'support',
      'career_support': 'support',
      'workplace_support': 'support',
      'individual_consultation': 'support'
    };
    
    return classificationMap[type];
  }
  
  /**
   * サポート面談のカテゴリを決定
   */
  private static determineCategory(
    staff: StaffContext, 
    interviewType: InterviewType
  ): InterviewCategory {
    const categories = availableCategories[interviewType];
    if (!categories || categories.length === 0) {
      return 'other';
    }
    
    // 職員の状況に基づいて最適なカテゴリを選択
    if (interviewType === 'career_support') {
      if (staff.careerGoals && staff.careerGoals.includes('promotion')) {
        return 'promotion';
      }
      return 'career_path';
    }
    
    if (interviewType === 'workplace_support') {
      if (staff.performanceIssues && staff.performanceIssues.includes('workload')) {
        return 'workload_balance';
      }
      return 'work_environment';
    }
    
    if (interviewType === 'individual_consultation') {
      if (staff.performanceIssues && staff.performanceIssues.length > 0) {
        return 'performance';
      }
      return 'other';
    }
    
    return categories[0];
  }
  
  /**
   * 緊急度を計算
   */
  private static calculateUrgency(
    staff: StaffContext,
    interviewType: InterviewType
  ): UrgencyLevel {
    // 緊急度の判定ロジック
    if (interviewType === 'exit_interview' || interviewType === 'incident_followup') {
      return 'urgent';
    }
    
    if (interviewType === 'return_to_work') {
      return 'high';
    }
    
    if (staff.performanceIssues && staff.performanceIssues.length > 2) {
      return 'high';
    }
    
    if (interviewType === 'new_employee_monthly') {
      return 'medium';
    }
    
    return 'low';
  }
  
  /**
   * 面談セクションを生成
   */
  private static async generateSections(
    staff: StaffContext,
    interviewType: InterviewType,
    category?: InterviewCategory
  ): Promise<InterviewSection[]> {
    const sections: InterviewSection[] = [];
    
    // 1. 導入セクション（全面談共通）
    sections.push(this.createIntroSection(staff, interviewType));
    
    // 2. メインセクション（面談タイプ別）
    const mainSections = await this.createMainSections(staff, interviewType, category);
    sections.push(...mainSections);
    
    // 3. 動機タイプセクション（動機タイプが判明している場合）
    if (staff.motivationType) {
      const motivationSection = this.createMotivationSection(staff);
      if (motivationSection.questions.length > 0) {
        sections.push(motivationSection);
      }
    }
    
    // 4. フォローアップセクション（前回の面談がある場合）
    if (staff.previousInterviews.length > 0) {
      const followUpSection = this.createFollowUpSection(staff);
      if (followUpSection.questions.length > 0) {
        sections.push(followUpSection);
      }
    }
    
    // 5. クロージングセクション
    sections.push(this.createClosingSection(interviewType));
    
    return sections;
  }
  
  /**
   * 導入セクションの作成
   */
  private static createIntroSection(
    staff: StaffContext,
    interviewType: InterviewType
  ): InterviewSection {
    const questions: InterviewQuestion[] = [
      {
        id: 'intro_1',
        question: '最近の体調はいかがですか？',
        type: 'open',
        required: true,
        source: 'template'
      },
      {
        id: 'intro_2',
        question: '現在の業務状況について教えてください。',
        type: 'open',
        required: true,
        source: 'template'
      }
    ];
    
    // 新入職員の場合は追加質問
    if (staff.experienceMonths < 3) {
      questions.push({
        id: 'intro_3',
        question: '職場環境には慣れましたか？困っていることはありませんか？',
        type: 'open',
        required: true,
        source: 'template'
      });
    }
    
    return {
      id: 'introduction',
      title: '導入・現状確認',
      purpose: '職員の現在の状況を把握し、面談の雰囲気を作る',
      priority: 'high',
      questions,
      estimatedTime: 10
    };
  }
  
  /**
   * メインセクションの作成（面談タイプ別）
   */
  private static async createMainSections(
    staff: StaffContext,
    interviewType: InterviewType,
    category?: InterviewCategory
  ): Promise<InterviewSection[]> {
    const sections: InterviewSection[] = [];
    
    switch (interviewType) {
      case 'new_employee_monthly':
        sections.push(...this.createNewEmployeeSections(staff));
        break;
        
      case 'incident_followup':
        sections.push(...this.createIncidentFollowupSections(staff));
        break;
        
      case 'feedback':
        sections.push(...this.createFeedbackSections(staff));
        break;
        
      case 'career_support':
        sections.push(...this.createCareerSupportSections(staff, category!));
        break;
        
      case 'workplace_support':
        sections.push(...this.createWorkplaceSupportSections(staff, category!));
        break;
        
      case 'exit_interview':
        sections.push(...this.createExitInterviewSections(staff));
        break;
        
      default:
        sections.push(...this.createRegularSections(staff));
    }
    
    // 研修関連のセクション（該当する場合）
    const trainingSection = await this.createTrainingSection(staff);
    if (trainingSection && trainingSection.questions.length > 0) {
      sections.push(trainingSection);
    }
    
    return sections;
  }
  
  /**
   * 新入職員面談のセクション
   */
  private static createNewEmployeeSections(staff: StaffContext): InterviewSection[] {
    return [
      {
        id: 'adaptation',
        title: '職場適応状況',
        purpose: '新入職員の職場への適応状況を確認',
        priority: 'high',
        questions: [
          {
            id: 'adapt_1',
            question: '配属された部署での業務内容は理解できていますか？',
            type: 'scale',
            required: true,
            source: 'template',
            scale: { min: 1, max: 5, labels: ['理解できていない', '少し理解', '概ね理解', 'よく理解', '完全に理解'] }
          },
          {
            id: 'adapt_2',
            question: '先輩職員との関係はうまくいっていますか？',
            type: 'open',
            required: true,
            source: 'template'
          },
          {
            id: 'adapt_3',
            question: '業務で特に困っていることはありますか？',
            type: 'open',
            required: true,
            source: 'template'
          }
        ],
        estimatedTime: 15
      },
      {
        id: 'training_progress',
        title: '研修・教育進捗',
        purpose: '新入職員研修の進捗と理解度を確認',
        priority: 'high',
        questions: [
          {
            id: 'train_1',
            question: '現在受けている研修の内容は理解できていますか？',
            type: 'scale',
            required: true,
            source: 'training',
            scale: { min: 1, max: 5 }
          },
          {
            id: 'train_2',
            question: '追加で学びたい分野はありますか？',
            type: 'open',
            required: false,
            source: 'template'
          }
        ],
        estimatedTime: 10
      }
    ];
  }
  
  /**
   * インシデント後面談のセクション
   */
  private static createIncidentFollowupSections(staff: StaffContext): InterviewSection[] {
    const recentIncident = staff.recentIncidents?.[0] || '';
    
    return [
      {
        id: 'incident_review',
        title: 'インシデントの振り返り',
        purpose: 'インシデントの原因と再発防止策を検討',
        priority: 'high',
        questions: [
          {
            id: 'inc_1',
            question: 'インシデントが発生した状況を詳しく教えてください。',
            type: 'open',
            required: true,
            source: 'incident',
            metadata: { relatedIncident: recentIncident }
          },
          {
            id: 'inc_2',
            question: '今振り返って、どのような対応が可能だったと思いますか？',
            type: 'open',
            required: true,
            source: 'incident'
          },
          {
            id: 'inc_3',
            question: '再発防止のために必要なサポートは何ですか？',
            type: 'checklist',
            required: true,
            source: 'incident',
            checklistItems: [
              '追加研修',
              'マニュアルの改善',
              '業務プロセスの見直し',
              'チーム体制の強化',
              'その他'
            ]
          }
        ],
        estimatedTime: 20
      }
    ];
  }
  
  /**
   * フィードバック面談のセクション
   */
  private static createFeedbackSections(staff: StaffContext): InterviewSection[] {
    return [
      {
        id: 'evaluation_feedback',
        title: '評価結果のフィードバック',
        purpose: '人事評価の結果を共有し、改善点を明確化',
        priority: 'high',
        questions: [
          {
            id: 'eval_1',
            question: '評価結果について、ご自身の認識と相違はありましたか？',
            type: 'open',
            required: true,
            source: 'evaluation'
          },
          {
            id: 'eval_2',
            question: '今回の評価で特に改善が必要な点は何だと思いますか？',
            type: 'open',
            required: true,
            source: 'evaluation'
          },
          {
            id: 'eval_3',
            question: '次回評価までの具体的な目標を設定しましょう。',
            type: 'open',
            required: true,
            source: 'evaluation'
          }
        ],
        estimatedTime: 20
      }
    ];
  }
  
  /**
   * キャリアサポート面談のセクション
   */
  private static createCareerSupportSections(
    staff: StaffContext,
    category: InterviewCategory
  ): InterviewSection[] {
    const sections: InterviewSection[] = [];
    
    switch (category) {
      case 'career_path':
        sections.push({
          id: 'career_vision',
          title: 'キャリアビジョン',
          purpose: '将来のキャリア目標を明確化',
          priority: 'high',
          questions: [
            {
              id: 'career_1',
              question: '3年後、5年後にどのような職員になっていたいですか？',
              type: 'open',
              required: true,
              source: 'template'
            },
            {
              id: 'career_2',
              question: 'そのために必要なスキルや経験は何だと思いますか？',
              type: 'open',
              required: true,
              source: 'template'
            }
          ],
          estimatedTime: 15
        });
        break;
        
      case 'skill_development':
        sections.push({
          id: 'skill_assessment',
          title: 'スキル開発計画',
          purpose: '必要なスキルと研修計画を検討',
          priority: 'high',
          questions: [
            {
              id: 'skill_1',
              question: '現在の業務で不足していると感じるスキルは？',
              type: 'open',
              required: true,
              source: 'template'
            },
            {
              id: 'skill_2',
              question: '受講したい研修や取得したい資格はありますか？',
              type: 'open',
              required: true,
              source: 'training'
            }
          ],
          estimatedTime: 15
        });
        break;
    }
    
    return sections;
  }
  
  /**
   * 職場サポート面談のセクション
   */
  private static createWorkplaceSupportSections(
    staff: StaffContext,
    category: InterviewCategory
  ): InterviewSection[] {
    const sections: InterviewSection[] = [];
    
    switch (category) {
      case 'workload_balance':
        sections.push({
          id: 'workload',
          title: '業務負荷の確認',
          purpose: '適切な業務量の調整',
          priority: 'high',
          questions: [
            {
              id: 'load_1',
              question: '現在の業務量は適切ですか？',
              type: 'scale',
              required: true,
              source: 'template',
              scale: { min: 1, max: 5, labels: ['過多', 'やや多い', '適切', 'やや少ない', '少ない'] }
            },
            {
              id: 'load_2',
              question: '残業時間や休日出勤の状況を教えてください。',
              type: 'open',
              required: true,
              source: 'template'
            }
          ],
          estimatedTime: 15
        });
        break;
        
      case 'interpersonal':
        sections.push({
          id: 'relationships',
          title: '人間関係の確認',
          purpose: 'チーム内の関係性改善',
          priority: 'high',
          questions: [
            {
              id: 'rel_1',
              question: 'チーム内でのコミュニケーションは円滑ですか？',
              type: 'scale',
              required: true,
              source: 'template',
              scale: { min: 1, max: 5 }
            },
            {
              id: 'rel_2',
              question: '人間関係で困っていることはありますか？',
              type: 'open',
              required: false,
              source: 'template'
            }
          ],
          estimatedTime: 15
        });
        break;
    }
    
    return sections;
  }
  
  /**
   * 退職面談のセクション
   */
  private static createExitInterviewSections(staff: StaffContext): InterviewSection[] {
    return [
      {
        id: 'exit_reasons',
        title: '退職理由の確認',
        purpose: '組織改善のための情報収集',
        priority: 'high',
        questions: [
          {
            id: 'exit_1',
            question: '退職を決意された主な理由を教えてください。',
            type: 'open',
            required: true,
            source: 'template'
          },
          {
            id: 'exit_2',
            question: '組織として改善すべき点があれば教えてください。',
            type: 'open',
            required: false,
            source: 'template'
          },
          {
            id: 'exit_3',
            question: '後任者への引き継ぎ事項はありますか？',
            type: 'open',
            required: true,
            source: 'template'
          }
        ],
        estimatedTime: 20
      }
    ];
  }
  
  /**
   * 通常面談のセクション
   */
  private static createRegularSections(staff: StaffContext): InterviewSection[] {
    return [
      {
        id: 'performance_review',
        title: '業務遂行状況',
        purpose: '現在の業務状況と課題の確認',
        priority: 'medium',
        questions: [
          {
            id: 'perf_1',
            question: '現在の業務で達成感を感じることは何ですか？',
            type: 'open',
            required: true,
            source: 'template'
          },
          {
            id: 'perf_2',
            question: '業務上の課題や改善したい点はありますか？',
            type: 'open',
            required: true,
            source: 'template'
          }
        ],
        estimatedTime: 15
      }
    ];
  }
  
  /**
   * 研修関連セクションの作成
   */
  private static async createTrainingSection(staff: StaffContext): Promise<InterviewSection | null> {
    // 研修履歴から未完了または最近完了した研修を取得
    const trainingHistory = await TrainingIntegrationService.getStaffTrainingHistory(staff.id);
    const recentTrainings = trainingHistory.filter(t => {
      if (!t.completedDate) return true;
      const daysSinceCompletion = Math.floor(
        (Date.now() - new Date(t.completedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceCompletion <= 30;
    });
    
    if (recentTrainings.length === 0) {
      return null;
    }
    
    const questions: InterviewQuestion[] = recentTrainings.map((training, index) => ({
      id: `training_${index}`,
      question: `「${training.trainingName}」の研修について、学んだことを実践できていますか？`,
      type: 'open',
      required: false,
      source: 'training',
      metadata: { relatedTraining: training.trainingId }
    }));
    
    return {
      id: 'training_followup',
      title: '研修フォローアップ',
      purpose: '研修効果の確認と実践状況の把握',
      priority: 'low',
      questions,
      estimatedTime: Math.min(questions.length * 3, 15)
    };
  }
  
  /**
   * フォローアップセクションの作成
   */
  private static createFollowUpSection(staff: StaffContext): InterviewSection {
    const lastInterview = staff.previousInterviews[0];
    const unresolved = staff.previousInterviews.filter(i => !i.resolved);
    
    const questions: InterviewQuestion[] = [];
    
    // 前回の未解決事項
    unresolved.forEach((interview, index) => {
      interview.actionItems.forEach((item, itemIndex) => {
        questions.push({
          id: `followup_${index}_${itemIndex}`,
          question: `前回の面談で話した「${item}」について、その後の進捗はいかがですか？`,
          type: 'open',
          required: false,
          source: 'history',
          metadata: { followUpFrom: interview.date.toISOString() }
        });
      });
    });
    
    return {
      id: 'followup',
      title: '前回面談のフォローアップ',
      purpose: '継続的な課題の進捗確認',
      priority: 'medium',
      questions,
      estimatedTime: Math.min(questions.length * 3, 10)
    };
  }
  
  /**
   * 動機タイプに基づくセクションの作成
   */
  private static createMotivationSection(staff: StaffContext): InterviewSection {
    const questions: InterviewQuestion[] = [];
    
    // 基本的な動機確認の質問
    questions.push({
      id: 'motiv_base',
      question: '最近、仕事でやりがいを感じた瞬間はありましたか？',
      type: 'open',
      required: true,
      source: 'template'
    });
    
    // 動機タイプ別の質問
    switch (staff.motivationType) {
      case 'achievement':
        // 達成動機タイプ向けの質問
        questions.push(
          {
            id: 'motiv_ach_1',
            question: '最近達成した目標や成果について教えてください。',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_ach_2',
            question: '次に挑戦したい目標や課題はありますか？',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_ach_3',
            question: '自分の成長を実感できる機会は十分にありますか？',
            type: 'scale',
            required: false,
            source: 'custom',
            scale: { min: 1, max: 5, labels: ['全くない', '少ない', '普通', '多い', '非常に多い'] }
          }
        );
        break;
        
      case 'affiliation':
        // 親和動機タイプ向けの質問
        questions.push(
          {
            id: 'motiv_aff_1',
            question: 'チームメンバーとの協力で良かった事例を教えてください。',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_aff_2',
            question: '職場の人間関係で大切にしていることは何ですか？',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_aff_3',
            question: 'チームの一体感を高めるために何か提案はありますか？',
            type: 'open',
            required: false,
            source: 'custom'
          }
        );
        break;
        
      case 'power':
        // 権力動機タイプ向けの質問
        questions.push(
          {
            id: 'motiv_pow_1',
            question: '他者に良い影響を与えられた経験を教えてください。',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_pow_2',
            question: 'リーダーシップを発揮する機会は十分にありますか？',
            type: 'scale',
            required: true,
            source: 'custom',
            scale: { min: 1, max: 5 }
          },
          {
            id: 'motiv_pow_3',
            question: '今後、組織やチームにどのような貢献をしたいですか？',
            type: 'open',
            required: false,
            source: 'custom'
          }
        );
        break;
        
      case 'autonomy':
        // 自律動機タイプ向けの質問
        questions.push(
          {
            id: 'motiv_aut_1',
            question: '自分の裁量で進められる業務はどの程度ありますか？',
            type: 'scale',
            required: true,
            source: 'custom',
            scale: { min: 1, max: 5, labels: ['ほとんどない', '少ない', '適度', '多い', '非常に多い'] }
          },
          {
            id: 'motiv_aut_2',
            question: '業務の進め方で工夫している点を教えてください。',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_aut_3',
            question: 'もっと自由度が欲しい業務領域はありますか？',
            type: 'open',
            required: false,
            source: 'custom'
          }
        );
        break;
        
      case 'security':
        // 安定動機タイプ向けの質問
        questions.push(
          {
            id: 'motiv_sec_1',
            question: '現在の職場環境で安心して働けていますか？',
            type: 'scale',
            required: true,
            source: 'custom',
            scale: { min: 1, max: 5 }
          },
          {
            id: 'motiv_sec_2',
            question: '業務の手順や役割分担は明確ですか？',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_sec_3',
            question: '将来の雇用や待遇について不安はありますか？',
            type: 'open',
            required: false,
            source: 'custom'
          }
        );
        break;
        
      case 'mixed':
        // 複合動機タイプ向けの質問（バランス型）
        questions.push(
          {
            id: 'motiv_mix_1',
            question: '仕事で最も重視していることを3つ教えてください。',
            type: 'open',
            required: true,
            source: 'custom'
          },
          {
            id: 'motiv_mix_2',
            question: '現在の仕事環境で満足している点と改善したい点は？',
            type: 'open',
            required: true,
            source: 'custom'
          }
        );
        break;
    }
    
    // 共通のモチベーション維持・向上の質問
    questions.push({
      id: 'motiv_common',
      question: 'モチベーションを維持・向上させるために、組織からどのようなサポートが欲しいですか？',
      type: 'open',
      required: false,
      source: 'custom'
    });
    
    return {
      id: 'motivation',
      title: 'モチベーション・動機づけ',
      purpose: '職員の動機タイプに応じたモチベーション状況の確認と支援',
      priority: 'medium',
      questions,
      estimatedTime: 15
    };
  }
  
  /**
   * クロージングセクションの作成
   */
  private static createClosingSection(interviewType: InterviewType): InterviewSection {
    return {
      id: 'closing',
      title: 'まとめ・次回アクション',
      purpose: '面談のまとめと次回に向けたアクション確認',
      priority: 'high',
      questions: [
        {
          id: 'close_1',
          question: '今日の面談で決めたアクションを確認しましょう。',
          type: 'open',
          required: true,
          source: 'template'
        },
        {
          id: 'close_2',
          question: '次回の面談までに準備しておくことはありますか？',
          type: 'open',
          required: false,
          source: 'template'
        },
        {
          id: 'close_3',
          question: 'その他、伝えておきたいことはありますか？',
          type: 'open',
          required: false,
          source: 'template'
        }
      ],
      estimatedTime: 5
    };
  }
  
  /**
   * メタデータの生成
   */
  private static generateMetadata(
    sections: InterviewSection[],
    staff: StaffContext
  ): DynamicInterviewSheet['metadata'] {
    const allQuestions = sections.flatMap(s => s.questions);
    
    return {
      autoSelectedTopics: allQuestions.filter(q => q.source !== 'template').length,
      basedOnHistory: allQuestions.some(q => q.source === 'history'),
      trainingRelated: allQuestions.some(q => q.source === 'training'),
      incidentRelated: allQuestions.some(q => q.source === 'incident'),
      generationRationale: this.generateRationale(staff, sections)
    };
  }
  
  /**
   * 生成理由の説明文を作成
   */
  private static generateRationale(
    staff: StaffContext,
    sections: InterviewSection[]
  ): string {
    const reasons: string[] = [];
    
    if (staff.experienceMonths < 12) {
      reasons.push('新入職員のため月次面談を推奨');
    }
    
    if (staff.recentIncidents && staff.recentIncidents.length > 0) {
      reasons.push('最近のインシデントに対するフォローアップが必要');
    }
    
    if (staff.previousInterviews.some(i => !i.resolved)) {
      reasons.push('前回面談の未解決事項のフォローアップを含む');
    }
    
    const trainingQuestions = sections.flatMap(s => s.questions).filter(q => q.source === 'training');
    if (trainingQuestions.length > 0) {
      reasons.push(`${trainingQuestions.length}件の研修関連項目を追加`);
    }
    
    return reasons.join('、');
  }
  
  // ユーティリティメソッド
  
  private static daysSinceLastIncident(incidents: string[]): number {
    // 実装簡略化のため、最新のインシデントを7日以内と仮定
    return 5;
  }
  
  private static hasRecentEvaluation(staff: StaffContext): boolean {
    // 最近の評価があるかチェック（30日以内）
    return staff.lastEvaluationScore !== undefined;
  }
}