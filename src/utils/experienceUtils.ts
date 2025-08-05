// 経験年数に基づく職員分類と制御のユーティリティ関数

export type ExperienceLevel = 'new' | 'general' | 'senior' | 'veteran' | 'chief' | 'leader';

export interface ExperienceCategory {
  level: ExperienceLevel;
  label: string;
  minYears: number;
  maxYears?: number;
  description: string;
}

// 経験年数による職員分類定義
export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  {
    level: 'new',
    label: '新人',
    minYears: 0,
    maxYears: 1,
    description: '1年目の新人看護師'
  },
  {
    level: 'general',
    label: '一般',
    minYears: 2,
    maxYears: 3,
    description: '2-3年目の一般看護師'
  },
  {
    level: 'senior',
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
export const MANAGEMENT_CATEGORIES: ExperienceCategory[] = [
  {
    level: 'leader',
    label: '主任',
    minYears: 5,
    description: '主任・リーダー級'
  },
  {
    level: 'chief',
    label: '師長',
    minYears: 10,
    description: '看護師長・管理職'
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
): ExperienceLevel {
  if (isManagement) {
    // 管理職の場合は管理職分類を優先
    for (const category of MANAGEMENT_CATEGORIES) {
      if (totalYears >= category.minYears) {
        return category.level;
      }
    }
  }

  // 一般職員の分類
  for (const category of EXPERIENCE_CATEGORIES) {
    if (
      totalYears >= category.minYears &&
      (category.maxYears === undefined || totalYears <= category.maxYears)
    ) {
      return category.level;
    }
  }

  // デフォルトは新人
  return 'new';
}

/**
 * 経験レベルに応じた表示項目を取得
 * @param level 経験レベル
 * @returns 表示すべき項目のリスト
 */
export function getVisibleItemsByLevel(level: ExperienceLevel): string[] {
  const baseItems = [
    'basic_info',
    'career_info',
    'health_status',
    'work_attitude'
  ];

  const itemsByLevel: Record<ExperienceLevel, string[]> = {
    new: [...baseItems, 'learning_progress', 'adaptation_status'],
    general: [...baseItems, 'skill_development', 'team_contribution'],
    senior: [...baseItems, 'leadership', 'mentoring', 'specialized_skills'],
    veteran: [...baseItems, 'knowledge_transfer', 'organizational_contribution', 'strategic_thinking'],
    leader: [...baseItems, 'team_management', 'staff_development', 'operational_improvement'],
    chief: [...baseItems, 'strategic_planning', 'budget_management', 'organizational_development']
  };

  return itemsByLevel[level] || baseItems;
}

/**
 * 経験レベルに応じた評価基準を取得
 * @param level 経験レベル
 * @returns 評価基準の重み付け
 */
export function getEvaluationCriteriaByLevel(level: ExperienceLevel): Record<string, number> {
  const criteriaByLevel: Record<ExperienceLevel, Record<string, number>> = {
    new: {
      basic_skills: 0.4,
      learning_attitude: 0.3,
      teamwork: 0.2,
      communication: 0.1
    },
    general: {
      technical_skills: 0.3,
      problem_solving: 0.25,
      teamwork: 0.25,
      communication: 0.2
    },
    senior: {
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
    leader: {
      team_performance: 0.35,
      staff_development: 0.3,
      operational_efficiency: 0.2,
      communication: 0.15
    },
    chief: {
      strategic_leadership: 0.35,
      organizational_performance: 0.3,
      talent_management: 0.2,
      innovation: 0.15
    }
  };

  return criteriaByLevel[level] || criteriaByLevel.general;
}

/**
 * 経験年数による編集権限を判定
 * @param userLevel ユーザーの経験レベル
 * @param targetLevel 対象者の経験レベル
 * @param userRole ユーザーの役職
 * @returns 編集可能かどうか
 */
export function canEditByExperience(
  userLevel: ExperienceLevel,
  targetLevel: ExperienceLevel,
  userRole?: string
): boolean {
  // 管理職は全て編集可能
  if (userRole === 'manager' || userRole === 'chief') {
    return true;
  }

  // 経験レベルの階層順
  const levelHierarchy: ExperienceLevel[] = ['new', 'general', 'senior', 'veteran', 'leader', 'chief'];
  
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