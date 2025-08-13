// ============================================
// 動機タイプ関連の型定義
// ============================================

/**
 * 動機タイプID
 */
export type MotivationTypeId = 
  | 'growth'      // 成長・挑戦型
  | 'recognition' // 評価・承認型
  | 'stability'   // 安定・安心型
  | 'teamwork'    // 関係・調和型
  | 'efficiency'  // 効率・合理型
  | 'compensation'// 報酬・待遇型
  | 'creativity'; // 自由・創造型

/**
 * 信頼度レベル
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * アクションカテゴリ
 */
export type ActionCategory = 
  | 'training'    // 研修・教育
  | 'project'     // プロジェクト
  | 'reward'      // 報酬・表彰
  | 'environment' // 環境整備
  | 'career'      // キャリア開発
  | 'other';      // その他

/**
 * 相性レベル
 */
export type CompatibilityLevel = 
  | 'excellent'   // 優秀
  | 'good'        // 良好
  | 'neutral'     // 中立
  | 'caution'     // 注意
  | 'difficult';  // 困難

/**
 * 動機タイプマスター
 */
export interface MotivationType {
  id: MotivationTypeId;
  typeName: string;
  label: string;
  description: string;
  icon?: string;
  color?: string;
  approach: string;
  keywords: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 職員動機タイプ履歴
 */
export interface StaffMotivationHistory {
  id: number;
  staffId: number;
  motivationTypeId: MotivationTypeId;
  interviewId?: number;
  assessmentDate: Date;
  assessedBy?: number;
  confidenceLevel: ConfidenceLevel;
  notes?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 動機タイプ別推奨アクション
 */
export interface MotivationTypeAction {
  id: number;
  motivationTypeId: MotivationTypeId;
  actionCategory: ActionCategory;
  actionName: string;
  actionDescription?: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 動機タイプ組み合わせ相性
 */
export interface MotivationTypeCompatibility {
  id: number;
  typeId1: MotivationTypeId;
  typeId2: MotivationTypeId;
  compatibilityLevel: CompatibilityLevel;
  description?: string;
  managementTips?: string;
  createdAt: Date;
}

/**
 * 面談記録（動機タイプ拡張）
 */
export interface InterviewWithMotivation {
  id: number;
  staffId: number;
  interviewerId: number;
  interviewDate: Date;
  interviewType: string;
  duration?: number;
  
  // 動機タイプ関連
  motivationTypeId?: MotivationTypeId;
  motivationConfidence?: ConfidenceLevel;
  typeSpecificNotes?: string;
  
  // 評価
  overallEvaluation?: string;
  potentialEvaluation?: string;
  turnoverRisk?: string;
  developmentPlan?: string;
  nextActionItems?: any;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 動機タイプ判定リクエスト
 */
export interface MotivationAssessmentRequest {
  staffId: number;
  interviewId?: number;
  motivationTypeId: MotivationTypeId;
  confidenceLevel: ConfidenceLevel;
  notes?: string;
  assessedBy: number;
}

/**
 * 動機タイプ判定レスポンス
 */
export interface MotivationAssessmentResponse {
  success: boolean;
  data?: {
    historyId: number;
    motivationType: MotivationType;
    recommendedActions: MotivationTypeAction[];
  };
  error?: string;
}

/**
 * 部署別動機タイプ分布
 */
export interface DepartmentMotivationDistribution {
  department: string;
  distribution: {
    typeName: string;
    count: number;
    percentage: number;
  }[];
}

/**
 * 職員動機タイプトレンド
 */
export interface StaffMotivationTrend {
  staffId: number;
  staffName: string;
  department: string;
  currentType: MotivationTypeId;
  currentTypeName: string;
  assessmentDate: Date;
  confidenceLevel: ConfidenceLevel;
  previousType?: MotivationTypeId;
  typeStatus: 'changed' | 'stable';
}

/**
 * チーム相性分析結果
 */
export interface TeamCompatibilityAnalysis {
  teamId: string;
  teamName: string;
  members: {
    staffId: number;
    name: string;
    motivationType: MotivationTypeId;
  }[];
  compatibilityMatrix: {
    staff1Id: number;
    staff2Id: number;
    compatibilityLevel: CompatibilityLevel;
  }[];
  overallCompatibility: CompatibilityLevel;
  recommendations: string[];
}

/**
 * 動機タイプベースの育成計画
 */
export interface MotivationBasedDevelopmentPlan {
  staffId: number;
  motivationType: MotivationTypeId;
  shortTermActions: MotivationTypeAction[]; // 3ヶ月以内
  midTermActions: MotivationTypeAction[];   // 3-12ヶ月
  longTermActions: MotivationTypeAction[];  // 1年以上
  estimatedImpact: {
    engagement: number;      // エンゲージメント向上率（%）
    retention: number;       // 定着率向上（%）
    performance: number;     // パフォーマンス向上（%）
  };
}