/**
 * V3評価通知システム統合テスト
 * VoiceDriveとの連携テスト用
 */

import { describe, test, expect } from '@jest/globals';

const API_BASE_URL = 'http://localhost:3000/api';
const MCP_ENDPOINT = `${API_BASE_URL}/mcp-shared/evaluation-notifications`;
const VOICEDRIVE_ENDPOINT = 'http://localhost:5173/api/evaluation-notifications';

// テスト用認証キー
const MEDICAL_API_KEY = 'med_dev_key_67890';
const VOICEDRIVE_API_KEY = 'vd_dev_key_12345';

describe('V3評価通知システム連携テスト', () => {
  
  test('医療システム→VoiceDrive 夏季評価通知送信', async () => {
    const testNotification = {
      notifications: [{
        staffId: 'EMP001',
        staffName: 'テスト太郎',
        department: 'テスト部門',
        notificationType: 'summer_provisional',
        evaluationData: {
          facilityContribution: {
            points: 10.5,
            maxPoints: 12.5,
            grade: 'A',
            ranking: { position: 5, total: 50 }
          },
          corporateContribution: {
            points: 9.0,
            maxPoints: 12.5,
            grade: 'B',
            ranking: { position: 15, total: 200 }
          },
          provisionalData: {
            estimatedTotalScore: { min: 75, max: 85, current: 80 },
            confidence: 'medium'
          }
        }
      }],
      sendOptions: {
        immediate: true,
        batchSize: 1
      }
    };

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEDICAL_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Source-System': 'medical-staff-system',
        'X-Target-System': 'voicedrive'
      },
      body: JSON.stringify(testNotification)
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.notificationIds).toHaveLength(1);
  });

  test('VoiceDrive→医療システム 異議申立送信', async () => {
    const testAppeal = {
      employeeId: 'EMP001',
      employeeName: 'テスト太郎',
      evaluationPeriod: '2025_summer',
      conversationId: 'v3_conv_test_001',
      appealReason: '技術評価の結果について確認したい事項があります',
      appealDetails: '具体的な評価基準の適用について質問があります',
      scoreDetails: {
        technical: { coreItems: 25, facilityItems: 15, total: 40 },
        contribution: { 
          summerFacility: 10.5, summerCorporate: 9.0, 
          winterFacility: 0, winterCorporate: 0, total: 19.5 
        },
        overall: 59.5
      },
      relativeGrade: 'B',
      voiceDriveUserId: 'vd_user_001'
    };

    const response = await fetch(`${API_BASE_URL}/v3/appeals/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VOICEDRIVE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testAppeal)
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.appealId).toMatch(/^APL\d{8}\d{3}$/);
  });

  test('VoiceDrive通知受信確認', async () => {
    // VoiceDrive側の通知受信エンドポイントをテスト
    const response = await fetch(`${VOICEDRIVE_ENDPOINT}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MEDICAL_API_KEY}`
      }
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.status).toBe('healthy');
    expect(result.service).toBe('evaluation-notification-receiver');
  });

  test('認証エラーハンドリング', async () => {
    // 不正なトークンでのテスト
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid_token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notifications: [] })
    });

    expect(response.status).toBe(401);
    const result = await response.json();
    expect(result.success).toBe(false);
  });

  test('大量通知の一括送信', async () => {
    // 50件の通知を一括送信
    const bulkNotifications = Array.from({ length: 50 }, (_, i) => ({
      staffId: `EMP${String(i + 1).padStart(3, '0')}`,
      staffName: `テスト職員${i + 1}`,
      department: 'テスト部門',
      notificationType: 'winter_provisional',
      evaluationData: {
        facilityContribution: { points: 11.0, grade: 'A' },
        corporateContribution: { points: 10.0, grade: 'B' }
      }
    }));

    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEDICAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notifications: bulkNotifications,
        sendOptions: { batchSize: 10 }
      })
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.notificationIds).toHaveLength(50);
  });
});

// テスト実行用のヘルパー関数
export async function runIntegrationTests() {
  console.log('🧪 V3評価通知システム統合テスト開始...');
  
  // Jest環境でテストを実行
  // 実際の実行は npm test で行う
  
  console.log('✅ テスト準備完了');
  console.log('実行コマンド: npm run test:v3-integration');
}