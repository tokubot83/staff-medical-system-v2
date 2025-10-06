/**
 * アクセス制御マスター管理API
 * Level 99システム管理者専用
 *
 * VSCode/Claude Code経由でのアクセスをサポート：
 * - API Key認証（ヘッダー: X-API-Key）
 * - セッション認証（ブラウザ）
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAccessControlConfigs,
  getAccessControlConfigsByType,
  getAccessControlConfigsByCategory,
  clearCache,
} from '@/services/accessControlService';

// ================================================================================
// 認証ヘルパー
// ================================================================================

/**
 * Level 99システム管理者かどうかをチェック
 */
function isSystemAdmin(req: NextRequest): boolean {
  // API Key認証（VSCode/Claude Code経由）
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('Authorization')?.replace('Bearer ', '');
  if (apiKey && apiKey === process.env.SYSTEM_ADMIN_API_KEY) {
    return true;
  }

  // TODO: セッション認証（ブラウザ経由）
  // const session = await getSession(req);
  // if (session && session.user.accountLevel === 99) {
  //   return true;
  // }

  return false;
}

/**
 * 認証エラーレスポンス
 */
function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      hint: 'Level 99システム管理者のみアクセス可能です。API Key認証またはセッション認証が必要です。',
    },
    { status: 401 }
  );
}

// ================================================================================
// GET: アクセス制御設定の取得
// ================================================================================

export async function GET(req: NextRequest) {
  // 認証チェック
  if (!isSystemAdmin(req)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as 'tab' | 'page' | 'feature' | 'data' | null;
    const category = searchParams.get('category');

    let configs;

    if (type) {
      // リソースタイプで絞り込み
      configs = await getAccessControlConfigsByType(type);
    } else if (category) {
      // カテゴリで絞り込み
      configs = await getAccessControlConfigsByCategory(category);
    } else {
      // 全設定を取得
      const configsMap = await getAccessControlConfigs();
      configs = Array.from(configsMap.values());
    }

    return NextResponse.json({
      success: true,
      data: configs,
      count: configs.length,
      mode: process.env.USE_MOCK_ACCESS_CONTROL === 'true' ? 'mock' : 'database',
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
// DELETE: キャッシュのクリア
// ================================================================================

export async function DELETE(req: NextRequest) {
  // 認証チェック
  if (!isSystemAdmin(req)) {
    return unauthorizedResponse();
  }

  try {
    clearCache();

    return NextResponse.json({
      success: true,
      message: 'キャッシュをクリアしました',
    });
  } catch (error: any) {
    console.error('キャッシュクリアエラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'キャッシュのクリアに失敗しました',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
