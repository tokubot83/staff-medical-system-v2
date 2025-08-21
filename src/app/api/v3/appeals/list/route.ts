import { NextRequest, NextResponse } from 'next/server';

// V3評価システム 異議申し立て一覧取得エンドポイント
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'receivedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 認証確認（簡易実装）
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json(
        { success: false, error: { message: '認証が必要です', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      );
    }

    // データベースから申し立て一覧を取得（モック実装）
    const appeals = await fetchAppealsFromDatabase({
      employeeId,
      status,
      page,
      limit,
      sortBy,
      sortOrder
    });

    // 統計情報の計算
    const statistics = await calculateStatistics(employeeId);

    return NextResponse.json({
      success: true,
      appeals: appeals.data,
      pagination: {
        currentPage: page,
        totalPages: appeals.totalPages,
        totalItems: appeals.totalItems,
        hasNext: page < appeals.totalPages,
        hasPrev: page > 1
      },
      statistics,
      meta: {
        requestedAt: new Date().toISOString(),
        version: 'v3'
      }
    });

  } catch (error) {
    console.error('V3 Appeals list error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'データ取得中にエラーが発生しました', 
          code: 'FETCH_ERROR',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        } 
      },
      { status: 500 }
    );
  }
}

// データベースから申し立て一覧を取得（モック実装）
async function fetchAppealsFromDatabase(params: {
  employeeId: string | null;
  status: string | null;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}) {
  // モックデータ（実装時はDBクエリに置き換え）
  const mockAppeals = [
    {
      appealId: 'APL20250821001',
      employeeId: 'EMP001',
      employeeName: '田中 太郎',
      department: '外来看護部',
      jobCategory: '正看護師',
      evaluationPeriod: '2025年度上期',
      appealType: 'score_dispute',
      status: 'under-review',
      priority: 'high',
      submittedAt: '2025-08-20T10:30:00Z',
      receivedAt: '2025-08-20T10:30:00Z',
      assignedTo: 'MGR001',
      evaluatorName: '山田 評価者',
      estimatedResponseDate: '2025-09-10',
      scores: {
        currentTotal: 85.5,
        disputedItems: [
          {
            itemId: 'tech_skill_01',
            currentScore: 20,
            expectedScore: 25,
            reason: '研修講師実績が評価されていない'
          }
        ]
      },
      relativeEvaluation: {
        facilityGrade: 'B',
        corporateGrade: 'B',
        disputeReason: '同職種内での相対位置に疑問'
      },
      conversationId: 'vd_conv_12345',
      submittedVia: 'voicedrive',
      lastActivity: '2025-08-21T09:15:00Z'
    },
    {
      appealId: 'APL20250821002',
      employeeId: 'EMP002',
      employeeName: '佐藤 花子',
      department: '急性期病棟',
      jobCategory: '准看護師',
      evaluationPeriod: '2025年度上期',
      appealType: 'relative_evaluation',
      status: 'received',
      priority: 'medium',
      submittedAt: '2025-08-21T14:20:00Z',
      receivedAt: '2025-08-21T14:20:00Z',
      assignedTo: 'MGR002',
      evaluatorName: '鈴木 評価者',
      estimatedResponseDate: '2025-09-11',
      scores: {
        currentTotal: 78.0,
        disputedItems: []
      },
      relativeEvaluation: {
        facilityGrade: 'C',
        corporateGrade: 'C',
        disputeReason: '施設内順位の計算に誤りがあると思われる'
      },
      conversationId: 'vd_conv_67890',
      submittedVia: 'voicedrive',
      lastActivity: '2025-08-21T14:20:00Z'
    }
  ];

  // フィルタリング
  let filteredAppeals = mockAppeals;
  
  if (params.employeeId && params.employeeId !== 'current') {
    filteredAppeals = filteredAppeals.filter(appeal => appeal.employeeId === params.employeeId);
  }
  
  if (params.status) {
    filteredAppeals = filteredAppeals.filter(appeal => appeal.status === params.status);
  }

  // ソート
  filteredAppeals.sort((a, b) => {
    const aValue = a[params.sortBy as keyof typeof a] as string;
    const bValue = b[params.sortBy as keyof typeof b] as string;
    
    if (params.sortOrder === 'desc') {
      return bValue.localeCompare(aValue);
    } else {
      return aValue.localeCompare(bValue);
    }
  });

  // ページネーション
  const totalItems = filteredAppeals.length;
  const totalPages = Math.ceil(totalItems / params.limit);
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedAppeals = filteredAppeals.slice(startIndex, endIndex);

  return {
    data: paginatedAppeals,
    totalItems,
    totalPages
  };
}

