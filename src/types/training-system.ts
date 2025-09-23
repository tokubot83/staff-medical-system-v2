// 教育・研修制度の型定義

// 研修プログラムタイプ
export type ProgramType =
  | 'legal'           // 法定研修
  | 'basic'           // 基礎研修
  | 'specialty'       // 専門研修
  | 'management'      // 管理研修
  | 'safety'          // 安全研修
  | 'onboarding'      // オンボーディング
  | 'probation'       // 試用期間プログラム
  | 'rotation'        // ローテーション研修
  | 'custom';         // カスタムプログラム

// 実施形態
export type TrainingMethod =
  | 'OJT'
  | 'OffJT'
  | 'e-learning'
  | 'hybrid'
  | 'facility-rotation'  // 施設間ローテーション
  | 'mentoring';

// プログラムステータス
export type ProgramStatus =
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'suspended'
  | 'completed'
  | 'archived';

// 基本的な研修プログラム
export interface TrainingProgram {
  id: string;
  name: string;
  type: ProgramType;
  category: string;
  description: string;
  objectives: string[];
  method: TrainingMethod[];
  duration: {
    value: number;
    unit: 'hours' | 'days' | 'weeks' | 'months';
  };
  targetAudience: TargetAudience;
  prerequisites?: string[];
  materials?: TrainingMaterial[];
  evaluation: EvaluationMethod;
  certification?: Certification;
  status: ProgramStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 対象者設定
export interface TargetAudience {
  facilities?: string[];        // 対象施設
  departments?: string[];        // 対象部署
  jobCategories?: string[];      // 職種
  experienceLevels?: string[];   // 経験レベル
  employmentTypes?: string[];    // 雇用形態（新卒/中途/パート等）
  customConditions?: string;     // カスタム条件
}

// 研修教材
export interface TrainingMaterial {
  id: string;
  type: 'document' | 'video' | 'slide' | 'quiz' | 'external';
  title: string;
  url?: string;
  description?: string;
  duration?: number;  // 分
}

// 評価方法
export interface EvaluationMethod {
  type: 'test' | 'report' | 'observation' | 'multi-phase' | 'performance';
  criteria: EvaluationCriteria[];
  passingScore?: number;
  retakeAllowed: boolean;
}

// 評価基準
export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;  // 配点比率
  scoreRange: { min: number; max: number };
}

// 認定・修了証
export interface Certification {
  id: string;
  name: string;
  validityPeriod?: {
    value: number;
    unit: 'months' | 'years';
  };
  renewalRequired: boolean;
}

// 法定研修の設定
export interface LegalTrainingRequirement {
  id: string;
  name: string;
  facilityTypes: string[];  // 適用施設種別
  frequency: string;         // 実施頻度（年2回以上等）
  duration: string;          // 実施時間
  targetStaff: string;       // 対象職員
  legalBasis: string;        // 法的根拠
  description: string;
  penalties?: string;        // 違反時のペナルティ
  isActive: boolean;
}

// 試用期間活用プログラム（新入職員用特別プログラム）
export interface ProbationProgram {
  id: string;
  name: string;
  description: string;
  phases: ProbationPhase[];
  evaluationCriteria: ProbationEvaluationCriteria;
  decisionProcess: DecisionProcess;
  facilityRotation?: FacilityRotation;
  status: ProgramStatus;
}

