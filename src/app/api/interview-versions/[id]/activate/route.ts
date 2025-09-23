import { NextRequest, NextResponse } from 'next/server';

// メモリ内データストア（実際の実装ではデータベースを使用）
let interviewVersions: any[] = [];

// 初期データを設定
async function initializeData() {
  if (interviewVersions.length === 0) {
    // 本来はデータベースから取得
    const response = await fetch('http://localhost:3000/api/interview-versions');
    if (response.ok) {
      const data = await response.json();
      interviewVersions = data.versions || [];
    }
  }
}

// POST: 面談バージョンを有効化
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeData();

    const versionIndex = interviewVersions.findIndex(v => v.id === params.id);

    if (versionIndex === -1) {
      return NextResponse.json(
        { error: 'Interview version not found' },
        { status: 404 }
      );
    }

    // 他のバージョンを非アクティブ化
    interviewVersions = interviewVersions.map(v => ({
      ...v,
      status: v.id === params.id ? 'active' : (v.status === 'active' ? 'archived' : v.status),
      updatedAt: new Date().toISOString()
    }));

    return NextResponse.json(
      {
        version: interviewVersions[versionIndex],
        message: 'Interview version activated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to activate interview version:', error);
    return NextResponse.json(
      { error: 'Failed to activate interview version' },
      { status: 500 }
    );
  }
}