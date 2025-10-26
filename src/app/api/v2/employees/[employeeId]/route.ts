/**
 * 個別職員取得API - VoiceDrive UserManagement連携用
 *
 * エンドポイント: GET /api/v2/employees/{employeeId}
 *
 * 用途: VoiceDriveのUserManagementPageで個別ユーザー同期時に使用
 * 認証: API Key認証
 * レート制限: 100 req/min/IP
 *
 * @see mcp-shared/docs/UserManagementPage_医療システム確認結果_20251026.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 個別職員取得API
 *
 * パスパラメータ:
 * - employeeId: String (職員ID = employeeCode)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    // API Key認証チェック
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.VOICEDRIVE_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API Key' },
        { status: 401 }
      );
    }

    const { employeeId } = params;

    // 職員データ取得（JOIN込み）
    const employee = await prisma.employee.findUnique({
      where: { employeeCode: employeeId },
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
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // 勤続年数計算（年単位、小数点1桁）
    const yearsOfService = employee.hireDate
      ? (Date.now() - employee.hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      : 0;

    // VoiceDrive形式に変換
    return NextResponse.json({
      employeeId: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      department: employee.department.name,
      position: employee.position.name,
      facilityId: employee.facilityId,
      permissionLevel: employee.permissionLevel,
      accountType: employee.position.accountType,
      canPerformLeaderDuty: employee.permissionLevel >= 8,
      professionCategory: null, // Phase 2で実装予定
      parentId: employee.supervisorId,
      isActive: employee.status === 'active' || employee.status === 'leave',
      isRetired: employee.status === 'retired',
      retirementDate: employee.retiredAt,
      hireDate: employee.hireDate,
      yearsOfService: parseFloat(yearsOfService.toFixed(1)),
      updatedAt: employee.updatedAt
    });

  } catch (error) {
    console.error(`[API v2/employees/${params.employeeId}] Error:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
