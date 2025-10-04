/**
 * VoiceDrive連携用 18段階権限レベル計算サービス
 * 作成日: 2025年9月25日
 *
 * 職員の経験年数、役職、資格に基づいて1-18の権限レベルを算出
 * 看護職のリーダー業務可否により0.5段階の調整を行う
 */

import { calculateExperienceYears } from '../utils/experienceUtils';

// 18段階権限レベル定義
export enum AccountLevel {
  // 一般職員層
  NEW_STAFF = 1,                    // 新人（1年目）
  NEW_STAFF_LEADER = 1.5,           // 新人（リーダー可）看護職のみ
  JUNIOR_STAFF = 2,                 // 若手（2-3年目）
  JUNIOR_STAFF_LEADER = 2.5,        // 若手（リーダー可）看護職のみ
  MIDLEVEL_STAFF = 3,               // 中堅（4-10年目）
  MIDLEVEL_STAFF_LEADER = 3.5,      // 中堅（リーダー可）看護職のみ
  VETERAN_STAFF = 4,                // ベテラン（11年以上）
  VETERAN_STAFF_LEADER = 4.5,       // ベテラン（リーダー可）看護職のみ

  // 役職層
  DEPUTY_CHIEF = 5,                 // 副主任
  CHIEF = 6,                        // 主任
  DEPUTY_MANAGER = 7,               // 副師長・副科長
  MANAGER = 8,                      // 師長・科長・課長
  DEPUTY_DIRECTOR = 9,              // 副部長
  DIRECTOR = 10,                    // 部長・医局長
  ADMINISTRATIVE_DIRECTOR = 11,     // 事務長

  // 施設経営層
  VICE_PRESIDENT = 12,              // 副院長
  PRESIDENT = 13,                   // 院長・施設長

  // 法人人事部
  HR_STAFF = 14,                    // 人事部門員
  HR_MANAGER = 15,                  // 各部門長
  STRATEGIC_PLANNING_STAFF = 16,    // 戦略企画・統括管理部門員
  STRATEGIC_PLANNING_MANAGER = 17,  // 戦略企画・統括管理部門長

  // 最高経営層
  BOARD_MEMBER = 18,                // 理事長・法人事務局長

  // 特別権限レベル（健康管理専用）
  HEALTH_CHECKUP_STAFF = 97,        // 健診担当者（ストレスチェック実施者）
  OCCUPATIONAL_PHYSICIAN = 98,      // 産業医

  // システム管理者（特別権限）
  SYSTEM_ADMIN = 99                 // システム管理者（X レベル）
}

// 看護職リーダー業務管理
export interface NursingLeaderCapability {
  staffId: string;
  canPerformLeaderDuty: boolean;
  certification?: {
    certifiedDate: Date;          // 初回認定日
    certifiedBy: string;           // 認定者（師長ID）
    annualReviewDate: Date;        // 年次確認日
  };
  temporaryRestriction?: {
    isRestricted: boolean;         // 一時制限中
    reason: string;                // 制限理由
    expectedEndDate?: Date;        // 制限解除予定日
  };
}

// 職員マスターデータ（VoiceDrive連携用）
export interface StaffMasterData {
  staffId: string;
  name: string;
  facility: string;
  department: string;
  position?: string;                  // 役職
  profession: string;                 // 職種
  hireDate: Date;                    // 入職日
  experienceYears?: number;          // 経験年数（自動計算）
  previousExperience?: string;       // 前職経験

  // 看護職専用
  canPerformLeaderDuty?: boolean;

  // 資格情報
  certifications?: string[];

  // 兼務情報
  additionalPositions?: {
    department: string;
    position: string;
  }[];

  // 計算結果
  accountLevel?: number;             // 1-18の値（小数点対応）
}

