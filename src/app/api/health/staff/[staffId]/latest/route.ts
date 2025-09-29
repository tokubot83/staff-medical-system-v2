/**
 * 職員の最新健診データ取得API
 * Created: 2025-09-29
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthCheckupService } from '@/services/health/healthCheckupService';

interface RouteParams {
  params: {
    staffId: string;
  };
}

/**
 * GET: 職員の最新健診データ取得
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { staffId } = params;

    const result = await healthCheckupService.findLatestByStaffId(staffId);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'この職員の健診データはありません'
        },
        { status: 404 }
      );
    }

    // 異常項目の取得
    const abnormalItems = await healthCheckupService.getAbnormalItems(result.id);

    // 主要項目の経年変化データ取得
    const trendData: Record<string, any> = {};
    const keyItems = ['BMI', 'SBP', 'DBP', 'T-CHO', 'GLU', 'eGFR'];

    for (const itemCode of keyItems) {
      const trend = await healthCheckupService.getTrendData(staffId, itemCode, 5);
      if (trend.length > 0) {
        trendData[itemCode] = trend;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        current: result,
        abnormalItems,
        trends: trendData,
        summary: {
          hasAbnormal: abnormalItems.length > 0,
          abnormalCount: abnormalItems.length,
          requiresReexamination: result.reexaminationRequired,
          overallResult: result.overallResult,
          checkupDate: result.checkupDate
        }
      }
    });

  } catch (error) {
    console.error('Get latest checkup error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get latest health checkup',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}