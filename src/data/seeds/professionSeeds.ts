/**
 * 職種マスター シードデータ
 * Phase 1-1: 職種マスター独立化
 *
 * 既存のハードコードされた8職種をマスターデータとして定義
 */

export interface ProfessionSeed {
  id: string;
  code: string;
  name: string;
  category: 'medical' | 'nursing' | 'allied_health' | 'administrative' | 'support';
  requiresLicense: boolean;
  displayOrder: number;
  isActive: boolean;
}

export const professionSeeds: ProfessionSeed[] = [
  // 看護職
  {
    id: 'PROF_001',
    code: 'NS',
    name: '看護師',
    category: 'nursing',
    requiresLicense: true,
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'PROF_002',
    code: 'ANS',
    name: '准看護師',
    category: 'nursing',
    requiresLicense: true,
    displayOrder: 2,
    isActive: true,
  },

  // 医療職
  {
    id: 'PROF_003',
    code: 'DR',
    name: '医師',
    category: 'medical',
    requiresLicense: true,
    displayOrder: 3,
    isActive: true,
  },

  // 医療技術職
  {
    id: 'PROF_004',
    code: 'PHARM',
    name: '薬剤師',
    category: 'allied_health',
    requiresLicense: true,
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'PROF_005',
    code: 'PT',
    name: '理学療法士',
    category: 'allied_health',
    requiresLicense: true,
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'PROF_006',
    code: 'OT',
    name: '作業療法士',
    category: 'allied_health',
    requiresLicense: true,
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'PROF_007',
    code: 'RD',
    name: '管理栄養士',
    category: 'allied_health',
    requiresLicense: true,
    displayOrder: 7,
    isActive: true,
  },

  // 事務職
  {
    id: 'PROF_008',
    code: 'ADM',
    name: '事務職員',
    category: 'administrative',
    requiresLicense: false,
    displayOrder: 8,
    isActive: true,
  },
];

/**
 * 職種コードから職種名を取得
 */
export function getProfessionNameByCode(code: string): string | undefined {
  return professionSeeds.find(p => p.code === code)?.name;
}

/**
 * 職種IDから職種情報を取得
 */
export function getProfessionById(id: string): ProfessionSeed | undefined {
  return professionSeeds.find(p => p.id === id);
}

/**
 * カテゴリー別の職種リストを取得
 */
export function getProfessionsByCategory(category: ProfessionSeed['category']): ProfessionSeed[] {
  return professionSeeds.filter(p => p.category === category && p.isActive);
}

/**
 * 有効な職種のみを取得
 */
export function getActiveProfessions(): ProfessionSeed[] {
  return professionSeeds.filter(p => p.isActive);
}
