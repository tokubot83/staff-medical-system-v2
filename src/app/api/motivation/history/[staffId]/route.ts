import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  try {
    const staffId = parseInt(params.staffId);
    
    if (isNaN(staffId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid staff ID' },
        { status: 400 }
      );
    }

    // Mock motivation history data
    // In a real implementation, this would query the database using Prisma
    const mockHistory = [
      {
        id: 1,
        staffId: staffId,
        motivationTypeId: 'growth',
        typeName: '成長・挑戦型',
        assessmentDate: new Date('2024-01-15'),
        assessedBy: 5,
        assessorName: '田中 部長',
        confidenceLevel: 'high',
        notes: '新規プロジェクトへの積極的な取り組みが見られる',
        isPrimary: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        staffId: staffId,
        motivationTypeId: 'teamwork',
        typeName: '関係・調和型',
        assessmentDate: new Date('2023-07-20'),
        assessedBy: 3,
        assessorName: '佐藤 主任',
        confidenceLevel: 'medium',
        notes: 'チーム内での協調性を重視する傾向',
        isPrimary: false,
        createdAt: new Date('2023-07-20'),
        updatedAt: new Date('2023-07-20')
      },
      {
        id: 3,
        staffId: staffId,
        motivationTypeId: 'recognition',
        typeName: '評価・承認型',
        assessmentDate: new Date('2023-01-10'),
        assessedBy: 5,
        assessorName: '田中 部長',
        confidenceLevel: 'medium',
        notes: '評価への関心が高く、フィードバックを積極的に求める',
        isPrimary: true,
        createdAt: new Date('2023-01-10'),
        updatedAt: new Date('2023-01-10')
      }
    ];

    // Calculate trend analysis
    const trendAnalysis = analyzeTrend(mockHistory);

    return NextResponse.json({
      success: true,
      data: {
        staffId: staffId,
        history: mockHistory,
        currentType: mockHistory[0], // Most recent assessment
        trendAnalysis: trendAnalysis
      }
    });

  } catch (error) {
    console.error('Motivation history error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function analyzeTrend(history: any[]) {
  if (history.length < 2) {
    return {
      status: 'insufficient_data',
      message: 'データが不足しているため、トレンド分析ができません'
    };
  }

  const recent = history[0];
  const previous = history[1];

  if (recent.motivationTypeId === previous.motivationTypeId) {
    return {
      status: 'stable',
      message: `${recent.typeName}で安定しています`,
      recommendation: '現在のアプローチを継続し、定期的にモチベーションの変化を確認してください'
    };
  } else {
    return {
      status: 'changed',
      message: `${previous.typeName}から${recent.typeName}に変化しました`,
      recommendation: '動機タイプの変化に応じて、マネジメントアプローチを調整することを検討してください'
    };
  }
}