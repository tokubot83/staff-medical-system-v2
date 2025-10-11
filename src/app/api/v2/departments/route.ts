/**
 * 部門マスタ取得API (GET /api/v2/departments)
 * OpenAPI仕様: organization-analytics_API仕様書_20251010.yaml
 *
 * Phase 1実装:
 * - 施設別フィルタリング対応
 * - isActiveフィルタは未実装（Phase 2で対応）
 * - VoiceDrive承認番号: VD-APPROVAL-2025-1010-001
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateApiKey } from '@/lib/middleware/api-key-auth';
import { checkRateLimit } from '@/lib/middleware/rate-limiter';

const prisma = new PrismaClient();

/**
 * 部門マスタ取得API
 *
 * @param request Next.jsリクエストオブジェクト
 * @returns 部門マスタ一覧
 */
export async function GET(request: NextRequest) {
  try {
    // API Key認証
    const authResult = validateApiKey(request);
    if (!authResult.success) {
      return authResult.error;
    }

    // Rate Limit検証
    const rateLimitResult = checkRateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitResult.error;
    }

    // クエリパラメータ取得
    const searchParams = request.nextUrl.searchParams;
    const facilityId = searchParams.get('facilityId');
    const isActive = searchParams.get('isActive');

    // バリデーション: isActiveパラメータ（Phase 1では未対応）
    if (isActive !== null) {
      return NextResponse.json(
        {
          error: {
            code: 'BAD_REQUEST',
            message: 'Invalid query parameter',
            details: 'isActive filter is not supported in Phase 1. Please use facilityId filter only.'
          }
        },
        {
          status: 400,
          headers: rateLimitResult.headers
        }
      );
    }

    // データベースクエリ条件構築
    const whereClause: any = {};

    if (facilityId) {
      whereClause.facilityId = facilityId;
    }

    // 部門マスタ取得
    const departments = await prisma.department.findMany({
      where: whereClause,
      orderBy: [
        { facilityId: 'asc' },
        { level: 'asc' },
        { code: 'asc' }
      ],
      include: {
        facility: {
          select: {
            code: true,
            name: true
          }
        }
      }
    });

    // レスポンス整形
    const response = {
      data: departments.map(dept => ({
        departmentId: dept.id,
        departmentCode: dept.code,
        departmentName: dept.name,
        facilityId: dept.facilityId,
        facilityCode: dept.facility.code,
        facilityName: dept.facility.name,
        parentDepartmentId: dept.parentId,
        level: dept.level,
        createdAt: dept.createdAt.toISOString(),
        updatedAt: dept.updatedAt.toISOString()
      })),
      meta: {
        total: departments.length,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: rateLimitResult.headers
    });

  } catch (error: any) {
    console.error('GET /api/v2/departments error:', error);

    // データベース接続エラー
    if (error.code === 'P2002' || error.code === 'P2021') {
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database error',
            details: 'Failed to fetch departments from database'
          }
        },
        { status: 500 }
      );
    }

    // その他のエラー
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
          details: error.message || 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}
