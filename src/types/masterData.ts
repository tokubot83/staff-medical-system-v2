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
    description?: string; // 組み合わせの説明
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

// 影響分析関連
export interface ImpactAnalysis {
  id: string;
  analysisName: string;
  targetSystemId: string;
  baselineSystemId: string;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'analyzing' | 'completed' | 'archived';

  // 分析対象
  targetChanges: {
    scoreChanges?: {
      technical: { from: number; to: number };
      contribution: { from: number; to: number };
    };
    thresholdChanges?: {
      grade: string;
      from: { min: number; max: number };
      to: { min: number; max: number };
    }[];
    matrixChanges?: boolean;
  };

  // 分析結果
  results?: ImpactAnalysisResults;
}

export interface ImpactAnalysisResults {
  executedAt: string;

  // 個人レベルの影響
  individualImpacts: {
    totalEmployees: number;
    impactedEmployees: number;
    impactPercentage: number;

    // グレード変動
    gradeChanges: {
      improved: number; // グレード上昇人数
      unchanged: number; // グレード維持人数
      declined: number; // グレード下降人数
    };

    // 詳細リスト（上位影響者）
    topPositiveImpacts: EmployeeImpact[];
    topNegativeImpacts: EmployeeImpact[];
    highRiskEmployees: EmployeeImpact[]; // 大幅下降リスク
  };

  // 部署レベルの影響
  departmentImpacts: {
    byDepartment: DepartmentImpact[];
    mostImproved: DepartmentImpact[];
    mostDeclined: DepartmentImpact[];
  };

  // 給与・賞与への影響
  compensationImpacts: {
    totalCostChange: number; // 総人件費の変動
    averageSalaryChange: number; // 平均給与変動
    bonusPoolChange: number; // 賞与原資への影響

    // グレード別給与影響
    byGrade: {
      grade: string;
      currentAverage: number;
      newAverage: number;
      changeAmount: number;
      changePercentage: number;
      employeeCount: number;
    }[];

    // 部署別コスト影響
    byDepartment: {
      departmentId: string;
      departmentName: string;
      currentCost: number;
      newCost: number;
      changeAmount: number;
      changePercentage: number;
    }[];
  };

  // リスクアラート
  riskAlerts: {
    level: 'critical' | 'high' | 'medium' | 'low';
    alerts: RiskAlert[];
    mitigationSuggestions: string[];
  };
}

export interface EmployeeImpact {
  employeeId: string;
  name: string;
  department: string;
  position: string;
  currentGrade: string;
  newGrade: string;
  currentScore: number;
  newScore: number;
  salaryImpact: number;
  bonusImpact: number;
  riskLevel?: 'high' | 'medium' | 'low';
}

export interface DepartmentImpact {
  departmentId: string;
  departmentName: string;
  facilityName?: string;
  employeeCount: number;

  // スコア影響
  averageScoreChange: number;
  scoreChangePercentage: number;

  // グレード分布
  gradeDistribution: {
    current: Record<string, number>;
    new: Record<string, number>;
  };

  // コスト影響
  totalCostChange: number;
  costChangePercentage: number;

  // リスク評価
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
}

export interface RiskAlert {
  type: 'legal' | 'retention' | 'morale' | 'cost' | 'fairness';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedCount?: number;
  recommendation?: string;
}

// 履歴比較関連
export interface SystemVersionHistory {
  id: string;
  versionName: string;
  systemId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'active' | 'archived' | 'planned';

  // バージョン詳細
  details: {
    totalScore: number;
    technicalScore: number;
    contributionScore: number;
    gradeThresholds: {
      S: { min: number; max: number };
      A: { min: number; max: number };
      B: { min: number; max: number };
      C: { min: number; max: number };
      D: { min: number; max: number };
    };
  };

  // 実績データ
  performance?: {
    employeeCount: number;
    averageScore: number;
    gradeDistribution: Record<string, number>;
    departmentScores: {
      departmentName: string;
      averageScore: number;
      employeeCount: number;
    }[];
  };

  // 変更履歴
  changes?: {
    changedFrom?: string; // 前バージョンID
    changedBy: string;
    changedAt: string;
    changeLog: ChangeLogEntry[];
  };
}

export interface ChangeLogEntry {
  category: 'score' | 'threshold' | 'matrix' | 'rule' | 'other';
  item: string;
  oldValue: any;
  newValue: any;
  reason?: string;
  impact?: string;
}

export interface VersionComparison {
  id: string;
  comparisonName: string;
  version1Id: string;
  version2Id: string;
  createdAt: string;
  createdBy: string;

  // 比較結果
  differences: {
    scoreChanges: {
      technical: { v1: number; v2: number; diff: number };
      contribution: { v1: number; v2: number; diff: number };
    };
    thresholdChanges: {
      grade: string;
      v1: { min: number; max: number };
      v2: { min: number; max: number };
    }[];
    performanceComparison?: {
      averageScore: { v1: number; v2: number; diff: number };
      gradeDistribution: {
        grade: string;
        v1: number;
        v2: number;
        diff: number;
      }[];
    };
  };

  // 効果測定
  effectiveness?: {
    goals: {
      goalName: string;
      target: number;
      actual: number;
      achieved: boolean;
    }[];
    kpis: {
      kpiName: string;
      v1Value: number;
      v2Value: number;
      improvement: number;
      unit: string;
    }[];
  };
}

// A/Bテスト関連
export interface ABTestConfig {
  id: string;
  testName: string;
  description: string;
  status: 'planning' | 'running' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;

  // テスト設定
  variants: {
    variantId: string;
    variantName: string; // 'A' or 'B'
    systemId: string;
    systemName: string;
    targetGroups: {
      type: 'department' | 'facility' | 'position' | 'random';
      ids?: string[];
      percentage?: number; // ランダム割り当ての場合
    }[];
    employeeCount: number;
  }[];

  // 成功指標
  successMetrics: {
    metricName: string;
    description: string;
    targetValue: number;
    unit: string;
    measurementMethod: string;
  }[];

  // テスト結果
  results?: ABTestResults;
}

export interface ABTestResults {
  executedAt: string;
  duration: number; // 日数

  // バリアント別結果
  variantResults: {
    variantId: string;
    variantName: string;

    // 基本統計
    statistics: {
      participantCount: number;
      averageScore: number;
      standardDeviation: number;
      medianScore: number;
    };

    // グレード分布
    gradeDistribution: Record<string, number>;

    // 成功指標の結果
    metricResults: {
      metricName: string;
      value: number;
      targetAchieved: boolean;
    }[];

    // 満足度
    satisfaction?: {
      averageRating: number;
      responseCount: number;
    };
  }[];

  // 統計的有意性
  statisticalAnalysis: {
    pValue: number;
    confidenceLevel: number;
    isSignificant: boolean;
    effectSize: number;
    recommendation: 'A' | 'B' | 'no_difference';
  };

  // 詳細分析
  insights: {
    winningVariant?: string;
    keyFindings: string[];
    recommendations: string[];
    risks: string[];
  };
}