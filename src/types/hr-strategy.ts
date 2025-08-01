// 2軸評価パターン分析のための型定義

export type EvaluationGrade = 'S' | 'A' | 'B' | 'C' | 'D';
export type FinalEvaluationGrade = 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';

// 評価パターンの定義
export type EvaluationPattern = 
  | 'local-star'              // 病院のスター型
  | 'corporate-powerhouse'    // 大規模病院の実力者型
  | 'corporate-ace'           // 法人エース型
  | 'balanced-excellence'     // バランス優秀型
  | 'hidden-talent'           // 隠れた逸材型
  | 'growth-potential'        // 成長株型
  | 'specialist'              // 専門特化型
  | 'environment-mismatch'    // 環境ミスマッチ型
  | 'skill-development'       // スキル向上必要型
  | 'burnout-syndrome'        // 燃え尽き症候群型
  | 'new-employee-struggle'   // 新人適応困難型
  | 'nurse-leadership'        // 看護師リーダーシップ型
  | 'care-specialist'         // 介護職スペシャリスト型
  | 'admin-efficiency';       // 事務職効率化推進型

// 職種の定義
export type JobCategory = '看護師' | '介護職' | '医師' | 'セラピスト' | '事務職' | 'その他';

// 2軸評価データ
export interface TwoAxisEvaluation {
  employeeId: string;
  employeeName: string;
  department: string;
  jobCategory: JobCategory;
  facilityEval: EvaluationGrade;
  facilityRank: number;
  facilityTotal: number;
  corporateEval: EvaluationGrade;
  corporateRank: number;
  corporateTotal: number;
  finalEval: FinalEvaluationGrade;
  evaluationPattern: EvaluationPattern;
  yearsOfService: number;
  lastEvaluationDate: string;
}

// 異動推奨情報
export interface TransferRecommendation {
  employeeId: string;
  employeeName: string;
  currentDepartment: string;
  evaluation: TwoAxisEvaluation;
  recommendationType: 'transfer' | 'training' | 'promotion' | 'support';
  recommendationTitle: string;
  recommendationDetail: string;
  priority: 'high' | 'medium' | 'low';
  suggestedActions: string[];
  timeline: string;
}

// 評価パターン定義
export interface EvaluationPatternDefinition {
  pattern: EvaluationPattern;
  name: string;
  description: string;
  facilityRange: EvaluationGrade[];
  corporateRange: EvaluationGrade[];
  characteristics: string[];
  recommendationType: TransferRecommendation['recommendationType'];
  typicalRecommendations: string[];
}

// 部門別2軸評価サマリー
export interface DepartmentTwoAxisSummary {
  departmentName: string;
  totalStaff: number;
  evaluationDistribution: {
    [key in FinalEvaluationGrade]: number;
  };
  patternDistribution: {
    [key in EvaluationPattern]?: number;
  };
  averageFacilityScore: number;
  averageCorporateScore: number;
  topPerformers: TwoAxisEvaluation[];
  transferCandidates: TransferRecommendation[];
}

// 職種別評価分析
export interface JobCategoryAnalysis {
  jobCategory: JobCategory;
  totalCount: number;
  evaluationMatrix: {
    facility: EvaluationGrade;
    corporate: EvaluationGrade;
    count: number;
    percentage: number;
  }[];
  dominantPatterns: {
    pattern: EvaluationPattern;
    count: number;
    percentage: number;
  }[];
  recommendations: string[];
}