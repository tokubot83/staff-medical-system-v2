/**
 * 全職員取得API - VoiceDrive UserManagement連携用
 *
 * エンドポイント: GET /api/v2/employees
 *
 * 用途: VoiceDriveのUserManagementPageで全ユーザー一括同期時に使用
 * 認証: API Key認証
 * レート制限: 100 req/min/IP
 *
 * @see mcp-shared/docs/UserManagementPage_医療システム確認結果_20251026.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 全職員取得API
 *
 * クエリパラメータ:
 * - updatedSince: ISO 8601 DateTime (指定日時以降に更新された職員のみ取得)
 * - page: Number (ページ番号、デフォルト: 1)
 * - limit: Number (1ページあたりの件数、デフォルト: 100、最大: 500)
 * - facilityId: String (施設IDでフィルタ)
 * - status: String ('active', 'leave', 'retired')
 */
export async function GET(request: NextRequest) {
  try {
    // API Key認証チェック
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.VOICEDRIVE_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API Key' },
        { status: 401 }
      );
    }

    // クエリパラメータ解析
    const { searchParams } = new URL(request.url);
    const updatedSince = searchParams.get('updatedSince');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    const facilityId = searchParams.get('facilityId');
    const status = searchParams.get('status');

    // WHERE句構築
    const where: any = {};
    if (updatedSince) {
      where.updatedAt = { gte: new Date(updatedSince) };
    }
    if (facilityId) {
      where.facilityId = facilityId;
    }
    if (status) {
      where.status = status;
    }

    // 総件数取得
    const totalCount = await prisma.employee.count({ where });

    // 職員データ取得（JOIN込み）
    const employees = await prisma.employee.findMany({
      where,
      select: {
        employeeCode: true,
        name: true,
        email: true,
        department: {
          select: {
            name: true
          }
        },
        position: {
          select: {
            name: true,
            accountType: true
          }
        },
        facilityId: true,
        permissionLevel: true,
        supervisorId: true,
        status: true,
        retiredAt: true,
        hireDate: true,
        updatedAt: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });

    // VoiceDrive形式に変換
    const transformedEmployees = employees.map(e => ({
      employeeId: e.employeeCode,
      name: e.name,
      email: e.email,
      department: e.department.name,
      position: e.position.name,
      facilityId: e.facilityId,
      permissionLevel: e.permissionLevel,
      accountType: e.position.accountType,
      canPerformLeaderDuty: e.permissionLevel >= 8,
      professionCategory: null, // Phase 2で実装予定
      parentId: e.supervisorId,
      isActive: e.status === 'active' || e.status === 'leave',
      isRetired: e.status === 'retired',
      retirementDate: e.retiredAt,
      hireDate: e.hireDate,
      updatedAt: e.updatedAt
    }));

    return NextResponse.json({
      employees: transformedEmployees,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount
      }
    });

  } catch (error) {
    console.error('[API v2/employees] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
