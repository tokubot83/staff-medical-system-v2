// 経験年数に基づく職員分類と制御のユーティリティ関数

export type ExperienceCategory = 'new' | 'junior' | 'midlevel' | 'veteran' | 'chief' | 'manager' | 'medical_affairs';
export type ExperienceLevel = ExperienceCategory; // 互換性のため

export interface ExperienceCategoryInfo {
  level: ExperienceCategory;
  label: string;
  minYears: number;
  maxYears?: number;
  description: string;
}

// 経験年数による職員分類定義
export const EXPERIENCE_CATEGORIES: ExperienceCategoryInfo[] = [
  {
    level: 'new',
    label: '新人',
    minYears: 0,
    maxYears: 1,
    description: '1年目の新人看護師'
  },
  {
    level: 'junior',
    label: '一般',
    minYears: 2,
    maxYears: 3,
    description: '2-3年目の一般看護師'
  },
  {
    level: 'midlevel',
    label: '中堅',
    minYears: 4,
    maxYears: 10,
    description: '4-10年目の中堅看護師'
  },
  {
    level: 'veteran',
    label: 'ベテラン',
    minYears: 11,
    description: '11年目以上のベテラン看護師'
  }
];

// 管理職・役職者の分類
export const MANAGEMENT_CATEGORIES: ExperienceCategoryInfo[] = [
  {
    level: 'chief',
    label: '主任',
    minYears: 5,
    description: '主任・リーダー級'
  },
  {
    level: 'manager',
    label: '師長',
    minYears: 10,
    description: '看護師長・管理職'
  }
];

// 事務職員の分類
export const ADMINISTRATIVE_CATEGORIES: ExperienceCategoryInfo[] = [
  {
    level: 'medical_affairs',
    label: '医事課職員',
    minYears: 0,
    description: '医事課・事務職員'
  }
];

/**
 * 入職日から経験年数を計算
 * @param joinDate 入職日（YYYY-MM-DD形式）
 * @param baseDate 基準日（省略時は現在日付）
 * @returns 経験年数（小数点以下1桁）
 */
export function calculateExperienceYears(
  joinDate: string,
  baseDate: Date = new Date()
): number {
  const join = new Date(joinDate);
  const diffMs = baseDate.getTime() - join.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(diffYears * 10) / 10;
}

/**
 * 通算経験年数から職員分類を判定
 * @param totalYears 通算経験年数
 * @param isManagement 管理職かどうか
 * @returns 経験レベル
 */
export function getExperienceLevel(
  totalYears: number,
  isManagement: boolean = false
): ExperienceCategory {
  if (isManagement) {
    // 管理職の場合は管理職分類を優先
    for (const category of MANAGEMENT_CATEGORIES) {
      if (totalYears >= category.minYears) {
        return category.level;
      }
    }
  }

  // 経験年数に基づく分類（境界値を明確に）
  if (totalYears <= 1) {
    return 'new';  // 1年目まで（0-1年）
  } else if (totalYears <= 3) {
    return 'junior';  // 2-3年目
  } else if (totalYears <= 10) {
    return 'midlevel';  // 4-10年目
  } else {
    return 'veteran';  // 11年目以上
  }
}

/**
 * 経験年数から適切なExperienceCategoryを取得
 * @param yearsOfExperience 経験年数
 * @param isManagement 管理職かどうか
 * @returns ExperienceCategory
 */
export function getExperienceCategory(
  yearsOfExperience: number,
  isManagement: boolean = false
): ExperienceCategory {
  return getExperienceLevel(yearsOfExperience, isManagement);
}

/**
 * ExperienceCategoryのラベルを取得
 * @param category ExperienceCategory
 * @returns カテゴリのラベル
 */
export function getExperienceCategoryLabel(category: ExperienceCategory): string {
  const allCategories = [...EXPERIENCE_CATEGORIES, ...MANAGEMENT_CATEGORIES, ...ADMINISTRATIVE_CATEGORIES];
  const categoryInfo = allCategories.find(c => c.level === category);
  return categoryInfo?.label || '一般';
}

/**
 * 経験レベルに応じた表示項目を取得
 * @param level 経験レベル
 * @returns 表示すべき項目のリスト
 */
