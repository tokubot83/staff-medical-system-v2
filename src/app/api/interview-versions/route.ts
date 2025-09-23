import { NextRequest, NextResponse } from 'next/server';

// メモリ内データストア（実際の実装ではデータベースを使用）
let interviewVersions = [
  {
    id: 'iv1',
    name: 'v1.0 基本面談制度',
    version: '1.0',
    description: '初期の面談制度。年2回の定期面談のみ',
    status: 'archived',
    effectiveFrom: '2021-04-01',
    effectiveTo: '2022-03-31',
    evaluationVersionId: 'v1',
    regularInterviews: {
      enabled: true,
      newEmployee: { months: [1, 3], duration: 30 },
      annual: { frequency: 2, timing: 'fixed' },
      management: { frequency: 1 }
    },
    specialInterviews: {
      enabled: false,
      types: []
    },
    supportCategories: {
      enabled: false,
      categories: []
    }
  },
  {
    id: 'iv2',
    name: 'v2.0 随時面談導入',
    version: '2.0',
    description: '特別面談・支援区分を追加',
    status: 'archived',
    effectiveFrom: '2022-04-01',
    effectiveTo: '2023-03-31',
    evaluationVersionId: 'v2',
    regularInterviews: {
      enabled: true,
      newEmployee: { months: [1, 3, 6], duration: 30 },
      annual: { frequency: 2, timing: 'fixed' },
      management: { frequency: 2 }
    },
    specialInterviews: {
      enabled: true,
      types: ['problem', 'promotion']
    },
    supportCategories: {
      enabled: true,
      categories: ['A', 'B']
    }
  },
  {
    id: 'iv3',
    name: 'v3.0 包括支援体制（現行）',
    version: '3.0',
    description: '全10種類の面談を体系的に運用',
    status: 'active',
    effectiveFrom: '2023-04-01',
    regularInterviews: {
      enabled: true,
      newEmployee: { months: [1, 3, 6, 12], duration: 45 },
      annual: { frequency: 2, timing: 'flexible' },
      management: { frequency: 4 }
    },
    specialInterviews: {
      enabled: true,
      types: ['problem', 'promotion', 'career', 'comeback']
    },
    supportCategories: {
      enabled: true,
      categories: ['A', 'B', 'C']
    },
    evaluationIntegration: {
      linkedToEvaluation: true,
      feedbackCycle: 'quarterly',
      improvementTracking: true
    }
  },
  {
    id: 'iv4',
    name: 'v4.0 AI支援面談（準備中）',
    version: '4.0',
    description: 'AI分析による面談支援システム',
    status: 'preparing',
    effectiveFrom: '2025-04-01',
    evaluationVersionId: 'v5',
    regularInterviews: {
      enabled: true,
      newEmployee: { months: [1, 2, 3, 6, 9, 12], duration: 30 },
      annual: { frequency: 'continuous', timing: 'adaptive' },
      management: { frequency: 'as-needed' }
    },
    specialInterviews: {
      enabled: true,
      types: ['problem', 'promotion', 'career', 'comeback', 'development', 'wellness']
    },
    supportCategories: {
      enabled: true,
      categories: ['A', 'B', 'C', 'D']
    },
    aiSupport: {
      enabled: true,
      features: ['sentiment-analysis', 'issue-detection', 'recommendation-engine']
    }
  }
];

// GET: 面談バージョン一覧を取得
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        versions: interviewVersions,
        total: interviewVersions.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch interview versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview versions' },
      { status: 500 }
    );
  }
}

// POST: 新しい面談バージョンを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    if (!body.name || !body.version || !body.description) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // 新しいバージョンを追加
    const newVersion = {
      ...body,
      id: body.id || `iv${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    interviewVersions.push(newVersion);

    return NextResponse.json(
      {
        version: newVersion,
        message: 'Interview version created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create interview version:', error);
    return NextResponse.json(
      { error: 'Failed to create interview version' },
      { status: 500 }
    );
  }
}