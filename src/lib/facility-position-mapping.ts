/**
 * 施設別役職マッピング管理
 * VoiceDrive連携用
 * 作成日: 2025年9月26日
 */

import { FacilityPositionMapping, PositionMapping } from '../types/facility-authority';

// 小原病院の役職マッピング
const obaraHospitalMapping: PositionMapping[] = [
  // 経営層
  { positionName: '院長', baseLevel: 13, managementScope: 420 },
  { positionName: '副院長', baseLevel: 12, managementScope: 420 },
  { positionName: '事務長', baseLevel: 11, managementScope: 50 },

  // 看護部門
  { positionName: '看護部長', baseLevel: 10, departmentScope: '看護部', managementScope: 180 },
  { positionName: '教育師長', baseLevel: 8, departmentScope: '看護部', managementScope: 30 },
  { positionName: '病棟師長', baseLevel: 7, departmentScope: '病棟', managementScope: 30 },
  { positionName: '外来師長', baseLevel: 7, departmentScope: '外来', managementScope: 25 },
  { positionName: '副師長', baseLevel: 6, departmentScope: '病棟', managementScope: 15 },
  { positionName: '主任看護師', baseLevel: 5, departmentScope: '病棟', managementScope: 10 },

  // 医局
  { positionName: '医局長', baseLevel: 10, departmentScope: '医局', managementScope: 45 },
  { positionName: '脳神経外科部長', baseLevel: 9, departmentScope: '脳神経外科', managementScope: 8 },
  { positionName: '外科部長', baseLevel: 9, departmentScope: '外科', managementScope: 6 },
  { positionName: '循環器内科部長', baseLevel: 9, departmentScope: '循環器内科', managementScope: 7 },
  { positionName: '消化器内科部長', baseLevel: 9, departmentScope: '消化器内科', managementScope: 6 },

  // 診療技術部
  { positionName: '診療技術部長', baseLevel: 10, departmentScope: '診療技術部', managementScope: 65 },
  { positionName: '診療放射線科長', baseLevel: 8, departmentScope: '放射線科', managementScope: 12 },
  { positionName: '臨床検査科長', baseLevel: 8, departmentScope: '検査科', managementScope: 15 },
  { positionName: '薬剤部長', baseLevel: 10, departmentScope: '薬剤部', managementScope: 15 },
  { positionName: '栄養科長', baseLevel: 8, departmentScope: '栄養科', managementScope: 8 },
  { positionName: 'リハビリテーション科長', baseLevel: 8, departmentScope: 'リハビリ科', managementScope: 40 },

  // 事務部門
  { positionName: '総務課長', baseLevel: 7, departmentScope: '総務課', managementScope: 20 },
  { positionName: '医事課長', baseLevel: 7, departmentScope: '医事課', managementScope: 15 },
  { positionName: '主任', baseLevel: 5, managementScope: 5 }
];

// 立神リハビリテーション温泉病院の役職マッピング
const tategamiRehabilitationMapping: PositionMapping[] = [
  // 経営層
  { positionName: '院長', baseLevel: 13, managementScope: 180 },

  // 看護部門
  { positionName: '総師長', baseLevel: 10, departmentScope: '看護部', managementScope: 100 },
  { positionName: '副総師長', baseLevel: 9, departmentScope: '看護部', managementScope: 100 },
  { positionName: '第１病棟師長', baseLevel: 7, departmentScope: '第１病棟', managementScope: 25 },
  { positionName: '外来師長', baseLevel: 7, departmentScope: '外来', managementScope: 15 },
  { positionName: '介護医療院師長', baseLevel: 7, departmentScope: '介護医療院', managementScope: 35 },
  { positionName: '師長', baseLevel: 7, managementScope: 20 },
  { positionName: '病棟師長', baseLevel: 7, managementScope: 20 },
  { positionName: '主任', baseLevel: 5, managementScope: 8 },
  { positionName: '介護主任', baseLevel: 5, departmentScope: '介護', managementScope: 10 },

  // 診療技術部
  { positionName: '統括主任', baseLevel: 6, managementScope: 30, facilitySpecificAdjustment: 0 },
  { positionName: 'リハビリテーション部門主任', baseLevel: 5, departmentScope: 'リハビリ', managementScope: 35 },
  { positionName: '放射線部門主任', baseLevel: 5, departmentScope: '放射線', managementScope: 3 },
  { positionName: '検査部門主任', baseLevel: 5, departmentScope: '検査', managementScope: 4 },
  { positionName: '栄養部門主任', baseLevel: 5, departmentScope: '栄養', managementScope: 5 },

  // 事務部門
  { positionName: '事務長', baseLevel: 11, managementScope: 20 },
  { positionName: '薬局長', baseLevel: 8, departmentScope: '薬局', managementScope: 5 },
  { positionName: '総務課主任', baseLevel: 5, departmentScope: '総務課', managementScope: 8 },
  { positionName: '医事課主任', baseLevel: 5, departmentScope: '医事課', managementScope: 6 }
];

// 施設IDと施設名のマッピング
export const FACILITY_ID_MAP = {
  'obara-hospital': '医療法人 厚生会 小原病院',
  'tategami-rehabilitation': '立神リハビリテーション温泉病院'
} as const;

