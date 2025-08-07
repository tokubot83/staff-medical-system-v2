// 評価項目設定の型定義

// 大項目カテゴリ
export type EvaluationCategory = 'core' | 'knowledge' | 'education' | 'leadership' | 'growth' | 'facility';

// 経験年数レベル
export type ExperienceLevel = 'new' | 'junior' | 'midlevel' | 'veteran' | 'manager';

// 施設種別
export type FacilityType = 'acute' | 'chronic' | 'roken' | 'grouphome' | 'outpatient';

// 職種
export type JobCategory = 'nurse' | 'assistantNurse' | 'nursingAide' | 'careWorker' | 'careAssistant';

// 大項目定義
export interface MajorEvaluationItem {
  id: string;
  category: EvaluationCategory;
  name: string;
  description: string;
  maxScore: number;
  isCore: boolean; // コア項目かどうか
  applicableFacilities?: FacilityType[]; // 適用可能な施設
  applicableJobs?: JobCategory[]; // 適用可能な職種
  experienceLevels?: ExperienceLevel[]; // 推奨経験レベル
}

// 中項目定義
export interface MiddleEvaluationItem {
  id: string;
  majorItemId: string;
  name: string;
  description: string;
  score: number;
  evaluationCriteria: {
    [key in ExperienceLevel]?: string; // 経験レベル別の評価基準
  };
}

// 小項目定義
export interface MinorEvaluationItem {
  id: string;
  middleItemId: string;
  name: string;
  description: string;
  examples: string[];
}

// 施設別評価設定
export interface FacilityEvaluationConfig {
  facilityId: string;
  facilityType: FacilityType;
  facilityName: string;
  coreItems: MajorEvaluationItem[]; // コア項目（30点）
  facilityItems: {
    item: MajorEvaluationItem;
    allocatedScore: number; // 配分された点数
  }[]; // 施設特化項目（20点）
  totalScore: number; // 合計50点
  configuredBy: string; // 設定者
  configuredAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

// 評価項目マスター
export interface EvaluationMaster {
  version: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  majorItems: MajorEvaluationItem[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

// 教育研修マッピング
export interface TrainingMapping {
  evaluationItemId: string;
  trainingPrograms: {
    id: string;
    name: string;
    level: string;
    type: 'OJT' | 'OffJT' | 'e-learning';
    duration: number; // 時間
    timing: string; // 実施時期
  }[];
}