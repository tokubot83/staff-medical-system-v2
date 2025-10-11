/**
 * API Key認証ミドルウェア
 * OpenAPI仕様: organization-analytics_API仕様書_20251010.yaml
 *
 * X-API-Keyヘッダーを検証し、不正な場合は401エラーを返す
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * API Key認証結果
 */
export interface ApiKeyAuthResult {
  success: boolean;
  error?: NextResponse;
}

/**
 * API Keyを検証する
 *
 * @param request Next.jsリクエストオブジェクト
 * @returns 認証結果
 */
export function validateApiKey(request: NextRequest): ApiKeyAuthResult {
  const apiKey = request.headers.get('X-API-Key');

  // API Keyヘッダーが存在しない場合
  if (!apiKey) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'API Key is required',
            details: 'X-API-Key header is missing'
          }
        },
        { status: 401 }
      )
    };
  }

  // 環境変数からAPI Keyを取得
  const validApiKey = process.env.ORGANIZATION_ANALYTICS_API_KEY;

  // 環境変数が設定されていない場合（開発環境での安全対策）
  if (!validApiKey) {
    console.error('ORGANIZATION_ANALYTICS_API_KEY is not set in environment variables');
    return {
      success: false,
      error: NextResponse.json(
        {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Server configuration error',
            details: 'API authentication is not properly configured'
          }
        },
        { status: 500 }
      )
    };
  }

  // API Keyが一致しない場合
  if (apiKey !== validApiKey) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid API Key',
            details: 'The provided API Key is not valid'
          }
        },
        { status: 401 }
      )
    };
  }

  // 認証成功
  return {
    success: true
  };
}
