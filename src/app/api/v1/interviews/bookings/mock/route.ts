import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ログファイルのパス
const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'voicedrive-integration.log');

// ログ記録関数
function logRequest(method: string, body: any, response: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method,
    endpoint: '/api/v1/interviews/bookings/mock',
    request: body,
    response,
    source: 'VoiceDrive Integration Test'
  };

  // ログディレクトリが存在しない場合は作成
  const logDir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // ログファイルに追記
  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(LOG_FILE_PATH, logLine);

  // コンソールにも出力（開発時のモニタリング用）
  console.log(`[${timestamp}] VoiceDrive API Request:`, {
    method,
    type: body?.interviewType,
    category: body?.interviewCategory,
    employee: body?.employeeName
  });
}

// カテゴリが不要な面談種別
const categoriesNotRequired = [
  'new_employee_monthly',
  'regular_annual',
  'management_biannual',
  'return_to_work',
  'incident_followup',
  'exit_interview',
  'feedback'
];

// POST: 予約登録
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const errors = [];
    
    // 必須項目チェック
    if (!body.employeeId) errors.push('employeeId is required');
    if (!body.employeeName) errors.push('employeeName is required');
    if (!body.interviewType) errors.push('interviewType is required');
    if (!body.bookingDate) errors.push('bookingDate is required');
    if (!body.startTime) errors.push('startTime is required');
    
    // カテゴリ選択ルールのチェック
    const requiresCategory = !categoriesNotRequired.includes(body.interviewType);
    if (requiresCategory && !body.interviewCategory) {
      errors.push(`interviewCategory is required for ${body.interviewType}`);
    }
    if (!requiresCategory && body.interviewCategory) {
      console.warn(`Warning: interviewCategory provided but not required for ${body.interviewType}`);
    }
    
    // エラーがある場合
    if (errors.length > 0) {
      const errorResponse = {
        success: false,
        errors,
        code: 'E001'
      };
      logRequest('POST', body, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // 成功レスポンス
    const successResponse = {
      success: true,
      bookingId: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: '予約を受け付けました',
      details: {
        interviewType: body.interviewType,
        category: body.interviewCategory || null,
        employeeName: body.employeeName,
        bookingDate: body.bookingDate,
        timeSlot: `${body.startTime}-${body.endTime || ''}`,
        processedAt: new Date().toISOString()
      }
    };
    
    logRequest('POST', body, successResponse);
    return NextResponse.json(successResponse);
    
  } catch (error) {
    const errorResponse = {
      success: false,
      error: 'Internal server error',
      code: 'E500'
    };
    logRequest('POST', null, errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET: 予約一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // モックデータ
    const mockBookings = [
      {
        bookingId: 'BK-2024-12-001',
        employeeId: 'E001',
        employeeName: '山田太郎',
        interviewType: 'regular_annual',
        interviewCategory: null,
        bookingDate: date || '2024-12-25',
        startTime: '10:00',
        endTime: '11:00',
        status: 'scheduled'
      },
      {
        bookingId: 'BK-2024-12-002',
        employeeId: 'E002',
        employeeName: '佐藤花子',
        interviewType: 'career_support',
        interviewCategory: 'career_path',
        bookingDate: date || '2024-12-25',
        startTime: '14:00',
        endTime: '15:00',
        status: 'scheduled'
      }
    ];
    
    const response = {
      success: true,
      bookings: date ? mockBookings.filter(b => b.bookingDate === date) : mockBookings,
      total: mockBookings.length,
      page: 1,
      totalPages: 1
    };
    
    logRequest('GET', { date }, response);
    return NextResponse.json(response);
    
  } catch (error) {
    const errorResponse = {
      success: false,
      error: 'Internal server error',
      code: 'E500'
    };
    logRequest('GET', null, errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE: 予約削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    
    if (!bookingId) {
      const errorResponse = {
        success: false,
        error: 'bookingId is required',
        code: 'E001'
      };
      logRequest('DELETE', { bookingId }, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    const successResponse = {
      success: true,
      message: `予約 ${bookingId} を削除しました`,
      deletedAt: new Date().toISOString()
    };
    
    logRequest('DELETE', { bookingId }, successResponse);
    return NextResponse.json(successResponse);
    
  } catch (error) {
    const errorResponse = {
      success: false,
      error: 'Internal server error',
      code: 'E500'
    };
    logRequest('DELETE', null, errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}