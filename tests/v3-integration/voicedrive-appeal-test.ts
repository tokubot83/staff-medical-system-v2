// VoiceDrive統合テスト - V3異議申立フロー全体テスト
// 実行日: 2025-08-22
// 目的: VoiceDriveからの異議申立受信〜処理〜通知の全フロー検証

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const VOICEDRIVE_API_KEY = process.env.VOICEDRIVE_API_KEY || 'vd_dev_key_12345';

// テストデータ
const testData = {
  validAppeal: {
    employeeId: 'EMP001',
    employeeName: '山田太郎',
    evaluationPeriod: '2025年度上期',
    conversationId: 'conv_test_001',
    appealReason: '技術評価の施設固有項目について再評価を希望します',
    appealDetails: '具体的には、新規導入した医療機器の操作習得において、他職員への指導実績が評価に反映されていないと考えています。',
    scoreDetails: {
      technical: {
        corporate: 20,
        facility: 15,
        total: 35
      },
      contribution: {
        summerCorporate: 10,
        summerFacility: 8,
        winterCorporate: 0,
        winterFacility: 0,
        total: 18
      },
      overall: 53
    },
    relativeGrade: 'B',
    submittedAt: new Date().toISOString(),
    voiceDriveUserId: 'vd_user_001',
    attachments: []
  },
  invalidAppeal: {
    employeeId: '', // 必須フィールド欠落
    evaluationPeriod: '2025年度上期'
  },
  largeAppeal: {
    employeeId: 'EMP_PERF_001',
    employeeName: 'パフォーマンステスト用職員',
    evaluationPeriod: '2025年度上期',
    conversationId: 'conv_perf_001',
    appealReason: 'a'.repeat(5000), // 大量データ
    appealDetails: 'b'.repeat(10000),
    scoreDetails: {
      technical: { corporate: 25, facility: 25, total: 50 },
      contribution: { 
        summerCorporate: 12.5, 
        summerFacility: 12.5, 
        winterCorporate: 12.5, 
        winterFacility: 12.5, 
        total: 50 
      },
      overall: 100
    },
    relativeGrade: 'S+',
    submittedAt: new Date().toISOString(),
    voiceDriveUserId: 'vd_perf_001'
  }
};

