/**
 * エグゼクティブダッシュボード API接続確認テスト
 *
 * 文書番号: ED-AUTH-2025-1019-001
 * 作成日: 2025年10月19日
 * 目的: VoiceDrive提供のAPIエンドポイントとの接続確認
 */

const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// 環境変数の確認
const VOICEDRIVE_API_URL = process.env.VOICEDRIVE_API_URL;
const VOICEDRIVE_BEARER_TOKEN = process.env.VOICEDRIVE_BEARER_TOKEN;
const VOICEDRIVE_HMAC_SECRET = process.env.VOICEDRIVE_HMAC_SECRET;

if (!VOICEDRIVE_API_URL || !VOICEDRIVE_BEARER_TOKEN || !VOICEDRIVE_HMAC_SECRET) {
  console.error('❌ 環境変数が設定されていません');
  console.error('必要な環境変数:');
  console.error('  - VOICEDRIVE_API_URL:', VOICEDRIVE_API_URL ? '✅' : '❌');
  console.error('  - VOICEDRIVE_BEARER_TOKEN:', VOICEDRIVE_BEARER_TOKEN ? '✅' : '❌');
  console.error('  - VOICEDRIVE_HMAC_SECRET:', VOICEDRIVE_HMAC_SECRET ? '✅' : '❌');
  process.exit(1);
}

console.log('📋 エグゼクティブダッシュボード API接続確認テスト');
console.log('='.repeat(60));
console.log('API URL:', VOICEDRIVE_API_URL);
console.log('Bearer Token:', VOICEDRIVE_BEARER_TOKEN.substring(0, 20) + '...');
console.log('HMAC Secret:', VOICEDRIVE_HMAC_SECRET.substring(0, 20) + '...');
console.log('='.repeat(60));
console.log('');

/**
 * HMAC署名生成関数
 */
function generateHMACSignature(timestamp, method, path, body) {
  const signatureString = `${timestamp}:${method}:${path}:${body}`;
  return crypto.createHmac('sha256', VOICEDRIVE_HMAC_SECRET).update(signatureString).digest('hex');
}

/**
 * テスト1: データ提供API接続確認
 * GET /api/v1/executive/dashboard-data
 */
