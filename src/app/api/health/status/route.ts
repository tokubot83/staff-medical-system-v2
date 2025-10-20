import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 動的レンダリングを強制（ビルド時の静的生成をスキップ）
export const dynamic = 'force-dynamic'

/**
 * ヘルスチェックエンドポイント
 * VoiceDrive側の自動同期機能（Phase 3）で5分ごとに呼び出される
 *
 * GET /api/health/status
 */
export async function GET() {
  try {
    // データベース接続確認
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        api: 'healthy'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json({
      status: 'down',
      timestamp: new Date().toISOString(),
      services: {
        database: 'down',
        api: 'degraded'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}
