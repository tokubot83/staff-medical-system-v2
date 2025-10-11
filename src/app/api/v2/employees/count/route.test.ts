/**
 * 職員数取得APIのテスト
 */

import { NextRequest } from 'next/server';
import { GET } from './route';
import { PrismaClient } from '@prisma/client';
import { clearRateLimitStore } from '@/lib/middleware/rate-limiter';

// Prismaのモック
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    employee: {
      count: jest.fn(),
      groupBy: jest.fn()
    },
    department: {
      findMany: jest.fn()
    }
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

const prisma = new PrismaClient();

describe('GET /api/v2/employees/count', () => {
  const originalEnv = process.env.ORGANIZATION_ANALYTICS_API_KEY;

  beforeEach(() => {
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

  test('正常な職員数取得', async () => {
    const mockTotalCount = 150;
    const mockDepartmentCounts = [
      {
        departmentId: 'dept-001',
        _count: { id: 50 }
      },
      {
        departmentId: 'dept-002',
        _count: { id: 100 }
      }
    ];
    const mockDepartments = [
      {
        id: 'dept-001',
        code: 'D001',
        name: '内科'
      },
      {
        id: 'dept-002',
        code: 'D002',
        name: '外科'
      }
    ];

    (prisma.employee.count as jest.Mock).mockResolvedValue(mockTotalCount);
    (prisma.employee.groupBy as jest.Mock).mockResolvedValue(mockDepartmentCounts);
    (prisma.department.findMany as jest.Mock).mockResolvedValue(mockDepartments);

    const request = new NextRequest('http://localhost/api/v2/employees/count', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.200'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.totalCount).toBe(150);
    expect(body.data.byDepartment).toHaveLength(2);
    expect(body.data.byDepartment[0]).toHaveProperty('departmentId', 'dept-001');
    expect(body.data.byDepartment[0]).toHaveProperty('departmentCode', 'D001');
    expect(body.data.byDepartment[0]).toHaveProperty('departmentName', '内科');
    expect(body.data.byDepartment[0]).toHaveProperty('count', 50);
  });

  test('facilityIdフィルタで絞り込み', async () => {
    (prisma.employee.count as jest.Mock).mockResolvedValue(50);
    (prisma.employee.groupBy as jest.Mock).mockResolvedValue([
      {
        departmentId: 'dept-001',
        _count: { id: 50 }
      }
    ]);
    (prisma.department.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'dept-001',
        code: 'D001',
        name: '内科'
      }
    ]);

    const request = new NextRequest(
      'http://localhost/api/v2/employees/count?facilityId=facility-001',
      {
        headers: {
          'X-API-Key': 'test-api-key-12345',
          'X-Forwarded-For': '192.168.1.201'
        }
      }
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.totalCount).toBe(50);
    expect(body.meta.filters.facilityId).toBe('facility-001');
    expect(prisma.employee.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'active',
          facilityId: 'facility-001'
        })
      })
    );
  });

  test('departmentIdフィルタで絞り込み', async () => {
    (prisma.employee.count as jest.Mock).mockResolvedValue(30);
    (prisma.employee.groupBy as jest.Mock).mockResolvedValue([
      {
        departmentId: 'dept-001',
        _count: { id: 30 }
      }
    ]);
    (prisma.department.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'dept-001',
        code: 'D001',
        name: '内科'
      }
    ]);

    const request = new NextRequest(
      'http://localhost/api/v2/employees/count?departmentId=dept-001',
      {
        headers: {
          'X-API-Key': 'test-api-key-12345',
          'X-Forwarded-For': '192.168.1.202'
        }
      }
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.totalCount).toBe(30);
    expect(body.meta.filters.departmentId).toBe('dept-001');
    expect(prisma.employee.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'active',
          departmentId: 'dept-001'
        })
      })
    );
  });

  test('facilityIdとdepartmentIdの両方でフィルタ', async () => {
    (prisma.employee.count as jest.Mock).mockResolvedValue(20);
    (prisma.employee.groupBy as jest.Mock).mockResolvedValue([
      {
        departmentId: 'dept-001',
        _count: { id: 20 }
      }
    ]);
    (prisma.department.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'dept-001',
        code: 'D001',
        name: '内科'
      }
    ]);

    const request = new NextRequest(
      'http://localhost/api/v2/employees/count?facilityId=facility-001&departmentId=dept-001',
      {
        headers: {
          'X-API-Key': 'test-api-key-12345',
          'X-Forwarded-For': '192.168.1.203'
        }
      }
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.meta.filters.facilityId).toBe('facility-001');
    expect(body.meta.filters.departmentId).toBe('dept-001');
    expect(prisma.employee.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'active',
          facilityId: 'facility-001',
          departmentId: 'dept-001'
        })
      })
    );
  });

  test('職員が0人の場合', async () => {
    (prisma.employee.count as jest.Mock).mockResolvedValue(0);
    (prisma.employee.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.department.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost/api/v2/employees/count', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.204'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.totalCount).toBe(0);
    expect(body.data.byDepartment).toHaveLength(0);
  });

  test('API Keyが無い場合は401エラー', async () => {
    const request = new NextRequest('http://localhost/api/v2/employees/count');

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  test('不正なAPI Keyで401エラー', async () => {
    const request = new NextRequest('http://localhost/api/v2/employees/count', {
      headers: {
        'X-API-Key': 'invalid-key',
        'X-Forwarded-For': '192.168.1.205'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  test('Rate Limitヘッダーが返される', async () => {
    (prisma.employee.count as jest.Mock).mockResolvedValue(0);
    (prisma.employee.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.department.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost/api/v2/employees/count', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.206'
      }
    });

    const response = await GET(request);

    expect(response.headers.get('X-RateLimit-Limit')).toBe('100');
    expect(response.headers.get('X-RateLimit-Remaining')).toBeTruthy();
    expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
  });

  test('データベースエラー時は500エラー', async () => {
    (prisma.employee.count as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new NextRequest('http://localhost/api/v2/employees/count', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.207'
      }
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('INTERNAL_SERVER_ERROR');
  });

  test('status=activeの職員のみカウント', async () => {
    (prisma.employee.count as jest.Mock).mockResolvedValue(100);
    (prisma.employee.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.department.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost/api/v2/employees/count', {
      headers: {
        'X-API-Key': 'test-api-key-12345',
        'X-Forwarded-For': '192.168.1.208'
      }
    });

    await GET(request);

    expect(prisma.employee.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'active'
        })
      })
    );
  });
});
