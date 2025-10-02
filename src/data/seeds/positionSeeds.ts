/**
 * 役職マスター シードデータ
 * Phase 1-2: 役職マスター独立化
 *
 * Phase 3の施設別権限レベル（1-18）に対応
 * 立神リハビリの統括主任はレベル7に設定
 */

export interface PositionSeed {
  id: string;
  code: string;
  name: string;
  level: number; // 1-18の権限レベル
  category: 'staff' | 'nursing_middle' | 'nursing_senior' | 'medical' | 'administrative' | 'executive';
  requiresManagementTraining: boolean;
  canApproveLeave: boolean;
  canPerformEvaluation: boolean;
  displayOrder: number;
  isActive: boolean;
}

export const positionSeeds: PositionSeed[] = [
  // 一般職（レベル1）
  {
    id: 'POS_001',
    code: 'NONE',
    name: 'なし',
    level: 1,
    category: 'staff',
    requiresManagementTraining: false,
    canApproveLeave: false,
    canPerformEvaluation: false,
    displayOrder: 1,
    isActive: true,
  },

  // 看護中間管理職（レベル7-9）
  {
    id: 'POS_002',
    code: 'ASST_CHIEF',
    name: '副主任',
    level: 7,
    category: 'nursing_middle',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: false,
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'POS_003',
    code: 'CHIEF',
    name: '主任',
    level: 8,
    category: 'nursing_middle',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'POS_004',
    code: 'ASST_HEAD_NURSE',
    name: '副師長',
    level: 9,
    category: 'nursing_middle',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 4,
    isActive: true,
  },

  // 看護上級管理職（レベル10-12）
  {
    id: 'POS_005',
    code: 'HEAD_NURSE',
    name: '師長',
    level: 10,
    category: 'nursing_senior',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 7,
    isActive: true,
  },

  // 医療職・事務職 中間管理職（レベル7-9）
  {
    id: 'POS_006',
    code: 'ASST_SECTION_CHIEF',
    name: '副科長',
    level: 7,
    category: 'medical',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: false,
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'POS_007',
    code: 'ASST_DEPT_CHIEF',
    name: '副課長',
    level: 7,
    category: 'administrative',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: false,
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'POS_008',
    code: 'SECTION_CHIEF',
    name: '科長',
    level: 9,
    category: 'medical',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 8,
    isActive: true,
  },
  {
    id: 'POS_009',
    code: 'DEPT_CHIEF',
    name: '課長',
    level: 9,
    category: 'administrative',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 9,
    isActive: true,
  },
  {
    id: 'POS_010',
    code: 'OFFICE_CHIEF',
    name: '室長',
    level: 10,
    category: 'administrative',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 10,
    isActive: true,
  },

  // 上級管理職（レベル11-13）
  {
    id: 'POS_011',
    code: 'VICE_DIRECTOR',
    name: '副部長',
    level: 11,
    category: 'medical',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 11,
    isActive: true,
  },
  {
    id: 'POS_012',
    code: 'DIRECTOR',
    name: '部長',
    level: 12,
    category: 'medical',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 12,
    isActive: true,
  },
  {
    id: 'POS_013',
    code: 'MEDICAL_DIRECTOR',
    name: '医局長',
    level: 13,
    category: 'medical',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 13,
    isActive: true,
  },
  {
    id: 'POS_014',
    code: 'ADMIN_DIRECTOR',
    name: '事務長',
    level: 12,
    category: 'administrative',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 14,
    isActive: true,
  },

  // 経営層（レベル14-18）
  {
    id: 'POS_015',
    code: 'VICE_PRESIDENT',
    name: '副院長',
    level: 15,
    category: 'executive',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 15,
    isActive: true,
  },
  {
    id: 'POS_016',
    code: 'PRESIDENT',
    name: '院長',
    level: 16,
    category: 'executive',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 16,
    isActive: true,
  },
  {
    id: 'POS_017',
    code: 'FACILITY_DIRECTOR',
    name: '施設長',
    level: 16,
    category: 'executive',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 17,
    isActive: true,
  },

  // 法人本部役職（レベル14-18）
  {
    id: 'POS_018',
    code: 'HR_STAFF',
    name: '人事部門員',
    level: 5,
    category: 'administrative',
    requiresManagementTraining: false,
    canApproveLeave: false,
    canPerformEvaluation: false,
    displayOrder: 18,
    isActive: true,
  },
  {
    id: 'POS_019',
    code: 'HR_MANAGER',
    name: '人事各部門長',
    level: 12,
    category: 'administrative',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 19,
    isActive: true,
  },
  {
    id: 'POS_020',
    code: 'STRATEGY_STAFF',
    name: '戦略企画部門員',
    level: 5,
    category: 'administrative',
    requiresManagementTraining: false,
    canApproveLeave: false,
    canPerformEvaluation: false,
    displayOrder: 20,
    isActive: true,
  },
  {
    id: 'POS_021',
    code: 'STRATEGY_MANAGER',
    name: '戦略企画部門長',
    level: 12,
    category: 'administrative',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 21,
    isActive: true,
  },
  {
    id: 'POS_022',
    code: 'CHAIRMAN',
    name: '理事長',
    level: 18,
    category: 'executive',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 22,
    isActive: true,
  },
  {
    id: 'POS_023',
    code: 'CORPORATE_ADMIN_DIRECTOR',
    name: '法人事務局長',
    level: 17,
    category: 'executive',
    requiresManagementTraining: true,
    canApproveLeave: true,
    canPerformEvaluation: true,
    displayOrder: 23,
    isActive: true,
  },
];

/**
 * 役職コードから役職名を取得
 */
export function getPositionNameByCode(code: string): string | undefined {
  return positionSeeds.find(p => p.code === code)?.name;
}

/**
 * 役職IDから役職情報を取得
 */
export function getPositionById(id: string): PositionSeed | undefined {
  return positionSeeds.find(p => p.id === id);
}

/**
 * 権限レベルから役職リストを取得
 */
export function getPositionsByLevel(level: number): PositionSeed[] {
  return positionSeeds.filter(p => p.level === level && p.isActive);
}

/**
 * 権限レベル以上の役職を取得
 */
export function getPositionsAboveLevel(level: number): PositionSeed[] {
  return positionSeeds.filter(p => p.level >= level && p.isActive);
}

/**
 * カテゴリー別の役職リストを取得
 */
export function getPositionsByCategory(category: PositionSeed['category']): PositionSeed[] {
  return positionSeeds.filter(p => p.category === category && p.isActive);
}

/**
 * 管理職研修が必要な役職を取得
 */
export function getPositionsRequiringManagementTraining(): PositionSeed[] {
  return positionSeeds.filter(p => p.requiresManagementTraining && p.isActive);
}

/**
 * 評価権限を持つ役職を取得
 */
export function getPositionsWithEvaluationAuthority(): PositionSeed[] {
  return positionSeeds.filter(p => p.canPerformEvaluation && p.isActive);
}

/**
 * 有効な役職のみを取得
 */
export function getActivePositions(): PositionSeed[] {
  return positionSeeds.filter(p => p.isActive);
}