// 役職と権限レベルのマッピング（VoiceDrive仕様準拠）
const POSITION_LEVEL_MAPPING: Record<string, number> = {
  // 役職層（レベル5-11）
  '副主任': 5,
  '副主任看護師': 5,
  'チームサブリーダー': 5,

  '主任': 6,
  '主任看護師': 6,
  '各部署主任': 6,

  '副師長': 7,
  '副科長': 7,
  '副課長': 7,
  '中間管理職補佐': 7,

  '師長': 8,
  '看護師長': 8,
  '科長': 8,
  '課長': 8,
  '室長': 8,
  '中間管理職': 8,

  '副部長': 9,
  '看護副部長': 9,
  '部長補佐': 9,

  '部長': 10,
  '看護部長': 10,
  '医局長': 10,
  '部門責任者': 10,

  '事務長': 11,
  '施設事務統括': 11,

  // 施設経営層（レベル12-13）
  '副院長': 12,
  '院長補佐': 12,
  '医療統括': 12,

  '院長': 13,
  '施設長': 13,
  '施設最高責任者': 13,

  // 法人人事部（レベル14-17）
  '人事部門員': 14,
  '採用担当': 14,
  '教育担当': 14,
  '相談担当': 14,
  '業務革新担当': 14,

  '人事各部門長': 15,
  '採用部門長': 15,
  '教育部門長': 15,
  'コンサルカウンター部門長': 15,
  '業務革新部門長': 15,

  '戦略企画部門員': 16,
  '統括管理部門員': 16,
  '廻総師長': 16,  // 具体的な役職名
  '徳留': 16,       // 具体的な役職名（VoiceDrive開発者）

  '戦略企画部門長': 17,
  '統括管理部門長': 17,
  '人事部統括': 17,

  // 最高経営層（レベル18）
  '理事長': 18,
  '法人事務局長': 18,
  '最終決定権者': 18,

  // システム管理者（レベルX = 99）
  'システム管理者': 99,
  'ITマネージャー': 99,
  '情報システム部': 99,
  'システム保守担当': 99
};

export class AccountLevelCalculator {

  /**
   * 職員の権限レベルを計算
   */
  calculateAccountLevel(staff: StaffMasterData): number {
    // 1. 役職による判定（最優先）
    if (staff.position) {
      const positionLevel = this.getPositionLevel(staff.position);
      if (positionLevel) {
        return positionLevel;
      }
    }

    // 2. 兼務職員の場合、最高権限を採用
    if (staff.additionalPositions && staff.additionalPositions.length > 0) {
      const levels = staff.additionalPositions
        .map(pos => this.getPositionLevel(pos.position))
        .filter(level => level !== null) as number[];

      if (levels.length > 0) {
        return Math.max(...levels);
      }
    }

    // 3. 経験年数による基本レベル判定
    const experienceYears = staff.experienceYears ??
      calculateExperienceYears(staff.hireDate.toISOString());

    let baseLevel = this.getExperienceLevelMapping(experienceYears);

    // 4. 看護職のリーダー業務加算（0.5加算）
    if (this.isNursingProfession(staff.profession)) {
      if (staff.canPerformLeaderDuty === true) {
        baseLevel += 0.5;
      }
    }

    return baseLevel;
  }

  /**
   * 役職から権限レベルを取得
   */
  private getPositionLevel(position: string): number | null {
    return POSITION_LEVEL_MAPPING[position] || null;
  }

  /**
   * 経験年数から基本レベルを取得
   */
  private getExperienceLevelMapping(years: number): number {
    if (years <= 1) return AccountLevel.NEW_STAFF;        // 新人
    if (years <= 3) return AccountLevel.JUNIOR_STAFF;     // 若手
    if (years <= 10) return AccountLevel.MIDLEVEL_STAFF;  // 中堅
    return AccountLevel.VETERAN_STAFF;                     // ベテラン
  }

  /**
   * 看護職かどうかを判定
   */
  private isNursingProfession(profession: string): boolean {
    return ['看護師', '准看護師'].includes(profession);
  }

