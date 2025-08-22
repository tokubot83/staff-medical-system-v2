// V3評価システム バリデーション・連携制御型定義

import { V3EvaluationDesign, FacilityTypeV3, JobCategoryV3, ExperienceLevelV3 } from './evaluation-v3';

// 制度設計完了バリデーション
export interface V3EvaluationDesignValidation {
  id: string;
  year: number;
  facilityType: FacilityTypeV3;
  facilityName: string;
  status: 'draft' | 'reviewing' | 'approved' | 'active';
  
  // 技術評価設定完了状況
  technicalEvaluation: {
    coreItemsComplete: boolean;     // 法人統一30点設定済み
    facilityItemsComplete: boolean; // 施設固有20点設定済み
    totalConfigured: number;       // 設定済み項目数
    totalRequired: number;         // 必要項目数
    completionRate: number;        // 完了率 (0-100)
  };
  
  // 貢献度評価設定完了状況
  contributionEvaluation: {
    facilityContributionComplete: boolean;  // 施設貢献度設定済み
    corporateContributionComplete: boolean; // 法人貢献度設定済み
    evaluationCriteriaComplete: boolean;    // 評価基準設定済み
  };
  
  // 承認関連
  approvedBy?: string;
  approvedAt?: Date;
  approvalComments?: string;
  
  // バリデーション結果
  canStartPersonalEvaluation: boolean;
  blockingIssues: string[];
  warnings: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// 施設・職種・経験年数マッピング
export interface EvaluationItemMatrix {
  id: string;
  facilityType: FacilityTypeV3;
  jobCategory: JobCategoryV3;
  experienceLevel: ExperienceLevelV3;
  
  // 必要な評価項目
  requiredItems: {
    // 法人統一項目（30点）
    coreItems: {
      C01: { points: number; configured: boolean };  // 専門技術・スキル（10点）
      C02: { points: number; configured: boolean };  // 対人関係・ケア（10点）
      C03: { points: number; configured: boolean };  // 安全・品質管理（10点）
    };
    
    // 施設特化項目（20点）
    facilityItems: Array<{
      itemId: string;
      itemName: string;
      points: number;
      configured: boolean;
      category: string;
    }>;
  };
  
  // 評価可能状況
  isEvaluationReady: boolean;
  missingItems: string[];
  configurationProgress: number; // 0-100
}

// 年間スケジュール制御
export interface V3ScheduleControl {
  currentPhase: string;
  currentMonth: number;
  
  // フェーズ別許可アクション
  allowedActions: {
    canDesignEvaluation: boolean;      // 制度設計可能
    canApproveDesign: boolean;         // 制度承認可能
    canStartPersonalEvaluation: boolean; // 個人評価開始可能
    canConductTechnicalEval: boolean;   // 技術評価実施可能
    canConductContributionEval: boolean; // 貢献度評価実施可能
    canDiscloseResults: boolean;        // 結果開示可能
  };
  
  // 次のマイルストーン
  nextMilestone: {
    phase: string;
    dueDate: string;
    requiredActions: string[];
  };
  
  // 制約事項
  restrictions: Array<{
    action: string;
    reason: string;
    availableFrom: string;
  }>;
}

// 個人評価開始前チェック結果
export interface PersonalEvaluationPrecheck {
  staffId: string;
  staffName: string;
  facilityType: FacilityTypeV3;
  jobCategory: JobCategoryV3;
  experienceLevel: ExperienceLevelV3;
  
  // 前提条件チェック
  prerequisites: {
    designApproved: boolean;           // 制度設計承認済み
    schedulePhaseValid: boolean;       // 適切なスケジュールフェーズ
    itemsConfigured: boolean;          // 評価項目設定済み
    evaluatorAssigned: boolean;        // 評価者割当済み
  };
  
  // チェック結果
  canStartEvaluation: boolean;
  blockingIssues: Array<{
    type: 'critical' | 'warning';
    message: string;
    resolution: string;
  }>;
  
  // 利用可能な評価項目
  availableItems: {
    coreItems: number;        // 法人統一項目数
    facilityItems: number;    // 施設特化項目数
    totalPoints: number;      // 総配点
  };
  
  checkedAt: Date;
}

// バリデーションエラー
export class V3ValidationError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'V3ValidationError';
  }
}

// 制度設計完了チェック関数の型定義
export type ValidateEvaluationDesignFn = (
  facilityType: FacilityTypeV3,
  year: number
) => Promise<V3EvaluationDesignValidation>;

export type CheckPersonalEvaluationPrerequisitesFn = (
  staffId: string
) => Promise<PersonalEvaluationPrecheck>;

export type GetScheduleControlFn = () => V3ScheduleControl;