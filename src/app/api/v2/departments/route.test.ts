/**
 * 部門マスタ取得APIのテスト
 */

import { NextRequest } from 'next/server';
import { GET } from './route';
import { PrismaClient } from '@prisma/client';
import { clearRateLimitStore } from '@/lib/middleware/rate-limiter';

// Prismaのモック
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    department: {
      findMany: jest.fn()
    }
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

const prisma = new PrismaClient();

describe('GET /api/v2/departments', () => {
  const originalEnv = process.env.ORGANIZATION_ANALYTICS_API_KEY;

  beforeEach(() => {
    // テスト用API Key設定
    process.env.ORGANIZATION_ANALYTICS_API_KEY = 'test-api-key-12345';
    clearRateLimitStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.ORGANIZATION_ANALYTICS_API_KEY = originalEnv;
    } else {
      delete process.env.ORGANIZATION_ANALYTICS_API_KEY;
    }
  });

  test('正常な部門マスタ取得', async () => {
    // モックデータ
    const mockDepartments = [
      {
        id: 'dept-001',
        code: 'D001',
        name: '内科',
        facilityId: 'facility-001',
        parentId: null,
        level: 1,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        facility: {
          code: 'F001',
          name: '小原病院'
        }
      },
      {
        id: 'dept-002',
        code: 'D002',
        name: '外科',
        facilityId: 'facility-001',
        parentId: null,
        level: 1,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        facility: {
          code: 'F001',
          name: '小原病院'
        }
      }
    ];

    (prisma.department.findMany as jest.Mock).mockResolvedValue(mockDepartments);

    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.100'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(2);
    expect(body.data[0]).toHaveProperty('departmentId', 'dept-001');
    expect(body.data[0]).toHaveProperty('departmentCode', 'D001');
    expect(body.data[0]).toHaveProperty('departmentName', '内科');
    expect(body.data[0]).toHaveProperty('facilityCode', 'F001');
    expect(body.meta).toHaveProperty('total', 2);
  });

  test('facilityIdフィルタによる絞り込み', async () => {
    const mockDepartments = [
      {
        id: 'dept-001',
        code: 'D001',
        name: '内科',
        facilityId: 'facility-001',
        parentId: null,
        level: 1,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        facility: {
          code: 'F001',
          name: '小原病院'
        }
      }
    ];

    (prisma.department.findMany as jest.Mock).mockResolvedValue(mockDepartments);

    const request = new NextRequest(
      'http://localhost/api/v2/departments?facilityId=facility-001',
      {
        headers: {
          'X-API-Key': 'test-api-key-12345',
          'X-Forwarded-For': '192.168.1.101'
        }
      }
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(prisma.department.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { facilityId: 'facility-001' }
      })
    );
  });

  test('isActiveパラメータはPhase 1で未対応（400エラー）', async () => {
    const request = new NextRequest(
      'http://localhost/api/v2/departments?isActive=true',
      {
        headers: {
          'X-API-Key': 'test-api-key-12345',
          'X-Forwarded-For': '192.168.1.102'
        }
      }
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('BAD_REQUEST');
    expect(body.error.details).toContain('isActive filter is not supported in Phase 1');
  });

  test('API Keyが無い場合は401エラー', async () => {
    const request = new NextRequest('http://localhost/api/v2/departments');

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  test('不正なAPI Keyで401エラー', async () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'invalid-key',
        'X-Forwarded-For': '192.168.1.103'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  test('Rate Limitヘッダーが返される', async () => {
    (prisma.department.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.104'
      }
    });

    const response = await GET(request);

    expect(response.headers.get('X-RateLimit-Limit')).toBe('100');
    expect(response.headers.get('X-RateLimit-Remaining')).toBeTruthy();
    expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
  });

  test('データベースエラー時は500エラー', async () => {
    (prisma.department.findMany as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.105'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_SERVER_ERROR');
  });

  test('空の結果が返される場合', async () => {
    (prisma.department.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.106'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(0);
    expect(body.meta.total).toBe(0);
  });
});