// 施設タイプのマッピング
export const FACILITY_TYPE_MAP = {
  'obara-hospital': 'acute',
  'tategami-rehabilitation': 'rehabilitation'
} as const;

export class FacilityPositionMappingService {
  private mappings: Map<string, FacilityPositionMapping>;

  constructor() {
    this.mappings = new Map();
    this.initializeMappings();
  }

  /**
   * マッピングデータの初期化
   */
  private initializeMappings() {
    // 小原病院
    this.mappings.set('obara-hospital', {
      facilityId: 'obara-hospital',
      facilityName: FACILITY_ID_MAP['obara-hospital'],
      positionMappings: obaraHospitalMapping,
      lastSyncedAt: new Date()
    });

    // 立神リハビリテーション温泉病院
    this.mappings.set('tategami-rehabilitation', {
      facilityId: 'tategami-rehabilitation',
      facilityName: FACILITY_ID_MAP['tategami-rehabilitation'],
      positionMappings: tategamiRehabilitationMapping,
      lastSyncedAt: new Date()
    });
  }

  /**
   * 施設の役職マッピングを取得
   */
  getFacilityMapping(facilityId: string): FacilityPositionMapping | undefined {
    return this.mappings.get(facilityId);
  }

  /**
   * 特定の役職の権限レベルを取得
   */
  getPositionLevel(facilityId: string, positionName: string): number | undefined {
    const mapping = this.mappings.get(facilityId);
    if (!mapping) return undefined;

    const position = mapping.positionMappings.find(
      p => p.positionName === positionName
    );

    return position?.baseLevel;
  }

  /**
   * 施設間の役職レベル変換
   */
  convertPositionLevel(
    fromFacility: string,
    toFacility: string,
    positionName: string
  ): {
    originalLevel: number;
    convertedLevel: number;
    suggestedPosition?: string;
  } | undefined {
    const fromLevel = this.getPositionLevel(fromFacility, positionName);
    if (!fromLevel) return undefined;

    const toMapping = this.mappings.get(toFacility);
    if (!toMapping) return undefined;

    // 同レベルまたは最も近いレベルの役職を探す
    const closestPosition = toMapping.positionMappings
      .reduce((closest, current) => {
        const currentDiff = Math.abs(current.baseLevel - fromLevel);
        const closestDiff = Math.abs(closest.baseLevel - fromLevel);
        return currentDiff < closestDiff ? current : closest;
      });

    return {
      originalLevel: fromLevel,
      convertedLevel: closestPosition.baseLevel,
      suggestedPosition: closestPosition.positionName
    };
  }

  /**
   * 管理範囲による役職検索
   */
  findPositionsByManagementScope(
    facilityId: string,
    minScope: number,
    maxScope?: number
  ): PositionMapping[] {
    const mapping = this.mappings.get(facilityId);
    if (!mapping) return [];

    return mapping.positionMappings.filter(p => {
      if (!p.managementScope) return false;
      if (maxScope) {
        return p.managementScope >= minScope && p.managementScope <= maxScope;
      }
      return p.managementScope >= minScope;
    });
  }

  /**
   * 部門別の役職一覧を取得
   */
  getPositionsByDepartment(
    facilityId: string,
    departmentScope: string
  ): PositionMapping[] {
    const mapping = this.mappings.get(facilityId);
    if (!mapping) return [];

    return mapping.positionMappings.filter(
      p => p.departmentScope === departmentScope
    );
  }

  /**
   * 全施設の役職マッピングを取得
   */
  getAllFacilityMappings(): FacilityPositionMapping[] {
    return Array.from(this.mappings.values());
  }

  /**
   * 施設別調整値を計算
   */
  calculateFacilityAdjustment(
    facilityId: string,
    baseLevel: number,
    positionName?: string
  ): number {
    // 施設規模による調整
    const facilityType = FACILITY_TYPE_MAP[facilityId as keyof typeof FACILITY_TYPE_MAP];

    let adjustment = 0;

    // リハビリテーション病院の特定役職への調整
    if (facilityId === 'tategami-rehabilitation') {
      if (positionName === '統括主任') {
        // 複数部門を統括するため、通常の主任より+1
        adjustment = 1;
      }
    }

    // 急性期病院の調整
    if (facilityType === 'acute') {
      // 急性期病院は基本的に調整なし
      adjustment = 0;
    }

    return adjustment;
  }

  /**
   * マッピングデータの更新
   */
  updateMapping(
    facilityId: string,
    updates: Partial<FacilityPositionMapping>
  ): boolean {
    const existing = this.mappings.get(facilityId);
    if (!existing) return false;

    this.mappings.set(facilityId, {
      ...existing,
      ...updates,
      lastSyncedAt: new Date()
    });

    return true;
  }

  /**
   * 新規施設の追加
   */
  addFacility(mapping: FacilityPositionMapping): boolean {
    if (this.mappings.has(mapping.facilityId)) {
      return false;
    }

    this.mappings.set(mapping.facilityId, {
      ...mapping,
      lastSyncedAt: new Date()
    });

    return true;
  }
}

// シングルトンインスタンス
export const facilityPositionMappingService = new FacilityPositionMappingService();