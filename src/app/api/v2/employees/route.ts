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
import { authenticateAndAuthorize } from '@/lib/middleware/jwt-auth';

const prisma = new PrismaClient();

/**
 * accountType → professionCategory 変換関数
 *
 * VoiceDrive側で期待される professionCategory 値:
 * - 'nursing': 看護職
 * - 'medical': 医師
 * - 'rehabilitation': リハビリ職
 * - 'administrative': 事務職
 * - 'support': サポート職
 * - 'management': 管理職
 * - 'other': その他
 */
function convertAccountTypeToProfessionCategory(accountType: string): string {
  const mapping: Record<string, string> = {
    // 看護職
    'NURSE': 'nursing',
    'NURSE_MANAGER': 'nursing',
    'NURSING_DIRECTOR': 'nursing',

    // 医師
    'DOCTOR': 'medical',
    'MEDICAL_DIRECTOR': 'medical',

    // 介護職
    'CARE_WORKER': 'nursing',
    'CARE_MANAGER': 'nursing',

    // リハビリ職
    'THERAPIST': 'rehabilitation',
    'PHYSICAL_THERAPIST': 'rehabilitation',
    'OCCUPATIONAL_THERAPIST': 'rehabilitation',
    'SPEECH_THERAPIST': 'rehabilitation',

    // 医療技術職
    'PHARMACIST': 'medical',
    'RADIOLOGIST': 'medical',
    'LAB_TECHNICIAN': 'medical',
    'DIETITIAN': 'support',
    'MEDICAL_SOCIAL_WORKER': 'support',

    // 事務職
    'ADMIN': 'administrative',
    'CLERK': 'administrative',

    // 経営層
    'CHAIRMAN': 'management',
    'DIRECTOR': 'management',
    'DEPARTMENT_HEAD': 'management',
    'MANAGER': 'management',
  };

  return mapping[accountType] || 'other';
}

/**
 * 全職員取得API
 *
 * 認証: Bearer Token（JWT）
 * 必要権限: Level 99（システム管理者）
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
    // JWT認証＆権限チェック（Level 99必須）
    const authResult = authenticateAndAuthorize(request, 99);
    if (!authResult.success) {
      return authResult.response!;
    }

    const user = authResult.user!;

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
      professionCategory: convertAccountTypeToProfessionCategory(e.position.accountType), // Phase 2.18: HomePage対応で実装完了
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
