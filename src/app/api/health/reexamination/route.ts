/**
 * 再検査対象者管理API
 * Created: 2025-09-29
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthCheckupService } from '@/services/health/healthCheckupService';

/**
 * GET: 要再検査者リスト取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      department: searchParams.get('department') || undefined,
      onlyPending: searchParams.get('onlyPending') === 'true'
    };

    const list = await healthCheckupService.getReexaminationList(params);

    // 再検査項目ごとにグループ化
    const groupedByItems = list.reduce((acc, checkup) => {
      const items = checkup.reexaminationItems?.split(',') || [];
      items.forEach(item => {
        const trimmedItem = item.trim();
        if (!acc[trimmedItem]) {
          acc[trimmedItem] = [];
        }
        acc[trimmedItem].push({
          staffId: checkup.staffId,
          staffName: checkup.staff?.name || '',
          department: checkup.staff?.department || '',
          checkupDate: checkup.checkupDate,
          overallResult: checkup.overallResult
        });
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      data: {
        total: list.length,
        list: list,
        byItems: groupedByItems,
        summary: {
          pending: list.filter(l => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return l.checkupDate < thirtyDaysAgo;
          }).length,
          recent: list.filter(l => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return l.checkupDate >= thirtyDaysAgo;
          }).length
        }
      }
    });

  } catch (error) {
    console.error('Reexamination list error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get reexamination list',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}