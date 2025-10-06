/**
 * 開発者監査ログAPI
 * Level 99/100の開発操作ログの記録・取得
 *
 * 認証: Level 99/100 または SYSTEM_ADMIN_API_KEY
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  logDeveloperOperation,
  getDeveloperAuditLogs,
  getCriticalOperations,
  getDeveloperAuditSummary,
  CreateDeveloperAuditLogParams,
  OperationType,
  OperationCategory,
  RiskLevel,
  ExecutionStatus,
} from '@/lib/audit/developerAuditLog';

// ================================================================================
// 認証ヘルパー
// ================================================================================

function isSystemAdmin(req: NextRequest): boolean {
  // API Key認証（VSCode/CLI用）
  const apiKey =
    req.headers.get('X-API-Key') ||
    req.headers.get('Authorization')?.replace('Bearer ', '');

  if (apiKey && apiKey === process.env.SYSTEM_ADMIN_API_KEY) {
    return true;
  }

  // TODO: セッション認証（ブラウザUI用）
  // const session = await getSession(req);
  // if (session?.user?.level === 99 || session?.user?.level === 100) {
  //   return true;
  // }

  return false;
}

function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized',
      message: 'Level 99/100またはシステム管理者のみアクセス可能です',
    },
    { status: 401 }
  );
}

// ================================================================================
// POST - 開発者操作を記録
// ================================================================================

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isSystemAdmin(req)) {
    return unauthorizedResponse();
  }

  try {
    const body = await req.json();

    // バリデーション
    if (!body.operatorId || !body.operationType || !body.operationSummary || !body.operationReason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'operatorId, operationType, operationSummary, operationReasonは必須です',
        },
        { status: 400 }
      );
    }

    if (body.operationReason.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: '操作理由は10文字以上で入力してください',
        },
        { status: 400 }
      );
    }

    // 操作者レベルチェック
    const operatorLevel = body.operatorLevel || 99;
    if (operatorLevel !== 99 && operatorLevel !== 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: '開発者監査ログはLevel 99または100のみが対象です',
        },
        { status: 400 }
      );
    }

    // リクエスト情報を追加
    const params: CreateDeveloperAuditLogParams = {
      operatorId: body.operatorId,
      operatorName: body.operatorName,
      operatorLevel,
      operatorEmail: body.operatorEmail,
      operationType: body.operationType as OperationType,
      operationCategory: (body.operationCategory as OperationCategory) || 'development',
      operationSummary: body.operationSummary,
      operationReason: body.operationReason,
      affectedResources: body.affectedResources,
      gitCommitHash: body.gitCommitHash,
      gitBranch: body.gitBranch,
      gitAuthor: body.gitAuthor,
      gitCommitMessage: body.gitCommitMessage,
      filesChanged: body.filesChanged,
      linesAdded: body.linesAdded,
      linesDeleted: body.linesDeleted,
      dbMigrationFile: body.dbMigrationFile,
      dbTablesAffected: body.dbTablesAffected,
      riskLevel: (body.riskLevel as RiskLevel) || 'medium',
      isReversible: body.isReversible !== undefined ? body.isReversible : true,
      rollbackPlan: body.rollbackPlan,
      environment: body.environment || 'production',
      executionMethod: body.executionMethod || 'api',
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
      sessionId: body.sessionId,
      executionStatus: (body.executionStatus as ExecutionStatus) || 'success',
      errorMessage: body.errorMessage,
      executionDurationMs: body.executionDurationMs,
    };

    const logId = await logDeveloperOperation(params);

    return NextResponse.json({
      success: true,
      message: '開発者操作を記録しました',
      data: { logId },
    });
  } catch (error: any) {
    console.error('開発者監査ログの記録に失敗しました:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error.message || '開発者監査ログの記録に失敗しました',
      },
      { status: 500 }
    );
  }
}

// ================================================================================
// GET - 開発者監査ログを取得
// ================================================================================

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isSystemAdmin(req)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(req.url);

    // クエリパラメータ
    const operatorId = searchParams.get('operatorId') || undefined;
    const operationType = (searchParams.get('operationType') as OperationType) || undefined;
    const operationCategory = (searchParams.get('operationCategory') as OperationCategory) || undefined;
    const riskLevel = (searchParams.get('riskLevel') as RiskLevel) || undefined;
    const executionStatus = (searchParams.get('executionStatus') as ExecutionStatus) || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // 'critical', 'summary'

    // 特殊クエリ
    if (type === 'critical') {
      const criticalOps = await getCriticalOperations(limit);
      return NextResponse.json({
        success: true,
        data: criticalOps,
        count: criticalOps.length,
      });
    }

    if (type === 'summary') {
      const summary = await getDeveloperAuditSummary({ operatorId });
      return NextResponse.json({
        success: true,
        data: summary,
      });
    }

    // 日付フィルター
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (searchParams.get('startDate')) {
      startDate = new Date(searchParams.get('startDate')!);
    }

    if (searchParams.get('endDate')) {
      endDate = new Date(searchParams.get('endDate')!);
    }

    // 通常のログ取得
    const logs = await getDeveloperAuditLogs({
      operatorId,
      operationType,
      operationCategory,
      riskLevel,
      executionStatus,
      limit,
      offset,
      startDate,
      endDate,
    });

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error: any) {
    console.error('開発者監査ログの取得に失敗しました:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error.message || '開発者監査ログの取得に失敗しました',
      },
      { status: 500 }
    );
  }
}
