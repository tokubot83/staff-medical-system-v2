/**
 * JWT認証ミドルウェア - VoiceDrive API連携用
 *
 * 用途: VoiceDriveからのAPI呼び出し時にJWTトークンを検証
 * 認証方式: Bearer Token（JWT）
 *
 * @see mcp-shared/docs/UserManagementPage_医療システム確認結果_20251026.md
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * JWTペイロード型定義
 */
export interface JWTPayload {
  userId: string;
  employeeId: string;
  permissionLevel: number;
  iat: number;
  exp: number;
}

/**
 * リクエストにユーザー情報を追加する型拡張
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * JWT Secret Key（環境変数から取得）
 */
const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  console.warn('[JWT Auth] JWT_SECRET is not set in environment variables');
}

/**
 * JWT認証ミドルウェア関数
 *
 * @param request - NextRequest
 * @returns { authenticated: boolean, user?: JWTPayload, error?: string }
 */
export function authenticateJWT(request: NextRequest): {
  authenticated: boolean;
  user?: JWTPayload;
  error?: string;
} {
  // Authorization ヘッダー取得
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return {
      authenticated: false,
      error: 'Missing Authorization header'
    };
  }

  // Bearer Token形式チェック
  if (!authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      error: 'Invalid Authorization header format (expected: Bearer <token>)'
    };
  }

  // トークン抽出
  const token = authHeader.substring(7); // "Bearer "の後

  try {
    // JWT検証
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // 必須フィールドチェック
    if (!decoded.userId || !decoded.employeeId || typeof decoded.permissionLevel !== 'number') {
      return {
        authenticated: false,
        error: 'Invalid token payload (missing required fields)'
      };
    }

    return {
      authenticated: true,
      user: decoded
    };

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        authenticated: false,
        error: 'Token expired'
      };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return {
        authenticated: false,
        error: 'Invalid token'
      };
    } else {
      return {
        authenticated: false,
        error: 'Token verification failed'
      };
    }
  }
}

/**
 * 権限レベルチェック関数
 *
 * @param user - JWTペイロード
 * @param requiredLevel - 必要な権限レベル
 * @returns 権限があるかどうか
 */
export function checkPermissionLevel(user: JWTPayload, requiredLevel: number): boolean {
  return user.permissionLevel >= requiredLevel;
}

/**
 * Level 99（システム管理者）チェック関数
 *
 * @param user - JWTペイロード
 * @returns Level 99かどうか
 */
export function isSystemAdmin(user: JWTPayload): boolean {
  return user.permissionLevel === 99;
}

/**
 * JWT認証エラーレスポンス生成
 *
 * @param error - エラーメッセージ
 * @param status - HTTPステータスコード（デフォルト: 401）
 * @returns NextResponse
 */
export function createAuthErrorResponse(error: string, status: number = 401): NextResponse {
  return NextResponse.json(
    { error: `Unauthorized: ${error}` },
    { status }
  );
}

/**
 * JWT認証＆権限チェック統合関数
 *
 * @param request - NextRequest
 * @param requiredLevel - 必要な権限レベル（デフォルト: 99）
 * @returns { success: boolean, user?: JWTPayload, response?: NextResponse }
 */
export function authenticateAndAuthorize(
  request: NextRequest,
  requiredLevel: number = 99
): {
  success: boolean;
  user?: JWTPayload;
  response?: NextResponse;
} {
  // JWT認証
  const authResult = authenticateJWT(request);

  if (!authResult.authenticated) {
    return {
      success: false,
      response: createAuthErrorResponse(authResult.error || 'Authentication failed', 401)
    };
  }

  const user = authResult.user!;

  // 権限レベルチェック
  if (!checkPermissionLevel(user, requiredLevel)) {
    return {
      success: false,
      response: NextResponse.json(
        { error: `Forbidden: Permission level ${requiredLevel} required (current: ${user.permissionLevel})` },
        { status: 403 }
      )
    };
  }

  return {
    success: true,
    user
  };
}

/**
 * JWT生成関数（テスト用・管理用）
 *
 * @param payload - JWTペイロード
 * @param expiresIn - 有効期限（デフォルト: 1時間）
 * @returns JWT文字列
 */
export function generateJWT(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: string = '1h'
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