export function getVisibleItemsByLevel(level: ExperienceCategory): string[] {
  const baseItems = [
    'basic_info',
    'career_info',
    'health_status',
    'work_attitude'
  ];

  const itemsByLevel: Record<ExperienceCategory, string[]> = {
    new: [...baseItems, 'learning_progress', 'adaptation_status'],
    junior: [...baseItems, 'skill_development', 'team_contribution'],
    midlevel: [...baseItems, 'leadership', 'mentoring', 'specialized_skills'],
    veteran: [...baseItems, 'knowledge_transfer', 'organizational_contribution', 'strategic_thinking'],
    chief: [...baseItems, 'team_management', 'staff_development', 'operational_improvement'],
    manager: [...baseItems, 'strategic_planning', 'budget_management', 'organizational_development'],
    medical_affairs: [...baseItems, 'billing_skills', 'system_operation', 'patient_service', 'compliance']
  };

  return itemsByLevel[level] || baseItems;
}

/**
 * 経験レベルに応じた評価基準を取得
 * @param level 経験レベル
 * @returns 評価基準の重み付け
 */
export function getEvaluationCriteriaByLevel(level: ExperienceCategory): Record<string, number> {
  const criteriaByLevel: Record<ExperienceCategory, Record<string, number>> = {
    new: {
      basic_skills: 0.4,
      learning_attitude: 0.3,
      teamwork: 0.2,
      communication: 0.1
    },
    junior: {
      technical_skills: 0.3,
      problem_solving: 0.25,
      teamwork: 0.25,
      communication: 0.2
    },
    midlevel: {
      leadership: 0.3,
      technical_expertise: 0.25,
      mentoring: 0.25,
      innovation: 0.2
    },
    veteran: {
      strategic_contribution: 0.3,
      knowledge_sharing: 0.3,
      organizational_impact: 0.25,
      innovation: 0.15
    },
    chief: {
      team_performance: 0.35,
      staff_development: 0.3,
      operational_efficiency: 0.2,
      communication: 0.15
    },
    manager: {
      strategic_leadership: 0.35,
      organizational_performance: 0.3,
      talent_management: 0.2,
      innovation: 0.15
    },
    medical_affairs: {
      billing_accuracy: 0.3,
      system_skills: 0.25,
      patient_service: 0.25,
      compliance: 0.2
    }
  };

  return criteriaByLevel[level] || criteriaByLevel.junior;
}

/**
 * 経験年数による編集権限を判定
 * @param userLevel ユーザーの経験レベル
 * @param targetLevel 対象者の経験レベル
 * @param userRole ユーザーの役職
 * @returns 編集可能かどうか
 */
export function canEditByExperience(
  userLevel: ExperienceCategory,
  targetLevel: ExperienceCategory,
  userRole?: string
): boolean {
  // 管理職は全て編集可能
  if (userRole === 'manager' || userRole === 'chief') {
    return true;
  }

  // 経験レベルの階層順
  const levelHierarchy: ExperienceCategory[] = ['new', 'junior', 'midlevel', 'veteran', 'chief', 'manager', 'medical_affairs'];
  
  const userIndex = levelHierarchy.indexOf(userLevel);
  const targetIndex = levelHierarchy.indexOf(targetLevel);

  // 自分より下位の経験レベルは編集可能
  return userIndex > targetIndex;
}

/**
 * 前職経験を含む通算経験年数を計算
 * @param currentExperience 現職での経験年数
 * @param previousExperience 前職での経験年数（文字列形式: "3年6ヶ月"）
 * @returns 通算経験年数
 */
export function calculateTotalExperience(
  currentExperience: number,
  previousExperience?: string
): number {
  if (!previousExperience) {
    return currentExperience;
  }

  // "3年6ヶ月" のような形式をパース
  const yearMatch = previousExperience.match(/(\d+)年/);
  const monthMatch = previousExperience.match(/(\d+)ヶ月/);

  const years = yearMatch ? parseInt(yearMatch[1]) : 0;
  const months = monthMatch ? parseInt(monthMatch[1]) : 0;

  return currentExperience + years + months / 12;
}