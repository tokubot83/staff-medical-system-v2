/**
 * 職員数取得API (GET /api/v2/employees/count)
 * OpenAPI仕様: organization-analytics_API仕様書_20251010.yaml
 *
 * Phase 1実装:
 * - 施設別・部門別カウント
 * - 雇用形態別カウント未対応（employmentTypeフィールド未実装）
 * - VoiceDrive承認番号: VD-APPROVAL-2025-1010-001
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validateApiKey } from '@/lib/middleware/api-key-auth';
import { checkRateLimit } from '@/lib/middleware/rate-limiter';

// 動的レンダリングを強制（ビルド時の静的生成をスキップ）
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient();

/**
 * 職員数取得API
 *
 * @param request Next.jsリクエストオブジェクト
 * @returns 職員数集計結果
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
    const departmentId = searchParams.get('departmentId');

    // データベースクエリ条件構築
    const whereClause: any = {
      status: 'active' // 在職中の職員のみカウント
    };

    if (facilityId) {
      whereClause.facilityId = facilityId;
    }

    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    // 全体カウント
    const totalCount = await prisma.employee.count({
      where: whereClause
    });

    // 部門別カウント
    const departmentCounts = await prisma.employee.groupBy({
      by: ['departmentId'],
      where: whereClause,
      _count: {
        id: true
      }
    });

    // 部門情報を取得（部門名を含める）
    const departmentIds = departmentCounts.map(dc => dc.departmentId);
    const departments = await prisma.department.findMany({
      where: {
        id: {
          in: departmentIds
        }
      },
      select: {
        id: true,
        code: true,
        name: true
      }
    });

    // 部門情報マッピング
    const departmentMap = new Map(
      departments.map(dept => [dept.id, dept])
    );

    // レスポンス整形
    const response = {
      data: {
        totalCount,
        byDepartment: departmentCounts.map(dc => {
          const dept = departmentMap.get(dc.departmentId);
          return {
            departmentId: dc.departmentId,
            departmentCode: dept?.code || 'UNKNOWN',
            departmentName: dept?.name || 'Unknown Department',
            count: dc._count.id
          };
        })
      },
      meta: {
        timestamp: new Date().toISOString(),
        filters: {
          facilityId: facilityId || null,
          departmentId: departmentId || null
        }
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: rateLimitResult.headers
    });

  } catch (error: any) {
    console.error('GET /api/v2/employees/count error:', error);

    // データベース接続エラー
    if (error.code === 'P2002' || error.code === 'P2021') {
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database error',
            details: 'Failed to fetch employee count from database'
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