  /**
   * コンテキストに応じた権限レベル計算（兼務職員用）
   */
  calculateEffectiveLevel(
    staff: StaffMasterData,
    context?: {
      department?: string;
      actingAs?: string;
      purpose?: string;
    }
  ): number {
    // コンテキストが指定されている場合
    if (context?.department && staff.additionalPositions) {
      const positionInDept = staff.additionalPositions.find(
        pos => pos.department === context.department
      );

      if (positionInDept) {
        const level = this.getPositionLevel(positionInDept.position);
        if (level) return level;
      }
    }

    // デフォルトは通常の計算
    return this.calculateAccountLevel(staff);
  }

  /**
   * VoiceDrive投票用の権限レベル取得
   */
  getStaffLevelForVoting(
    staff: StaffMasterData,
    topicDepartment?: string
  ): number {
    return this.calculateEffectiveLevel(staff, {
      department: topicDepartment,
      purpose: 'voting'
    });
  }

  /**
   * 権限レベルの詳細情報を取得
   */
  getAccountLevelDetails(level: number): {
    level: number;
    category: string;
    description: string;
  } {
    const roundedLevel = Math.floor(level);
    const hasLeaderBonus = level % 1 === 0.5;

    let category = '一般職員';
    let description = '';

    if (roundedLevel <= 4) {
      category = '一般職員';
      switch (roundedLevel) {
        case 1: description = '新人（1年目）'; break;
        case 2: description = '若手（2-3年目）'; break;
        case 3: description = '中堅（4-10年目）'; break;
        case 4: description = 'ベテラン（11年以上）'; break;
      }
    } else if (roundedLevel <= 11) {
      category = '役職者';
      switch (roundedLevel) {
        case 5: description = '副主任'; break;
        case 6: description = '主任'; break;
        case 7: description = '副師長・副科長'; break;
        case 8: description = '師長・科長・課長'; break;
        case 9: description = '副部長'; break;
        case 10: description = '部長・医局長'; break;
        case 11: description = '事務長'; break;
      }
    } else if (roundedLevel <= 13) {
      category = '施設経営層';
      switch (roundedLevel) {
        case 12: description = '副院長'; break;
        case 13: description = '院長・施設長'; break;
      }
    } else if (roundedLevel <= 17) {
      category = '法人人事部';
      switch (roundedLevel) {
        case 14: description = '人事部門員'; break;
        case 15: description = '各部門長'; break;
        case 16: description = '戦略企画・統括管理部門員'; break;
        case 17: description = '戦略企画・統括管理部門長'; break;
      }
    } else {
      category = '最高経営層';
      description = '理事長・法人事務局長';
    }

    if (hasLeaderBonus) {
      description += '（リーダー業務可）';
    }

    return { level, category, description };
  }

  /**
   * バルク計算（複数職員の権限レベルを一括計算）
   */
  calculateBulkLevels(staffList: StaffMasterData[]): Map<string, number> {
    const results = new Map<string, number>();

    for (const staff of staffList) {
      const level = this.calculateAccountLevel(staff);
      results.set(staff.staffId, level);
    }

    return results;
  }

  /**
   * 権限レベル変更時の影響分析
   */
  analyzeImpact(
    oldLevel: number,
    newLevel: number
  ): {
    levelChange: number;
    categoryChange: boolean;
    description: string;
  } {
    const levelChange = newLevel - oldLevel;
    const oldDetails = this.getAccountLevelDetails(oldLevel);
    const newDetails = this.getAccountLevelDetails(newLevel);
    const categoryChange = oldDetails.category !== newDetails.category;

    let description = '';
    if (levelChange > 0) {
      description = `権限レベルが${oldLevel}から${newLevel}に上昇`;
    } else if (levelChange < 0) {
      description = `権限レベルが${oldLevel}から${newLevel}に低下`;
    } else {
      description = '権限レベルに変更なし';
    }

    if (categoryChange) {
      description += `（${oldDetails.category}→${newDetails.category}）`;
    }

    return {
      levelChange,
      categoryChange,
      description
    };
  }
}

// シングルトンインスタンスをエクスポート
export const accountLevelCalculator = new AccountLevelCalculator();