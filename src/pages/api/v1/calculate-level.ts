import { NextApiRequest, NextApiResponse } from 'next';
import { accountLevelCalculator, StaffMasterData } from '../../../services/accountLevelCalculator';

/**
 * VoiceDrive連携用 権限レベル計算API
 * POST /api/v1/calculate-level
 *
 * VoiceDriveからのJWT認証付きリクエストを受け付け
 * 職員の18段階権限レベルを計算して返す
 */

// レスポンス型定義
interface CalculateLevelResponse {
  staffId: string;
  accountLevel: number;
  breakdown: {
    baseLevel: number;
    leaderBonus: number;
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
    const { staffId, staffData } = req.body;

    if (!staffId && !staffData) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Either staffId or staffData is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    let staff: StaffMasterData;
    let calculatedLevel: number;
    let baseLevel: number;
    let leaderBonus: number = 0;
    let positionLevel: number | undefined;

    // staffDataが提供された場合はそれを使用
    if (staffData) {
      staff = {
        ...staffData,
        hireDate: new Date(staffData.hireDate)
      };

      // 権限レベル計算
      calculatedLevel = accountLevelCalculator.calculateAccountLevel(staff);

      // 内訳を計算
      if (staff.position) {
        const posLevel = accountLevelCalculator['getPositionLevel'](staff.position);
        if (posLevel) {
          positionLevel = posLevel;
          baseLevel = posLevel;
        }
      }

      if (!positionLevel) {
        const years = staff.experienceYears ||
          accountLevelCalculator['calculateExperienceYears'](staff.hireDate.toISOString());
        baseLevel = accountLevelCalculator['getExperienceLevelMapping'](years);

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
      calculatedLevel = accountLevelCalculator.calculateAccountLevel(staff);

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
        baseLevel = accountLevelCalculator['getExperienceLevelMapping'](years);

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
      accountLevel: calculatedLevel,
      breakdown: {
        baseLevel: baseLevel!,
        leaderBonus,
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