// 統計情報の計算
async function calculateStatistics(employeeId: string | null) {
  // モック統計データ（実装時はDBクエリに置き換え）
  const stats = {
    total: 12,
    byStatus: {
      received: 3,
      underReview: 5,
      additionalInfo: 2,
      resolved: 2,
      withdrawn: 0,
      rejected: 0
    },
    byType: {
      scoreDispute: 7,
      relativeEvaluation: 3,
      calculationError: 1,
      other: 1
    },
    byPriority: {
      high: 2,
      medium: 6,
      low: 4
    },
    averageResolutionDays: 18,
    responseTimeCompliance: 95.5, // %
    satisfactionScore: 4.2, // 5点満点
    thisMonth: {
      submitted: 8,
      resolved: 5,
      avgResponseTime: 2.1 // days
    },
    trends: {
      lastMonth: 10,
      changePercent: 20.0 // +20%
    }
  };

  return stats;
}

// ステータス更新エンドポイント
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { appealId, status, reviewerComment, scoreAdjustment } = body;

    // 認証確認
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    const token = authorization.split(' ')[1];
    const VOICEDRIVE_API_KEY = process.env.VOICEDRIVE_API_KEY || 'vd_dev_key_12345';
    if (token !== VOICEDRIVE_API_KEY) {
      return NextResponse.json(
        { success: false, error: '無効な認証トークンです' },
        { status: 401 }
      );
    }
    
    // 必須フィールドチェック
    if (!appealId) {
      return NextResponse.json(
        { success: false, error: '異議申立IDが見つかりません' },
        { status: 404 }
      );
    }

    // ステータス更新の実行
    const updatedAppeal = await updateAppealStatus({
      appealId,
      status,
      reviewerComment,
      scoreAdjustment,
      updatedAt: new Date().toISOString()
    });

    // VoiceDriveへの通知（ステータス変更時）
    const notificationSent = await notifyVoiceDriveStatusChange(appealId, status, reviewerComment);

    return NextResponse.json({
      success: true,
      appealId,
      status,
      notificationSent,
      voiceDriveResponse: notificationSent ? { status: 'sent', timestamp: new Date().toISOString() } : null,
      message: 'ステータスを更新しました'
    });

  } catch (error) {
    console.error('Appeal status update error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'ステータス更新中にエラーが発生しました', 
          code: 'UPDATE_ERROR'
        } 
      },
      { status: 500 }
    );
  }
}

// ステータス更新の実行（モック実装）
async function updateAppealStatus(updateData: {
  appealId: string;
  status: string;
  reviewerComment?: string;
  scoreAdjustment?: any;
  updatedAt: string;
}) {
  // 実装時はDBアップデートに置き換え
  console.log('Updating appeal status:', updateData);
  
  return {
    ...updateData,
    success: true
  };
}

// VoiceDriveへのステータス変更通知
async function notifyVoiceDriveStatusChange(appealId: string, status: string, comment?: string): Promise<boolean> {
  // 実装時はVoiceDrive APIへの通知送信
  console.log(`Notifying VoiceDrive: Appeal ${appealId} status changed to ${status}`);
  
  const notification = {
    appealId,
    status,
    comment,
    timestamp: new Date().toISOString(),
    notificationType: 'status_update'
  };
  
  // VoiceDrive Webhook送信はここで実装
  return true; // モック実装では常に成功
}