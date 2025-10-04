import { NextApiRequest, NextApiResponse } from 'next';
import { accountLevelCalculator, StaffMasterData } from '../../../services/accountLevelCalculator';
import { CalculateLevelRequest, CalculateLevelResponse as FacilityLevelResponse } from '../../../types/facility-authority';
import { facilityPositionMappingService } from '../../../lib/facility-position-mapping';

/**
 * VoiceDrive連携用 権限レベル計算API
 * POST /api/v1/calculate-level
 *
 * VoiceDriveからのJWT認証付きリクエストを受け付け
 * 職員の25段階権限レベルを計算して返す
 * - 基本レベル: 1-18
 * - リーダーレベル: 1.5, 2.5, 3.5, 4.5
 * - 特別権限レベル: 97（健診担当者）、98（産業医）、99（システム管理者）
 */

// レスポンス型定義
interface CalculateLevelResponse {
  staffId: string;
  facilityId?: string;
  position?: string;
  accountLevel: number;
  breakdown: {
    baseLevel: number;
    experienceBonus: number;
    leaderBonus: number;
    facilityAdjustment: number;
    positionLevel?: number;
  };
  levelDetails: {
    name: string;
    category: string;
    description: string;
  };
  timestamp: string;
}

// エラーレスポンス型定義
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculateLevelResponse | ErrorResponse>
) {
  // CORSヘッダー設定（VoiceDrive用）
  res.setHeader('Access-Control-Allow-Origin', process.env.VOICEDRIVE_URL || 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONSリクエスト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed',
        timestamp: new Date().toISOString()
      }
    });
  }

  try {
    // JWT認証チェック（簡易版 - 本番では適切な検証が必要）
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization token',
          timestamp: new Date().toISOString()
        }
      });
    }

    // リクエストボディから職員情報を取得
    const { staffId, facilityId, staffData } = req.body;

    if (!staffId && !staffData) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Either staffId or staffData is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    // facilityIdが提供された場合、施設別の調整を適用
    const useFacilityId = facilityId || staffData?.facility || 'obara-hospital';

    let staff: StaffMasterData;
    let calculatedLevel: number;
    let baseLevel: number = 0;
    let experienceBonus: number = 0;
    let leaderBonus: number = 0;
    let facilityAdjustment: number = 0;
    let positionLevel: number | undefined;

    // staffDataが提供された場合はそれを使用
    if (staffData) {
      staff = {
        ...staffData,
        hireDate: new Date(staffData.hireDate)
      };

      // 施設別の役職レベルチェック
      if (staff.position && useFacilityId) {
        const facilityLevel = facilityPositionMappingService.getPositionLevel(
          useFacilityId,
          staff.position
        );
        if (facilityLevel !== undefined) {
          positionLevel = facilityLevel;
          baseLevel = facilityLevel;
          // 施設別調整値を計算
          facilityAdjustment = facilityPositionMappingService.calculateFacilityAdjustment(
            useFacilityId,
            facilityLevel,
            staff.position
          );
          calculatedLevel = facilityLevel + facilityAdjustment;
        } else {
          // 通常の権限レベル計算
          calculatedLevel = accountLevelCalculator.calculateAccountLevel(staff);
        }
      } else {
        // 通常の権限レベル計算
        calculatedLevel = accountLevelCalculator.calculateAccountLevel(staff);
      }

      // 内訳を計算
      if (staff.position) {
        const posLevel = accountLevelCalculator['getPositionLevel'](staff.position);
        if (posLevel) {
          positionLevel = posLevel;
          baseLevel = posLevel;
        }
      }

      if (!positionLevel) {
        const years = staff.experienceYears || 0;
        const experienceLevel = years <= 1 ? 1 : years <= 3 ? 2 : years <= 10 ? 3 : 4;
        baseLevel = experienceLevel;
        experienceBonus = 0;

        // 看護職のリーダーボーナス
        if (['看護師', '准看護師'].includes(staff.profession) && staff.canPerformLeaderDuty) {
          leaderBonus = 0.5;
        }
      }
    } else {
      // staffIdが提供された場合はデータベースから取得（デモ用モックデータ）
      const mockStaff = getMockStaffData(staffId);
      if (!mockStaff) {
        return res.status(404).json({
          error: {
            code: 'STAFF_NOT_FOUND',
            message: `Staff with ID ${staffId} not found`,
            timestamp: new Date().toISOString()
          }
        });
      }

      staff = mockStaff;

      // 施設別の役職レベルチェック
      if (staff.position && useFacilityId) {
        const facilityLevel = facilityPositionMappingService.getPositionLevel(
          useFacilityId,
          staff.position
        );
        if (facilityLevel !== undefined) {
          positionLevel = facilityLevel;
          baseLevel = facilityLevel;
          facilityAdjustment = facilityPositionMappingService.calculateFacilityAdjustment(
            useFacilityId,
            facilityLevel,
            staff.position
          );
          calculatedLevel = facilityLevel + facilityAdjustment;
        } else {
          calculatedLevel = accountLevelCalculator.calculateAccountLevel(staff);
        }
      } else {
        calculatedLevel = accountLevelCalculator.calculateAccountLevel(staff);
      }

      // 内訳を計算（上記と同じロジック）
      if (staff.position) {
        const posLevel = accountLevelCalculator['getPositionLevel'](staff.position);
        if (posLevel) {
          positionLevel = posLevel;
          baseLevel = posLevel;
        }
      }

      if (!positionLevel) {
        const years = staff.experienceYears || 1;
        const experienceLevel = years <= 1 ? 1 : years <= 3 ? 2 : years <= 10 ? 3 : 4;
        baseLevel = experienceLevel;
        experienceBonus = 0;

        if (['看護師', '准看護師'].includes(staff.profession) && staff.canPerformLeaderDuty) {
          leaderBonus = 0.5;
        }
      }
    }

    // レベルの詳細情報を取得
    const levelDetails = accountLevelCalculator.getAccountLevelDetails(calculatedLevel);

    // レスポンス返却（5秒以内のタイムアウト要件を満たす）
    const response: CalculateLevelResponse = {
      staffId: staff.staffId,
      facilityId: useFacilityId,
      position: staff.position,
      accountLevel: calculatedLevel,
      breakdown: {
        baseLevel: baseLevel,
        experienceBonus,
        leaderBonus,
        facilityAdjustment,
        ...(positionLevel && { positionLevel })
      },
      levelDetails: {
        name: levelDetails.description,
        category: levelDetails.category,
        description: levelDetails.description
      },
      timestamp: new Date().toISOString()
    };

    // 成功レスポンス
    return res.status(200).json(response);

  } catch (error) {
    console.error('Calculate level error:', error);

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while calculating permission level',
        timestamp: new Date().toISOString()
      }
    });
  }
}

