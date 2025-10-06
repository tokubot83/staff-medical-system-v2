/**
 * アクセス制御変更履歴API
 * Level 99システム管理者専用
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getChangeLog,
  getChangeLogByResource,
  getRecentChanges,
} from '@/services/accessControlService';

// ================================================================================
// 認証ヘルパー（共通）
// ================================================================================

function isSystemAdmin(req: NextRequest): boolean {
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('Authorization')?.replace('Bearer ', '');
  if (apiKey && apiKey === process.env.SYSTEM_ADMIN_API_KEY) {
    return true;
  }
  return false;
}

function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      hint: 'Level 99システム管理者のみアクセス可能です。',
    },
    { status: 401 }
  );
}

// ================================================================================
// GET: 変更履歴の取得
// ================================================================================

export async function GET(req: NextRequest) {
  if (!isSystemAdmin(req)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('resourceId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let logs;

    if (resourceId) {
      logs = await getChangeLogByResource(resourceId, limit);
    } else {
      logs = await getChangeLog({ limit, offset });
    }

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
      mode: process.env.USE_MOCK_ACCESS_CONTROL === 'true' ? 'mock' : 'database',
    });
  } catch (error: any) {
    console.error('変更履歴の取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: '変更履歴の取得に失敗しました',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
