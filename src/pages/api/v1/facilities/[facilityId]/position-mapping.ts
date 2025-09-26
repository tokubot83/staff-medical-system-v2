import { NextApiRequest, NextApiResponse } from 'next';
import { facilityPositionMappingService } from '../../../../../lib/facility-position-mapping';
import { FacilityPositionMapping } from '../../../../../types/facility-authority';

/**
 * 施設別役職マッピング取得API
 * GET /api/v1/facilities/{facilityId}/position-mapping
 *
 * VoiceDrive連携用
 * 各施設の役職と権限レベルのマッピング情報を提供
 */

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FacilityPositionMapping | ErrorResponse>
) {
  // CORSヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', process.env.VOICEDRIVE_URL || 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONSリクエスト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GETメソッドのみ許可
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET method is allowed',
        timestamp: new Date().toISOString()
      }
    });
  }

  try {
    // JWT認証チェック
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

    // facilityIdをパラメータから取得
    const { facilityId } = req.query;

    if (!facilityId || typeof facilityId !== 'string') {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'facilityId is required',
          timestamp: new Date().toISOString()
        }
      });
    }

    // 施設マッピング情報を取得
    const mapping = facilityPositionMappingService.getFacilityMapping(facilityId);

    if (!mapping) {
      return res.status(404).json({
        error: {
          code: 'FACILITY_NOT_FOUND',
          message: `Facility with ID ${facilityId} not found`,
          timestamp: new Date().toISOString()
        }
      });
    }

    // 成功レスポンス
    return res.status(200).json(mapping);

  } catch (error) {
    console.error('Get facility position mapping error:', error);

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching position mapping',
        timestamp: new Date().toISOString()
      }
    });
  }
}