// デモ用モックデータ（実際はデータベースから取得）
function getMockStaffData(staffId: string): StaffMasterData | null {
  const mockData: Record<string, StaffMasterData> = {
    // VoiceDrive統合テスト用データ（25レベル体系対応）
    'TEST_STAFF_001': {
      staffId: 'TEST_STAFF_001',
      name: 'テスト職員001（新人）',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2024-04-01'),
      experienceYears: 1,
      canPerformLeaderDuty: false,
      accountLevel: 1  // Level 1: 新人
    },
    'TEST_STAFF_002': {
      staffId: 'TEST_STAFF_002',
      name: 'テスト職員002（新人リーダー）',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2024-04-01'),
      experienceYears: 1,
      canPerformLeaderDuty: true,  // リーダー業務可
      accountLevel: 1.5  // Level 1.5: 新人リーダー
    },
    'TEST_STAFF_003': {
      staffId: 'TEST_STAFF_003',
      name: 'テスト職員003（中堅）',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2020-04-01'),
      experienceYears: 5,
      canPerformLeaderDuty: false,
      accountLevel: 3  // Level 3: 中堅
    },
    'TEST_STAFF_004': {
      staffId: 'TEST_STAFF_004',
      name: 'テスト職員004（ベテラン）',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2010-04-01'),
      experienceYears: 15,
      canPerformLeaderDuty: false,
      accountLevel: 4  // Level 4: ベテラン
    },
    'TEST_STAFF_005': {
      staffId: 'TEST_STAFF_005',
      name: 'テスト職員005（ベテランリーダー）',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2010-04-01'),
      experienceYears: 15,
      canPerformLeaderDuty: true,  // リーダー業務可
      accountLevel: 4.5  // Level 4.5: ベテランリーダー
    },
    'TEST_STAFF_006': {
      staffId: 'TEST_STAFF_006',
      name: 'テスト職員006（部長）',
      facility: '小原病院',
      department: '医局',
      position: '部長',
      profession: '医師',
      hireDate: new Date('2005-04-01'),
      experienceYears: 20,
      accountLevel: 10  // Level 10: 部長・医局長
    },
    'TEST_STAFF_007': {
      staffId: 'TEST_STAFF_007',
      name: 'テスト職員007（人事マネージャー）',
      facility: '法人本部',
      department: '人事部',
      position: '人事各部門長',
      profession: '事務職',
      hireDate: new Date('2015-04-01'),
      experienceYears: 10,
      accountLevel: 15  // Level 15: 人事各部門長
    },
    'TEST_STAFF_008': {
      staffId: 'TEST_STAFF_008',
      name: 'テスト職員008（理事）',
      facility: '法人本部',
      department: '経営企画',
      position: '理事長',
      profession: '経営者',
      hireDate: new Date('2000-04-01'),
      experienceYears: 25,
      accountLevel: 18  // Level 18: 理事長・最高経営層
    },
    'TEST_STAFF_097': {
      staffId: 'TEST_STAFF_097',
      name: 'テスト職員097（健診担当者）',
      facility: '小原病院',
      department: '健康管理室',
      position: '健診担当者',
      profession: '保健師',
      hireDate: new Date('2018-04-01'),
      experienceYears: 7,
      accountLevel: 97  // Level 97: 健診担当者（特別権限）
    },
    'TEST_STAFF_098': {
      staffId: 'TEST_STAFF_098',
      name: 'テスト職員098（産業医）',
      facility: '小原病院',
      department: '健康管理室',
      position: '産業医',
      profession: '医師',
      hireDate: new Date('2010-04-01'),
      experienceYears: 15,
      accountLevel: 98  // Level 98: 産業医（特別権限）
    },
    'TEST_STAFF_099': {
      staffId: 'TEST_STAFF_099',
      name: 'テスト職員099（システム管理者）',
      facility: '法人本部',
      department: '情報システム部',
      position: 'システム管理者',
      profession: 'IT管理者',
      hireDate: new Date('2015-04-01'),
      experienceYears: 10,
      accountLevel: 99  // Level 99: システム管理者（最高権限）
    },

    // 既存のテストデータ
    'STAFF001': {
      staffId: 'STAFF001',
      name: '佐藤花子',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2025-04-01'),
      experienceYears: 0.5,
      canPerformLeaderDuty: false,
      accountLevel: 1
    },
    'STAFF002': {
      staffId: 'STAFF002',
      name: '鈴木太郎',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2025-04-01'),
      experienceYears: 0.5,
      canPerformLeaderDuty: true,  // リーダー可
      accountLevel: 1.5
    },
    'STAFF003': {
      staffId: 'STAFF003',
      name: '田中美咲',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2023-04-01'),
      experienceYears: 2.5,
      canPerformLeaderDuty: false,
      accountLevel: 2
    },
    'STAFF004': {
      staffId: 'STAFF004',
      name: '山田次郎',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2023-04-01'),
      experienceYears: 2.5,
      canPerformLeaderDuty: true,
      accountLevel: 2.5
    },
    'STAFF005': {
      staffId: 'STAFF005',
      name: '高橋恵子',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2019-04-01'),
      experienceYears: 6.5,
      canPerformLeaderDuty: true,
      accountLevel: 3.5
    },
    'STAFF006': {
      staffId: 'STAFF006',
      name: '伊藤洋子',
      facility: '小原病院',
      department: '看護部',
      profession: '看護師',
      hireDate: new Date('2010-04-01'),
      experienceYears: 15.5,
      canPerformLeaderDuty: true,
      accountLevel: 4.5
    },
    'STAFF007': {
      staffId: 'STAFF007',
      name: '渡辺明美',
      facility: '小原病院',
      department: '看護部',
      position: '副主任',
      profession: '看護師',
      hireDate: new Date('2012-04-01'),
      experienceYears: 13.5,
      accountLevel: 5
    },
    'STAFF008': {
      staffId: 'STAFF008',
      name: '小林正子',
      facility: '小原病院',
      department: '看護部',
      position: '主任',
      profession: '看護師',
      hireDate: new Date('2008-04-01'),
      experienceYears: 17.5,
      accountLevel: 6
    },
    'STAFF009': {
      staffId: 'STAFF009',
      name: '佐々木清',
      facility: '小原病院',
      department: '看護部',
      position: '師長',
      profession: '看護師',
      hireDate: new Date('2005-04-01'),
      experienceYears: 20.5,
      accountLevel: 8
    },
    'STAFF010': {
      staffId: 'STAFF010',
      name: '廻総師長',
      facility: '法人本部',
      department: '人事部',
      position: '戦略企画部門員',
      profession: '看護師',
      hireDate: new Date('2000-04-01'),
      experienceYears: 25.5,
      accountLevel: 16
    },
    'STAFF012': {
      staffId: 'STAFF012',
      name: '佐々木清',
      facility: '小原病院',
      department: '看護部',
      position: '師長',
      profession: '看護師',
      hireDate: new Date('2010-04-01'),
      experienceYears: 15,
      accountLevel: 8
    },
    'STAFF017': {
      staffId: 'STAFF017',
      name: '小原一郎',
      facility: '小原病院',
      department: '経営管理',
      position: '院長',
      profession: '医師',
      hireDate: new Date('1990-04-01'),
      experienceYears: 35,
      accountLevel: 13
    }
  };

  return mockData[staffId] || null;
}