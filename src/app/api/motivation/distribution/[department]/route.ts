import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { department: string } }
) {
  try {
    const department = decodeURIComponent(params.department);
    
    // Mock department motivation distribution data
    // In a real implementation, this would query the database using Prisma
    const mockDistribution = {
      department: department,
      totalStaff: 24,
      lastUpdated: new Date(),
      distribution: [
        {
          motivationTypeId: 'teamwork',
          typeName: '関係・調和型',
          count: 8,
          percentage: 33.3,
          color: 'text-purple-600 bg-purple-50'
        },
        {
          motivationTypeId: 'growth',
          typeName: '成長・挑戦型',
          count: 6,
          percentage: 25.0,
          color: 'text-green-600 bg-green-50'
        },
        {
          motivationTypeId: 'stability',
          typeName: '安定・安心型',
          count: 4,
          percentage: 16.7,
          color: 'text-blue-600 bg-blue-50'
        },
        {
          motivationTypeId: 'recognition',
          typeName: '評価・承認型',
          count: 3,
          percentage: 12.5,
          color: 'text-yellow-600 bg-yellow-50'
        },
        {
          motivationTypeId: 'efficiency',
          typeName: '効率・合理型',
          count: 2,
          percentage: 8.3,
          color: 'text-orange-600 bg-orange-50'
        },
        {
          motivationTypeId: 'compensation',
          typeName: '報酬・待遇型',
          count: 1,
          percentage: 4.2,
          color: 'text-emerald-600 bg-emerald-50'
        },
        {
          motivationTypeId: 'creativity',
          typeName: '自由・創造型',
          count: 0,
          percentage: 0.0,
          color: 'text-pink-600 bg-pink-50'
        }
      ],
      insights: {
        dominantType: {
          type: 'teamwork',
          typeName: '関係・調和型',
          percentage: 33.3
        },
        diversity: {
          level: 'moderate',
          description: '中程度の多様性があります',
          uniqueTypes: 6
        },
        recommendations: [
          'チームワークを重視する職員が多いため、協働プロジェクトを増やすことを推奨します',
          '成長志向の職員も多いため、チーム単位での研修プログラムが効果的です',
          '安定性を求める職員への配慮も必要です'
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: mockDistribution
    });

  } catch (error) {
    console.error('Motivation distribution error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

