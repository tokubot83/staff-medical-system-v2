/**
 * 個別職員取得API テスト
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.VOICEDRIVE_API_KEY || 'test-api-key';

describe('GET /api/v2/employees/{employeeId} - 個別職員取得API', () => {
  let testEmployeeId: string;

  beforeAll(async () => {
    // テスト用の職員IDを取得
    const employee = await prisma.employee.findFirst({
      select: { employeeCode: true }
    });
    if (employee) {
      testEmployeeId = employee.employeeCode;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('認証なし - 401エラー', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees/EMP-TEST-001`);
    expect(response.status).toBe(401);
  });

  it('不正なAPI Key - 401エラー', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees/EMP-TEST-001`, {
      headers: {
        'x-api-key': 'invalid-key'
      }
    });
    expect(response.status).toBe(401);
  });

  it('存在しない職員ID - 404エラー', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees/NONEXISTENT-ID`, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    expect(response.status).toBe(404);
  });

  it('正常取得 - 実在する職員ID', async () => {
    if (!testEmployeeId) {
      console.warn('[Test] No employee found in database, skipping test');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/v2/employees/${testEmployeeId}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const employee = await response.json();

    // 必須フィールド
    expect(employee).toHaveProperty('employeeId');
    expect(employee).toHaveProperty('name');
    expect(employee).toHaveProperty('email');
    expect(employee).toHaveProperty('department');
    expect(employee).toHaveProperty('position');
    expect(employee).toHaveProperty('facilityId');
    expect(employee).toHaveProperty('permissionLevel');
    expect(employee).toHaveProperty('accountType');
    expect(employee).toHaveProperty('canPerformLeaderDuty');
    expect(employee).toHaveProperty('parentId');
    expect(employee).toHaveProperty('isActive');
    expect(employee).toHaveProperty('isRetired');
    expect(employee).toHaveProperty('hireDate');
    expect(employee).toHaveProperty('yearsOfService');
    expect(employee).toHaveProperty('updatedAt');

    // 型チェック
    expect(typeof employee.employeeId).toBe('string');
    expect(typeof employee.name).toBe('string');
    expect(typeof employee.email).toBe('string');
    expect(typeof employee.permissionLevel).toBe('number');
    expect(typeof employee.isActive).toBe('boolean');
    expect(typeof employee.isRetired).toBe('boolean');
    expect(typeof employee.canPerformLeaderDuty).toBe('boolean');
    expect(typeof employee.yearsOfService).toBe('number');

    // 値の妥当性チェック
    expect(employee.employeeId).toBe(testEmployeeId);
    expect(employee.permissionLevel).toBeGreaterThanOrEqual(1);
    expect(employee.permissionLevel).toBeLessThanOrEqual(13);
    expect(employee.yearsOfService).toBeGreaterThanOrEqual(0);
  });

  it('勤続年数計算の妥当性チェック', async () => {
    if (!testEmployeeId) {
      console.warn('[Test] No employee found in database, skipping test');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/v2/employees/${testEmployeeId}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const employee = await response.json();

    if (employee.hireDate) {
      const hireDate = new Date(employee.hireDate);
      const now = new Date();
      const expectedYears = (now.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

      // 勤続年数が期待値±0.1年以内
      expect(Math.abs(employee.yearsOfService - expectedYears)).toBeLessThan(0.1);
    }
  });

  it('canPerformLeaderDutyフラグの妥当性チェック', async () => {
    if (!testEmployeeId) {
      console.warn('[Test] No employee found in database, skipping test');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/v2/employees/${testEmployeeId}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const employee = await response.json();

    // permissionLevel >= 8 の場合、canPerformLeaderDuty = true
    if (employee.permissionLevel >= 8) {
      expect(employee.canPerformLeaderDuty).toBe(true);
    } else {
      expect(employee.canPerformLeaderDuty).toBe(false);
    }
  });

  it('isActive/isRetiredフラグの妥当性チェック', async () => {
    if (!testEmployeeId) {
      console.warn('[Test] No employee found in database, skipping test');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/v2/employees/${testEmployeeId}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const employee = await response.json();

    // isRetired = true の場合、isActive = false
    if (employee.isRetired) {
      expect(employee.isActive).toBe(false);
    }

    // retirementDateが設定されている場合、isRetired = true
    if (employee.retirementDate) {
      expect(employee.isRetired).toBe(true);
    }
  });
});
