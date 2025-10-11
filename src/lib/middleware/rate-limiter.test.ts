/**
 * Rate Limitミドルウェアのテスト
 */

import { NextRequest } from 'next/server';
import { checkRateLimit, clearRateLimitStore } from './rate-limiter';

describe('Rate Limitミドルウェア', () => {
  beforeEach(() => {
    // テスト前にストアをクリア
    clearRateLimitStore();
  });

  afterEach(() => {
    clearRateLimitStore();
  });

  test('初回リクエストは成功', () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '192.168.1.100'
      }
    });

    const result = checkRateLimit(request);

    expect(result.success).toBe(true);
    expect(result.headers).toHaveProperty('X-RateLimit-Limit', '100');
    expect(result.headers).toHaveProperty('X-RateLimit-Remaining', '99');
    expect(result.headers).toHaveProperty('X-RateLimit-Reset');
    expect(result.error).toBeUndefined();
  });

  test('100リクエストまで成功', () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '192.168.1.101'
      }
    });

    // 100回リクエスト
    for (let i = 0; i < 100; i++) {
      const result = checkRateLimit(request);
      expect(result.success).toBe(true);
    }

    // 100回目のリクエスト後の残り回数確認
    const lastSuccessResult = checkRateLimit(
      new NextRequest('http://localhost/api/v2/departments', {
        headers: {
          'X-Forwarded-For': '192.168.1.101'
        }
      })
    );

    // 101回目なので失敗
    expect(lastSuccessResult.success).toBe(false);
  });

  test('101回目のリクエストで429エラー', async () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '192.168.1.102'
      }
    });

    // 100回成功
    for (let i = 0; i < 100; i++) {
      checkRateLimit(request);
    }

    // 101回目
    const result = checkRateLimit(request);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const response = result.error!;
    expect(response.status).toBe(429);

    const body = await response.json();
    expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(body.error.message).toBe('Too many requests');

    // Rate Limitヘッダーの確認
    expect(result.headers).toHaveProperty('X-RateLimit-Limit', '100');
    expect(result.headers).toHaveProperty('X-RateLimit-Remaining', '0');
  });

  test('異なるIPアドレスは独立してカウント', () => {
    const request1 = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '192.168.1.103'
      }
    });

    const request2 = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '192.168.1.104'
      }
    });

    // IP1で50回
    for (let i = 0; i < 50; i++) {
      checkRateLimit(request1);
    }

    // IP2で50回
    for (let i = 0; i < 50; i++) {
      checkRateLimit(request2);
    }

    // 両方とも成功（独立してカウント）
    const result1 = checkRateLimit(request1);
    const result2 = checkRateLimit(request2);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    // IP1の残り回数: 100 - 50 - 1 = 49
    expect(result1.headers).toHaveProperty('X-RateLimit-Remaining', '49');
    // IP2の残り回数: 100 - 50 - 1 = 49
    expect(result2.headers).toHaveProperty('X-RateLimit-Remaining', '49');
  });

  test('X-Real-IPヘッダーからIPアドレスを取得', () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Real-IP': '10.0.0.100'
      }
    });

    const result = checkRateLimit(request);

    expect(result.success).toBe(true);
  });

  test('X-Forwarded-Forが優先される', () => {
    const request1 = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '172.16.0.100',
        'X-Real-IP': '10.0.0.200'
      }
    });

    // 50回リクエスト
    for (let i = 0; i < 50; i++) {
      checkRateLimit(request1);
    }

    // 同じX-Forwarded-Forで追加リクエスト
    const request2 = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '172.16.0.100',
        'X-Real-IP': '10.0.0.999' // 異なるX-Real-IP
      }
    });

    const result = checkRateLimit(request2);

    expect(result.success).toBe(true);
    // 50 + 1 = 51回目なので残り49
    expect(result.headers).toHaveProperty('X-RateLimit-Remaining', '49');
  });

  test('Rate Limitヘッダーに正しい値が設定される', () => {
    const request = new NextRequest('http://localhost/api/v2/departments', {
      headers: {
        'X-Forwarded-For': '192.168.1.105'
      }
    });

    const result = checkRateLimit(request);

    expect(result.headers).toHaveProperty('X-RateLimit-Limit', '100');
    expect(result.headers).toHaveProperty('X-RateLimit-Remaining', '99');
    expect(result.headers).toHaveProperty('X-RateLimit-Reset');

    // Reset時刻は未来の時刻（Unix timestamp）
    const resetTime = parseInt(result.headers['X-RateLimit-Reset'] as string, 10);
    const now = Math.floor(Date.now() / 1000);
    expect(resetTime).toBeGreaterThan(now);
  });
});
