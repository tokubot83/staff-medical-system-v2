import { NextRequest, NextResponse } from 'next/server';
import { mockCareerRecords } from '@/data/mockCareerData';

// GET: 職員キャリアカルテ一覧を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const department = searchParams.get('department');
    const supportLevel = searchParams.get('supportLevel');
    const phase = searchParams.get('phase');

    let filteredRecords = [...mockCareerRecords];

    // 部署でフィルタリング
    if (department) {
      filteredRecords = filteredRecords.filter(
        record => record.department === department
      );
    }

    // 支援レベルでフィルタリング
    if (supportLevel) {
      filteredRecords = filteredRecords.filter(
        record => record.careerSupport.supportLevel === supportLevel
      );
    }

    // キャリアフェーズでフィルタリング
    if (phase) {
      filteredRecords = filteredRecords.filter(
        record => record.careerSupport.currentPhase === phase
      );
    }

    return NextResponse.json(
      {
        records: filteredRecords,
        total: filteredRecords.length,
        summary: {
          totalStaff: mockCareerRecords.length,
          byLevel: {
            A: mockCareerRecords.filter(r => r.careerSupport.supportLevel === 'A').length,
            B: mockCareerRecords.filter(r => r.careerSupport.supportLevel === 'B').length,
            C: mockCareerRecords.filter(r => r.careerSupport.supportLevel === 'C').length,
            D: mockCareerRecords.filter(r => r.careerSupport.supportLevel === 'D').length,
          },
          byPhase: {
            onboarding: mockCareerRecords.filter(r => r.careerSupport.currentPhase === 'onboarding').length,
            growth: mockCareerRecords.filter(r => r.careerSupport.currentPhase === 'growth').length,
            stable: mockCareerRecords.filter(r => r.careerSupport.currentPhase === 'stable').length,
            transition: mockCareerRecords.filter(r => r.careerSupport.currentPhase === 'transition').length,
            intensive: mockCareerRecords.filter(r => r.careerSupport.currentPhase === 'intensive').length,
            leadership: mockCareerRecords.filter(r => r.careerSupport.currentPhase === 'leadership').length,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch career records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career records' },
      { status: 500 }
    );
  }
}

// POST: 新しいキャリアカルテを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    if (!body.staffId || !body.staffName || !body.department) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // 新しいレコードを作成（実際はDBに保存）
    const newRecord = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // モックデータに追加
    mockCareerRecords.push(newRecord);

    return NextResponse.json(
      {
        record: newRecord,
        message: 'Career record created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create career record:', error);
    return NextResponse.json(
      { error: 'Failed to create career record' },
      { status: 500 }
    );
  }
}