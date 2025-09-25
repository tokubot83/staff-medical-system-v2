/**
 * Webhook負荷テストスクリプト
 * Phase 3 Week 2 負荷テスト準備
 *
 * 使用方法:
 * node tests/load-test-webhook.js
 */

const http = require('http');

// テスト設定
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  concurrentUsers: 10,          // 同時接続ユーザー数
  requestsPerUser: 10,          // 各ユーザーのリクエスト数
  delayBetweenRequests: 100,    // リクエスト間の遅延（ms）
  timeout: 5000                 // タイムアウト（ms）
};

// テストデータ生成
function generateTestData() {
  const events = [
    'proposal.created',
    'proposal.escalated',
    'voting.completed',
    'committee.submitted',
    'system.health_check',
    'staff.permission_changed'
  ];

  const proposalIds = ['PROP001', 'PROP002', 'PROP003', 'PROP004', 'PROP005'];
  const staffIds = ['STAFF001', 'STAFF002', 'STAFF003', 'STAFF004', 'STAFF005', 'STAFF006', 'STAFF007', 'STAFF008', 'STAFF009', 'STAFF010'];

  const event = events[Math.floor(Math.random() * events.length)];
  const proposalId = proposalIds[Math.floor(Math.random() * proposalIds.length)];
  const staffId = staffIds[Math.floor(Math.random() * staffIds.length)];

  const testData = {
    event,
    timestamp: new Date().toISOString(),
    data: {}
  };

  // イベント種別に応じたデータ生成
  switch (event) {
    case 'proposal.created':
      testData.data = {
        proposalId,
        title: `負荷テスト提案_${Date.now()}`,
        submittedBy: staffId,
        department: '看護部'
      };
      break;

    case 'voting.completed':
      testData.data = {
        proposalId,
        totalVotes: Math.floor(Math.random() * 50) + 10,
        finalScore: Math.floor(Math.random() * 100) + 20,
        decision: Math.random() > 0.5 ? 'approved' : 'escalated'
      };
      break;

    case 'proposal.escalated':
      testData.data = {
        proposalId,
        fromLevel: Math.floor(Math.random() * 5) + 1,
        toLevel: Math.floor(Math.random() * 5) + 6,
        score: Math.floor(Math.random() * 200) + 100
      };
      break;

    case 'committee.submitted':
      testData.data = {
        proposalId,
        committee: '医療安全委員会',
        scheduledDate: new Date(Date.now() + 86400000 * 7).toISOString()
      };
      break;

    case 'system.health_check':
      testData.data = {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
      break;

    case 'staff.permission_changed':
      testData.data = {
        staffId,
        oldLevel: Math.floor(Math.random() * 10) + 1,
        newLevel: Math.floor(Math.random() * 10) + 1,
        reason: '昇進・配置転換'
      };
      break;
  }

  return testData;
}

// API権限レベル計算テスト
function testCalculateLevel(staffId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ staffId });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/calculate-level',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token_12345',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: TEST_CONFIG.timeout
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({
            success: true,
            responseTime,
            statusCode: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            success: false,
            responseTime,
            statusCode: res.statusCode,
            error: 'JSON Parse Error',
            rawData: data
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        responseTime: TEST_CONFIG.timeout,
        error: 'Timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// Webhookテスト
function testWebhook(testData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testData);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhook/voicedrive',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: TEST_CONFIG.timeout
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({
            success: true,
            responseTime,
            statusCode: res.statusCode,
            event: testData.event,
            data: parsed
          });
        } catch (e) {
          resolve({
            success: false,
            responseTime,
            statusCode: res.statusCode,
            event: testData.event,
            error: 'JSON Parse Error',
            rawData: data
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        responseTime: Date.now() - startTime,
        event: testData.event,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        responseTime: TEST_CONFIG.timeout,
        event: testData.event,
        error: 'Timeout'
      });
    });

    req.write(postData);
    req.end();
  });
}

// 単一ユーザーのテストシーケンス
async function runUserTest(userId) {
  const results = {
    userId,
    calculateLevel: [],
    webhook: [],
    startTime: Date.now(),
    endTime: null
  };

  const staffIds = ['STAFF001', 'STAFF002', 'STAFF003', 'STAFF004', 'STAFF005', 'STAFF006', 'STAFF007', 'STAFF008', 'STAFF009', 'STAFF010'];

  for (let i = 0; i < TEST_CONFIG.requestsPerUser; i++) {
    // API権限レベル計算テスト
    const staffId = staffIds[Math.floor(Math.random() * staffIds.length)];
    const calculateResult = await testCalculateLevel(staffId);
    results.calculateLevel.push(calculateResult);

    // Webhookテスト
    const testData = generateTestData();
    const webhookResult = await testWebhook(testData);
    results.webhook.push(webhookResult);

    // リクエスト間の遅延
    if (i < TEST_CONFIG.requestsPerUser - 1) {
      await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.delayBetweenRequests));
    }
  }

  results.endTime = Date.now();
  return results;
}