// 試用期間のフェーズ
export interface ProbationPhase {
  phaseNumber: number;
  name: string;  // 例：基礎OJT期間、適性確認期間、配置決定期間
  duration: {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  objectives: string[];
  activities: PhaseActivity[];
  evaluation: PhaseEvaluation;
  milestone: string[];
}

// フェーズ活動
export interface PhaseActivity {
  id: string;
  type: 'training' | 'observation' | 'rotation' | 'mentoring' | 'evaluation';
  name: string;
  description: string;
  responsible: string;  // 担当者
  schedule?: string;
}

// フェーズ評価
export interface PhaseEvaluation {
  method: string;
  evaluators: string[];
  criteria: string[];
  feedbackRequired: boolean;
}

// 試用期間評価基準
export interface ProbationEvaluationCriteria {
  technicalSkills: EvaluationItem[];
  softSkills: EvaluationItem[];
  organizationalFit: EvaluationItem[];
  overallThreshold: number;  // 合格基準点
}

// 評価項目
export interface EvaluationItem {
  id: string;
  name: string;
  description: string;
  weight: number;
  scoreRange: { min: number; max: number };
}

// 配置決定プロセス
export interface DecisionProcess {
  participants: string[];  // 本人、現場、法人
  method: 'consensus' | 'voting' | 'management_decision';
  criteria: string[];
  timeline: string;
}

// 施設間ローテーション
export interface FacilityRotation {
  enabled: boolean;
  facilities: RotationFacility[];
  schedule: string;
  evaluationMethod: string;
}

// ローテーション施設
export interface RotationFacility {
  facilityId: string;
  facilityName: string;
  facilityType: string;  // 急性期、回復期、介護等
  duration: number;      // 日数
  departments?: string[];
  supervisor: string;
}

// カスタムプログラムビルダー
export interface CustomProgramBuilder {
  id: string;
  name: string;
  description: string;
  template?: string;  // ベースとなるテンプレート
  modules: ProgramModule[];
  workflow: WorkflowNode[];
  conditions: ProgramCondition[];
  notifications: NotificationSetting[];
  status: ProgramStatus;
}

// プログラムモジュール
export interface ProgramModule {
  id: string;
  type: 'training' | 'evaluation' | 'rotation' | 'meeting' | 'custom';
  name: string;
  content: any;  // モジュールタイプに応じた内容
  duration?: number;
  required: boolean;
  order: number;
}

// ワークフローノード
export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'activity' | 'decision' | 'parallel';
  name: string;
  nextNodes: string[];
  conditions?: string[];
  assignee?: string;
}

// プログラム条件
export interface ProgramCondition {
  id: string;
  type: 'if-then' | 'schedule' | 'completion';
  condition: string;
  action: string;
}

// 通知設定
export interface NotificationSetting {
  id: string;
  trigger: string;
  recipients: string[];
  message: string;
  timing: string;
}

// 研修実施記録
export interface TrainingRecord {
  id: string;
  programId: string;
  participantId: string;
  participantName: string;
  startDate: string;
  endDate?: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped' | 'failed';
  progress: number;  // 進捗率
  scores?: { [criteriaId: string]: number };
  feedback?: string;
  certificateId?: string;
  nextActions?: string[];
}

// 研修効果測定
export interface TrainingEffectiveness {
  programId: string;
  period: { start: string; end: string };
  metrics: EffectivenessMetric[];
  roi?: number;
  recommendations: string[];
}

// 効果測定指標
export interface EffectivenessMetric {
  name: string;
  type: 'retention_rate' | 'performance_improvement' | 'satisfaction' | 'compliance' | 'custom';
  value: number;
  target: number;
  trend: 'improving' | 'stable' | 'declining';
  analysis?: string;
}

// 施設別カスタマイズ設定
export interface FacilityCustomization {
  facilityId: string;
  facilityName: string;
  customPrograms: string[];  // カスタムプログラムID
  additionalRequirements: LegalTrainingRequirement[];
  exemptions: string[];  // 免除項目
  specialConditions?: string;
}

// マスターデータ
export interface TrainingSystemMaster {
  id: string;
  version: string;
  effectiveDate: string;
  programs: TrainingProgram[];
  legalRequirements: LegalTrainingRequirement[];
  probationPrograms: ProbationProgram[];
  customPrograms: CustomProgramBuilder[];
  facilityCustomizations: FacilityCustomization[];
  templates: ProgramTemplate[];
  status: 'draft' | 'active' | 'archived';
  approvedBy?: string;
  approvedAt?: string;
}

// プログラムテンプレート
export interface ProgramTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  baseProgram: Partial<TrainingProgram>;
  applicableTo: string[];  // 適用可能な対象
  tags: string[];
}