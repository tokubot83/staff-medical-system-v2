/**
 * 病棟識別・フィルタリングユーティリティ
 */

import { DeploymentStaff } from './deploymentData';
import { CareerCourseCode } from '@/types/staff';

/**
 * 表示単位（フィルターモード）
 */
export type DisplayMode = 'facility' | 'ward' | 'department';

/**
 * 病棟情報
 */
export interface WardInfo {
  id: string;
  name: string;
  facilityId: string;
  facilityName: string;
}

/**
 * 病棟統計情報
 */
export interface WardStatistics {
  wardId: string;
  wardName: string;
  facilityName: string;
  totalStaff: number;
  leaderCapableStaff: number;
  careerCourseBreakdown: {
    course: CareerCourseCode;
    count: number;
    percentage: number;
  }[];
  positionBreakdown: {
    position: string;
    count: number;
  }[];
  averageAccountLevel: number;
}

/**
 * 部署が病棟かどうかを判定
 */
export function isWard(department: string): boolean {
  const wardPatterns = [
    /^\d+階病棟$/,           // 3階病棟、4階病棟など
    /^第[0-9０-９]+病棟$/,    // 第1病棟、第２病棟など
    /病棟$/,                 // ○○病棟
    /^介護医療院$/,          // 介護医療院
    /^医療療養病棟$/,        // 医療療養病棟
  ];

  return wardPatterns.some(pattern => pattern.test(department));
}

/**
 * 施設内の全病棟リストを取得
 */
export function getWardsByFacility(
  staff: DeploymentStaff[],
  facilityId?: string
): WardInfo[] {
  const wardSet = new Map<string, WardInfo>();

  staff
    .filter(s => !facilityId || s.facilityId === facilityId)
    .filter(s => isWard(s.department))
    .forEach(s => {
      const key = `${s.facilityId}-${s.department}`;
      if (!wardSet.has(key)) {
        wardSet.set(key, {
          id: key,
          name: s.department,
          facilityId: s.facilityId,
          facilityName: s.facilityName,
        });
      }
    });

  return Array.from(wardSet.values()).sort((a, b) => {
    // 施設順 → 病棟名順
    if (a.facilityName !== b.facilityName) {
      return a.facilityName.localeCompare(b.facilityName, 'ja');
    }
    return a.name.localeCompare(b.name, 'ja');
  });
}

/**
 * 病棟別に職員をグループ化
 */
export function groupByWard(staff: DeploymentStaff[]): Map<string, DeploymentStaff[]> {
  const grouped = new Map<string, DeploymentStaff[]>();

  staff.filter(s => isWard(s.department)).forEach(s => {
    const key = `${s.facilityId}-${s.department}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(s);
  });

  return grouped;
}

/**
 * 病棟の統計情報を計算
 */
export function calculateWardStatistics(
  staff: DeploymentStaff[],
  wardId: string
): WardStatistics | null {
  const wardStaff = staff.filter(s => `${s.facilityId}-${s.department}` === wardId);

  if (wardStaff.length === 0) return null;

  const first = wardStaff[0];

  // キャリアコース分布
  const courseCount = new Map<CareerCourseCode, number>();
  wardStaff.forEach(s => {
    courseCount.set(s.careerCourse, (courseCount.get(s.careerCourse) || 0) + 1);
  });

  const careerCourseBreakdown = Array.from(courseCount.entries()).map(([course, count]) => ({
    course,
    count,
    percentage: Math.round((count / wardStaff.length) * 100),
  })).sort((a, b) => a.course.localeCompare(b.course));

  // 役職分布
  const positionCount = new Map<string, number>();
  wardStaff.forEach(s => {
    positionCount.set(s.position, (positionCount.get(s.position) || 0) + 1);
  });

  const positionBreakdown = Array.from(positionCount.entries())
    .map(([position, count]) => ({ position, count }))
    .sort((a, b) => b.count - a.count);

  // リーダー可能職員数
  const leaderCapableStaff = wardStaff.filter(s => s.canPerformLeaderDuty === true).length;

  // 平均権限レベル
  const averageAccountLevel = Math.round(
    wardStaff.reduce((sum, s) => sum + s.accountLevel, 0) / wardStaff.length * 10
  ) / 10;

  return {
    wardId,
    wardName: first.department,
    facilityName: first.facilityName,
    totalStaff: wardStaff.length,
    leaderCapableStaff,
    careerCourseBreakdown,
    positionBreakdown,
    averageAccountLevel,
  };
}

/**
 * 複数病棟の統計を並列取得
 */
export function compareWards(
  staff: DeploymentStaff[],
  wardIds: string[]
): WardStatistics[] {
  return wardIds
    .map(id => calculateWardStatistics(staff, id))
    .filter((stats): stats is WardStatistics => stats !== null);
}

/**
 * 表示モードに応じたグループキーを取得
 */
export function getGroupKey(staff: DeploymentStaff, mode: DisplayMode): string {
  switch (mode) {
    case 'facility':
      return staff.facilityId;
    case 'ward':
      return isWard(staff.department) ? `${staff.facilityId}-${staff.department}` : 'その他';
    case 'department':
      return `${staff.facilityId}-${staff.department}`;
    default:
      return staff.facilityId;
  }
}

/**
 * 表示モードに応じたグループラベルを取得
 */
export function getGroupLabel(staff: DeploymentStaff, mode: DisplayMode): string {
  switch (mode) {
    case 'facility':
      return staff.facilityName;
    case 'ward':
      return isWard(staff.department) ? `${staff.facilityName} - ${staff.department}` : 'その他';
    case 'department':
      return `${staff.facilityName} - ${staff.department}`;
    default:
      return staff.facilityName;
  }
}