// 結果分析
function analyzeResults(allResults) {
  const analysis = {
    totalUsers: allResults.length,
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    responseTimes: {
      calculateLevel: [],
      webhook: []
    },
    errors: {
      calculateLevel: [],
      webhook: []
    },
    testDuration: 0
  };

  let minStartTime = Infinity;
  let maxEndTime = 0;

  for (const result of allResults) {
    minStartTime = Math.min(minStartTime, result.startTime);
    maxEndTime = Math.max(maxEndTime, result.endTime);

    // API権限レベル計算結果分析
    for (const calc of result.calculateLevel) {
      analysis.totalRequests++;
      if (calc.success) {
        analysis.successfulRequests++;
        analysis.responseTimes.calculateLevel.push(calc.responseTime);
      } else {
        analysis.failedRequests++;
        analysis.errors.calculateLevel.push(calc.error);
      }
    }

    // Webhook結果分析
    for (const webhook of result.webhook) {
      analysis.totalRequests++;
      if (webhook.success) {
        analysis.successfulRequests++;
        analysis.responseTimes.webhook.push(webhook.responseTime);
      } else {
        analysis.failedRequests++;
        analysis.errors.webhook.push(webhook.error);
      }
    }
  }

  analysis.testDuration = maxEndTime - minStartTime;

  // 統計計算
  const calcAvg = analysis.responseTimes.calculateLevel.reduce((a, b) => a + b, 0) / analysis.responseTimes.calculateLevel.length || 0;
  const webhookAvg = analysis.responseTimes.webhook.reduce((a, b) => a + b, 0) / analysis.responseTimes.webhook.length || 0;

  analysis.statistics = {
    calculateLevel: {
      average: Math.round(calcAvg),
      min: Math.min(...analysis.responseTimes.calculateLevel) || 0,
      max: Math.max(...analysis.responseTimes.calculateLevel) || 0,
      count: analysis.responseTimes.calculateLevel.length
    },
    webhook: {
      average: Math.round(webhookAvg),
      min: Math.min(...analysis.responseTimes.webhook) || 0,
      max: Math.max(...analysis.responseTimes.webhook) || 0,
      count: analysis.responseTimes.webhook.length
    },
    successRate: (analysis.successfulRequests / analysis.totalRequests * 100).toFixed(2) + '%'
  };

  return analysis;
}

// メイン実行
async function main() {
  console.log('🚀 Phase 3 Week 2 負荷テスト開始');
  console.log('📊 テスト設定:');
  console.log(`   - 同時接続ユーザー数: ${TEST_CONFIG.concurrentUsers}`);
  console.log(`   - ユーザー毎リクエスト数: ${TEST_CONFIG.requestsPerUser}`);
  console.log(`   - 総リクエスト数: ${TEST_CONFIG.concurrentUsers * TEST_CONFIG.requestsPerUser * 2} (API + Webhook)`);
  console.log(`   - リクエスト間隔: ${TEST_CONFIG.delayBetweenRequests}ms`);
  console.log('');

  const startTime = Date.now();

  // 同時実行
  const promises = [];
  for (let i = 0; i < TEST_CONFIG.concurrentUsers; i++) {
    promises.push(runUserTest(i + 1));
  }

  console.log('⏳ テスト実行中...');
  const allResults = await Promise.all(promises);

  const endTime = Date.now();
  const totalDuration = endTime - startTime;

  // 結果分析
  const analysis = analyzeResults(allResults);

  console.log('');
  console.log('✅ 負荷テスト完了');
  console.log('');
  console.log('📊 テスト結果サマリー:');
  console.log(`   - テスト時間: ${(totalDuration / 1000).toFixed(2)}秒`);
  console.log(`   - 総リクエスト数: ${analysis.totalRequests}`);
  console.log(`   - 成功リクエスト: ${analysis.successfulRequests}`);
  console.log(`   - 失敗リクエスト: ${analysis.failedRequests}`);
  console.log(`   - 成功率: ${analysis.statistics.successRate}`);
  console.log('');
  console.log('🔧 API権限レベル計算パフォーマンス:');
  console.log(`   - 平均応答時間: ${analysis.statistics.calculateLevel.average}ms`);
  console.log(`   - 最小応答時間: ${analysis.statistics.calculateLevel.min}ms`);
  console.log(`   - 最大応答時間: ${analysis.statistics.calculateLevel.max}ms`);
  console.log(`   - リクエスト数: ${analysis.statistics.calculateLevel.count}`);
  console.log('');
  console.log('📡 Webhookパフォーマンス:');
  console.log(`   - 平均応答時間: ${analysis.statistics.webhook.average}ms`);
  console.log(`   - 最小応答時間: ${analysis.statistics.webhook.min}ms`);
  console.log(`   - 最大応答時間: ${analysis.statistics.webhook.max}ms`);
  console.log(`   - リクエスト数: ${analysis.statistics.webhook.count}`);
  console.log('');

  if (analysis.failedRequests > 0) {
    console.log('❌ エラー詳細:');
    console.log('   - API計算エラー:', analysis.errors.calculateLevel);
    console.log('   - Webhookエラー:', analysis.errors.webhook);
    console.log('');
  }

  // 判定
  const apiAvg = analysis.statistics.calculateLevel.average;
  const webhookAvg = analysis.statistics.webhook.average;
  const successRate = parseFloat(analysis.statistics.successRate);

  console.log('🎯 Phase 3 Week 2 目標達成状況:');
  console.log(`   - API応答時間: ${apiAvg}ms ${apiAvg <= 100 ? '✅ 目標達成' : '❌ 目標未達成'} (目標: 100ms以下)`);
  console.log(`   - Webhook応答時間: ${webhookAvg}ms ${webhookAvg <= 500 ? '✅ 目標達成' : '❌ 目標未達成'} (目標: 500ms以下)`);
  console.log(`   - 成功率: ${successRate}% ${successRate >= 99 ? '✅ 目標達成' : '❌ 目標未達成'} (目標: 99%以上)`);
  console.log('');

  if (apiAvg <= 100 && webhookAvg <= 500 && successRate >= 99) {
    console.log('🎉 Phase 3 Week 2 負荷テスト: 全目標達成！');
  } else {
    console.log('⚠️  一部目標未達成。システム最適化が必要です。');
  }
}

// 実行
main().catch(console.error);