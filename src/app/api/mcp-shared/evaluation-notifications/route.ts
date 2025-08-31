import { NextRequest, NextResponse } from 'next/server';
import { VoiceDriveNotificationService } from '@/services/voiceDriveNotificationService';

// VoiceDriveへの評価通知送信エンドポイント
export async function POST(request: NextRequest) {
  try {
    // 認証確認
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    const MEDICAL_SYSTEM_API_KEY = process.env.MEDICAL_SYSTEM_API_KEY || 'med_dev_key_67890';
    
    if (token !== MEDICAL_SYSTEM_API_KEY) {
      return NextResponse.json(
        { success: false, error: '無効な認証トークンです' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notifications, sendOptions } = body;

    // VoiceDriveに通知を送信
    const response = await VoiceDriveNotificationService.sendEvaluationNotification({
      staffIds: notifications.map((n: any) => n.staffId),
      notificationType: notifications[0]?.notificationType || 'summer_provisional',
      evaluationYear: new Date().getFullYear(),
      sendOptions
    });

    // 送信ログを記録
    console.log('評価通知送信完了:', {
      count: notifications.length,
      success: response.success,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('評価通知送信エラー:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'サーバーエラーが発生しました',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// テスト用GETエンドポイント
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    service: 'evaluation-notification-service',
    version: 'v3',
    timestamp: new Date().toISOString()
  });
}