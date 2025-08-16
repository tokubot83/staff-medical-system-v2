// 定期面談バンク - 型定義
// 入職年月日から自動算出される経験年数分類

export type ExperienceLevel = 'new' | 'junior' | 'midlevel' | 'veteran' | 'leader';
export type FacilityType = 'acute' | 'chronic' | 'roken' | 'grouphome' | 'clinic';
export type ProfessionType = 'nurse' | 'assistant-nurse' | 'nursing-aide' | 'care-worker' | 'pt' | 'ot' | 'st' | 'admin';
export type InterviewDuration = 15 | 30 | 45 | 60;
export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'scale' | 'matrix';
export type MotivationType = 'growth' | 'recognition' | 'stability' | 'teamwork' | 'efficiency' | 'compensation' | 'creativity';

// 経験年数の自動算出関数
export function calculateExperienceLevel(hireDate: Date): { level: ExperienceLevel; years: number; months: number } {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - hireDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  let level: ExperienceLevel;
  if (years === 0) {
    level = 'new'; // 新人（1年目）
  } else if (years <= 3) {
    level = 'junior'; // 若手（2～3年）
  } else if (years <= 10) {
    level = 'midlevel'; // 中堅（4～10年）
  } else {
    level = 'veteran'; // ベテラン（11年以上）
  }

  // リーダー・管理職は別途判定が必要
  return { level, years, months };
}

// 質問定義
export interface InterviewQuestion {
  id: string;
  content: string;
  type: QuestionType;
  category: QuestionCategory;
  section: SectionType;
  priority: 1 | 2 | 3; // 1:必須, 2:推奨, 3:オプション
  minDuration: InterviewDuration; // この質問が含まれる最小時間
  tags: string[];
  placeholder?: string;
  options?: QuestionOption[];
  validations?: ValidationRule[];
  conditions?: QuestionCondition[]; // 表示条件
  followUpQuestions?: string[]; // フォローアップ質問のID
  scoreWeight?: number; // 評価での重み
}

// 質問カテゴリー
export type QuestionCategory = 
  | 'workplace_adaptation'    // 職場適応
  | 'skill_assessment'        // スキル評価
  | 'growth_development'      // 成長・育成
  | 'motivation_engagement'   // モチベーション・エンゲージメント
  | 'stress_health'          // ストレス・健康
  | 'career_planning'        // キャリアプラン
  | 'team_collaboration'     // チーム連携
  | 'leadership_management'  // リーダーシップ・マネジメント
  | 'knowledge_transfer'     // 知識継承
  | 'innovation_improvement' // イノベーション・改善
  | 'support_needs'         // サポートニーズ
  | 'facility_specific';    // 施設特有

// セクションタイプ
export type SectionType = 
  | 'motivation_assessment'  // 動機タイプ判定
  | 'current_status'        // 現状確認
  | 'skill_evaluation'      // スキル評価
  | 'goal_setting'          // 目標設定
  | 'support_planning'      // サポート計画
  | 'career_development'    // キャリア開発
  | 'team_environment'      // チーム環境
  | 'health_wellbeing'      // 健康・ウェルビーイング
  | 'feedback_reflection'   // フィードバック・振り返り
  | 'action_plan';          // アクションプラン

// 質問オプション
export interface QuestionOption {
  value: string;
  label: string;
  score?: number;
  motivationType?: MotivationType;
}

// バリデーションルール
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

// 質問の表示条件
export interface QuestionCondition {
  type: 'experienceLevel' | 'facilityType' | 'profession' | 'motivationType' | 'previousAnswer';
  values: string[];
  operator?: 'equals' | 'contains' | 'notEquals';
}

// セクション定義
export interface InterviewSection {
  id: string;
  name: string;
  description?: string;
  order: number;
  type: SectionType;
  minDuration: number; // 最小所要時間（分）
  maxQuestions: {
    15: number;
    30: number;
    45: number;
    60: number;
  };
  questions: string[]; // 質問ID配列
  conditions?: SectionCondition[];
}

// セクション表示条件
export interface SectionCondition {
  type: 'experienceLevel' | 'facilityType' | 'profession' | 'duration';
  values: any[];
}

// 面談テンプレート
export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  experienceLevel: ExperienceLevel;
  facilityType?: FacilityType;
  profession: ProfessionType;
  duration: InterviewDuration;
  sections: string[]; // セクションID配列
  customizable: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

// 動的生成パラメータ
export interface InterviewGenerationParams {
  staffId: string;
  staffName: string;
  hireDate: Date;
  facilityType: FacilityType;
  department: string;
  profession: ProfessionType;
  duration: InterviewDuration;
  interviewerId: string;
  interviewerName: string;
  interviewDate: Date;
  previousInterviewId?: string; // 前回面談参照用
  customQuestions?: string[]; // カスタム質問ID
  excludeQuestions?: string[]; // 除外する質問ID
}

// 生成された面談シート
export interface GeneratedInterviewSheet {
  id: string;
  params: InterviewGenerationParams;
  experienceInfo: {
    level: ExperienceLevel;
    years: number;
    months: number;
  };
  sections: InterviewSectionInstance[];
  totalQuestions: number;
  estimatedDuration: number;
  createdAt: Date;
}

// 実行時のセクションインスタンス
export interface InterviewSectionInstance {
  sectionId: string;
  name: string;
  type: SectionType;
  questions: InterviewQuestionInstance[];
  order: number;
}

// 実行時の質問インスタンス
export interface InterviewQuestionInstance {
  questionId: string;
  content: string;
  type: QuestionType;
  required: boolean;
  answer?: any;
  options?: QuestionOption[];
  placeholder?: string;
  validations?: ValidationRule[];
}

// 面談結果保存用
export interface InterviewResult {
  id: string;
  sheetId: string;
  staffId: string;
  interviewerId: string;
  interviewDate: Date;
  duration: number; // 実際の所要時間
  sections: SectionResult[];
  motivationType?: MotivationType;
  overallAssessment: string;
  nextActions: string[];
  nextInterviewDate?: Date;
  status: 'draft' | 'completed' | 'reviewed';
  createdAt: Date;
  updatedAt: Date;
}

// セクション結果
export interface SectionResult {
  sectionId: string;
  answers: AnswerResult[];
  notes?: string;
}

// 回答結果
export interface AnswerResult {
  questionId: string;
  answer: any;
  timestamp: Date;
}

// 評価マトリックス定義
export interface EvaluationMatrix {
  id: string;
  name: string;
  experienceLevel: ExperienceLevel;
  profession: ProfessionType;
  items: EvaluationItem[];
}

// 評価項目
export interface EvaluationItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  weight: number; // 重み
  scale: number; // 評価スケール（例：5段階）
  examples?: string[]; // 評価基準の例
}

// 動機タイプ別推奨アクション
export interface MotivationAction {
  motivationType: MotivationType;
  experienceLevel: ExperienceLevel;
  recommendedActions: string[];
  supportStrategies: string[];
  riskFactors: string[];
  successIndicators: string[];
}