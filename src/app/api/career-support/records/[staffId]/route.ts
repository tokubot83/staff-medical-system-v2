import { NextRequest, NextResponse } from 'next/server';
import { mockCareerRecords } from '@/data/mockCareerData';

// GET: 特定職員のキャリアカルテを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  try {
    const record = mockCareerRecords.find(r => r.staffId === params.staffId);

    if (!record) {
      return NextResponse.json(
        { error: 'Career record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { record },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch career record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career record' },
      { status: 500 }
    );
  }
}

// PATCH: キャリアカルテを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  try {
    const body = await request.json();
    const recordIndex = mockCareerRecords.findIndex(r => r.staffId === params.staffId);

    if (recordIndex === -1) {
      return NextResponse.json(
        { error: 'Career record not found' },
        { status: 404 }
      );
    }

    // 更新
    mockCareerRecords[recordIndex] = {
      ...mockCareerRecords[recordIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        record: mockCareerRecords[recordIndex],
        message: 'Career record updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update career record:', error);
    return NextResponse.json(
      { error: 'Failed to update career record' },
      { status: 500 }
    );
  }
}

// DELETE: キャリアカルテを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  try {
    const recordIndex = mockCareerRecords.findIndex(r => r.staffId === params.staffId);

    if (recordIndex === -1) {
      return NextResponse.json(
        { error: 'Career record not found' },
        { status: 404 }
      );
    }

    // 削除（実際はソフトデリート推奨）
    mockCareerRecords.splice(recordIndex, 1);

    return NextResponse.json(
      { message: 'Career record deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete career record:', error);
    return NextResponse.json(
      { error: 'Failed to delete career record' },
      { status: 500 }
    );
  }
}