async function testDataProvisionAPI() {
  console.log('🔍 テスト1: データ提供API接続確認');
  console.log('-'.repeat(60));

  try {
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM

    const response = await axios.get(
      `${VOICEDRIVE_API_URL}/api/v1/executive/dashboard-data`,
      {
        params: {
          period: currentPeriod,
          facilities: ['obara-hospital', 'tategami-rehabilitation']
        },
        headers: {
          'Authorization': `Bearer ${VOICEDRIVE_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ データ提供API: 成功');
    console.log('ステータスコード:', response.status);
    console.log('期間:', currentPeriod);
    console.log('施設数:', response.data.facilities?.length || 0);

    if (response.data.facilities && response.data.facilities.length > 0) {
      console.log('施設一覧:');
      response.data.facilities.forEach(facility => {
        console.log(`  - ${facility.facilityName} (${facility.facilityCode})`);
        if (facility.stats) {
          console.log(`    投稿数: ${facility.stats.totalPosts || 0}`);
          console.log(`    参加率: ${facility.stats.participationRate || 0}%`);
        }
      });
    }

    console.log('');
    return true;
  } catch (error) {
    console.error('❌ データ提供API: 失敗');
    if (error.response) {
      console.error('ステータスコード:', error.response.status);
      console.error('エラーメッセージ:', error.response.data);
    } else if (error.request) {
      console.error('リクエストエラー:', error.message);
      console.error('VoiceDriveサーバーが起動していない可能性があります');
    } else {
      console.error('エラー:', error.message);
    }
    console.log('');
    return false;
  }
}

/**
 * テスト2: 分析結果受信API接続確認
 * POST /api/v1/executive/strategic-insights
 */
async function testAnalysisResultAPI() {
  console.log('🔍 テスト2: 分析結果受信API接続確認');
  console.log('-'.repeat(60));

  try {
    const timestamp = Date.now();
    const method = 'POST';
    const path = '/api/v1/executive/strategic-insights';

    // テストデータ
    const testData = {
      analysisDate: new Date().toISOString(),
      period: new Date().toISOString().slice(0, 7),
      insights: [
        {
          insightType: 'priority_action',
          severity: 'high',
          title: '【テスト】参加率低下の警告',
          analysis: 'これはAPI接続確認用のテストデータです。',
          rootCause: 'テスト実行のため、実際の原因分析は含まれていません。',
          recommendedActions: [
            'API接続確認完了',
            '本番データ送信準備完了'
          ],
          bestPractice: null,
          predictions: null
        }
      ]
    };

    const body = JSON.stringify(testData);
    const signature = generateHMACSignature(timestamp, method, path, body);

    const response = await axios.post(
      `${VOICEDRIVE_API_URL}${path}`,
      testData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Timestamp': timestamp.toString(),
          'X-Signature': signature
        },
        timeout: 30000
      }
    );

    console.log('✅ 分析結果受信API: 成功');
    console.log('ステータスコード:', response.status);
    console.log('送信インサイト数:', testData.insights.length);
    console.log('HMAC署名:', signature.substring(0, 20) + '...');

    if (response.data) {
      console.log('レスポンス:', JSON.stringify(response.data, null, 2));
    }

    console.log('');
    return true;
  } catch (error) {
    console.error('❌ 分析結果受信API: 失敗');
    if (error.response) {
      console.error('ステータスコード:', error.response.status);
      console.error('エラーメッセージ:', error.response.data);

      // HMAC署名エラーの場合
      if (error.response.status === 401) {
        console.error('⚠️  HMAC署名検証エラーの可能性があります');
        console.error('VoiceDrive側のHMAC_SECRETと一致しているか確認してください');
      }
    } else if (error.request) {
      console.error('リクエストエラー:', error.message);
      console.error('VoiceDriveサーバーが起動していない可能性があります');
    } else {
      console.error('エラー:', error.message);
    }
    console.log('');
    return false;
  }
}

/**
 * メイン実行
 */
async function main() {
  const results = {
    dataProvisionAPI: false,
    analysisResultAPI: false
  };

  // テスト1: データ提供API
  results.dataProvisionAPI = await testDataProvisionAPI();

  // テスト2: 分析結果受信API
  results.analysisResultAPI = await testAnalysisResultAPI();

  // 結果サマリー
  console.log('='.repeat(60));
  console.log('📊 テスト結果サマリー');
  console.log('='.repeat(60));
  console.log(`データ提供API (GET): ${results.dataProvisionAPI ? '✅ 成功' : '❌ 失敗'}`);
  console.log(`分析結果受信API (POST): ${results.analysisResultAPI ? '✅ 成功' : '❌ 失敗'}`);
  console.log('');

  if (results.dataProvisionAPI && results.analysisResultAPI) {
    console.log('🎉 すべてのAPI接続確認が完了しました！');
    console.log('');
    console.log('次のステップ:');
    console.log('1. VoiceDriveチームへ接続確認完了を報告');
    console.log('2. 11月11日から本格的な実装作業を開始');
    console.log('');
    process.exit(0);
  } else {
    console.log('⚠️  一部のAPI接続に失敗しました');
    console.log('');
    console.log('確認事項:');
    console.log('1. VoiceDriveサーバーが起動しているか（localhost:3001）');
    console.log('2. 認証情報が正しく設定されているか（.env.local）');
    console.log('3. VoiceDriveチームに問い合わせ');
    console.log('');
    process.exit(1);
  }
}

// 実行
main().catch(error => {
  console.error('予期しないエラー:', error);
  process.exit(1);
});
