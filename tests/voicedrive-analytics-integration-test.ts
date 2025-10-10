/**
 * VoiceDrive Analytics API 統合テスト
 *
 * テスト内容:
 * 1. 環境設定確認
 * 2. VoiceDriveAnalyticsClient初期化
 * 3. ヘルスチェック
 * 4. GET /api/v1/analytics/aggregated-stats
 * 5. POST /api/v1/analytics/group-data
 * 6. エラーハンドリング
 *
 * 実行方法:
 * 1. VoiceDriveサーバーを起動（http://localhost:4000）
 * 2. .env.voicedrive.test を読み込む
 * 3. node --loader ts-node/esm tests/voicedrive-analytics-integration-test.ts
 *
 * 参照:
 * - mcp-shared/docs/Meeting_Minutes_20251009.md
 * - .env.voicedrive.test
 */

import dotenv from 'dotenv';
import path from 'path';
import { VoiceDriveAnalyticsClient } from '../src/services/VoiceDriveAnalyticsClient';
import {
  AggregatedStatsRequest,
  GroupAnalyticsRequest,
} from '../mcp-shared/interfaces/voicedrive-analytics-api.interface';

// .env.voicedrive.test を読み込む
const envPath = path.resolve(process.cwd(), '.env.voicedrive.test');
console.log(`📁 環境設定ファイル: ${envPath}`);
dotenv.config({ path: envPath });

// テスト結果カウンター
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * テストアサーション
 */
function assert(condition: boolean, message: string): void {
  totalTests++;
  if (condition) {
    console.log(`✅ ${message}`);
    passedTests++;
  } else {
    console.error(`❌ ${message}`);
    failedTests++;
  }
}

/**
 * テストセクション開始
 */
