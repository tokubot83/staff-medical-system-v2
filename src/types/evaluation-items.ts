// 評価項目の型定義

// 評価項目タイプ
export type EvaluationItemType =
  | 'rating'      // 5段階評価
  | 'score'       // 点数評価（0-100）
  | 'checkbox'    // チェックボックス（達成/未達成）
  | 'text'        // テキスト評価
  | 'select'      // 選択式評価
  | 'matrix';     // マトリックス評価

// 評価カテゴリー
export interface EvaluationCategory {
  id: string;
  name: string;
  description?: string;
  weight: number; // 配点比率（%）
  order: number;
  items: EvaluationItem[];
  isCustom?: boolean; // カスタム項目フラグ
}

// 評価項目
export interface EvaluationItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  type: EvaluationItemType;
  required: boolean;
  weight: number; // カテゴリー内での配点
  order: number;
  options?: EvaluationOption[]; // select/matrix用
  criteria?: EvaluationCriteria[]; // 評価基準
  helpText?: string;
  tags?: string[]; // 検索用タグ
}

// 評価オプション（選択式用）
export interface EvaluationOption {
  value: string | number;
  label: string;
  score?: number;
  description?: string;
}

// 評価基準
export interface EvaluationCriteria {
  level: number; // 1-5
  label: string;
  description: string;
  scoreRange?: { min: number; max: number };
}

// 部署別カスタマイズ設定
export interface DepartmentCustomization {
  departmentId: string;
  departmentName: string;
  versionId: string;
  enabled: boolean;
  customCategories: EvaluationCategory[];
  inheritBase: boolean; // 基本項目を継承するか
  approvedBy?: string;
  approvedAt?: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

// 評価項目テンプレート
export interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  type: 'department' | 'job' | 'facility' | 'general';
  targetDepartments?: string[];
  targetJobs?: string[];
  categories: EvaluationCategory[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 評価項目設定
export interface EvaluationItemSettings {
  versionId: string;
  baseCategories: EvaluationCategory[]; // 全体共通の基本項目
  departmentCustomizations: DepartmentCustomization[];
  templates: EvaluationTemplate[];
  allowCustomization: boolean;
  customizationRules: {
    maxCustomCategories: number;
    maxCustomItems: number;
    requireApproval: boolean;
    approvers: string[];
  };
}

// 評価結果記録用
export interface EvaluationItemResult {
  itemId: string;
  categoryId: string;
  value: any; // 型によって異なる
  score?: number;
  comment?: string;
  evaluatedBy: string;
  evaluatedAt: string;
}

// 医療施設向け標準カテゴリー
export const MEDICAL_STANDARD_CATEGORIES: Partial<EvaluationCategory>[] = [
  {
    name: '専門技術',
    description: '職務に必要な専門知識と技術',
    weight: 30,
  },
  {
    name: '患者対応',
    description: '患者・家族への対応とコミュニケーション',
    weight: 25,
  },
  {
    name: 'チーム医療',
    description: '他職種との連携と協働',
    weight: 20,
  },
  {
    name: '安全管理',
    description: '医療安全とリスク管理',
    weight: 15,
  },
  {
    name: '改善活動',
    description: '業務改善と提案',
    weight: 10,
  },
];

// 部署別テンプレート例
export const DEPARTMENT_TEMPLATES: Record<string, Partial<EvaluationCategory>[]> = {
  'ICU': [
    {
      name: '緊急対応力',
      description: '緊急時の判断と対応',
      weight: 35,
    },
    {
      name: '機器管理',
      description: '医療機器の操作と管理',
      weight: 25,
    },
  ],
  'リハビリテーション': [
    {
      name: '機能評価',
      description: '患者の機能評価と計画立案',
      weight: 30,
    },
    {
      name: '指導力',
      description: '患者・家族への指導能力',
      weight: 25,
    },
  ],
  '外来': [
    {
      name: '接遇',
      description: '患者対応と接遇マナー',
      weight: 35,
    },
    {
      name: '効率性',
      description: '業務の効率的な遂行',
      weight: 20,
    },
  ],
  '手術室': [
    {
      name: '手術支援',
      description: '手術の準備と介助',
      weight: 35,
    },
    {
      name: '滅菌管理',
      description: '器材の滅菌と管理',
      weight: 25,
    },
  ],
};