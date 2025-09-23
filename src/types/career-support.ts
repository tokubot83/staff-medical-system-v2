// キャリア支援統合のための型定義

// 職員キャリアカルテ（個人の成長記録）
export interface StaffCareerRecord {
  staffId: string;
  staffName: string;
  department: string;
  position: string;

  // 評価履歴（独立データ）
  evaluationHistory: EvaluationRecord[];

  // 面談履歴（独立データ）
  interviewHistory: InterviewRecord[];

  // キャリア支援記録（統合活用）
  careerSupport: CareerSupportData;

  // AI準備用データ
  aiReadiness?: AIReadinessData;

  createdAt: string;
  updatedAt: string;
}

// 評価記録
export interface EvaluationRecord {
  id: string;
  date: string;
  technicalScore: number;      // 技術評価（50点満点）
  contributionScore: number;    // 組織貢献度（50点満点）
  totalScore: number;          // 合計（100点満点）
  finalGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  trend: 'improving' | 'stable' | 'declining';
  evaluatorId: string;
  evaluatorName: string;
}

// 面談記録
export interface InterviewRecord {
  id: string;
  date: string;
  type: InterviewType;
  topics: string[];
  concerns: string[];           // 相談内容（評価には使わない）
  aspirations: string[];         // 希望・目標
  supportNeeds: string[];        // 必要な支援
  interviewerId: string;
  interviewerName: string;
  duration: number;             // 分単位
  followUpRequired: boolean;
  notes: string;
}

// 面談タイプ
export type InterviewType =
  | 'regular'           // 定期面談
  | 'career'           // キャリア面談
  | 'evaluation_feedback' // 評価フィードバック
  | 'support'          // 支援面談
  | 'problem_solving'  // 問題解決面談
  | 'promotion'        // 昇進・昇格面談
  | 'training'         // 研修相談
  | 'wellness';        // ウェルネス面談

// キャリア支援データ
export interface CareerSupportData {
  currentPhase: CareerPhase;
  supportLevel: SupportLevel;
  interventions: Intervention[];
  growthTrajectory: GrowthTrajectory;
  recommendations: Recommendation[];
  lastReviewDate: string;
  nextReviewDate: string;
}

// キャリアフェーズ
export type CareerPhase =
  | 'onboarding'     // 入社・適応期
  | 'growth'         // 成長期
  | 'stable'         // 安定期
  | 'transition'     // 転換期
  | 'intensive'      // 集中支援期
  | 'leadership';    // リーダーシップ開発期

// 支援レベル
export type SupportLevel = 'A' | 'B' | 'C' | 'D';

// 実施した介入・支援
export interface Intervention {
  id: string;
  date: string;
  type: InterventionType;
  description: string;
  outcome: string;
  effectiveness: number;  // 1-5の評価
  followUpNeeded: boolean;
}

// 介入タイプ
export type InterventionType =
  | 'training'       // 研修
  | 'mentoring'      // メンタリング
  | 'coaching'       // コーチング
  | 'counseling'     // カウンセリング
  | 'job_rotation'   // ジョブローテーション
  | 'project_assignment' // プロジェクトアサイン
  | 'certification'  // 資格取得支援
  | 'external_training'; // 外部研修

// 成長の軌跡
export interface GrowthTrajectory {
  strengths: string[];
  improvements: string[];
  achievements: Achievement[];
  nextSteps: string[];
  careerGoals: CareerGoal[];
}

// 達成事項
export interface Achievement {
  date: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

// キャリア目標
export interface CareerGoal {
  term: 'short' | 'medium' | 'long';
  goal: string;
  targetDate: string;
  progress: number;  // 0-100%
  status: 'not_started' | 'in_progress' | 'completed' | 'revised';
}

// 推奨事項
export interface Recommendation {
  id: string;
  date: string;
  type: RecommendationType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  deadline?: string;
}

// 推奨タイプ
export type RecommendationType =
  | 'training'
  | 'certification'
  | 'mentorship'
  | 'project'
  | 'role_change'
  | 'support';

// AI準備用データ
export interface AIReadinessData {
  dataCollection: boolean;
  growthPatternAnalysis: boolean;
  careerFitAnalysis: boolean;
  supportNeedsPrediction: boolean;
  patterns: PatternData[];
}

// パターンデータ
export interface PatternData {
  type: string;
  confidence: number;
  description: string;
  dataPoints: number;
}

// 将来の拡張：キャリア支援統合設定
export interface CareerSupportIntegration {
  // 評価→キャリア支援面談の自動化
  evaluationTriggers: EvaluationTrigger[];

