/**
 * Rate Limitミドルウェア
 * OpenAPI仕様: organization-analytics_API仕様書_20251010.yaml
 *
 * IPアドレスごとに100リクエスト/分を制限
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate Limit設定
 */
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分（ミリ秒）
const RATE_LIMIT_MAX_REQUESTS = 100; // 100リクエスト/分

/**
 * IPアドレスごとのリクエスト履歴
 */
interface RequestLog {
  count: number;
  resetTime: number;
}

/**
 * Rate Limitストレージ（メモリベース）
 * 本番環境ではRedis等の外部ストレージを推奨
 */
const rateLimitStore = new Map<string, RequestLog>();

/**
 * 期限切れのエントリーをクリーンアップ
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [ip, log] of rateLimitStore.entries()) {
    if (now >= log.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * クライアントIPアドレスを取得
 *
 * @param request Next.jsリクエストオブジェクト
 * @returns IPアドレス
 */
function getClientIp(request: NextRequest): string {
  // プロキシ経由の場合はX-Forwarded-Forヘッダーから取得
  const forwardedFor = request.headers.get('X-Forwarded-For');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // X-Real-IPヘッダーから取得
  const realIp = request.headers.get('X-Real-IP');
  if (realIp) {
    return realIp;
  }

  // フォールバック（開発環境用）
  return 'unknown';
}

/**
 * Rate Limit検証結果
 */
export interface RateLimitResult {
  success: boolean;
  headers: HeadersInit;
  error?: NextResponse;
}

/**
 * Rate Limitを検証する
 *
 * @param request Next.jsリクエストオブジェクト
 * @returns Rate Limit検証結果
 */
export function checkRateLimit(request: NextRequest): RateLimitResult {
  const clientIp = getClientIp(request);
  const now = Date.now();

  // 期限切れエントリーのクリーンアップ（定期的に実行）
  if (Math.random() < 0.01) {
    // 1%の確率でクリーンアップ
    cleanupExpiredEntries();
  }

  // 既存のログを取得または新規作成
  let requestLog = rateLimitStore.get(clientIp);

  if (!requestLog || now >= requestLog.resetTime) {
    // 新しいウィンドウを開始
    requestLog = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    };
    rateLimitStore.set(clientIp, requestLog);
  } else {
    // 既存のウィンドウ内でカウントアップ
    requestLog.count++;
  }

  // Rate Limitヘッダー
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestLog.count);
  const resetTime = Math.floor(requestLog.resetTime / 1000);

  const headers: HeadersInit = {
    'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString()
  };

  // Rate Limit超過チェック
  if (requestLog.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      success: false,
      headers,
      error: NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            details: `Rate limit of ${RATE_LIMIT_MAX_REQUESTS} requests per minute exceeded`
          }
        },
        {
          status: 429,
          headers
        }
      )
    };
  }

  // 成功
  return {
    success: true,
    headers
  };
}

/**
 * Rate Limitストアをクリア（テスト用）
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
