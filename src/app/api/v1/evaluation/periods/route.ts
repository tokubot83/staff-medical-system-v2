import { NextRequest, NextResponse } from 'next/server';

// 評価期間マスタデータ
const evaluationPeriods = [
  {
    id: '2025-H1',
    name: '2025年度上期',
    startDate: '2025-04-01',
    endDate: '2025-09-30',
    evaluationStartDate: '2025-09-15',
    evaluationEndDate: '2025-10-15',
    disclosureDate: '2025-10-20',
    appealDeadline: '2025-11-03', // 開示後2週間
    status: 'active'
  },
  {
    id: '2024-H2',
    name: '2024年度下期',
    startDate: '2024-10-01',
    endDate: '2025-03-31',
    evaluationStartDate: '2025-03-15',
    evaluationEndDate: '2025-04-15',
    disclosureDate: '2025-04-20',
    appealDeadline: '2025-05-04',
    status: 'closed'
  },
  {
    id: '2025-H2',
    name: '2025年度下期',
    startDate: '2025-10-01',
    endDate: '2026-03-31',
    evaluationStartDate: '2026-03-15',
    evaluationEndDate: '2026-04-15',
    disclosureDate: '2026-04-20',
    appealDeadline: '2026-05-04',
    status: 'future'
  },
  {
    id: 'TEST-2025',
    name: 'テスト評価期間',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    evaluationStartDate: '2025-08-01',
    evaluationEndDate: '2025-08-31',
    disclosureDate: '2025-09-01',
    appealDeadline: '2025-12-31',
    status: 'active'
  }
];

// GET: 評価期間一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const includeTest = searchParams.get('includeTest') !== 'false';
    
    let periods = [...evaluationPeriods];
    
    // テスト期間を除外
    if (!includeTest) {
      periods = periods.filter(p => !p.id.startsWith('TEST'));
    }
    
    // アクティブな期間のみ
    if (activeOnly) {
      periods = periods.filter(p => p.status === 'active');
    }
    
    // 現在日時を追加
    const now = new Date().toISOString();
    const enrichedPeriods = periods.map(period => ({
      ...period,
      isAppealable: new Date(period.appealDeadline) > new Date(),
      daysUntilAppealDeadline: Math.ceil(
        (new Date(period.appealDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    }));
    
    return NextResponse.json({
      success: true,
      periods: enrichedPeriods,
      currentDate: now,
      metadata: {
        total: enrichedPeriods.length,
        active: enrichedPeriods.filter(p => p.status === 'active').length,
        appealable: enrichedPeriods.filter(p => p.isAppealable).length
      }
    });
    
  } catch (error) {
    console.error('Error fetching evaluation periods:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'E500',
          message: 'Failed to fetch evaluation periods',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

// POST: 評価期間の追加（管理者用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.id || !body.name || !body.startDate || !body.endDate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E001',
            message: 'Required fields missing'
          }
        },
        { status: 400 }
      );
    }
    
    // 新しい期間を追加（実際の実装ではDBに保存）
    const newPeriod = {
      ...body,
      status: 'future',
      createdAt: new Date().toISOString()
    };
    
    evaluationPeriods.push(newPeriod);
    
    return NextResponse.json({
      success: true,
      period: newPeriod,
      message: '評価期間を追加しました'
    });
    
  } catch (error) {
    console.error('Error adding evaluation period:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'E500',
          message: 'Failed to add evaluation period',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}

// PUT: 評価期間の更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E001',
            message: 'Period ID is required'
          }
        },
        { status: 400 }
      );
    }
    
    // 期間を検索して更新（実際の実装ではDBを更新）
    const periodIndex = evaluationPeriods.findIndex(p => p.id === id);
    
    if (periodIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'E404',
            message: 'Period not found'
          }
        },
        { status: 404 }
      );
    }
    
    evaluationPeriods[periodIndex] = {
      ...evaluationPeriods[periodIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      period: evaluationPeriods[periodIndex],
      message: '評価期間を更新しました'
    });
    
  } catch (error) {
    console.error('Error updating evaluation period:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'E500',
          message: 'Failed to update evaluation period',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}
