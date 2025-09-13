import { NextRequest, NextResponse } from 'next/server';
import { AIOptimizationEngine } from '@/services/ai-optimization-engine';
import {
  EnhancedInterviewRequest,
  AssistedBookingResponse
} from '@/types/pattern-d-interview';

/**
 * POST /api/interviews/assisted-booking
 * VoiceDriveからの「おまかせ予約」要求を受信・処理開始
 */
export async function POST(request: NextRequest) {
  try {
    const body: EnhancedInterviewRequest = await request.json();

    // 1. 基本バリデーション
    const validationError = validateAssistedBookingRequest(body);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError
        },
        { status: 400 }
      );
    }

    // 2. リクエストIDの生成
    const requestId = generateRequestId();

    // 3. AI最適化エンジンの初期化
    const aiEngine = new AIOptimizationEngine();

    // 4. バックグラウンドでAI最適化処理を開始
    // 非同期処理のため、すぐにレスポンスを返し、後で結果を通知
    const processingPromise = aiEngine.optimizeInterviewRequest(requestId, {
      ...body,
      requestId,
      timestamp: new Date().toISOString()
    }).then(result => {
      // 最適化完了後の処理
      notifyProcessingComplete(requestId, result);
    }).catch(error => {
      // エラー処理
      notifyProcessingError(requestId, error);
    });

    // 5. 処理時間の見積もり
    const estimatedTime = estimateProcessingTime(body);

    // 6. 即座にレスポンスを返す
    const response: AssistedBookingResponse = {
      requestId,
      status: 'accepted',
      estimatedCompletionTime: estimatedTime,
      fallbackOptions: [
        '即時予約への切り替え',
        '人事部直接相談 (内線1234)',
        '後日再試行'
      ],
      message: '面談候補の調整を開始しました。完了まで少々お待ちください。'
    };

    // 7. 処理状況の記録
    await logProcessingStart(requestId, body);

    return NextResponse.json({
      success: true,
      data: response
    }, { status: 202 }); // 202 Accepted - 処理受付完了

  } catch (error) {
    console.error('Assisted booking request failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'おまかせ予約の受付に失敗しました。即時予約をお試しください。'
    }, { status: 500 });
  }
}

/**
 * バリデーション関数
 */
function validateAssistedBookingRequest(body: EnhancedInterviewRequest): string | null {
  // 必須フィールドの確認
  const requiredFields = [
    'staffId', 'staffName', 'department', 'position',
    'type', 'urgencyLevel', 'timePreference'
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return `必須項目が不足しています: ${field}`;
    }
  }

  // 面談種別の確認
  if (!['regular', 'special', 'support'].includes(body.type)) {
    return '不正な面談種別です';
  }

  // 緊急度の確認
  if (!['urgent', 'this_week', 'next_week', 'this_month'].includes(body.urgencyLevel)) {
    return '不正な緊急度です';
  }

  // 時間帯希望の確認
  const { morning, afternoon, evening, anytime } = body.timePreference;
  if (!morning && !afternoon && !evening && !anytime) {
    return '時間帯希望を少なくとも1つ選択してください';
  }

  // 希望日程の確認
  if (body.preferredDates && body.preferredDates.length > 3) {
    return '希望日は最大3つまで選択可能です';
  }

  // 面談時間の確認
  if (body.minDuration && (body.minDuration < 15 || body.minDuration > 120)) {
    return '最短面談時間は15-120分で指定してください';
  }

  if (body.maxDuration && (body.maxDuration < 15 || body.maxDuration > 120)) {
    return '最長面談時間は15-120分で指定してください';
  }

  if (body.minDuration && body.maxDuration && body.minDuration > body.maxDuration) {
    return '最短時間が最長時間を上回っています';
  }

  return null;
}

/**
 * リクエストID生成
 */
function generateRequestId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `REQ-${timestamp}-${random}`;
}

/**
 * 処理時間見積もり
 */
function estimateProcessingTime(request: EnhancedInterviewRequest): string {
  // 緊急度に基づく見積もり
  switch (request.urgencyLevel) {
    case 'urgent':
      return '2-3分以内';
    case 'this_week':
      return '3-5分以内';
    case 'next_week':
    case 'this_month':
    default:
      return '5-7分以内';
  }
}

/**
 * 処理完了通知
 */
async function notifyProcessingComplete(requestId: string, result: any) {
  try {
    // WebSocket/SSEでVoiceDriveに通知
    await sendRealTimeUpdate(requestId, {
      status: 'proposals_ready',
      message: '面談候補をご用意しました。ご確認ください。',
      actionRequired: true
    });

    console.log(`AI optimization completed for request: ${requestId}`);
  } catch (error) {
    console.error('Failed to notify processing complete:', error);
  }
}

/**
 * 処理エラー通知
 */
async function notifyProcessingError(requestId: string, error: Error) {
  try {
    await sendRealTimeUpdate(requestId, {
      status: 'failed',
      message: 'AI最適化に失敗しました。即時予約をお試しください。',
      actionRequired: true,
      errorDetails: {
        code: 'AI_OPTIMIZATION_FAILED',
        message: error.message,
        retryable: true
      }
    });

    console.error(`AI optimization failed for request: ${requestId}`, error);
  } catch (notificationError) {
    console.error('Failed to notify processing error:', notificationError);
  }
}

/**
 * リアルタイム更新送信
 */
async function sendRealTimeUpdate(requestId: string, update: any) {
  // TODO: WebSocket/SSE実装
  // 現在はログ出力のみ
  console.log(`Real-time update for ${requestId}:`, update);

  // 将来的な実装例:
  // const wsClients = getWebSocketClients(requestId);
  // wsClients.forEach(client => client.send(JSON.stringify(update)));
}

/**
 * 処理開始ログ
 */
async function logProcessingStart(requestId: string, request: EnhancedInterviewRequest) {
  const logEntry = {
    requestId,
    timestamp: new Date().toISOString(),
    staffId: request.staffId,
    type: request.type,
    urgencyLevel: request.urgencyLevel,
    source: 'voicedrive',
    status: 'processing_started'
  };

  // TODO: ログDB保存
  console.log('Processing started:', logEntry);
}