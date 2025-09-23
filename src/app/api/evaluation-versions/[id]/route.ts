import { NextRequest, NextResponse } from 'next/server';

// メモリ内でデータを管理（実際はデータベースを使用）
// TODO: route.tsと共通のデータストアを使用する必要がある
let evaluationVersions = [
  {
    id: 'v1',
    name: 'v1.0 基本評価制度',
    version: '1.0',
    description: '初期の評価制度。シンプルな5段階評価',
    status: 'archived',
    effectiveFrom: '2021-04-01',
    effectiveTo: '2022-03-31',
    features: ['5段階評価', '年1回評価', '上司評価のみ'],
    technicalScore: 100,
    contributionScore: 0,
  },
  {
    id: 'v2',
    name: 'v2.0 360度評価導入',
    version: '2.0',
    description: '360度評価を導入し、多面的な評価を実現',
    status: 'archived',
    effectiveFrom: '2022-04-01',
    effectiveTo: '2023-03-31',
    features: ['360度評価', '同僚評価', '部下評価', '自己評価'],
    technicalScore: 80,
    contributionScore: 20,
  },
  {
    id: 'v3',
    name: 'v3.0 貢献度評価追加',
    version: '3.0',
    description: '組織貢献度を評価に追加。技術70点＋貢献度30点',
    status: 'archived',
    effectiveFrom: '2023-04-01',
    effectiveTo: '2024-03-31',
    features: ['技術評価70点', '組織貢献度30点', '年2回評価'],
    technicalScore: 70,
    contributionScore: 30,
  },
  {
    id: 'v4',
    name: 'v4.0 2軸統合評価（現行）',
    version: '4.0',
    description: '技術評価と組織貢献度を統合した2軸評価制度',
    status: 'active',
    effectiveFrom: '2024-04-01',
    features: [
      '技術評価50点',
      '組織貢献度50点',
      '2軸マトリックス評価',
      '7段階最終評価',
      '四半期毎の中間評価'
    ],
    technicalScore: 50,
    contributionScore: 50,
  },
  {
    id: 'v5',
    name: 'v5.0 AI支援評価（準備中）',
    version: '5.0',
    description: 'AI分析を活用した客観的評価支援システム',
    status: 'preparing',
    effectiveFrom: '2025-04-01',
    features: [
      'AI分析支援',
      '行動データ自動収集',
      'リアルタイム評価',
      '予測分析',
      'キャリアパス提案'
    ],
    technicalScore: 40,
    contributionScore: 40,
  },
];

// GET: 特定のバージョンを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const version = evaluationVersions.find(v => v.id === params.id);

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ version });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 }
    );
  }
}

// PATCH: バージョンを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = evaluationVersions.findIndex(v => v.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    evaluationVersions[index] = {
      ...evaluationVersions[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Version updated successfully',
      version: evaluationVersions[index]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update version' },
      { status: 500 }
    );
  }
}

// DELETE: バージョンを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = evaluationVersions.findIndex(v => v.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // アクティブなバージョンは削除不可
    if (evaluationVersions[index].status === 'active') {
      return NextResponse.json(
        { error: 'Cannot delete active version' },
        { status: 400 }
      );
    }

    evaluationVersions.splice(index, 1);

    return NextResponse.json({
      message: 'Version deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    );
  }
}