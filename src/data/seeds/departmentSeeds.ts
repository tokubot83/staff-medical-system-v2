/**
 * 部署マスター - シードデータ
 * Phase 1-4-A: 部署マスター基本構造実装
 *
 * 施設と部署のリレーション、階層構造を管理
 */

export interface DepartmentSeed {
  id: string;
  code: string;
  name: string;
  facilityId: string; // 所属施設ID（施設マスターと連携）
  facilityName: string; // 所属施設名（表示用）
  category: 'medical' | 'nursing' | 'rehabilitation' | 'administrative' | 'support' | 'pharmacy' | 'nutrition' | 'hr' | 'strategy';
  parentDepartmentId: string | null; // 上位部署ID（階層構造）
  level: number; // 階層レベル（1=最上位、2=部、3=課など）
  displayOrder: number;
  isActive: boolean;
  description?: string;
}

export const departmentSeeds: DepartmentSeed[] = [
  // 小原病院 - 部署
  {
    id: 'DEPT_001',
    code: 'OBARA_NURSING',
    name: '看護部',
    facilityId: 'obara-hospital',
    facilityName: '小原病院',
    category: 'nursing',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 1,
    isActive: true,
    description: '小原病院の看護部門'
  },
  {
    id: 'DEPT_002',
    code: 'OBARA_MEDICAL',
    name: '医療部',
    facilityId: 'obara-hospital',
    facilityName: '小原病院',
    category: 'medical',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 2,
    isActive: true,
    description: '小原病院の医療部門'
  },
  {
    id: 'DEPT_003',
    code: 'OBARA_ADMIN',
    name: '事務部',
    facilityId: 'obara-hospital',
    facilityName: '小原病院',
    category: 'administrative',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 3,
    isActive: true,
    description: '小原病院の事務部門'
  },

  // 立神リハビリテーション温泉病院 - 部署
  {
    id: 'DEPT_004',
    code: 'TATEGAMI_NURSING',
    name: '看護部',
    facilityId: 'tategami-rehabilitation',
    facilityName: '立神リハビリテーション温泉病院',
    category: 'nursing',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 1,
    isActive: true,
    description: '立神リハビリテーション温泉病院の看護部門'
  },
  {
    id: 'DEPT_005',
    code: 'TATEGAMI_MEDICAL',
    name: '医療部',
    facilityId: 'tategami-rehabilitation',
    facilityName: '立神リハビリテーション温泉病院',
    category: 'medical',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 2,
    isActive: true,
    description: '立神リハビリテーション温泉病院の医療部門'
  },
  {
    id: 'DEPT_006',
    code: 'TATEGAMI_REHAB',
    name: 'リハビリテーション部',
    facilityId: 'tategami-rehabilitation',
    facilityName: '立神リハビリテーション温泉病院',
    category: 'rehabilitation',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 3,
    isActive: true,
    description: '立神リハビリテーション温泉病院のリハビリテーション部門'
  },
  {
    id: 'DEPT_007',
    code: 'TATEGAMI_ADMIN',
    name: '事務部',
    facilityId: 'tategami-rehabilitation',
    facilityName: '立神リハビリテーション温泉病院',
    category: 'administrative',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 4,
    isActive: true,
    description: '立神リハビリテーション温泉病院の事務部門'
  },
  {
    id: 'DEPT_008',
    code: 'TATEGAMI_PHARMACY',
    name: '薬剤部',
    facilityId: 'tategami-rehabilitation',
    facilityName: '立神リハビリテーション温泉病院',
    category: 'pharmacy',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 5,
    isActive: true,
    description: '立神リハビリテーション温泉病院の薬剤部門'
  },
  {
    id: 'DEPT_009',
    code: 'TATEGAMI_NUTRITION',
    name: '栄養部',
    facilityId: 'tategami-rehabilitation',
    facilityName: '立神リハビリテーション温泉病院',
    category: 'nutrition',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 6,
    isActive: true,
    description: '立神リハビリテーション温泉病院の栄養部門'
  },

  // 法人本部 - 部署
  {
    id: 'DEPT_010',
    code: 'CORP_HR',
    name: '人事部',
    facilityId: 'corporate-headquarters',
    facilityName: '法人本部',
    category: 'hr',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 1,
    isActive: true,
    description: '法人本部の人事部門'
  },
  {
    id: 'DEPT_011',
    code: 'CORP_STRATEGY',
    name: '戦略企画部',
    facilityId: 'corporate-headquarters',
    facilityName: '法人本部',
    category: 'strategy',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 2,
    isActive: true,
    description: '法人本部の戦略企画部門'
  },
  {
    id: 'DEPT_012',
    code: 'CORP_ADMIN',
    name: '法人事務局',
    facilityId: 'corporate-headquarters',
    facilityName: '法人本部',
    category: 'administrative',
    parentDepartmentId: null,
    level: 1,
    displayOrder: 3,
    isActive: true,
    description: '法人本部の事務局'
  },
];

/**
 * 部署コードから名称を取得
 */
export function getDepartmentNameByCode(code: string): string {
  return departmentSeeds.find(d => d.code === code)?.name || '不明な部署';
}

/**
 * IDから部署を取得
 */
export function getDepartmentById(id: string): DepartmentSeed | undefined {
  return departmentSeeds.find(d => d.id === id);
}

/**
 * 有効な部署のみ取得
 */
export function getActiveDepartments(): DepartmentSeed[] {
  return departmentSeeds.filter(d => d.isActive);
}

/**
 * 施設IDで部署を絞り込み
 */
export function getDepartmentsByFacility(facilityId: string): DepartmentSeed[] {
  return departmentSeeds.filter(d => d.facilityId === facilityId && d.isActive);
}

/**
 * カテゴリー別に部署を取得
 */
export function getDepartmentsByCategory(
  category: 'medical' | 'nursing' | 'rehabilitation' | 'administrative' | 'support' | 'pharmacy' | 'nutrition' | 'hr' | 'strategy'
): DepartmentSeed[] {
  return departmentSeeds.filter(d => d.category === category && d.isActive);
}

/**
 * 階層レベルで部署を取得
 */
export function getDepartmentsByLevel(level: number): DepartmentSeed[] {
  return departmentSeeds.filter(d => d.level === level && d.isActive);
}

/**
 * 上位部署配下の部署を取得
 */
export function getChildDepartments(parentDepartmentId: string): DepartmentSeed[] {
  return departmentSeeds.filter(d => d.parentDepartmentId === parentDepartmentId && d.isActive);
}

/**
 * 施設別の部署数を取得
 */
export function getDepartmentCountByFacility(): Record<string, number> {
  const counts: Record<string, number> = {};
  departmentSeeds.forEach(d => {
    if (d.isActive) {
      counts[d.facilityId] = (counts[d.facilityId] || 0) + 1;
    }
  });
  return counts;
}

/**
 * 施設名から部署リストを取得（表示用）
 */
export function getDepartmentsByFacilityName(facilityName: string): DepartmentSeed[] {
  return departmentSeeds.filter(d => d.facilityName === facilityName && d.isActive);
}
