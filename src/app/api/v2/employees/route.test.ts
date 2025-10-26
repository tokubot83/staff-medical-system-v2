/**
 * 全職員取得API テスト
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.VOICEDRIVE_API_KEY || 'test-api-key';

describe('GET /api/v2/employees - 全職員取得API', () => {
  beforeAll(async () => {
    // テストデータのセットアップは既存のDBを使用
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('認証なし - 401エラー', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees`);
    expect(response.status).toBe(401);
  });

  it('不正なAPI Key - 401エラー', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees`, {
      headers: {
        'x-api-key': 'invalid-key'
      }
    });
    expect(response.status).toBe(401);
  });

  it('正常取得 - デフォルトページング', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('employees');
    expect(data).toHaveProperty('pagination');
    expect(Array.isArray(data.employees)).toBe(true);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(100);
  });

  it('ページング指定 - page=2, limit=50', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees?page=2&limit=50`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(50);
  });

  it('施設IDフィルタ - obara-hospital', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees?facilityId=obara-hospital`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    const allObara = data.employees.every((e: any) => e.facilityId === 'obara-hospital');
    expect(allObara).toBe(true);
  });

  it('ステータスフィルタ - active', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees?status=active`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    const allActive = data.employees.every((e: any) => e.isActive === true);
    expect(allActive).toBe(true);
  });

  it('updatedSinceフィルタ - 直近24時間', async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const response = await fetch(
      `${API_BASE_URL}/api/v2/employees?updatedSince=${encodeURIComponent(yesterday)}`,
      {
        headers: {
          'x-api-key': API_KEY
        }
      }
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    const allRecent = data.employees.every(
      (e: any) => new Date(e.updatedAt) >= new Date(yesterday)
    );
    expect(allRecent).toBe(true);
  });

  it('レスポンス形式検証', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees?limit=1`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    if (data.employees.length > 0) {
      const employee = data.employees[0];

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
      expect(employee).toHaveProperty('updatedAt');

      // 型チェック
      expect(typeof employee.employeeId).toBe('string');
      expect(typeof employee.name).toBe('string');
      expect(typeof employee.email).toBe('string');
      expect(typeof employee.permissionLevel).toBe('number');
      expect(typeof employee.isActive).toBe('boolean');
      expect(typeof employee.isRetired).toBe('boolean');
      expect(typeof employee.canPerformLeaderDuty).toBe('boolean');
    }
  });

  it('limit最大値チェック - 500件まで', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/employees?limit=1000`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.pagination.limit).toBe(500); // 500件でキャップされる
  });
});
