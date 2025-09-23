export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'textarea';

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: any;
  hidden?: boolean;
  readonly?: boolean;
}

export interface MasterSchema {
  name: string;
  label: string;
  fields: FieldDefinition[];
  searchableFields?: string[];
  sortableFields?: string[];
  exportFields?: string[];
}

export interface MasterRecord {
  id: string;
  data: Record<string, any>;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    version?: number;
  };
  customFields?: Record<string, any>;
}

export interface ChangeHistory {
  id: string;
  masterType: string;
  recordId: string;
  action: 'create' | 'update' | 'delete';
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: string;
  userId?: string;
  userName?: string;
}

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  errors?: {
    row: number;
    field?: string;
    message: string;
  }[];
}

// 評価制度マスター関連の型定義
export interface EvaluationSystemMaster {
  id: string;
  systemName: string;
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  totalScore: number;
  isActive: boolean;
  scoreComponents: ScoreComponent[];
  relativeEvaluationRules: RelativeEvaluationRule[];
  gradeConversionRules: GradeConversionRule[];
  matrixDefinition: MatrixDefinition;
  finalGradeDefinition: FinalGradeDefinition;
}

export interface ScoreComponent {
  id: string;
  categoryId: string;
  categoryName: string;
  score: number;
  evaluationType: 'absolute' | 'relative';
  subComponents?: {
    id: string;
    name: string;
    score: number;
    evaluationPeriod?: string;
  }[];
}

export interface RelativeEvaluationRule {
  id: string;
  evaluationUnit: 'facility' | 'corporate' | 'department';
  comparisonScope: string; // '同一施設・同一職種' など
  percentileRanges: {
    grade: string;
    minPercentile: number;
    maxPercentile: number;
    score: number;
  }[];
}

export interface GradeConversionRule {
  id: string;
  ruleName: string;
  gradeDefinitions: {
    grade: string;
    minPercentile: number;
    maxPercentile: number;
    description: string;
  }[];
}

export interface MatrixDefinition {
  id: string;
  dimensions: number; // 2軸、3軸など
  axes: {
    axisName: string;
    evaluationType: string;
  }[];
  conversionTable: {
    inputs: Record<string, string>; // { facility: 'S', corporate: 'A' }
    output: string; // 'S+'
    priority: number;
  }[];
}

export interface FinalGradeDefinition {
  id: string;
  gradeCount: number; // 7段階、9段階など
  grades: {
    grade: string;
    rank: number;
    label: string;
    color: string;
    description: string;
  }[];
}

export interface ContributionItemMaster {
  id: string;
  itemName: string;
  category: 'facility' | 'corporate';
  period: string; // '夏季'、'冬季'など
  baseScore: number;
  evaluationElements: {
    elementName: string;
    score: number;
    description?: string;
  }[];
  applicablePositions?: string[];
  applicableDepartments?: string[];
}

export interface PeriodScoreAllocation {
  id: string;
  systemId: string;
  allocationPattern: string; // '標準均等型'、'年度末重視型'など
  periods: {
    periodName: string;
    startMonth: number;
    endMonth: number;
    score: number;
    facilityScore?: number;
    corporateScore?: number;
  }[];
}

// 部署別カスタマイズ権限
export interface DepartmentCustomPermission {
  id: string;
  departmentId: string;
  departmentName: string;
  facilityName?: string;

  // カスタマイズ可能項目
  customizableItems: {
    scoreAdjustment?: {
      allowed: boolean;
      range: number; // ±10点など
      requiresApproval: boolean;
    };
    itemAddition?: {
      allowed: boolean;
      maxItems: number;
      requiresApproval: boolean;
      allowedCategories?: string[];
    };
    thresholdChange?: {
      allowed: boolean;
      requiresApproval: boolean;
    };
    gradeConversion?: {
      allowed: boolean;
      requiresApproval: boolean;
    };
    matrixCustomization?: {
      allowed: boolean;
      requiresApproval: boolean;
    };
  };

  // 管理者情報
  managers: {
    primary: string; // 主管理者
    secondary?: string; // 副管理者
    delegates?: string[]; // 代理者
  };

  // 設定状態
  status: 'active' | 'pending' | 'suspended';
  validFrom: string;
  validUntil?: string;

  // 承認情報
  approvedBy?: string;
  approvedAt?: string;
  lastModified: string;
  modifiedBy: string;
}

