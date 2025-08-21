import { NextRequest, NextResponse } from 'next/server';

// V3評価システム 異議申し立て受信エンドポイント（VoiceDriveから）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Bearer Token認証の確認
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { message: '認証が必要です', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    
    // VoiceDrive APIキーの検証（実装時は環境変数から取得）
    const VOICEDRIVE_API_KEY = process.env.VOICEDRIVE_API_KEY || 'vd_dev_key_12345';
    if (token !== VOICEDRIVE_API_KEY) {
      return NextResponse.json(
        { success: false, error: '無効な認証トークンです' },
        { status: 401 }
      );
    }

    // リクエストボディの検証
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

    // 必須フィールドの検証
    if (!employeeId || !evaluationPeriod || !conversationId) {
      return NextResponse.json(
        { success: false, error: '必須フィールドが不足しています' },
        { status: 400 }
      );
    }

    // V3スコア構造の検証（オプショナル）
    if (scoreDetails) {
      const { technical, contribution, overall } = scoreDetails;
      if (!technical || !contribution || typeof overall !== 'number') {
        return NextResponse.json(
          { success: false, error: 'スコア構造が無効です' },
          { status: 400 }
        );
      }
    }

    // 異議申し立てIDの生成
    const appealId = `APL${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // 評価者の自動割り当て（実装時はDBから取得）
    const appealType = determineAppealType(appealReason, scoreDetails);
    const assignedTo = await assignEvaluator(employeeId, appealType);

    // 異議申し立てデータの構築
    const appealData = {
      appealId,
      employeeId,
      employeeName,
      evaluationPeriod,
      appealType,
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
      assignedTo,
      submittedVia: 'voicedrive',
      priority: calculatePriority(appealType, scoreDetails),
      estimatedResponseDate: calculateResponseDate()
    };

    // データベースに保存（実装時はDBサービスを使用）
    await saveAppealToDatabase(appealData);

    // 評価者への通知送信（実装時は通知サービスを使用）
    await notifyEvaluator(assignedTo, appealData);

    // 成功ログの記録
    console.log(`V3 Appeal received: ${appealId} from VoiceDrive conversation: ${conversationId}`);

    return NextResponse.json({
      success: true,
      appealId,
      message: '異議申立が受理されました',
      status: 'pending',
      estimatedResponseDate: appealData.estimatedResponseDate
    }, { status: 200 });

  } catch (error) {
    console.error('V3 Appeal submission error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'サーバーエラーが発生しました', 
          code: 'INTERNAL_ERROR',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        } 
      },
      { status: 500 }
    );
  }
}

// 評価者の自動割り当て
async function assignEvaluator(employeeId: string, appealType: string): Promise<string> {
  // 実装時は職員の所属部署・職種に基づいて適切な評価者を割り当て
  const evaluatorMapping: Record<string, string> = {
    'score_dispute': 'MGR001', // 技術評価担当者
    'relative_evaluation': 'MGR002', // 相対評価担当者
    'calculation_error': 'MGR003', // 人事担当者
    'default': 'MGR001'
  };
  
  return evaluatorMapping[appealType] || evaluatorMapping['default'];
}

// 異議申立タイプの判定
function determineAppealType(appealReason: string, scoreDetails: any): string {
  if (!appealReason) return 'general';
  
  const reasonLower = appealReason.toLowerCase();
  if (reasonLower.includes('技術評価')) return 'technical_score';
  if (reasonLower.includes('組織貢献')) return 'contribution_score';
  if (reasonLower.includes('相対評価')) return 'relative_evaluation';
  if (reasonLower.includes('計算')) return 'calculation_error';
  
  return 'general';
}

// 優先度の計算
function calculatePriority(appealType: string, scoreDetails: any): 'high' | 'medium' | 'low' {
  // スコアの乖離が大きい場合は高優先度
  if (scoreDetails?.overall && scoreDetails.overall <= 30) {
    return 'high';
  }
  
  // 相対評価の異議は中優先度
  if (appealType === 'relative_evaluation') {
    return 'medium';
  }
  
  return 'low';
}

// 回答予定日の計算
function calculateResponseDate(): string {
  const now = new Date();
  const responseDate = new Date(now);
  responseDate.setDate(now.getDate() + 21); // 3週間後
  return responseDate.toISOString().split('T')[0];
}

// データベース保存（モック実装）
async function saveAppealToDatabase(appealData: any): Promise<void> {
  // 実装時はPrismaやDBサービスを使用
  console.log('Saving appeal to database:', appealData.appealId);
  
  // localStorage への保存（開発用）
  if (typeof window !== 'undefined') {
    const existingAppeals = JSON.parse(localStorage.getItem('v3_appeals') || '[]');
    existingAppeals.push(appealData);
    localStorage.setItem('v3_appeals', JSON.stringify(existingAppeals));
  }
}

// 評価者への通知送信（モック実装）
async function notifyEvaluator(evaluatorId: string, appealData: any): Promise<void> {
  // 実装時はメール・Slack等の通知サービスを使用
  console.log(`Notifying evaluator ${evaluatorId} about appeal ${appealData.appealId}`);
  
  // 通知内容
  const notification = {
    to: evaluatorId,
    subject: `[V3評価システム] 新しい異議申し立て: ${appealData.appealId}`,
    body: `
職員ID: ${appealData.employeeId}
申し立て種類: ${appealData.appealType}
受信日時: ${appealData.receivedAt}
VoiceDrive会話ID: ${appealData.conversationId}
優先度: ${appealData.priority}

管理画面でご確認ください。
    `,
    source: 'v3_appeal_system',
    priority: appealData.priority
  };
  
  // 実際の通知送信はここで実装
}