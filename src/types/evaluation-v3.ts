// 総合評価システムv3 型定義

// 経験レベル定義（新名称で統一）
export const ExperienceLevelsV3 = {
  NEW: {
    id: 'new',
    label: '新人',
    years: '～1年',
    oldLabel: '新人',
    description: '入職1年目までの職員'
  },
  YOUNG: {
    id: 'young',
    label: '若手',
    years: '2～3年',
    oldLabel: '一般',
    description: '基礎を固め応用力を身につける時期'
  },
  MIDLEVEL: {
    id: 'midlevel',
    label: '中堅',
    years: '4～10年',
    oldLabel: '中堅',
    description: '専門性を深め後輩指導も担う時期'
  },
  VETERAN: {
    id: 'veteran',
    label: 'ベテラン',
    years: '11年～',
    oldLabel: 'ベテラン',
    description: '豊富な経験と高い専門性を持つ'
  },
  WARD_CHIEF: {
    id: 'ward-chief',
    label: '病棟主任',
    years: '役職',
    oldLabel: '主任',
    description: '現場のリーダー的役割'
  },
  WARD_MANAGER: {
    id: 'ward-manager',
    label: '病棟師長',
    years: '役職',
    oldLabel: '師長',
    description: '病棟の管理責任者'
  }
} as const;

export type ExperienceLevelV3 = keyof typeof ExperienceLevelsV3;

// 施設種別
export type FacilityTypeV3 = 'acute' | 'chronic' | 'roken' | 'grouphome' | 'outpatient';

// 職種
export type JobCategoryV3 = 'nurse' | 'assistantNurse' | 'nursingAide' | 'careWorker' | 'careAssistant' | 'rehab';

// 評価設計の構造
export interface V3EvaluationDesign {
  id: string;
  year: number;
  facilityType: FacilityTypeV3;
  facilityName: string;
  
  // 技術評価（50点）
  technicalEvaluation: {
    // 法人統一項目（30点）
    coreItems: {
      C01: CoreItemDesign;  // 専門技術・スキル（10点）
      C02: CoreItemDesign;  // 対人関係・ケア（10点）
      C03: CoreItemDesign;  // 安全・品質管理（10点）
    };
    // 施設特化項目（20点）
    facilityItems: FacilityItemDesign[];
  };
  
  // 貢献度評価（50点）
  contributionEvaluation: {
    facilityContribution: ContributionDesign;  // 施設貢献度（25点）
    corporateContribution: ContributionDesign; // 法人貢献度（25点）
  };
  
  status: 'draft' | 'reviewing' | 'approved' | 'active';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  approvedBy?: string;
}

// 法人統一項目の設計
export interface CoreItemDesign {
  itemCode: string;
  itemName: string;
  totalPoints: number;  // 10点固定
  distribution: {
    superior: number;   // 上司評価の配点
    self: number;      // 本人評価の配点
  };
  middleItems: MiddleItemDesign[];
}

// 中項目の設計
export interface MiddleItemDesign {
  id: string;
  name: string;
  points: number;
  type: 'mandatory' | 'training-linked' | 'facility-specific';
  linkedTraining?: string;  // 法定研修との連動
  questions: QuestionDesign[];
}

// 設問の設計
export interface QuestionDesign {
  id: string;
  question: string;
  points: number;  // 1点固定
  evaluator: 'superior' | 'self';
  autoSelected: boolean;
  selectionReason?: string;
  experienceLevels: string[];  // 対象経験レベル
  keywords: string[];
  usageCount: number;
  lastUsed?: Date;
}

// 施設特化項目の設計
export interface FacilityItemDesign {
  itemId: string;
  itemName: string;
  category: string;
  points: number;
  description: string;
  evaluationCriteria: string[];
}

// 貢献度評価の設計
export interface ContributionDesign {
  evaluationPeriod: 'summer' | 'winter';
  totalPoints: number;  // 25点
  evaluationMethod: 'relative' | 'absolute';
  criteria: {
    S: { min: number; max: number; points: number };
    A: { min: number; max: number; points: number };
    B: { min: number; max: number; points: number };
    C: { min: number; max: number; points: number };
    D: { min: number; max: number; points: number };
  };
}

// シミュレーション関連
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  design: Partial<V3EvaluationDesign>;
  analysis: {
    scoreDistribution: ScoreDistribution;
    facilityComparison: FacilityComparison;
    fairnessIndex: number;
    recommendations: string[];
  };
  createdAt: Date;
  createdBy: string;
}

export interface ScoreDistribution {
  mean: number;
  median: number;
  standardDeviation: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export interface FacilityComparison {
  facilities: Array<{
    name: string;
    averageScore: number;
    staffCount: number;
  }>;
}

// 設問バンク
export interface QuestionBank {
  id: string;
  category: string;
  subcategory: string;
  questions: QuestionDesign[];
  tags: string[];
  facilityTypes: FacilityTypeV3[];
  jobCategories: JobCategoryV3[];
  experienceLevels: string[];
}

// 個人評価実行
export interface V3PersonalEvaluation {
  id: string;
  staffId: string;
  staffName: string;
  evaluationPeriod: string;
  experienceLevel: string;
  experienceLabel: string;
  
  technicalScore: {
    coreItems: number;      // 30点満点
    facilityItems: number;  // 20点満点
    total: number;         // 50点満点
  };
  
  contributionScore: {
    facility: number;      // 25点満点
    corporate: number;     // 25点満点
    total: number;        // 50点満点
  };
  
  totalScore: number;     // 100点満点
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  
  status: 'in-progress' | 'completed' | 'disclosed' | 'appealed';
  evaluatedAt?: Date;
  disclosedAt?: Date;
  feedback?: string;
  appealReason?: string;
  appealResult?: string;
}