describe('V3異議申立フロー統合テスト', () => {
  let appealIds: string[] = [];

  // テスト1: 正常な異議申立の受信
  describe('1. 異議申立フロー全体テスト', () => {
    test('1.1 正常な異議申立の送信と受信', async () => {
      const response = await fetch(`${BASE_URL}/api/v3/appeals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: JSON.stringify(testData.validAppeal)
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      
      expect(result.success).toBe(true);
      expect(result.appealId).toBeDefined();
      expect(result.message).toContain('受理されました');
      
      appealIds.push(result.appealId);
      console.log('✅ 正常な異議申立受信成功:', result.appealId);
    });

    test('1.2 受信した異議申立の一覧確認', async () => {
      const response = await fetch(`${BASE_URL}/api/v3/appeals/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        }
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      
      expect(result.appeals).toBeDefined();
      expect(Array.isArray(result.appeals)).toBe(true);
      
      const recentAppeal = result.appeals.find(a => 
        appealIds.includes(a.appealId)
      );
      expect(recentAppeal).toBeDefined();
      expect(recentAppeal.status).toBe('pending');
      
      console.log('✅ 異議申立一覧取得成功:', result.appeals.length, '件');
    });

    test('1.3 異議申立ステータス更新', async () => {
      if (appealIds.length === 0) {
        console.log('⚠️ テスト対象の異議申立IDがありません');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v3/appeals/list`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: JSON.stringify({
          appealId: appealIds[0],
          status: 'in_review',
          reviewerComment: '技術評価の再確認を開始します'
        })
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      
      expect(result.success).toBe(true);
      expect(result.notificationSent).toBe(true);
      
      console.log('✅ ステータス更新成功:', result);
    });
  });

  // テスト2: エラーハンドリング検証
  describe('2. エラーハンドリング検証', () => {
    test('2.1 認証なしのリクエスト拒否', async () => {
      const response = await fetch(`${BASE_URL}/api/v3/appeals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Authorization header なし
        },
        body: JSON.stringify(testData.validAppeal)
      });

      expect(response.status).toBe(401);
      const result = await response.json();
      expect(result.error).toContain('認証');
      
      console.log('✅ 無認証リクエスト正常拒否');
    });

    test('2.2 不正な認証トークン拒否', async () => {
      const response = await fetch(`${BASE_URL}/api/v3/appeals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid_token_12345'
        },
        body: JSON.stringify(testData.validAppeal)
      });

      expect(response.status).toBe(401);
      const result = await response.json();
      expect(result.error).toBeDefined();
      
      console.log('✅ 不正トークン正常拒否');
    });

    test('2.3 必須フィールド欠落の検証', async () => {
      const response = await fetch(`${BASE_URL}/api/v3/appeals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: JSON.stringify(testData.invalidAppeal)
      });

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.error).toContain('必須');
      
      console.log('✅ バリデーションエラー正常検出');
    });

    test('2.4 不正なJSONフォーマット処理', async () => {
      const response = await fetch(`${BASE_URL}/api/v3/appeals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: '{"invalid json": '
      });

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.error).toBeDefined();
      
      console.log('✅ 不正JSON正常処理');
    });

    test('2.5 存在しない異議申立ID更新エラー', async () => {
      const response = await fetch(`${BASE_URL}/api/v3/appeals/list`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: JSON.stringify({
          appealId: 'non_existent_id_999',
          status: 'approved'
        })
      });

      expect(response.status).toBe(404);
      const result = await response.json();
      expect(result.error).toContain('見つかりません');
      
      console.log('✅ 存在しないID更新エラー正常処理');
    });
  });

  // テスト3: パフォーマンステスト
  describe('3. パフォーマンステスト', () => {
    test('3.1 大量データ処理（5KB+10KB）', async () => {
      const startTime = Date.now();
      
      const response = await fetch(`${BASE_URL}/api/v3/appeals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: JSON.stringify(testData.largeAppeal)
      });

      const responseTime = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(3000); // 3秒以内
      
      const result = await response.json();
      appealIds.push(result.appealId);
      
      console.log(`✅ 大量データ処理成功: ${responseTime}ms`);
    });

    test('3.2 並行リクエスト処理（10件同時）', async () => {
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < 10; i++) {
        const appeal = {
          ...testData.validAppeal,
          employeeId: `EMP_CONCURRENT_${i}`,
          conversationId: `conv_concurrent_${i}`
        };
        
        promises.push(
          fetch(`${BASE_URL}/api/v3/appeals/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
            },
            body: JSON.stringify(appeal)
          })
        );
      }
      
      const responses = await Promise.all(promises);
      const responseTime = Date.now() - startTime;
      
      responses.forEach(res => {
        expect(res.status).toBe(200);
      });
      
      expect(responseTime).toBeLessThan(5000); // 5秒以内
      
      console.log(`✅ 10件並行処理成功: ${responseTime}ms`);
    });

    test('3.3 一覧取得レスポンス時間（100件想定）', async () => {
      const startTime = Date.now();
      
      const response = await fetch(`${BASE_URL}/api/v3/appeals/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(1000); // 1秒以内
      
      const result = await response.json();
      console.log(`✅ 一覧取得成功（${result.appeals.length}件）: ${responseTime}ms`);
    });
  });

  // テスト4: VoiceDrive連携確認
  describe('4. VoiceDrive連携機能確認', () => {
    test('4.1 会話ID重複チェック', async () => {
      const duplicateAppeal = {
        ...testData.validAppeal,
        conversationId: 'conv_test_001' // 既存と同じID
      };
      
      const response = await fetch(`${BASE_URL}/api/v3/appeals/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: JSON.stringify(duplicateAppeal)
      });
      
      // 重複は許可するが、警告を返す想定
      expect(response.status).toBe(200);
      const result = await response.json();
      
      if (result.warning) {
        console.log('⚠️ 会話ID重複警告:', result.warning);
      }
      
      console.log('✅ 会話ID処理確認完了');
    });

    test('4.2 VoiceDrive通知機能確認', async () => {
      if (appealIds.length === 0) {
        console.log('⚠️ テスト対象の異議申立IDがありません');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/v3/appeals/list`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`
        },
        body: JSON.stringify({
          appealId: appealIds[0],
          status: 'approved',
          reviewerComment: '再評価の結果、技術評価を5点加点します',
          scoreAdjustment: {
            technical: 5,
            contribution: 0
          }
        })
      });
      
      expect(response.status).toBe(200);
      const result = await response.json();
      
      expect(result.notificationSent).toBe(true);
      expect(result.voiceDriveResponse).toBeDefined();
      
      console.log('✅ VoiceDrive通知成功:', result.voiceDriveResponse);
    });
  });

  // クリーンアップ
  afterAll(async () => {
    console.log('\n=== テスト完了サマリー ===');
    console.log(`作成された異議申立数: ${appealIds.length}`);
    console.log('異議申立ID:', appealIds);
    console.log('========================\n');
  });
});

// エクスポート（他のテストから参照可能）
export { testData, BASE_URL, VOICEDRIVE_API_KEY };