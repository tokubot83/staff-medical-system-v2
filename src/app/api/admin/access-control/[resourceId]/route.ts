/**
 * 特定リソースのアクセス制御設定API
 * Level 99システム管理者専用
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAccessControlConfig,
  updateAccessControl,
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
// GET: 特定リソースの設定を取得
// ================================================================================

export async function GET(
  req: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  if (!isSystemAdmin(req)) {
    return unauthorizedResponse();
  }

  try {
    const config = await getAccessControlConfig(params.resourceId);

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: `リソース ${params.resourceId} が見つかりません`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    console.error('アクセス制御設定の取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'アクセス制御設定の取得に失敗しました',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ================================================================================
// PUT: 設定の更新
// ================================================================================

export async function PUT(
  req: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  if (!isSystemAdmin(req)) {
    return unauthorizedResponse();
  }

  try {
    const body = await req.json();

    // 変更理由は必須
    if (!body.changeReason || body.changeReason.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: '変更理由は10文字以上で入力してください',
        },
        { status: 400 }
      );
    }

    // IPアドレスとUser-Agentを取得
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await updateAccessControl({
      resourceId: params.resourceId,
      minLevel: body.minLevel,
      specialAuthority: body.specialAuthority,
      requiresAssignment: body.requiresAssignment,
      description: body.description,
      isActive: body.isActive,
      changeReason: body.changeReason,
      changedBy: body.changedBy || 'SYSTEM_ADMIN',
      changedByName: body.changedByName,
      changedByLevel: 99,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'アクセス制御設定を更新しました',
      mode: process.env.USE_MOCK_ACCESS_CONTROL === 'true' ? 'mock' : 'database',
      warning: process.env.USE_MOCK_ACCESS_CONTROL === 'true'
        ? 'モックモードのため、変更は永続化されません。DB構築後は環境変数 USE_MOCK_ACCESS_CONTROL=false に設定してください。'
        : undefined,
    });
  } catch (error: any) {
    console.error('アクセス制御設定の更新エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'アクセス制御設定の更新に失敗しました',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
