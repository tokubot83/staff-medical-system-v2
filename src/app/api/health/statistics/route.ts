/**
 * 健康診断 統計データAPI
 * Created: 2025-09-29
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthCheckupService } from '@/services/health/healthCheckupService';

// 動的レンダリングを強制（ビルド時の静的生成をスキップ）
export const dynamic = 'force-dynamic'

/**
 * GET: 統計データ取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      department: searchParams.get('department') || undefined,
      fiscalYear: searchParams.get('fiscalYear') || new Date().getFullYear().toString()
    };

    const statistics = await healthCheckupService.getStatistics(params);

    return NextResponse.json({
      success: true,
      data: statistics,
      period: {
        fiscalYear: params.fiscalYear,
        department: params.department || '全体'
      }
    });

  } catch (error) {
    console.error('Statistics error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}