function section(title: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${title}`);
  console.log('='.repeat(60));
}

/**
 * メインテスト
 */
async function runIntegrationTest() {
  console.log('\n🚀 VoiceDrive Analytics API 統合テスト開始\n');
  console.log(`⏰ 実行日時: ${new Date().toISOString()}`);

  // =====================================
  // Test 1: 環境設定確認
  // =====================================
  section('Test 1: 環境設定確認');

  const apiUrl = process.env.VOICEDRIVE_ANALYTICS_API_URL;
  const jwtToken = process.env.VOICEDRIVE_JWT_TOKEN;
  const hmacSecret = process.env.VOICEDRIVE_HMAC_SECRET;

  console.log(`API URL: ${apiUrl}`);
  console.log(`JWT Token: ${jwtToken ? `${jwtToken.substring(0, 20)}...` : '(未設定)'}`);
  console.log(`HMAC Secret: ${hmacSecret ? `${hmacSecret.substring(0, 10)}...` : '(未設定)'}`);

  assert(!!apiUrl, 'VOICEDRIVE_ANALYTICS_API_URL が設定されている');
  assert(!!jwtToken, 'VOICEDRIVE_JWT_TOKEN が設定されている');
  assert(!!hmacSecret, 'VOICEDRIVE_HMAC_SECRET が設定されている');

  // =====================================
  // Test 2: クライアント初期化
  // =====================================
  section('Test 2: VoiceDriveAnalyticsClient 初期化');

  const client = new VoiceDriveAnalyticsClient({
    debug: true,
  });

  const config = client.getConfig();
  console.log('クライアント設定:', JSON.stringify(config, null, 2));

  assert(config.apiUrl === apiUrl, 'API URL が正しく設定されている');
  assert(config.jwtToken === jwtToken, 'JWT Token が正しく設定されている');
  assert(config.hmacSecret === hmacSecret, 'HMAC Secret が正しく設定されている');

  // =====================================
  // Test 3: ヘルスチェック
  // =====================================
  section('Test 3: ヘルスチェック');

  console.log('VoiceDriveサーバーへの接続を確認中...');
  const healthCheckResult = await client.healthCheck();

  if (healthCheckResult) {
    console.log('✅ VoiceDriveサーバーに接続成功');
    assert(true, 'ヘルスチェック成功');
  } else {
    console.warn('⚠️  VoiceDriveサーバーに接続できません');
    console.warn('   VoiceDriveサーバーが起動していることを確認してください');
    console.warn('   起動方法: cd ../voicedrive-v100 && npm run dev');
    assert(false, 'ヘルスチェック失敗（サーバー未起動の可能性）');

    // サーバー未起動の場合、以降のテストはスキップ
    printTestSummary();
    return;
  }

  // =====================================
  // Test 4: GET 集計データ取得
  // =====================================
  section('Test 4: GET /api/v1/analytics/aggregated-stats');

  // Test 4.1: 正常ケース（直近7日間）
  console.log('\n📊 Test 4.1: 直近7日間のデータ取得');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const getRequest: AggregatedStatsRequest = {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };

  console.log('リクエスト:', getRequest);

  const getResult = await client.getAggregatedStats(getRequest);

  console.log('レスポンス:', JSON.stringify(getResult, null, 2));

  assert(getResult.success, 'GET リクエスト成功');
  if (getResult.data) {
    assert(!!getResult.data.stats, 'データが返却されている');
    assert(!!getResult.data.privacyMetadata, 'プライバシーメタデータが含まれている');
    console.log(`📊 同意済みユーザー数: ${getResult.data.privacyMetadata?.consentedUsers || 0}`);
    console.log(`📊 総投稿数: ${getResult.data.stats?.totalPosts || 0}`);
  }

  // Test 4.2: バリデーションエラー（期間超過）
  console.log('\n📊 Test 4.2: バリデーションエラー（期間3ヶ月超過）');
  const invalidEndDate = new Date();
  const invalidStartDate = new Date();
  invalidStartDate.setDate(invalidStartDate.getDate() - 100);  // 100日前（3ヶ月超）

  const invalidRequest: AggregatedStatsRequest = {
    startDate: invalidStartDate.toISOString().split('T')[0],
    endDate: invalidEndDate.toISOString().split('T')[0],
  };

  const invalidResult = await client.getAggregatedStats(invalidRequest);

  assert(!invalidResult.success, 'バリデーションエラーが発生');
  assert(invalidResult.error?.code === 'DATE_RANGE_TOO_LONG', 'エラーコードが DATE_RANGE_TOO_LONG');
  console.log(`エラーメッセージ: ${invalidResult.error?.message}`);

  // =====================================
  // Test 5: POST グループ分析データ送信
  // =====================================
  section('Test 5: POST /api/v1/analytics/group-data');

  // Test 5.1: 基本統計のみ（LLM分析なし）
  console.log('\n📤 Test 5.1: 基本統計のみ送信');

  const postRequest: GroupAnalyticsRequest = {
    analysisDate: new Date().toISOString().split('T')[0],
    period: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    },
    postingTrends: {
      totalPosts: 120,
      totalUsers: 50,
      totalEligibleUsers: 45,
      participationRate: 90.0,
    },
    privacyMetadata: {
      totalConsentedUsers: 45,
      minimumGroupSize: 5,
      kAnonymityCompliant: true,
    },
    metadata: {
      sourceSystem: 'medical-staff-system',
      version: '1.0.0',
      generatedBy: 'integration-test',
      generatedAt: new Date().toISOString(),
      processingTime: 25.5,
    },
  };

  console.log('リクエスト:', JSON.stringify(postRequest, null, 2));

  const postResult = await client.sendGroupAnalytics(postRequest);

  console.log('レスポンス:', JSON.stringify(postResult, null, 2));

  assert(postResult.success, 'POST リクエスト成功');
  if (postResult.data) {
    assert(!!postResult.data.receivedAt, '受信日時が返却されている');
    assert(postResult.data.success === true, 'ステータスが success');
    console.log(`📥 受信日時: ${postResult.data.receivedAt}`);
    console.log(`📥 メッセージ: ${postResult.data.message}`);
  }

  // Test 5.2: LLM分析付き
  console.log('\n📤 Test 5.2: LLM分析付きデータ送信');

  const postRequestWithLLM: GroupAnalyticsRequest = {
    ...postRequest,
    sentimentAnalysis: {
      positive: 65,
      neutral: 40,
      negative: 15,
      averageConfidence: 0.92,
      distribution: {
        byDepartment: [
          {
            department: '看護部',
            positive: 30,
            neutral: 20,
            negative: 5,
          },
          {
            department: 'リハビリテーション部',
            positive: 35,
            neutral: 20,
            negative: 10,
          },
        ],
      },
    },
    topicAnalysis: {
      topKeywords: [
        { keyword: '夜勤シフト', count: 25, category: 'work', tfidfScore: 0.85 },
        { keyword: '患者対応', count: 20, category: 'work', tfidfScore: 0.78 },
        { keyword: '休憩時間', count: 15, category: 'welfare', tfidfScore: 0.65 },
      ],
      emergingTopics: [
        { topic: '新人教育制度', growthRate: 85.5, firstSeenDate: '2025-10-01', recentCount: 12, previousCount: 7 },
      ],
      byDepartment: [
        { department: '看護部', topTopics: ['夜勤', '患者ケア', '記録業務'] },
      ],
    },
    metadata: {
      ...postRequest.metadata,
      llmModel: 'Llama 3.2 8B Instruct',
    },
  };

  const postResultWithLLM = await client.sendGroupAnalytics(postRequestWithLLM);

  console.log('レスポンス:', JSON.stringify(postResultWithLLM, null, 2));

  assert(postResultWithLLM.success, 'LLM分析付きPOST リクエスト成功');

  // =====================================
  // Test 6: レート制限情報
  // =====================================
  section('Test 6: レート制限情報確認');

  if (getResult.rateLimit) {
    console.log('レート制限情報:', getResult.rateLimit);
    console.log(`  制限値: ${getResult.rateLimit.limit} リクエスト/時間`);
    console.log(`  残り: ${getResult.rateLimit.remaining} リクエスト`);
    console.log(`  リセット: ${new Date(getResult.rateLimit.reset * 1000).toISOString()}`);
    assert(getResult.rateLimit.limit > 0, 'レート制限情報が取得できている');
  } else {
    console.log('⚠️  レート制限情報が取得できませんでした（開発環境では正常）');
    assert(true, 'レート制限情報なし（開発環境OK）');
  }

  // =====================================
  // テスト結果サマリー
  // =====================================
  printTestSummary();
}

/**
 * テスト結果サマリー表示
 */
function printTestSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 テスト結果サマリー');
  console.log('='.repeat(60));
  console.log(`総テスト数: ${totalTests}`);
  console.log(`✅ 成功: ${passedTests}`);
  console.log(`❌ 失敗: ${failedTests}`);
  console.log(`📈 成功率: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('\n🎉 全てのテストが成功しました！\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  一部のテストが失敗しました\n');
    process.exit(1);
  }
}

// テスト実行
runIntegrationTest().catch((error) => {
  console.error('\n❌ テスト実行中にエラーが発生しました:', error);
  process.exit(1);
});
