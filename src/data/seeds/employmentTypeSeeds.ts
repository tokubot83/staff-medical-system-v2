/**
 * 雇用形態マスター - シードデータ
 * Phase 1-3: 雇用形態マスター独立化
 *
 * 常勤・非常勤の区分、勤務時間制限、社会保険加入要件などを管理
 */

export interface EmploymentTypeSeed {
  id: string;
  code: string;
  name: string;
  category: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'other';
  isFullTime: boolean;
  maxHoursPerWeek: number | null; // null = 無制限
  requiresSocialInsurance: boolean;
  allowsOvertime: boolean;
  displayOrder: number;
  isActive: boolean;
  description?: string;
}

export const employmentTypeSeeds: EmploymentTypeSeed[] = [
  {
    id: 'EMP_001',
    code: 'FULL_TIME',
    name: '正規職員（常勤）',
    category: 'full_time',
    isFullTime: true,
    maxHoursPerWeek: null,
    requiresSocialInsurance: true,
    allowsOvertime: true,
    displayOrder: 1,
    isActive: true,
    description: 'フルタイムの正規職員。社会保険加入、残業可。'
  },
  {
    id: 'EMP_002',
    code: 'PART_TIME',
    name: 'パート職員',
    category: 'part_time',
    isFullTime: false,
    maxHoursPerWeek: 20,
    requiresSocialInsurance: false,
    allowsOvertime: false,
    displayOrder: 2,
    isActive: true,
    description: '週20時間以内のパート職員。社会保険なし。'
  },
  {
    id: 'EMP_003',
    code: 'CONTRACT',
    name: '契約職員（常勤）',
    category: 'contract',
    isFullTime: true,
    maxHoursPerWeek: null,
    requiresSocialInsurance: true,
    allowsOvertime: true,
    displayOrder: 3,
    isActive: true,
    description: '期限付き契約の常勤職員。社会保険加入、残業可。'
  },
  {
    id: 'EMP_004',
    code: 'CONTRACT_PART_TIME',
    name: '契約職員（非常勤）',
    category: 'contract',
    isFullTime: false,
    maxHoursPerWeek: 30,
    requiresSocialInsurance: true,
    allowsOvertime: false,
    displayOrder: 4,
    isActive: true,
    description: '期限付き契約の非常勤職員。週30時間以内。社会保険加入。'
  },
  {
    id: 'EMP_005',
    code: 'TEMPORARY',
    name: '臨時職員',
    category: 'temporary',
    isFullTime: false,
    maxHoursPerWeek: 20,
    requiresSocialInsurance: false,
    allowsOvertime: false,
    displayOrder: 5,
    isActive: true,
    description: '短期間の臨時雇用。週20時間以内。社会保険なし。'
  },
  {
    id: 'EMP_006',
    code: 'DISPATCHED',
    name: '派遣職員',
    category: 'other',
    isFullTime: false,
    maxHoursPerWeek: null,
    requiresSocialInsurance: false,
    allowsOvertime: false,
    displayOrder: 6,
    isActive: true,
    description: '人材派遣会社から派遣された職員。'
  },
  {
    id: 'EMP_007',
    code: 'SENIOR_REEMPLOYED',
    name: '嘱託職員（再雇用）',
    category: 'contract',
    isFullTime: false,
    maxHoursPerWeek: 32,
    requiresSocialInsurance: true,
    allowsOvertime: false,
    displayOrder: 7,
    isActive: true,
    description: '定年後再雇用の嘱託職員。週32時間以内。社会保険加入。'
  },
  {
    id: 'EMP_008',
    code: 'TRAINEE',
    name: '研修生',
    category: 'temporary',
    isFullTime: false,
    maxHoursPerWeek: 40,
    requiresSocialInsurance: false,
    allowsOvertime: false,
    displayOrder: 8,
    isActive: true,
    description: '研修期間中の職員。'
  }
];

/**
 * 雇用形態コードから名称を取得
 */
export function getEmploymentTypeNameByCode(code: string): string {
  return employmentTypeSeeds.find(e => e.code === code)?.name || '不明な雇用形態';
}

/**
 * IDから雇用形態を取得
 */
export function getEmploymentTypeById(id: string): EmploymentTypeSeed | undefined {
  return employmentTypeSeeds.find(e => e.id === id);
}

/**
 * 有効な雇用形態のみ取得
 */
export function getActiveEmploymentTypes(): EmploymentTypeSeed[] {
  return employmentTypeSeeds.filter(e => e.isActive);
}

/**
 * 常勤雇用形態のみ取得
 */
export function getFullTimeEmploymentTypes(): EmploymentTypeSeed[] {
  return employmentTypeSeeds.filter(e => e.isFullTime && e.isActive);
}

/**
 * 非常勤雇用形態のみ取得
 */
export function getPartTimeEmploymentTypes(): EmploymentTypeSeed[] {
  return employmentTypeSeeds.filter(e => !e.isFullTime && e.isActive);
}

/**
 * カテゴリー別に雇用形態を取得
 */
export function getEmploymentTypesByCategory(
  category: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'other'
): EmploymentTypeSeed[] {
  return employmentTypeSeeds.filter(e => e.category === category && e.isActive);
}

/**
 * 社会保険加入必須の雇用形態を取得
 */
export function getEmploymentTypesRequiringSocialInsurance(): EmploymentTypeSeed[] {
  return employmentTypeSeeds.filter(e => e.requiresSocialInsurance && e.isActive);
}

/**
 * 残業可能な雇用形態を取得
 */
export function getEmploymentTypesAllowingOvertime(): EmploymentTypeSeed[] {
  return employmentTypeSeeds.filter(e => e.allowsOvertime && e.isActive);
}

/**
 * 勤務時間制限のある雇用形態を取得
 */
export function getEmploymentTypesWithHourLimit(): EmploymentTypeSeed[] {
  return employmentTypeSeeds.filter(e => e.maxHoursPerWeek !== null && e.isActive);
}
