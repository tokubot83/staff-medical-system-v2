/**
 * 施設別権限管理システム型定義
 * VoiceDrive連携用
 * 作成日: 2025年9月26日
 */

// 施設情報
export interface FacilityInfo {
  facilityId: string;
  facilityName: string;
  facilityType: 'acute' | 'chronic' | 'rehabilitation';
  organizationStructure: OrganizationStructure;
  lastUpdated: Date;
}

// 組織構造
export interface OrganizationStructure {
  hasMultipleDepartments: boolean;
  hasSeparateNursingDivisions: boolean;
  totalStaffCount: number;
  departmentCount: number;
}

// 施設別役職マッピング
export interface FacilityPositionMapping {
  facilityId: string;
  facilityName: string;
  positionMappings: PositionMapping[];
  lastSyncedAt: Date;
}

// 役職マッピング詳細
export interface PositionMapping {
  positionName: string;
  baseLevel: number;
  departmentScope?: string;
  managementScope?: number;
  facilitySpecificAdjustment?: number;
}

// 権限レベル計算リクエスト（拡張版）
export interface CalculateLevelRequest {
  staffId: string;
  facilityId: string;
  includeBreakdown?: boolean;
}

// 権限レベル計算レスポンス（拡張版）
export interface CalculateLevelResponse {
  staffId: string;
  facilityId: string;
  position: string;
  accountLevel: number;
  breakdown?: {
    baseLevel: number;
    experienceBonus: number;
    leaderBonus: number;
    facilityAdjustment: number;
  };
  effectiveDate: Date;
}

// 施設間異動情報
export interface InterFacilityTransfer {
  staffId: string;
  fromFacility: string;
  toFacility: string;
  transferDate: Date;
  positionChange?: {
    fromPosition: string;
    toPosition: string;
  };
  levelAdjustment?: {
    previousLevel: number;
    newLevel: number;
    adjustmentReason: string;
  };
}

// Webhook通知イベント
export interface StaffUpdateEvent {
  eventType: 'staff.created' | 'staff.updated' | 'staff.transferred' | 'staff.deleted';
  timestamp: Date;
  data: {
    staffId: string;
    facilityId: string;
    changes?: {
      position?: string;
      accountLevel?: number;
      effectiveDate?: Date;
    };
    previousState?: {
      facilityId?: string;
      position?: string;
      accountLevel?: number;
    };
  };
  metadata?: {
    updatedBy: string;
    updateReason?: string;
    batchId?: string;
  };
}

// 施設別権限調整ルール
export interface FacilityAdjustmentRule {
  facilityId: string;
  rules: AdjustmentRule[];
}

export interface AdjustmentRule {
  ruleId: string;
  ruleName: string;
  condition: {
    positionPattern?: string;
    departmentPattern?: string;
    minExperience?: number;
    maxExperience?: number;
  };
  adjustment: {
    type: 'add' | 'multiply' | 'override';
    value: number;
  };
  priority: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

// 施設マスタ（拡張版）
export interface FacilityMaster {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  location: string;
  beds?: number;
  departments: FacilityDepartment[];
  positionMappings: Map<string, number>;
  adjustmentRules: AdjustmentRule[];
  organizationChart?: OrganizationChart;
}

// 施設部門情報
export interface FacilityDepartment {
  departmentId: string;
  departmentName: string;
  departmentType: string;
  parentDepartmentId?: string;
  managerPositions: string[];
  staffCount: number;
}

// 組織図情報
export interface OrganizationChart {
  facilityId: string;
  lastUpdated: Date;
  nodes: OrganizationNode[];
}

export interface OrganizationNode {
  nodeId: string;
  positionName: string;
  level: number;
  parentNodeId?: string;
  childNodeIds: string[];
  staffId?: string;
  isVacant: boolean;
}

// 施設別権限同期ステータス
export interface FacilitySyncStatus {
  facilityId: string;
  lastSyncTime: Date;
  syncStatus: 'synced' | 'pending' | 'error';
  pendingChanges: number;
  errorDetails?: string;
  nextSyncScheduled?: Date;
}

// バッチ更新リクエスト
export interface BatchUpdateRequest {
  batchId: string;
  facilityId: string;
  updates: StaffUpdateItem[];
  executionTime?: Date;
  notifyVoiceDrive: boolean;
}

export interface StaffUpdateItem {
  staffId: string;
  changes: {
    position?: string;
    department?: string;
    accountLevel?: number;
  };
  effectiveDate: Date;
}

// 施設別統計情報
export interface FacilityStatistics {
  facilityId: string;
  totalStaff: number;
  levelDistribution: {
    level: number;
    count: number;
    percentage: number;
  }[];
  departmentDistribution: {
    department: string;
    count: number;
  }[];
  averageLevel: number;
  medianLevel: number;
  lastCalculated: Date;
}