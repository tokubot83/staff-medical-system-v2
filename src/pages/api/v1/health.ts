import { NextApiRequest, NextApiResponse } from 'next';

/**
 * ヘルスチェックAPI
 * GET /api/v1/health
 *
 * 医療システムの稼働状況を確認するためのエンドポイント
 */

interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  environment: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse>
) {
  // GETメソッドのみ許可
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  }

  // CORSヘッダー設定
  res.setHeader('Access-Control-Allow-Origin', process.env.VOICEDRIVE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 正常レスポンス
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
}