  // キャリア開発設定
  careerDevelopment: CareerDevelopmentConfig;

  // AI準備設定
  aiReadiness: AIReadinessConfig;

  // プライバシー設定
  privacy: PrivacyConfig;
}

// 評価トリガー
export interface EvaluationTrigger {
  name: string;
  scoreThreshold: number;
  condition: 'above' | 'below' | 'equals';
  action: TriggerAction;
  type: TriggerType;
  priority: 'high' | 'medium' | 'low';
}

// トリガーアクション
export type TriggerAction =
  | 'schedule_career_interview'
  | 'recommend_training'
  | 'send_support_alert'
  | 'assign_mentor'
  | 'create_development_plan';

// トリガータイプ
export type TriggerType =
  | 'career_development'
  | 'skill_support'
  | 'motivation_support'
  | 'performance_improvement'
  | 'leadership_development';

// キャリア開発設定
export interface CareerDevelopmentConfig {
  strengthsTracking: boolean;
  challengesTracking: boolean;
  careerPathSuggestions: boolean;
  trainingRecommendations: boolean;
  motivationMonitoring: boolean;
  successionPlanning: boolean;
}

// AI準備設定
export interface AIReadinessConfig {
  growthPatternAnalysis: boolean;
  careerFitAnalysis: boolean;
  supportNeedsPrediction: boolean;
  burnoutRiskDetection: boolean;
  teamCompatibilityAnalysis: boolean;
}

// プライバシー設定
export interface PrivacyConfig {
  evaluationIsolation: boolean;      // 評価への影響を完全遮断
  anonymizedAnalysis: boolean;       // 匿名化された分析
  consentRequired: boolean;          // 本人同意の必要性
  dataRetentionPeriod: number;       // データ保持期間（月）
}

// 支援計画
export interface SupportPlan {
  staffId: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actions: string[];
  timeline: string;
  expectedOutcomes: string[];
  resources: Resource[];
  dbRecord: {
    triggerType: string;
    supportLevel: SupportLevel;
    reason: string;
    createdAt: string;
  };
}

// リソース
export interface Resource {
  type: 'human' | 'training' | 'budget' | 'time';
  description: string;
  allocation: string;
  cost?: number;
}

// マネージャーダッシュボード用データ
export interface ManagerDashboardData {
  departmentOverview: {
    totalStaff: number;
    supportLevelA: number;
    supportLevelB: number;
    supportLevelC: number;
    supportLevelD: number;
  };
  alerts: Alert[];
  effectiveness: {
    interventionSuccess: string;
    averageImprovementTime: string;
    costPerImprovement: number;
  };
  trends: TrendData[];
}

// アラート
export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  staffId: string;
  staffName: string;
  message: string;
  actionRequired: boolean;
  suggestedAction?: string;
  deadline?: string;
}

// トレンドデータ
export interface TrendData {
  period: string;
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

// 職員個人用ダッシュボードデータ
export interface MyCareerSupportData {
  myGrowth: {
    currentLevel: SupportLevel;
    recentEvaluation: string;
    strengths: string[];
    developmentAreas: string[];
    achievements: Achievement[];
  };
  availableSupport: string[];
  enrolledPrograms: Program[];
  nextSteps: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
  progressTracking: ProgressData[];
}

// プログラム
export interface Program {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'enrolled' | 'completed' | 'dropped';
}

// 進捗データ
export interface ProgressData {
  goalId: string;
  goalName: string;
  progress: number;
  milestones: Milestone[];
}

// マイルストーン
export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
}