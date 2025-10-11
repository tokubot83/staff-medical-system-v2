/**
 * API Key認証ミドルウェアのテスト
 */

import { NextRequest } from 'next/server';
import { validateApiKey } from './api-key-auth';

describe('API Key認証ミドルウェア', () => {
  const originalEnv = process.env.ORGANIZATION_ANALYTICS_API_KEY;

  beforeEach(() => {
    // テスト用API Keyを設定
    process.env.ORGANIZATION_ANALYTICS_API_KEY = 'test-api-key-12345';
  });

  afterEach(() => {
    // 環境変数を復元
    if (originalEnv) {
      process.env.ORGANIZATION_ANALYTICS_API_KEY = originalEnv;
    } else {
      delete process.env.ORGANIZATION_ANALYTICS_API_KEY;
    }
  });

  test('正しいAPI Keyで認証成功', () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'test-api-key-12345'
      }
    });

    const result = validateApiKey(request);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('API Keyヘッダーが存在しない場合は401エラー', async () => {
    const request = new NextRequest('http://localhost/api/v2/departments');

    const result = validateApiKey(request);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const response = result.error!;
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toBe('API Key is required');
  });

  test('不正なAPI Keyで401エラー', async () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'invalid-api-key'
      }
    });

    const result = validateApiKey(request);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const response = result.error!;
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toBe('Invalid API Key');
  });

  test('環境変数が設定されていない場合は500エラー', async () => {
    delete process.env.ORGANIZATION_ANALYTICS_API_KEY;

    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'test-api-key-12345'
      }
    });

    const result = validateApiKey(request);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const response = result.error!;
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.error.code).toBe('INTERNAL_SERVER_ERROR');
  });

  test('大文字小文字を区別する', async () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-API-Key': 'TEST-API-KEY-12345' // 大文字
      }
    });

    const result = validateApiKey(request);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const response = result.error!;
    expect(response.status).toBe(401);
  });
});
