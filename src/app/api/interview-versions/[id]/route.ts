import { NextRequest, NextResponse } from 'next/server';

// メモリ内データストア（実際の実装ではデータベースを使用）
// ※本来は共有モジュールから取得
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

// GET: 特定の面談バージョンを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeData();

    const version = interviewVersions.find(v => v.id === params.id);

    if (!version) {
      return NextResponse.json(
        { error: 'Interview version not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { version },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch interview version:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview version' },
      { status: 500 }
    );
  }
}

// PATCH: 面談バージョンを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeData();

    const body = await request.json();
    const versionIndex = interviewVersions.findIndex(v => v.id === params.id);

    if (versionIndex === -1) {
      return NextResponse.json(
        { error: 'Interview version not found' },
        { status: 404 }
      );
    }

    // 更新
    interviewVersions[versionIndex] = {
      ...interviewVersions[versionIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(
      {
        version: interviewVersions[versionIndex],
        message: 'Interview version updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update interview version:', error);
    return NextResponse.json(
      { error: 'Failed to update interview version' },
      { status: 500 }
    );
  }
}

// DELETE: 面談バージョンを削除
export async function DELETE(
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

    // アクティブなバージョンは削除できない
    if (interviewVersions[versionIndex].status === 'active') {
      return NextResponse.json(
        { error: 'Cannot delete active version' },
        { status: 400 }
      );
    }

    // 削除
    interviewVersions.splice(versionIndex, 1);

    return NextResponse.json(
      { message: 'Interview version deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete interview version:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview version' },
      { status: 500 }
    );
  }
}