// カスタマイズ申請
export interface CustomizationRequest {
  id: string;
  departmentId: string;
  departmentName: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;

  // 申請内容
  requestType: 'score_adjustment' | 'item_addition' | 'threshold_change' | 'other';
  requestDetails: {
    current: any;
    proposed: any;
    reason: string;
    impact: string;
    testPeriod?: string;
  };

  // 承認ワークフロー
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  approvalLevel: number; // 承認段階
  approvers: {
    level: number;
    approverId: string;
    approverName: string;
    decision?: 'approved' | 'rejected' | 'revision_requested';
    comment?: string;
    decidedAt?: string;
  }[];

  // 条件付き承認
  conditions?: {
    condition: string;
    deadline?: string;
  }[];

  finalDecision?: string;
  implementationDate?: string;
}

// 部署別カスタマイズ設定
export interface DepartmentCustomSettings {
  id: string;
  departmentId: string;
  systemId: string;

  // カスタマイズされた配点
  customScores?: {
    technical?: number;
    contribution?: number;
    customItems?: {
      itemName: string;
      score: number;
      category: string;
    }[];
  };

  // カスタマイズされた評価項目
  customEvaluationItems?: {
    itemId: string;
    itemName: string;
    description: string;
    maxScore: number;
    evaluationType: string;
    isRequired: boolean;
  }[];

  // カスタマイズされた閾値
  customThresholds?: {
    grade: string;
    minPercentile?: number;
    maxPercentile?: number;
    minScore?: number;
    maxScore?: number;
  }[];

  // 変更履歴
  changeHistory: {
    changeDate: string;
    changedBy: string;
    changeType: string;
    previousValue: any;
    newValue: any;
    approvedBy?: string;
  }[];
}

// 評価シミュレーション関連
export interface EvaluationSimulation {
  id: string;
  simulationName: string;
  targetSystemId: string;
  targetSystemName: string;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'running' | 'completed' | 'archived';

  // What-if分析条件
  conditions: {
    scoreChanges?: {
      technical: number;
      contribution: number;
      customItems?: { itemName: string; score: number }[];
    };
    thresholdChanges?: {
      grade: string;
      percentile: string;
    }[];
    periodAllocationChanges?: {
      summer: number;
      winter: number;
    };
  };

  // 検証データ
  testData: {
    dataSource: string; // '2024年度実績'など
    employeeCount: number;
    period: string;
    departments: string[];
  };

  // シミュレーション結果
  results?: SimulationResults;
}

export interface SimulationResults {
  executedAt: string;
  executionTime: number; // ミリ秒

  // 評価分布の変化
  gradeDistribution: {
    before: {
      S: number;
      A: number;
      B: number;
      C: number;
      D: number;
    };
    after: {
      S: number;
      A: number;
      B: number;
      C: number;
      D: number;
    };
    changes: {
      S: number; // 増減数
      A: number;
      B: number;
      C: number;
      D: number;
    };
  };

  // 統計情報
  statistics: {
    averageScoreBefore: number;
    averageScoreAfter: number;
    scoreDifference: number;
    standardDeviationBefore: number;
    standardDeviationAfter: number;
    medianBefore: number;
    medianAfter: number;
  };

  // 部署別影響
  departmentImpacts: {
    departmentId: string;
    departmentName: string;
    averageScoreBefore: number;
    averageScoreAfter: number;
    impact: 'positive' | 'negative' | 'neutral';
    impactLevel: number; // -100 〜 +100
    affectedEmployees: number;
  }[];

  // 職種別影響
  jobCategoryImpacts: {
    jobCategory: string;
    averageScoreBefore: number;
    averageScoreAfter: number;
    impact: 'positive' | 'negative' | 'neutral';
    impactLevel: number;
  }[];

  // 個別影響（トップ10件）
  topImpactedEmployees: {
    positive: {
      employeeId: string;
      name: string;
      department: string;
      scoreBefore: number;
      scoreAfter: number;
      gradeBefore: string;
      gradeAfter: string;
    }[];
    negative: {
      employeeId: string;
      name: string;
      department: string;
      scoreBefore: number;
      scoreAfter: number;
      gradeBefore: string;
      gradeAfter: string;
    }[];
  };

  // リスク分析
  riskAnalysis: {
    warnings: string[];
    recommendations: string[];
  };
}