// 面談システムの権限チェック関数

import { PermissionLevel } from '@/types/interview';

/**
 * 面談実施権限チェック
 * L6-8のみが面談を実施できる
 */
export function canConductInterview(userLevel: number): boolean {
  return userLevel === 6 || userLevel === 7 || userLevel === 8;
}

/**
 * 予約管理権限チェック
 * L5以上が予約管理画面にアクセスできる
 */
export function canManageBookings(userLevel: number): boolean {
  return userLevel >= 5;
}

/**
 * システム設定権限チェック
 * L8以上がシステム設定にアクセスできる
 */
export function canAccessSystemSettings(userLevel: number): boolean {
  return userLevel >= 8;
}

/**
 * 全体統計閲覧権限チェック
 * L8以上が全体統計を閲覧できる
 */
export function canViewOverallStatistics(userLevel: number): boolean {
  return userLevel >= 8;
}

/**
 * 時間枠ブロック権限チェック
 * L5とL7-8が時間枠をブロックできる
 */
export function canBlockTimeSlots(userLevel: number): boolean {
  return userLevel === 5 || userLevel === 7 || userLevel === 8;
}

/**
 * スケジュール変更権限チェック
 * L5以上がスケジュールを変更できる（L6を除く）
 */
export function canModifySchedule(userLevel: number): boolean {
  return userLevel >= 5 && userLevel !== 6;
}

/**
 * 統計レポート閲覧権限チェック
 * L5以上が統計レポートを閲覧できる（L6を除く）
 */
export function canViewStatisticsReport(userLevel: number): boolean {
  return userLevel >= 5 && userLevel !== 6;
}

/**
 * 権限レベルの名称を取得
 */
export function getPermissionLevelName(level: number): string {
  const levelNames: { [key: number]: string } = {
    1: '一般職員',
    2: 'チーフ・主任',
    3: '係長・マネージャー',
    4: '課長',
    5: '人財統括本部 戦略企画・統括管理部門',
    6: '人財統括本部 キャリア支援部門員',
    7: '人財統括本部 各部門長',
    8: '人財統括本部 統括管理部門長',
    9: '部長級',
    10: '本部長級',
    11: '事業部長級',
    12: '役員',
    13: '経営層'
  };
  
  return levelNames[level] || '不明';
}

/**
 * 権限レベルの短縮名を取得
 */
export function getPermissionLevelShortName(level: number): string {
  const shortNames: { [key: number]: string } = {
    1: '一般職員',
    2: 'チーフ',
    3: '係長',
    4: '課長',
    5: '戦略企画部門',
    6: 'キャリア支援員',
    7: '部門長',
    8: '統括部門長',
    9: '部長',
    10: '本部長',
    11: '事業部長',
    12: '役員',
    13: '経営層'
  };
  
  return shortNames[level] || '不明';
}

/**
 * 面談予約申請権限チェック
 * 全レベルが面談予約申請できる
 */
export function canRequestInterview(userLevel: number): boolean {
  return userLevel >= 1 && userLevel <= 13;
}

/**
 * 権限レベルが有効な範囲内かチェック
 */
export function isValidPermissionLevel(level: number): boolean {
  return level >= 1 && level <= 13;
}