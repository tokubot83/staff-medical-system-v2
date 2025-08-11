// 評価サブカテゴリー
export interface EvaluationSubcategory {
  id: string;
  name: string;
  points: number;
  evaluationCriteria: string[];
  requiredTrainings: string[];
}

// コア評価カテゴリー（大項目）
export interface CoreEvaluationCategory {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  superiorScore: number; // 上司評価の配点
  selfScore: number; // 本人評価の配点
  subcategories: EvaluationSubcategory[];
}

// 評価マスターV2
export interface EvaluationMasterV2 {
  coreCategories: CoreEvaluationCategory[];
  facilitySpecificItems?: any[]; // 施設特化項目（20点）
  evaluationWeights: {
    [categoryId: string]: {
      superior: number;
      self: number;
    };
  };
}

// 評価入力データ
export interface EvaluationInput {
  employeeId: string;
  evaluationPeriod: string;
  evaluatorType: 'superior' | 'self';
  scores: {
    [categoryId: string]: {
      grade: 'S' | 'A' | 'B' | 'C' | 'D';
      value: number; // 0.4 ~ 1.0
      comment?: string;
      subcategoryScores?: {
        [subcategoryId: string]: number;
      };
    };
  };
  trainingRecords: {
    completedTrainings: string[];
    plannedTrainings: string[];
  };
  overallComment?: string;
  submittedAt?: Date;
}

// 評価結果
export interface EvaluationResult {
  employeeId: string;
  evaluationPeriod: string;
  coreEvaluation: {
    categories: {
      [categoryId: string]: {
        name: string;
        superiorScore: number;
        selfScore: number;
        totalScore: number;
        grade: string;
      };
    };
    totalScore: number; // 30点満点
  };
  facilityEvaluation?: {
    score: number; // 20点満点
  };
  contributionEvaluation?: {
    facilityScore: number; // 25点満点
    corporateScore: number; // 25点満点
  };
  overallScore: number; // 100点満点
  trainingStatus: {
    mandatoryCompleted: boolean;
    completionRate: number;
    missingTrainings: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

// 研修記録
export interface TrainingRecord {
  trainingId: string;
  trainingName: string;
  completedDate: Date;
  score?: number;
  certificate?: string;
  mandatory: boolean;
  legal?: boolean;
}

// 評価シート設定
export interface EvaluationSheetConfig {
  facilityType: 'acute' | 'chronic' | 'roken' | 'grouphome' | 'outpatient';
  jobType: 'nurse' | 'assistantNurse' | 'nursingAide' | 'careWorker';
  experienceLevel: 'new' | 'junior' | 'midlevel' | 'veteran' | 'chief' | 'manager';
  evaluationPattern: 'pattern2'; // 項目別差別化型
  coreEvaluationEnabled: boolean;
  facilitySpecificEnabled: boolean;
  contributionEvaluationEnabled: boolean;
}