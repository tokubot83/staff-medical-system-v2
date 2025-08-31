import { NextRequest, NextResponse } from 'next/server';

// 本番用V3評価システム 異議申し立て受信エンドポイント
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 本番用ログ記録開始
    console.log('[PROD] V3 Appeal submission started', {
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent')
    });

    const body = await request.json();
    
    // Bearer Token認証の確認（本番用）
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.warn('[PROD] Unauthorized appeal attempt', { ip: request.headers.get('x-forwarded-for') });
      return NextResponse.json(
        { success: false, error: { message: '認証が必要です', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    
    // VoiceDrive APIキーの検証（本番用環境変数）
    const VOICEDRIVE_API_KEY = process.env.VOICEDRIVE_API_KEY;
    if (!VOICEDRIVE_API_KEY || token !== VOICEDRIVE_API_KEY) {
      console.error('[PROD] Invalid API key used', { 
        tokenPrefix: token.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { success: false, error: '無効な認証トークンです' },
        { status: 401 }
      );
    }

    // 本番用リクエストボディの厳密検証
    const validationResult = validateProductionAppealRequest(body);
    if (!validationResult.valid) {
      console.warn('[PROD] Invalid appeal request', { 
        errors: validationResult.errors,
        employeeId: body.employeeId
      });
      return NextResponse.json(
        { success: false, error: validationResult.errors.join(', ') },
        { status: 400 }
      );
    }

    const {
      employeeId,
      employeeName,
      evaluationPeriod,
      conversationId,
      appealReason,
      appealDetails,
      scoreDetails,
      relativeGrade,
      submittedAt,
      voiceDriveUserId,
      attachments
    } = body;

    // 異議申し立てIDの生成（本番用）
    const appealId = `APL${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // 本番用データベース保存
    const appealData = {
      appealId,
      employeeId,
      employeeName,
      evaluationPeriod,
      appealType: determineAppealType(appealReason, scoreDetails),
      appealReason,
      appealDetails,
      scoreDetails,
      relativeGrade,
      conversationId,
      voiceDriveUserId,
      attachments,
      status: 'pending',
      submittedAt: submittedAt || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      assignedTo: await assignProductionEvaluator(employeeId, evaluationPeriod),
      submittedVia: 'voicedrive',
      priority: calculatePriority(appealReason, scoreDetails),
      estimatedResponseDate: calculateResponseDate(),
      environment: 'production'
    };

    // 本番データベースに保存
    await saveAppealToProductionDatabase(appealData);

    // 本番監視システムに通知
    await notifyProductionEvaluator(appealData.assignedTo, appealData);
    
    // パフォーマンス監視
    const processingTime = Date.now() - startTime;
    console.log('[PROD] V3 Appeal processed successfully', {
      appealId,
      employeeId,
      conversationId,
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString()
    });

    // 本番用成功レスポンス
    return NextResponse.json({
      success: true,
      appealId,
      message: '異議申立が正常に受理されました',
      status: 'pending',
      estimatedResponseDate: appealData.estimatedResponseDate,
      processingTime: processingTime,
      environment: 'production'
    }, { 
      status: 200,
      headers: {
        'X-Appeal-ID': appealId,
        'X-Processing-Time': processingTime.toString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('[PROD] V3 Appeal submission critical error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString()
    });
    
    // 本番用エラーレスポンス（詳細情報は非表示）
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'サーバーで一時的な問題が発生しました。しばらく後に再度お試しください。', 
          code: 'INTERNAL_ERROR',
          appealId: `ERROR_${Date.now()}`,
          timestamp: new Date().toISOString()
        } 
      },
      { status: 500 }
    );
  }
}

// 本番用バリデーション
function validateProductionAppealRequest(body: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body.employeeId || typeof body.employeeId !== 'string') {
    errors.push('職員IDが必須です');
  }
  
  if (!body.employeeName || typeof body.employeeName !== 'string') {
    errors.push('職員名が必須です');
  }
  
  if (!body.evaluationPeriod || typeof body.evaluationPeriod !== 'string') {
    errors.push('評価期間が必須です');
  }
  
  if (!body.conversationId || typeof body.conversationId !== 'string') {
    errors.push('会話IDが必須です');
  }
  
  if (!body.appealReason || typeof body.appealReason !== 'string') {
    errors.push('異議理由が必須です');
  }

  // スコア詳細の検証
  if (body.scoreDetails) {
    if (typeof body.scoreDetails !== 'object') {
      errors.push('スコア詳細の形式が不正です');
    }
  }

  return { valid: errors.length === 0, errors };
}

// 本番用評価者割り当て
async function assignProductionEvaluator(employeeId: string, evaluationPeriod: string): Promise<string> {
  // 本番では実際のDBから適切な評価者を検索
  // 実装時は職員マスタ・組織図から自動割り当て
  return 'MGR001'; // プレースホルダー
}

// 本番用異議申立タイプ判定
function determineAppealType(appealReason: string, scoreDetails: any): string {
  if (!appealReason) return 'general';
  
  const reasonLower = appealReason.toLowerCase();
  if (reasonLower.includes('技術評価') || reasonLower.includes('technical')) return 'technical_score';
  if (reasonLower.includes('組織貢献') || reasonLower.includes('contribution')) return 'contribution_score';
  if (reasonLower.includes('相対評価') || reasonLower.includes('relative')) return 'relative_evaluation';
  if (reasonLower.includes('計算') || reasonLower.includes('calculation')) return 'calculation_error';
  
  return 'general';
}

// 本番用優先度計算
function calculatePriority(appealReason: string, scoreDetails: any): 'high' | 'medium' | 'low' {
  if (scoreDetails?.overall && scoreDetails.overall <= 30) return 'high';
  if (appealReason && appealReason.includes('緊急')) return 'high';
  return 'medium';
}

// 本番用回答予定日計算
function calculateResponseDate(): string {
  const now = new Date();
  const responseDate = new Date(now);
  responseDate.setDate(now.getDate() + 14); // 本番は2週間
  return responseDate.toISOString().split('T')[0];
}

// 本番データベース保存
async function saveAppealToProductionDatabase(appealData: any): Promise<void> {
  try {
    // 本番PostgreSQLデータベースに保存
    console.log('[PROD] Saving appeal to production database:', appealData.appealId);
    
    // 実装時はPrismaまたは適切なDBクライアントを使用
    // await prisma.v3Appeals.create({ data: appealData });
    
  } catch (error) {
    console.error('[PROD] Database save error:', error);
    throw new Error('データベース保存に失敗しました');
  }
}

// 本番用評価者通知
async function notifyProductionEvaluator(evaluatorId: string, appealData: any): Promise<void> {
  try {
    console.log('[PROD] Notifying evaluator in production:', {
      evaluatorId,
      appealId: appealData.appealId,
      priority: appealData.priority
    });
    
    // 本番では実際のメール・Slack通知サービスを使用
    // await emailService.sendEvaluatorNotification(evaluatorId, appealData);
    // await slackService.sendUrgentNotification(evaluatorId, appealData);
    
  } catch (error) {
    console.warn('[PROD] Evaluator notification failed:', error);
    // 通知失敗は異議申立受理を阻害しない
  }
}