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
 * 個別職員取得API
 *
 * 認証: Bearer Token（JWT）
 * 必要権限: Level 99（システム管理者）
 *
 * パスパラメータ:
 * - employeeId: String (職員ID = employeeCode)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    // JWT認証＆権限チェック（Level 99必須）
    const authResult = authenticateAndAuthorize(request, 99);
    if (!authResult.success) {
      return authResult.response!;
    }

    const user = authResult.user!;

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

    // professionCategory変換（accountType → professionCategory）
    const professionCategory = convertAccountTypeToProfessionCategory(employee.position.accountType);

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
      professionCategory: professionCategory, // Phase 2.18: HomePage対応で実装完了
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
